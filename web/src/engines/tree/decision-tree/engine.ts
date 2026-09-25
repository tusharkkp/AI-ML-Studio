import {
  DataRow,
  DecisionTreeConfig,
  DecisionTreeStep,
  ImpurityCriterion,
  SplitCandidate,
  TreeNode,
} from './types';

/**
 * Calculates Shannon Entropy:
 * H(S) = - \sum_{i=1}^k p_i \log_2(p_i)
 */
export function calculateEntropy(labels: string[]): number {
  if (labels.length === 0) return 0;
  const counts: Record<string, number> = {};
  for (const label of labels) {
    counts[label] = (counts[label] ?? 0) + 1;
  }
  const total = labels.length;
  let entropy = 0;
  for (const label in counts) {
    const p = (counts[label] ?? 0) / total;
    if (p > 0) {
      entropy -= p * Math.log2(p);
    }
  }
  return entropy;
}

/**
 * Calculates Gini Impurity:
 * Gini(S) = 1 - \sum_{i=1}^k p_i^2
 */
export function calculateGini(labels: string[]): number {
  if (labels.length === 0) return 0;
  const counts: Record<string, number> = {};
  for (const label of labels) {
    counts[label] = (counts[label] ?? 0) + 1;
  }
  const total = labels.length;
  let sumSq = 0;
  for (const label in counts) {
    const p = (counts[label] ?? 0) / total;
    sumSq += p * p;
  }
  return 1 - sumSq;
}

/**
 * Calculates Split Information:
 * SplitInfo(S, A) = - \sum (|S_v| / |S|) \log_2(|S_v| / |S|)
 */
export function calculateSplitInfo(subsetSizes: number[], totalSize: number): number {
  if (totalSize === 0) return 0;
  let splitInfo = 0;
  for (const size of subsetSizes) {
    if (size > 0) {
      const p = size / totalSize;
      splitInfo -= p * Math.log2(p);
    }
  }
  return splitInfo;
}

export function computeClassDistribution(
  data: DataRow[],
  targetCol: string
): Record<string, number> {
  const dist: Record<string, number> = {};
  for (const row of data) {
    const val = String(row[targetCol]);
    dist[val] = (dist[val] ?? 0) + 1;
  }
  return dist;
}

export function majorityClass(data: DataRow[], targetCol: string, fallback = 'Unknown'): string {
  if (data.length === 0) return fallback;
  const dist = computeClassDistribution(data, targetCol);
  let bestClass = fallback;
  let maxCount = -1;
  for (const cls in dist) {
    const count = dist[cls] ?? 0;
    if (count > maxCount) {
      maxCount = count;
      bestClass = cls;
    }
  }
  return bestClass;
}

export function computeImpurity(labels: string[], criterion: ImpurityCriterion): number {
  return criterion === 'entropy' ? calculateEntropy(labels) : calculateGini(labels);
}

/**
 * Evaluates splitting candidate attribute on a dataset.
 */
export function evaluateCandidateSplit(
  data: DataRow[],
  attribute: string,
  targetCol: string,
  criterion: ImpurityCriterion = 'entropy'
): SplitCandidate {
  const allLabels = data.map((d) => String(d[targetCol]));
  const impurityBefore = computeImpurity(allLabels, criterion);
  const total = data.length;

  const grouped: Record<string, DataRow[]> = {};
  for (const row of data) {
    const val = String(row[attribute]);
    if (!grouped[val]) grouped[val] = [];
    grouped[val]?.push(row);
  }

  const subsets: SplitCandidate['subsets'] = [];
  let weightedImpurity = 0;
  const subsetSizes: number[] = [];

  for (const val of Object.keys(grouped).sort()) {
    const subsetRows = grouped[val] ?? [];
    const subsetLabels = subsetRows.map((r) => String(r[targetCol]));
    const subsetImpurity = computeImpurity(subsetLabels, criterion);
    const count = subsetRows.length;
    subsetSizes.push(count);

    weightedImpurity += (count / total) * subsetImpurity;

    subsets.push({
      value: val,
      count,
      distribution: computeClassDistribution(subsetRows, targetCol),
      impurity: subsetImpurity,
    });
  }

  const gain = Math.max(0, impurityBefore - weightedImpurity);
  const splitInfo = calculateSplitInfo(subsetSizes, total);
  const gainRatio = splitInfo > 0 ? gain / splitInfo : 0;

  return {
    attribute,
    impurityBefore,
    weightedImpurity,
    gain,
    splitInfo,
    gainRatio,
    subsets,
  };
}

let nodeCounter = 0;

export function buildDecisionTree(
  data: DataRow[],
  features: string[],
  targetCol: string,
  config: Partial<DecisionTreeConfig> = {},
  depth = 0
): TreeNode {
  const criterion = config.criterion ?? 'entropy';
  const maxDepth = config.maxDepth ?? 10;
  const minSamplesSplit = config.minSamplesSplit ?? 2;

  const id = `node_${++nodeCounter}`;
  const allLabels = data.map((r) => String(r[targetCol]));
  const distribution = computeClassDistribution(data, targetCol);
  const impurity = computeImpurity(allLabels, criterion);
  const samples = data.length;

  // Stopping conditions: pure node, no remaining features, max depth, or min samples
  const distinctClasses = Object.keys(distribution);
  if (
    distinctClasses.length <= 1 ||
    features.length === 0 ||
    depth >= maxDepth ||
    samples < minSamplesSplit ||
    impurity === 0
  ) {
    return {
      id,
      isLeaf: true,
      prediction: majorityClass(data, targetCol),
      samples,
      distribution,
      impurity,
      depth,
    };
  }

  // Find best feature to split on
  let bestCandidate: SplitCandidate | null = null;
  for (const feature of features) {
    const candidate = evaluateCandidateSplit(data, feature, targetCol, criterion);
    if (!bestCandidate || candidate.gain > bestCandidate.gain) {
      bestCandidate = candidate;
    }
  }

  // If gain is 0 or no improvement, make leaf
  if (!bestCandidate || bestCandidate.gain <= 1e-6) {
    return {
      id,
      isLeaf: true,
      prediction: majorityClass(data, targetCol),
      samples,
      distribution,
      impurity,
      depth,
    };
  }

  const children: Record<string, TreeNode> = {};
  const remainingFeatures = features.filter((f) => f !== bestCandidate?.attribute);

  for (const subset of bestCandidate.subsets) {
    const subsetRows = data.filter(
      (r) => String(r[bestCandidate?.attribute ?? '']) === subset.value
    );
    if (subsetRows.length === 0) {
      children[subset.value] = {
        id: `node_${++nodeCounter}`,
        isLeaf: true,
        prediction: majorityClass(data, targetCol),
        samples: 0,
        distribution: {},
        impurity: 0,
        depth: depth + 1,
      };
    } else {
      children[subset.value] = buildDecisionTree(
        subsetRows,
        remainingFeatures,
        targetCol,
        config,
        depth + 1
      );
    }
  }

  return {
    id,
    attribute: bestCandidate.attribute,
    isLeaf: false,
    samples,
    distribution,
    impurity,
    children,
    depth,
  };
}

export function predictTree(tree: TreeNode, sample: DataRow, defaultClass = 'Unknown'): string {
  if (tree.isLeaf || !tree.attribute || !tree.children) {
    return tree.prediction ?? defaultClass;
  }

  const val = String(sample[tree.attribute]);
  const child = tree.children[val];
  if (child) {
    return predictTree(child, sample, majorityClassFromDistribution(tree.distribution));
  }
  return majorityClassFromDistribution(tree.distribution);
}

function majorityClassFromDistribution(dist: Record<string, number>): string {
  let best = 'Unknown';
  let max = -1;
  for (const c in dist) {
    if ((dist[c] ?? 0) > max) {
      max = dist[c] ?? 0;
      best = c;
    }
  }
  return best;
}

export function getTreeDepth(tree: TreeNode): number {
  if (tree.isLeaf || !tree.children) return 0;
  let maxSubDepth = 0;
  for (const val in tree.children) {
    const child = tree.children[val];
    if (child) {
      maxSubDepth = Math.max(maxSubDepth, 1 + getTreeDepth(child));
    }
  }
  return maxSubDepth;
}

export function countLeaves(tree: TreeNode): number {
  if (tree.isLeaf || !tree.children) return 1;
  let total = 0;
  for (const val in tree.children) {
    const child = tree.children[val];
    if (child) {
      total += countLeaves(child);
    }
  }
  return total;
}

/**
 * Deep clones a tree node.
 */
export function cloneTree(node: TreeNode): TreeNode {
  const copy: TreeNode = {
    ...node,
    distribution: { ...node.distribution },
  };
  if (node.children) {
    copy.children = {};
    for (const key in node.children) {
      const child = node.children[key];
      if (child) {
        copy.children[key] = cloneTree(child);
      }
    }
  }
  return copy;
}

/**
 * Cost-Complexity Pruning Simulation:
 * R_alpha(T) = R(T) + alpha * |T|
 * Prunes nodes from bottom-up whose impurity reduction does not justify the complexity penalty alpha.
 */
export function pruneTreeCostComplexity(tree: TreeNode, alpha: number): TreeNode {
  const root = cloneTree(tree);

  function pruneRecursive(node: TreeNode): void {
    if (node.isLeaf || !node.children) return;

    for (const key in node.children) {
      const child = node.children[key];
      if (child) {
        pruneRecursive(child);
      }
    }

    // Check if all children are leaves
    let allChildrenLeaves = true;
    for (const key in node.children) {
      if (!node.children[key]?.isLeaf) {
        allChildrenLeaves = false;
        break;
      }
    }

    if (allChildrenLeaves) {
      // Misclassification count if converted to leaf vs sum of children
      const leafMajority = majorityClassFromDistribution(node.distribution);
      const leafErrors = node.samples - (node.distribution[leafMajority] ?? 0);

      let childrenErrors = 0;
      let childrenCount = 0;
      for (const key in node.children) {
        const child = node.children[key];
        if (child) {
          const childMaj = child.prediction ?? '';
          childrenErrors += child.samples - (child.distribution[childMaj] ?? 0);
          childrenCount++;
        }
      }

      // Cost of collapsing to leaf vs keeping subtree:
      // Error increase = leafErrors - childrenErrors
      // Leaf count decrease = childrenCount - 1
      const errorIncrease = leafErrors - childrenErrors;
      const leafCountSaved = Math.max(1, childrenCount - 1);
      const costPerLeaf = errorIncrease / leafCountSaved;

      if (costPerLeaf <= alpha * 10) {
        // Prune: turn node into leaf
        node.isLeaf = true;
        node.prediction = leafMajority;
        delete node.children;
        delete node.attribute;
      }
    }
  }

  pruneRecursive(root);
  return root;
}

/**
 * Generates step-by-step trace for building the decision tree.
 */
export function generateDecisionTreeTrace(
  data: DataRow[],
  features: string[],
  targetCol: string,
  config: Partial<DecisionTreeConfig> = {}
): DecisionTreeStep[] {
  nodeCounter = 0;
  const steps: DecisionTreeStep[] = [];
  const criterion = config.criterion ?? 'entropy';

  const root = buildDecisionTree(data, features, targetCol, config);

  steps.push({
    index: 0,
    action: 'EVALUATING_CANDIDATES',
    description: `Initiated decision tree induction with ${data.length} instances across ${features.length} candidate attributes using ${criterion} criterion.`,
    currentNodeId: root.id,
    depth: 0,
    candidates: features.map((f) => evaluateCandidateSplit(data, f, targetCol, criterion)),
    treeSnapshot: cloneTree(root),
  });

  return steps;
}
