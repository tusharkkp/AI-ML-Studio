import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Quiz } from '@/features/quiz/Quiz';
import { GameTheoryLab } from '@/labs/game-theory/GameTheoryLab';
import { ArrowLeft } from 'lucide-react';

export function GameTheoryPage() {
  const [showMath, setShowMath] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<string | null>(null);

  const quizItems = [
    {
      id: 'gt-q1',
      question:
        'What is the formal mathematical condition defining a Nash Equilibrium in a strategic game?',
      options: [
        {
          id: 'A',
          text: 'A strategy profile where no individual player can strictly increase their expected payoff by unilaterally deviating to a different action.',
          isCorrect: true,
          explanation:
            'A state (s₁*, ..., s_n*) is a Nash Equilibrium if for every player i, u_i(s_i*, s_-i*) ≥ u_i(s_i, s_-i*) for all alternative actions s_i. Given the choices of all opponents, each player is already playing their best response.',
        },
        {
          id: 'B',
          text: 'A state where the sum of all players payoffs reaches the maximum possible value.',
          isCorrect: false,
          explanation:
            "That defines a Pareto optimal outcome (social optimum), which often differs from a Nash Equilibrium (as seen in the Prisoner's Dilemma).",
        },
        {
          id: 'C',
          text: 'A strategy where players take turns picking actions randomly with equal probability.',
          isCorrect: false,
          explanation: 'Random turn-taking is not the definition of Nash equilibrium.',
        },
      ],
    },
    {
      id: 'gt-q2',
      question:
        "Why does the Prisoner's Dilemma demonstrate a conflict between individual rationality and collective welfare?",
      options: [
        {
          id: 'A',
          text: 'Defection strictly dominates Cooperation for each player individually, forcing the unique Nash Equilibrium to (-2, -2) even though Mutual Cooperation would yield (0, 0).',
          isCorrect: true,
          explanation:
            'Regardless of what the opponent chooses, each player individually receives a higher payoff by defecting. Because both rationally defect, they end up in an inferior outcome compared to mutual cooperation.',
        },
        {
          id: 'B',
          text: 'Because the police force the suspects to play Minimax search with alpha cutoffs.',
          isCorrect: false,
          explanation:
            'Minimax search is an adversarial search algorithm, not the cause of the dilemma.',
        },
        {
          id: 'C',
          text: 'Because the game has zero Nash equilibria.',
          isCorrect: false,
          explanation:
            "The Prisoner's Dilemma has exactly one pure strategy Nash equilibrium: (Defect, Defect).",
        },
      ],
    },
    {
      id: 'gt-q3',
      question:
        "In zero-sum two-player games (like Matching Pennies), what does John von Neumann's Minimax Theorem guarantee?",
      options: [
        {
          id: 'A',
          text: 'The minimax value and the maximin value are strictly equal under mixed strategies, and this value is identical to the mixed strategy Nash Equilibrium payoff.',
          isCorrect: true,
          explanation:
            "Von Neumann's 1928 Minimax Theorem proves that max_p min_q E[payoff] = min_q max_p E[payoff] = v*. This guarantees that adversarial minimax and Nash equilibrium coincide exactly in zero-sum games.",
        },
        {
          id: 'B',
          text: 'Both players must always receive infinite utility.',
          isCorrect: false,
          explanation: 'Utility in zero-sum games is strictly bounded and balances to zero.',
        },
        {
          id: 'C',
          text: 'Every game has at least four pure strategy Nash equilibria.',
          isCorrect: false,
          explanation:
            'Many zero-sum games (like Matching Pennies) have zero pure strategy equilibria.',
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
            <Badge variant="default">Further Reading</Badge>
            <span className="text-xs text-stone-500 font-mono">0.6 hrs</span>
          </div>
        </div>

        {/* Section 1: Header */}
        <header className="space-y-4 border-b border-[#292524] pb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-heading">
            Further Reading: Game Theory & Nash Equilibrium
          </h1>
          <p className="text-base text-stone-400 leading-relaxed max-w-3xl">
            Step beyond single-agent search into strategic multi-agent environments where outcomes
            depend on the simultaneous decisions of{' '}
            <span className="font-heading text-[#fef3c7] font-semibold">
              autonomous rational decision-makers
            </span>
            .
          </p>
        </header>

        {/* Section 2: Intuition & Strategic Interdependence */}
        <Card className="p-6 bg-[#171412] border-[#292524]">
          <h2 className="text-xl font-bold text-white font-heading mb-4">
            Strategic interdependence: When your best move depends on others
          </h2>
          <p className="text-sm text-stone-300 leading-relaxed mb-4">
            In classic search algorithms (BFS, A*, Hill Climbing), the agent operates in an isolated
            world where the environment does not make deliberate choices to maximize its own
            utility. But in multi-agent systems, an agent faces{' '}
            <span className="font-heading text-[#fef3c7] font-semibold">
              strategic interdependence
            </span>
            : the payoff an agent receives depends not just on its own action, but on the actions
            chosen by all other agents.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 text-xs">
            <div className="p-3 bg-[#110f0e] rounded border border-[#292524]">
              <div className="text-[10px] uppercase text-stone-500 font-mono">
                1944: Foundations
              </div>
              <div className="font-bold text-stone-200 mt-1">Von Neumann & Morgenstern</div>
              <div className="text-stone-400 mt-0.5">
                Formalized zero-sum two-player games and the Minimax Theorem.
              </div>
            </div>
            <div className="p-3 bg-[#110f0e] rounded border border-[#292524]">
              <div className="text-[10px] uppercase text-stone-500 font-mono">
                1950: Generalization
              </div>
              <div className="font-bold text-stone-200 mt-1">John Nash</div>
              <div className="text-stone-400 mt-0.5">
                Proved that every finite game has at least one Nash Equilibrium in mixed strategies.
              </div>
            </div>
            <div className="p-3 bg-[#110f0e] rounded border border-[#292524]">
              <div className="text-[10px] uppercase text-stone-500 font-mono">
                Modern AI: Multi-Agent
              </div>
              <div className="font-bold text-stone-200 mt-1">Autonomous Systems</div>
              <div className="text-stone-400 mt-0.5">
                Decentralized pricing, auction design, cybersecurity, and autonomous fleet routing.
              </div>
            </div>
          </div>
        </Card>

        {/* Section 3: Predict-then-Reveal Prompt */}
        <Card className="p-6 bg-[#171412] border-[#292524]">
          <h2 className="text-lg font-bold text-white font-heading mb-2">
            Predict then reveal: Individual rationality vs collective good
          </h2>
          <p className="text-sm text-stone-300 leading-relaxed mb-4">
            In the Prisoner's Dilemma, two suspects are interrogated in separate rooms. If both
            Cooperate, both get 0 years. If one Defects while the other Cooperates, the defector
            gets +1 bonus while the cooperator gets -3 years. If both Defect, both receive -2 years.
            If both suspects are strictly self-interested and rational, what will they do?
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant={prediction === 'defect' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setPrediction('defect')}
              className="text-xs"
            >
              Both will Defect, resulting in (-2, -2)
            </Button>
            <Button
              variant={prediction === 'cooperate' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setPrediction('cooperate')}
              className="text-xs"
            >
              Both will Cooperate, resulting in (0, 0)
            </Button>
          </div>
          {prediction && (
            <div className="mt-4 p-3 rounded bg-[#110f0e] border border-[#292524] text-xs text-stone-300 leading-relaxed">
              <strong className="text-[#fef3c7]">
                {prediction === 'defect' ? 'Correct prediction!' : 'Prediction revealed:'}
              </strong>{' '}
              Strict self-interest compels both prisoners to Defect. If Player B cooperates, Player
              A gets 1 by defecting vs 0 by cooperating. If Player B defects, Player A gets -2 by
              defecting vs -3 by cooperating. In every scenario,{' '}
              <span className="font-heading text-[#fef3c7] font-semibold">
                Defection strictly dominates Cooperation
              </span>
              . Because both think rationally, both receive -2 instead of 0! This proves individual
              rationality does not guarantee collective optimality.
            </div>
          )}
        </Card>

        {/* Section 4: Mathematical Formulation */}
        <Card className="p-6 bg-[#171412] border-[#292524]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white font-heading">
              Mathematical formulation of normal-form games
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMath(!showMath)}
              className="text-xs"
            >
              {showMath ? 'Hide Formal Math' : 'Show Formal Formulation'}
            </Button>
          </div>
          <p className="text-sm text-stone-300 leading-relaxed mb-4">
            A strategic game in normal (strategic) form is formally defined as a 3-tuple{' '}
            <span className="font-heading text-[#fef3c7] font-semibold">G = ⟨N, (A_i), (u_i)⟩</span>
            .
          </p>

          {showMath ? (
            <div className="space-y-4 p-4 bg-[#110f0e] rounded border border-[#292524] text-xs font-mono text-stone-300">
              <div>
                <strong>1. Set of Players:</strong> N = {'{1, 2, ..., n}'}
              </div>
              <div>
                <strong>2. Action Spaces:</strong> A_i is the set of available actions for player i.
                <br />
                The action profile space is the Cartesian product A = A₁ × A₂ × ... × A_n.
              </div>
              <div>
                <strong>3. Utility / Payoff Functions:</strong> u_i : A → ℝ maps each strategy
                profile (a₁, ..., a_n) to a real-valued payoff.
              </div>
              <div className="pt-2 border-t border-stone-800">
                <strong className="text-amber-400">Formal Definition of Nash Equilibrium:</strong>
                <br />
                A strategy profile a* = (a₁*, ..., a_n*) ∈ A is a Pure Strategy Nash Equilibrium if:
                <br />
                u_i(a_i*, a_-i*) ≥ u_i(a_i, a_-i*) for all a_i ∈ A_i and all players i ∈ N.
                <br />
                (where a_-i denotes the actions chosen by all players other than player i).
              </div>
            </div>
          ) : (
            <div className="text-xs text-stone-500 italic">
              Click 'Show Formal Formulation' to inspect the mathematical definitions of strategy
              profiles and Nash equilibria.
            </div>
          )}
        </Card>

        {/* Section 5: Minimax vs Nash Equilibrium */}
        <Card className="p-6 bg-[#171412] border-[#292524]">
          <h2 className="text-xl font-bold text-white font-heading mb-4">
            Adversarial Minimax vs Game-Theoretic Nash Equilibrium
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-[#141210] rounded border border-[#292524]">
              <h3 className="font-semibold text-stone-200 mb-2">Adversarial Search (Minimax)</h3>
              <ul className="space-y-1.5 text-stone-400 list-disc list-inside">
                <li>Strictly zero-sum: one player's gain is exactly equal to the other's loss.</li>
                <li>
                  Opponent is assumed to be purely malicious, picking the move that hurts you most.
                </li>
                <li>
                  Operates on extensive-form sequential game trees (Chess, Checkers, Tic-Tac-Toe).
                </li>
                <li>
                  Resolved with depth-limited alpha-beta pruning and heuristic evaluation functions.
                </li>
              </ul>
            </div>

            <div className="p-4 bg-[#141210] rounded border border-[#292524]">
              <h3 className="font-semibold text-stone-200 mb-2">Game Theory (Nash Equilibrium)</h3>
              <ul className="space-y-1.5 text-stone-400 list-disc list-inside">
                <li>
                  General-sum: covers pure competition, coordination, cooperation, and mixed
                  motives.
                </li>
                <li>
                  Opponents are assumed to be <strong>self-interested</strong>, not necessarily
                  malicious.
                </li>
                <li>
                  Operates on normal-form simultaneous matrices as well as dynamic extensive games.
                </li>
                <li>
                  Resolved by finding strategy profiles where every player is playing a mutual best
                  response.
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Section 6: Interactive Lab */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-white font-heading">
              Interactive Lab: Normal-Form Matrix Solver
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Select classic games, inspect payoffs, and watch the solver highlight mutual best
              responses and Nash equilibria.
            </p>
          </div>
          <GameTheoryLab />
        </section>

        {/* Section 7: Common Misconceptions */}
        <Card className="p-6 bg-[#171412] border-[#292524]">
          <h2 className="text-xl font-bold text-white font-heading mb-4">
            Common misconceptions dispelled
          </h2>
          <div className="space-y-4">
            <div className="p-3 bg-[#141210] rounded border border-[#292524]">
              <div className="font-semibold text-rose-300 text-xs mb-1">
                Misconception 1: "A Nash Equilibrium is always the best possible outcome for all
                players."
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                Correction: A Nash equilibrium is simply a stable state with no unilateral incentive
                to deviate. In the Prisoner's Dilemma, (Defect, Defect) is the unique Nash
                equilibrium (-2, -2), which is vastly inferior to (Cooperate, Cooperate) (0, 0).
              </p>
            </div>
            <div className="p-3 bg-[#141210] rounded border border-[#292524]">
              <div className="font-semibold text-rose-300 text-xs mb-1">
                Misconception 2: "Every strategic game must have at least one pure strategy Nash
                equilibrium."
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                Correction: Games like Matching Pennies or Rock-Paper-Scissors have zero pure
                strategy equilibria. They only have mixed strategy equilibria where players
                randomize actions with specific probabilities.
              </p>
            </div>
            <div className="p-3 bg-[#141210] rounded border border-[#292524]">
              <div className="font-semibold text-rose-300 text-xs mb-1">
                Misconception 3: "In zero-sum games, Minimax and Nash Equilibrium give different
                answers."
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                Correction: According to von Neumann's Minimax Theorem, in finite two-player
                zero-sum games, the minimax strategy profile is mathematically identical to the Nash
                equilibrium strategy profile.
              </p>
            </div>
          </div>
        </Card>

        {/* Section 8: Academic Viva & Exam Preparation */}
        <Card className="p-6 bg-[#171412] border-[#292524]">
          <h2 className="text-xl font-bold text-white font-heading mb-4">
            Academic Viva & Exam Preparation
          </h2>
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-[#141210] rounded border border-[#292524]">
              <div className="font-semibold text-stone-200 mb-1">
                Q1: Define a strictly dominated strategy. Why can strictly dominated strategies be
                safely eliminated?
              </div>
              <p className="text-stone-400 leading-relaxed">
                <strong>Model Answer:</strong> A strategy s_i&apos; is strictly dominated by s_i if
                u_i(s_i, s_-i) &gt; u_i(s_i&apos;, s_-i) for all possible opponent actions s_-i. A
                strictly dominated strategy is never a best response under any circumstances, so a
                rational player will never play it. It can be eliminated through Iterated
                Elimination of Strictly Dominated Strategies (IESDS) without losing any Nash
                equilibria.
              </p>
            </div>
            <div className="p-3 bg-[#141210] rounded border border-[#292524]">
              <div className="font-semibold text-stone-200 mb-1">
                Q2: How does a Mixed Strategy Nash Equilibrium differ from a Pure Strategy Nash
                Equilibrium?
              </div>
              <p className="text-stone-400 leading-relaxed">
                <strong>Model Answer:</strong> In a pure strategy equilibrium, each player chooses a
                single deterministic action with probability 1. In a mixed strategy equilibrium, at
                least one player chooses a probability distribution over their available actions. In
                a mixed equilibrium, each player chooses their probabilities such that their
                opponent becomes completely indifferent among their own pure strategies.
              </p>
            </div>
          </div>
        </Card>

        {/* Section 9: Micro-Quiz */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-white font-heading">
              Concept Check: Test Your Understanding
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Verify your mastery of game theory definitions, normal-form games, and equilibrium
              concepts.
            </p>
          </div>
          <Quiz conceptId="u2-further-game-theory" items={quizItems} />
        </section>

        {/* Section 10: Summary & Next Steps */}
        <Card className="p-6 bg-[#171412] border-[#292524] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-heading font-semibold text-white text-base">
              Ready for the Unit 2 Final Exam?
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              Test your comprehensive mastery across all search strategies, CSPs, adversarial
              engines, and genetic algorithms.
            </p>
          </div>
          <Link to="/learn/unit-2/exam">
            <Button variant="primary" size="sm" className="text-xs whitespace-nowrap">
              Take 20-Question Unit 2 Exam →
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
