import type {
  SvmConfig,
  SvmKernelConfig,
  SvmModel,
  SvmPrediction,
  SvmDecisionGrid2D,
  SupportVector,
  LiftedPoint3D,
} from './types';

/**
 * Compute the kernel inner product K(x, z).
 */
export function computeKernel(x: number[], z: number[], config: SvmKernelConfig): number {
  if (x.length !== z.length) {
    throw new Error(`Dimension mismatch in kernel computation: ${x.length} vs ${z.length}`);
  }

  switch (config.type) {
    case 'linear': {
      let dot = 0;
      for (let i = 0; i < x.length; i++) {
        dot += (x[i] ?? 0) * (z[i] ?? 0);
      }
      return dot;
    }
    case 'poly': {
      const degree = config.degree ?? 2;
      const coef0 = config.coef0 ?? 1;
      let dot = 0;
      for (let i = 0; i < x.length; i++) {
        dot += (x[i] ?? 0) * (z[i] ?? 0);
      }
      return Math.pow(dot + coef0, degree);
    }
    case 'rbf': {
      const gamma = config.gamma ?? 0.5;
      let distSq = 0;
      for (let i = 0; i < x.length; i++) {
        const diff = (x[i] ?? 0) - (z[i] ?? 0);
        distSq += diff * diff;
      }
      return Math.exp(-gamma * distSq);
    }
    default:
      throw new Error('Unsupported kernel type');
  }
}

/**
 * Train a Support Vector Machine using Sequential Minimal Optimization (SMO).
 *
 * Solves the convex dual quadratic program:
 *   max_α  Σ α_i - 0.5 * Σ Σ α_i α_j y_i y_j K(x_i, x_j)
 *   s.t.   0 <= α_i <= C,  Σ α_i y_i = 0
 */
export function trainSvm(
  X: number[][],
  y: (-1 | 1)[],
  userConfig: Partial<SvmConfig> = {}
): SvmModel {
  const n = X.length;
  if (n === 0) {
    throw new Error('Training data cannot be empty');
  }
  if (y.length !== n) {
    throw new Error(`Sample count mismatch: X has ${n}, y has ${y.length}`);
  }

  const config: SvmConfig = {
    C: userConfig.C ?? 1.0,
    kernel: userConfig.kernel ?? { type: 'linear' },
    maxIter: userConfig.maxIter ?? 150,
    tol: userConfig.tol ?? 1e-3,
    alphaTol: userConfig.alphaTol ?? 1e-4,
  };

  const C = config.C;
  const tol = config.tol ?? 1e-3;
  const maxIter = config.maxIter ?? 150;
  const alphaTol = config.alphaTol ?? 1e-4;

  // Pre-calculate Gram matrix K[i][j] = K(x_i, x_j)
  const K: number[][] = [];
  for (let i = 0; i < n; i++) {
    const row: number[] = new Array<number>(n).fill(0);
    K.push(row);
  }

  for (let i = 0; i < n; i++) {
    const xi = X[i];
    if (!xi) continue;
    for (let j = i; j < n; j++) {
      const xj = X[j];
      if (!xj) continue;
      const kij = computeKernel(xi, xj, config.kernel);
      K[i]![j] = kij;
      K[j]![i] = kij;
    }
  }

  // Initialize alphas and bias
  const alphas: number[] = new Array<number>(n).fill(0);
  let bias = 0;

  // Helper to evaluate unthresholded f(x_i)
  const evaluateFx = (idx: number, curAlphas: number[], curBias: number): number => {
    let sum = 0;
    for (let k = 0; k < n; k++) {
      const ak = curAlphas[k] ?? 0;
      if (ak > alphaTol) {
        const yk = y[k] ?? 1;
        const kval = K[k]?.[idx] ?? 0;
        sum += ak * yk * kval;
      }
    }
    return sum + curBias;
  };

  // Simplified Platt SMO main loop
  let passes = 0;
  let iter = 0;

  while (passes < 10 && iter < maxIter) {
    let numChangedAlphas = 0;
    iter++;

    for (let i = 0; i < n; i++) {
      const Ei = evaluateFx(i, alphas, bias) - (y[i] ?? 1);
      const yi = y[i] ?? 1;
      const alphaI = alphas[i] ?? 0;

      // Check Karush-Kuhn-Tucker (KKT) violation within tolerance
      const isKktViolated = (yi * Ei < -tol && alphaI < C) || (yi * Ei > tol && alphaI > 0);

      if (isKktViolated) {
        // Select second index j != i deterministically or by maximum error difference
        let j = (i + 1) % n;
        let maxDeltaE = 0;
        for (let cand = 0; cand < n; cand++) {
          if (cand !== i) {
            const Ecand = evaluateFx(cand, alphas, bias) - (y[cand] ?? 1);
            const delta = Math.abs(Ei - Ecand);
            if (delta > maxDeltaE) {
              maxDeltaE = delta;
              j = cand;
            }
          }
        }

        const yj = y[j] ?? 1;
        const Ej = evaluateFx(j, alphas, bias) - yj;

        const alphaIold = alphas[i] ?? 0;
        const alphaJold = alphas[j] ?? 0;

        // Compute lower and upper bounds L and H for alpha_j
        let L: number;
        let H: number;
        if (yi !== yj) {
          L = Math.max(0, alphaJold - alphaIold);
          H = Math.min(C, C + alphaJold - alphaIold);
        } else {
          L = Math.max(0, alphaIold + alphaJold - C);
          H = Math.min(C, alphaIold + alphaJold);
        }

        if (Math.abs(L - H) < 1e-6) {
          continue;
        }

        // Second derivative of objective along direction: eta = 2*K_ij - K_ii - K_jj
        const kii = K[i]?.[i] ?? 0;
        const kjj = K[j]?.[j] ?? 0;
        const kij = K[i]?.[j] ?? 0;
        const eta = 2 * kij - kii - kjj;
        if (eta >= -1e-7) {
          continue;
        }

        // Unconstrained new alpha_j
        let alphaJnew = alphaJold - (yj * (Ei - Ej)) / eta;

        // Clip alpha_j to [L, H] box constraints
        if (alphaJnew > H) alphaJnew = H;
        else if (alphaJnew < L) alphaJnew = L;

        if (Math.abs(alphaJnew - alphaJold) < 1e-5) {
          continue;
        }

        // Update alpha_i accordingly to satisfy linear constraint sum(alpha_k * y_k) = 0
        const alphaInew = alphaIold + yi * yj * (alphaJold - alphaJnew);

        // Compute threshold / bias updates
        const b1 =
          bias - Ei - yi * (alphaInew - alphaIold) * kii - yj * (alphaJnew - alphaJold) * kij;

        const b2 =
          bias - Ej - yi * (alphaInew - alphaIold) * kij - yj * (alphaJnew - alphaJold) * kjj;

        if (alphaInew > 0 && alphaInew < C) {
          bias = b1;
        } else if (alphaJnew > 0 && alphaJnew < C) {
          bias = b2;
        } else {
          bias = (b1 + b2) / 2;
        }

        alphas[i] = alphaInew;
        alphas[j] = alphaJnew;
        numChangedAlphas++;
      }
    }

    if (numChangedAlphas === 0) {
      passes++;
    } else {
      passes = 0;
    }
  }

  // Extract support vectors (alphas > alphaTol) and calculate slack variables
  const supportVectors: SupportVector[] = [];
  const firstSample = X[0];
  const dim = firstSample ? firstSample.length : 0;
  let weights: number[] | undefined;

  if (config.kernel.type === 'linear' && dim > 0) {
    const w: number[] = new Array<number>(dim).fill(0);
    for (let i = 0; i < n; i++) {
      const ai = alphas[i] ?? 0;
      if (ai > alphaTol) {
        const coef = ai * (y[i] ?? 1);
        const xi = X[i];
        if (xi) {
          for (let d = 0; d < dim; d++) {
            w[d] = (w[d] ?? 0) + coef * (xi[d] ?? 0);
          }
        }
      }
    }
    weights = w;
  }

  for (let i = 0; i < n; i++) {
    const a = alphas[i] ?? 0;
    if (a > alphaTol) {
      const fx = evaluateFx(i, alphas, bias);
      const yi = y[i] ?? 1;
      const slack = Math.max(0, 1 - yi * fx);
      const xi = X[i];
      if (xi) {
        supportVectors.push({
          index: i,
          point: [...xi],
          label: yi,
          alpha: a,
          slack,
        });
      }
    }
  }

  // Compute margin width 2 / ||w|| for linear kernel
  let marginWidth: number | undefined;
  if (weights) {
    let normSq = 0;
    for (let d = 0; d < dim; d++) {
      const wd = weights[d] ?? 0;
      normSq += wd * wd;
    }
    const norm = Math.sqrt(normSq);
    if (norm > 1e-6) {
      marginWidth = 2 / norm;
    }
  }

  // Compute training accuracy
  let correctCount = 0;
  for (let i = 0; i < n; i++) {
    const fx = evaluateFx(i, alphas, bias);
    const predClass = fx >= 0 ? 1 : -1;
    if (predClass === y[i]) {
      correctCount++;
    }
  }
  const trainingAccuracy = correctCount / n;

  return {
    config,
    weights,
    bias,
    alphas,
    supportVectors,
    marginWidth,
    trainingAccuracy,
    iterations: iter,
  };
}

/**
 * Predict label and continuous decision value for a sample point.
 */
export function predictSvm(
  model: SvmModel,
  trainX: number[][],
  trainY: (-1 | 1)[],
  x: number[]
): SvmPrediction {
  let decisionValue = model.bias;
  const alphaTol = model.config.alphaTol ?? 1e-4;

  if (model.config.kernel.type === 'linear' && model.weights) {
    for (let d = 0; d < x.length; d++) {
      decisionValue += (model.weights[d] ?? 0) * (x[d] ?? 0);
    }
  } else {
    for (let i = 0; i < trainX.length; i++) {
      const a = model.alphas[i] ?? 0;
      const xi = trainX[i];
      if (a > alphaTol && xi) {
        const kVal = computeKernel(xi, x, model.config.kernel);
        decisionValue += a * (trainY[i] ?? 1) * kVal;
      }
    }
  }

  const predictedClass: -1 | 1 = decisionValue >= 0 ? 1 : -1;

  let marginDistance: number | undefined;
  if (model.weights) {
    let normSq = 0;
    for (const w of model.weights) normSq += w * w;
    const norm = Math.sqrt(normSq);
    if (norm > 1e-6) {
      marginDistance = Math.abs(decisionValue) / norm;
    }
  }

  return {
    decisionValue,
    predictedClass,
    marginDistance,
  };
}

/**
 * Calculate 2D decision boundary grid for heatmap and contour rendering.
 */
export function computeSvmGrid2D(
  model: SvmModel,
  trainX: number[][],
  trainY: (-1 | 1)[],
  xRange: [number, number] = [-3, 3],
  yRange: [number, number] = [-3, 3],
  resolution: number = 40
): SvmDecisionGrid2D {
  const xStep = (xRange[1] - xRange[0]) / (resolution - 1);
  const yStep = (yRange[1] - yRange[0]) / (resolution - 1);

  const xCoords: number[] = [];
  for (let i = 0; i < resolution; i++) {
    xCoords.push(xRange[0] + i * xStep);
  }

  const yCoords: number[] = [];
  for (let j = 0; j < resolution; j++) {
    yCoords.push(yRange[0] + j * yStep);
  }

  const grid: number[][] = [];
  let minVal = Infinity;
  let maxVal = -Infinity;

  for (let r = 0; r < resolution; r++) {
    const row: number[] = [];
    const yVal = yCoords[r] ?? 0;
    for (let c = 0; c < resolution; c++) {
      const xVal = xCoords[c] ?? 0;
      const pred = predictSvm(model, trainX, trainY, [xVal, yVal]);
      row.push(pred.decisionValue);
      if (pred.decisionValue < minVal) minVal = pred.decisionValue;
      if (pred.decisionValue > maxVal) maxVal = pred.decisionValue;
    }
    grid.push(row);
  }

  return {
    xCoords,
    yCoords,
    grid,
    minVal,
    maxVal,
  };
}

/**
 * Lift 2D points to 3D parabolic coordinate: (x, y) -> (x, y, x^2 + y^2).
 * Shows how concentric circles become linearly separable in 3D!
 */
export function lift2Dto3D(points: number[][], labels: (-1 | 1)[]): LiftedPoint3D[] {
  return points.map((p, idx) => {
    const x = p[0] ?? 0;
    const y = p[1] ?? 0;
    const z = x * x + y * y;
    return {
      x,
      y,
      z,
      label: labels[idx] ?? 1,
    };
  });
}
