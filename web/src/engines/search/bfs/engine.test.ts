import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { bfsEngine } from './engine';
import { BFSInput, GridCoord } from './types';

describe('BFS Engine Correctness (L1 Verification)', () => {
  it('hand-worked example: matches step-by-step textbook numbers on 3x3 grid', () => {
    // 3x3 Grid:
    // S . .
    // # # .
    // . G .
    const input: BFSInput = {
      rows: 3,
      cols: 3,
      start: { r: 0, c: 0 },
      goal: { r: 2, c: 1 },
      obstacles: [
        { r: 1, c: 0 },
        { r: 1, c: 1 },
      ],
    };

    const steps = Array.from(bfsEngine.run(input));
    expect(steps.length).toBeGreaterThan(0);

    const finalStep = steps[steps.length - 1]!;
    expect(finalStep.state.foundGoal).toBe(true);
    expect(finalStep.state.path).toBeDefined();

    // Optimal path in steps: (0,0) -> (0,1) -> (0,2) -> (1,2) -> (2,2) -> (2,1) = 5 edges
    expect(finalStep.metrics?.pathCost).toBe(5);
    expect(finalStep.state.path).toEqual([
      { r: 0, c: 0 },
      { r: 0, c: 1 },
      { r: 0, c: 2 },
      { r: 1, c: 2 },
      { r: 2, c: 2 },
      { r: 2, c: 1 },
    ]);
  });

  it('edge case: start equals goal', () => {
    const input: BFSInput = {
      rows: 4,
      cols: 4,
      start: { r: 1, c: 1 },
      goal: { r: 1, c: 1 },
      obstacles: [],
    };

    const steps = Array.from(bfsEngine.run(input));
    expect(steps.length).toBe(1);
    expect(steps[0]!.state.foundGoal).toBe(true);
    expect(steps[0]!.metrics?.pathCost).toBe(0);
  });

  it('failure mode: completely trapped goal reports failure cleanly', () => {
    const input: BFSInput = {
      rows: 3,
      cols: 3,
      start: { r: 0, c: 0 },
      goal: { r: 2, c: 2 },
      // Surround goal completely
      obstacles: [
        { r: 1, c: 2 },
        { r: 2, c: 1 },
      ],
    };

    const steps = Array.from(bfsEngine.run(input));
    const finalStep = steps[steps.length - 1]!;
    expect(finalStep.state.foundGoal).toBe(false);
    expect(finalStep.state.path).toBeNull();
    expect(finalStep.description).toContain('No path exists');
  });

  it('determinism: same input produces 100% deep equal traces', () => {
    const input: BFSInput = {
      rows: 5,
      cols: 5,
      start: { r: 0, c: 0 },
      goal: { r: 4, c: 4 },
      obstacles: [
        { r: 2, c: 2 },
        { r: 2, c: 3 },
      ],
    };

    const trace1 = Array.from(bfsEngine.run(input));
    const trace2 = Array.from(bfsEngine.run(input));

    expect(trace1).toEqual(trace2);
  });

  it('property-test (fast-check): BFS always returns minimal-cost path or reports unreachable (200 random grids)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 3, max: 7 }),
        fc.integer({ min: 3, max: 7 }),
        fc.array(
          fc.record({ r: fc.integer({ min: 0, max: 6 }), c: fc.integer({ min: 0, max: 6 }) }),
          { maxLength: 10 }
        ),
        (rows, cols, rawObstacles) => {
          const start: GridCoord = { r: 0, c: 0 };
          const goal: GridCoord = { r: rows - 1, c: cols - 1 };

          // Filter obstacles so they are inside bounds and do not cover start or goal
          const obstacles = rawObstacles.filter(
            (o) =>
              o.r < rows &&
              o.c < cols &&
              !(o.r === start.r && o.c === start.c) &&
              !(o.r === goal.r && o.c === goal.c)
          );

          const input: BFSInput = { rows, cols, start, goal, obstacles };
          const steps = Array.from(bfsEngine.run(input));
          expect(steps.length).toBeGreaterThan(0);

          const finalStep = steps[steps.length - 1]!;
          if (finalStep.state.foundGoal) {
            const path = finalStep.state.path!;
            expect(path[0]).toEqual(start);
            expect(path[path.length - 1]).toEqual(goal);
            expect(path.length - 1).toBe(finalStep.metrics?.pathCost);

            // Invariant: each step in path must be an adjacent orthogonal neighbor
            for (let i = 0; i < path.length - 1; i++) {
              const curr = path[i]!;
              const next = path[i + 1]!;
              const dist = Math.abs(curr.r - next.r) + Math.abs(curr.c - next.c);
              expect(dist).toBe(1);
            }
          }
        }
      ),
      { numRuns: 200 }
    );
  });
});
