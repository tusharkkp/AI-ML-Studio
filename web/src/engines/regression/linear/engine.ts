import type {
  DataPoint1D,
  RegressionMetrics,
  SimpleLinearModel,
  GradientDescentConfig,
  GradientDescentStep,
  GradientDescentResult,
} from './types';

// Mean Squared Error Cost Function: J(theta0, theta1) = 1/(2m) * sum((h(x) - y)^2)
export function computeCost(points: DataPoint1D[], theta0: number, theta1: number): number {
  const m = points.length;
  if (m === 0) return 0;

  let sumSquaredErrors = 0;
  for (let i = 0; i < m; i++) {
    const pt = points[i]!;
    const prediction = theta0 + theta1 * pt.x;
    const error = prediction - pt.y;
    sumSquaredErrors += error * error;
  }
  return sumSquaredErrors / (2 * m);
}

// Compute standard regression metrics: MSE, RMSE, MAE, R^2
export function computeMetrics(
  points: DataPoint1D[],
  theta0: number,
  theta1: number
): RegressionMetrics {
  const m = points.length;
  if (m === 0) {
    return { mse: 0, rmse: 0, mae: 0, r2: 0 };
  }

  let sse = 0; // Sum of Squared Errors
  let sae = 0; // Sum of Absolute Errors
  let sumY = 0;

  for (let i = 0; i < m; i++) {
    const pt = points[i]!;
    const prediction = theta0 + theta1 * pt.x;
    const error = prediction - pt.y;
    sse += error * error;
    sae += Math.abs(error);
    sumY += pt.y;
  }

  const meanY = sumY / m;
  let sst = 0; // Total Sum of Squares sum((y - y_mean)^2)
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

// Analytical Closed-Form OLS Solution for Simple Linear Regression
export function fitSimpleLinearRegression(points: DataPoint1D[]): SimpleLinearModel {
  const m = points.length;
  if (m === 0) {
    return { theta0: 0, theta1: 0, mse: 0, rmse: 0, mae: 0, r2: 0 };
  }

  let sumX = 0;
  let sumY = 0;
  for (let i = 0; i < m; i++) {
    sumX += points[i]!.x;
    sumY += points[i]!.y;
  }
  const meanX = sumX / m;
  const meanY = sumY / m;

  let numerator = 0;
  let denominator = 0;
  for (let i = 0; i < m; i++) {
    const pt = points[i]!;
    const dx = pt.x - meanX;
    const dy = pt.y - meanY;
    numerator += dx * dy;
    denominator += dx * dx;
  }

  const theta1 = denominator === 0 ? 0 : numerator / denominator;
  const theta0 = meanY - theta1 * meanX;

  const metrics = computeMetrics(points, theta0, theta1);

  return {
    theta0: Number(theta0.toFixed(4)),
    theta1: Number(theta1.toFixed(4)),
    ...metrics,
  };
}

// Standard Z-Score Feature Normalization
export function normalizeFeatures(points: DataPoint1D[]): {
  normalized: DataPoint1D[];
  xMean: number;
  xStd: number;
  yMean: number;
  yStd: number;
} {
  const m = points.length;
  if (m === 0) {
    return { normalized: [], xMean: 0, xStd: 1, yMean: 0, yStd: 1 };
  }

  const sumX = points.reduce((acc, p) => acc + p.x, 0);
  const sumY = points.reduce((acc, p) => acc + p.y, 0);
  const xMean = sumX / m;
  const yMean = sumY / m;

  const varX = points.reduce((acc, p) => acc + (p.x - xMean) ** 2, 0) / m;
  const varY = points.reduce((acc, p) => acc + (p.y - yMean) ** 2, 0) / m;
  const xStd = Math.sqrt(varX) || 1;
  const yStd = Math.sqrt(varY) || 1;

  const normalized = points.map((p) => ({
    x: Number(((p.x - xMean) / xStd).toFixed(4)),
    y: Number(((p.y - yMean) / yStd).toFixed(4)),
  }));

  return { normalized, xMean, xStd, yMean, yStd };
}

// Gradient Descent for Simple Linear Regression (Batch, Stochastic, or Mini-Batch)
export function runGradientDescent(
  points: DataPoint1D[],
  config: GradientDescentConfig
): GradientDescentResult {
  const {
    learningRate,
    maxIterations = 100,
    initialTheta0 = 0,
    initialTheta1 = 0,
    tolerance = 1e-6,
    variant = 'batch',
    batchSize = 4,
    seed = 42,
  } = config;

  const m = points.length;
  if (m === 0) {
    return {
      finalTheta0: 0,
      finalTheta1: 0,
      finalCost: 0,
      iterationsCompleted: 0,
      converged: true,
      diverged: false,
      steps: [],
    };
  }

  const steps: GradientDescentStep[] = [];
  let t0 = initialTheta0;
  let t1 = initialTheta1;
  let rngState = seed;

  const pseudoRandom = () => {
    rngState = (rngState * 1664525 + 1013904223) % 4294967296;
    return rngState / 4294967296;
  };

  for (let iter = 0; iter <= maxIterations; iter++) {
    const cost = computeCost(points, t0, t1);

    // Compute gradients based on variant
    let samplePoints: DataPoint1D[] = points;
    if (variant === 'stochastic') {
      const idx = Math.floor(pseudoRandom() * m);
      samplePoints = [points[idx]!];
    } else if (variant === 'mini-batch') {
      const actualSize = Math.min(m, Math.max(1, batchSize));
      const startIdx = Math.floor(pseudoRandom() * (m - actualSize + 1));
      samplePoints = points.slice(startIdx, startIdx + actualSize);
    }

    const nSample = samplePoints.length;
    let grad0 = 0;
    let grad1 = 0;
    for (let i = 0; i < nSample; i++) {
      const pt = samplePoints[i]!;
      const diff = t0 + t1 * pt.x - pt.y;
      grad0 += diff;
      grad1 += diff * pt.x;
    }
    grad0 = grad0 / nSample;
    grad1 = grad1 / nSample;

    steps.push({
      iteration: iter,
      theta0: Number(t0.toFixed(4)),
      theta1: Number(t1.toFixed(4)),
      gradTheta0: Number(grad0.toFixed(4)),
      gradTheta1: Number(grad1.toFixed(4)),
      cost: Number(cost.toFixed(4)),
    });

    // Divergence check
    if (!Number.isFinite(cost) || cost > 1e12 || isNaN(cost)) {
      return {
        finalTheta0: t0,
        finalTheta1: t1,
        finalCost: cost,
        iterationsCompleted: iter,
        converged: false,
        diverged: true,
        steps,
      };
    }

    // Convergence check
    if (Math.abs(grad0) < tolerance && Math.abs(grad1) < tolerance && variant === 'batch') {
      return {
        finalTheta0: Number(t0.toFixed(4)),
        finalTheta1: Number(t1.toFixed(4)),
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
    t0 = t0 - learningRate * grad0;
    t1 = t1 - learningRate * grad1;
  }

  return {
    finalTheta0: Number(t0.toFixed(4)),
    finalTheta1: Number(t1.toFixed(4)),
    finalCost: Number(steps[steps.length - 1]!.cost),
    iterationsCompleted: maxIterations,
    converged: false,
    diverged: false,
    steps,
  };
}
