import { describe, it, expect } from 'vitest';
import { buildGraph, runDfs, runDls, runIddfs, runBidirectional } from './engine';

describe('Uninformed Search Engine Suite', () => {
  // Test Graph:
  //         A
  //       /   \
  //      B     C
  //     / \     \
  //    D   E     F
  //         \
  //          G (Goal)
  const treeNodes = [
    { id: 'A', label: 'A' },
    { id: 'B', label: 'B' },
    { id: 'C', label: 'C' },
    { id: 'D', label: 'D' },
    { id: 'E', label: 'E' },
    { id: 'F', label: 'F' },
    { id: 'G', label: 'G' },
  ];

  const treeEdges = [
    { from: 'A', to: 'B', bidirectional: true },
    { from: 'A', to: 'C', bidirectional: true },
    { from: 'B', to: 'D', bidirectional: true },
    { from: 'B', to: 'E', bidirectional: true },
    { from: 'C', to: 'F', bidirectional: true },
    { from: 'E', to: 'G', bidirectional: true },
  ];

  const treeGraph = buildGraph(treeNodes, treeEdges);

  it('buildGraph correctly populates adjacency list', () => {
    expect(treeGraph.adjacency['A']).toHaveLength(2);
    expect(treeGraph.adjacency['B']?.map((e) => e.target)).toContain('D');
    expect(treeGraph.adjacency['B']?.map((e) => e.target)).toContain('E');
  });

  describe('runDfs', () => {
    it('finds path from A to G in depth-first order', () => {
      const result = runDfs(treeGraph, 'A', 'G');
      expect(result.found).toBe(true);
      expect(result.path).toEqual(['A', 'B', 'E', 'G']);
      expect(result.pathCost).toBe(3);
      expect(result.steps.length).toBeGreaterThan(0);
    });

    it('returns found: false when goal is unreachable', () => {
      const disconnectedGraph = buildGraph(
        [
          { id: '1', label: '1' },
          { id: '2', label: '2' },
        ],
        []
      );
      const result = runDfs(disconnectedGraph, '1', '2');
      expect(result.found).toBe(false);
      expect(result.path).toHaveLength(0);
    });
  });

  describe('runDls', () => {
    it('finds goal when limit is sufficient', () => {
      // Depth of G is 3 (A -> B -> E -> G)
      const result = runDls(treeGraph, 'A', 'G', 3);
      expect(result.found).toBe(true);
      expect(result.cutoffOccurred).toBe(false);
      expect(result.path).toEqual(['A', 'B', 'E', 'G']);
    });

    it('flags cutoffOccurred when limit is shallower than goal', () => {
      // Limit 2 is too shallow to reach G (depth 3)
      const result = runDls(treeGraph, 'A', 'G', 2);
      expect(result.found).toBe(false);
      expect(result.cutoffOccurred).toBe(true);
      expect(result.path).toHaveLength(0);
    });
  });

  describe('runIddfs', () => {
    it('iteratively increases depth and finds optimal shallow path to G', () => {
      const result = runIddfs(treeGraph, 'A', 'G', 5);
      expect(result.found).toBe(true);
      expect(result.path).toEqual(['A', 'B', 'E', 'G']);
      expect(result.iterations).toBe(4); // limits 0, 1, 2, 3
      expect(result.cutoffOccurred).toBe(false);
    });

    it('handles start node being the goal at depth 0', () => {
      const result = runIddfs(treeGraph, 'A', 'A', 5);
      expect(result.found).toBe(true);
      expect(result.path).toEqual(['A']);
      expect(result.pathCost).toBe(0);
      expect(result.iterations).toBe(1);
    });
  });

  describe('runBidirectional', () => {
    it('expands from both ends and meets at a collision node', () => {
      const result = runBidirectional(treeGraph, 'A', 'G');
      expect(result.found).toBe(true);
      expect(result.path[0]).toBe('A');
      expect(result.path[result.path.length - 1]).toBe('G');
      expect(result.path).toEqual(['A', 'B', 'E', 'G']);
    });

    it('immediately succeeds if start equals goal', () => {
      const result = runBidirectional(treeGraph, 'B', 'B');
      expect(result.found).toBe(true);
      expect(result.path).toEqual(['B']);
      expect(result.pathCost).toBe(0);
    });
  });
});

