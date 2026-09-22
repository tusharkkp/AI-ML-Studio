import { describe, it, expect } from 'vitest';
import {
  computeDistance,
  predictKnn,
  computeDecisionGrid,
  simulateCurseOfDimensionality,
} from './engine';

describe('k-NN Engine Unit Tests', () => {
  it('correctly computes distance metrics (Euclidean, Manhattan, Chebyshev, Minkowski)', () => {
    const a = [0, 0];
    const b = [3, 4];

    // L2 Euclidean: sqrt(3^2 + 4^2) = 5
    expect(computeDistance(a, b, 'euclidean')).toBeCloseTo(5, 5);

    // L1 Manhattan: |3| + |4| = 7
    expect(computeDistance(a, b, 'manhattan')).toBeCloseTo(7, 5);

    // L_infinity Chebyshev: max(3, 4) = 4
    expect(computeDistance(a, b, 'chebyshev')).toBeCloseTo(4, 5);

    // Minkowski p=1 should equal Manhattan
    expect(computeDistance(a, b, 'minkowski', 1)).toBeCloseTo(7, 5);

    // Minkowski p=2 should equal Euclidean
    expect(computeDistance(a, b, 'minkowski', 2)).toBeCloseTo(5, 5);
  });

  it('classifies query points correctly with 1-NN and 3-NN', () => {
    const trainPoints = [
      [0, 0],
      [1, 0],
      [0, 1], // Cluster 0
      [10, 10],
      [11, 10],
      [10, 11], // Cluster 1
    ];
    const trainLabels = [0, 0, 0, 1, 1, 1];

    // Point close to Cluster 0
    const res0 = predictKnn(trainPoints, trainLabels, [0.5, 0.5], { k: 3 });
    expect(res0.predictedClass).toBe(0);
    expect(res0.neighbors.length).toBe(3);
    expect(res0.neighbors.every((n) => n.label === 0)).toBe(true);

    // Point close to Cluster 1
    const res1 = predictKnn(trainPoints, trainLabels, [10.5, 10.5], { k: 3 });
    expect(res1.predictedClass).toBe(1);
    expect(res1.neighbors.length).toBe(3);
    expect(res1.neighbors.every((n) => n.label === 1)).toBe(true);
  });

  it('demonstrates distance-weighted voting overcoming uniform majority', () => {
    // Two class 0 points at distance 2.0
    // One class 1 point at distance 0.1
    const trainPoints = [
      [2, 0], // class 0, dist = 2
      [-2, 0], // class 0, dist = 2
      [0.1, 0], // class 1, dist = 0.1
    ];
    const trainLabels = [0, 0, 1];
    const query = [0, 0];

    // Without distance weighting: 2 votes for 0 vs 1 vote for 1 -> class 0 wins
    const unweighted = predictKnn(trainPoints, trainLabels, query, {
      k: 3,
      weightByDistance: false,
    });
    expect(unweighted.predictedClass).toBe(0);

    // With distance weighting: 1 / 0.1 = 10 for class 1 vs 2 * (1 / 2) = 1 for class 0 -> class 1 wins
    const weighted = predictKnn(trainPoints, trainLabels, query, {
      k: 3,
      weightByDistance: true,
    });
    expect(weighted.predictedClass).toBe(1);
    expect(weighted.probabilities[1]).toBeGreaterThan(0.8);
  });

  it('breaks ties deterministically on equidistant points', () => {
    const trainPoints = [
      [-1, 0], // class 0, dist = 1
      [1, 0], // class 1, dist = 1
    ];
    const trainLabels = [0, 1];
    const query = [0, 0];

    const res = predictKnn(trainPoints, trainLabels, query, { k: 2 });
    // Equal 50/50 votes; should deterministically pick class 0 or class 1 without throwing
    expect([0, 1]).toContain(res.predictedClass);
    expect(res.probabilities[0]).toBeCloseTo(0.5, 4);
    expect(res.probabilities[1]).toBeCloseTo(0.5, 4);
  });

  it('computes 2D decision boundary grid with expected shape and labels', () => {
    const trainPoints = [
      [1, 1],
      [9, 9],
    ];
    const trainLabels = [0, 1];
    const bounds = { xMin: 0, xMax: 10, yMin: 0, yMax: 10 };
    const resolution = 5;

    const gridResult = computeDecisionGrid(trainPoints, trainLabels, bounds, resolution, {
      k: 1,
      metric: 'euclidean',
    });

    expect(gridResult.grid.length).toBe(resolution + 1);
    expect(gridResult.grid[0]?.length).toBe(resolution + 1);
    // (0,0) corner should be class 0
    expect(gridResult.grid[0]?.[0]).toBe(0);
    // (10,10) corner should be class 1
    expect(gridResult.grid[resolution]?.[resolution]).toBe(1);
  });

  it('demonstrates Curse of Dimensionality distance ratio contraction', () => {
    const dimensions = [2, 10, 50, 100];
    const results = simulateCurseOfDimensionality(100, dimensions, 42);

    expect(results.length).toBe(dimensions.length);

    // Compare contrast ratio (max - min) / min for 2D vs 100D
    const ratio2D = results[0]?.ratio ?? 0;
    const ratio100D = results[results.length - 1]?.ratio ?? 0;

    // In 2D, the farthest point is significantly further than the nearest point (large ratio)
    // In 100D, the ratio contracts dramatically as all points become nearly equidistant
    expect(ratio2D).toBeGreaterThan(ratio100D);
    expect(ratio100D).toBeLessThan(1.5);
  });
});
