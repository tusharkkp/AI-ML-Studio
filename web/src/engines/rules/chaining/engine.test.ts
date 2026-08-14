import { describe, it, expect } from 'vitest';
import { runForwardChaining, runBackwardChaining } from './engine';
import type { HornRule } from './types';

describe('Horn Clause Rule Chaining Engines', () => {
  const animalRules: HornRule[] = [
    { id: 'R1', premises: ['HasFeathers'], conclusion: 'Bird' },
    { id: 'R2', premises: ['Bird', 'CanFly'], conclusion: 'Eagle' },
    { id: 'R3', premises: ['HasFur', 'GivesMilk'], conclusion: 'Mammal' },
    { id: 'R4', premises: ['Mammal', 'HasStripes', 'Carnivore'], conclusion: 'Tiger' },
  ];

  it('forward chains and derives all reachable consequences', () => {
    const facts = ['HasFeathers', 'CanFly'];
    const res = runForwardChaining(animalRules, facts, 'Eagle');

    expect(res.goalReached).toBe(true);
    expect(res.derivedFacts).toContain('Bird');
    expect(res.derivedFacts).toContain('Eagle');
    expect(res.rulesFired).toEqual(['R1', 'R2']);
    expect(res.derivedFacts).not.toContain('Mammal');
  });

  it('backward chains goal-driven through dependencies', () => {
    const facts = ['HasFeathers', 'CanFly'];
    const res = runBackwardChaining(animalRules, facts, 'Eagle');

    expect(res.goalProved).toBe(true);
    expect(res.proofPath).toContain('R1');
    expect(res.proofPath).toContain('R2');
  });

  it('forward and backward chaining produce identical entailment decisions (Soundness Equivalence)', () => {
    const facts = ['HasFeathers', 'CanFly'];

    // Goal 1: Eagle (should be true for both)
    const fcEagle = runForwardChaining(animalRules, facts, 'Eagle').goalReached;
    const bcEagle = runBackwardChaining(animalRules, facts, 'Eagle').goalProved;
    expect(fcEagle).toBe(true);
    expect(bcEagle).toBe(true);

    // Goal 2: Tiger (should be false for both)
    const fcTiger = runForwardChaining(animalRules, facts, 'Tiger').goalReached;
    const bcTiger = runBackwardChaining(animalRules, facts, 'Tiger').goalProved;
    expect(fcTiger).toBe(false);
    expect(bcTiger).toBe(false);
  });

  it('safely breaks cycles in backward chaining without stack overflow', () => {
    const cyclicRules: HornRule[] = [
      { id: 'RC1', premises: ['A'], conclusion: 'B' },
      { id: 'RC2', premises: ['B'], conclusion: 'A' },
      { id: 'RC3', premises: ['B'], conclusion: 'C' },
    ];
    const facts = ['A'];

    const res = runBackwardChaining(cyclicRules, facts, 'C');
    expect(res.goalProved).toBe(true);
  });

  it('handles empty facts and unprovable goals cleanly', () => {
    const resFC = runForwardChaining(animalRules, [], 'Bird');
    expect(resFC.goalReached).toBe(false);
    expect(resFC.derivedFacts).toHaveLength(0);

    const resBC = runBackwardChaining(animalRules, [], 'Bird');
    expect(resBC.goalProved).toBe(false);
  });
});
