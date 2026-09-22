import { SeededRNG } from '@/utils/rng';
import type {
  DistanceMetric,
  KnnConfig,
  KnnNeighbor,
  KnnPrediction,
  DecisionGrid2D,
  CurseOfDimensionalityResult,
} from './types';

/**
 * Compute the distance between two vectors using the specified metric.
 */
export function computeDistance(
  a: number[],
  b: number[],
  metric: DistanceMetric = 'euclidean',
  p: number = 3
): number {
  if (a.length !== b.length) {
    throw new Error(`Vector dimension mismatch: ${a.length} vs ${b.length}`);
  }

  const d = a.length;
  if (d === 0) return 0;

  switch (metric) {
    case 'euclidean': {
      let sumSq = 0;
      for (let i = 0; i < d; i++) {
        const diff = (a[i] ?? 0) - (b[i] ?? 0);
        sumSq += diff * diff;
      }
      return Math.sqrt(sumSq);
    }
    case 'manhattan': {
      let sumAbs = 0;
      for (let i = 0; i < d; i++) {
        sumAbs += Math.abs((a[i] ?? 0) - (b[i] ?? 0));
      }
      return sumAbs;
    }
    case 'chebyshev': {
      let maxDiff = 0;
      for (let i = 0; i < d; i++) {
        const diff = Math.abs((a[i] ?? 0) - (b[i] ?? 0));
        if (diff > maxDiff) maxDiff = diff;
      }
      return maxDiff;
    }
    case 'minkowski': {
      if (p <= 0) {
        throw new Error('Minkowski parameter p must be greater than 0');
      }
      let sumPow = 0;
      for (let i = 0; i < d; i++) {
        sumPow += Math.pow(Math.abs((a[i] ?? 0) - (b[i] ?? 0)), p);
      }
      return Math.pow(sumPow, 1 / p);
    }
    default: {
      throw new Error(`Unknown distance metric: ${String(metric)}`);
    }
  }
}

/**
 * Perform k-NN classification for a single query point.
 */
export function predictKnn(
  trainPoints: number[][],
  trainLabels: number[],
  queryPoint: number[],
  config: KnnConfig
): KnnPrediction {
  const { k, metric = 'euclidean', p = 3, weightByDistance = false } = config;

  if (trainPoints.length === 0 || trainLabels.length === 0) {
    throw new Error('Training dataset cannot be empty');
  }
  if (trainPoints.length !== trainLabels.length) {
    throw new Error(
      `Samples count (${trainPoints.length}) does not match labels count (${trainLabels.length})`
    );
  }
  if (k < 1) {
    throw new Error('k must be at least 1');
  }

  // Calculate distances for all training samples
  const allNeighbors: KnnNeighbor[] = trainPoints.map((pt, idx) => {
    const dist = computeDistance(pt, queryPoint, metric, p);
    const weight = weightByDistance ? 1 / (dist + 1e-6) : 1.0;
    return {
      index: idx,
      point: pt,
      label: trainLabels[idx] ?? 0,
      distance: dist,
      weight,
    };
  });

  // Sort by distance ascending, tie-breaking by index for strict determinism
  allNeighbors.sort((a, b) => {
    if (Math.abs(a.distance - b.distance) < 1e-9) {
      return a.index - b.index;
    }
    return a.distance - b.distance;
  });

  const effectiveK = Math.min(k, allNeighbors.length);
  const selectedNeighbors = allNeighbors.slice(0, effectiveK);

  // Accumulate weighted votes per class
  const classWeights: Record<number, number> = {};
  let totalWeight = 0;

  for (const neighbor of selectedNeighbors) {
    const label = neighbor.label;
    classWeights[label] = (classWeights[label] ?? 0) + neighbor.weight;
    totalWeight += neighbor.weight;
  }

  // Compute probabilities
  const probabilities: Record<number, number> = {};
  for (const [classStr, weight] of Object.entries(classWeights)) {
    const classNum = Number(classStr);
    probabilities[classNum] = totalWeight > 0 ? weight / totalWeight : 0;
  }

  // Determine winning class
  let maxWeight = -1;
  let predictedClass = selectedNeighbors[0]?.label ?? 0;

  // For deterministic tie-breaking, sort classes ascending
  const classes = Object.keys(classWeights)
    .map(Number)
    .sort((a, b) => a - b);

  for (const c of classes) {
    const w = classWeights[c] ?? 0;
    if (w > maxWeight) {
      maxWeight = w;
      predictedClass = c;
    }
  }

  return {
    predictedClass,
    probabilities,
    neighbors: selectedNeighbors,
  };
}

/**
 * Compute 2D decision boundary grid over the specified bounding box.
 */
export function computeDecisionGrid(
  trainPoints: number[][],
  trainLabels: number[],
  bounds: { xMin: number; xMax: number; yMin: number; yMax: number },
  resolution: number,
  config: KnnConfig
): DecisionGrid2D {
  const { xMin, xMax, yMin, yMax } = bounds;
  const xStep = (xMax - xMin) / resolution;
  const yStep = (yMax - yMin) / resolution;

  const xCoords: number[] = [];
  const yCoords: number[] = [];

  for (let i = 0; i <= resolution; i++) {
    xCoords.push(xMin + i * xStep);
    yCoords.push(yMin + i * yStep);
  }

  const grid: number[][] = [];

  for (let j = 0; j <= resolution; j++) {
    const row: number[] = [];
    const y = yCoords[j] ?? 0;
    for (let i = 0; i <= resolution; i++) {
      const x = xCoords[i] ?? 0;
      const res = predictKnn(trainPoints, trainLabels, [x, y], config);
      row.push(res.predictedClass);
    }
    grid.push(row);
  }

  return {
    xCoords,
    yCoords,
    grid,
  };
}

/**
 * Simulate the Curse of Dimensionality:
 * As dimensionality increases, the relative difference between the nearest
 * and farthest points contracts toward zero, making distance-based neighborhoods ineffective.
 */
export function simulateCurseOfDimensionality(
  numPoints: number = 200,
  dimensions: number[] = [1, 2, 5, 10, 20, 50, 100],
  seed: number = 42
): CurseOfDimensionalityResult[] {
  const rng = new SeededRNG(seed);
  const results: CurseOfDimensionalityResult[] = [];

  for (const dim of dimensions) {
    // Generate numPoints uniform points in [0, 1]^dim
    const points: number[][] = [];
    for (let i = 0; i < numPoints; i++) {
      const pt: number[] = [];
      for (let d = 0; d < dim; d++) {
        pt.push(rng.next());
      }
      points.push(pt);
    }

    // Query point at center [0.5, 0.5, ...]
    const query = new Array<number>(dim).fill(0.5);

    let minDist = Infinity;
    let maxDist = -Infinity;

    for (const pt of points) {
      const dist = computeDistance(pt, query, 'euclidean');
      if (dist < minDist) minDist = dist;
      if (dist > maxDist) maxDist = dist;
    }

    const ratio = minDist > 0 ? (maxDist - minDist) / minDist : 0;

    results.push({
      dimension: dim,
      minDistance: minDist,
      maxDistance: maxDist,
      ratio,
    });
  }

  return results;
}
