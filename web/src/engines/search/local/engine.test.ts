import { describe, it, expect } from 'vitest';
import { runLocalSearch, getGlobalPeak, runSteepestAscent, DEFAULT_LANDSCAPE } from './engine';

describe('Local Search Engine (search/local)', () => {
  it('correctly identifies the global peak of the rugged landscape', () => {
    const peak = getGlobalPeak(DEFAULT_LANDSCAPE);
    expect(peak.x).toBe(21);
    expect(peak.elevation).toBe(100);
  });

  it('steepest-ascent hill climbing from x=0 gets trapped at local peak x=3', () => {
    const result = runLocalSearch({
      algorithm: 'hill-climbing',
      startX: 0,
    });

    expect(result.finalX).toBe(3);
    expect(result.finalElevation).toBe(28);
    expect(result.reachedGlobalPeak).toBe(false);
    expect(result.trappedAtLocalOptimum).toBe(true);
  });

  it('steepest-ascent hill climbing from basin of attraction (x=18) reaches global peak', () => {
    const result = runLocalSearch({
      algorithm: 'hill-climbing',
      startX: 18,
    });

    expect(result.finalX).toBe(21);
    expect(result.finalElevation).toBe(100);
    expect(result.reachedGlobalPeak).toBe(true);
    expect(result.trappedAtLocalOptimum).toBe(false);
  });

  it('terminates immediately when starting on a flat plateau where no neighbor is higher', () => {
    // Landscape with plateau at index 1,2,3
    const plateau = [10, 20, 20, 20, 10];
    const { finalX, steps } = runSteepestAscent(plateau, 2);

    expect(finalX).toBe(2);
    expect(
      steps.some((s) => s.message.includes('plateau') || s.message.includes('Terminated'))
    ).toBe(true);
  });

  it('random-restart hill climbing finds global peak with multiple restarts', () => {
    const result = runLocalSearch({
      algorithm: 'random-restart',
      numRestarts: 10,
      seed: 12345,
    });

    expect(result.reachedGlobalPeak).toBe(true);
    expect(result.finalElevation).toBe(100);
    expect(result.restarts).toBeDefined();
    expect(result.restarts?.length).toBe(10);
  });

  it('simulated annealing with high temperature escapes local optima', () => {
    const result = runLocalSearch({
      algorithm: 'simulated-annealing',
      startX: 0,
      initialTemperature: 150,
      coolingRate: 0.95,
      maxSteps: 120,
      seed: 999,
    });

    // High temperature exploration allows crossing valleys and reaching higher elevation than local peak (28)
    expect(result.finalElevation).toBeGreaterThanOrEqual(28);
    expect(result.steps.some((s) => s.deltaE !== undefined && s.deltaE < 0 && s.accepted)).toBe(
      true
    );
  });

  it('simulated annealing with cold initial temperature freezes into greedy hill climbing', () => {
    const result = runLocalSearch({
      algorithm: 'simulated-annealing',
      startX: 0,
      initialTemperature: 0.1, // Cold temperature
      coolingRate: 0.95,
      maxSteps: 40,
      seed: 42,
    });

    // Cold temperature prevents downhill moves; gets stuck at local peak x=3
    expect(result.finalX).toBe(3);
    expect(result.finalElevation).toBe(28);
  });
});
