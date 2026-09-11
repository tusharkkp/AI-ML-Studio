import { describe, it, expect } from 'vitest';
import {
  computeCost,
  computeMetrics,
  fitSimpleLinearRegression,
  runGradientDescent,
} from './engine';
import type { DataPoint1D } from './types';

describe('Linear Regression Engine (regression/linear)', () => {
  it('computes zero cost for points lying perfectly on the line', () => {
    // y = 2x + 3
    const points: DataPoint1D[] = [
      { x: 1, y: 5 },
      { x: 2, y: 7 },
      { x: 3, y: 9 },
      { x: 4, y: 11 },
    ];
    const cost = computeCost(points, 3, 2);
    expect(cost).toBe(0);

    const metrics = computeMetrics(points, 3, 2);
    expect(metrics.mse).toBe(0);
    expect(metrics.rmse).toBe(0);
    expect(metrics.mae).toBe(0);
    expect(metrics.r2).toBe(1);
  });

  it('analytically recovers exact slope and intercept via OLS', () => {
    // y = -1.5x + 10
    const points: DataPoint1D[] = [
      { x: 0, y: 10 },
      { x: 2, y: 7 },
      { x: 4, y: 4 },
      { x: 6, y: 1 },
    ];
    const model = fitSimpleLinearRegression(points);
    expect(model.theta0).toBeCloseTo(10, 3);
    expect(model.theta1).toBeCloseTo(-1.5, 3);
    expect(model.r2).toBeCloseTo(1.0, 3);
  });

  it('fits authentic Salary_Data sample with R^2 >= 0.95', () => {
    // Sampled subset from Salary_Data.csv (YearsExperience, Salary in k$)
    const salarySample: DataPoint1D[] = [
      { x: 1.1, y: 39.34 },
      { x: 2.0, y: 43.52 },
      { x: 3.2, y: 54.44 },
      { x: 4.0, y: 55.79 },
      { x: 5.1, y: 66.02 },
      { x: 6.0, y: 93.94 },
      { x: 7.9, y: 101.3 },
      { x: 9.0, y: 105.58 },
      { x: 10.5, y: 121.87 },
    ];
    const model = fitSimpleLinearRegression(salarySample);

    // Standard expected OLS slope is around 9.2 - 9.8 k$/year
    expect(model.theta1).toBeGreaterThan(8.5);
    expect(model.theta1).toBeLessThan(10.5);
    expect(model.theta0).toBeGreaterThan(20);
    expect(model.theta0).toBeLessThan(32);
    expect(model.r2).toBeGreaterThan(0.95);
  });

  it('converges monotonically with appropriate learning rate under Gradient Descent', () => {
    // Normalized centered data
    const points: DataPoint1D[] = [
      { x: -2, y: -4 },
      { x: -1, y: -2 },
      { x: 0, y: 0 },
      { x: 1, y: 2 },
      { x: 2, y: 4 },
    ];
    // Target is y = 2x + 0
    const result = runGradientDescent(points, {
      learningRate: 0.1,
      maxIterations: 50,
      initialTheta0: 5, // start off-center
      initialTheta1: -3,
    });

    expect(result.diverged).toBe(false);
    expect(result.steps.length).toBeGreaterThan(5);

    // Cost should decrease steadily from step 0 to final step
    const initialCost = result.steps[0]!.cost;
    const finalCost = result.steps[result.steps.length - 1]!.cost;
    expect(finalCost).toBeLessThan(initialCost);
    expect(result.finalTheta1).toBeCloseTo(2.0, 1);
    expect(result.finalTheta0).toBeCloseTo(0.0, 1);
  });

  it('detects divergence when learning rate is excessively large (Make It Fail mode)', () => {
    const points: DataPoint1D[] = [
      { x: 1, y: 2 },
      { x: 2, y: 4 },
      { x: 3, y: 6 },
    ];
    // Huge learning rate causing oscillation explosion
    const result = runGradientDescent(points, {
      learningRate: 3.5,
      maxIterations: 30,
      initialTheta0: 10,
      initialTheta1: 10,
    });

    expect(result.diverged).toBe(true);
  });
});
