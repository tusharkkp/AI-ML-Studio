export interface ScaledResult {
  scaled: number[];
  center: number;
  scale: number;
}

export interface OneHotResult {
  categories: string[];
  encodedMatrix: number[][]; // (m x num_categories)
}

export type ImputationStrategy = 'mean' | 'median' | 'mode' | 'constant';

export interface OutlierCheck {
  index: number;
  value: number;
  zScore: number;
  isOutlier: boolean;
}

export interface IQRBounds {
  q1: number;
  q2Median: number;
  q3: number;
  iqr: number;
  lowerFence: number;
  upperFence: number;
  outlierIndices: number[];
}
