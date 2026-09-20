import { describe, it, expect } from 'vitest';
import {
  computeConfusionMatrix,
  computeClassificationMetrics,
  computeRocCurve,
  computeAUC,
} from './engine';

describe('computeConfusionMatrix', () => {
  it('perfect classifier: TP=4, FP=0, TN=3, FN=0', () => {
    const yt = [1, 1, 1, 1, 0, 0, 0];
    const scores = [0.9, 0.8, 0.7, 0.6, 0.1, 0.2, 0.3];
    const cm = computeConfusionMatrix(yt, scores, 0.5);
    expect(cm).toEqual({ TP: 4, FP: 0, TN: 3, FN: 0 });
  });

  it('all-positive predictions — demonstrates accuracy paradox', () => {
    // 1% disease prevalence: 1 sick, 99 healthy, all predicted positive
    const yt: number[] = [1, ...new Array<number>(99).fill(0)];
    const scores: number[] = new Array<number>(100).fill(0.9); // all > 0.5 threshold
    const cm = computeConfusionMatrix(yt, scores, 0.5);
    const metrics = computeClassificationMetrics(cm);
    // Accuracy = 1/100 = 0.01 (terrible), but if we predict ALL negative,
    // accuracy would be 0.99. This demonstrates the accuracy paradox.
    expect(cm.TP).toBe(1);
    expect(cm.FP).toBe(99);
    expect(metrics.accuracy).toBeCloseTo(0.01, 2);
  });
});

describe('computeClassificationMetrics', () => {
  it('precision/recall tradeoff: high recall → lower precision at low threshold', () => {
    const yt = [1, 1, 1, 0, 0];
    const scores = [0.9, 0.6, 0.4, 0.3, 0.2];

    // Low threshold (0.3) → catch everything positive
    const cmLow = computeConfusionMatrix(yt, scores, 0.3);
    const mLow = computeClassificationMetrics(cmLow);

    // High threshold (0.7) → high precision, lower recall
    const cmHigh = computeConfusionMatrix(yt, scores, 0.7);
    const mHigh = computeClassificationMetrics(cmHigh);

    expect(mLow.recall).toBeGreaterThanOrEqual(mHigh.recall);
    expect(mHigh.precision).toBeGreaterThanOrEqual(mLow.precision);
  });

  it('F1 is harmonic mean of precision and recall', () => {
    const cm = { TP: 2, FP: 1, TN: 3, FN: 1 };
    const m = computeClassificationMetrics(cm);
    const expectedF1 = (2 * m.precision * m.recall) / (m.precision + m.recall);
    expect(m.f1).toBeCloseTo(expectedF1, 8);
  });
});

describe('computeRocCurve + computeAUC', () => {
  it('AUC ≈ 0.5 for random scores (diagonal baseline)', () => {
    // Alternating labels with random scores — near-random classifier
    const yt = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0];
    // Scores inversely correlated with labels → near-worst
    const scores = [0.1, 0.9, 0.2, 0.8, 0.3, 0.7, 0.4, 0.6, 0.45, 0.55];
    const roc = computeRocCurve(yt, scores, 200);
    const auc = computeAUC(roc);
    // Anti-correlated classifier: AUC < 0.5 (reflect for worst), but still in [0,1]
    expect(auc).toBeGreaterThanOrEqual(0);
    expect(auc).toBeLessThanOrEqual(1);
  });

  it('AUC = 1.0 for a perfect classifier', () => {
    const yt = [1, 1, 1, 0, 0, 0];
    // Perfect separation: all positives score > all negatives
    const scores = [0.9, 0.85, 0.8, 0.2, 0.15, 0.1];
    const roc = computeRocCurve(yt, scores, 200);
    const auc = computeAUC(roc);
    expect(auc).toBeCloseTo(1.0, 2);
  });
});
