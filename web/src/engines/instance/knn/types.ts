/**
 * Types for the k-Nearest Neighbors (k-NN) Engine.
 */

export type DistanceMetric = 'euclidean' | 'manhattan' | 'chebyshev' | 'minkowski';

/** A neighbor with distance and voting weight. */
export interface KnnNeighbor {
  index: number;
  point: number[];
  label: number;
  distance: number;
  weight: number;
}

/** Result of a k-NN classification query. */
export interface KnnPrediction {
  predictedClass: number;
  probabilities: Record<number, number>;
  neighbors: KnnNeighbor[];
}

/** Configuration options for k-NN search and voting. */
export interface KnnConfig {
  k: number;
  metric?: DistanceMetric;
  p?: number;
  weightByDistance?: boolean;
}

/** 2D decision boundary grid evaluation. */
export interface DecisionGrid2D {
  xCoords: number[];
  yCoords: number[];
  grid: number[][];
}

/** Statistical outcome of distance distribution in d dimensions. */
export interface CurseOfDimensionalityResult {
  dimension: number;
  minDistance: number;
  maxDistance: number;
  ratio: number;
}
