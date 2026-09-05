import { SeededRNG } from '@/utils/rng';
import type { LocalSearchConfig, LocalSearchResult, LocalSearchStep } from './types';

export const DEFAULT_LANDSCAPE: number[] = [
  10, 15, 22, 28, 25, 20, 18, 18, 18, 22, 35, 52, 60, 55, 38, 25, 25, 30, 42, 85, 95, 100, 88, 50,
  20,
];

export function getGlobalPeak(landscape: number[]): { x: number; elevation: number } {
  let peakX = 0;
  let peakElevation = -Infinity;
  for (let i = 0; i < landscape.length; i++) {
    const val = landscape[i]!;
    if (val > peakElevation) {
      peakElevation = val;
      peakX = i;
    }
  }
  return { x: peakX, elevation: peakElevation };
}

export function runSteepestAscent(
  landscape: number[],
  startX: number,
  maxSteps: number = 30
): { finalX: number; steps: LocalSearchStep[] } {
  const steps: LocalSearchStep[] = [];
  let currentX = Math.max(0, Math.min(landscape.length - 1, startX));
  let stepIndex = 1;

  steps.push({
    stepIndex: stepIndex++,
    currentX,
    currentElevation: landscape[currentX]!,
    accepted: true,
    message: `Initialized agent at x=${currentX} (Elevation: ${landscape[currentX]}).`,
  });

  for (let s = 0; s < maxSteps; s++) {
    const currentElevation = landscape[currentX]!;
    const leftX = currentX - 1;
    const rightX = currentX + 1;

    let bestNeighborX = currentX;
    let bestNeighborElevation = currentElevation;

    if (leftX >= 0 && landscape[leftX]! > bestNeighborElevation) {
      bestNeighborX = leftX;
      bestNeighborElevation = landscape[leftX]!;
    }

    if (rightX < landscape.length && landscape[rightX]! > bestNeighborElevation) {
      bestNeighborX = rightX;
      bestNeighborElevation = landscape[rightX]!;
    }

    // Trapped if no neighbor is strictly higher
    if (bestNeighborElevation <= currentElevation) {
      steps.push({
        stepIndex: stepIndex++,
        currentX,
        currentElevation,
        accepted: false,
        message: `Terminated: local peak or plateau reached at x=${currentX} (Elevation: ${currentElevation}). No higher neighbor exists.`,
      });
      break;
    }

    const deltaE = bestNeighborElevation - currentElevation;
    currentX = bestNeighborX;

    steps.push({
      stepIndex: stepIndex++,
      currentX,
      currentElevation: bestNeighborElevation,
      candidateX: bestNeighborX,
      candidateElevation: bestNeighborElevation,
      deltaE,
      accepted: true,
      message: `Climbed uphill to x=${currentX} (Elevation: ${bestNeighborElevation}, ΔE=+${deltaE}).`,
    });
  }

  return { finalX: currentX, steps };
}

export function runSimulatedAnnealing(
  landscape: number[],
  startX: number,
  initialTemperature: number = 100,
  coolingRate: number = 0.9,
  maxSteps: number = 60,
  seed: number = 42
): { finalX: number; steps: LocalSearchStep[] } {
  const rng = new SeededRNG(seed);
  const steps: LocalSearchStep[] = [];

  let currentX = Math.max(0, Math.min(landscape.length - 1, startX));
  let temperature = initialTemperature;
  let stepIndex = 1;

  steps.push({
    stepIndex: stepIndex++,
    currentX,
    currentElevation: landscape[currentX]!,
    temperature,
    accepted: true,
    message: `Initialized Simulated Annealing at x=${currentX} with T=${temperature.toFixed(1)}.`,
  });

  for (let s = 0; s < maxSteps; s++) {
    if (temperature < 1e-5) {
      steps.push({
        stepIndex: stepIndex++,
        currentX,
        currentElevation: landscape[currentX]!,
        temperature,
        accepted: false,
        message: `System frozen: Temperature dropped below 1e-5. Search halted at x=${currentX}.`,
      });
      break;
    }

    // Choose random neighbor (left or right)
    const options: number[] = [];
    if (currentX > 0) options.push(currentX - 1);
    if (currentX < landscape.length - 1) options.push(currentX + 1);

    const candidateX = options[rng.nextInt(0, options.length - 1)]!;
    const currentElevation = landscape[currentX]!;
    const candidateElevation = landscape[candidateX]!;
    const deltaE = candidateElevation - currentElevation;

    let accepted = false;
    let acceptanceProbability = 1.0;

    if (deltaE > 0) {
      // Always accept uphill move
      accepted = true;
      acceptanceProbability = 1.0;
    } else {
      // Metropolis criterion for downhill moves: P = exp(ΔE / T)
      acceptanceProbability = Math.exp(deltaE / temperature);
      accepted = rng.next() < acceptanceProbability;
    }

    if (accepted) {
      currentX = candidateX;
    }

    steps.push({
      stepIndex: stepIndex++,
      currentX,
      currentElevation: landscape[currentX]!,
      candidateX,
      candidateElevation,
      deltaE,
      temperature,
      acceptanceProbability,
      accepted,
      message: accepted
        ? deltaE > 0
          ? `Uphill move accepted to x=${candidateX} (ΔE=+${deltaE}).`
          : `Downhill move accepted via Metropolis probability P=${(acceptanceProbability * 100).toFixed(1)}% (T=${temperature.toFixed(1)}).`
        : `Downhill move to x=${candidateX} rejected (P=${(acceptanceProbability * 100).toFixed(1)}%). Stayed at x=${currentX}.`,
    });

    temperature *= coolingRate;
  }

  return { finalX: currentX, steps };
}

export function runRandomRestart(
  landscape: number[],
  numRestarts: number = 5,
  seed: number = 42
): {
  finalX: number;
  finalElevation: number;
  steps: LocalSearchStep[];
  restarts: { startX: number; finalX: number; finalElevation: number }[];
} {
  const rng = new SeededRNG(seed);
  const allSteps: LocalSearchStep[] = [];
  const restartRecords: { startX: number; finalX: number; finalElevation: number }[] = [];

  let overallBestX = 0;
  let overallBestElevation = -Infinity;

  for (let r = 0; r < numRestarts; r++) {
    const startX = rng.nextInt(0, landscape.length - 1);
    const climbResult = runSteepestAscent(landscape, startX);
    const endElevation = landscape[climbResult.finalX]!;

    restartRecords.push({
      startX,
      finalX: climbResult.finalX,
      finalElevation: endElevation,
    });

    // Tag and append steps
    climbResult.steps.forEach((st) => {
      allSteps.push({
        ...st,
        message: `[Restart ${r + 1}/${numRestarts}] ${st.message}`,
      });
    });

    if (endElevation > overallBestElevation) {
      overallBestElevation = endElevation;
      overallBestX = climbResult.finalX;
    }
  }

  return {
    finalX: overallBestX,
    finalElevation: overallBestElevation,
    steps: allSteps,
    restarts: restartRecords,
  };
}

export function runLocalSearch(config: LocalSearchConfig): LocalSearchResult {
  const landscape = config.landscape ?? DEFAULT_LANDSCAPE;
  const startX = config.startX ?? 0;
  const globalPeak = getGlobalPeak(landscape);

  let finalX = startX;
  let steps: LocalSearchStep[] = [];
  let restarts: { startX: number; finalX: number; finalElevation: number }[] | undefined;

  switch (config.algorithm) {
    case 'hill-climbing': {
      const res = runSteepestAscent(landscape, startX, config.maxSteps);
      finalX = res.finalX;
      steps = res.steps;
      break;
    }
    case 'simulated-annealing': {
      const res = runSimulatedAnnealing(
        landscape,
        startX,
        config.initialTemperature,
        config.coolingRate,
        config.maxSteps,
        config.seed ?? 42
      );
      finalX = res.finalX;
      steps = res.steps;
      break;
    }
    case 'random-restart': {
      const res = runRandomRestart(landscape, config.numRestarts ?? 5, config.seed ?? 42);
      finalX = res.finalX;
      steps = res.steps;
      restarts = res.restarts;
      break;
    }
  }

  const finalElevation = landscape[finalX]!;
  const reachedGlobalPeak = finalX === globalPeak.x;
  const trappedAtLocalOptimum = !reachedGlobalPeak && finalElevation < globalPeak.elevation;

  return {
    finalX,
    finalElevation,
    globalPeakX: globalPeak.x,
    globalPeakElevation: globalPeak.elevation,
    reachedGlobalPeak,
    trappedAtLocalOptimum,
    steps,
    restarts,
  };
}
