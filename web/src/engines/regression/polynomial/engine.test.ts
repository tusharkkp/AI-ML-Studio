import { describe, it, expect } from 'vitest';
import { fitPolynomialRegression, predictPolynomial } from './engine';
import type { DataPoint1D } from '../linear/types';

describe('Polynomial Regression Engine', () => {
  it('fits an exact line when degree = 1', () => {
    const points: DataPoint1D[] = [
      { x: 1, y: 3 },
      { x: 2, y: 5 },
      { x: 3, y: 7 },
      { x: 4, y: 9 },
    ];
    const model = fitPolynomialRegression(points, 1);
    expect(model.coefficients[0]).toBeCloseTo(1.0, 2); // Intercept
    expect(model.coefficients[1]).toBeCloseTo(2.0, 2); // Slope
    expect(model.r2).toBeCloseTo(1.0, 3);
  });

  it('recovers quadratic curve y = 2 - 3*x + x^2 when degree = 2', () => {
    const points: DataPoint1D[] = [
      { x: 0, y: 2 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 2 },
      { x: 4, y: 6 },
      { x: 5, y: 12 },
    ];
    const model = fitPolynomialRegression(points, 2);
    expect(model.coefficients[0]).toBeCloseTo(2.0, 2);
    expect(model.coefficients[1]).toBeCloseTo(-3.0, 2);
    expect(model.coefficients[2]).toBeCloseTo(1.0, 2);
    expect(model.r2).toBeCloseTo(1.0, 3);
  });

  it('predicts unseen test coordinates accurately on fitted curve', () => {
    const points: DataPoint1D[] = [
      { x: 1, y: 1 },
      { x: 2, y: 4 },
      { x: 3, y: 9 },
      { x: 4, y: 16 },
    ];
    const model = fitPolynomialRegression(points, 2);
    const yHatAt5 = predictPolynomial(model.coefficients, 5);
    expect(yHatAt5).toBeCloseTo(25.0, 1);
  });
});
