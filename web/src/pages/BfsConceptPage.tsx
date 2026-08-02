import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, AlertOctagon } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Callout } from '@/components/ui/Callout';
import { Toggle } from '@/components/ui/Toggle';
import { GlossaryTerm } from '@/features/glossary/GlossaryTerm';
import { Quiz, QuizItem } from '@/features/quiz/Quiz';
import { WarehouseBfsLab } from '@/labs/warehouse-bfs/WarehouseBfsLab';
import { useProgressStore } from '@/features/progress/useProgressStore';

export function BfsConceptPage() {
  const [showMath, setShowMath] = useState(false);
  const markRead = useProgressStore((state) => state.markRead);
  const markLabCompleted = useProgressStore((state) => state.markLabCompleted);

  useEffect(() => {
    markRead('u2-bfs');
  }, [markRead]);

  const quizItems: QuizItem[] = [
    {
      id: 'q1',
      question: 'Why does Breadth-First Search guarantee the shortest path on an unweighted grid?',
      options: [
        {
          id: 'A',
          text: 'Because it uses a heuristic to estimate distances to the target.',
          isCorrect: false,
          explanation:
            'BFS is an uninformed search; it has no heuristic function. That is A* or Greedy Search.',
        },
        {
          id: 'B',
          text: 'Because it explores all nodes at depth d before ever touching any node at depth d + 1.',
          isCorrect: true,
          explanation:
            'The FIFO queue guarantees level-by-level exploration, so the first time the goal is generated, it must be via a path of minimal edge length.',
        },
        {
          id: 'C',
          text: 'Because it backtracks whenever a path becomes too long.',
          isCorrect: false,
          explanation:
            'Backtracking is a characteristic of Depth-First Search (DFS) or CSP solvers, not standard BFS.',
        },
      ],
    },
    {
      id: 'q2',
      question:
        'Suppose a warehouse grid has a branching factor of b = 4 actions (Up, Down, Left, Right) and the destination is at depth d = 6. What is the worst-case space complexity of BFS?',
      options: [
        {
          id: 'A',
          text: 'O(b · d) = O(24) nodes in memory.',
          isCorrect: false,
          explanation:
            'O(b · d) is the linear memory footprint of Depth-First Search (DFS), not BFS.',
        },
        {
          id: 'B',
          text: 'O(b^d) = O(4^6 = 4096) nodes in memory.',
          isCorrect: true,
          explanation:
            'BFS must hold the entire current exploration wavefront in its FIFO queue, requiring O(b^d) space.',
        },
        {
          id: 'C',
          text: 'O(d) = O(6) nodes in memory.',
          isCorrect: false,
          explanation: 'O(d) is insufficient even for storing the current path.',
        },
      ],
    },
    {
      id: 'q3',
      question:
        'Common Misconception: If roads have varying speed limits or varying fuel costs (weighted edges), will standard BFS still guarantee the optimal path?',
      options: [
        {
          id: 'A',
          text: 'Yes, because BFS always checks nodes in order of creation.',
          isCorrect: false,
          explanation:
            'A path with fewer edges can have a much higher total cost if individual edge weights are large. Standard BFS ignores edge weights.',
        },
        {
          id: 'B',
          text: 'No; on weighted graphs, Uniform-Cost Search (Dijkstra) or A* is required to guarantee optimality.',
          isCorrect: true,
          explanation:
            'BFS minimizes step count (edge count), not cumulative numerical cost. Uniform-Cost Search replaces the FIFO queue with a priority queue ordered by g(n).',
        },
        {
          id: 'C',
          text: 'Yes, provided the graph contains no directed cycles.',
          isCorrect: false,
          explanation:
            'Cycles affect termination and explored tracking, but unequal positive weights immediately break BFS cost-optimality even on trees.',
        },
      ],
    },
    {
      id: 'q4',
      question:
        'Why is early goal testing (checking if child == goal before pushing to the queue) preferred over late goal testing in BFS?',
      options: [
        {
          id: 'A',
          text: 'It eliminates the need for an explored set entirely.',
          isCorrect: false,
          explanation:
            'An explored set is still needed to prevent cycles and duplicate node expansion.',
        },
        {
          id: 'B',
          text: 'It saves generating the entire level d + 1, reducing memory and time by a factor of b.',
          isCorrect: true,
          explanation:
            'By checking upon generation rather than waiting until the node is popped from the front of the queue, we avoid enqueuing all other siblings at depth d.',
        },
        {
          id: 'C',
          text: 'It makes the algorithm admissible even on negative weight cycles.',
          isCorrect: false,
          explanation: 'BFS does not handle negative weights.',
        },
      ],
    },
  ];

  return (
    <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* 1. Header & Metadata */}
      <header className="mb-8 border-b border-studio-200 pb-8 dark:border-studio-800">
        <Link
          to="/learn/unit-2"
          className="inline-flex items-center text-xs font-semibold text-studio-500 hover:text-unit-2 mb-4 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1" />
          Back to Unit 2: AI Search Strategies
        </Link>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="unit" unit={2}>
            Unit 2 · Search
          </Badge>
          <Badge variant="outline">Syllabus Topic: u2-uninformed-search</Badge>
          <span className="flex items-center text-xs text-studio-500 ml-auto">
            <Clock className="h-3.5 w-3.5 mr-1" />
            15 min read & lab
          </span>
        </div>

        <h1 className="font-display text-3xl font-extrabold tracking-tight text-studio-900 dark:text-studio-50 sm:text-4xl">
          Breadth-First Search (BFS)
        </h1>
        <p className="mt-3 text-lg text-studio-600 dark:text-studio-400">
          The foundation of uninformed graph traversal: how a simple FIFO queue guarantees the
          shortest path across any unweighted network.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-studio-500 pt-3 border-t border-studio-100 dark:border-studio-800">
          <span>
            <strong>Course Outcomes:</strong> CO1 (Search Principles), CO4 (Algorithm Limits)
          </span>
          <span>
            <strong>Prerequisites:</strong> State-Space Representation, Queues
          </span>
        </div>
      </header>

      {/* 2. The Hook */}
      <section className="mb-10">
        <div className="rounded-2xl bg-gradient-to-r from-sky-500/10 via-sky-500/5 to-transparent p-6 border-l-4 border-unit-2">
          <h2 className="font-display text-xl font-bold text-studio-900 dark:text-studio-100 mb-2">
            The Million-Package Bottleneck
          </h2>
          <p className="text-base text-studio-700 dark:text-studio-300 leading-relaxed">
            In an Amazon fulfillment center in Pune, hundreds of autonomous drive units navigate a
            dense maze of movable inventory pods. If a robot takes a long, winding detour, battery
            drain doubles and order dispatch halts. The robot needs a path that is{' '}
            <strong>guaranteed to require the minimum number of moves</strong>. How does it find the
            shortest path without knowing where the shelves are in advance?
          </p>
        </div>
      </section>

      {/* 3. Intuition */}
      <section className="mb-10">
        <h2 className="font-display text-2xl font-bold text-studio-900 dark:text-studio-100 mb-4">
          Intuition: The Stone in the Pond
        </h2>
        <p className="text-base text-studio-700 dark:text-studio-300 leading-relaxed mb-4">
          Imagine tossing a pebble into still water. Concentric ripples radiate outward at uniform
          speed. Every point at distance 1 is reached before any point at distance 2; every point at
          distance 2 is reached before distance 3.
        </p>
        <p className="text-base text-studio-700 dark:text-studio-300 leading-relaxed mb-4">
          <strong>Breadth-First Search works exactly like that expanding ripple.</strong> By storing
          newly discovered states in a{' '}
          <GlossaryTerm term="frontier" displayText="FIFO (First-In, First-Out) Queue" />, BFS
          guarantees that it finishes exploring all paths of length \(d\) before it ever
          investigates a path of length \(d + 1\).
        </p>

        <Callout type="tip" title="Why FIFO is the Secret">
          Because the queue is First-In First-Out, nodes added earlier (closer to the start) are
          always pulled off and expanded before nodes added later (further away). No math tricks
          needed — the data structure itself enforces the order!
        </Callout>
      </section>

      {/* 4. Try It: Interactive Lab */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-unit-2">
              Interactive Lab
            </span>
            <h2 className="font-display text-2xl font-bold text-studio-900 dark:text-studio-100">
              Warehouse Robot Simulator
            </h2>
          </div>
        </div>

        <p className="text-sm text-studio-600 dark:text-studio-400 mb-4">
          Watch the blue wavefront expand cell-by-cell. Click any empty square to drop a shelf rack,
          or click <em>Make It Fail</em> to observe what happens when no path exists.
        </p>

        <WarehouseBfsLab
          onGoalReached={() => {
            markLabCompleted('u2-bfs');
          }}
        />
      </section>

      {/* 5. Step-Through on a Small Hand-Checkable Example */}
      <section className="mb-10">
        <h2 className="font-display text-2xl font-bold text-studio-900 dark:text-studio-100 mb-4">
          Step-by-Step on Paper (Hand-Worked Trace)
        </h2>
        <p className="text-sm text-studio-700 dark:text-studio-300 leading-relaxed mb-4">
          Let’s verify BFS on paper on a 4-node diamond graph: Start at <strong>A</strong>, goal is{' '}
          <strong>D</strong>. Neighbors of A are B and C. Both B and C connect to D.
        </p>

        <div className="overflow-x-auto my-4">
          <table className="w-full text-left text-xs border border-studio-200 dark:border-studio-800 rounded-xl overflow-hidden">
            <thead className="bg-studio-100 dark:bg-studio-800 text-studio-800 dark:text-studio-200 font-bold">
              <tr>
                <th className="p-3">Step</th>
                <th className="p-3">Popped Node</th>
                <th className="p-3">Frontier Queue (FIFO)</th>
                <th className="p-3">Explored Set</th>
                <th className="p-3">Action Taken</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-studio-100 dark:divide-studio-800 font-mono">
              <tr className="bg-white dark:bg-studio-900">
                <td className="p-3">0</td>
                <td className="p-3 text-studio-400">—</td>
                <td className="p-3 text-unit-2 font-bold">[A]</td>
                <td className="p-3">{'{A}'}</td>
                <td className="p-3 font-sans">Initialize with start node A.</td>
              </tr>
              <tr className="bg-studio-50/50 dark:bg-studio-800/40">
                <td className="p-3">1</td>
                <td className="p-3 font-bold">A</td>
                <td className="p-3 text-unit-2 font-bold">[B, C]</td>
                <td className="p-3">{'{A, B, C}'}</td>
                <td className="p-3 font-sans">Pop A. Discover neighbors B and C; enqueue both.</td>
              </tr>
              <tr className="bg-white dark:bg-studio-900">
                <td className="p-3">2</td>
                <td className="p-3 font-bold">B</td>
                <td className="p-3 text-unit-2 font-bold">[C]</td>
                <td className="p-3">{'{A, B, C, D}'}</td>
                <td className="p-3 font-sans">
                  Pop B. Discover goal D! Early goal test triggers; return optimal path: A → B → D
                  (cost = 2).
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 6. The Math (Collapsible) */}
      <section className="mb-10">
        <div className="flex items-center justify-between border-b border-studio-200 pb-3 dark:border-studio-800">
          <h2 className="font-display text-2xl font-bold text-studio-900 dark:text-studio-100">
            Formal Mathematical Foundations
          </h2>
          <Toggle label="Show the math" checked={showMath} onChange={setShowMath} />
        </div>

        {showMath && (
          <div className="mt-4 space-y-4 rounded-xl bg-studio-100/50 p-6 dark:bg-studio-900/40 border border-studio-200 dark:border-studio-800 text-sm leading-relaxed">
            <div>
              <h3 className="font-bold text-studio-900 dark:text-studio-100 mb-1">
                State Space Tuple
              </h3>
              <p className="text-studio-700 dark:text-studio-300">
                A search problem is formally defined by the 5-tuple:
              </p>
              <div className="my-2 p-3 bg-white dark:bg-studio-950 rounded-lg font-mono text-center text-unit-2 font-bold">
                (S, s₀, ACTIONS(s), RESULT(s, a), GOAL-TEST(s), c(s, a, s'))
              </div>
            </div>

            <div>
              <h3 className="font-bold text-studio-900 dark:text-studio-100 mb-1">
                Time Complexity: O(b^d)
              </h3>
              <p className="text-studio-700 dark:text-studio-300">
                Let <GlossaryTerm term="branching factor" displayText="b" /> be the maximum
                branching factor and \(d\) be the depth of the shallowest goal. In the worst case,
                BFS generates:
              </p>
              <div className="my-2 p-3 bg-white dark:bg-studio-950 rounded-lg font-mono text-center">
                1 + b + b² + b³ + ··· + b^d = O(b^d)
              </div>
            </div>

            <div>
              <h3 className="font-bold text-studio-900 dark:text-studio-100 mb-1">
                Space Complexity: O(b^d)
              </h3>
              <p className="text-studio-700 dark:text-studio-300">
                Every node generated is kept in memory (either in the FIFO frontier or the explored
                set). The queue alone holds \(O(b^d)\) leaf nodes at depth \(d\).{' '}
                <em>Memory, not time, is the true bottleneck of BFS!</em>
              </p>
            </div>
          </div>
        )}
      </section>

      {/* 7. Pseudocode */}
      <section className="mb-10">
        <h2 className="font-display text-2xl font-bold text-studio-900 dark:text-studio-100 mb-4">
          Algorithm Pseudocode
        </h2>
        <div className="rounded-xl bg-studio-950 p-4 font-mono text-xs text-studio-200 overflow-x-auto border border-studio-800">
          <pre>{`function BREADTH-FIRST-SEARCH(problem) returns a solution path, or failure:
  node = problem.INITIAL-STATE
  if problem.IS-GOAL(node) return SOLUTION(node)

  frontier = FIFOQueue([node])        # First-In, First-Out queue
  reached = {node}                    # Explored / closed set

  while not frontier.IS-EMPTY():
    node = frontier.POP()             # Removes earliest node added
    for each child in EXPAND(problem, node):
      if problem.IS-GOAL(child):      # Early goal testing
        return SOLUTION(child)
      if child not in reached:
        reached.ADD(child)
        frontier.PUSH(child)

  return FAILURE`}</pre>
        </div>
      </section>

      {/* 8. Code Lab (Python) */}
      <section className="mb-10">
        <h2 className="font-display text-2xl font-bold text-studio-900 dark:text-studio-100 mb-4">
          Code It in Python
        </h2>
        <p className="text-sm text-studio-700 dark:text-studio-300 mb-3">
          Here is the clean, standard Python implementation using <code>collections.deque</code> for
          \(O(1)\) queue pops:
        </p>

        <div className="rounded-xl bg-studio-950 p-4 font-mono text-xs text-studio-200 overflow-x-auto border border-studio-800">
          <pre>{`from collections import deque

def bfs(graph, start, goal):
    if start == goal:
        return [start]

    frontier = deque([start])
    parent = {start: None}

    while frontier:
        current = frontier.popleft()  # O(1) FIFO pop

        for neighbor in graph.get(current, []):
            if neighbor not in parent:
                parent[neighbor] = current
                if neighbor == goal:
                    # Reconstruct path
                    path = [goal]
                    while path[-1] != start:
                        path.append(parent[path[-1]])
                    return path[::-1]
                frontier.append(neighbor)

    return None  # No path exists`}</pre>
        </div>
      </section>

      {/* 9. Make It Fail */}
      <section className="mb-10">
        <div className="rounded-2xl border border-rose-300 bg-rose-50/60 p-6 dark:border-rose-900 dark:bg-rose-950/20">
          <h2 className="font-display text-xl font-bold text-rose-900 dark:text-rose-200 flex items-center gap-2 mb-2">
            <AlertOctagon className="h-5 w-5 text-rose-600" />
            Make It Fail: The Exponential Memory Explosion
          </h2>
          <p className="text-sm text-studio-700 dark:text-studio-300 leading-relaxed mb-3">
            What happens if the robot's destination is behind an unreachable wall, or if the
            branching factor is \(b = 10\) at depth \(d = 12\)?
          </p>
          <p className="text-sm text-studio-700 dark:text-studio-300 leading-relaxed">
            At \(b = 10\) and depth \(d = 12\), BFS requires storing over \(10^{12}\) nodes —
            exceeding <strong>1 Terabyte of RAM</strong>. In modern computers, BFS will crash with
            an <code>OutOfMemoryError</code> long before the CPU finishes running. This is why AI
            researchers invented heuristic search like A*.
          </p>
        </div>
      </section>

      {/* 10. Strengths, Limitations & When NOT to use (CO4) */}
      <section className="mb-10">
        <h2 className="font-display text-2xl font-bold text-studio-900 dark:text-studio-100 mb-4">
          Strengths, Limitations & When NOT to Use (CO4)
        </h2>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-800 dark:bg-emerald-950/20">
            <h3 className="font-bold text-sm text-emerald-900 dark:text-emerald-300 mb-1">
              Strengths
            </h3>
            <ul className="text-xs text-studio-700 dark:text-studio-300 space-y-1 list-disc pl-4">
              <li>
                Guaranteed <GlossaryTerm term="completeness" displayText="Complete" /> on finite
                graphs.
              </li>
              <li>
                Guaranteed <GlossaryTerm term="optimality" displayText="Optimal" /> for unweighted
                step count.
              </li>
              <li>Never gets trapped in infinite depth loops.</li>
            </ul>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-800 dark:bg-amber-950/20">
            <h3 className="font-bold text-sm text-amber-900 dark:text-amber-300 mb-1">
              Limitations
            </h3>
            <ul className="text-xs text-studio-700 dark:text-studio-300 space-y-1 list-disc pl-4">
              <li>Severe exponential space complexity \(O(b^d)\).</li>
              <li>Uninformed: wanders blindly in all directions.</li>
              <li>Cannot account for edge weights or terrain friction.</li>
            </ul>
          </div>

          <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4 dark:border-rose-800 dark:bg-rose-950/20">
            <h3 className="font-bold text-sm text-rose-900 dark:text-rose-300 mb-1">
              When NOT to Use
            </h3>
            <ul className="text-xs text-studio-700 dark:text-studio-300 space-y-1 list-disc pl-4">
              <li>When edges have varying costs (use Dijkstra / UCS).</li>
              <li>When goal depth is very large (use IDDFS or A*).</li>
              <li>When memory is strictly constrained (e.g. microcontrollers).</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 11. Common Misconceptions */}
      <section className="mb-10">
        <h2 className="font-display text-2xl font-bold text-studio-900 dark:text-studio-100 mb-4">
          Common Misconceptions
        </h2>

        <div className="space-y-3">
          <Callout
            type="misconception"
            title="Misconception 1: 'BFS is always optimal on any graph'"
          >
            BFS is <strong>only optimal when all step costs are identical (unweighted)</strong>. If
            taking highway route A costs 10 liters of fuel over 1 hop, but taking city streets B→C
            costs 2 liters over 2 hops, BFS will wrongly choose the 1-hop path because it counts
            hops, not fuel!
          </Callout>

          <Callout
            type="misconception"
            title="Misconception 2: 'BFS runs out of time before it runs out of memory'"
          >
            The opposite is true. In practice,{' '}
            <strong>BFS runs out of memory almost immediately</strong>. At depth 10 with branching
            factor 10, the queue holds gigabytes of pointers while the CPU has barely broken a
            sweat.
          </Callout>
        </div>
      </section>

      {/* 12. Check Yourself Quiz */}
      <section className="mb-10">
        <Quiz conceptId="u2-bfs" items={quizItems} unitAccent={2} />
      </section>

      {/* 13. Exam & Viva Corner */}
      <section className="mb-10">
        <h2 className="font-display text-2xl font-bold text-studio-900 dark:text-studio-100 mb-4">
          Exam & Viva Corner
        </h2>

        <div className="space-y-4">
          <div className="rounded-xl border border-studio-200 bg-white p-4 dark:border-studio-800 dark:bg-studio-900">
            <p className="font-bold text-sm text-studio-900 dark:text-studio-100 mb-1">
              Q1: Differentiate between BFS and DFS in terms of completeness, optimality, and
              time/space complexity. [5 Marks]
            </p>
            <p className="text-xs text-studio-600 dark:text-studio-400 leading-relaxed">
              <strong>Model Outline:</strong> BFS is Complete and Optimal (unweighted), with Time
              \(O(b^d)\) and Space \(O(b^d)\). DFS is Not Complete (on infinite spaces/cycles) and
              Not Optimal, but has linear space \(O(b \cdot m)\) where \(m\) is max depth. Mention
              that BFS uses a FIFO queue while DFS uses a LIFO stack.
            </p>
          </div>

          <div className="rounded-xl border border-studio-200 bg-white p-4 dark:border-studio-800 dark:bg-studio-900">
            <p className="font-bold text-sm text-studio-900 dark:text-studio-100 mb-1">
              Viva Voce: Why is memory the fatal flaw of BFS, and how does Iterative Deepening
              (IDDFS) solve it?
            </p>
            <p className="text-xs text-studio-600 dark:text-studio-400 leading-relaxed">
              <strong>Quick Answer:</strong> BFS stores the entire exponential frontier in RAM.
              IDDFS repeatedly runs depth-limited DFS with increasing limits, achieving the
              completeness and optimality of BFS while maintaining the tiny \(O(b \cdot d)\) memory
              footprint of DFS.
            </p>
          </div>
        </div>
      </section>

      {/* 14. Summary Card */}
      <footer className="rounded-2xl border border-studio-200 bg-studio-100 p-6 dark:border-studio-800 dark:bg-studio-900">
        <h3 className="font-display text-lg font-bold text-studio-900 dark:text-studio-50 mb-3">
          Summary & Key Takeaways
        </h3>
        <ul className="text-xs text-studio-700 dark:text-studio-300 space-y-1.5 list-disc pl-4 mb-6">
          <li>BFS systematically expands nodes level-by-level using a FIFO queue.</li>
          <li>Guarantees the shortest path in terms of steps on unweighted graphs.</li>
          <li>Time complexity is \(O(b^d)\); space complexity is \(O(b^d)\).</li>
          <li>Memory exhaustion is the primary limitation for deep search trees.</li>
          <li>
            Early goal testing checks children upon generation, saving an entire factor of \(b\)
            expansions.
          </li>
        </ul>

        <div className="flex items-center justify-between border-t border-studio-200/80 pt-4 dark:border-studio-800">
          <Link
            to="/learn/unit-2"
            className="text-xs font-semibold text-studio-500 hover:text-studio-700 dark:hover:text-studio-300"
          >
            ← Unit 2 Overview
          </Link>
          <Link
            to="/learn/unit-2/dfs"
            className="inline-flex items-center text-xs font-bold text-unit-2 hover:underline"
          >
            Next: Depth-First Search (DFS) →
          </Link>
        </div>
      </footer>
    </article>
  );
}
