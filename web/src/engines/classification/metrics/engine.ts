import type { ConfusionMatrix, ClassificationMetrics, RocPoint } from './types';

/**
 * Build a confusion matrix from ground-truth labels and predicted scores
 * thresholded at `threshold`.
 *
 * @param yt  Ground-truth binary labels (0 or 1).
 * @param scores  Continuous prediction scores in [0, 1].
 * @param threshold  Decision threshold τ (default 0.5).
 */
export function computeConfusionMatrix(
  yt: number[],
  scores: number[],
  threshold = 0.5
): ConfusionMatrix {
  let TP = 0,
    FP = 0,
    TN = 0,
    FN = 0;

  for (let i = 0; i < yt.length; i++) {
    const actual = yt[i] ?? 0;
    const predicted = (scores[i] ?? 0) >= threshold ? 1 : 0;

    if (actual === 1 && predicted === 1) TP++;
    else if (actual === 0 && predicted === 1) FP++;
    else if (actual === 0 && predicted === 0) TN++;
    else FN++;
  }

  return { TP, FP, TN, FN };
}

/**
 * Compute all standard classification metrics from a confusion matrix.
 * Returns NaN for metrics where the denominator is zero (e.g. precision
 * when no positive predictions are made).
 */
export function computeClassificationMetrics(cm: ConfusionMatrix): ClassificationMetrics {
  const { TP, FP, TN, FN } = cm;
  const total = TP + FP + TN + FN;

  const accuracy = total === 0 ? NaN : (TP + TN) / total;
  const precision = TP + FP === 0 ? NaN : TP / (TP + FP);
  const recall = TP + FN === 0 ? NaN : TP / (TP + FN);
  const specificity = TN + FP === 0 ? NaN : TN / (TN + FP);

  const f1Denom = (precision || 0) + (recall || 0);
  const f1 =
    isNaN(precision) || isNaN(recall) || f1Denom === 0
      ? NaN
      : (2 * (precision || 0) * (recall || 0)) / f1Denom;

  const mccDenom = Math.sqrt((TP + FP) * (TP + FN) * (TN + FP) * (TN + FN));
  const mcc = mccDenom === 0 ? 0 : (TP * TN - FP * FN) / mccDenom;

  const balancedAccuracy =
    isNaN(recall) || isNaN(specificity) ? NaN : ((recall || 0) + (specificity || 0)) / 2;

  return { accuracy, precision, recall, specificity, f1, mcc, balancedAccuracy };
}

/**
 * Sweep a threshold from 1 down to 0 to build the full ROC curve.
 * Each step yields a (TPR, FPR) operating point.
 *
 * @param yt  Ground-truth binary labels.
 * @param scores  Continuous prediction scores in [0, 1].
 * @param steps  Number of threshold steps (default 100).
 * @returns  Array of {@link RocPoint} ordered from (0,0) to (1,1).
 */
export function computeRocCurve(yt: number[], scores: number[], steps = 100): RocPoint[] {
  const points: RocPoint[] = [];

  for (let i = steps; i >= 0; i--) {
    const threshold = i / steps;
    const cm = computeConfusionMatrix(yt, scores, threshold);
    const metrics = computeClassificationMetrics(cm);
    points.push({
      threshold,
      tpr: isNaN(metrics.recall) ? 0 : metrics.recall,
      fpr: isNaN(metrics.specificity) ? 0 : 1 - metrics.specificity,
    });
  }

  return points;
}

/**
 * Compute AUC using the trapezoidal rule over the ROC curve.
 * Assumes points are ordered from (fpr=0, tpr=0) to (fpr=1, tpr=1).
 */
export function computeAUC(roc: RocPoint[]): number {
  if (roc.length < 2) return 0;

  let auc = 0;
  for (let i = 1; i < roc.length; i++) {
    const prev = roc[i - 1]!;
    const curr = roc[i]!;
    const dFpr = curr.fpr - prev.fpr;
    if (dFpr > 0) {
      // Trapezoid: average height × width
      auc += ((prev.tpr + curr.tpr) / 2) * dFpr;
    }
  }

  return Math.max(0, Math.min(1, auc));
}
