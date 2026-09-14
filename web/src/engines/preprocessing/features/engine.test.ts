import { describe, it, expect } from 'vitest';
import {
  standardScale,
  minMaxScale,
  robustScale,
  oneHotEncode,
  imputeMissing,
  detectOutliersZScore,
  detectOutliersIQR,
} from './engine';

describe('Feature Scaling & Preprocessing Suite', () => {
  it('standardizes features to mean 0 and variance 1', () => {
    const raw = [10, 20, 30, 40, 50];
    const { scaled, center, scale } = standardScale(raw);
    expect(center).toBe(30);
    expect(scale).toBeCloseTo(14.142, 2);

    const meanScaled = scaled.reduce((a, b) => a + b, 0) / scaled.length;
    expect(meanScaled).toBeCloseTo(0, 3);
  });

  it('normalizes features into exact [0, 1] interval', () => {
    const raw = [100, 200, 300, 400, 500];
    const { scaled } = minMaxScale(raw, 0, 1);
    expect(scaled[0]).toBe(0);
    expect(scaled[4]).toBe(1);
    expect(scaled[2]).toBe(0.5);
  });

  it('performs robust scaling using median and IQR', () => {
    const rawWithOutlier = [1, 2, 3, 4, 5, 100];
    const { center, scaled } = robustScale(rawWithOutlier);
    expect(center).toBeCloseTo(3.5, 1);
    expect(scaled.length).toBe(6);
  });

  it('one-hot encodes categorical text attributes', () => {
    const categories = ['Pune', 'Mumbai', 'Pune', 'Bangalore', 'Mumbai'];
    const { categories: cats, encodedMatrix } = oneHotEncode(categories);
    expect(cats).toEqual(['Bangalore', 'Mumbai', 'Pune']);
    expect(encodedMatrix[0]).toEqual([0, 0, 1]); // Pune
    expect(encodedMatrix[1]).toEqual([0, 1, 0]); // Mumbai
    expect(encodedMatrix[3]).toEqual([1, 0, 0]); // Bangalore
  });

  it('imputes missing values with mean or median', () => {
    const dataWithHoles = [10, null, 30, undefined, 50];
    const imputedMean = imputeMissing(dataWithHoles, 'mean');
    expect(imputedMean).toEqual([10, 30, 30, 30, 50]);

    const imputedMedian = imputeMissing(dataWithHoles, 'median');
    expect(imputedMedian).toEqual([10, 30, 30, 30, 50]);
  });

  it('detects outliers using Tukey IQR fence rule', () => {
    const data = [10, 12, 11, 13, 12, 14, 11, 95]; // 95 is clear outlier
    const iqrResult = detectOutliersIQR(data);
    expect(iqrResult.outlierIndices).toContain(7); // index of 95

    const zResult = detectOutliersZScore(data, 2.0);
    const zOutliers = zResult.filter((r) => r.isOutlier).map((r) => r.index);
    expect(zOutliers).toContain(7);
  });
});
