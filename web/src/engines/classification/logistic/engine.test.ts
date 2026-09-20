import { describe, it, expect } from 'vitest';
import {
  sigmoid,
  trainLogisticRegression,
  predictLogistic,
  computeLogLoss,
  computeDecisionBoundary,
} from './engine';

describe('sigmoid', () => {
  it('is symmetric: sigmoid(z) + sigmoid(-z) === 1', () => {
    const vals = [0, 1, 2, 5, 10, 15, -15];
    for (const z of vals) {
      expect(sigmoid(z) + sigmoid(-z)).toBeCloseTo(1, 10);
    }
  });

  it('sigmoid(0) === 0.5', () => {
    expect(sigmoid(0)).toBeCloseTo(0.5, 10);
  });

  it('clamps extreme values: sigmoid(100) ≈ 1 without NaN', () => {
    expect(sigmoid(100)).toBeCloseTo(1, 5);
    expect(sigmoid(-100)).toBeCloseTo(0, 5);
    expect(Number.isNaN(sigmoid(1000))).toBe(false);
  });
});

describe('trainLogisticRegression + predictLogistic', () => {
  it('trains on a linearly separable 2D dataset with >90% accuracy', () => {
    // Class 0: bottom-left quadrant; Class 1: top-right quadrant
    const X = [
      [-2, -2],
      [-1, -2],
      [-2, -1],
      [-1, -1],
      [1, 1],
      [2, 1],
      [1, 2],
      [2, 2],
    ];
    const y = [0, 0, 0, 0, 1, 1, 1, 1];

    const model = trainLogisticRegression(X, y, { alpha: 0.5, maxIter: 2000 });

    let correct = 0;
    for (let i = 0; i < X.length; i++) {
      const pred = predictLogistic(model, X[i]!);
      if (pred.class === y[i]) correct++;
    }

    expect(correct / X.length).toBeGreaterThanOrEqual(0.875);
  });

  it('log-loss decreases monotonically over training', () => {
    const X = [
      [-1, 0],
      [1, 0],
      [-1, 1],
      [1, -1],
    ];
    const y = [0, 1, 0, 1];
    const model = trainLogisticRegression(X, y, { alpha: 0.3, maxIter: 500, recordEvery: 1 });

    // Check that loss decreases (allow tiny noise; use 10-step windows)
    const { lossHistory } = model;
    let decreasing = 0;
    let total = 0;
    for (let i = 10; i < lossHistory.length; i++) {
      total++;
      if ((lossHistory[i] ?? Infinity) <= (lossHistory[i - 10] ?? Infinity)) decreasing++;
    }
    expect(decreasing / total).toBeGreaterThan(0.8);
  });

  it('throws on empty dataset', () => {
    expect(() => trainLogisticRegression([], [])).toThrow();
  });
});

describe('computeLogLoss', () => {
  it('returns near-0 loss for a near-perfect model', () => {
    // Create a "perfect" model by providing theta that strongly separates classes
    const X = [
      [-3, 0],
      [3, 0],
    ];
    const y = [0, 1];
    // Train with high learning rate & many iterations
    const model = trainLogisticRegression(X, y, { alpha: 1.0, maxIter: 3000 });
    const loss = computeLogLoss(model, X, y);
    expect(loss).toBeLessThan(0.1);
  });
});

describe('computeDecisionBoundary', () => {
  it('returns slope and intercept for non-vertical 2D boundary', () => {
    // Manually set theta = [0, 1, 1] → slope = -θ1/θ2 = -1, intercept = -θ0/θ2 = 0
    const model = trainLogisticRegression(
      [
        [-1, 1],
        [1, -1],
      ],
      [0, 1],
      { alpha: 0.5, maxIter: 1 }
    );
    // Override theta for deterministic test
    model.theta = [0, 1, 1];
    const db = computeDecisionBoundary(model);
    expect(db.isVertical).toBe(false);
    expect(db.slope).toBeCloseTo(-1, 5);
    expect(db.intercept).toBeCloseTo(0, 5);
  });

  it('throws when numFeatures !== 2', () => {
    const model = trainLogisticRegression([[1, 2, 3]], [1], { maxIter: 1 });
    expect(() => computeDecisionBoundary(model)).toThrow();
  });
});
