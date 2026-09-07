import { describe, it, expect } from 'vitest';
import { solveCsp, runAc3, createMapColoringProblem, createNQueensProblem } from './engine';
import type { CspValue } from './types';

describe('Constraint Satisfaction Problem (CSP) Solver (csp/solver)', () => {
  it('solves Australia Map Coloring with 3 colors with zero constraint violations', () => {
    const problem = createMapColoringProblem(['Red', 'Green', 'Blue']);
    const result = solveCsp(problem, { useAc3: true, useMrv: true });

    expect(result.solved).toBe(true);
    expect(result.solution).toBeDefined();

    const sol = result.solution!;
    // Verify all adjacent constraints are strictly satisfied
    for (const c of problem.constraints) {
      expect(c.isValid(sol[c.var1]!, sol[c.var2]!)).toBe(true);
    }
  });

  it('detects AC-3 domain wipeout when adjacent regions are forced to same color', () => {
    const problem = createMapColoringProblem(['Red', 'Green', 'Blue']);
    // Pre-assign WA and NT to Red
    problem.domains['WA'] = ['Red'];
    problem.domains['NT'] = ['Red'];

    const ac3Result = runAc3(problem, problem.domains);
    // Since WA and NT are adjacent and both forced to 'Red', AC-3 must detect inconsistency
    expect(ac3Result.consistent).toBe(false);
  });

  it('solves 4-Queens problem finding a valid non-attacking placement', () => {
    const problem = createNQueensProblem(4);
    const result = solveCsp(problem, { useAc3: true, useMrv: true });

    expect(result.solved).toBe(true);
    expect(result.solution).toBeDefined();

    const sol = result.solution!;
    for (const c of problem.constraints) {
      expect(c.isValid(sol[c.var1]!, sol[c.var2]!)).toBe(true);
    }
  });

  it('solves 8-Queens problem with backtracking search and MRV', () => {
    const problem = createNQueensProblem(8);
    const result = solveCsp(problem, { useAc3: true, useMrv: true, maxSteps: 500 });

    expect(result.solved).toBe(true);
    expect(Object.keys(result.solution!).length).toBe(8);
  });

  it('reports failure when coloring K4 complete graph with only 2 colors', () => {
    const variables = ['A', 'B', 'C', 'D'];
    const domains = {
      A: ['Red', 'Green'],
      B: ['Red', 'Green'],
      C: ['Red', 'Green'],
      D: ['Red', 'Green'],
    };
    const constraints = [
      { var1: 'A', var2: 'B', isValid: (x: CspValue, y: CspValue) => x !== y },
      { var1: 'A', var2: 'C', isValid: (x: CspValue, y: CspValue) => x !== y },
      { var1: 'A', var2: 'D', isValid: (x: CspValue, y: CspValue) => x !== y },
      { var1: 'B', var2: 'C', isValid: (x: CspValue, y: CspValue) => x !== y },
      { var1: 'B', var2: 'D', isValid: (x: CspValue, y: CspValue) => x !== y },
      { var1: 'C', var2: 'D', isValid: (x: CspValue, y: CspValue) => x !== y },
    ];

    const result = solveCsp({ variables, domains, constraints });
    expect(result.solved).toBe(false);
    expect(result.solution).toBeNull();
  });
});
