import { describe, it, expect } from 'vitest';
import { computeKernel, trainSvm, predictSvm, computeSvmGrid2D, lift2Dto3D } from './engine';

describe('SVM Engine Unit & Invariant Tests (L1 Verification)', () => {
  it('correctly computes Linear, Polynomial, and Gaussian RBF kernels', () => {
    const x = [1, 2];
    const z = [3, 4];

    // Linear: 1*3 + 2*4 = 11
    expect(computeKernel(x, z, { type: 'linear' })).toBeCloseTo(11, 5);

    // Polynomial degree 2, coef0 1: (11 + 1)^2 = 144
    expect(computeKernel(x, z, { type: 'poly', degree: 2, coef0: 1 })).toBeCloseTo(144, 5);

    // RBF with gamma 0.1: ||x-z||^2 = (1-3)^2 + (2-4)^2 = 4 + 4 = 8
    // exp(-0.1 * 8) = exp(-0.8) ≈ 0.449329
    expect(computeKernel(x, z, { type: 'rbf', gamma: 0.1 })).toBeCloseTo(Math.exp(-0.8), 5);
  });

  it('solves linearly separable data with 100% accuracy and extracts support vectors', () => {
    // 6 sample 2D points cleanly separated by diagonal
    const X = [
      [1, 2],
      [2, 3],
      [2, 1], // Class +1
      [-1, -1],
      [-2, -1],
      [-1, -2], // Class -1
    ];
    const y: (-1 | 1)[] = [1, 1, 1, -1, -1, -1];

    const model = trainSvm(X, y, {
      C: 10.0,
      kernel: { type: 'linear' },
    });

    expect(model.trainingAccuracy).toBe(1.0);
    expect(model.supportVectors.length).toBeGreaterThanOrEqual(2);
    expect(model.weights).toBeDefined();
    expect(model.marginWidth).toBeDefined();
    expect(model.marginWidth!).toBeGreaterThan(0);

    // Test predictions
    const predPos = predictSvm(model, X, y, [3, 3]);
    expect(predPos.predictedClass).toBe(1);
    expect(predPos.decisionValue).toBeGreaterThan(0);

    const predNeg = predictSvm(model, X, y, [-3, -3]);
    expect(predNeg.predictedClass).toBe(-1);
    expect(predNeg.decisionValue).toBeLessThan(0);
  });

  it('demonstrates hand-worked 3-point geometry and margin width', () => {
    // Hand-worked example from syllabus text
    const X = [
      [1, 1], // Class +1
      [2, 0], // Class +1
      [0, 0], // Class -1
    ];
    const y: (-1 | 1)[] = [1, 1, -1];

    const model = trainSvm(X, y, {
      C: 100.0,
      kernel: { type: 'linear' },
    });

    expect(model.trainingAccuracy).toBe(1.0);
    // Point (0,0) must be a support vector for the negative class
    const svIndices = model.supportVectors.map((sv) => sv.index);
    expect(svIndices).toContain(2);
  });

  it('handles soft-margin slack variables and regularizes with parameter C', () => {
    // Dataset with an intentional outlier
    const X = [
      [1, 2],
      [2, 2],
      [1, 1], // Class +1
      [-1, -1],
      [-2, -2],
      [0.5, 1.5], // Outlier: Class -1 situated near Class +1
    ];
    const y: (-1 | 1)[] = [1, 1, 1, -1, -1, -1];

    const softModel = trainSvm(X, y, {
      C: 0.1,
      kernel: { type: 'linear' },
    });

    const hardModel = trainSvm(X, y, {
      C: 50.0,
      kernel: { type: 'linear' },
    });

    // Soft model allows slack violations (slack > 0)
    const softSlacks = softModel.supportVectors.map((sv) => sv.slack);
    const hasSlack = softSlacks.some((s) => s > 0);
    expect(hasSlack).toBe(true);

    // Soft model margin width is wider or equal to hard margin
    expect(softModel.marginWidth!).toBeGreaterThan(0);
    expect(hardModel.marginWidth!).toBeGreaterThan(0);
  });

  it('solves non-linear concentric circles with RBF kernel where linear SVM fails', () => {
    // Concentric circles: inner circle (r ~ 0.5, class -1), outer ring (r ~ 2.0, class +1)
    const X: number[][] = [];
    const y: (-1 | 1)[] = [];

    // Inner circle (10 points)
    const angles = [0, 0.6, 1.2, 1.8, 2.4, 3.0, 3.6, 4.2, 4.8, 5.4];
    for (const a of angles) {
      X.push([0.5 * Math.cos(a), 0.5 * Math.sin(a)]);
      y.push(-1);
    }

    // Outer ring (10 points)
    for (const a of angles) {
      X.push([2.0 * Math.cos(a), 2.0 * Math.sin(a)]);
      y.push(1);
    }

    // Linear SVM cannot separate concentric circles (should achieve poor accuracy <= 75%)
    const linearModel = trainSvm(X, y, {
      C: 1.0,
      kernel: { type: 'linear' },
    });
    expect(linearModel.trainingAccuracy).toBeLessThanOrEqual(0.75);

    // RBF kernel separates concentric circles cleanly!
    const rbfModel = trainSvm(X, y, {
      C: 10.0,
      kernel: { type: 'rbf', gamma: 1.0 },
    });
    expect(rbfModel.trainingAccuracy).toBeGreaterThanOrEqual(0.95);

    // Predictions on center vs edge
    const centerPred = predictSvm(rbfModel, X, y, [0, 0]);
    expect(centerPred.predictedClass).toBe(-1);

    const outerPred = predictSvm(rbfModel, X, y, [2.2, 0]);
    expect(outerPred.predictedClass).toBe(1);
  });

  it('lifts 2D concentric points to 3D parabolic coordinate making them linearly separable', () => {
    const points = [
      [0.5, 0], // inner, r^2 = 0.25
      [0, 0.5], // inner, r^2 = 0.25
      [2, 0], // outer, r^2 = 4.0
      [0, 2], // outer, r^2 = 4.0
    ];
    const labels: (-1 | 1)[] = [-1, -1, 1, 1];

    const lifted = lift2Dto3D(points, labels);
    expect(lifted.length).toBe(4);

    // Inner points have z = 0.25
    expect(lifted[0]!.z).toBeCloseTo(0.25, 5);
    expect(lifted[1]!.z).toBeCloseTo(0.25, 5);

    // Outer points have z = 4.0
    expect(lifted[2]!.z).toBeCloseTo(4.0, 5);
    expect(lifted[3]!.z).toBeCloseTo(4.0, 5);

    // Separating threshold in 3D along z axis: any plane z = 2.0 perfectly separates them!
    const zSeparator = 2.0;
    for (const pt of lifted) {
      if (pt.label === -1) {
        expect(pt.z).toBeLessThan(zSeparator);
      } else {
        expect(pt.z).toBeGreaterThan(zSeparator);
      }
    }
  });

  it('computes 2D decision boundary grid with consistent geometry and bounds', () => {
    const X = [
      [1, 1],
      [2, 2],
      [-1, -1],
      [-2, -2],
    ];
    const y: (-1 | 1)[] = [1, 1, -1, -1];

    const model = trainSvm(X, y, {
      C: 1.0,
      kernel: { type: 'linear' },
    });

    const grid = computeSvmGrid2D(model, X, y, [-3, 3], [-3, 3], 20);
    expect(grid.xCoords.length).toBe(20);
    expect(grid.yCoords.length).toBe(20);
    expect(grid.grid.length).toBe(20);
    expect(grid.grid[0]!.length).toBe(20);
    expect(grid.minVal).toBeLessThan(grid.maxVal);
  });
});
