import type { AStarConfig, AStarResult, HeuristicType, SearchStep } from './types';

export function computeHeuristic(
  x: number,
  y: number,
  gx: number,
  gy: number,
  type: HeuristicType
): number {
  const dx = Math.abs(x - gx);
  const dy = Math.abs(y - gy);

  switch (type) {
    case 'manhattan':
      return dx + dy;
    case 'euclidean':
      return Math.sqrt(dx * dx + dy * dy);
    case 'overestimating':
      // Overestimates true cost significantly (violates admissibility)
      return (dx + dy) * 2.5;
    case 'zero':
      return 0;
    default:
      return dx + dy;
  }
}

export function runAStarSearch(config: AStarConfig): AStarResult {
  const {
    width,
    height,
    start,
    goal,
    obstacles,
    algorithm,
    heuristic,
    allowDiagonals = false,
  } = config;

  const obstacleSet = new Set(obstacles.map((o) => `${o.x},${o.y}`));
  const startKey = `${start.x},${start.y}`;
  const goalKey = `${goal.x},${goal.y}`;

  if (startKey === goalKey) {
    return {
      found: true,
      path: [start],
      steps: [],
      nodesExplored: 0,
      pathCost: 0,
      isOptimal: true,
      heuristicUsed: heuristic,
    };
  }

  // Priority queue tracking maps
  const gScores: Record<string, number> = { [startKey]: 0 };
  const hScores: Record<string, number> = {
    [startKey]: computeHeuristic(start.x, start.y, goal.x, goal.y, heuristic),
  };
  const fScores: Record<string, number> = {
    [startKey]:
      algorithm === 'greedy'
        ? hScores[startKey]!
        : (gScores[startKey] ?? 0) + (hScores[startKey] ?? 0),
  };

  const openSet = new Set<string>([startKey]);
  const closedSet = new Set<string>();
  const parentMap: Record<string, string> = {};
  const steps: SearchStep[] = [];

  let stepCounter = 1;
  let found = false;

  const directions = allowDiagonals
    ? [
        { dx: 0, dy: -1, cost: 1 },
        { dx: 1, dy: 0, cost: 1 },
        { dx: 0, dy: 1, cost: 1 },
        { dx: -1, dy: 0, cost: 1 },
        { dx: 1, dy: -1, cost: 1.414 },
        { dx: 1, dy: 1, cost: 1.414 },
        { dx: -1, dy: 1, cost: 1.414 },
        { dx: -1, dy: -1, cost: 1.414 },
      ]
    : [
        { dx: 0, dy: -1, cost: 1 },
        { dx: 1, dy: 0, cost: 1 },
        { dx: 0, dy: 1, cost: 1 },
        { dx: -1, dy: 0, cost: 1 },
      ];

  while (openSet.size > 0) {
    // Find node with lowest fScore in openSet
    let currentKey = '';
    let minF = Infinity;

    for (const key of openSet) {
      const f = fScores[key] ?? Infinity;
      if (f < minF) {
        minF = f;
        currentKey = key;
      }
    }

    if (!currentKey) break;

    const [cx, cy] = currentKey.split(',').map(Number) as [number, number];
    const currentG = gScores[currentKey] ?? 0;
    const currentH = hScores[currentKey] ?? 0;

    // Record step
    steps.push({
      stepIndex: stepCounter++,
      currentNode: currentKey,
      openSet: Array.from(openSet),
      closedSet: Array.from(closedSet),
      currentG,
      currentH,
      currentF: minF,
      parentMap: { ...parentMap },
      message:
        currentKey === goalKey
          ? `Goal node (${cx}, ${cy}) reached! Path reconstruction initiated.`
          : `Expanding (${cx}, ${cy}) with g=${currentG.toFixed(1)}, h=${currentH.toFixed(1)}, f=${minF.toFixed(1)}.`,
    });

    if (currentKey === goalKey) {
      found = true;
      break;
    }

    openSet.delete(currentKey);
    closedSet.add(currentKey);

    // Expand neighbors
    for (const dir of directions) {
      const nx = cx + dir.dx;
      const ny = cy + dir.dy;
      const neighborKey = `${nx},${ny}`;

      // Boundary check
      if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
      // Obstacle check
      if (obstacleSet.has(neighborKey)) continue;
      // Already evaluated
      if (closedSet.has(neighborKey)) continue;

      const tentativeG = currentG + dir.cost;
      const existingG = gScores[neighborKey];

      if (existingG === undefined || tentativeG < existingG) {
        parentMap[neighborKey] = currentKey;
        gScores[neighborKey] = tentativeG;
        const hVal = computeHeuristic(nx, ny, goal.x, goal.y, heuristic);
        hScores[neighborKey] = hVal;
        fScores[neighborKey] = algorithm === 'greedy' ? hVal : tentativeG + hVal;

        openSet.add(neighborKey);
      }
    }
  }

  // Reconstruct path
  const path: { x: number; y: number }[] = [];
  let pathCost = 0;

  if (found) {
    let curr: string | undefined = goalKey;
    while (curr) {
      const [px, py] = curr.split(',').map(Number) as [number, number];
      path.unshift({ x: px, y: py });
      curr = parentMap[curr];
    }
    pathCost = gScores[goalKey] ?? 0;
  }

  return {
    found,
    path,
    steps,
    nodesExplored: closedSet.size + (found ? 1 : 0),
    pathCost,
    isOptimal: heuristic !== 'overestimating' && algorithm === 'astar',
    heuristicUsed: heuristic,
  };
}
