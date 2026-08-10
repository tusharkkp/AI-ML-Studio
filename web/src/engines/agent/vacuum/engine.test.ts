import { describe, it, expect } from 'vitest';
import { vacuumEngine } from './engine';
import { VacuumInput } from './types';

describe('Vacuum Cleaner Agent Engine (L1 Verification)', () => {
  it('simple reflex agent cleans standard 2-room dirty world in 3 steps', () => {
    const input: VacuumInput = {
      rooms: { A: 'dirty', B: 'dirty' },
      initialLocation: 'A',
      agentType: 'simple-reflex',
    };

    const steps = Array.from(vacuumEngine.run(input, { maxSteps: 10 }));
    // Step 0: Init in A (dirty)
    // Step 1: Suck in A -> A is clean
    // Step 2: Move Right to B
    // Step 3: Suck in B -> B is clean
    expect(steps[1]!.state.lastAction).toBe('suck');
    expect(steps[2]!.state.lastAction).toBe('right');
    expect(steps[3]!.state.lastAction).toBe('suck');
    expect(steps[3]!.state.allClean).toBe(true);
  });

  it('failure mode: simple reflex oscillates infinitely when both rooms are clean', () => {
    const input: VacuumInput = {
      rooms: { A: 'clean', B: 'clean' },
      initialLocation: 'A',
      agentType: 'simple-reflex',
    };

    const steps = Array.from(vacuumEngine.run(input, { maxSteps: 6 }));
    // Step 1: in A (clean) -> moves right
    // Step 2: in B (clean) -> moves left
    // Step 3: in A (clean) -> moves right
    // Demonstrates simple reflex lack of internal memory
    expect(steps[1]!.state.lastAction).toBe('right');
    expect(steps[2]!.state.lastAction).toBe('left');
    expect(steps[3]!.state.lastAction).toBe('right');
    expect(steps[4]!.state.lastAction).toBe('left');
    expect(steps[steps.length - 1]!.state.halted).toBe(false); // never halts!
  });

  it('model-based agent remembers cleaned rooms and halts with NOOP', () => {
    const input: VacuumInput = {
      rooms: { A: 'dirty', B: 'dirty' },
      initialLocation: 'A',
      agentType: 'model-based',
    };

    const steps = Array.from(vacuumEngine.run(input, { maxSteps: 10 }));
    const finalStep = steps[steps.length - 1]!;

    expect(finalStep.state.allClean).toBe(true);
    expect(finalStep.state.lastAction).toBe('noop');
    expect(finalStep.state.halted).toBe(true);
    expect(finalStep.description).toContain('Halting to save power (NOOP)');
  });

  it('utility-based agent terminates when all rooms are clean to maximize utility score', () => {
    const input: VacuumInput = {
      rooms: { A: 'dirty', B: 'clean' },
      initialLocation: 'A',
      agentType: 'utility-based',
    };

    const steps = Array.from(vacuumEngine.run(input, { maxSteps: 10 }));
    // Step 1: sucks in A (score +40)
    // Step 2: all clean -> halts (NOOP) instead of wasting energy moving to B
    const finalStep = steps[steps.length - 1]!;
    expect(finalStep.state.lastAction).toBe('noop');
    expect(finalStep.state.allClean).toBe(true);
    expect(finalStep.state.totalScore).toBeGreaterThan(0);
  });

  it('determinism: identical inputs yield deep equal traces', () => {
    const input: VacuumInput = {
      rooms: { A: 'dirty', B: 'dirty', C: 'clean' },
      initialLocation: 'A',
      agentType: 'model-based',
    };

    const trace1 = Array.from(vacuumEngine.run(input));
    const trace2 = Array.from(vacuumEngine.run(input));

    expect(trace1).toEqual(trace2);
  });
});
