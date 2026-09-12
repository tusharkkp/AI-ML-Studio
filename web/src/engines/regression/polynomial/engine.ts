import type { DataPoint1D, RegressionMetrics } from '../linear/types';
import type { PolynomialModel } from './types';
import { transpose, multiplyMatrix, multiplyVector, invertMatrix } from '../multiple/matrix';

// Expand scalar feature x into polynomial basis powers: [1, x, x^2, ..., x^d]
export function expandPolynomialBasis(x: number, degree: number): number[] {
  const basis: number[] = [1];
  let cur = 1;
  for (let k = 1; k <= degree; k++) {
    cur *= x;
    basis.push(cur);
  }
  return basis;
}

// Predict target value using polynomial coefficients: y_hat = sum(theta_k * x^k)
export function predictPolynomial(coefficients: number[], x: number): number {
  let yHat = 0;
  let cur = 1;
  for (let k = 0; k < coefficients.length; k++) {
    yHat += (coefficients[k] || 0) * cur;
    cur *= x;
  }
  return Number(yHat.toFixed(4));
}

// Compute standard regression metrics for polynomial model
export function computePolynomialMetrics(
  points: DataPoint1D[],
  coefficients: number[]
): RegressionMetrics {
  const m = points.length;
  if (m === 0) {
    return { mse: 0, rmse: 0, mae: 0, r2: 0 };
  }

  let sse = 0;
  let sae = 0;
  let sumY = 0;

  for (let i = 0; i < m; i++) {
    const pt = points[i]!;
    const pred = predictPolynomial(coefficients, pt.x);
    const err = pred - pt.y;
    sse += err * err;
    sae += Math.abs(err);
    sumY += pt.y;
  }

  const meanY = sumY / m;
  let sst = 0;
  for (let i = 0; i < m; i++) {
    const diff = points[i]!.y - meanY;
    sst += diff * diff;
  }

  const mse = sse / m;
  const rmse = Math.sqrt(mse);
  const mae = sae / m;
  const r2 = sst === 0 ? 1 : 1 - sse / sst;

  return {
    mse: Number(mse.toFixed(4)),
    rmse: Number(rmse.toFixed(4)),
    mae: Number(mae.toFixed(4)),
    r2: Number(r2.toFixed(4)),
  };
}

// Fit Polynomial Regression Model using closed-form Normal Equation on Vandermonde Matrix
export function fitPolynomialRegression(points: DataPoint1D[], degree: number): PolynomialModel {
  const m = points.length;
  if (m === 0) {
    return {
      degree,
      coefficients: [],
      mse: 0,
      rmse: 0,
      mae: 0,
      r2: 0,
    };
  }

  // Construct Vandermonde design matrix X: (m x (degree + 1))
  const X: number[][] = [];
  const y: number[] = [];

  for (let i = 0; i < m; i++) {
    const pt = points[i]!;
    X.push(expandPolynomialBasis(pt.x, degree));
    y.push(pt.y);
  }

  const Xt = transpose(X);
  const XtX = multiplyMatrix(Xt, X);

  // Optional tiny L2 ridge regularizer along diagonal to guarantee numerical stability for high degrees
  const d = degree + 1;
  const lambda = 1e-8;
  for (let i = 0; i < d; i++) {
    const row = XtX[i];
    if (row) {
      const curVal = row[i] ?? 0;
      row[i] = curVal + lambda;
    }
  }

  const { inverse, isSingular } = invertMatrix(XtX);

  if (isSingular) {
    return {
      degree,
      coefficients: new Array<number>(degree + 1).fill(0),
      mse: 0,
      rmse: 0,
      mae: 0,
      r2: 0,
    };
  }

  const XtY = multiplyVector(Xt, y);
  const rawCoeffs = multiplyVector(inverse, XtY);
  const coefficients = rawCoeffs.map((c) => Number(c.toFixed(6)));

  const metrics = computePolynomialMetrics(points, coefficients);

  return {
    degree,
    coefficients,
    ...metrics,
  };
}
