/**
 * Types for the Logistic Regression engine.
 */

/** Trained logistic regression model parameters. */
export interface LogisticModel {
  /** Weight vector θ: [bias θ0, θ1, θ2, ..., θd]. Length = numFeatures + 1. */
  theta: number[];
  /** Number of input features (excluding bias). */
  numFeatures: number;
  /** Training configuration used. */
  config: LogisticConfig;
  /** Log-loss at each recorded iteration. */
  lossHistory: number[];
}

/** Training configuration for logistic regression. */
export interface LogisticConfig {
  /** Learning rate α (default 0.1). */
  alpha: number;
  /** Maximum gradient descent iterations (default 1000). */
  maxIter: number;
  /** Record loss every N iterations for lossHistory (default 10). */
  recordEvery?: number;
}

/** Prediction result from a trained logistic model. */
export interface LogisticPrediction {
  /** Probability that the sample belongs to class 1: P(y=1|x). */
  probability: number;
  /** Hard class assignment at τ = 0.5. */
  class: 0 | 1;
  /** Linear combination z = θ · x̃ before sigmoid. */
  logit: number;
}

/** Decision boundary parameters for 2D input (x1, x2). */
export interface DecisionBoundary2D {
  /** Slope: -θ1 / θ2 */
  slope: number;
  /** Intercept: -θ0 / θ2 */
  intercept: number;
  /** True when θ2 ≈ 0 (vertical boundary), x1 = -θ0 / θ1 */
  isVertical: boolean;
  /** x1 value if boundary is vertical, else NaN */
  verticalX1: number;
}
