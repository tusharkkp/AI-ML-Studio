/**
 * Types for the Classification Metrics engine.
 */

/** Raw confusion matrix counts. */
export interface ConfusionMatrix {
  TP: number;
  FP: number;
  TN: number;
  FN: number;
}

/** Derived classification performance metrics. */
export interface ClassificationMetrics {
  /** (TP + TN) / (TP + FP + TN + FN). */
  accuracy: number;
  /** TP / (TP + FP). Returns NaN when denominator is 0. */
  precision: number;
  /** TP / (TP + FN). Also called Sensitivity or True Positive Rate. */
  recall: number;
  /** TN / (TN + FP). Also called True Negative Rate. */
  specificity: number;
  /** Harmonic mean of precision and recall: 2·P·R / (P + R). */
  f1: number;
  /**
   * Matthews Correlation Coefficient — robust to class imbalance.
   * MCC = (TP·TN - FP·FN) / sqrt((TP+FP)(TP+FN)(TN+FP)(TN+FN)).
   */
  mcc: number;
  /** (Sensitivity + Specificity) / 2. */
  balancedAccuracy: number;
}

/** Single operating point on the ROC curve. */
export interface RocPoint {
  /** Threshold applied to continuous scores. */
  threshold: number;
  /** True Positive Rate = Recall = TP / (TP + FN). */
  tpr: number;
  /** False Positive Rate = FP / (FP + TN). */
  fpr: number;
}
