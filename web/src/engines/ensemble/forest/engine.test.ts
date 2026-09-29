import { describe, it, expect } from 'vitest';
import { SeededRNG } from '@/utils/rng';
import {
  calculateGini,
  generateBootstrapSample,
  trainDecisionTree,
  predictTree,
  trainRandomForest,
  predictRandomForest,
  findBestDecisionStump,
  trainAdaBoost,
  predictAdaBoost,
  trainStackingBlender,
  generateEnsembleBoundaryGrid,
  simulateCondorcetJury,
} from './engine';
import type { Point2D } from './types';

describe('Ensemble Engine & Random Forest (L1 Correctness)', () => {
  const sampleData: Point2D[] = [
    { x: -2.0, y: -2.0, label: -1 },
    { x: -1.5, y: -1.0, label: -1 },
    { x: -1.0, y: -1.5, label: -1 },
    { x: -0.5, y: -0.5, label: -1 },
    { x: 0.5, y: 0.5, label: 1 },
    { x: 1.0, y: 1.5, label: 1 },
    { x: 1.5, y: 1.0, label: 1 },
    { x: 2.0, y: 2.0, label: 1 },
  ];

  it('calculates exact Gini impurity values', () => {
    expect(calculateGini([1, 1, 1, 1])).toBe(0);
    expect(calculateGini([-1, -1, -1])).toBe(0);
    expect(calculateGini([1, -1])).toBe(0.5);
    expect(calculateGini([1, 1, 1, -1])).toBe(0.375); // 1 - (9/16 + 1/16) = 6/16 = 0.375
  });

  it('generates valid bootstrap samples with ~63.2% distinct elements', () => {
    const rng = new SeededRNG(42);
    const largeData: Point2D[] = Array.from({ length: 500 }, (_, i) => ({
      x: i,
      y: i,
      label: i % 2 === 0 ? 1 : -1,
    }));

    const { sample, inBagIndices, oobIndices } = generateBootstrapSample(largeData, rng);
    expect(sample.length).toBe(500);
    expect(inBagIndices.size + oobIndices.length).toBe(500);

    // Theoretical fraction: 1 - 1/e ≈ 63.2%
    const uniqueFraction = inBagIndices.size / 500;
    expect(uniqueFraction).toBeGreaterThan(0.58);
    expect(uniqueFraction).toBeLessThan(0.7);
  });

  it('trains decision tree and predicts correctly on separable points', () => {
    const rng = new SeededRNG(42);
    const tree = trainDecisionTree(sampleData, 3, 2, rng);
    expect(tree.isLeaf).toBe(false);

    expect(predictTree(tree, [-1.5, -1.5])).toBe(-1);
    expect(predictTree(tree, [1.5, 1.5])).toBe(1);
  });

  it('trains Random Forest and calculates valid OOB error curve', () => {
    const rf = trainRandomForest(sampleData, {
      numTrees: 10,
      maxDepth: 3,
      featureSubspaceSize: 2,
      seed: 123,
    });

    expect(rf.trees.length).toBe(10);
    expect(rf.oobErrors.length).toBe(10);
    expect(rf.finalOobError).toBeGreaterThanOrEqual(0);
    expect(rf.finalOobError).toBeLessThanOrEqual(1);

    const predPos = predictRandomForest(rf, [1.8, 1.8]);
    expect(predPos.prediction).toBe(1);
    expect(predPos.probability).toBeGreaterThan(0.5);

    const predNeg = predictRandomForest(rf, [-1.8, -1.8]);
    expect(predNeg.prediction).toBe(-1);
    expect(predNeg.probability).toBeLessThan(0.5);
  });

  it('finds best decision stump and executes AdaBoost weight updates', () => {
    const weights = new Array<number>(sampleData.length).fill(1 / sampleData.length);
    const stump = findBestDecisionStump(sampleData, weights);

    expect(stump.error).toBeLessThan(0.5);

    const ada = trainAdaBoost(sampleData, 5);
    expect(ada.rounds.length).toBe(5);
    expect(ada.stumps.length).toBe(5);
    expect(ada.finalAccuracy).toBe(1.0);

    const testPred = predictAdaBoost(ada, [1.2, 1.2]);
    expect(testPred.prediction).toBe(1);
    expect(testPred.score).toBeGreaterThan(0);
  });

  it('trains Stacking meta-model with out-of-fold blending', () => {
    const stacking = trainStackingBlender(sampleData, 42);
    expect(stacking.baseModelNames.length).toBe(3);
    expect(stacking.metaWeights.length).toBe(3);
    expect(stacking.oofAccuracy).toBeGreaterThan(0.7);
  });

  it('verifies Condorcet Jury Theorem guarantees (Condorcet boost)', () => {
    // With 21 independent voters of accuracy p = 0.65, majority accuracy approaches ~90%
    const independentSim = simulateCondorcetJury(0.65, 21, 0.0, 500, 42);
    expect(independentSim.simulatedMajorityAccuracy).toBeGreaterThan(0.65);
    expect(independentSim.theoreticalIndependentAccuracy).toBeGreaterThan(0.85);

    // High correlation (0.8) severely damages jury gains
    const correlatedSim = simulateCondorcetJury(0.65, 21, 0.8, 500, 42);
    expect(correlatedSim.simulatedMajorityAccuracy).toBeLessThan(
      independentSim.simulatedMajorityAccuracy
    );
  });

  it('generates decision boundary grid with correct resolution', () => {
    const rf = trainRandomForest(sampleData, {
      numTrees: 5,
      maxDepth: 2,
      featureSubspaceSize: 2,
      seed: 42,
    });

    const grid = generateEnsembleBoundaryGrid(
      (pt) => predictRandomForest(rf, pt),
      -2,
      2,
      -2,
      2,
      10
    );

    expect(grid.grid.length).toBe(10);
    expect(grid.grid[0]!.length).toBe(10);
    expect(grid.probabilities.length).toBe(10);
    expect(grid.resolution).toBe(10);
  });
});
