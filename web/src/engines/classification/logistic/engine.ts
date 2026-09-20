import type {
  LogisticModel,
  LogisticConfig,
  LogisticPrediction,
  DecisionBoundary2D,
} from './types';

/**
 * Numerically stable sigmoid function.
 * Clamps z to [-15, 15] to prevent Infinity / -Infinity before exponentiation.
 */
export function sigmoid(z: number): number {
  const zClamped = Math.max(-15, Math.min(15, z));
  return 1 / (1 + Math.exp(-zClamped));
}

/**
 * Prepend a bias column (all 1s) to the feature matrix.
 * X is m×d → returns m×(d+1) with x̃[i][0] = 1.
 */
function addBias(X: number[][]): number[][] {
  return X.map((row) => [1, ...row]);
}

/**
 * Matrix–vector multiply: A (m×n) · v (n) → result (m).
 */
function matVec(A: number[][], v: number[]): number[] {
  return A.map((row) => row.reduce((sum, val, j) => sum + val * (v[j] ?? 0), 0));
}

/**
 * Train a logistic regression model using batch gradient descent.
 *
 * Update rule: θ := θ - (α / m) · X̃ᵀ · (p̂ - y)
 *
 * @param X  Feature matrix — m samples × d features.
 * @param y  Binary labels 0 or 1, length m.
 * @param config  Training hyper-parameters.
 * @returns  Trained {@link LogisticModel}.
 */
export function trainLogisticRegression(
  X: number[][],
  y: number[],
  config: Partial<LogisticConfig> = {}
): LogisticModel {
  const { alpha = 0.1, maxIter = 1000, recordEvery = 10 } = config;

  if (X.length === 0 || y.length === 0) {
    throw new Error('Cannot train logistic regression on an empty dataset');
  }
  if (X.length !== y.length) {
    throw new Error(`X rows (${X.length}) must match y length (${y.length})`);
  }

  const m = X.length;
  const d = X[0]?.length ?? 0;
  const Xb = addBias(X); // m × (d+1)

  // Initialise θ to zeros
  let theta: number[] = new Array<number>(d + 1).fill(0);
  const lossHistory: number[] = [];

  for (let iter = 0; iter < maxIter; iter++) {
    // Forward pass: p̂ = sigmoid(X̃ · θ)
    const logits = matVec(Xb, theta);
    const pHat = logits.map(sigmoid);

    // Residuals: (p̂ - y)
    const residuals = pHat.map((p, i) => p - (y[i] ?? 0));

    // Gradient: (1/m) · X̃ᵀ · residuals  — shape (d+1)
    const grad = theta.map(
      (_, j) => Xb.reduce((sum, row, i) => sum + (row[j] ?? 0) * (residuals[i] ?? 0), 0) / m
    );

    // Update
    theta = theta.map((t, j) => t - alpha * (grad[j] ?? 0));

    // Record log-loss
    if (iter % recordEvery === 0) {
      const loss = computeLogLossFromPredictions(pHat, y);
      lossHistory.push(loss);
    }
  }

  return {
    theta,
    numFeatures: d,
    config: { alpha, maxIter, recordEvery },
    lossHistory,
  };
}

/**
 * Predict class label and probability for a single sample.
 */
export function predictLogistic(model: LogisticModel, x: number[]): LogisticPrediction {
  if (x.length !== model.numFeatures) {
    throw new Error(`Feature dimension mismatch: expected ${model.numFeatures}, got ${x.length}`);
  }

  const xb = [1, ...x]; // prepend bias
  const logit = xb.reduce((sum, val, j) => sum + val * (model.theta[j] ?? 0), 0);
  const probability = sigmoid(logit);

  return {
    probability,
    class: probability >= 0.5 ? 1 : 0,
    logit,
  };
}

/**
 * Cross-entropy log-loss: J(θ) = -1/m Σ [y log(p̂) + (1-y) log(1-p̂)].
 * Clips p̂ to [1e-9, 1-1e-9] for numerical stability.
 */
export function computeLogLoss(model: LogisticModel, X: number[][], y: number[]): number {
  const pHat = X.map((x) => predictLogistic(model, x).probability);
  return computeLogLossFromPredictions(pHat, y);
}

/** Internal helper: compute log-loss directly from prediction probabilities. */
function computeLogLossFromPredictions(pHat: number[], y: number[]): number {
  const eps = 1e-9;
  const m = y.length;
  if (m === 0) return 0;
  const sum = pHat.reduce((acc, p, i) => {
    const pClipped = Math.max(eps, Math.min(1 - eps, p));
    const yi = y[i] ?? 0;
    return acc - (yi * Math.log(pClipped) + (1 - yi) * Math.log(1 - pClipped));
  }, 0);
  return sum / m;
}

/**
 * Compute linear decision boundary for 2D input features (x1, x2).
 *
 * The boundary is where P(y=1) = 0.5, i.e. θ0 + θ1·x1 + θ2·x2 = 0.
 * Solving for x2: x2 = -(θ0 + θ1·x1) / θ2.
 */
export function computeDecisionBoundary(model: LogisticModel): DecisionBoundary2D {
  if (model.numFeatures !== 2) {
    throw new Error(
      `Decision boundary computation requires exactly 2 features, got ${model.numFeatures}`
    );
  }

  const theta0 = model.theta[0] ?? 0;
  const theta1 = model.theta[1] ?? 0;
  const theta2 = model.theta[2] ?? 0;
  const eps = 1e-8;

  if (Math.abs(theta2) < eps) {
    // Boundary is vertical: x1 = -θ0 / θ1
    const verticalX1 = Math.abs(theta1) < eps ? 0 : -theta0 / theta1;
    return { slope: NaN, intercept: NaN, isVertical: true, verticalX1 };
  }

  return {
    slope: -theta1 / theta2,
    intercept: -theta0 / theta2,
    isVertical: false,
    verticalX1: NaN,
  };
}
