import { describe, it, expect } from 'vitest';
import { runGeneticAlgorithm, computeFitness } from './engine';

describe('Genetic Algorithm Optimizer (genetic/optimizer)', () => {
  it('correctly calculates matching fitness', () => {
    expect(computeFitness('101010', '111111')).toBe(3);
    expect(computeFitness('AI LAB', 'AI LAB')).toBe(6);
    expect(computeFitness('HELLO', 'WORLD')).toBe(1); // 'L' at index 3
  });

  it('evolves 16-bit OneMax problem towards perfection', () => {
    const target = '1111111111111111'; // 16 bits
    const result = runGeneticAlgorithm({
      target,
      populationSize: 40,
      crossoverRate: 0.85,
      mutationRate: 0.03,
      elitismCount: 2,
      maxGenerations: 60,
      selectionMethod: 'tournament',
      randomSeed: 12345,
    });

    expect(result.steps.length).toBeGreaterThan(0);
    const initialFitness = result.steps[0]!.bestIndividual.fitness;
    const finalFitness = result.finalBest.fitness;

    // Fitness must strictly improve
    expect(finalFitness).toBeGreaterThan(initialFitness);
    expect(finalFitness).toBe(16); // Reaches all 16 bits
    expect(result.converged).toBe(true);
  });

  it('guarantees monotonically non-decreasing best fitness under elitism', () => {
    const target = '1111000011110000';
    const result = runGeneticAlgorithm({
      target,
      populationSize: 30,
      crossoverRate: 0.8,
      mutationRate: 0.02,
      elitismCount: 3, // elitism active
      maxGenerations: 40,
      randomSeed: 999,
    });

    for (let i = 1; i < result.steps.length; i++) {
      const prevBest = result.steps[i - 1]!.bestIndividual.fitness;
      const currBest = result.steps[i]!.bestIndividual.fitness;
      expect(currBest).toBeGreaterThanOrEqual(prevBest);
    }
  });

  it('supports two-point and uniform crossover without altering chromosome length', () => {
    const target = '101010101010';
    const resTwoPoint = runGeneticAlgorithm({
      target,
      populationSize: 20,
      crossoverMethod: 'two_point',
      maxGenerations: 10,
      randomSeed: 42,
    });
    expect(resTwoPoint.finalBest.chromosome.length).toBe(target.length);

    const resUniform = runGeneticAlgorithm({
      target,
      populationSize: 20,
      crossoverMethod: 'uniform',
      maxGenerations: 10,
      randomSeed: 42,
    });
    expect(resUniform.finalBest.chromosome.length).toBe(target.length);
  });

  it('evolves target text phrase "AI STUDIO"', () => {
    const target = 'AI STUDIO';
    const result = runGeneticAlgorithm({
      target,
      populationSize: 60,
      crossoverRate: 0.85,
      mutationRate: 0.04,
      elitismCount: 2,
      maxGenerations: 80,
      selectionMethod: 'tournament',
      randomSeed: 777,
    });

    expect(result.finalBest.fitness).toBeGreaterThanOrEqual(7);
  });
});

