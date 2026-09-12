import type { RegressionMetrics, DataPoint1D } from '../linear/types';

export interface PolynomialModel extends RegressionMetrics {
  degree: number;
  coefficients: number[]; // [theta_0, theta_1, theta_2, ..., theta_d]
}

export type { DataPoint1D, RegressionMetrics };
