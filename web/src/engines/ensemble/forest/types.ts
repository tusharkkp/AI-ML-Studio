export interface Point2D {
  x: number;
  y: number;
  label: number; // 1 or -1 (or 0 and 1)
}

export interface DecisionStump {
  featureIndex: number; // 0 for x, 1 for y
  threshold: number;
  polarity: 1 | -1; // if x[feature] < threshold then polarity else -polarity
  weight: number; // alpha_t in AdaBoost
  error: number; // weighted error epsilon_t
}

export interface TreeNode {
  isLeaf: boolean;
  prediction?: number;
  featureIndex?: number;
  threshold?: number;
  left?: TreeNode;
  right?: TreeNode;
  samplesCount: number;
}

export interface RandomForestConfig {
  numTrees: number;
  maxDepth: number;
  featureSubspaceSize: number; // number of features evaluated per split (e.g. 1 or 2)
  minSamplesSplit?: number;
  seed?: number;
}

export interface RandomForestModel {
  trees: TreeNode[];
  oobErrors: number[];
  finalOobError: number;
  config: RandomForestConfig;
}

export interface AdaBoostRound {
  roundIndex: number;
  stump: DecisionStump;
  sampleWeights: number[];
  roundError: number;
  alpha: number;
  trainingAccuracy: number;
}

export interface AdaBoostModel {
  rounds: AdaBoostRound[];
  stumps: DecisionStump[];
  finalAccuracy: number;
}

export interface StackingModel {
  baseModelNames: string[];
  metaWeights: number[];
  metaBias: number;
  oofAccuracy: number;
}

export interface DecisionBoundaryGrid {
  grid: number[][]; // 2D array of predictions (-1 or 1)
  probabilities: number[][]; // 2D array of class 1 probabilities
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  resolution: number;
}

export interface CondorcetSimulationResult {
  voterCount: number;
  individualAccuracy: number;
  correlation: number;
  simulatedMajorityAccuracy: number;
  theoreticalIndependentAccuracy: number;
  trialsRun: number;
}
