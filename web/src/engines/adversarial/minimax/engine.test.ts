import { describe, it, expect } from 'vitest';
import { runMinimax, CLASSIC_RUSSELL_NORVIG_TREE } from './engine';

describe('Adversarial Search: Minimax & Alpha-Beta Engine (adversarial/minimax)', () => {
  it('computes exact minimax value on classic Russell & Norvig game tree without pruning', () => {
    const result = runMinimax(CLASSIC_RUSSELL_NORVIG_TREE, { useAlphaBeta: false });
    expect(result.rootValue).toBe(3);
    expect(result.bestChildId).toBe('B');
    // Root (1) + 3 MIN nodes (3) + 9 leaves (9) = 13 nodes evaluated
    expect(result.nodesEvaluated).toBe(13);
    expect(result.nodesPruned).toBe(0);
  });

  it('alpha-beta pruning computes the exact same root minimax value while pruning branches', () => {
    const result = runMinimax(CLASSIC_RUSSELL_NORVIG_TREE, { useAlphaBeta: true });
    // Root value must be identical to unpruned minimax
    expect(result.rootValue).toBe(3);
    expect(result.bestChildId).toBe('B');
    // Subtrees under C (C2, C3) must be pruned because C1=2 gives beta=2 <= alpha=3
    expect(result.prunedNodeIds).toContain('C2');
    expect(result.prunedNodeIds).toContain('C3');
    expect(result.nodesPruned).toBeGreaterThanOrEqual(2);
    expect(result.nodesEvaluated).toBeLessThan(13);
  });

  it('correctly prunes MAX node when alpha exceeds beta', () => {
    // 2-ply tree where MIN root has children with known bounds
    const tree = {
      id: 'R',
      name: 'Root (MAX)',
      children: [
        {
          id: 'N1',
          name: 'N1 (MIN)',
          children: [
            { id: 'L1', name: 'L1', value: 10 },
            { id: 'L2', name: 'L2', value: 20 },
          ],
        },
        {
          id: 'N2',
          name: 'N2 (MIN)',
          children: [
            { id: 'L3', name: 'L3', value: 5 },
            { id: 'L4', name: 'L4', value: 100 },
          ],
        },
      ],
    };

    const res = runMinimax(tree, { useAlphaBeta: true });
    expect(res.rootValue).toBe(10);
    // After L3=5, beta at N2 is 5 <= alpha (10 from N1), so L4 is pruned!
    expect(res.prunedNodeIds).toContain('L4');
  });

  it('evaluates single-node terminal tree cleanly', () => {
    const singleNode = { id: 'T', name: 'Terminal', value: 42 };
    const res = runMinimax(singleNode);
    expect(res.rootValue).toBe(42);
    expect(res.nodesEvaluated).toBe(1);
    expect(res.nodesPruned).toBe(0);
  });
});

