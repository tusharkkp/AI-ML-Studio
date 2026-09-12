import { describe, it, expect } from 'vitest';
import { invertMatrix, multiplyMatrix } from './matrix';
import { fitNormalEquation, fitMultipleGradientDescent } from './engine';
import type { MultipleRegressionPoint } from './types';

describe('Matrix Operations', () => {
  it('correctly inverts an invertible 2x2 matrix', () => {
    const A = [
      [4, 7],
      [2, 6],
    ];
    const { inverse, isSingular, determinant } = invertMatrix(A);
    expect(isSingular).toBe(false);
    expect(determinant).toBeCloseTo(10, 3);

    // A * A^(-1) = I
    const identity = multiplyMatrix(A, inverse);
    expect(identity[0]![0]).toBeCloseTo(1, 5);
    expect(identity[0]![1]).toBeCloseTo(0, 5);
    expect(identity[1]![0]).toBeCloseTo(0, 5);
    expect(identity[1]![1]).toBeCloseTo(1, 5);
  });

  it('detects a singular matrix with collinear rows/columns', () => {
    const singular = [
      [2, 4],
      [4, 8],
    ];
    const { isSingular } = invertMatrix(singular);
    expect(isSingular).toBe(true);
  });
});

describe('Multiple Linear Regression Normal Equation', () => {
  it('recovers exact true parameters for y = 5 + 3*x1 - 2*x2', () => {
    const points: MultipleRegressionPoint[] = [
      { x: [1, 1], y: 5 + 3 * 1 - 2 * 1 }, // 6
      { x: [2, 1], y: 5 + 3 * 2 - 2 * 1 }, // 9
      { x: [1, 3], y: 5 + 3 * 1 - 2 * 3 }, // 2
      { x: [3, 4], y: 5 + 3 * 3 - 2 * 4 }, // 6
      { x: [4, 2], y: 5 + 3 * 4 - 2 * 2 }, // 13
    ];

    const model = fitNormalEquation(points);
    expect(model.isSingular).toBe(false);
    expect(model.theta[0]).toBeCloseTo(5.0, 3); // Intercept theta_0
    expect(model.theta[1]).toBeCloseTo(3.0, 3); // Slope theta_1
    expect(model.theta[2]).toBeCloseTo(-2.0, 3); // Slope theta_2
    expect(model.r2).toBeCloseTo(1.0, 3);
    expect(model.mse).toBeCloseTo(0.0, 3);
  });

  it('flags isSingular when features exhibit perfect multicollinearity (x2 = 2*x1)', () => {
    const collinearPoints: MultipleRegressionPoint[] = [
      { x: [1, 2], y: 10 },
      { x: [2, 4], y: 15 },
      { x: [3, 6], y: 20 },
      { x: [4, 8], y: 25 },
    ];

    const model = fitNormalEquation(collinearPoints);
    expect(model.isSingular).toBe(true);
  });
});

describe('Multiple Gradient Descent', () => {
  it('converges toward Normal Equation solution', () => {
    const points: MultipleRegressionPoint[] = [
      { x: [0.1, 0.2], y: 1.5 },
      { x: [0.3, 0.1], y: 1.9 },
      { x: [0.5, 0.4], y: 2.8 },
      { x: [0.7, 0.6], y: 3.6 },
      { x: [0.9, 0.8], y: 4.5 },
    ];

    const normalModel = fitNormalEquation(points);
    expect(normalModel.isSingular).toBe(false);

    const gdResult = fitMultipleGradientDescent(points, {
      learningRate: 0.2,
      maxIterations: 200,
      initialTheta: [0, 0, 0],
    });

    expect(gdResult.diverged).toBe(false);
    // Cost monotonically decreases
    expect(gdResult.steps[gdResult.steps.length - 1]!.cost).toBeLessThan(gdResult.steps[0]!.cost);
  });
});
