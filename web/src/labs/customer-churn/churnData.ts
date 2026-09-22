import { SeededRNG } from '@/utils/rng';

export interface CustomerRecord {
  id: string;
  tenureMonths: number;
  monthlyCharges: number;
  contractType: number; // 0: Month-to-month, 1: One year, 2: Two year
  techSupportCalls: number;
  churn: 0 | 1;
}

/**
 * Generate a synthetic 100-customer telecom cohort with realistic churn correlations:
 * - High monthly charges increase churn risk.
 * - Short tenure increases churn risk.
 * - Month-to-month contracts strongly increase churn risk.
 * - High tech support calls increase churn risk.
 * - Overall prevalence is roughly 20-25% churn (class imbalance).
 */
export function generateChurnDataset(seed: number = 42): CustomerRecord[] {
  const rng = new SeededRNG(seed);
  const records: CustomerRecord[] = [];

  for (let i = 1; i <= 100; i++) {
    const tenureMonths = rng.nextInt(1, 72);
    const monthlyCharges = rng.nextFloat(20, 115);
    const contractType = rng.choice([0, 0, 0, 1, 1, 2]); // predominantly month-to-month
    const techSupportCalls = rng.nextInt(0, 6);

    // Churn logit linear model with noise
    // Month-to-month adds +1.2, low tenure adds up to +1.0, high charges adds up to +0.8
    let logit = -1.8;
    logit += contractType === 0 ? 1.4 : contractType === 1 ? -0.4 : -1.2;
    logit += ((72 - tenureMonths) / 72) * 1.5;
    logit += ((monthlyCharges - 20) / 95) * 1.2;
    logit += (techSupportCalls / 6) * 1.1;
    logit += rng.nextFloat(-0.4, 0.4); // noise

    const prob = 1 / (1 + Math.exp(-logit));
    const churn = prob > 0.58 ? 1 : 0;

    records.push({
      id: `CUST-${String(i).padStart(3, '0')}`,
      tenureMonths,
      monthlyCharges,
      contractType,
      techSupportCalls,
      churn,
    });
  }

  return records;
}

/**
 * Standardize feature matrix X using Z-score: (x - mean) / std.
 */
export function standardizeFeatures(X: number[][]): {
  scaledX: number[][];
  means: number[];
  stds: number[];
} {
  const m = X.length;
  const d = X[0]?.length ?? 0;
  if (m === 0 || d === 0) return { scaledX: [], means: [], stds: [] };

  const means: number[] = new Array<number>(d).fill(0);
  const stds: number[] = new Array<number>(d).fill(0);

  for (let j = 0; j < d; j++) {
    let sum = 0;
    for (let i = 0; i < m; i++) {
      sum += X[i]?.[j] ?? 0;
    }
    means[j] = sum / m;

    let sumSq = 0;
    for (let i = 0; i < m; i++) {
      const diff = (X[i]?.[j] ?? 0) - (means[j] ?? 0);
      sumSq += diff * diff;
    }
    stds[j] = Math.sqrt(sumSq / m) || 1;
  }

  const scaledX = X.map((row) => row.map((val, j) => (val - (means[j] ?? 0)) / (stds[j] ?? 1)));

  return { scaledX, means, stds };
}
