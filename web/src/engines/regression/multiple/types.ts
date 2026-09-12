import type { RegressionMetrics } from '../linear/types';

export interface MultipleRegressionPoint {
  x: number[]; // feature vector [x_1, x_2, ..., x_d]
  y: number; // continuous scalar target
}

export interface MultipleLinearModel extends RegressionMetrics {
  theta: number[]; // [theta_0 (bias), theta_1, ..., theta_d]
  featureCount: number;
  isSingular?: boolean;
}

export interface MultipleGDConfig {
  learningRate: number; // alpha
  maxIterations?: number;
  initialTheta?: number[];
  tolerance?: number;
}

export interface MultipleGDStep {
  iteration: number;
  theta: number[];
  cost: number;
  gradientNorm: number;
}

export interface MultipleGDResult {
  finalTheta: number[];
  finalCost: number;
  iterationsCompleted: number;
  converged: boolean;
  diverged: boolean;
  steps: MultipleGDStep[];
}
