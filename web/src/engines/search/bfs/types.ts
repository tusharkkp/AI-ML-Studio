export interface GridCoord {
  r: number;
  c: number;
}

export interface BFSInput {
  rows: number;
  cols: number;
  start: GridCoord;
  goal: GridCoord;
  obstacles: GridCoord[];
}

export interface BFSSnapshot {
  current: GridCoord | null;
  queue: GridCoord[];
  visited: GridCoord[];
  parentMap: Record<string, GridCoord | null>;
  path: GridCoord[] | null;
  foundGoal: boolean;
}
