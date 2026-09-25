import { describe, expect, it } from 'vitest';
import {
  buildDecisionTree,
  calculateEntropy,
  calculateGini,
  countLeaves,
  evaluateCandidateSplit,
  getTreeDepth,
  predictTree,
  pruneTreeCostComplexity,
} from './engine';
import { PLAY_TENNIS_DATA, TENNIS_FEATURES, TENNIS_TARGET } from './playTennisData';

describe('Decision Tree Engine (L1 Verification)', () => {
  it('calculates exact Shannon Entropy and Gini Impurity for pure and balanced sets', () => {
    // Pure set
    expect(calculateEntropy(['Yes', 'Yes', 'Yes'])).toBe(0);
    expect(calculateGini(['Yes', 'Yes', 'Yes'])).toBe(0);

    // 50/50 balanced set
    expect(calculateEntropy(['Yes', 'No'])).toBeCloseTo(1.0, 5);
    expect(calculateGini(['Yes', 'No'])).toBeCloseTo(0.5, 5);

    // Play tennis root set (9 Yes, 5 No)
    const playLabels = PLAY_TENNIS_DATA.map((d) => d.play);
    const rootEntropy = calculateEntropy(playLabels);
    const rootGini = calculateGini(playLabels);

    // Exact theoretical: - (9/14)*log2(9/14) - (5/14)*log2(5/14) = 0.94028595867
    expect(rootEntropy).toBeCloseTo(0.94, 3);
    // Exact theoretical: 1 - ((9/14)^2 + (5/14)^2) = 0.45918367
    expect(rootGini).toBeCloseTo(0.459, 3);
  });

  it('correctly ranks candidate splits on Play Tennis dataset with Outlook winning', () => {
    const outlookSplit = evaluateCandidateSplit(
      PLAY_TENNIS_DATA,
      'outlook',
      TENNIS_TARGET,
      'entropy'
    );
    const humiditySplit = evaluateCandidateSplit(
      PLAY_TENNIS_DATA,
      'humidity',
      TENNIS_TARGET,
      'entropy'
    );
    const windSplit = evaluateCandidateSplit(PLAY_TENNIS_DATA, 'wind', TENNIS_TARGET, 'entropy');
    const tempSplit = evaluateCandidateSplit(PLAY_TENNIS_DATA, 'temp', TENNIS_TARGET, 'entropy');

    // Textbook values check
    expect(outlookSplit.gain).toBeCloseTo(0.247, 3);
    expect(humiditySplit.gain).toBeCloseTo(0.152, 3);
    expect(windSplit.gain).toBeCloseTo(0.048, 3);
    expect(tempSplit.gain).toBeCloseTo(0.029, 3);

    expect(outlookSplit.gain).toBeGreaterThan(humiditySplit.gain);
    expect(humiditySplit.gain).toBeGreaterThan(windSplit.gain);
    expect(windSplit.gain).toBeGreaterThan(tempSplit.gain);
  });

  it('builds full Mitchell decision tree on Play Tennis with 100% training accuracy', () => {
    const tree = buildDecisionTree(PLAY_TENNIS_DATA, TENNIS_FEATURES, TENNIS_TARGET, {
      criterion: 'entropy',
      maxDepth: 5,
    });

    expect(tree.attribute).toBe('outlook');
    expect(tree.children).toBeDefined();

    // Overcast is pure Yes
    const overcastChild = tree.children?.['Overcast'];
    expect(overcastChild?.isLeaf).toBe(true);
    expect(overcastChild?.prediction).toBe('Yes');

    // Sunny branches to humidity
    const sunnyChild = tree.children?.['Sunny'];
    expect(sunnyChild?.isLeaf).toBe(false);
    expect(sunnyChild?.attribute).toBe('humidity');

    // Rain branches to wind
    const rainChild = tree.children?.['Rain'];
    expect(rainChild?.isLeaf).toBe(false);
    expect(rainChild?.attribute).toBe('wind');

    // Test 100% accuracy on all 14 rows
    let correct = 0;
    for (const row of PLAY_TENNIS_DATA) {
      const pred = predictTree(tree, row);
      if (pred === row.play) correct++;
    }
    expect(correct).toBe(14);
  });

  it('respects maxDepth constraint for pre-pruning decision stumps', () => {
    const stump = buildDecisionTree(PLAY_TENNIS_DATA, TENNIS_FEATURES, TENNIS_TARGET, {
      criterion: 'entropy',
      maxDepth: 1,
    });

    expect(stump.attribute).toBe('outlook');
    expect(getTreeDepth(stump)).toBe(1);

    // All children of stump should be leaves
    for (const val in stump.children) {
      expect(stump.children[val]?.isLeaf).toBe(true);
    }
  });

  it('prunes tree with cost-complexity alpha penalty without mutating original', () => {
    const fullTree = buildDecisionTree(PLAY_TENNIS_DATA, TENNIS_FEATURES, TENNIS_TARGET, {
      criterion: 'entropy',
      maxDepth: 5,
    });

    const initialLeaves = countLeaves(fullTree);
    expect(initialLeaves).toBe(5);

    const pruned = pruneTreeCostComplexity(fullTree, 0.5);
    const prunedLeaves = countLeaves(pruned);

    // Pruned tree should have fewer or equal leaves
    expect(prunedLeaves).toBeLessThanOrEqual(initialLeaves);
    // Original tree must remain intact
    expect(countLeaves(fullTree)).toBe(initialLeaves);
  });

  it('supports CART Gini Impurity criterion with identical optimal root split', () => {
    const treeGini = buildDecisionTree(PLAY_TENNIS_DATA, TENNIS_FEATURES, TENNIS_TARGET, {
      criterion: 'gini',
      maxDepth: 5,
    });

    expect(treeGini.attribute).toBe('outlook');
    expect(treeGini.impurity).toBeCloseTo(0.459, 3);

    // Overcast is still 100% pure
    expect(treeGini.children?.['Overcast']?.isLeaf).toBe(true);
    expect(treeGini.children?.['Overcast']?.prediction).toBe('Yes');
  });
});
