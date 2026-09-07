import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Callout } from '@/components/ui/Callout';
import { Quiz } from '@/features/quiz/Quiz';
import { AdversarialSearchLab } from '@/labs/adversarial-search/AdversarialSearchLab';
import { ArrowLeft } from 'lucide-react';

export function AdversarialSearchPage() {
  const [showMath, setShowMath] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<string | null>(null);

  const quizItems = [
    {
      id: 'adv-q1',
      question:
        'Under optimal move ordering, what is the effective time complexity of Alpha-Beta pruning compared to standard Minimax with branching factor b and depth d?',
      options: [
        {
          id: 'A',
          text: 'O(b^(d/2)), effectively doubling the search depth achievable in the same computation time.',
          isCorrect: true,
          explanation:
            'With perfect move ordering where the best move is explored first, Alpha-Beta evaluates O(b^(d/2)) leaves instead of O(b^d). This means a chess engine can search twice as deeply (e.g. 12 plies instead of 6 plies) within the same time limit.',
        },
        {
          id: 'B',
          text: 'O(b · d), reducing the problem from exponential to linear time.',
          isCorrect: false,
          explanation:
            'Game trees remain fundamentally exponential; Alpha-Beta cuts the effective exponent in half, not to linear time.',
        },
        {
          id: 'C',
          text: 'O(1), computing optimal moves via a hash table.',
          isCorrect: false,
          explanation:
            'Transposition tables store visited positions, but full game tree exploration remains combinatorial.',
        },
      ],
    },
    {
      id: 'adv-q2',
      question: 'What mathematical condition triggers an Alpha cutoff at a MAX node?',
      options: [
        {
          id: 'A',
          text: 'When the currently discovered value at the MAX node meets or exceeds beta (v >= beta), proving the upstream MIN parent would never allow the game to enter this branch.',
          isCorrect: true,
          explanation:
            'Beta represents the best (lowest) value that the MIN opponent is already guaranteed elsewhere. If the current MAX node already scores higher than beta, MIN will simply avoid this branch, making further child evaluations pointless.',
        },
        {
          id: 'B',
          text: 'When alpha drops below zero.',
          isCorrect: false,
          explanation: 'Alpha is a monotonic lower bound and can be positive, negative, or zero.',
        },
        {
          id: 'C',
          text: 'When both alpha and beta equal infinity.',
          isCorrect: false,
          explanation:
            'The initial root window is [-infinity, +infinity]; pruning occurs when the window collapses (beta <= alpha).',
        },
      ],
    },
    {
      id: 'adv-q3',
      question:
        'Why does Alpha-Beta pruning guarantee finding the exact same optimal minimax move as unpruned Minimax?',
      options: [
        {
          id: 'A',
          text: 'Pruned branches are mathematically proven to be irrelevant: their values could never influence the root decision under rational play from both players.',
          isCorrect: true,
          explanation:
            'Alpha-Beta does not make heuristic guesses or approximations; it performs exact optimization. It only skips branches whose values are strictly dominated by previously examined alternatives.',
        },
        {
          id: 'B',
          text: 'It samples random games using Monte Carlo rollouts.',
          isCorrect: false,
          explanation:
            'Monte Carlo Tree Search uses rollouts; Alpha-Beta is deterministic minimax search.',
        },
        {
          id: 'C',
          text: 'It assumes the opponent always makes blunders.',
          isCorrect: false,
          explanation: 'Minimax assumes optimal, infallible play from the opponent.',
        },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-12">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link
          to="/learn/unit-2"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Unit 2 Directory
        </Link>
        <span className="text-neutral-600">/</span>
        <span className="text-xs font-mono text-neutral-300">Adversarial Search</span>
      </div>

      {/* Hero Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">Unit 2: AI Search</Badge>
          <Badge variant="default">1.4 Lecture Hours</Badge>
          <Badge variant="unit">CO1, CO3, CO4</Badge>
        </div>
        <h1 className="font-montserrat text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Adversarial Search: Minimax & Alpha-Beta Pruning
        </h1>
        <p className="text-base text-neutral-300 leading-relaxed max-w-3xl">
          In competitive two-player games, an intelligent agent cannot merely plan for itself. It
          must anticipate an{' '}
          <span className="font-montserrat text-highlight font-semibold">infallible opponent</span>{' '}
          dedicated to minimizing its score, using mathematical pruning to ignore millions of
          irrelevant moves.
        </p>
      </div>

      {/* Section 1: Intuition & The "Aha!" Moment */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-foreground">
          1. Intuition: Thinking Two Moves Ahead
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed text-sm text-neutral-300">
          <div className="p-5 rounded-2xl border border-card-edge bg-card-fill/60 space-y-3">
            <h3 className="font-montserrat text-base font-semibold text-foreground">
              The Worst-Case Assumption
            </h3>
            <p>
              In single-agent search (like pathfinding), the environment is passive. In adversarial
              games like Chess or Tic-Tac-Toe, your opponent is actively trying to defeat you. If a
              strategy depends on your opponent making a silly mistake, it is not a winning
              strategy.
            </p>
            <p>
              The Minimax algorithm models both players under perfect play: the MAX player chooses
              actions to maximize terminal utility, while the MIN opponent relentlessly chooses
              responses to minimize MAX payoff.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-card-edge bg-card-fill/60 space-y-3">
            <h3 className="font-montserrat text-base font-semibold text-foreground">
              The Scissors of Alpha-Beta Pruning
            </h3>
            <p>
              Suppose you already know Move A guarantees you at least a score of +10. Now you
              examine Move B. After your opponent first reply to Move B, they can force your score
              down to +2.
            </p>
            <p>
              Do you need to spend the next 20 minutes calculating all other intricate variations of
              Move B? Absolutely not! You already know Move B is worse than Move A.{' '}
              <span className="font-montserrat text-highlight font-semibold">
                Alpha-Beta pruning snips off the entire subtree
              </span>
              , without losing any mathematical certainty.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Interactive Lab */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-foreground">
          2. Interactive Lab: Minimax & Alpha-Beta Pruning Studio
        </h2>
        <p className="text-sm text-neutral-300 leading-relaxed">
          Step through the classic Russell & Norvig Figure 5.5 game tree. Observe how the [α, β]
          search window updates, and watch scissors prune branches C2 and C3 the instant β drops
          below α.
        </p>
        <AdversarialSearchLab />
      </section>

      {/* Section 3: Predict-Then-Reveal Challenge */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-foreground">
          3. Predict-Then-Reveal: The C Subtree Cutoff
        </h2>
        <Card className="p-6 border-card-edge bg-card-fill">
          <p className="text-sm text-neutral-200 leading-relaxed mb-4">
            In the classic game tree in the lab above, B evaluates to value 3 (so α at the root
            becomes 3). Next, the search descends into MIN node C. Its first leaf child C1 has
            utility <span className="font-montserrat text-highlight font-semibold">2</span>. What
            happens to remaining children C2 and C3?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <button
              onClick={() => setPrediction('pruned')}
              className={`p-3 rounded-xl border text-xs text-left transition-colors ${
                prediction === 'pruned'
                  ? 'border-brand bg-brand/10 text-foreground font-semibold'
                  : 'border-card-edge bg-card-fill/60 text-neutral-400 hover:text-foreground'
              }`}
            >
              <strong>A) Both C2 and C3 are pruned</strong> because C value can never exceed 2,
              which is already worse than the 3 guaranteed by B.
            </button>

            <button
              onClick={() => setPrediction('evaluated')}
              className={`p-3 rounded-xl border text-xs text-left transition-colors ${
                prediction === 'evaluated'
                  ? 'border-brand bg-brand/10 text-foreground font-semibold'
                  : 'border-card-edge bg-card-fill/60 text-neutral-400 hover:text-foreground'
              }`}
            >
              <strong>B) C2 and C3 must be evaluated</strong> because they might have values higher
              than 10.
            </button>

            <button
              onClick={() => setPrediction('random')}
              className={`p-3 rounded-xl border text-xs text-left transition-colors ${
                prediction === 'random'
                  ? 'border-brand bg-brand/10 text-foreground font-semibold'
                  : 'border-card-edge bg-card-fill/60 text-neutral-400 hover:text-foreground'
              }`}
            >
              <strong>C) Only C3 is pruned</strong> while C2 is evaluated as a tie-breaker.
            </button>
          </div>

          {prediction && (
            <Callout
              type={prediction === 'pruned' ? 'tip' : 'warning'}
              title={prediction === 'pruned' ? 'Prediction Verified!' : 'Check the Minimax Logic'}
            >
              {prediction === 'pruned' ? (
                <p className="text-xs text-neutral-300">
                  Exactly right! C is a MIN node. Because leaf C1 has value 2, C is guaranteed to
                  choose a value &le; 2. But the root MAX player already has a guaranteed move to B
                  with value 3! The root will never choose C over B, so evaluating C2 and C3 is
                  completely superfluous. The cutoff condition &beta; &le; &alpha; (2 &le; 3)
                  triggers immediately!
                </p>
              ) : (
                <p className="text-xs text-neutral-300">
                  Even if C2 had a value of +1,000,000, node C is a MIN player! MIN would still pick
                  C1 (value 2). Since MAX can get 3 by picking B, MAX will never pick C. C2 and C3
                  are immediately pruned!
                </p>
              )}
            </Callout>
          )}
        </Card>
      </section>

      {/* Section 4: Step-by-Step on Paper */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-foreground">
          4. Step-by-Step on Paper: Alpha-Beta Bounds Walkthrough
        </h2>
        <Card className="p-6 border-card-edge bg-card-fill space-y-4 text-sm text-neutral-300 leading-relaxed">
          <p>Let us trace the bounds [α, β] on the Russell & Norvig 3-branch tree:</p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono border border-card-edge text-left">
              <thead className="bg-neutral-900/80 text-neutral-300 border-b border-card-edge">
                <tr>
                  <th className="p-2.5">Node</th>
                  <th className="p-2.5">Type</th>
                  <th className="p-2.5">Incoming [α, β]</th>
                  <th className="p-2.5">Child Evaluated</th>
                  <th className="p-2.5">Updated Bound</th>
                  <th className="p-2.5">Action Taken</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-edge/50">
                <tr>
                  <td className="p-2.5 font-bold text-foreground">A</td>
                  <td className="p-2.5 text-brand font-bold">MAX</td>
                  <td className="p-2.5">[-∞, +∞]</td>
                  <td className="p-2.5">Descend to B</td>
                  <td className="p-2.5">Passes [-∞, +∞]</td>
                  <td className="p-2.5">Initial search call at root.</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-foreground">B</td>
                  <td className="p-2.5 text-blue-400 font-bold">MIN</td>
                  <td className="p-2.5">[-∞, +∞]</td>
                  <td className="p-2.5">B1=3, B2=12, B3=8</td>
                  <td className="p-2.5">β = min(3, 12, 8) = 3</td>
                  <td className="p-2.5">No cutoff (β &gt; α). Returns 3 to Root A.</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-foreground">A</td>
                  <td className="p-2.5 text-brand font-bold">MAX</td>
                  <td className="p-2.5">[-∞, +∞]</td>
                  <td className="p-2.5">Received 3 from B</td>
                  <td className="p-2.5 text-brand font-bold">α = max(-∞, 3) = 3</td>
                  <td className="p-2.5">Descend to C with [α=3, β=+∞].</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-foreground">C</td>
                  <td className="p-2.5 text-blue-400 font-bold">MIN</td>
                  <td className="p-2.5">[3, +∞]</td>
                  <td className="p-2.5">C1 = 2</td>
                  <td className="p-2.5 text-rose-400 font-bold">β = min(+∞, 2) = 2</td>
                  <td className="p-2.5 font-bold text-rose-400">
                    Cutoff! β (2) ≤ α (3). C2 and C3 pruned!
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* Section 5: Formal Mathematical Foundations */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-montserrat text-2xl font-semibold text-foreground">
            5. Formal Mathematical Foundations
          </h2>
          <Button size="sm" variant="outline" onClick={() => setShowMath((prev) => !prev)}>
            {showMath ? 'Hide Formal Mathematics' : 'Show Formal Mathematics'}
          </Button>
        </div>

        <div className="space-y-4 text-sm text-neutral-300 leading-relaxed">
          <div className="p-5 rounded-xl border border-card-edge bg-card-fill/60 space-y-2">
            <h3 className="font-montserrat text-base font-semibold text-foreground">
              Minimax Decision Rule
            </h3>
            <p>For a game state s with terminal utility function Utility(s):</p>
            <div className="p-3 rounded-lg border border-card-edge bg-neutral-900/60 font-mono text-xs text-center space-y-1 text-brand">
              <p>{'Minimax(s) = Utility(s)   if Terminal-Test(s)'}</p>
              <p>
                {'Minimax(s) = max_{a ∈ Actions(s)} Minimax(Result(s, a))   if Player(s) = MAX'}
              </p>
              <p>
                {'Minimax(s) = min_{a ∈ Actions(s)} Minimax(Result(s, a))   if Player(s) = MIN'}
              </p>
            </div>
          </div>

          {showMath && (
            <div className="p-5 rounded-xl border border-brand/30 bg-card-fill space-y-4 text-xs font-mono">
              <h3 className="font-montserrat text-sm font-semibold text-foreground">
                Asymptotic Speedup & The Move Ordering Theorem
              </h3>
              <p>
                <strong>Theorem:</strong> With optimal move ordering (best moves examined first),
                Alpha-Beta pruning evaluates:
              </p>
              <div className="font-mono text-center py-2 text-brand text-sm">
                {'Nodes Evaluated = 2 · b^(d/2) - 1   for even depth d'}
              </div>
              <p className="text-neutral-400">
                {
                  'The effective branching factor drops from b to √b (for b=36 in chess, effective branching factor becomes 6). In practice, heuristic move ordering using killer moves, history heuristics, and iterative deepening achieves close to this theoretical maximum.'
                }
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Section 6: Algorithm Pseudocode */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-foreground">
          6. Algorithm Pseudocode: Alpha-Beta Pruning
        </h2>
        <Card className="p-4 border-card-edge bg-[#0a0a0a] font-mono text-xs text-neutral-300 overflow-x-auto">
          <pre className="leading-relaxed">
            {`function ALPHA_BETA_SEARCH(state):
    v = MAX_VALUE(state, -infinity, +infinity)
    return action corresponding to v

function MAX_VALUE(state, alpha, beta):
    if TERMINAL_TEST(state): return UTILITY(state)
    v = -infinity
    for each a in ACTIONS(state):
        v = max(v, MIN_VALUE(RESULT(state, a), alpha, beta))
        if v >= beta:
            return v // Beta cutoff
        alpha = max(alpha, v)
    return v

function MIN_VALUE(state, alpha, beta):
    if TERMINAL_TEST(state): return UTILITY(state)
    v = +infinity
    for each a in ACTIONS(state):
        v = min(v, MAX_VALUE(RESULT(state, a), alpha, beta))
        if v <= alpha:
            return v // Alpha cutoff
        beta = min(beta, v)
    return v`}
          </pre>
        </Card>
      </section>

      {/* Section 7: Code It in Python */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-foreground">
          7. Code It in Python: Alpha-Beta with Transposition Table
        </h2>
        <Card className="p-4 border-card-edge bg-[#0a0a0a] font-mono text-xs text-neutral-300 overflow-x-auto">
          <pre className="leading-relaxed">
            {`import math
from typing import Tuple, Optional

def alpha_beta(
    node: dict,
    depth: int,
    alpha: float,
    beta: float,
    is_maximizing: bool
) -> float:
    """Minimax with Alpha-Beta Pruning."""
    if depth == 0 or "children" not in node:
        return node.get("value", 0)

    if is_maximizing:
        max_eval = -math.inf
        for child in node["children"]:
            eval_score = alpha_beta(child, depth - 1, alpha, beta, False)
            max_eval = max(max_eval, eval_score)
            alpha = max(alpha, eval_score)
            if beta <= alpha:
                break  # Beta cutoff: MIN will not allow this branch
        return max_eval
    else:
        min_eval = math.inf
        for child in node["children"]:
            eval_score = alpha_beta(child, depth - 1, alpha, beta, True)
            min_eval = min(min_eval, eval_score)
            beta = min(beta, eval_score)
            if beta <= alpha:
                break  # Alpha cutoff: MAX will not pick this branch
        return min_eval`}
          </pre>
        </Card>
      </section>

      {/* Section 8: "Make It Fail" Laboratory */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-foreground">
          8. "Make It Fail" Laboratory: Worst-Case Move Ordering
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
          <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/20 space-y-2">
            <h3 className="font-montserrat text-sm font-semibold text-rose-300">
              Failure Mode 1: Worst-Case Move Ordering
            </h3>
            <p className="text-neutral-300">
              If candidate moves are ordered from worst to best, every child must be fully evaluated
              before bounds can improve. In this adversarial scenario, Alpha-Beta evaluates all
              O(b^d) leaves, achieving{' '}
              <span className="font-montserrat text-highlight font-semibold">zero pruning</span>!
            </p>
          </div>

          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 space-y-2">
            <h3 className="font-montserrat text-sm font-semibold text-amber-300">
              Failure Mode 2: The Horizon Effect
            </h3>
            <p className="text-neutral-300">
              When search depth is fixed to d plies, the agent cannot see impending catastrophes
              that occur at depth d+1. It may push a lost queen capture beyond its search horizon by
              executing useless checks, only to suffer catastrophic material loss one ply later.
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: Strengths, Limitations & When NOT to Use */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-foreground">
          9. Strengths, Limitations & When NOT to Use
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs leading-relaxed">
          <div className="p-4 rounded-xl border border-card-edge bg-card-fill/60 space-y-2">
            <h3 className="font-montserrat text-sm font-semibold text-emerald-400">Strengths</h3>
            <ul className="list-disc pl-4 space-y-1.5 text-neutral-300">
              <li>
                <span className="font-montserrat text-highlight font-semibold">
                  Exact optimality
                </span>
                : guarantees identical root decision to full minimax without approximations.
              </li>
              <li>Doubles search depth under optimal move ordering.</li>
              <li>Linear memory consumption proportional to search depth O(d).</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-card-edge bg-card-fill/60 space-y-2">
            <h3 className="font-montserrat text-sm font-semibold text-rose-400">Limitations</h3>
            <ul className="list-disc pl-4 space-y-1.5 text-neutral-300">
              <li>
                Strictly limited to zero-sum, perfect information games (Chess, Checkers, Go).
              </li>
              <li>Vulnerable to the Horizon Effect unless paired with Quiescence search.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-card-edge bg-card-fill/60 space-y-2">
            <h3 className="font-montserrat text-sm font-semibold text-amber-400">
              When NOT to Use
            </h3>
            <ul className="list-disc pl-4 space-y-1.5 text-neutral-300">
              <li>
                In games with hidden information or chance (Poker, Backgammon) where Expectiminimax
                or Monte Carlo Counterfactual Regret Minimization (CFR) is required.
              </li>
              <li>
                In games where branching factor exceeds thousands (use Monte Carlo Tree Search).
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 10: Common Misconceptions */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-foreground">
          10. Common Misconceptions
        </h2>
        <div className="space-y-3 text-xs leading-relaxed">
          <div className="p-4 rounded-xl border border-card-edge bg-card-fill/60 space-y-1">
            <span className="font-semibold text-rose-400 font-montserrat">Misconception 1:</span>
            <p className="text-neutral-300">
              <em>"Alpha-Beta pruning is an approximation that can sacrifice optimal play."</em>
            </p>
            <p className="text-neutral-400">
              <strong>Reality:</strong> False! Alpha-Beta pruning is 100% mathematically exact. The
              value returned at the root is identical to evaluating every single node in the entire
              game tree. It only prunes branches that are provably dominated.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-card-edge bg-card-fill/60 space-y-1">
            <span className="font-semibold text-rose-400 font-montserrat">Misconception 2:</span>
            <p className="text-neutral-300">
              <em>
                "The order in which children are evaluated does not affect Alpha-Beta performance."
              </em>
            </p>
            <p className="text-neutral-400">
              <strong>Reality:</strong> Move ordering is the single most critical factor in
              Alpha-Beta. Best-first move ordering evaluates O(b^(d/2)) nodes; worst-case move
              ordering evaluates O(b^d) nodes (zero pruning).
            </p>
          </div>
        </div>
      </section>

      {/* Section 11: Check Yourself */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-foreground">
          11. Check Yourself: Micro-Quiz
        </h2>
        <Quiz conceptId="u2-adversarial-search" items={quizItems} />
      </section>

      {/* Section 12: Real-World Case Study Preview */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-foreground">
          12. Real-World Case Study Preview: Chess Game AI
        </h2>
        <Card className="p-5 border-card-edge bg-card-fill flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-montserrat font-semibold text-sm text-foreground">
              Case Study 2: Grandmaster Chess AI & Evaluation Functions
            </h3>
            <p className="text-xs text-neutral-400 max-w-xl">
              Explore how Deep Blue defeated Garry Kasparov, how Stockfish evaluates millions of
              positions per second, and how Quiescence search solves the Horizon Effect.
            </p>
          </div>
          <Link to="/case-studies/chess-game-engine">
            <Button size="sm" variant="primary" className="whitespace-nowrap">
              Open Chess Case Study
            </Button>
          </Link>
        </Card>
      </section>

      {/* Section 13: Exam & Viva Corner */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-foreground">
          13. Exam & Viva Corner: University Assessment Prep
        </h2>
        <Card className="p-5 border-card-edge bg-card-fill space-y-4 text-xs leading-relaxed">
          <div className="border-b border-card-edge pb-3 space-y-1">
            <span className="font-mono text-brand font-bold">
              Q1: Define Alpha and Beta in adversarial game tree search.
            </span>
            <p className="text-neutral-300">
              <strong>Model Answer:</strong> Alpha (α) is the value of the best (highest-value)
              choice found so far at any choice point along the path for MAX. Beta (β) is the value
              of the best (lowest-value) choice found so far along the path for MIN. Pruning occurs
              whenever β &le; α.
            </p>
          </div>

          <div className="space-y-1">
            <span className="font-mono text-brand font-bold">
              Q2: What is Quiescence Search and why is it necessary?
            </span>
            <p className="text-neutral-300">
              <strong>Model Answer:</strong> Quiescence search extends search depth beyond the fixed
              cutoff for "noisy" or non-quiet tactical positions (such as pieces currently en prise
              or undergoing captures). It prevents the Horizon Effect, where an algorithm
              incorrectly evaluates a position as favorable simply because a devastating material
              loss occurs just beyond the search horizon.
            </p>
          </div>
        </Card>
      </section>

      {/* Section 14: Summary & Key Takeaways */}
      <section className="p-6 rounded-2xl border border-card-edge bg-card-fill/60 space-y-3 text-xs leading-relaxed">
        <h2 className="font-montserrat text-lg font-semibold text-foreground">
          14. Summary & Key Takeaways
        </h2>
        <ul className="list-disc pl-4 space-y-1.5 text-neutral-300">
          <li>
            <strong>Minimax assumes rational perfection:</strong> MAX maximizes payoffs while MIN
            minimizes them under full zero-sum game mechanics.
          </li>
          <li>
            <strong>Alpha-Beta prunes provably dominated branches:</strong> achieves identical root
            decisions while skipping up to 99% of leaves.
          </li>
          <li>
            <strong>Move ordering halves the exponent:</strong> best-first ordering reduces
            complexity from O(b^d) to O(b^(d/2)), effectively doubling achievable search depth.
          </li>
          <li>
            <strong>Course Outcome 1 & 4 served:</strong> students understand reasoning under
            uncertainty and adversarial environments.
          </li>
        </ul>
      </section>
    </div>
  );
}
