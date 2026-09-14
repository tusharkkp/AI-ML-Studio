import type {
  ScaledResult,
  OneHotResult,
  ImputationStrategy,
  OutlierCheck,
  IQRBounds,
} from './types';

// Standard Z-Score Scaling: z = (x - mean) / std
export function standardScale(values: number[]): ScaledResult {
  const n = values.length;
  if (n === 0) return { scaled: [], center: 0, scale: 1 };

  const mean = values.reduce((acc, v) => acc + v, 0) / n;
  const variance = values.reduce((acc, v) => acc + (v - mean) ** 2, 0) / n;
  const std = Math.sqrt(variance) || 1e-9;

  const scaled = values.map((v) => Number(((v - mean) / std).toFixed(4)));
  return { scaled, center: Number(mean.toFixed(4)), scale: Number(std.toFixed(4)) };
}

// Min-Max Normalization: x' = (x - min) / (max - min) * (targetMax - targetMin) + targetMin
export function minMaxScale(values: number[], targetMin = 0, targetMax = 1): ScaledResult {
  const n = values.length;
  if (n === 0) return { scaled: [], center: targetMin, scale: 1 };

  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1e-9;

  const scaled = values.map((v) =>
    Number((((v - min) / span) * (targetMax - targetMin) + targetMin).toFixed(4))
  );

  return { scaled, center: min, scale: span };
}

// Robust Scaling using Median and Interquartile Range (IQR = Q3 - Q1)
export function robustScale(values: number[]): ScaledResult {
  const n = values.length;
  if (n === 0) return { scaled: [], center: 0, scale: 1 };

  const sorted = [...values].sort((a, b) => a - b);
  const median = getPercentile(sorted, 50);
  const q1 = getPercentile(sorted, 25);
  const q3 = getPercentile(sorted, 75);
  const iqr = q3 - q1 || 1e-9;

  const scaled = values.map((v) => Number(((v - median) / iqr).toFixed(4)));
  return { scaled, center: Number(median.toFixed(4)), scale: Number(iqr.toFixed(4)) };
}

// Percentile helper for sorted numbers
export function getPercentile(sortedValues: number[], percentile: number): number {
  const n = sortedValues.length;
  if (n === 0) return 0;
  if (n === 1) return sortedValues[0]!;

  const pos = (percentile / 100) * (n - 1);
  const lower = Math.floor(pos);
  const upper = Math.ceil(pos);
  const weight = pos - lower;

  const vLower = sortedValues[lower]!;
  const vUpper = sortedValues[upper]!;
  return vLower + weight * (vUpper - vLower);
}

// One-Hot Encoding for categorical text columns
export function oneHotEncode(categories: string[]): OneHotResult {
  const uniqueCategories = Array.from(new Set(categories)).sort();
  const encodedMatrix: number[][] = [];

  for (let i = 0; i < categories.length; i++) {
    const val = categories[i]!;
    const row = uniqueCategories.map((cat) => (cat === val ? 1 : 0));
    encodedMatrix.push(row);
  }

  return { categories: uniqueCategories, encodedMatrix };
}

// Missing Value Imputation: Mean, Median, Mode, or Constant
export function imputeMissing(
  values: (number | null | undefined)[],
  strategy: ImputationStrategy = 'mean',
  constantValue = 0
): number[] {
  const validNumbers = values.filter(
    (v): v is number => v !== null && v !== undefined && Number.isFinite(v)
  );

  if (validNumbers.length === 0) {
    return values.map(() => constantValue);
  }

  let fillVal = constantValue;

  if (strategy === 'mean') {
    fillVal = validNumbers.reduce((a, b) => a + b, 0) / validNumbers.length;
  } else if (strategy === 'median') {
    const sorted = [...validNumbers].sort((a, b) => a - b);
    fillVal = getPercentile(sorted, 50);
  } else if (strategy === 'mode') {
    const counts = new Map<number, number>();
    let maxCount = 0;
    let modeVal = validNumbers[0]!;
    for (const v of validNumbers) {
      const c = (counts.get(v) || 0) + 1;
      counts.set(v, c);
      if (c > maxCount) {
        maxCount = c;
        modeVal = v;
      }
    }
    fillVal = modeVal;
  }

  fillVal = Number(fillVal.toFixed(4));

  return values.map((v) => (v === null || v === undefined || !Number.isFinite(v) ? fillVal : v));
}

// Z-Score Outlier Detection (Flag points with |z| > threshold)
export function detectOutliersZScore(values: number[], threshold = 3.0): OutlierCheck[] {
  const { scaled } = standardScale(values);
  return values.map((v, i) => {
    const z = scaled[i] ?? 0;
    return {
      index: i,
      value: v,
      zScore: z,
      isOutlier: Math.abs(z) > threshold,
    };
  });
}

// Tukey IQR Outlier Detection (Tukey fence rule: Q1 - 1.5*IQR and Q3 + 1.5*IQR)
export function detectOutliersIQR(values: number[], multiplier = 1.5): IQRBounds {
  const n = values.length;
  if (n === 0) {
    return {
      q1: 0,
      q2Median: 0,
      q3: 0,
      iqr: 0,
      lowerFence: 0,
      upperFence: 0,
      outlierIndices: [],
    };
  }

  const sorted = [...values].sort((a, b) => a - b);
  const q1 = getPercentile(sorted, 25);
  const q2Median = getPercentile(sorted, 50);
  const q3 = getPercentile(sorted, 75);
  const iqr = q3 - q1;

  const lowerFence = q1 - multiplier * iqr;
  const upperFence = q3 + multiplier * iqr;

  const outlierIndices: number[] = [];
  for (let i = 0; i < values.length; i++) {
    const v = values[i]!;
    if (v < lowerFence || v > upperFence) {
      outlierIndices.push(i);
    }
  }

  return {
    q1: Number(q1.toFixed(4)),
    q2Median: Number(q2Median.toFixed(4)),
    q3: Number(q3.toFixed(4)),
    iqr: Number(iqr.toFixed(4)),
    lowerFence: Number(lowerFence.toFixed(4)),
    upperFence: Number(upperFence.toFixed(4)),
    outlierIndices,
  };
}
