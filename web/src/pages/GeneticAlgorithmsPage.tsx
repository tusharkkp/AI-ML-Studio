import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Quiz } from '@/features/quiz/Quiz';
import { GeneticAlgorithmLab } from '@/labs/genetic-algorithm/GeneticAlgorithmLab';
import { ArrowLeft } from 'lucide-react';

export function GeneticAlgorithmsPage() {
  const [showMath, setShowMath] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<string | null>(null);

  const quizItems = [
    {
      id: 'ga-q1',
      question:
        'What happens if the mutation rate in a Genetic Algorithm is set to exactly zero (p_m = 0)?',
      options: [
        {
          id: 'A',
          text: 'If none of the initial chromosomes contain the correct allele at a specific gene position, the algorithm can never discover it and prematurely converges on a suboptimal solution.',
          isCorrect: true,
          explanation:
            'Crossover can only recombine alleles already present in the gene pool. Without mutation to introduce novel genetic material, any allele missing from the initial generation can never be created, causing irreversible stagnation.',
        },
        {
          id: 'B',
          text: 'The algorithm accelerates by 10x and is mathematically guaranteed to find the global optimum.',
          isCorrect: false,
          explanation:
            'Zero mutation destroys diversity and traps the search in local optima rather than accelerating to the global optimum.',
        },
        {
          id: 'C',
          text: 'The population completely dissolves into random noise.',
          isCorrect: false,
          explanation:
            'High mutation creates noise; zero mutation causes premature convergence and rigid stagnation.',
        },
      ],
    },
    {
      id: 'ga-q2',
      question:
        "According to Holland's Schema Theorem, which types of schemas (building blocks) receive exponentially increasing trials in future generations?",
      options: [
        {
          id: 'A',
          text: 'Short, low-order schemas with above-average fitness.',
          isCorrect: true,
          explanation:
            "Holland's Schema Theorem proves that schemas with short defining length (compact δ(H)), low order (few fixed positions o(H)), and above-average fitness increase exponentially over generations because they are unlikely to be disrupted by crossover.",
        },
        {
          id: 'B',
          text: 'Long schemas with maximum order and lowest fitness.',
          isCorrect: false,
          explanation:
            'Long schemas are easily cut apart by crossover, and low-fitness schemas are discarded by selection.',
        },
        {
          id: 'C',
          text: 'Only schemas that contain prime numbers of ones.',
          isCorrect: false,
          explanation: 'Schema fitness is independent of prime number counts.',
        },
      ],
    },
    {
      id: 'ga-q3',
      question: 'What is the primary role of Elitism in genetic algorithms?',
      options: [
        {
          id: 'A',
          text: 'Preserving the best-performing chromosome(s) unchanged into the next generation so peak fitness never degrades due to crossover or mutation disruption.',
          isCorrect: true,
          explanation:
            'Without elitism, stochastic crossover and mutation could accidentally destroy the best solution discovered so far. Elitism ensures the best fitness curve is monotonically non-decreasing.',
        },
        {
          id: 'B',
          text: 'Disqualifying all chromosomes that were created through single-point crossover.',
          isCorrect: false,
          explanation: 'Elitism preserves solutions; it does not disqualify crossover operators.',
        },
        {
          id: 'C',
          text: 'Setting the fitness score of every chromosome to infinity.',
          isCorrect: false,
          explanation: 'Fitness scores are computed objectively by the fitness function.',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0c0a09] text-stone-300 antialiased py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/learn/unit-2"
            className="inline-flex items-center gap-2 text-xs font-medium text-stone-400 hover:text-[#fef3c7] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Unit 2 Overview
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="unit">Unit 2</Badge>
            <Badge variant="default">Self-Study</Badge>
            <span className="text-xs text-stone-500 font-mono">0.6 hrs</span>
          </div>
        </div>

        {/* Section 1: Header */}
        <header className="space-y-4 border-b border-[#292524] pb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-heading">
            Self-Study: Genetic Algorithms (GA)
          </h1>
          <p className="text-base text-stone-400 leading-relaxed max-w-3xl">
            Explore stochastic evolutionary optimization inspired by Darwinian natural selection,
            where a population of candidate{' '}
            <span className="font-heading text-[#fef3c7] font-semibold">
              chromosomes evolves through selection, crossover, and mutation
            </span>{' '}
            to solve non-differentiable search problems.
          </p>
        </header>

        {/* Section 2: Intuition & Biological Metaphor */}
        <Card className="p-6 bg-[#171412] border-[#292524]">
          <h2 className="text-xl font-bold text-white font-heading mb-4">
            Biological inspiration: Evolution as global search
          </h2>
          <p className="text-sm text-stone-300 leading-relaxed mb-4">
            In biological evolution, living organisms adapt over generations to thrive in complex
            environments. In 1975, computer scientist John Holland realized that this process of{' '}
            <span className="font-heading text-[#fef3c7] font-semibold">
              natural selection and genetic recombination
            </span>{' '}
            could be formalized into a powerful general-purpose optimization algorithm.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-xs">
            <div className="p-3 bg-[#110f0e] rounded border border-[#292524]">
              <div className="text-[10px] uppercase text-stone-500 font-mono">Genotype</div>
              <div className="font-bold text-stone-200 mt-1">Chromosome</div>
              <div className="text-stone-400 mt-0.5">
                Bitstring / array encoding candidate solution
              </div>
            </div>
            <div className="p-3 bg-[#110f0e] rounded border border-[#292524]">
              <div className="text-[10px] uppercase text-stone-500 font-mono">Phenotype</div>
              <div className="font-bold text-stone-200 mt-1">Candidate State</div>
              <div className="text-stone-400 mt-0.5">The concrete parameter vector or solution</div>
            </div>
            <div className="p-3 bg-[#110f0e] rounded border border-[#292524]">
              <div className="text-[10px] uppercase text-stone-500 font-mono">
                Natural Selection
              </div>
              <div className="font-bold text-stone-200 mt-1">Fitness Function</div>
              <div className="text-stone-400 mt-0.5">
                Objective function evaluating solution quality
              </div>
            </div>
            <div className="p-3 bg-[#110f0e] rounded border border-[#292524]">
              <div className="text-[10px] uppercase text-stone-500 font-mono">Variation</div>
              <div className="font-bold text-stone-200 mt-1">Crossover & Mutation</div>
              <div className="text-stone-400 mt-0.5">
                Exploration operators generating novel offspring
              </div>
            </div>
          </div>
        </Card>

        {/* Section 3: Predict-then-Reveal Prompt */}
        <Card className="p-6 bg-[#171412] border-[#292524]">
          <h2 className="text-lg font-bold text-white font-heading mb-2">
            Predict then reveal: Can crossover alone find the optimum?
          </h2>
          <p className="text-sm text-stone-300 leading-relaxed mb-4">
            Imagine an optimization problem where every bit of an 8-bit chromosome must be '1'. If
            the initial random population of 20 individuals happens to contain only '0' at bit
            position 3 across all individuals, can crossover alone ever produce the target solution
            '11111111'?
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant={prediction === 'no' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setPrediction('no')}
              className="text-xs"
            >
              No, crossover cannot create an allele that does not exist in any parent
            </Button>
            <Button
              variant={prediction === 'yes' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setPrediction('yes')}
              className="text-xs"
            >
              Yes, recombination will eventually invert bit 3
            </Button>
          </div>
          {prediction && (
            <div className="mt-4 p-3 rounded bg-[#110f0e] border border-[#292524] text-xs text-stone-300 leading-relaxed">
              <strong className="text-[#fef3c7]">
                {prediction === 'no' ? 'Correct prediction!' : 'Prediction revealed:'}
              </strong>{' '}
              Crossover strictly shuffles and slices existing bits between parents. If bit position
              3 is '0' in every single individual, slicing parent A with parent B will{' '}
              <span className="font-heading text-[#fef3c7] font-semibold">
                always result in a '0' at position 3
              </span>
              . Only mutation (bit-flipping) has the mathematical capability to introduce missing
              alleles and recover genetic diversity!
            </div>
          )}
        </Card>

        {/* Section 4: Mathematical Formulation & Schema Theorem */}
        <Card className="p-6 bg-[#171412] border-[#292524]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white font-heading">
              Mathematical foundations: Schema Theorem
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMath(!showMath)}
              className="text-xs"
            >
              {showMath ? 'Hide Math Details' : 'Show Schema Theorem Proof'}
            </Button>
          </div>
          <p className="text-sm text-stone-300 leading-relaxed mb-4">
            A <strong className="text-white">schema</strong>{' '}
            <code className="text-amber-300">H</code> is a template specifying a subset of
            chromosomes using the alphabet <code className="text-amber-300">{'{0, 1, *}'}</code>,
            where <code className="text-amber-300">*</code> is a wildcard. For example, schema{' '}
            <code className="text-amber-300">1**0</code> matches{' '}
            <code className="text-stone-300">1000, 1010, 1100, 1110</code>.
          </p>

          {showMath ? (
            <div className="space-y-4 p-4 bg-[#110f0e] rounded border border-[#292524] text-xs font-mono text-stone-300">
              <div>
                <span className="text-amber-400 font-bold">
                  Holland's Schema Theorem (The Fundamental Theorem of GAs):
                </span>
                <br />
                E[m(H, t+1)] ≥ m(H, t) × [f(H) / f_avg] × [1 - p_c × (δ(H) / (L - 1))] × [1 -
                p_m]^o(H)
              </div>
              <div className="pt-2 border-t border-stone-800 space-y-2">
                <div>
                  <strong>m(H, t):</strong> Number of chromosomes matching schema H at generation t.
                </div>
                <div>
                  <strong>f(H) / f_avg:</strong> Relative fitness factor. Schemas with above-average
                  fitness reproduce faster.
                </div>
                <div>
                  <strong>δ(H) (Defining Length):</strong> Distance between the first and last
                  specific bits in H (e.g. for *1**0*, δ = 4 - 1 = 3).
                </div>
                <div>
                  <strong>o(H) (Order):</strong> Number of defined non-wildcard bits in H (e.g. for
                  *1**0*, o = 2).
                </div>
                <div className="text-emerald-400 font-semibold pt-1">
                  Key Takeaway: Short, low-order schemas with above-average fitness receive
                  exponentially increasing allocations of trials in future generations.
                </div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-stone-500 italic">
              Click 'Show Schema Theorem Proof' to inspect the mathematical growth equation of
              genetic schemas.
            </div>
          )}
        </Card>

        {/* Section 5: The Genetic Operators */}
        <Card className="p-6 bg-[#171412] border-[#292524]">
          <h2 className="text-xl font-bold text-white font-heading mb-4">
            The core genetic operators
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#141210] rounded border border-[#292524]">
              <h3 className="font-semibold text-[#fef3c7] text-sm mb-2">1. Selection Operators</h3>
              <p className="text-xs text-stone-400 leading-relaxed mb-2">
                Simulates survival of the fittest by allocating reproductive opportunities based on
                fitness:
              </p>
              <ul className="text-xs text-stone-400 space-y-1 list-disc list-inside">
                <li>
                  <strong>Roulette Wheel:</strong> Selection probability p_i = f_i / ∑ f_j.
                  Susceptible to premature convergence if one super-individual dominates.
                </li>
                <li>
                  <strong>Tournament Selection:</strong> Pick k random candidates; highest fitness
                  wins. Scale-invariant and computationally efficient.
                </li>
              </ul>
            </div>

            <div className="p-4 bg-[#141210] rounded border border-[#292524]">
              <h3 className="font-semibold text-[#fef3c7] text-sm mb-2">
                2. Crossover & Mutation Operators
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed mb-2">
                Generates diversity and explores candidate space:
              </p>
              <ul className="text-xs text-stone-400 space-y-1 list-disc list-inside">
                <li>
                  <strong>Single-Point Crossover:</strong> Slices both parents at cut point c and
                  swaps tails.
                </li>
                <li>
                  <strong>Uniform Crossover:</strong> Each bit is inherited independently from
                  parent 1 or 2 with 50% probability.
                </li>
                <li>
                  <strong>Bit-Flip Mutation:</strong> Inverts bit with small probability p_m (e.g.
                  1% to 3%), preventing allele extinction.
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Section 6: Interactive Lab */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-white font-heading">
              Interactive Lab: Evolutionary Algorithm Arena
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Select a target problem, tune evolutionary hyperparameters, and scrub through
              generations to observe schema convergence.
            </p>
          </div>
          <GeneticAlgorithmLab />
        </section>

        {/* Section 7: Code Implementation */}
        <Card className="p-6 bg-[#171412] border-[#292524]">
          <h2 className="text-xl font-bold text-white font-heading mb-4">
            TypeScript implementation: The canonical GA loop
          </h2>
          <div className="p-4 bg-[#110f0e] rounded border border-[#292524] overflow-x-auto text-xs font-mono text-stone-300 leading-relaxed">
            <pre>{`// Canonical Genetic Algorithm Reproduction Loop
function runGA(config: GaConfig): Population {
  let population = initializeRandomPopulation(config.populationSize);

  for (let gen = 0; gen < config.maxGenerations; gen++) {
    // 1. Evaluate fitness for each individual
    evaluatePopulationFitness(population);
    population.sort((a, b) => b.fitness - a.fitness);

    if (population[0].fitness === config.targetFitness) break;

    const nextGen: Individual[] = [];

    // 2. Elitism: preserve top E individuals unchanged
    for (let e = 0; e < config.elitismCount; e++) {
      nextGen.push({ ...population[e] });
    }

    // 3. Breed offspring until population size is replenished
    while (nextGen.length < config.populationSize) {
      const parent1 = tournamentSelect(population, 3);
      const parent2 = tournamentSelect(population, 3);

      let [child1, child2] = [parent1.chromosome, parent2.chromosome];
      if (Math.random() < config.crossoverRate) {
        [child1, child2] = singlePointCrossover(child1, child2);
      }

      child1 = mutate(child1, config.mutationRate);
      child2 = mutate(child2, config.mutationRate);

      nextGen.push({ chromosome: child1, fitness: 0 });
      if (nextGen.length < config.populationSize) {
        nextGen.push({ chromosome: child2, fitness: 0 });
      }
    }

    population = nextGen;
  }

  return population;
}`}</pre>
          </div>
        </Card>

        {/* Section 8: Strengths & Limitations (CO4) */}
        <Card className="p-6 bg-[#171412] border-[#292524]">
          <h2 className="text-xl font-bold text-white font-heading mb-4">
            Strengths, limitations & when NOT to use (CO4)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-[#141210] rounded border border-[#292524]">
              <h3 className="font-semibold text-emerald-400 mb-2">
                When to Use Genetic Algorithms
              </h3>
              <ul className="space-y-1.5 text-stone-400 list-disc list-inside">
                <li>Search spaces that are discontinuous, rugged, multi-modal, or noisy.</li>
                <li>
                  Complex combinatorial problems with non-linear constraints (e.g. Travelling
                  Salesperson, antenna design).
                </li>
                <li>
                  When mathematical derivatives (gradients) are impossible or prohibitively
                  expensive to calculate.
                </li>
                <li>
                  Multi-objective Pareto optimization (NSGA-II) balancing competing design criteria.
                </li>
              </ul>
            </div>

            <div className="p-4 bg-[#141210] rounded border border-[#292524]">
              <h3 className="font-semibold text-rose-400 mb-2">
                When NOT to Use Genetic Algorithms
              </h3>
              <ul className="space-y-1.5 text-stone-400 list-disc list-inside">
                <li>
                  Smooth, convex loss functions: gradient descent or Newton-Raphson converges orders
                  of magnitude faster.
                </li>
                <li>
                  Real-time sub-millisecond control loops (GA iterations require hundreds of fitness
                  evaluations).
                </li>
                <li>When an exact deterministic guarantee of global optimality is required.</li>
                <li>
                  When evaluating fitness is computationally costly (e.g. running hours-long wind
                  tunnel simulations per individual).
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Section 9: Common Misconceptions */}
        <Card className="p-6 bg-[#171412] border-[#292524]">
          <h2 className="text-xl font-bold text-white font-heading mb-4">
            Common misconceptions dispelled
          </h2>
          <div className="space-y-4">
            <div className="p-3 bg-[#141210] rounded border border-[#292524]">
              <div className="font-semibold text-rose-300 text-xs mb-1">
                Misconception 1: "Genetic algorithms are just pure blind random search."
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                Correction: While initial populations and genetic variations involve randomness,
                selection pressure exerts powerful directional force. GAs combine random exploration
                with systematic exploitation of high-fitness building blocks.
              </p>
            </div>
            <div className="p-3 bg-[#141210] rounded border border-[#292524]">
              <div className="font-semibold text-rose-300 text-xs mb-1">
                Misconception 2: "A higher mutation rate always speeds up evolutionary progress."
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                Correction: As shown in the lab, setting mutation rate to 50% disrupts beneficial
                schemas faster than selection can reproduce them, deteriorating into an ineffective
                random walk. Optimal mutation rates are typically small (0.1% to 5%).
              </p>
            </div>
            <div className="p-3 bg-[#141210] rounded border border-[#292524]">
              <div className="font-semibold text-rose-300 text-xs mb-1">
                Misconception 3: "Genetic algorithms guarantee reaching the global optimal
                solution."
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                Correction: GAs are heuristic search procedures. They frequently find good
                near-optimal approximations, but they offer zero mathematical guarantee of locating
                the absolute global optimum within finite generations.
              </p>
            </div>
          </div>
        </Card>

        {/* Section 10: Academic Viva & Exam Preparation */}
        <Card className="p-6 bg-[#171412] border-[#292524]">
          <h2 className="text-xl font-bold text-white font-heading mb-4">
            Academic Viva & Exam Preparation
          </h2>
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-[#141210] rounded border border-[#292524]">
              <div className="font-semibold text-stone-200 mb-1">
                Q1: What is Elitism in Genetic Algorithms, and why is it essential for monotonic
                convergence?
              </div>
              <p className="text-stone-400 leading-relaxed">
                <strong>Model Answer:</strong> Elitism is the mechanism of copying the top E
                best-performing individuals of generation t directly into generation t+1 without
                subjecting them to crossover or mutation. It guarantees that the maximum fitness of
                the population is monotonically non-decreasing over time, protecting peak
                discoveries from being destroyed by stochastic genetic operators.
              </p>
            </div>
            <div className="p-3 bg-[#141210] rounded border border-[#292524]">
              <div className="font-semibold text-stone-200 mb-1">
                Q2: Differentiate between Roulette Wheel selection and Tournament selection.
              </div>
              <p className="text-stone-400 leading-relaxed">
                <strong>Model Answer:</strong> In Roulette Wheel selection, each individual's
                selection probability is strictly proportional to its absolute fitness (p_i = f_i /
                ∑ f_j), making it sensitive to scaling and vulnerable to premature convergence if
                one super-individual dominates early on. In Tournament selection, k individuals are
                chosen uniformly at random and the one with highest fitness wins. Tournament
                selection is scale-invariant, computationally fast (O(k)), and allows easy tuning of
                selection pressure by varying tournament size k.
              </p>
            </div>
          </div>
        </Card>

        {/* Section 11: Micro-Quiz */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-white font-heading">
              Concept Check: Test Your Understanding
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Test your knowledge of schema theory, genetic operators, and evolutionary search
              trade-offs.
            </p>
          </div>
          <Quiz conceptId="u2-self-genetic" items={quizItems} />
        </section>

        {/* Section 12: Summary & Next Steps */}
        <Card className="p-6 bg-[#171412] border-[#292524] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-heading font-semibold text-white text-base">
              Ready for Game Theory?
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              Explore Further Reading: Game Theory, Nash Equilibrium, and Payoff Matrices.
            </p>
          </div>
          <Link to="/learn/unit-2/game-theory">
            <Button variant="primary" size="sm" className="text-xs whitespace-nowrap">
              Proceed to Game Theory →
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
