import type { Individual, GaConfig, GaStep, GaResult, CrossoverMethod } from './types';

// Simple deterministic PRNG for reproducible test runs
function createRng(seed: number = 42) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

// Compute fitness: number of identical characters matching target
export function computeFitness(chromosome: string, target: string): number {
  let score = 0;
  const len = Math.min(chromosome.length, target.length);
  for (let i = 0; i < len; i++) {
    if (chromosome[i] === target[i]) {
      score++;
    }
  }
  return score;
}

// Generate a random individual matching target length
function generateRandomChromosome(length: number, isBinary: boolean, rng: () => number): string {
  const binaryChars = '01';
  const alphaChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ ';
  const chars = isBinary ? binaryChars : alphaChars;

  let res = '';
  for (let i = 0; i < length; i++) {
    const idx = Math.floor(rng() * chars.length);
    res += chars[idx];
  }
  return res;
}

// Tournament selection
function tournamentSelect(
  population: Individual[],
  tournamentSize: number,
  rng: () => number
): Individual {
  let best = population[Math.floor(rng() * population.length)]!;
  for (let i = 1; i < tournamentSize; i++) {
    const candidate = population[Math.floor(rng() * population.length)]!;
    if (candidate.fitness > best.fitness) {
      best = candidate;
    }
  }
  return best;
}

// Roulette wheel selection
function rouletteSelect(population: Individual[], rng: () => number): Individual {
  const totalFitness = population.reduce((sum, ind) => sum + ind.fitness, 0);
  if (totalFitness <= 0) {
    return population[Math.floor(rng() * population.length)]!;
  }

  const slice = rng() * totalFitness;
  let running = 0;
  for (const ind of population) {
    running += ind.fitness;
    if (running >= slice) {
      return ind;
    }
  }
  return population[population.length - 1]!;
}

// Crossover operators
function performCrossover(
  p1: string,
  p2: string,
  method: CrossoverMethod,
  rng: () => number
): [string, string] {
  const len = p1.length;
  if (len <= 1) return [p1, p2];

  if (method === 'single_point') {
    const point = 1 + Math.floor(rng() * (len - 1));
    const c1 = p1.slice(0, point) + p2.slice(point);
    const c2 = p2.slice(0, point) + p1.slice(point);
    return [c1, c2];
  } else if (method === 'two_point') {
    const pt1 = 1 + Math.floor(rng() * (len - 2));
    const pt2 = pt1 + 1 + Math.floor(rng() * (len - pt1 - 1));
    const c1 = p1.slice(0, pt1) + p2.slice(pt1, pt2) + p1.slice(pt2);
    const c2 = p2.slice(0, pt1) + p1.slice(pt1, pt2) + p2.slice(pt2);
    return [c1, c2];
  } else {
    // Uniform crossover
    let c1 = '';
    let c2 = '';
    for (let i = 0; i < len; i++) {
      if (rng() < 0.5) {
        c1 += p1[i];
        c2 += p2[i];
      } else {
        c1 += p2[i];
        c2 += p1[i];
      }
    }
    return [c1, c2];
  }
}

// Mutation operator
function performMutation(
  chromosome: string,
  mutationRate: number,
  isBinary: boolean,
  rng: () => number
): { mutated: string; count: number } {
  let mutated = '';
  let count = 0;
  const binaryChars = '01';
  const alphaChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ ';
  const chars = isBinary ? binaryChars : alphaChars;

  for (let i = 0; i < chromosome.length; i++) {
    if (rng() < mutationRate) {
      count++;
      if (isBinary) {
        mutated += chromosome[i] === '1' ? '0' : '1';
      } else {
        const charIdx = Math.floor(rng() * chars.length);
        mutated += chars[charIdx];
      }
    } else {
      mutated += chromosome[i];
    }
  }
  return { mutated, count };
}

export function runGeneticAlgorithm(config: GaConfig): GaResult {
  const {
    target,
    populationSize = 30,
    crossoverRate = 0.8,
    mutationRate = 0.02,
    elitismCount = 2,
    maxGenerations = 60,
    tournamentSize = 3,
    selectionMethod = 'tournament',
    crossoverMethod = 'single_point',
    randomSeed = 42,
  } = config;

  const rng = createRng(randomSeed);
  const isBinary = /^[01]+$/.test(target);
  const targetLength = target.length;
  const maxPossibleFitness = targetLength;

  // Initialize random population
  let population: Individual[] = [];
  for (let i = 0; i < populationSize; i++) {
    const chrom = generateRandomChromosome(targetLength, isBinary, rng);
    population.push({
      chromosome: chrom,
      fitness: computeFitness(chrom, target),
    });
  }

  const steps: GaStep[] = [];

  for (let gen = 0; gen <= maxGenerations; gen++) {
    // Sort population descending by fitness
    population.sort((a, b) => b.fitness - a.fitness);

    const bestIndividual = population[0]!;
    const worstIndividual = population[population.length - 1]!;
    const totalFitness = population.reduce((sum, ind) => sum + ind.fitness, 0);
    const averageFitness = Number((totalFitness / populationSize).toFixed(2));
    const converged = bestIndividual.fitness === maxPossibleFitness;

    // Record step log
    steps.push({
      generation: gen,
      bestIndividual: { ...bestIndividual },
      averageFitness,
      worstFitness: worstIndividual.fitness,
      populationSample: population.slice(0, 5).map((ind) => ({ ...ind })),
      crossoversCount: 0,
      mutationsCount: 0,
      converged,
    });

    if (converged || gen === maxGenerations) {
      return {
        steps,
        finalBest: bestIndividual,
        generationsCompleted: gen,
        converged,
      };
    }

    // Breed next generation
    const nextGeneration: Individual[] = [];

    // 1. Elitism: preserve top individuals
    for (let e = 0; e < elitismCount && e < population.length; e++) {
      nextGeneration.push({ ...population[e]! });
    }

    let genCrossovers = 0;
    let genMutations = 0;

    // 2. Fill rest of population with offspring
    while (nextGeneration.length < populationSize) {
      // Select parents
      const selectParent = () =>
        selectionMethod === 'tournament'
          ? tournamentSelect(population, tournamentSize, rng)
          : rouletteSelect(population, rng);

      const p1 = selectParent();
      const p2 = selectParent();

      let c1 = p1.chromosome;
      let c2 = p2.chromosome;

      // Crossover
      if (rng() < crossoverRate) {
        const [offspring1, offspring2] = performCrossover(c1, c2, crossoverMethod, rng);
        c1 = offspring1;
        c2 = offspring2;
        genCrossovers++;
      }

      // Mutation
      const mut1 = performMutation(c1, mutationRate, isBinary, rng);
      const mut2 = performMutation(c2, mutationRate, isBinary, rng);
      c1 = mut1.mutated;
      c2 = mut2.mutated;
      genMutations += mut1.count + mut2.count;

      nextGeneration.push({ chromosome: c1, fitness: computeFitness(c1, target) });
      if (nextGeneration.length < populationSize) {
        nextGeneration.push({ chromosome: c2, fitness: computeFitness(c2, target) });
      }
    }

    // Update step record stats for crossover and mutation counts
    const currentStep = steps[steps.length - 1]!;
    currentStep.crossoversCount = genCrossovers;
    currentStep.mutationsCount = genMutations;

    population = nextGeneration;
  }

  return {
    steps,
    finalBest: population[0]!,
    generationsCompleted: maxGenerations,
    converged: population[0]!.fitness === maxPossibleFitness,
  };
}
