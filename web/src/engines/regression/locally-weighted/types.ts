import type { DataPoint1D } from '../linear/types';

export interface LWRResult {
  queryX: number;
  predictedY: number;
  theta0: number;
  theta1: number;
  weights: number[]; // weights for each training point
}

export type { DataPoint1D };
