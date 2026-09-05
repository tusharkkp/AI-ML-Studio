import { describe, it, expect } from 'vitest';
import { runAStarSearch, computeHeuristic } from './engine';

describe('A* & Greedy Best-First Engine (search/astar)', () => {
  it('computes heuristics accurately', () => {
    expect(computeHeuristic(0, 0, 3, 4, 'manhattan')).toBe(7);
    expect(computeHeuristic(0, 0, 3, 4, 'euclidean')).toBe(5);
    expect(computeHeuristic(0, 0, 3, 4, 'zero')).toBe(0);
    expect(computeHeuristic(0, 0, 3, 4, 'overestimating')).toBe(7 * 2.5);
  });

  it('finds optimal straight-line path in unobstructed 5x5 grid', () => {
    const result = runAStarSearch({
      width: 5,
      height: 5,
      start: { x: 0, y: 0 },
      goal: { x: 4, y: 4 },
      obstacles: [],
      algorithm: 'astar',
      heuristic: 'manhattan',
    });

    expect(result.found).toBe(true);
    expect(result.pathCost).toBe(8); // (4-0) + (4-0) = 8 steps
    expect(result.path.length).toBe(9);
    expect(result.path[0]).toEqual({ x: 0, y: 0 });
    expect(result.path[result.path.length - 1]).toEqual({ x: 4, y: 4 });
  });

  it('navigates around a vertical barrier wall', () => {
    // 5x5 grid with wall at x=2, y=0..3, leaving an opening at y=4
    const obstacles = [
      { x: 2, y: 0 },
      { x: 2, y: 1 },
      { x: 2, y: 2 },
      { x: 2, y: 3 },
    ];

    const result = runAStarSearch({
      width: 5,
      height: 5,
      start: { x: 0, y: 2 },
      goal: { x: 4, y: 2 },
      obstacles,
      algorithm: 'astar',
      heuristic: 'manhattan',
    });

    expect(result.found).toBe(true);
    // Path must navigate around the wall through y=4
    expect(result.path.some((p) => p.x === 2 && p.y === 4)).toBe(true);
    expect(result.isOptimal).toBe(true);
  });

  it('zero heuristic behaves as Dijkstra / uniform cost search and still achieves optimality', () => {
    const obstacles = [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
    ];

    const result = runAStarSearch({
      width: 4,
      height: 4,
      start: { x: 0, y: 0 },
      goal: { x: 3, y: 3 },
      obstacles,
      algorithm: 'astar',
      heuristic: 'zero',
    });

    expect(result.found).toBe(true);
    expect(result.pathCost).toBe(6);
    expect(result.isOptimal).toBe(true);
  });

  it('greedy best-first expands aggressively towards the goal using h(n) alone', () => {
    const result = runAStarSearch({
      width: 6,
      height: 6,
      start: { x: 0, y: 0 },
      goal: { x: 5, y: 5 },
      obstacles: [],
      algorithm: 'greedy',
      heuristic: 'manhattan',
    });

    expect(result.found).toBe(true);
    // On open grid with Manhattan heuristic, Greedy explores minimal nodes directly towards goal
    expect(result.nodesExplored).toBeLessThanOrEqual(11);
  });

  it('reports failure when goal is completely enclosed by obstacles', () => {
    const obstacles = [
      { x: 3, y: 4 },
      { x: 4, y: 3 },
    ];

    const result = runAStarSearch({
      width: 5,
      height: 5,
      start: { x: 0, y: 0 },
      goal: { x: 4, y: 4 }, // corner (4,4) blocked by (3,4) and (4,3)
      obstacles,
      algorithm: 'astar',
      heuristic: 'manhattan',
    });

    expect(result.found).toBe(false);
    expect(result.path.length).toBe(0);
  });

  it('supports diagonal movements when enabled with Euclidean distance', () => {
    const result = runAStarSearch({
      width: 4,
      height: 4,
      start: { x: 0, y: 0 },
      goal: { x: 3, y: 3 },
      obstacles: [],
      algorithm: 'astar',
      heuristic: 'euclidean',
      allowDiagonals: true,
    });

    expect(result.found).toBe(true);
    // Direct diagonal path: (0,0) -> (1,1) -> (2,2) -> (3,3) = 4 nodes, 3 diagonal hops
    expect(result.path.length).toBe(4);
    expect(result.pathCost).toBeCloseTo(3 * 1.414, 1);
  });
});
