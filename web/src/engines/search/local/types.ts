export type LocalSearchAlgorithm = 'hill-climbing' | 'random-restart' | 'simulated-annealing';

export interface LandscapePoint {
  x: number;
  elevation: number;
  label?: string; // e.g. "Local Peak", "Plateau", "Global Maximum"
}

export interface LocalSearchStep {
  stepIndex: number;
  currentX: number;
  currentElevation: number;
  candidateX?: number;
  candidateElevation?: number;
  deltaE?: number;
  temperature?: number;
  acceptanceProbability?: number;
  accepted: boolean;
  message: string;
}

export interface LocalSearchConfig {
  algorithm: LocalSearchAlgorithm;
  startX?: number; // initial position, default 0
  landscape?: number[]; // custom elevations
  maxSteps?: number; // default 50
  // Simulated Annealing parameters:
  initialTemperature?: number; // default 100
  coolingRate?: number; // default 0.90
  // Random Restart parameters:
  numRestarts?: number; // default 5
  seed?: number; // PRNG seed for deterministic test reproducibility
}

export interface LocalSearchResult {
  finalX: number;
  finalElevation: number;
  globalPeakX: number;
  globalPeakElevation: number;
  reachedGlobalPeak: boolean;
  trappedAtLocalOptimum: boolean;
  steps: LocalSearchStep[];
  restarts?: { startX: number; finalX: number; finalElevation: number }[];
}
