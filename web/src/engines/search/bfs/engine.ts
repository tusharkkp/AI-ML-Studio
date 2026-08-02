import { Step, Engine } from '@/viz/player/types';
import { BFSInput, BFSSnapshot, GridCoord } from './types';

export const BFS_PSEUDOCODE = [
  'function BREADTH-FIRST-SEARCH(problem):',
  '  node = problem.INITIAL-STATE',
  '  if problem.IS-GOAL(node) return SUCCESS',
  '  frontier = FIFOQueue([node])',
  '  reached = {node}',
  '  while not frontier.IS-EMPTY():',
  '    node = frontier.POP()',
  '    for each child in EXPAND(problem, node):',
  '      if problem.IS-GOAL(child) return SUCCESS',
  '      if child not in reached:',
  '        reached.ADD(child)',
  '        frontier.PUSH(child)',
  '  return FAILURE',
];

function coordToKey(c: GridCoord): string {
  return `${c.r},${c.c}`;
}

export const bfsEngine: Engine<BFSInput, BFSSnapshot> = {
  id: 'search/bfs',
  name: 'Breadth-First Search (BFS)',
  description: 'Uninformed search exploring outward level-by-level using a FIFO queue.',
  pseudocode: BFS_PSEUDOCODE,

  *run(input: BFSInput, opts = {}): Generator<Step<BFSSnapshot>, void, void> {
    const { rows, cols, start, goal, obstacles } = input;
    const maxSteps = opts.maxSteps ?? 500;

    const obstacleSet = new Set<string>(obstacles.map(coordToKey));
    const visitedSet = new Set<string>();
    const parentMap: Record<string, GridCoord | null> = {};

    let stepIndex = 0;
    let nodesExpanded = 0;
    let maxFrontierSize = 1;

    // Check if start equals goal immediately
    if (start.r === goal.r && start.c === goal.c) {
      yield {
        index: stepIndex++,
        description: `Start cell (${start.r}, ${start.c}) is already the goal!`,
        highlights: [coordToKey(start)],
        state: {
          current: start,
          queue: [],
          visited: [start],
          parentMap: { [coordToKey(start)]: null },
          path: [start],
          foundGoal: true,
        },
        metrics: { nodesExpanded: 0, frontierSize: 0, pathCost: 0 },
        line: 3,
      };
      return;
    }

    // Step 0: Initialize
    const queue: GridCoord[] = [{ ...start }];
    visitedSet.add(coordToKey(start));
    parentMap[coordToKey(start)] = null;

    yield {
      index: stepIndex++,
      description: `Initialized BFS. Enqueued start cell (${start.r}, ${start.c}) into FIFO frontier.`,
      highlights: [coordToKey(start)],
      state: {
        current: null,
        queue: [...queue],
        visited: [{ ...start }],
        parentMap: { ...parentMap },
        path: null,
        foundGoal: false,
      },
      metrics: { nodesExpanded: 0, frontierSize: 1, maxFrontierSize: 1 },
      line: 4,
    };

    const directions: GridCoord[] = [
      { r: -1, c: 0 }, // Up
      { r: 0, c: 1 }, // Right
      { r: 1, c: 0 }, // Down
      { r: 0, c: -1 }, // Left
    ];

    while (queue.length > 0 && stepIndex < maxSteps) {
      maxFrontierSize = Math.max(maxFrontierSize, queue.length);
      const current = queue.shift()!;
      nodesExpanded++;
      const currentKey = coordToKey(current);

      yield {
        index: stepIndex++,
        description: `Popped (${current.r}, ${current.c}) from frontier queue for expansion.`,
        highlights: [currentKey],
        state: {
          current: { ...current },
          queue: [...queue],
          visited: Array.from(visitedSet).map((k) => {
            const [r, c] = k.split(',').map(Number);
            return { r: r!, c: c! };
          }),
          parentMap: { ...parentMap },
          path: null,
          foundGoal: false,
        },
        metrics: { nodesExpanded, frontierSize: queue.length, maxFrontierSize },
        line: 7,
      };

      for (const dir of directions) {
        const nr = current.r + dir.r;
        const nc = current.c + dir.c;
        const nextCoord: GridCoord = { r: nr, c: nc };
        const nextKey = coordToKey(nextCoord);

        // Boundary check
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
        // Obstacle check
        if (obstacleSet.has(nextKey)) continue;
        // Explored check
        if (visitedSet.has(nextKey)) continue;

        // Visit child
        visitedSet.add(nextKey);
        parentMap[nextKey] = { ...current };

        // Early goal check
        if (nr === goal.r && nc === goal.c) {
          // Reconstruct path
          const path: GridCoord[] = [{ ...nextCoord }];
          let curr: GridCoord | null = current;
          while (curr) {
            path.unshift(curr);
            curr = parentMap[coordToKey(curr)] ?? null;
          }

          yield {
            index: stepIndex++,
            description: `Goal reached at (${nr}, ${nc})! Reconstructed optimal path with cost ${path.length - 1}.`,
            highlights: path.map(coordToKey),
            state: {
              current: nextCoord,
              queue: [...queue],
              visited: Array.from(visitedSet).map((k) => {
                const [r, c] = k.split(',').map(Number);
                return { r: r!, c: c! };
              }),
              parentMap: { ...parentMap },
              path,
              foundGoal: true,
            },
            metrics: {
              nodesExpanded,
              frontierSize: queue.length,
              pathCost: path.length - 1,
              maxFrontierSize,
            },
            line: 9,
          };
          return;
        }

        queue.push(nextCoord);

        yield {
          index: stepIndex++,
          description: `Discovered unvisited neighbor (${nr}, ${nc}); added to FIFO frontier.`,
          highlights: [currentKey, nextKey],
          state: {
            current: { ...current },
            queue: [...queue],
            visited: Array.from(visitedSet).map((k) => {
              const [r, c] = k.split(',').map(Number);
              return { r: r!, c: c! };
            }),
            parentMap: { ...parentMap },
            path: null,
            foundGoal: false,
          },
          metrics: { nodesExpanded, frontierSize: queue.length, maxFrontierSize },
          line: 12,
        };
      }
    }

    // Exhausted without reaching goal
    yield {
      index: stepIndex++,
      description: 'Frontier is empty. No path exists to the goal.',
      highlights: [],
      state: {
        current: null,
        queue: [],
        visited: Array.from(visitedSet).map((k) => {
          const [r, c] = k.split(',').map(Number);
          return { r: r!, c: c! };
        }),
        parentMap: { ...parentMap },
        path: null,
        foundGoal: false,
      },
      metrics: { nodesExpanded, frontierSize: 0, maxFrontierSize },
      line: 13,
    };
  },
};
