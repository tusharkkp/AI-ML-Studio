export type ImpurityCriterion = 'entropy' | 'gini';

export interface DataRow {
  [key: string]: string | number;
}

export interface SplitCandidate {
  attribute: string;
  impurityBefore: number;
  weightedImpurity: number;
  gain: number;
  splitInfo?: number;
  gainRatio?: number;
  subsets: {
    value: string;
    count: number;
    distribution: Record<string, number>;
    impurity: number;
  }[];
}

export interface TreeNode {
  id: string;
  attribute?: string;
  isLeaf: boolean;
  prediction?: string;
  samples: number;
  distribution: Record<string, number>;
  impurity: number;
  children?: {
    [value: string]: TreeNode;
  };
  depth: number;
}

export interface DecisionTreeConfig {
  criterion: ImpurityCriterion;
  maxDepth?: number;
  minSamplesSplit?: number;
}

export interface DecisionTreeStep {
  index: number;
  action: 'EVALUATING_CANDIDATES' | 'SPLIT_CHOSEN' | 'LEAF_CREATED' | 'COMPLETE';
  description: string;
  currentNodeId: string;
  depth: number;
  candidates?: SplitCandidate[];
  chosenCandidate?: SplitCandidate;
  treeSnapshot: TreeNode;
}
