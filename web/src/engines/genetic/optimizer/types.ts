export type SelectionMethod = 'tournament' | 'roulette';
export type CrossoverMethod = 'single_point' | 'two_point' | 'uniform';

export interface Individual {
  chromosome: string;
  fitness: number;
}

export interface GaConfig {
  target: string;
  populationSize?: number;
  crossoverRate?: number;
  mutationRate?: number;
  elitismCount?: number;
  maxGenerations?: number;
  tournamentSize?: number;
  selectionMethod?: SelectionMethod;
  crossoverMethod?: CrossoverMethod;
  randomSeed?: number;
}

export interface GaStep {
  generation: number;
  bestIndividual: Individual;
  averageFitness: number;
  worstFitness: number;
  populationSample: Individual[];
  crossoversCount: number;
  mutationsCount: number;
  converged: boolean;
}

export interface GaResult {
  steps: GaStep[];
  finalBest: Individual;
  generationsCompleted: number;
  converged: boolean;
}

