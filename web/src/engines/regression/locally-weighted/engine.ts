import type { DataPoint1D } from '../linear/types';
import type { LWRResult } from './types';

// Gaussian bell-shaped weighting kernel: w_i = exp( - (x_i - x_0)^2 / (2 * tau^2) )
export function computeGaussianWeights(
  points: DataPoint1D[],
  queryX: number,
  tau: number
): number[] {
  const twoTauSq = 2 * tau * tau;
  return points.map((p) => {
    const diff = p.x - queryX;
    return Math.exp(-(diff * diff) / twoTauSq);
  });
}

// Fit Locally Weighted Linear Regression at a specific query coordinate x_0
export function predictLWR(points: DataPoint1D[], queryX: number, tau: number): LWRResult {
  const m = points.length;
  if (m === 0) {
    return { queryX, predictedY: 0, theta0: 0, theta1: 0, weights: [] };
  }

  const weights = computeGaussianWeights(points, queryX, tau);

  let sW = 0;
  let sWX = 0;
  let sWX2 = 0;
  let sWY = 0;
  let sWXY = 0;

  for (let i = 0; i < m; i++) {
    const w = weights[i]!;
    const x = points[i]!.x;
    const y = points[i]!.y;

    sW += w;
    sWX += w * x;
    sWX2 += w * x * x;
    sWY += w * y;
    sWXY += w * x * y;
  }

  // Determinant of X^T * W * X
  const det = sW * sWX2 - sWX * sWX;

  if (Math.abs(det) < 1e-12) {
    // Fallback if weights are near zero or points collapsed
    const meanY = points.reduce((acc, p) => acc + p.y, 0) / m;
    return {
      queryX,
      predictedY: Number(meanY.toFixed(4)),
      theta0: Number(meanY.toFixed(4)),
      theta1: 0,
      weights,
    };
  }

  const theta0 = (sWX2 * sWY - sWX * sWXY) / det;
  const theta1 = (sW * sWXY - sWX * sWY) / det;

  const predictedY = theta0 + theta1 * queryX;

  return {
    queryX,
    predictedY: Number(predictedY.toFixed(4)),
    theta0: Number(theta0.toFixed(4)),
    theta1: Number(theta1.toFixed(4)),
    weights,
  };
}

// Predict smooth curve trace across an array of query grid points
export function predictLWRTrace(
  points: DataPoint1D[],
  queryGrid: number[],
  tau: number
): { x: number; y: number }[] {
  return queryGrid.map((qx) => {
    const res = predictLWR(points, qx, tau);
    return { x: qx, y: res.predictedY };
  });
}
