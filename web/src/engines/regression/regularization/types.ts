export type RegularizationType = 'none' | 'ridge' | 'lasso' | 'elasticnet';

export interface RegularizationConfig {
  alpha: number; // Regularization strength lambda >= 0
  l1Ratio?: number; // For Elastic Net: weight of L1 penalty in [0, 1]
  maxIterations?: number;
  tolerance?: number;
}

export interface RegularizedModelResult {
  coefficients: number[];
  intercept: number;
  r2: number;
  mse: number;
  mae: number;
  numZeroCoefficients: number;
  penaltyCost: number;
  iterations: number;
}

export interface RegularizationTracePoint {
  alpha: number;
  coefficients: number[];
  r2: number;
  mse: number;
  activeFeatureCount: number;
}
