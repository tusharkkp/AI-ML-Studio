import type {
  RegularizationConfig,
  RegularizedModelResult,
  RegularizationTracePoint,
} from './types';
import { transpose, multiplyMatrix, multiplyVector, invertMatrix } from '../multiple/matrix';

// Soft-thresholding operator S(z, gamma) = sign(z) * max(|z| - gamma, 0)
export function softThreshold(z: number, gamma: number): number {
  if (z > gamma) return z - gamma;
  if (z < -gamma) return z + gamma;
  return 0;
}

// Compute R^2, MSE, MAE given actual y, predictions yHat
export function computeRegressionStats(
  yActual: number[],
  yPredicted: number[]
): { r2: number; mse: number; mae: number } {
  const m = yActual.length;
  if (m === 0) return { r2: 0, mse: 0, mae: 0 };

  let sse = 0;
  let sae = 0;
  let sumY = 0;

  for (let i = 0; i < m; i++) {
    const act = yActual[i]!;
    const pred = yPredicted[i]!;
    const diff = act - pred;
    sse += diff * diff;
    sae += Math.abs(diff);
    sumY += act;
  }

  const meanY = sumY / m;
  let sst = 0;
  for (let i = 0; i < m; i++) {
    const diff = yActual[i]! - meanY;
    sst += diff * diff;
  }

  const mse = sse / m;
  const mae = sae / m;
  const r2 = sst === 0 ? 1 : 1 - sse / sst;

  return { r2, mse, mae };
}

// Predict using coefficients and intercept
export function predictRegularized(
  X: number[][],
  coefficients: number[],
  intercept: number
): number[] {
  const m = X.length;
  const preds: number[] = new Array<number>(m);
  const p = coefficients.length;

  for (let i = 0; i < m; i++) {
    const row = X[i]!;
    let val = intercept;
    for (let j = 0; j < p; j++) {
      val += (row[j] ?? 0) * (coefficients[j] ?? 0);
    }
    preds[i] = val;
  }
  return preds;
}

// 1. Ridge Regression via Closed-Form Normal Equation: (X^T X + alpha * I)^(-1) X^T y
export function fitRidge(
  X: number[][],
  y: number[],
  config: RegularizationConfig
): RegularizedModelResult {
  const m = X.length;
  if (m === 0) {
    return {
      coefficients: [],
      intercept: 0,
      r2: 0,
      mse: 0,
      mae: 0,
      numZeroCoefficients: 0,
      penaltyCost: 0,
      iterations: 1,
    };
  }

  const p = X[0]!.length;
  const alpha = Math.max(0, config.alpha);

  // Center X and y so intercept doesn't get regularized
  const meanX: number[] = new Array<number>(p).fill(0);
  let meanY = 0;

  for (let i = 0; i < m; i++) {
    meanY += y[i]!;
    for (let j = 0; j < p; j++) {
      meanX[j] = (meanX[j] ?? 0) + (X[i]![j] ?? 0);
    }
  }
  meanY /= m;
  for (let j = 0; j < p; j++) {
    meanX[j] = (meanX[j] ?? 0) / m;
  }

  const Xc: number[][] = Array.from({ length: m }, () => new Array<number>(p).fill(0));
  const yc: number[] = new Array<number>(m).fill(0);

  for (let i = 0; i < m; i++) {
    yc[i] = y[i]! - meanY;
    for (let j = 0; j < p; j++) {
      Xc[i]![j] = (X[i]![j] ?? 0) - (meanX[j] ?? 0);
    }
  }

  // Normal equation: theta = (Xc^T Xc + alpha * m * I)^(-1) Xc^T yc
  const Xt = transpose(Xc);
  const XtX = multiplyMatrix(Xt, Xc);

  // Add Ridge penalty to diagonal
  const penaltyScale = alpha * m;
  for (let j = 0; j < p; j++) {
    XtX[j]![j] = (XtX[j]![j] ?? 0) + penaltyScale;
  }

  const { inverse, isSingular } = invertMatrix(XtX);
  let coeffs: number[];

  if (isSingular) {
    // If singular, fallback to zeros
    coeffs = new Array<number>(p).fill(0);
  } else {
    const Xty = multiplyVector(Xt, yc);
    coeffs = multiplyVector(inverse, Xty);
  }

  // Intercept: theta_0 = meanY - sum(coeffs_j * meanX_j)
  let intercept = meanY;
  for (let j = 0; j < p; j++) {
    intercept -= (coeffs[j] ?? 0) * (meanX[j] ?? 0);
  }

  // Evaluate
  const yPred = predictRegularized(X, coeffs, intercept);
  const { r2, mse, mae } = computeRegressionStats(y, yPred);

  // Compute L2 penalty cost: alpha * sum(coeffs_j^2)
  let l2Sum = 0;
  let zeros = 0;
  for (let j = 0; j < p; j++) {
    const c = coeffs[j] ?? 0;
    l2Sum += c * c;
    if (Math.abs(c) < 1e-6) zeros++;
  }

  return {
    coefficients: coeffs,
    intercept,
    r2,
    mse,
    mae,
    numZeroCoefficients: zeros,
    penaltyCost: alpha * l2Sum,
    iterations: 1,
  };
}

// 2. Lasso Regression via Coordinate Descent with Soft-Thresholding
export function fitLasso(
  X: number[][],
  y: number[],
  config: RegularizationConfig
): RegularizedModelResult {
  const m = X.length;
  if (m === 0) {
    return {
      coefficients: [],
      intercept: 0,
      r2: 0,
      mse: 0,
      mae: 0,
      numZeroCoefficients: 0,
      penaltyCost: 0,
      iterations: 0,
    };
  }

  const p = X[0]!.length;
  const alpha = Math.max(0, config.alpha);
  const maxIter = config.maxIterations ?? 500;
  const tol = config.tolerance ?? 1e-4;

  const coeffs: number[] = new Array<number>(p).fill(0);
  let intercept = y.reduce((acc, val) => acc + val, 0) / m;

  // Precompute z_j = (1/m) * sum(X_ij^2)
  const z: number[] = new Array<number>(p).fill(0);
  for (let j = 0; j < p; j++) {
    let sumSq = 0;
    for (let i = 0; i < m; i++) {
      const val = X[i]![j] ?? 0;
      sumSq += val * val;
    }
    z[j] = sumSq / m || 1e-8;
  }

  let iter = 0;
  let maxChange = tol + 1;

  while (iter < maxIter && maxChange > tol) {
    maxChange = 0;
    iter++;

    for (let j = 0; j < p; j++) {
      const oldCoeff = coeffs[j] ?? 0;

      // Calculate partial residual rho_j = (1/m) * sum(X_ij * (y_i - yHat_without_j))
      let rho = 0;
      for (let i = 0; i < m; i++) {
        const row = X[i]!;
        let yHatWithoutJ = intercept;
        for (let k = 0; k < p; k++) {
          if (k !== j) {
            yHatWithoutJ += (row[k] ?? 0) * (coeffs[k] ?? 0);
          }
        }
        const residualWithoutJ = y[i]! - yHatWithoutJ;
        rho += (row[j] ?? 0) * residualWithoutJ;
      }
      rho /= m;

      // Soft-thresholding update: S(rho_j, alpha) / z_j
      const newCoeff = alpha === 0 ? rho / (z[j] ?? 1) : softThreshold(rho, alpha) / (z[j] ?? 1);
      coeffs[j] = newCoeff;

      const change = Math.abs(newCoeff - oldCoeff);
      if (change > maxChange) maxChange = change;
    }

    // Update intercept: (1/m) * sum(y_i - sum(X_ij * coeffs_j))
    let sumResidual = 0;
    for (let i = 0; i < m; i++) {
      const row = X[i]!;
      let pred = 0;
      for (let j = 0; j < p; j++) {
        pred += (row[j] ?? 0) * (coeffs[j] ?? 0);
      }
      sumResidual += y[i]! - pred;
    }
    intercept = sumResidual / m;
  }

  // Evaluate
  const yPred = predictRegularized(X, coeffs, intercept);
  const { r2, mse, mae } = computeRegressionStats(y, yPred);

  let l1Sum = 0;
  let zeros = 0;
  for (let j = 0; j < p; j++) {
    const c = coeffs[j] ?? 0;
    l1Sum += Math.abs(c);
    if (Math.abs(c) < 1e-6) zeros++;
  }

  return {
    coefficients: coeffs,
    intercept,
    r2,
    mse,
    mae,
    numZeroCoefficients: zeros,
    penaltyCost: alpha * l1Sum,
    iterations: iter,
  };
}

// 3. Elastic Net Regression (combines L1 and L2 penalties)
export function fitElasticNet(
  X: number[][],
  y: number[],
  config: RegularizationConfig
): RegularizedModelResult {
  const m = X.length;
  if (m === 0) {
    return {
      coefficients: [],
      intercept: 0,
      r2: 0,
      mse: 0,
      mae: 0,
      numZeroCoefficients: 0,
      penaltyCost: 0,
      iterations: 0,
    };
  }

  const p = X[0]!.length;
  const alpha = Math.max(0, config.alpha);
  const l1Ratio = Math.max(0, Math.min(1, config.l1Ratio ?? 0.5));
  const maxIter = config.maxIterations ?? 500;
  const tol = config.tolerance ?? 1e-4;

  const coeffs: number[] = new Array<number>(p).fill(0);
  let intercept = y.reduce((acc, val) => acc + val, 0) / m;

  // Precompute z_j
  const z: number[] = new Array<number>(p).fill(0);
  for (let j = 0; j < p; j++) {
    let sumSq = 0;
    for (let i = 0; i < m; i++) {
      const val = X[i]![j] ?? 0;
      sumSq += val * val;
    }
    z[j] = sumSq / m || 1e-8;
  }

  const l1Penalty = alpha * l1Ratio;
  const l2Penalty = alpha * (1 - l1Ratio);

  let iter = 0;
  let maxChange = tol + 1;

  while (iter < maxIter && maxChange > tol) {
    maxChange = 0;
    iter++;

    for (let j = 0; j < p; j++) {
      const oldCoeff = coeffs[j] ?? 0;

      let rho = 0;
      for (let i = 0; i < m; i++) {
        const row = X[i]!;
        let yHatWithoutJ = intercept;
        for (let k = 0; k < p; k++) {
          if (k !== j) {
            yHatWithoutJ += (row[k] ?? 0) * (coeffs[k] ?? 0);
          }
        }
        rho += (row[j] ?? 0) * (y[i]! - yHatWithoutJ);
      }
      rho /= m;

      // Elastic Net denominator: z_j + l2Penalty
      const den = (z[j] ?? 1) + l2Penalty;
      const newCoeff = den === 0 ? 0 : softThreshold(rho, l1Penalty) / den;
      coeffs[j] = newCoeff;

      const change = Math.abs(newCoeff - oldCoeff);
      if (change > maxChange) maxChange = change;
    }

    let sumResidual = 0;
    for (let i = 0; i < m; i++) {
      const row = X[i]!;
      let pred = 0;
      for (let j = 0; j < p; j++) {
        pred += (row[j] ?? 0) * (coeffs[j] ?? 0);
      }
      sumResidual += y[i]! - pred;
    }
    intercept = sumResidual / m;
  }

  const yPred = predictRegularized(X, coeffs, intercept);
  const { r2, mse, mae } = computeRegressionStats(y, yPred);

  let l1Sum = 0;
  let l2Sum = 0;
  let zeros = 0;
  for (let j = 0; j < p; j++) {
    const c = coeffs[j] ?? 0;
    l1Sum += Math.abs(c);
    l2Sum += c * c;
    if (Math.abs(c) < 1e-6) zeros++;
  }

  const penaltyCost = l1Penalty * l1Sum + 0.5 * l2Penalty * l2Sum;

  return {
    coefficients: coeffs,
    intercept,
    r2,
    mse,
    mae,
    numZeroCoefficients: zeros,
    penaltyCost,
    iterations: iter,
  };
}

// Compute Regularization Path across an array of alphas
export function computeRegularizationPath(
  X: number[][],
  y: number[],
  type: 'ridge' | 'lasso' | 'elasticnet',
  alphas: number[],
  l1Ratio = 0.5
): RegularizationTracePoint[] {
  const points: RegularizationTracePoint[] = [];

  for (const a of alphas) {
    let res: RegularizedModelResult;
    if (type === 'ridge') {
      res = fitRidge(X, y, { alpha: a });
    } else if (type === 'lasso') {
      res = fitLasso(X, y, { alpha: a, maxIterations: 300 });
    } else {
      res = fitElasticNet(X, y, { alpha: a, l1Ratio, maxIterations: 300 });
    }

    const p = res.coefficients.length;
    const activeCount = p - res.numZeroCoefficients;

    points.push({
      alpha: a,
      coefficients: [...res.coefficients],
      r2: res.r2,
      mse: res.mse,
      activeFeatureCount: activeCount,
    });
  }

  return points;
}
