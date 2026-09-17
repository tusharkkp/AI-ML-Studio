import { describe, it, expect } from 'vitest';
import {
  calculateBayesPosterior,
  trainCategoricalNaiveBayes,
  predictCategoricalNaiveBayes,
  trainGaussianNaiveBayes,
  predictGaussianNaiveBayes,
} from './engine';

describe('probabilistic/naive-bayes engine', () => {
  it('correctly computes Bayes theorem posterior and natural frequencies for medical paradox', () => {
    // 1% disease prevalence, 95% sensitivity (TPR), 90% specificity (10% FPR)
    const result = calculateBayesPosterior(0.01, 0.95, 0.9, 1000);

    expect(result.prior).toBe(0.01);
    expect(result.falsePositiveRate).toBeCloseTo(0.1, 5);
    // Evidence: 0.95 * 0.01 + 0.10 * 0.99 = 0.0095 + 0.099 = 0.1085
    expect(result.evidencePositive).toBeCloseTo(0.1085, 4);
    // Posterior: 0.0095 / 0.1085 = 0.087557... (~8.76%)
    expect(result.posteriorPositive).toBeCloseTo(0.08756, 4);

    // Natural frequencies out of 1,000
    expect(result.naturalFrequencies.totalCohort).toBe(1000);
    expect(result.naturalFrequencies.withCondition).toBe(10);
    expect(result.naturalFrequencies.withoutCondition).toBe(990);
    expect(result.naturalFrequencies.truePositives).toBe(10); // round(10 * 0.95)
    expect(result.naturalFrequencies.falsePositives).toBe(99); // round(990 * 0.10)
  });

  it('trains categorical naive bayes on weather tennis dataset and predicts with high accuracy', () => {
    const data = [
      { outlook: 'Sunny', temp: 'Hot', play: 'No' },
      { outlook: 'Sunny', temp: 'Hot', play: 'No' },
      { outlook: 'Overcast', temp: 'Hot', play: 'Yes' },
      { outlook: 'Rainy', temp: 'Mild', play: 'Yes' },
      { outlook: 'Rainy', temp: 'Cool', play: 'Yes' },
      { outlook: 'Rainy', temp: 'Cool', play: 'No' },
      { outlook: 'Overcast', temp: 'Cool', play: 'Yes' },
      { outlook: 'Sunny', temp: 'Mild', play: 'No' },
      { outlook: 'Sunny', temp: 'Cool', play: 'Yes' },
      { outlook: 'Rainy', temp: 'Mild', play: 'Yes' },
      { outlook: 'Sunny', temp: 'Mild', play: 'Yes' },
      { outlook: 'Overcast', temp: 'Mild', play: 'Yes' },
      { outlook: 'Overcast', temp: 'Hot', play: 'Yes' },
      { outlook: 'Rainy', temp: 'Mild', play: 'No' },
    ];

    const model = trainCategoricalNaiveBayes(data, ['outlook', 'temp'], 'play', 1.0);

    expect(model.classes).toEqual(['No', 'Yes']);
    expect(model.classCounts['Yes']).toBe(9);
    expect(model.classCounts['No']).toBe(5);

    // Predict Overcast, Cool -> Should be definitively 'Yes' because Overcast had 100% Yes
    const predOvercast = predictCategoricalNaiveBayes(model, { outlook: 'Overcast', temp: 'Cool' });
    expect(predOvercast.predictedClass).toBe('Yes');
    expect(predOvercast.classProbabilities['Yes']).toBeGreaterThan(0.7);
  });

  it('demonstrates zero-frequency failure without Laplace smoothing (alpha=0) and recovery with alpha=1', () => {
    const data = [
      { word: 'lottery', spam: 'Yes' },
      { word: 'prize', spam: 'Yes' },
      { word: 'meeting', spam: 'No' },
      { word: 'project', spam: 'No' },
    ];

    // Model with alpha=0 (no smoothing)
    const unsmoothedModel = trainCategoricalNaiveBayes(data, ['word'], 'spam', 0.0);
    // Unseen word 'meeting' in spam class has count 0
    expect(unsmoothedModel.featureLikelihoods['Yes']?.['word']?.['meeting']).toBe(0);

    // Predict email containing 'meeting'
    const predUnsmoothed = predictCategoricalNaiveBayes(unsmoothedModel, { word: 'meeting' });
    expect(predUnsmoothed.classProbabilities['Yes'] ?? 0).toBeCloseTo(0, 3);
    expect(predUnsmoothed.predictedClass).toBe('No');

    // Model with alpha=1.0 (Laplace smoothing)
    const smoothedModel = trainCategoricalNaiveBayes(data, ['word'], 'spam', 1.0);
    // Vocabulary size = 4 (lottery, prize, meeting, project)
    // Count in Yes class = 2. Laplace smoothed prob = (0 + 1) / (2 + 1 * 4) = 1/6 ≈ 0.1667
    expect(smoothedModel.featureLikelihoods['Yes']?.['word']?.['meeting']).toBeCloseTo(1 / 6, 4);

    const predSmoothed = predictCategoricalNaiveBayes(smoothedModel, { word: 'meeting' });
    expect(predSmoothed.classProbabilities['Yes'] ?? 0).toBeGreaterThan(0.05);
  });

  it('trains Gaussian Naive Bayes and classifies separable continuous distributions', () => {
    const continuousData = [
      { feature1: 1.0, feature2: 1.2, target: 'GroupA' },
      { feature1: 1.2, feature2: 0.9, target: 'GroupA' },
      { feature1: 0.8, feature2: 1.1, target: 'GroupA' },
      { feature1: 9.0, feature2: 8.5, target: 'GroupB' },
      { feature1: 9.5, feature2: 9.1, target: 'GroupB' },
      { feature1: 8.7, feature2: 8.9, target: 'GroupB' },
    ];

    const model = trainGaussianNaiveBayes(continuousData, ['feature1', 'feature2'], 'target');

    expect(model.classes).toEqual(['GroupA', 'GroupB']);
    expect(model.featureParams['GroupA']?.['feature1']?.mean).toBeCloseTo(1.0, 2);
    expect(model.featureParams['GroupB']?.['feature1']?.mean).toBeCloseTo(9.067, 2);

    // Predict point near GroupA (1.1, 1.0)
    const predA = predictGaussianNaiveBayes(model, { feature1: 1.1, feature2: 1.0 });
    expect(predA.predictedClass).toBe('GroupA');
    expect(predA.classProbabilities['GroupA'] ?? 0).toBeGreaterThan(0.99);

    // Predict point near GroupB (9.2, 8.8)
    const predB = predictGaussianNaiveBayes(model, { feature1: 9.2, feature2: 8.8 });
    expect(predB.predictedClass).toBe('GroupB');
    expect(predB.classProbabilities['GroupB'] ?? 0).toBeGreaterThan(0.99);
  });

  it('handles empty datasets by throwing a descriptive error', () => {
    expect(() => trainCategoricalNaiveBayes([], ['feature1'], 'target')).toThrow(
      'Cannot train Naive Bayes on empty dataset'
    );
    expect(() => trainGaussianNaiveBayes([], ['feature1'], 'target')).toThrow(
      'Cannot train Gaussian Naive Bayes on empty dataset'
    );
  });
});
