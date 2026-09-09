export interface GameTreeNode {
  id: string;
  name: string;
  value?: number; // terminal leaf value
  children?: GameTreeNode[];
}

export interface MinimaxStep {
  stepIndex: number;
  nodeId: string;
  nodeType: 'MAX' | 'MIN';
  alpha: number;
  beta: number;
  computedValue?: number;
  prunedChildren?: string[];
  message: string;
}

export interface MinimaxConfig {
  useAlphaBeta: boolean;
  initialAlpha?: number; // default -Infinity
  initialBeta?: number; // default Infinity
}

export interface MinimaxResult {
  rootValue: number;
  bestChildId?: string;
  nodesEvaluated: number;
  nodesPruned: number;
  prunedNodeIds: string[];
  steps: MinimaxStep[];
}

