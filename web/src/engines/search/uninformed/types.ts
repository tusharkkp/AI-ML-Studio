export type NodeId = string;

export interface GraphNode {
  id: NodeId;
  label: string;
  x?: number;
  y?: number;
}

export interface GraphEdge {
  from: NodeId;
  to: NodeId;
  cost?: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  adjacency: Record<NodeId, { target: NodeId; cost: number }[]>;
}

export type UninformedAlgorithm = 'DFS' | 'DLS' | 'IDDFS' | 'BIDIRECTIONAL';

export interface UninformedSearchStep {
  stepIndex: number;
  currentNode: NodeId;
  frontier: NodeId[];
  explored: NodeId[];
  depth: number;
  actionDescription: string;
  isGoal?: boolean;
  backwardFrontier?: NodeId[];
  backwardExplored?: NodeId[];
  collisionNode?: NodeId;
}

export interface UninformedSearchResult {
  algorithm: UninformedAlgorithm;
  found: boolean;
  path: NodeId[];
  pathCost: number;
  nodesExplored: number;
  maxFrontierSize: number;
  steps: UninformedSearchStep[];
  cutoffOccurred?: boolean;
  iterations?: number;
}
