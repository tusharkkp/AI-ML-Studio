export interface DataPoint1D {
  x: number;
  y: number;
}

export interface RegressionMetrics {
  mse: number;
  rmse: number;
  mae: number;
  r2: number;
}

export interface SimpleLinearModel extends RegressionMetrics {
  theta0: number; // Intercept
  theta1: number; // Slope
}

export interface GradientDescentStep {
  iteration: number;
  theta0: number;
  theta1: number;
  gradTheta0: number;
  gradTheta1: number;
  cost: number;
}

export type GradientDescentVariant = 'batch' | 'stochastic' | 'mini-batch';

export interface GradientDescentConfig {
  learningRate: number; // alpha
  maxIterations?: number;
  initialTheta0?: number;
  initialTheta1?: number;
  tolerance?: number;
  variant?: GradientDescentVariant;
  batchSize?: number;
  seed?: number;
}

export interface GradientDescentResult {
  finalTheta0: number;
  finalTheta1: number;
  finalCost: number;
  iterationsCompleted: number;
  converged: boolean;
  diverged: boolean;
  steps: GradientDescentStep[];
}
