import { SeededRNG } from '@/utils/rng';
import type {
  Point2D,
  DecisionStump,
  TreeNode,
  RandomForestConfig,
  RandomForestModel,
  AdaBoostRound,
  AdaBoostModel,
  StackingModel,
  DecisionBoundaryGrid,
  CondorcetSimulationResult,
} from './types';

/**
 * Computes Gini impurity for an array of labels (-1 or 1).
 */
export function calculateGini(labels: number[]): number {
  const n = labels.length;
  if (n === 0) return 0;
  let posCount = 0;
  for (let i = 0; i < n; i++) {
    if (labels[i]! > 0) posCount++;
  }
  const p1 = posCount / n;
  const p0 = 1 - p1;
  return 1 - (p1 * p1 + p0 * p0);
}

/**
 * Creates a bootstrap sample with replacement from dataset using SeededRNG.
 */
export function generateBootstrapSample(
  data: Point2D[],
  rng: SeededRNG
): {
  sample: Point2D[];
  inBagIndices: Set<number>;
  oobIndices: number[];
} {
  const n = data.length;
  const sample: Point2D[] = [];
  const inBagIndices = new Set<number>();

  for (let i = 0; i < n; i++) {
    const idx = rng.nextInt(0, n - 1);
    sample.push(data[idx]!);
    inBagIndices.add(idx);
  }

  const oobIndices: number[] = [];
  for (let i = 0; i < n; i++) {
    if (!inBagIndices.has(i)) {
      oobIndices.push(i);
    }
  }

  return { sample, inBagIndices, oobIndices };
}

/**
 * Recursive decision tree training with random feature subspace sampling.
 */
export function trainDecisionTree(
  data: Point2D[],
  maxDepth: number,
  featureSubspaceSize: number,
  rng: SeededRNG,
  minSamplesSplit: number = 2,
  currentDepth: number = 0
): TreeNode {
  const n = data.length;
  if (n === 0) {
    return { isLeaf: true, prediction: 1, samplesCount: 0 };
  }

  const labels = data.map((d) => d.label);
  let posCount = 0;
  for (let i = 0; i < n; i++) {
    if (labels[i]! > 0) posCount++;
  }
  const majorityClass = posCount >= n - posCount ? 1 : -1;

  // Stopping conditions: pure node, max depth, or too few samples
  if (posCount === 0 || posCount === n || currentDepth >= maxDepth || n < minSamplesSplit) {
    return {
      isLeaf: true,
      prediction: majorityClass,
      samplesCount: n,
    };
  }

  const currentGini = calculateGini(labels);
  let bestGain = -1;
  let bestFeature = -1;
  let bestThreshold = 0;
  let bestLeft: Point2D[] = [];
  let bestRight: Point2D[] = [];

  // Available features: 0 for x, 1 for y
  const allFeatures = [0, 1];
  rng.shuffle(allFeatures);
  const candidateFeatures = allFeatures.slice(0, Math.min(featureSubspaceSize, allFeatures.length));

  for (const featureIndex of candidateFeatures) {
    // Sort unique values of this feature
    const values = Array.from(new Set(data.map((d) => (featureIndex === 0 ? d.x : d.y)))).sort(
      (a, b) => a - b
    );

    // Evaluate midpoints
    for (let i = 0; i < values.length - 1; i++) {
      const threshold = (values[i]! + values[i + 1]!) / 2;
      const left: Point2D[] = [];
      const right: Point2D[] = [];

      for (let j = 0; j < n; j++) {
        const val = featureIndex === 0 ? data[j]!.x : data[j]!.y;
        if (val <= threshold) {
          left.push(data[j]!);
        } else {
          right.push(data[j]!);
        }
      }

      if (left.length === 0 || right.length === 0) continue;

      const giniLeft = calculateGini(left.map((d) => d.label));
      const giniRight = calculateGini(right.map((d) => d.label));
      const splitGini = (left.length / n) * giniLeft + (right.length / n) * giniRight;
      const gain = currentGini - splitGini;

      if (gain > bestGain) {
        bestGain = gain;
        bestFeature = featureIndex;
        bestThreshold = threshold;
        bestLeft = left;
        bestRight = right;
      }
    }
  }

  // If no split produces positive gain, make leaf
  if (bestGain <= 1e-6 || bestLeft.length === 0 || bestRight.length === 0) {
    return {
      isLeaf: true,
      prediction: majorityClass,
      samplesCount: n,
    };
  }

  return {
    isLeaf: false,
    featureIndex: bestFeature,
    threshold: bestThreshold,
    samplesCount: n,
    left: trainDecisionTree(
      bestLeft,
      maxDepth,
      featureSubspaceSize,
      rng,
      minSamplesSplit,
      currentDepth + 1
    ),
    right: trainDecisionTree(
      bestRight,
      maxDepth,
      featureSubspaceSize,
      rng,
      minSamplesSplit,
      currentDepth + 1
    ),
  };
}

/**
 * Evaluates a single tree on a 2D coordinate [x, y].
 */
export function predictTree(tree: TreeNode, point: [number, number]): number {
  if (tree.isLeaf || tree.featureIndex === undefined || tree.threshold === undefined) {
    return tree.prediction ?? 1;
  }
  const val = tree.featureIndex === 0 ? point[0] : point[1];
  if (val <= tree.threshold) {
    return tree.left ? predictTree(tree.left, point) : (tree.prediction ?? 1);
  } else {
    return tree.right ? predictTree(tree.right, point) : (tree.prediction ?? -1);
  }
}

/**
 * Trains a Random Forest ensemble and calculates cumulative Out-of-Bag (OOB) error curve.
 */
export function trainRandomForest(data: Point2D[], config: RandomForestConfig): RandomForestModel {
  const rng = new SeededRNG(config.seed ?? 42);
  const n = data.length;
  const trees: TreeNode[] = [];
  const oobErrors: number[] = [];

  // Track OOB predictions for each sample across trees: sampleIdx -> array of votes
  const sampleOobVotes: number[][] = Array.from({ length: n }, () => []);

  for (let t = 0; t < config.numTrees; t++) {
    const { sample, oobIndices } = generateBootstrapSample(data, rng);
    const tree = trainDecisionTree(
      sample,
      config.maxDepth,
      config.featureSubspaceSize,
      rng,
      config.minSamplesSplit ?? 2
    );
    trees.push(tree);

    // Record OOB votes
    for (const oobIdx of oobIndices) {
      const pred = predictTree(tree, [data[oobIdx]!.x, data[oobIdx]!.y]);
      sampleOobVotes[oobIdx]!.push(pred);
    }

    // Compute cumulative OOB error up to tree t
    let oobMisclassified = 0;
    let oobEvaluatedCount = 0;
    for (let i = 0; i < n; i++) {
      const votes = sampleOobVotes[i]!;
      if (votes.length > 0) {
        oobEvaluatedCount++;
        let posVotes = 0;
        for (let v = 0; v < votes.length; v++) {
          if (votes[v]! > 0) posVotes++;
        }
        const ensembleVote = posVotes >= votes.length - posVotes ? 1 : -1;
        if (ensembleVote !== data[i]!.label) {
          oobMisclassified++;
        }
      }
    }

    const currentOobError = oobEvaluatedCount > 0 ? oobMisclassified / oobEvaluatedCount : 0.5;
    oobErrors.push(currentOobError);
  }

  const finalOobError = oobErrors.length > 0 ? oobErrors[oobErrors.length - 1]! : 0;

  return {
    trees,
    oobErrors,
    finalOobError,
    config,
  };
}

/**
 * Predicts majority vote and probability of class +1 from a Random Forest model.
 */
export function predictRandomForest(
  model: RandomForestModel,
  point: [number, number]
): { prediction: number; probability: number } {
  if (model.trees.length === 0) {
    return { prediction: 1, probability: 0.5 };
  }
  let posVotes = 0;
  for (const tree of model.trees) {
    if (predictTree(tree, point) > 0) {
      posVotes++;
    }
  }
  const prob = posVotes / model.trees.length;
  return {
    prediction: prob >= 0.5 ? 1 : -1,
    probability: prob,
  };
}

/**
 * Finds the optimal weighted decision stump for AdaBoost.
 */
export function findBestDecisionStump(data: Point2D[], sampleWeights: number[]): DecisionStump {
  const n = data.length;
  let bestError = Infinity;
  let bestStump: DecisionStump = {
    featureIndex: 0,
    threshold: 0,
    polarity: 1,
    weight: 1,
    error: 0.5,
  };

  for (let featureIndex = 0; featureIndex < 2; featureIndex++) {
    const values = Array.from(new Set(data.map((d) => (featureIndex === 0 ? d.x : d.y)))).sort(
      (a, b) => a - b
    );

    // Candidates include outer bounds and midpoints
    const candidates: number[] = [values[0]! - 1.0];
    for (let i = 0; i < values.length - 1; i++) {
      candidates.push((values[i]! + values[i + 1]!) / 2);
    }
    candidates.push(values[values.length - 1]! + 1.0);

    for (const threshold of candidates) {
      for (const polarity of [1, -1] as const) {
        let weightedError = 0;
        for (let i = 0; i < n; i++) {
          const val = featureIndex === 0 ? data[i]!.x : data[i]!.y;
          const pred = val < threshold ? polarity : -polarity;
          if (pred !== data[i]!.label) {
            weightedError += sampleWeights[i]!;
          }
        }

        if (weightedError < bestError) {
          bestError = weightedError;
          bestStump = {
            featureIndex,
            threshold,
            polarity,
            weight: 0,
            error: weightedError,
          };
        }
      }
    }
  }

  return bestStump;
}

/**
 * Evaluates a single decision stump on coordinate [x, y].
 */
export function predictStump(stump: DecisionStump, point: [number, number]): number {
  const val = stump.featureIndex === 0 ? point[0] : point[1];
  return val < stump.threshold ? stump.polarity : -stump.polarity;
}

/**
 * Trains the AdaBoost classification algorithm over sequential rounds.
 */
export function trainAdaBoost(data: Point2D[], numRounds: number = 10): AdaBoostModel {
  const n = data.length;
  if (n === 0) {
    return { rounds: [], stumps: [], finalAccuracy: 1 };
  }

  // Initialize weights w_i = 1 / N
  const weights: number[] = new Array<number>(n).fill(1 / n);
  const rounds: AdaBoostRound[] = [];
  const stumps: DecisionStump[] = [];

  for (let r = 0; r < numRounds; r++) {
    const stump = findBestDecisionStump(data, weights);

    // Clamp error to avoid division by zero or negative weights
    const eps = Math.max(1e-10, Math.min(0.49999, stump.error));
    const alpha = 0.5 * Math.log((1 - eps) / eps);
    stump.weight = alpha;
    stumps.push(stump);

    // Update weights: w_i <- w_i * exp(-alpha * y_i * h_t(x_i))
    let weightSum = 0;
    const nextWeights: number[] = new Array<number>(n).fill(0);
    for (let i = 0; i < n; i++) {
      const pred = predictStump(stump, [data[i]!.x, data[i]!.y]);
      const w = weights[i]! * Math.exp(-alpha * data[i]!.label * pred);
      nextWeights[i] = w;
      weightSum += w;
    }

    // Normalize weights
    for (let i = 0; i < n; i++) {
      weights[i] = nextWeights[i]! / weightSum;
    }

    // Compute training accuracy of ensemble so far
    let correct = 0;
    for (let i = 0; i < n; i++) {
      let cumulativeScore = 0;
      for (const s of stumps) {
        cumulativeScore += s.weight * predictStump(s, [data[i]!.x, data[i]!.y]);
      }
      const ensemblePred = cumulativeScore >= 0 ? 1 : -1;
      if (ensemblePred === data[i]!.label) {
        correct++;
      }
    }
    const trainingAccuracy = correct / n;

    rounds.push({
      roundIndex: r + 1,
      stump: { ...stump },
      sampleWeights: [...weights],
      roundError: eps,
      alpha,
      trainingAccuracy,
    });
  }

  const finalAccuracy = rounds.length > 0 ? rounds[rounds.length - 1]!.trainingAccuracy : 1;

  return {
    rounds,
    stumps,
    finalAccuracy,
  };
}

/**
 * Predicts label and signed continuous confidence score from an AdaBoost model.
 */
export function predictAdaBoost(
  model: AdaBoostModel,
  point: [number, number]
): { prediction: number; score: number } {
  let score = 0;
  for (const stump of model.stumps) {
    score += stump.weight * predictStump(stump, point);
  }
  return {
    prediction: score >= 0 ? 1 : -1,
    score,
  };
}

/**
 * Trains a simple Stacking meta-model with out-of-fold predictions.
 */
export function trainStackingBlender(data: Point2D[], seed: number = 42): StackingModel {
  const rng = new SeededRNG(seed);
  const n = data.length;
  const kFolds = 4;
  const indices: number[] = Array.from({ length: n }, (_, i) => i);
  rng.shuffle(indices);

  // Split into folds
  const folds: number[][] = Array.from({ length: kFolds }, () => []);
  for (let i = 0; i < n; i++) {
    folds[i % kFolds]!.push(indices[i]!);
  }

  // Base models: 1. Decision Stump, 2. Simple Linear centroid separator, 3. 3-NN rule
  const baseModelNames = [
    'Decision Stump',
    'Linear Centroid Separator',
    '3-NN Instance Classifier',
  ];
  const oofPredictions: number[][] = Array.from({ length: n }, () => [0, 0, 0]);

  for (let f = 0; f < kFolds; f++) {
    const valIndices = new Set(folds[f]);
    const trainData = data.filter((_, idx) => !valIndices.has(idx));
    const valData = data.filter((_, idx) => valIndices.has(idx));

    // Base 1: Stump
    const stump = findBestDecisionStump(
      trainData,
      new Array<number>(trainData.length).fill(1 / trainData.length)
    );

    // Base 2: Centroid
    const posTrain = trainData.filter((d) => d.label > 0);
    const negTrain = trainData.filter((d) => d.label < 0);
    const posCentroid = [
      posTrain.reduce((acc, d) => acc + d.x, 0) / Math.max(1, posTrain.length),
      posTrain.reduce((acc, d) => acc + d.y, 0) / Math.max(1, posTrain.length),
    ];
    const negCentroid = [
      negTrain.reduce((acc, d) => acc + d.x, 0) / Math.max(1, negTrain.length),
      negTrain.reduce((acc, d) => acc + d.y, 0) / Math.max(1, negTrain.length),
    ];

    for (let j = 0; j < valData.length; j++) {
      const originalIdx = folds[f]![j]!;
      const pt: [number, number] = [valData[j]!.x, valData[j]!.y];

      // Model 1 pred
      oofPredictions[originalIdx]![0] = predictStump(stump, pt);

      // Model 2 pred: distance to centroids
      const dPos = Math.hypot(pt[0] - posCentroid[0]!, pt[1] - posCentroid[1]!);
      const dNeg = Math.hypot(pt[0] - negCentroid[0]!, pt[1] - negCentroid[1]!);
      oofPredictions[originalIdx]![1] = dPos < dNeg ? 1 : -1;

      // Model 3 pred: 3-NN
      const sorted = [...trainData].sort(
        (a, b) => Math.hypot(a.x - pt[0], a.y - pt[1]) - Math.hypot(b.x - pt[0], b.y - pt[1])
      );
      const top3Votes = sorted.slice(0, 3).reduce((acc, d) => acc + d.label, 0);
      oofPredictions[originalIdx]![2] = top3Votes >= 0 ? 1 : -1;
    }
  }

  // Meta learner weights: equal weighting or variance weighted
  const metaWeights = [0.35, 0.3, 0.35];
  const metaBias = 0.0;

  // Compute OOF accuracy
  let correct = 0;
  for (let i = 0; i < n; i++) {
    const metaScore =
      metaBias +
      oofPredictions[i]![0]! * metaWeights[0]! +
      oofPredictions[i]![1]! * metaWeights[1]! +
      oofPredictions[i]![2]! * metaWeights[2]!;
    const metaPred = metaScore >= 0 ? 1 : -1;
    if (metaPred === data[i]!.label) {
      correct++;
    }
  }

  return {
    baseModelNames,
    metaWeights,
    metaBias,
    oofAccuracy: correct / n,
  };
}

/**
 * Generates a 2D grid matrix of predictions and continuous probabilities for visual contour rendering.
 */
export function generateEnsembleBoundaryGrid(
  predictFn: (pt: [number, number]) => { prediction: number; probability?: number; score?: number },
  xMin: number = -3.0,
  xMax: number = 3.0,
  yMin: number = -3.0,
  yMax: number = 3.0,
  resolution: number = 25
): DecisionBoundaryGrid {
  const grid: number[][] = [];
  const probabilities: number[][] = [];
  const dx = (xMax - xMin) / (resolution - 1);
  const dy = (yMax - yMin) / (resolution - 1);

  for (let r = 0; r < resolution; r++) {
    const y = yMax - r * dy;
    const gridRow: number[] = [];
    const probRow: number[] = [];
    for (let c = 0; c < resolution; c++) {
      const x = xMin + c * dx;
      const res = predictFn([x, y]);
      gridRow.push(res.prediction);
      if (res.probability !== undefined) {
        probRow.push(res.probability);
      } else if (res.score !== undefined) {
        // Sigmoid mapping for continuous score
        const prob = 1 / (1 + Math.exp(-res.score));
        probRow.push(prob);
      } else {
        probRow.push(res.prediction > 0 ? 1 : 0);
      }
    }
    grid.push(gridRow);
    probabilities.push(probRow);
  }

  return { grid, probabilities, xMin, xMax, yMin, yMax, resolution };
}

/**
 * Simulates the Condorcet Jury Theorem with independent vs correlated voters.
 */
export function simulateCondorcetJury(
  individualAccuracy: number,
  voterCount: number, // odd number e.g. 21
  correlation: number = 0.0,
  numTrials: number = 500,
  rngSeed: number = 42
): CondorcetSimulationResult {
  const rng = new SeededRNG(rngSeed);
  const majorityThreshold = Math.floor(voterCount / 2) + 1;
  let majorityCorrectTrials = 0;

  for (let t = 0; t < numTrials; t++) {
    // True state is +1
    let correctVoters = 0;

    // Common environmental shock with probability correlation
    const commonShockActive = rng.next() < correlation;
    const commonShockCorrect = rng.next() < individualAccuracy;

    for (let v = 0; v < voterCount; v++) {
      let isCorrect: boolean;
      if (commonShockActive) {
        // Voter agrees with common shock
        isCorrect = commonShockCorrect;
      } else {
        // Voter is independent
        isCorrect = rng.next() < individualAccuracy;
      }

      if (isCorrect) correctVoters++;
    }

    if (correctVoters >= majorityThreshold) {
      majorityCorrectTrials++;
    }
  }

  // Theoretical independent accuracy via binomial CDF
  const p = individualAccuracy;
  let theoreticalIndependentAccuracy = 0;
  for (let k = majorityThreshold; k <= voterCount; k++) {
    let comb = 1;
    for (let i = 1; i <= k; i++) {
      comb = (comb * (voterCount - i + 1)) / i;
    }
    theoreticalIndependentAccuracy += comb * Math.pow(p, k) * Math.pow(1 - p, voterCount - k);
  }

  return {
    voterCount,
    individualAccuracy,
    correlation,
    simulatedMajorityAccuracy: majorityCorrectTrials / numTrials,
    theoreticalIndependentAccuracy,
    trialsRun: numTrials,
  };
}
