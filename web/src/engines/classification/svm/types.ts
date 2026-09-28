/**
 * Types for the Support Vector Machine (SVM) Engine.
 * Pure TypeScript, zero React/DOM dependencies.
 */

export type SvmKernelType = 'linear' | 'poly' | 'rbf';

/** Kernel configuration parameters. */
export interface SvmKernelConfig {
  type: SvmKernelType;
  /** Polynomial degree d (default: 2, used when type='poly'). */
  degree?: number;
  /** Polynomial constant c (default: 1, used when type='poly'). */
  coef0?: number;
  /** Gaussian RBF gamma parameter: exp(-gamma * ||x - z||^2) (default: 0.5). */
  gamma?: number;
}

/** Complete SVM training options. */
export interface SvmConfig {
  /** Soft-margin regularization parameter C > 0. */
  C: number;
  /** Kernel specification. */
  kernel: SvmKernelConfig;
  /** Maximum optimization passes / iterations (default: 100). */
  maxIter?: number;
  /** Numerical tolerance for KKT conditions and duality gap (default: 1e-3). */
  tol?: number;
  /** Floating-point threshold to identify non-zero support vectors (default: 1e-4). */
  alphaTol?: number;
}

/** Individual support vector record. */
export interface SupportVector {
  index: number;
  point: number[];
  label: -1 | 1;
  alpha: number;
  /** Slack variable ξ_i = max(0, 1 - y_i * (f(x_i))) */
  slack: number;
}

/** Trained SVM Model output. */
export interface SvmModel {
  config: SvmConfig;
  /** Primal weight vector w (only valid for linear kernel). */
  weights?: number[];
  /** Intercept / bias term b in f(x) = sum(alpha_i * y_i * K(x_i, x)) + b. */
  bias: number;
  /** Lagrange multipliers alpha_i for each training sample. */
  alphas: number[];
  /** Extracted active support vectors (alpha_i > alphaTol). */
  supportVectors: SupportVector[];
  /** Geometric margin width 2 / ||w|| (valid for linear kernel). */
  marginWidth?: number;
  /** Training accuracy on the fitted dataset (0 to 1). */
  trainingAccuracy: number;
  /** Number of iterations taken to converge. */
  iterations: number;
}

/** Prediction result for a single sample. */
export interface SvmPrediction {
  /** Continuous raw decision value f(x) = sum(alpha_i * y_i * K(x_i, x)) + b. */
  decisionValue: number;
  /** Discrete binary predicted label: +1 or -1. */
  predictedClass: -1 | 1;
  /** Distance to the separating hyperplane: |f(x)| / ||w|| for linear kernel. */
  marginDistance?: number;
}

/** 2D Evaluation grid for decision boundaries and contour rendering. */
export interface SvmDecisionGrid2D {
  xCoords: number[];
  yCoords: number[];
  /** Raw decision values grid[row][col] where row is y, col is x. */
  grid: number[][];
  /** Minimum and maximum decision values across the grid. */
  minVal: number;
  maxVal: number;
}

/** 3D lifted coordinate for geometric demonstration of Cover's theorem. */
export interface LiftedPoint3D {
  x: number;
  y: number;
  z: number;
  label: -1 | 1;
}
