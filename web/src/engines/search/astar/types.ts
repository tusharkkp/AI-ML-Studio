export type HeuristicType = 'manhattan' | 'euclidean' | 'overestimating' | 'zero';

export interface GridNode {
  x: number;
  y: number;
  isObstacle: boolean;
}

export interface SearchStep {
  stepIndex: number;
  currentNode: string; // "x,y"
  openSet: string[]; // List of node keys in open set
  closedSet: string[]; // List of node keys in closed set
  currentG: number;
  currentH: number;
  currentF: number;
  parentMap: Record<string, string>;
  message: string;
}

export interface AStarConfig {
  width: number;
  height: number;
  start: { x: number; y: number };
  goal: { x: number; y: number };
  obstacles: { x: number; y: number }[];
  algorithm: 'astar' | 'greedy';
  heuristic: HeuristicType;
  allowDiagonals?: boolean;
}

export interface AStarResult {
  found: boolean;
  path: { x: number; y: number }[];
  steps: SearchStep[];
  nodesExplored: number;
  pathCost: number;
  isOptimal: boolean;
  heuristicUsed: HeuristicType;
}
