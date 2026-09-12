import { describe, it, expect } from 'vitest';
import { computeGaussianWeights, predictLWR } from './engine';
import type { DataPoint1D } from '../linear/types';

describe('Locally Weighted Linear Regression Engine', () => {
  it('assigns weight 1.0 to point exactly at queryX and decays with distance', () => {
    const points: DataPoint1D[] = [
      { x: 2.0, y: 10 },
      { x: 5.0, y: 25 },
      { x: 8.0, y: 40 },
    ];

    const weights = computeGaussianWeights(points, 5.0, 1.0);
    expect(weights[1]).toBeCloseTo(1.0, 5); // at x = 5
    expect(weights[0]!).toBeLessThan(0.02); // 3 units away
    expect(weights[2]!).toBeLessThan(0.02); // 3 units away
  });

  it('tracks an exact straight line when data is linear', () => {
    const linePoints: DataPoint1D[] = [
      { x: 1, y: 3 },
      { x: 2, y: 5 },
      { x: 3, y: 7 },
      { x: 4, y: 9 },
      { x: 5, y: 11 },
    ];

    const res = predictLWR(linePoints, 3.5, 1.0);
    expect(res.predictedY).toBeCloseTo(8.0, 2); // 2*3.5 + 1 = 8
  });

  it('approaches ordinary least squares line as bandwidth tau approaches infinity', () => {
    const points: DataPoint1D[] = [
      { x: 1, y: 2 },
      { x: 2, y: 4 },
      { x: 3, y: 5 },
      { x: 4, y: 4 },
      { x: 5, y: 5 },
    ];

    const largeTau = predictLWR(points, 3.0, 1000.0);
    // At tau = 1000, all weights w_i ~ 1.0
    expect(largeTau.weights[0]).toBeCloseTo(1.0, 3);
    expect(largeTau.weights[4]).toBeCloseTo(1.0, 3);
  });
});
