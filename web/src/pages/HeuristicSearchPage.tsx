import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Callout } from '@/components/ui/Callout';
import { Quiz } from '@/features/quiz/Quiz';
import { HeuristicSearchLab } from '@/labs/heuristic-search/HeuristicSearchLab';
import { ArrowLeft } from 'lucide-react';

export function HeuristicSearchPage() {
  const [showMath, setShowMath] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<string | null>(null);

  const quizItems = [
    {
      id: 'astar-q1',
      question:
        'What condition guarantees that tree-search A* will always return an optimal path to the goal?',
      options: [
        {
          id: 'A',
          text: 'The heuristic function h(n) must be admissible: it must never overestimate the true cost to reach the goal.',
          isCorrect: true,
          explanation:
            'Admissibility (h(n) <= h*(n)) ensures that A* never overlooks an optimal path by overestimating its cost. If h(n) overestimated, an optimal path could have an artificially inflated f-value and be ignored in favor of an inferior path.',
        },
        {
          id: 'B',
          text: 'The heuristic function h(n) must equal zero for all nodes.',
          isCorrect: false,
          explanation:
            'When h=0, A* degenerates into Dijkstra/Uniform-Cost Search, which is optimal but lacks heuristic guidance.',
        },
        {
          id: 'C',
          text: 'The branching factor b of the search tree must be strictly less than 2.',
          isCorrect: false,
          explanation:
            'Branching factor affects time and space complexity, not optimality under admissibility.',
        },
      ],
    },
    {
      id: 'astar-q2',
      question:
        'What additional property is required for graph-search A* (with a closed list) to ensure optimality without reopening closed nodes?',
      options: [
        {
          id: 'A',
          text: "Consistency (or monotonicity), satisfying the triangle inequality: h(n) <= c(n, a, n') + h(n').",
          isCorrect: true,
          explanation:
            'Consistency guarantees that f(n) is monotonically non-decreasing along every path. When a node is selected for expansion in graph-search A*, its discovered path to the start is guaranteed to be optimal, eliminating the need to ever reopen closed nodes.',
        },
        {
          id: 'B',
          text: 'Strict convexity of the state space graph.',
          isCorrect: false,
          explanation: 'Discrete state spaces do not require geometric convexity.',
        },
        {
          id: 'C',
          text: 'Negative edge weights across all transition arcs.',
          isCorrect: false,
          explanation: 'Negative edge weights break A* and Dijkstra algorithms.',
        },
      ],
    },
    {
      id: 'astar-q3',
      question:
        'Why does Greedy Best-First Search fail to guarantee an optimal path even when given an admissible heuristic?',
      options: [
        {
          id: 'A',
          text: 'It selects nodes based solely on h(n), completely ignoring the cost g(n) already accumulated.',
          isCorrect: true,
          explanation:
            'Greedy Best-First is myopic: it prioritizes the node that appears closest to the goal right now (lowest h(n)), regardless of how expensive the journey was to get there. As a result, it can take an expensive detour or get trapped in concave barriers.',
        },
        {
          id: 'B',
          text: 'It requires exponential memory proportional to O(b^d).',
          isCorrect: false,
          explanation:
            'Memory consumption is a resource concern, not the mathematical cause of path suboptimality.',
        },
        {
          id: 'C',
          text: 'It evaluates nodes using random tie-breaking.',
          isCorrect: false,
          explanation: 'Tie-breaking does not cause Greedy Best-First systematic path inflation.',
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
        <span className="text-xs font-mono text-neutral-300">Heuristic Search & A*</span>
      </div>

      {/* Hero Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">Unit 2: AI Search</Badge>
          <Badge variant="default">1.4 Lecture Hours</Badge>
          <Badge variant="unit">CO1, CO3, CO4</Badge>
        </div>
        <h1 className="font-montserrat text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Heuristic Search: Greedy Best-First vs A*
        </h1>
        <p className="text-base text-neutral-300 leading-relaxed max-w-3xl">
          Uninformed search methods stumble in the dark. Heuristic search gives an agent an{' '}
          <span className="font-montserrat text-highlight font-semibold">
            estimated sense of direction
          </span>
          , transforming blind exponential exploration into targeted, optimal problem solving.
        </p>
      </div>

      {/* Section 1: Intuition & The "Aha!" Moment */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-foreground">
          1. Intuition: The Blind Explorer vs The Mountain Guide
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed text-sm text-neutral-300">
          <div className="p-5 rounded-2xl border border-card-edge bg-card-fill/60 space-y-3">
            <h3 className="font-montserrat text-base font-semibold text-foreground">
              The Fog of Uninformed Search
            </h3>
            <p>
              Imagine hiking through dense fog towards a mountain peak you cannot see. Breadth-First
              Search walks in expanding concentric circles, checking every single boulder 1 mile
              away before checking any boulder 2 miles away. It guarantees reaching the peak
              eventually, but wastes tremendous energy exploring valleys that lead away from your
              target.
            </p>
            <p>
              Dijkstra algorithm is similarly uniform: it expands outward evenly in all directions
              according to distance traveled, entirely unaware of where the destination lies.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-card-edge bg-card-fill/60 space-y-3">
            <h3 className="font-montserrat text-base font-semibold text-foreground">
              Enter the Heuristic: Distance as a Compass
            </h3>
            <p>
              Now imagine holding an altimeter and a compass that points directly toward the summit.
              Even if you cannot see the trail through the fog, you have an{' '}
              <span className="font-montserrat text-highlight font-semibold">
                informed heuristic estimate
              </span>{' '}
              of how far you remain from your goal.
            </p>
            <p>
              A* combines both perspectives: the exact cost of the path you have already walked (
              <span className="font-mono text-emerald-400">g(n)</span>) plus the estimated remaining
              cost to the summit (<span className="font-mono text-amber-400">h(n)</span>). The sum{' '}
              <span className="font-mono text-brand">f(n) = g(n) + h(n)</span> estimates the total
              cost of the complete journey through that node.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Interactive Lab */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-foreground">
          2. Interactive Lab: A* vs Greedy Best-First Arena
        </h2>
        <p className="text-sm text-neutral-300 leading-relaxed">
          Test both search strategies across obstacle fields and concave horseshoe traps. Toggle
          between Manhattan and Euclidean heuristics, or activate the overestimating heuristic to
          break optimality.
        </p>
        <HeuristicSearchLab />
      </section>

      {/* Section 3: Predict-Then-Reveal Challenge */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-foreground">
          3. Predict-Then-Reveal: The Horseshoe Trap
        </h2>
        <Card className="p-6 border-card-edge bg-card-fill">
          <p className="text-sm text-neutral-200 leading-relaxed mb-4">
            Look at the{' '}
            <span className="font-montserrat text-highlight font-semibold">Horseshoe Trap</span>{' '}
            preset in the simulator above, where a U-shaped wall encloses the goal from three sides.
            When you click run with Greedy Best-First versus A*, which algorithm will enter the
            interior of the horseshoe first?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <button
              onClick={() => setPrediction('greedy')}
              className={`p-3 rounded-xl border text-xs text-left transition-colors ${
                prediction === 'greedy'
                  ? 'border-brand bg-brand/10 text-foreground font-semibold'
                  : 'border-card-edge bg-card-fill/60 text-neutral-400 hover:text-foreground'
              }`}
            >
              <strong>A) Greedy Best-First</strong> marches directly into the concave trap because
              interior cells are geometrically closer to the goal.
            </button>

            <button
              onClick={() => setPrediction('astar')}
              className={`p-3 rounded-xl border text-xs text-left transition-colors ${
                prediction === 'astar'
                  ? 'border-brand bg-brand/10 text-foreground font-semibold'
                  : 'border-card-edge bg-card-fill/60 text-neutral-400 hover:text-foreground'
              }`}
            >
              <strong>B) A* Search</strong> walks into the trap first because its g(n) cost starts
              at zero.
            </button>

            <button
              onClick={() => setPrediction('both')}
              className={`p-3 rounded-xl border text-xs text-left transition-colors ${
                prediction === 'both'
                  ? 'border-brand bg-brand/10 text-foreground font-semibold'
                  : 'border-card-edge bg-card-fill/60 text-neutral-400 hover:text-foreground'
              }`}
            >
              <strong>C) Both algorithms</strong> expand the exact same number of nodes in identical
              order.
            </button>
          </div>

          {prediction && (
            <Callout
              type={prediction === 'greedy' ? 'tip' : 'warning'}
              title={
                prediction === 'greedy' ? 'Prediction Verified!' : 'Not Quite: The Myopic Trap'
              }
            >
              {prediction === 'greedy' ? (
                <p className="text-xs text-neutral-300">
                  Spot on! Greedy Best-First looks exclusively at h(n). Cells trapped inside the
                  horseshoe have small straight-line distances to the goal, so Greedy aggressively
                  rushes straight into the cul-de-sac. A* balances h(n) with the accumulated
                  distance g(n), recognizing that deep penetration into the dead end increases total
                  cost f(n), allowing it to divert around the obstacle.
                </p>
              ) : (
                <p className="text-xs text-neutral-300">
                  Greedy Best-First rushes headfirst into the horseshoe because it evaluates nodes
                  strictly on h(n). The cells inside the U-shaped pocket are geometrically adjacent
                  to the goal, making h(n) temptingly small. Greedy has no awareness of the wall
                  blocking its path until it hits the dead end!
                </p>
              )}
            </Callout>
          )}
        </Card>
      </section>

      {/* Section 4: Step-by-Step on Paper */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-foreground">
          4. Step-by-Step on Paper: Tracing f(n) = g(n) + h(n)
        </h2>
        <Card className="p-6 border-card-edge bg-card-fill space-y-4 text-sm text-neutral-300 leading-relaxed">
          <p>
            Consider a tiny 3-node graph: Start node S, intermediate node A, and goal node G.
            Suppose the edge costs are c(S, A) = 2, c(A, G) = 4, and a direct edge c(S, G) = 8.
            Heuristic values to G are h(S) = 5, h(A) = 3, and h(G) = 0.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono border border-card-edge text-left">
              <thead className="bg-neutral-900/80 text-neutral-300 border-b border-card-edge">
                <tr>
                  <th className="p-2.5">Step</th>
                  <th className="p-2.5">Open List (Priority Queue)</th>
                  <th className="p-2.5">Selected Node</th>
                  <th className="p-2.5">g(n)</th>
                  <th className="p-2.5">h(n)</th>
                  <th className="p-2.5">f(n) = g + h</th>
                  <th className="p-2.5">Action Taken</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-edge/50">
                <tr>
                  <td className="p-2.5 font-bold text-foreground">1</td>
                  <td className="p-2.5">&#123; S: f=0+5=5 &#125;</td>
                  <td className="p-2.5 text-brand font-bold">S</td>
                  <td className="p-2.5">0</td>
                  <td className="p-2.5">5</td>
                  <td className="p-2.5">5</td>
                  <td className="p-2.5">
                    Expand S: generates A (g=2, f=2+3=5) and G (g=8, f=8+0=8).
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-foreground">2</td>
                  <td className="p-2.5">&#123; A: f=5, G: f=8 &#125;</td>
                  <td className="p-2.5 text-brand font-bold">A</td>
                  <td className="p-2.5">2</td>
                  <td className="p-2.5">3</td>
                  <td className="p-2.5">5</td>
                  <td className="p-2.5">
                    Expand A: generates G with g=2+4=6, updating G f-value to 6+0=6.
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-foreground">3</td>
                  <td className="p-2.5">&#123; G: f=6 &#125;</td>
                  <td className="p-2.5 text-emerald-400 font-bold">G</td>
                  <td className="p-2.5">6</td>
                  <td className="p-2.5">0</td>
                  <td className="p-2.5">6</td>
                  <td className="p-2.5">
                    Goal node G popped from queue! Optimal path S &rarr; A &rarr; G returned with
                    cost 6.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-xs text-neutral-400">
            Notice that direct edge S &rarr; G had cost 8. Even though G was generated in Step 1, A*
            did not terminate because its f-cost (8) was higher than A f-cost (5). A* only halts
            when the goal node is{' '}
            <span className="font-montserrat text-highlight font-semibold">
              popped from the open list
            </span>
            , never merely when generated.
          </p>
        </Card>
      </section>

      {/* Section 5: Formal Mathematical Foundations */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-montserrat text-2xl font-semibold text-foreground">
            5. Formal Mathematical Foundations
          </h2>
          <Button size="sm" variant="outline" onClick={() => setShowMath((prev) => !prev)}>
            {showMath ? 'Hide Formal Proofs' : 'Show Formal Proofs'}
          </Button>
        </div>

        <div className="space-y-4 text-sm text-neutral-300 leading-relaxed">
          <div className="p-5 rounded-xl border border-card-edge bg-card-fill/60 space-y-2">
            <h3 className="font-montserrat text-base font-semibold text-foreground">
              Definition 1: Admissibility of a Heuristic
            </h3>
            <p>
              A heuristic function \(h(n)\) is defined as{' '}
              <span className="font-montserrat text-highlight font-semibold">admissible</span> if it
              never overestimates the true minimal cost to reach the goal state from node \(n\):
            </p>
            <div className="font-mono text-center py-2 text-brand text-base">
              \(0 \le h(n) \le h^*(n), \quad \forall n \in S\)
            </div>
            <p className="text-xs text-neutral-400">
              Where \(h^*(n)\) is the true optimal cost from node \(n\) to the nearest goal state,
              and \(h(G) = 0\) for every goal state \(G\).
            </p>
          </div>

          {showMath && (
            <div className="p-5 rounded-xl border border-brand/30 bg-card-fill space-y-4 text-xs font-mono">
              <h3 className="font-montserrat text-sm font-semibold text-foreground">
                Mathematical Proof: A* Optimality Under Admissibility
              </h3>
              <p>
                <strong>Theorem:</strong> When \(h(n)\) is admissible, Tree-Search A* always returns
                an optimal path.
              </p>
              <div className="space-y-2 text-neutral-300 pl-4 border-l-2 border-brand">
                <p>
                  1. Suppose for contradiction that A* terminates by selecting a suboptimal goal
                  state \(G_2\) from the frontier, where \(g(G_2) &gt; g(G^*)\), where \(G^*\) is an
                  optimal goal state.
                </p>
                <p>
                  2. At the moment \(G_2\) is chosen, there must exist some unexpanded node \(n\) on
                  the frontier that lies along the optimal path to \(G^*\).
                </p>
                <p>3. By definition of \(f(n)\): \(f(n) = g(n) + h(n)\).</p>
                <p>
                  4. Since \(h(n)\) is admissible, \(h(n) \le h^*(n)\), which implies \(f(n) = g(n)
                  + h(n) \le g(n) + h^*(n) = g(G^*)\).
                </p>
                <p>5. For goal state \(G_2\), \(h(G_2) = 0\), therefore \(f(G_2) = g(G_2)\).</p>
                <p>6. Since \(G_2\) is suboptimal, \(f(n) \le g(G^*) &lt; g(G_2) = f(G_2)\).</p>
                <p>
                  7. Thus \(f(n) &lt; f(G_2)\). Because A* selects the node with minimum \(f\)-cost
                  from the frontier, it must select \(n\) before \(G_2\). Contradiction!
                </p>
              </div>

              <div className="pt-2">
                <h4 className="font-montserrat font-semibold text-foreground text-xs mb-1">
                  Definition 2: Consistency (Monotonicity)
                </h4>
                <p>
                  {
                    "A heuristic is consistent if for every node n and successor n' generated by action a:"
                  }
                </p>
                <p className="text-center text-brand font-bold py-1">
                  {"h(n) ≤ c(n, a, n') + h(n')"}
                </p>
                <p className="text-neutral-400">
                  Consistency satisfies the triangle inequality. Every consistent heuristic is
                  admissible, and guarantees that f(n) values are monotonically non-decreasing along
                  any path, eliminating the need to ever reopen closed states.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Section 6: Algorithm Pseudocode */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-foreground">
          6. Algorithm Pseudocode: Graph-Search A*
        </h2>
        <Card className="p-4 border-card-edge bg-[#0a0a0a] font-mono text-xs text-neutral-300 overflow-x-auto">
          <pre className="leading-relaxed">
            {`function A_STAR(start, is_goal, expand_neighbors, h):
    // Priority queue storing nodes ordered by f_score
    open_set = PriorityQueue()
    open_set.insert(start, priority=h(start))
    
    // Maps each node to the lowest cost from start discovered so far
    g_score = { start: 0 }
    parent = {}
    closed_set = Set()

    while not open_set.is_empty():
        current = open_set.pop_min()

        if is_goal(current):
            return reconstruct_path(parent, current)

        closed_set.add(current)

        for neighbor, step_cost in expand_neighbors(current):
            if neighbor in closed_set:
                continue

            tentative_g = g_score[current] + step_cost

            if neighbor not in g_score or tentative_g < g_score[neighbor]:
                parent[neighbor] = current
                g_score[neighbor] = tentative_g
                f_score = tentative_g + h(neighbor)
                open_set.insert_or_update(neighbor, priority=f_score)

    return failure // Goal is unreachable`}
          </pre>
        </Card>
      </section>

      {/* Section 7: Code It in Python */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-foreground">
          7. Code It in Python: Production A* with heapq
        </h2>
        <Card className="p-4 border-card-edge bg-[#0a0a0a] font-mono text-xs text-neutral-300 overflow-x-auto">
          <pre className="leading-relaxed">
            {`import heapq
from typing import Dict, List, Tuple, Optional

def a_star_search(
    start: Tuple[int, int],
    goal: Tuple[int, int],
    obstacles: set
) -> Optional[List[Tuple[int, int]]]:
    """
    Computes the optimal path on a 2D grid using A* with Manhattan distance.
    Guaranteed optimal because Manhattan distance is admissible on grids.
    """
    def heuristic(a: Tuple[int, int], b: Tuple[int, int]) -> int:
        return abs(a[0] - b[0]) + abs(a[1] - b[1])

    # Priority queue entries: (f_score, counter, current_node)
    counter = 0
    open_heap = []
    heapq.heappush(open_heap, (heuristic(start, goal), counter, start))
    
    g_costs: Dict[Tuple[int, int], int] = {start: 0}
    parents: Dict[Tuple[int, int], Tuple[int, int]] = {}
    closed_set = set()

    while open_heap:
        _, _, current = heapq.heappop(open_heap)

        if current == goal:
            # Reconstruct optimal path backwards
            path = [current]
            while current in parents:
                current = parents[current]
                path.append(current)
            return path[::-1]

        if current in closed_set:
            continue
        closed_set.add(current)

        # 4-cardinal orthogonal movements
        for dx, dy in [(0, 1), (1, 0), (0, -1), (-1, 0)]:
            neighbor = (current[0] + dx, current[1] + dy)
            if neighbor in obstacles or neighbor in closed_set:
                continue

            tentative_g = g_costs[current] + 1
            if neighbor not in g_costs or tentative_g < g_costs[neighbor]:
                parents[neighbor] = current
                g_costs[neighbor] = tentative_g
                f_cost = tentative_g + heuristic(neighbor, goal)
                counter += 1
                heapq.heappush(open_heap, (f_cost, counter, neighbor))

    return None  # Unreachable`}
          </pre>
        </Card>
      </section>

      {/* Section 8: "Make It Fail" Laboratory */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-foreground">
          8. "Make It Fail" Laboratory: Breaking A*
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
          <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/20 space-y-2">
            <h3 className="font-montserrat text-sm font-semibold text-rose-300">
              Failure Mode 1: Overestimating Heuristic (Non-Admissibility)
            </h3>
            <p className="text-neutral-300">
              Select <span className="font-mono text-rose-400">Overestimating (2.5x)</span> in the
              simulator above. When a heuristic inflates remaining costs, an optimal scenic highway
              that happens to curve away slightly gets penalised with a massive f-score, leading A*
              to prematurely terminate on an expensive, narrow shortcut!
            </p>
          </div>

          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 space-y-2">
            <h3 className="font-montserrat text-sm font-semibold text-amber-300">
              Failure Mode 2: Inconsistency in Graph Search
            </h3>
            <p className="text-neutral-300">
              If an admissible heuristic is inconsistent, the f-cost can decrease along a path. If
              closed nodes are never reopened, graph-search A* can close a node via a suboptimal
              path and discard a later, truly optimal arrival route.
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
                  Provably optimal
                </span>{' '}
                when using an admissible heuristic.
              </li>
              <li>
                <span className="font-montserrat text-highlight font-semibold">
                  Optimally efficient
                </span>
                : no other optimal search algorithm expands fewer nodes with the same heuristic.
              </li>
              <li>Flexible: easily tunes between Dijkstra (h=0) and Greedy (g=0).</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-card-edge bg-card-fill/60 space-y-2">
            <h3 className="font-montserrat text-sm font-semibold text-rose-400">Limitations</h3>
            <ul className="list-disc pl-4 space-y-1.5 text-neutral-300">
              <li>
                <span className="font-montserrat text-highlight font-semibold">
                  Memory exhaustion
                </span>
                : keeps all generated nodes in RAM, scaling as O(b^d).
              </li>
              <li>
                Heuristic design overhead: finding a tight, computationally cheap admissible
                heuristic is non-trivial.
              </li>
              <li>Cannot handle negative edge weights.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-card-edge bg-card-fill/60 space-y-2">
            <h3 className="font-montserrat text-sm font-semibold text-amber-400">
              When NOT to Use
            </h3>
            <ul className="list-disc pl-4 space-y-1.5 text-neutral-300">
              <li>When memory is severely constrained (use IDA* or SMA* instead).</li>
              <li>
                When the search space is massive and a good heuristic cannot be formulated (use
                Monte Carlo Tree Search).
              </li>
              <li>When step costs are uniform and small (standard BFS is faster and simpler).</li>
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
              <em>"A* halts as soon as it generates the goal node."</em>
            </p>
            <p className="text-neutral-400">
              <strong>Reality:</strong> False! A* only halts when the goal node is{' '}
              <span className="font-montserrat text-highlight font-semibold">
                popped from the open list
              </span>
              . Generating a goal node only proves a path exists; an alternative, cheaper path may
              still be sitting on the open list with a lower f-cost.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-card-edge bg-card-fill/60 space-y-1">
            <span className="font-semibold text-rose-400 font-montserrat">Misconception 2:</span>
            <p className="text-neutral-300">
              <em>
                "Any admissible heuristic guarantees that graph search never re-expands closed
                nodes."
              </em>
            </p>
            <p className="text-neutral-400">
              <strong>Reality:</strong> Admissibility guarantees optimality for <em>tree search</em>
              . For <em>graph search</em> with a closed set, the heuristic must also be{' '}
              <span className="font-montserrat text-highlight font-semibold">
                consistent (monotonic)
              </span>
              . Without consistency, a node may be closed with a suboptimal path and must be
              reopened when a cheaper route is found.
            </p>
          </div>
        </div>
      </section>

      {/* Section 11: Check Yourself */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-foreground">
          11. Check Yourself: Micro-Quiz
        </h2>
        <Quiz conceptId="u2-informed-search" items={quizItems} />
      </section>

      {/* Section 12: Real-World Case Study Teaser */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-foreground">
          12. Real-World Case Study Preview: GPS Navigation
        </h2>
        <Card className="p-5 border-card-edge bg-card-fill flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-montserrat font-semibold text-sm text-foreground">
              Case Study 1: Real-Time GPS Routing & Traffic Avoidance
            </h3>
            <p className="text-xs text-neutral-400 max-w-xl">
              Explore how production routing systems like Google Maps and OSRM combine A* with
              contraction hierarchies and bidirectional heuristics to route across millions of road
              segments in milliseconds.
            </p>
          </div>
          <Link to="/case-studies/gps-navigation">
            <Button size="sm" variant="primary" className="whitespace-nowrap">
              Open GPS Case Study
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
              Q1: State the mathematical conditions for admissibility and consistency of a heuristic
              function.
            </span>
            <p className="text-neutral-300">
              <strong>Model Answer:</strong> A heuristic \(h(n)\) is admissible if \(0 \le h(n) \le
              h^*(n)\) for all nodes \(n\), where \(h^*(n)\) is the true optimal cost to the goal,
              and \(h(G) = 0\) for goal states. A heuristic is consistent (monotonic) if \(h(n) \le
              c(n, a, n') + h(n')\) for every node \(n\) and successor \(n'\) generated by action
              \(a\).
            </p>
          </div>

          <div className="space-y-1">
            <span className="font-mono text-brand font-bold">
              Q2: Why is A* termed "optimally efficient"?
            </span>
            <p className="text-neutral-300">
              <strong>Model Answer:</strong> A* is optimally efficient because no other optimal
              algorithm expanding search paths from the start can expand fewer nodes than A* when
              using the same heuristic function. Any algorithm that does not expand all nodes with
              \(f(n) &lt; C^*\) runs the risk of missing the optimal path.
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
            <strong>A* combines past and future:</strong> \(f(n) = g(n) + h(n)\) balances real
            distance traveled with remaining distance to avoid blind detours.
          </li>
          <li>
            <strong>Greedy Best-First is myopic:</strong> prioritizes \(h(n)\) alone, which makes it
            fast on unobstructed plains but fatally vulnerable to concave traps.
          </li>
          <li>
            <strong>Admissibility ensures optimality:</strong> an optimistic heuristic (\(h \le
            h^*\)) guarantees the optimal goal will be expanded before any suboptimal goal.
          </li>
          <li>
            <strong>Consistency prevents reopening:</strong> consistency guarantees monotonic
            non-decreasing \(f\)-values, ensuring that when a node is expanded in graph search, its
            path is already optimal.
          </li>
        </ul>
      </section>
    </div>
  );
}
