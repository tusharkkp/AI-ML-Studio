import type { DataPoint1D } from './types';
import { SeededRNG } from '@/utils/rng';

// Real-world Salary Data from MIT AOE syllabus dataset: Years of Experience vs Salary (in thousands of dollars)
export const SALARY_DATA: DataPoint1D[] = [
  { x: 1.1, y: 39.34 },
  { x: 1.3, y: 46.21 },
  { x: 1.5, y: 37.73 },
  { x: 2.0, y: 43.53 },
  { x: 2.2, y: 39.89 },
  { x: 2.9, y: 56.64 },
  { x: 3.0, y: 60.15 },
  { x: 3.2, y: 54.45 },
  { x: 3.2, y: 64.45 },
  { x: 3.7, y: 57.19 },
  { x: 3.9, y: 63.22 },
  { x: 4.0, y: 55.79 },
  { x: 4.0, y: 56.96 },
  { x: 4.1, y: 57.08 },
  { x: 4.5, y: 61.11 },
  { x: 4.9, y: 67.94 },
  { x: 5.1, y: 66.03 },
  { x: 5.3, y: 83.09 },
  { x: 5.9, y: 81.36 },
  { x: 6.0, y: 93.94 },
  { x: 6.8, y: 91.74 },
  { x: 7.1, y: 98.27 },
  { x: 7.9, y: 101.3 },
  { x: 8.2, y: 113.81 },
  { x: 8.7, y: 109.43 },
  { x: 9.0, y: 105.58 },
  { x: 9.5, y: 116.97 },
  { x: 9.6, y: 112.64 },
  { x: 10.3, y: 122.39 },
  { x: 10.5, y: 121.87 },
];

// Study hours vs Exam score (0 - 100)
export const STUDY_HOURS_DATA: DataPoint1D[] = [
  { x: 1.5, y: 42.0 },
  { x: 2.0, y: 48.0 },
  { x: 2.5, y: 51.0 },
  { x: 3.0, y: 58.0 },
  { x: 3.5, y: 62.0 },
  { x: 4.0, y: 65.0 },
  { x: 4.5, y: 69.0 },
  { x: 5.0, y: 74.0 },
  { x: 5.5, y: 77.0 },
  { x: 6.0, y: 82.0 },
  { x: 6.5, y: 85.0 },
  { x: 7.0, y: 88.0 },
  { x: 7.5, y: 91.0 },
  { x: 8.0, y: 94.0 },
];

// Apartment Carpet Area (100s sq ft) vs Price (in Lakhs)
export const APARTMENT_PRICE_DATA: DataPoint1D[] = [
  { x: 5.5, y: 45.0 },
  { x: 6.2, y: 52.0 },
  { x: 7.0, y: 58.5 },
  { x: 7.8, y: 64.0 },
  { x: 8.5, y: 71.0 },
  { x: 9.2, y: 76.5 },
  { x: 10.0, y: 83.0 },
  { x: 11.2, y: 91.0 },
  { x: 12.0, y: 98.0 },
  { x: 13.5, y: 112.0 },
  { x: 14.5, y: 119.5 },
  { x: 16.0, y: 132.0 },
];

export function generateSyntheticLinearData(
  trueTheta0: number,
  trueTheta1: number,
  count = 20,
  xMin = 1,
  xMax = 10,
  noiseStd = 5,
  seed = 42
): DataPoint1D[] {
  const points: DataPoint1D[] = [];
  const step = (xMax - xMin) / (count - 1);
  const rng = new SeededRNG(seed);

  for (let i = 0; i < count; i++) {
    const x = Number((xMin + i * step).toFixed(2));
    // Box-Muller transform for pseudo Gaussian noise
    const u1 = rng.next() || 0.0001;
    const u2 = rng.next() || 0.0001;
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    const noise = z0 * noiseStd;
    const y = Number((trueTheta0 + trueTheta1 * x + noise).toFixed(2));
    points.push({ x, y });
  }

  return points;
}
