import { describe, it, expect } from 'vitest';
import {
  softThreshold,
  fitRidge,
  fitLasso,
  fitElasticNet,
  computeRegularizationPath,
} from './engine';

describe('Regularization Suite (Ridge, Lasso, Elastic Net)', () => {
  it('computes soft-thresholding operator correctly', () => {
    expect(softThreshold(5, 2)).toBe(3);
    expect(softThreshold(-5, 2)).toBe(-3);
    expect(softThreshold(1.5, 2)).toBe(0);
    expect(softThreshold(-1.5, 2)).toBe(0);
    expect(softThreshold(0, 1)).toBe(0);
  });

  // Synthetic dataset: y = 5 + 3*x1 - 2*x2 + 0*x3 (x3 is useless noise)
  const X = [
    [1, 2, 9],
    [2, 1, 3],
    [3, 4, 8],
    [4, 3, 2],
    [5, 5, 7],
    [6, 4, 1],
    [7, 6, 9],
    [8, 5, 4],
  ];
  // y = 5 + 3*x1 - 2*x2
  const y = [4, 9, 6, 11, 10, 15, 14, 19];

  it('shrinks Ridge coefficients as alpha increases without setting them to exact zero', () => {
    const modelLow = fitRidge(X, y, { alpha: 0.001 });
    const modelHigh = fitRidge(X, y, { alpha: 10.0 });

    // High alpha should produce smaller L2 norm of coefficients
    const normLow = modelLow.coefficients.reduce((sum, c) => sum + c * c, 0);
    const normHigh = modelHigh.coefficients.reduce((sum, c) => sum + c * c, 0);

    expect(normHigh).toBeLessThan(normLow);
    // Ridge coefficients should remain non-zero
    expect(Math.abs(modelHigh.coefficients[0]!)).toBeGreaterThan(0.01);
  });

  it('zeros out irrelevant noise features in Lasso (sparsity)', () => {
    // With higher regularization penalty, Lasso zeros out noise feature x3
    const lassoModel = fitLasso(X, y, { alpha: 8.0, maxIterations: 500 });
    expect(lassoModel.coefficients.length).toBe(3);
    // Noise feature x3 should be driven strictly to zero
    expect(Math.abs(lassoModel.coefficients[2]!)).toBe(0);
    expect(lassoModel.numZeroCoefficients).toBeGreaterThanOrEqual(1);
  });

  it('fits Elastic Net with balanced L1 and L2 penalty', () => {
    const enModel = fitElasticNet(X, y, { alpha: 0.5, l1Ratio: 0.5, maxIterations: 500 });
    expect(enModel.coefficients.length).toBe(3);
    expect(enModel.r2).toBeGreaterThan(0.8);
  });

  it('computes regularization shrinkage path across alpha sweep', () => {
    const alphas = [0.01, 0.1, 1.0, 10.0];
    const path = computeRegularizationPath(X, y, 'ridge', alphas);
    expect(path.length).toBe(4);
    expect(path[0]!.alpha).toBe(0.01);
    expect(path[3]!.alpha).toBe(10.0);
  });
});
