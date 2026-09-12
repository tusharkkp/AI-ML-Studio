import type {
  MultipleRegressionPoint,
  MultipleLinearModel,
  MultipleGDConfig,
  MultipleGDResult,
  MultipleGDStep,
} from './types';
import type { RegressionMetrics } from '../linear/types';
import { transpose, multiplyMatrix, multiplyVector, invertMatrix } from './matrix';

// Assemble Design Matrix X with bias column of 1s and target vector y
export function buildDesignMatrix(points: MultipleRegressionPoint[]): {
  X: number[][];
  y: number[];
} {
  const m = points.length;
  const X: number[][] = [];
  const y: number[] = [];

  for (let i = 0; i < m; i++) {
    const pt = points[i]!;
    X.push([1, ...pt.x]);
    y.push(pt.y);
  }

  return { X, y };
}

// Predict target for a single input vector x: y_hat = theta_0 + sum(theta_j * x_j)
export function predictMultiple(theta: number[], x: number[]): number {
  let val = theta[0] || 0;
  for (let j = 0; j < x.length; j++) {
    val += (theta[j + 1] || 0) * x[j]!;
  }
  return Number(val.toFixed(4));
}

// Compute Cost Function J(theta) = 1/(2m) * sum((y_hat - y)^2)
export function computeMultipleCost(points: MultipleRegressionPoint[], theta: number[]): number {
  const m = points.length;
  if (m === 0) return 0;

  let sumSqErr = 0;
  for (let i = 0; i < m; i++) {
    const pt = points[i]!;
    const pred = predictMultiple(theta, pt.x);
    const err = pred - pt.y;
    sumSqErr += err * err;
  }
  return sumSqErr / (2 * m);
}

// Compute regression metrics: MSE, RMSE, MAE, R^2
export function computeMultipleMetrics(
  points: MultipleRegressionPoint[],
  theta: number[]
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
    const pred = predictMultiple(theta, pt.x);
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

// Closed-Form Normal Equation: theta = (X^T * X)^(-1) * X^T * y
export function fitNormalEquation(points: MultipleRegressionPoint[]): MultipleLinearModel {
  const m = points.length;
  if (m === 0) {
    return {
      theta: [],
      featureCount: 0,
      mse: 0,
      rmse: 0,
      mae: 0,
      r2: 0,
      isSingular: true,
    };
  }

  const { X, y } = buildDesignMatrix(points);
  const d = points[0]!.x.length;

  const Xt = transpose(X);
  const XtX = multiplyMatrix(Xt, X);
  const { inverse, isSingular } = invertMatrix(XtX);

  if (isSingular) {
    return {
      theta: new Array<number>(d + 1).fill(0),
      featureCount: d,
      mse: 0,
      rmse: 0,
      mae: 0,
      r2: 0,
      isSingular: true,
    };
  }

  const XtY = multiplyVector(Xt, y);
  const rawTheta = multiplyVector(inverse, XtY);
  const theta = rawTheta.map((t) => Number(t.toFixed(4)));

  const metrics = computeMultipleMetrics(points, theta);

  return {
    theta,
    featureCount: d,
    ...metrics,
    isSingular: false,
  };
}

// Vectorized Batch Gradient Descent for Multiple Linear Regression
export function fitMultipleGradientDescent(
  points: MultipleRegressionPoint[],
  config: MultipleGDConfig
): MultipleGDResult {
  const { learningRate, maxIterations = 200, tolerance = 1e-5 } = config;

  const m = points.length;
  if (m === 0) {
    return {
      finalTheta: [],
      finalCost: 0,
      iterationsCompleted: 0,
      converged: true,
      diverged: false,
      steps: [],
    };
  }

  const { X, y } = buildDesignMatrix(points);
  const numFeatures = points[0]!.x.length + 1; // including bias
  const theta = config.initialTheta
    ? [...config.initialTheta]
    : new Array<number>(numFeatures).fill(0);

  const steps: MultipleGDStep[] = [];

  for (let iter = 0; iter <= maxIterations; iter++) {
    const cost = computeMultipleCost(points, theta);

    // Compute gradient: grad = (1/m) * X^T * (X * theta - y)
    const predictions = multiplyVector(X, theta);
    const errors: number[] = [];
    for (let i = 0; i < m; i++) {
      errors.push(predictions[i]! - y[i]!);
    }

    const Xt = transpose(X);
    const rawGrad = multiplyVector(Xt, errors);
    const gradient = rawGrad.map((g) => g / m);

    let gradNormSq = 0;
    for (let j = 0; j < gradient.length; j++) {
      gradNormSq += gradient[j]! * gradient[j]!;
    }
    const gradNorm = Math.sqrt(gradNormSq);

    steps.push({
      iteration: iter,
      theta: theta.map((t) => Number(t.toFixed(4))),
      cost: Number(cost.toFixed(4)),
      gradientNorm: Number(gradNorm.toFixed(4)),
    });

    // Divergence check
    if (!Number.isFinite(cost) || cost > 1e12 || isNaN(cost)) {
      return {
        finalTheta: theta,
        finalCost: cost,
        iterationsCompleted: iter,
        converged: false,
        diverged: true,
        steps,
      };
    }

    // Convergence check
    if (gradNorm < tolerance) {
      return {
        finalTheta: theta.map((t) => Number(t.toFixed(4))),
        finalCost: Number(cost.toFixed(4)),
        iterationsCompleted: iter,
        converged: true,
        diverged: false,
        steps,
      };
    }

    if (iter === maxIterations) {
      break;
    }

    // Simultaneous update
    for (let j = 0; j < numFeatures; j++) {
      theta[j] = theta[j]! - learningRate * gradient[j]!;
    }
  }

  return {
    finalTheta: theta.map((t) => Number(t.toFixed(4))),
    finalCost: Number(steps[steps.length - 1]!.cost),
    iterationsCompleted: maxIterations,
    converged: false,
    diverged: false,
    steps,
  };
}
