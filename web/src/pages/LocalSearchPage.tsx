import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Callout } from '@/components/ui/Callout';
import { Quiz } from '@/features/quiz/Quiz';
import { LocalSearchLab } from '@/labs/local-search/LocalSearchLab';
import { ArrowLeft } from 'lucide-react';

export function LocalSearchPage() {
  const [showMath, setShowMath] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<string | null>(null);

  const quizItems = [
    {
      id: 'local-q1',
      question: 'Why does basic steepest-ascent hill climbing fail on flat plateaus or shoulders?',
      options: [
        {
          id: 'A',
          text: 'All neighboring states have identical elevation, resulting in a gradient of zero (ΔE = 0), so no uphill step can be identified.',
          isCorrect: true,
          explanation:
            'On a flat plateau or shoulder, every immediate neighbor has the exact same objective value as the current state. The gradient is zero (ΔE = 0), meaning steepest-ascent sees no positive direction of improvement and halts prematurely.',
        },
        {
          id: 'B',
          text: 'The algorithm runs out of computer memory proportional to the tree depth.',
          isCorrect: false,
          explanation: 'Local search uses O(1) constant memory regardless of terrain shape.',
        },
        {
          id: 'C',
          text: 'The priority queue overflows because plateaus generate infinitely many states.',
          isCorrect: false,
          explanation: 'Hill climbing maintains no priority queue or frontier.',
        },
      ],
    },
    {
      id: 'local-q2',
      question:
        'In Simulated Annealing, how does the acceptance probability of a downhill move (ΔE < 0) change as temperature T approaches zero?',
      options: [
        {
          id: 'A',
          text: 'The acceptance probability P = exp(ΔE / T) drops toward zero, meaning the algorithm ceases accepting bad moves and behaves like greedy hill climbing.',
          isCorrect: true,
          explanation:
            'Because ΔE is negative, dividing by a tiny positive temperature T makes ΔE / T a large negative number. As T approaches 0, exp(-infinity) = 0. Thus, the system "freezes" into pure greedy hill climbing as it cools down.',
        },
        {
          id: 'B',
          text: 'The acceptance probability increases to 1.0, making the search completely random.',
          isCorrect: false,
          explanation:
            'High temperature causes high acceptance; as T -> 0, acceptance approaches 0.',
        },
        {
          id: 'C',
          text: 'The temperature has no mathematical effect on downhill moves.',
          isCorrect: false,
          explanation: 'Temperature directly controls the denominator in the Metropolis exponent.',
        },
      ],
    },
    {
      id: 'local-q3',
      question:
        'What is the primary memory advantage of local search algorithms over systematic tree-search algorithms like BFS or A*?',
      options: [
        {
          id: 'A',
          text: 'Local search operates on complete state representations and only keeps the current state in memory, requiring O(1) constant storage.',
          isCorrect: true,
          explanation:
            'Systematic searches maintain frontiers and explored sets that grow exponentially O(b^d). Local search algorithms evaluate complete candidate states and only store the current node (and occasionally a few candidate neighbors), consuming constant O(1) memory.',
        },
        {
          id: 'B',
          text: 'Local search compresses the graph into a hash table.',
          isCorrect: false,
          explanation: 'No graph hash table is created.',
        },
        {
          id: 'C',
          text: 'Local search delegates memory management to the graphics processing unit.',
          isCorrect: false,
          explanation: 'Standard local search runs on standard CPU memory with minimal footprint.',
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
        <span className="text-xs font-mono text-neutral-300">Local Search Strategies</span>
      </div>

      {/* Hero Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">Unit 2: AI Search</Badge>
          <Badge variant="default">1.2 Lecture Hours</Badge>
          <Badge variant="unit">CO1, CO3, CO4</Badge>
        </div>
        <h1 className="font-montserrat text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Local Search: Hill Climbing & Simulated Annealing
        </h1>
        <p className="text-base text-neutral-300 leading-relaxed max-w-3xl">
          When the path to the goal does not matter and only the{' '}
          <span className="font-montserrat text-highlight font-semibold">
            final optimal configuration
          </span>{' '}
          is required, local search operates with O(1) constant memory by navigating rugged
          elevation landscapes.
        </p>
      </div>

      {/* Section 1: Intuition & The "Aha!" Moment */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-foreground">
          1. Intuition: Climbing in the Dark & The Shaking Table
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed text-sm text-neutral-300">
          <div className="p-5 rounded-2xl border border-card-edge bg-card-fill/60 space-y-3">
            <h3 className="font-montserrat text-base font-semibold text-foreground">
              Hill Climbing: The Blind Mountaineer
            </h3>
            <p>
              Imagine waking up on the side of a foggy mountain range at midnight. Your only goal is
              to reach the highest peak. You can only feel the ground directly under your boots.
              Hill climbing says: take one step in the direction of steepest upward slope.
            </p>
            <p>
              This greedy strategy works brilliantly on a smooth single dome. But on real mountain
              ranges, you will quickly reach the top of a tiny foothill (a local maximum) where
              every direction leads downward. Believing you have conquered the mountain, you stop,
              completely unaware that Mount Everest towers miles above you behind a deep valley.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-card-edge bg-card-fill/60 space-y-3">
            <h3 className="font-montserrat text-base font-semibold text-foreground">
              Simulated Annealing: Bouncing Out of Valleys
            </h3>
            <p>
              In metallurgy, annealing involves heating a metal to high temperatures so atoms bounce
              freely out of fragile local crystal defects, then slowly cooling it so they settle
              into the{' '}
              <span className="font-montserrat text-highlight font-semibold">
                global minimum energy state
              </span>
              .
            </p>
            <p>
              Simulated Annealing borrows this physics insight: early in the search when temperature
              is high, the algorithm deliberately accepts downhill moves to bounce out of local
              traps. As temperature gradually drops, the shaking subsides, smoothly freezing the
              agent into the highest discovered peak.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Interactive Lab */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-foreground">
          2. Interactive Lab: Rugged Terrain Optimizer
        </h2>
        <p className="text-sm text-neutral-300 leading-relaxed">
          Interact with a rugged 1D elevation landscape. Start at position x=0, watch basic hill
          climbing get trapped at local peak x=3, and experiment with temperature cooling rates in
          Simulated Annealing to reach the global summit at x=21.
        </p>
        <LocalSearchLab />
      </section>

      {/* Section 3: Predict-Then-Reveal Challenge */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-foreground">
          3. Predict-Then-Reveal: The Starting Basin
        </h2>
        <Card className="p-6 border-card-edge bg-card-fill">
          <p className="text-sm text-neutral-200 leading-relaxed mb-4">
            If you run basic Steepest-Ascent Hill Climbing with start position{' '}
            <span className="font-montserrat text-highlight font-semibold">x = 18</span>, where will
            the agent end up?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <button
              onClick={() => setPrediction('global')}
              className={`p-3 rounded-xl border text-xs text-left transition-colors ${
                prediction === 'global'
                  ? 'border-brand bg-brand/10 text-foreground font-semibold'
                  : 'border-card-edge bg-card-fill/60 text-neutral-400 hover:text-foreground'
              }`}
            >
              <strong>A) Global Peak (x=21, elevation 100)</strong> because x=18 is already inside
              the basin of attraction of the global maximum.
            </button>

            <button
              onClick={() => setPrediction('local')}
              className={`p-3 rounded-xl border text-xs text-left transition-colors ${
                prediction === 'local'
                  ? 'border-brand bg-brand/10 text-foreground font-semibold'
                  : 'border-card-edge bg-card-fill/60 text-neutral-400 hover:text-foreground'
              }`}
            >
              <strong>B) Local Peak (x=3, elevation 28)</strong> because hill climbing always gets
              trapped at the first peak in the array.
            </button>

            <button
              onClick={() => setPrediction('plateau')}
              className={`p-3 rounded-xl border text-xs text-left transition-colors ${
                prediction === 'plateau'
                  ? 'border-brand bg-brand/10 text-foreground font-semibold'
                  : 'border-card-edge bg-card-fill/60 text-neutral-400 hover:text-foreground'
              }`}
            >
              <strong>C) Flat Plateau (x=7, elevation 18)</strong> because it slips backward into
              the shoulder.
            </button>
          </div>

          {prediction && (
            <Callout
              type={prediction === 'global' ? 'tip' : 'warning'}
              title={
                prediction === 'global' ? 'Correct Prediction!' : 'Check the Landscape Gradient'
              }
            >
              {prediction === 'global' ? (
                <p className="text-xs text-neutral-300">
                  Exactly right! At x=18 (elevation 42), the right neighbor x=19 has elevation 85 (a
                  steep positive gradient ΔE = +43). The agent marches rightward through x=19, x=20,
                  and crowns the summit at x=21 with elevation 100. Local search outcome depends
                  entirely on which basin of attraction the initial seed lands in!
                </p>
              ) : (
                <p className="text-xs text-neutral-300">
                  Notice that hill climbing never moves backward against a positive gradient. At
                  x=18, the elevation is 42, and to the right at x=19 the elevation jumps to 85.
                  Since 85 &gt; 42, the agent climbs toward the global peak at x=21!
                </p>
              )}
            </Callout>
          )}
        </Card>
      </section>

      {/* Section 4: Step-by-Step on Paper */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-foreground">
          4. Step-by-Step on Paper: The Metropolis Acceptance Criterion
        </h2>
        <Card className="p-6 border-card-edge bg-card-fill space-y-4 text-sm text-neutral-300 leading-relaxed">
          <p>
            Suppose an agent in Simulated Annealing is currently at state A with elevation 60. It
            contemplates moving to neighbor B with elevation 40 (a downhill move with \(\Delta E =
            40 - 60 = -20\)). Let us trace whether the bad move is accepted under high temperature
            versus low temperature:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl border border-card-edge bg-neutral-900/60 space-y-2">
              <span className="text-amber-400 font-bold block">
                Case 1: High Temperature (T = 100)
              </span>
              <p>1. Compute exponent: \(\Delta E / T = -20 / 100 = -0.20\)</p>
              <p>2. Acceptance probability: \(P = e^{-0.2} \approx 0.8187\) (81.9%)</p>
              <p>3. Draw random float \(r \in [0, 1)\). If \(r &lt; 0.819\), accept!</p>
              <p className="text-emerald-400 font-semibold">
                Outcome: Move is accepted ~82% of the time, easily escaping the local hilltop.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-card-edge bg-neutral-900/60 space-y-2">
              <span className="text-blue-400 font-bold block">Case 2: Cooled Down (T = 2)</span>
              <p>1. Compute exponent: \(\Delta E / T = -20 / 2 = -10.0\)</p>
              <p>2. Acceptance probability: \(P = e^{-10.0} \approx 0.000045\) (0.0045%)</p>
              <p>3. Draw random float \(r \in [0, 1)\). If \(r &lt; 0.000045\), accept.</p>
              <p className="text-rose-400 font-semibold">
                Outcome: Move is virtually guaranteed to be rejected. The system has frozen.
              </p>
            </div>
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
            {showMath ? 'Hide Formal Details' : 'Show Formal Details'}
          </Button>
        </div>

        <div className="space-y-4 text-sm text-neutral-300 leading-relaxed">
          <div className="p-5 rounded-xl border border-card-edge bg-card-fill/60 space-y-2">
            <h3 className="font-montserrat text-base font-semibold text-foreground">
              Topology of State-Space Landscapes
            </h3>
            <p>
              A local search problem is defined by an objective function f: S &rarr; ℝ. The
              state-space landscape contains four distinct topological structures:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-neutral-400">
              <li>
                <strong>Global Maximum:</strong> the state s* where f(s*) &ge; f(s) for all s ∈ S.
              </li>
              <li>
                <strong>Local Maximum:</strong> a state s where f(s) &ge; f(n) for all neighbors n ∈
                Neighbors(s), but f(s) &lt; f(s*).
              </li>
              <li>
                <strong>Plateau (Flat Local Maximum):</strong> a connected region of states where
                all elevations are identical and all surrounding states are lower.
              </li>
              <li>
                <strong>Ridge:</strong> a sequence of local peaks where the slope tilts upward along
                a narrow spine, causing steep ascent to oscillate inefficiently back and forth.
              </li>
            </ul>
          </div>

          {showMath && (
            <div className="p-5 rounded-xl border border-brand/30 bg-card-fill space-y-4 text-xs font-mono">
              <h3 className="font-montserrat text-sm font-semibold text-foreground">
                Statistical Physics: Metropolis-Hastings & Cooling Schedules
              </h3>
              <p>
                {
                  "The transition probability T(s → s') in Simulated Annealing is governed by the Boltzmann distribution:"
                }
              </p>
              <div className="font-mono text-center py-2 text-brand text-sm">
                {"P(accept s') = 1 if ΔE > 0, else exp(ΔE / T) if ΔE ≤ 0"}
              </div>
              <p className="text-neutral-400">
                {
                  "Where ΔE = f(s') - f(s) for maximization (or E(s) - E(s') for cost minimization)."
                }
              </p>
              <div className="pt-2">
                <h4 className="font-montserrat font-semibold text-foreground text-xs mb-1">
                  Convergence Theorem (Geman & Geman, 1984)
                </h4>
                <p className="text-neutral-300">
                  {
                    'If the cooling schedule satisfies T_k ≥ C / log(1 + k), Simulated Annealing is guaranteed to converge to the global optimum with probability 1 as k → ∞. In practice, geometric cooling T_(k+1) = α · T_k with α ∈ [0.85, 0.98] is preferred for computational tractability.'
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Section 6: Algorithm Pseudocode */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-foreground">
          6. Algorithm Pseudocode: Simulated Annealing
        </h2>
        <Card className="p-4 border-card-edge bg-[#0a0a0a] font-mono text-xs text-neutral-300 overflow-x-auto">
          <pre className="leading-relaxed">
            {`function SIMULATED_ANNEALING(problem, schedule):
    current = problem.INITIAL_STATE()
    
    for t = 1 to infinity:
        T = schedule(t)
        if T == 0 or T < threshold:
            return current

        next_state = RANDOM_CHOICE(problem.NEIGHBORS(current))
        delta_E = problem.VALUE(next_state) - problem.VALUE(current)

        if delta_E > 0:
            current = next_state
        else:
            // Metropolis acceptance test
            probability = exp(delta_E / T)
            if RANDOM_FLOAT(0, 1) < probability:
                current = next_state`}
          </pre>
        </Card>
      </section>

      {/* Section 7: Code It in Python */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-foreground">
          7. Code It in Python: Steepest Ascent & Annealing
        </h2>
        <Card className="p-4 border-card-edge bg-[#0a0a0a] font-mono text-xs text-neutral-300 overflow-x-auto">
          <pre className="leading-relaxed">
            {`import math
import random
from typing import List, Tuple

def steepest_ascent_hill_climbing(landscape: List[float], start_idx: int) -> Tuple[int, float]:
    """Steepest-ascent hill climbing on a 1D elevation array."""
    current = start_idx
    n = len(landscape)
    
    while True:
        neighbors = []
        if current > 0:
            neighbors.append(current - 1)
        if current < n - 1:
            neighbors.append(current + 1)

        best_neighbor = max(neighbors, key=lambda idx: landscape[idx])
        
        # If no neighbor improves elevation, halt at local peak
        if landscape[best_neighbor] <= landscape[current]:
            break
            
        current = best_neighbor

    return current, landscape[current]

def simulated_annealing(
    landscape: List[float],
    start_idx: int,
    t0: float = 100.0,
    alpha: float = 0.95,
    min_temp: float = 1e-4
) -> Tuple[int, float]:
    """Simulated Annealing with geometric cooling schedule."""
    current = start_idx
    t = t0
    n = len(landscape)

    while t > min_temp:
        options = []
        if current > 0:
            options.append(current - 1)
        if current < n - 1:
            options.append(current + 1)

        candidate = random.choice(options)
        delta_e = landscape[candidate] - landscape[current]

        if delta_e > 0:
            current = candidate
        else:
            p_accept = math.exp(delta_e / t)
            if random.random() < p_accept:
                current = candidate

        t *= alpha  # Cool down exponentially

    return current, landscape[current]`}
          </pre>
        </Card>
      </section>

      {/* Section 8: "Make It Fail" Laboratory */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-foreground">
          8. "Make It Fail" Laboratory: Pathologies of Local Search
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
          <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/20 space-y-2">
            <h3 className="font-montserrat text-sm font-semibold text-rose-300">
              Failure Mode 1: The Plateau Trap (Zero Gradient)
            </h3>
            <p className="text-neutral-300">
              Set start position to <span className="font-mono text-amber-400">x = 7</span>{' '}
              (elevation 18) in the simulator. The neighbors at x=6 and x=8 also have elevation 18.
              Steepest-ascent immediately terminates on step 1 because \(\Delta E \le 0\),
              completely stranded on the shoulder!
            </p>
          </div>

          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 space-y-2">
            <h3 className="font-montserrat text-sm font-semibold text-amber-300">
              Failure Mode 2: Cold Start Freezing in Annealing
            </h3>
            <p className="text-neutral-300">
              In Simulated Annealing, lower the initial temperature slider down to{' '}
              <span className="font-mono text-blue-400">T₀ = 1</span>. Because the temperature is
              already near-zero, downhill acceptance probabilities drop below 0.001%, instantly
              degenerating into greedy hill climbing and trapping the agent at x=3.
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
                  Constant O(1) memory
                </span>
                : no open list or search tree stored in RAM.
              </li>
              <li>
                Finds reasonable solutions rapidly in enormous combinatorial search spaces (e.g.
                1000-city TSP, N-Queens).
              </li>
              <li>Can run continuously in online environments where goals shift dynamically.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-card-edge bg-card-fill/60 space-y-2">
            <h3 className="font-montserrat text-sm font-semibold text-rose-400">Limitations</h3>
            <ul className="list-disc pl-4 space-y-1.5 text-neutral-300">
              <li>
                <span className="font-montserrat text-highlight font-semibold">Incomplete</span>:
                basic hill climbing can get trapped forever in local optima.
              </li>
              <li>
                No path history: returns only the final configuration, not the step sequence to
                reach it.
              </li>
              <li>
                Hyper-parameter sensitivity: cooling rate and initial temperature require empirical
                tuning.
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-card-edge bg-card-fill/60 space-y-2">
            <h3 className="font-montserrat text-sm font-semibold text-amber-400">
              When NOT to Use
            </h3>
            <ul className="list-disc pl-4 space-y-1.5 text-neutral-300">
              <li>
                When the sequence of actions is the actual product required (e.g. robot arm
                trajectory, GPS driving directions). Use A* or BFS instead.
              </li>
              <li>
                When exact global optimality is legally or safety-critical (e.g. medical radiation
                dosage).
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
              <em>"Simulated Annealing is just random search."</em>
            </p>
            <p className="text-neutral-400">
              <strong>Reality:</strong> False. Simulated Annealing is principled stochastic
              optimization. Uphill moves are always accepted; downhill moves are accepted with
              probabilities derived from thermodynamic equilibrium. Random walk accepts all
              directions with equal probability, making it exponentially slower.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-card-edge bg-card-fill/60 space-y-1">
            <span className="font-semibold text-rose-400 font-montserrat">Misconception 2:</span>
            <p className="text-neutral-300">
              <em>
                "Random-restart hill climbing guarantees finding the global peak in finite time."
              </em>
            </p>
            <p className="text-neutral-400">
              <strong>Reality:</strong> If the basin of attraction of the global optimum has
              probability \(p &gt; 0\), the probability of finding the peak in \(k\) restarts is \(1
              - (1-p)^k\), which approaches 1 as \(k \to \infty\). However, if the state space is
              exponentially vast (e.g. \(10^{100}\) states) and the peak is a needle in a haystack
              (\(p \approx 0\)), random restart will almost certainly fail within any reasonable
              runtime.
            </p>
          </div>
        </div>
      </section>

      {/* Section 11: Check Yourself */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-foreground">
          11. Check Yourself: Micro-Quiz
        </h2>
        <Quiz conceptId="u2-local-search" items={quizItems} />
      </section>

      {/* Section 12: Real-World Applications */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-foreground">
          12. Real-World Applications: VLSI Design & Traveling Salesperson
        </h2>
        <Card className="p-5 border-card-edge bg-card-fill space-y-3 text-xs leading-relaxed">
          <p className="text-neutral-300">
            Local search shines in massive industrial optimization problems:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-neutral-400">
            <div className="p-3 rounded-lg border border-card-edge bg-neutral-900/50">
              <span className="font-bold text-foreground block mb-1">
                VLSI Circuit Floorplanning
              </span>
              Billions of transistors must be arranged on a silicon die to minimize total wire
              length and heat concentration. Simulated annealing is the industry standard algorithm
              in electronic design automation (EDA) software.
            </div>
            <div className="p-3 rounded-lg border border-card-edge bg-neutral-900/50">
              <span className="font-bold text-foreground block mb-1">Airline Fleet Scheduling</span>
              Assigning hundreds of aircraft to thousands of flight legs while respecting
              maintenance windows and crew rest requirements uses large neighborhood search and
              simulated annealing.
            </div>
          </div>
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
              Q1: Differentiate between Local Search and Classical State-Space Search (BFS/DFS).
            </span>
            <p className="text-neutral-300">
              <strong>Model Answer:</strong> Classical search finds a sequence of actions from a
              start to a goal state, storing path history in tree/graph nodes with O(b^d) memory.
              Local search operates on complete state representations, seeking only the optimal
              configuration without caring about the path taken, using O(1) constant memory.
            </p>
          </div>

          <div className="space-y-1">
            <span className="font-mono text-brand font-bold">
              Q2: What is the Metropolis Criterion in Simulated Annealing?
            </span>
            <p className="text-neutral-300">
              <strong>Model Answer:</strong> The Metropolis Criterion determines the probability of
              accepting an inferior (downhill) move: P = exp(ΔE / T). If ΔE &gt; 0, the move is
              accepted unconditionally. If ΔE &le; 0, it is accepted with probability exp(ΔE / T),
              which decreases as temperature T decreases or as the penalty |ΔE| increases.
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
            <strong>O(1) memory efficiency:</strong> local search stores only the current state,
            scaling to millions of dimensions where tree searches run out of memory.
          </li>
          <li>
            <strong>Hill climbing is greedy and myopic:</strong> halts at local maxima, ridges, and
            plateaus because it cannot look past its immediate neighborhood.
          </li>
          <li>
            <strong>Random-restart adds breadth:</strong> sampling multiple random initial points
            overcomes local basins of attraction.
          </li>
          <li>
            <strong>Simulated Annealing bridges physics and AI:</strong> heating provides escape
            velocity from local valleys; controlled cooling guarantees freezing into a high-quality
            optimum.
          </li>
        </ul>
      </section>
    </div>
  );
}
