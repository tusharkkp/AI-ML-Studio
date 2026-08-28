import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Callout } from '@/components/ui/Callout';
import { Quiz } from '@/features/quiz/Quiz';
import { UninformedSearchLab } from '@/labs/uninformed-search/UninformedSearchLab';
import { ArrowLeft } from 'lucide-react';

export function UninformedSearchPage() {
  const [showMath, setShowMath] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<string | null>(null);

  const quizItems = [
    {
      id: 'uninformed-q1',
      question:
        'Why is Iterative Deepening Search (IDDFS) often preferred over Breadth-First Search (BFS) in large search spaces with uniform step costs?',
      options: [
        {
          id: 'A',
          text: 'It guarantees optimality and completeness like BFS, but requires only O(bd) linear memory instead of O(b^d) exponential memory.',
          isCorrect: true,
          explanation:
            'IDDFS solves the catastrophic memory limitation of BFS while retaining its optimality and completeness. Its space complexity is O(bd) like DFS, and the computational overhead of revisiting shallow levels is only an extra constant factor b/(b-1).',
        },
        {
          id: 'B',
          text: 'It visits fewer total nodes than BFS.',
          isCorrect: false,
          explanation:
            'IDDFS actually visits slightly more nodes due to repeating levels 0 through d-1.',
        },
        {
          id: 'C',
          text: 'It does not require a goal test function.',
          isCorrect: false,
          explanation: 'All search algorithms require a formal GoalTest.',
        },
      ],
    },
    {
      id: 'uninformed-q2',
      question:
        'What is the theoretical space and time complexity advantage of Bidirectional Search over standard unidirectional BFS?',
      options: [
        {
          id: 'A',
          text: 'Both time and space drop from O(b^d) to O(b^(d/2)), effectively halving the effective search depth.',
          isCorrect: true,
          explanation:
            'By growing two search spheres of radius d/2 from start and goal simultaneously, b^(d/2) + b^(d/2) is vastly smaller than b^d (e.g. for b=10, d=8: 2 × 10⁴ = 20,000 nodes vs 100,000,000 nodes!).',
        },
        {
          id: 'B',
          text: 'It eliminates the need to store any frontier nodes.',
          isCorrect: false,
          explanation: 'At least one frontier must be held in memory to detect collision.',
        },
        {
          id: 'C',
          text: 'It can only run on directed acyclic graphs.',
          isCorrect: false,
          explanation: 'Bidirectional search runs on any graph where predecessors can be computed.',
        },
      ],
    },
    {
      id: 'uninformed-q3',
      question:
        'Under what condition will standard Depth-First Search (DFS) fail to be complete (fail to find a solution even when one exists)?',
      options: [
        {
          id: 'A',
          text: 'When the state space contains infinite depth paths or cycles and cycle checking is omitted.',
          isCorrect: true,
          explanation:
            'DFS explores infinitely down a leftward unpruned branch or cycle, never backtracking to discover a shallow goal waiting on an alternate branch.',
        },
        {
          id: 'B',
          text: 'When all step costs are equal to 1.',
          isCorrect: false,
          explanation: 'Step costs do not affect completeness in finite graphs.',
        },
        {
          id: 'C',
          text: 'When the branching factor b is less than 2.',
          isCorrect: false,
          explanation: 'Linear chains with b=1 are trivial for DFS.',
        },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:px-12 space-y-12">
      {/* 1. Header & Navigation */}
      <header className="space-y-4">
        <Link
          to="/learn/unit-2"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-500 hover:text-brand transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Back to Unit 2 Overview
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" size="sm">
            Unit 2 · Lecture Topic 2.2
          </Badge>
          <Badge variant="outline" size="sm">
            CO1 (L3 Apply)
          </Badge>
          <Badge variant="outline" size="sm">
            CO4 (L4 Analyze)
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-foreground font-display">
          Uninformed Search Strategies: DFS, DLS, IDDFS &amp; Bidirectional
        </h1>
        <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl leading-relaxed">
          When an algorithm knows nothing about how close a state is to the goal, how does it
          systematically explore? Compare stacks, queues, depth limits, and meeting-in-the-middle
          frontiers.
        </p>
      </header>

      {/* 2. Hook & The Scenario */}
      <section className="space-y-4">
        <h2 className="text-xs uppercase font-mono tracking-wider text-neutral-500">
          The Memory Catastrophe
        </h2>
        <Card className="p-6 border-card-edge bg-card-fill backdrop-blur-sm">
          <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
            In Phase 1, we proved Breadth-First Search (BFS) is complete and optimal. But in a graph
            with branching factor b = 10 at depth d = 12, BFS requires storing 10¹² nodes in RAM:
            over 1 Terabyte! Your computer crashes with OutOfMemoryError. Can we achieve the memory
            efficiency of DFS (storing only a few kilobytes) without losing BFS's guarantee of
            finding the shortest path?
          </p>
        </Card>
      </section>

      {/* 3. Intuition: LIFO vs FIFO vs Depth Limits */}
      <section className="space-y-4">
        <h2 className="text-2xl font-medium sm:text-[30px] text-foreground font-display">
          Intuition: Four Strategies for the Blind Searcher
        </h2>
        <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
          Uninformed algorithms operate without a heuristic hint. The differences arise purely from
          their frontier management data structures:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl border border-card-edge bg-card-fill">
            <span className="text-brand font-bold block mb-1">1. DFS (Stack LIFO)</span>
            <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
              Dives as deep as possible along each branch before backtracking. Memory is linear
              O(bm), but vulnerable to infinite loops and suboptimal paths.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-card-edge bg-card-fill">
            <span className="text-brand font-bold block mb-1">2. DLS (Depth Limit L)</span>
            <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
              Places an artificial ceiling on search depth. Prevents infinite descents, but fails if
              the goal lies at depth d &gt; L (returns cutoff).
            </p>
          </div>
          <div className="p-4 rounded-xl border border-card-edge bg-card-fill">
            <span className="text-brand font-bold block mb-1">3. IDDFS (Iterative Loop)</span>
            <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
              Repeatedly runs DLS for limits L = 0, 1, 2, ... d. Combines BFS optimality with DFS
              linear memory O(bd). The champion of uninformed search!
            </p>
          </div>
          <div className="p-4 rounded-xl border border-card-edge bg-card-fill">
            <span className="text-brand font-bold block mb-1">4. Bidirectional</span>
            <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
              Runs two simultaneous frontiers from start and goal until they collide in the center.
              Cuts effective search depth in half: O(2 · b^(d/2)).
            </p>
          </div>
        </div>
      </section>

      {/* 4. Predict Then Reveal */}
      <section className="space-y-4">
        <h2 className="text-xs uppercase font-mono tracking-wider text-neutral-500">
          Predict Then Reveal
        </h2>
        <Card className="p-6 border-card-edge bg-card-fill backdrop-blur-sm space-y-4">
          <h3 className="font-montserrat font-semibold text-foreground text-sm">
            Prediction Challenge: Does IDDFS waste catastrophic time regenerating the upper tree
            levels?
          </h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            When IDDFS increases its depth limit from 0 to d, it re-generates the root and upper
            levels multiple times. Does this overhead make IDDFS vastly slower than BFS?
          </p>

          <div className="flex flex-wrap gap-2">
            {[
              {
                id: 'yes',
                label: 'Yes: Regenerating upper levels wastes over 90% of execution time.',
              },
              {
                id: 'no',
                label:
                  'No: In an exponential tree, the bottom level dominates all upper levels combined.',
              },
              { id: 'equal', label: 'It visits exactly the same number of nodes as BFS.' },
            ].map((opt) => (
              <Button
                key={opt.id}
                size="sm"
                variant={prediction === opt.id ? 'primary' : 'outline'}
                onClick={() => setPrediction(opt.id)}
              >
                {opt.label}
              </Button>
            ))}
          </div>

          {prediction && (
            <div className="p-4 rounded-xl border border-card-edge bg-neutral-900/40 text-xs">
              {prediction === 'no' ? (
                <p className="text-emerald-400 font-semibold">
                  ✓ Exactly correct! In an exponential tree with branching factor b = 10, the bottom
                  level d contains 90% of all nodes. The mathematical ratio of total nodes generated
                  by IDDFS vs BFS is b / (b - 1) = 10 / 9 ≈ 1.11: only 11% overhead!
                </p>
              ) : (
                <p className="text-rose-400 font-semibold">
                  ✗ Misconception: Because node counts explode exponentially, the vast majority of
                  nodes reside at the deepest tier. The upper level regenerations contribute only
                  negligible asymptotic overhead!
                </p>
              )}
            </div>
          )}
        </Card>
      </section>

      {/* 5. Interactive Simulation Lab */}
      <section className="space-y-4">
        <h2 className="text-2xl font-medium sm:text-[30px] text-foreground font-display">
          Interactive Uninformed Search Laboratory
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Run comparative races between DFS, DLS, IDDFS, and Bidirectional Search on branching trees
          and cyclic graphs:
        </p>
        <UninformedSearchLab />
      </section>

      {/* 6. Step-by-Step on Paper: The Four Complexity Metrics */}
      <section className="space-y-4">
        <h2 className="text-2xl font-medium sm:text-[30px] text-foreground font-display">
          Step-by-Step Comparison: The Master Complexity Matrix
        </h2>
        <div className="overflow-x-auto rounded-xl border border-card-edge bg-card-fill">
          <table className="w-full text-xs font-mono text-left">
            <thead className="border-b border-card-edge bg-neutral-900/60 text-neutral-400 uppercase text-[10px]">
              <tr>
                <th className="p-3 font-sans">Criterion</th>
                <th className="p-3">BFS (Queue)</th>
                <th className="p-3">DFS (Stack)</th>
                <th className="p-3">DLS (Limit L)</th>
                <th className="p-3 font-semibold text-brand">IDDFS (Optimal)</th>
                <th className="p-3">Bidirectional</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-edge">
              <tr>
                <td className="p-3 font-sans font-semibold text-foreground">Time Complexity</td>
                <td className="p-3">O(b^d)</td>
                <td className="p-3">O(b^m)</td>
                <td className="p-3">O(b^L)</td>
                <td className="p-3 font-bold text-brand">O(b^d)</td>
                <td className="p-3">O(b^(d/2))</td>
              </tr>
              <tr>
                <td className="p-3 font-sans font-semibold text-foreground">Space Complexity</td>
                <td className="p-3 text-rose-400 font-bold">O(b^d) Exponential!</td>
                <td className="p-3 text-emerald-400">O(bm) Linear</td>
                <td className="p-3 text-emerald-400">O(bL) Linear</td>
                <td className="p-3 text-emerald-400 font-bold">O(bd) Linear</td>
                <td className="p-3">O(b^(d/2))</td>
              </tr>
              <tr>
                <td className="p-3 font-sans font-semibold text-foreground">Complete?</td>
                <td className="p-3 text-emerald-400">Yes</td>
                <td className="p-3 text-rose-400">No (infinite cycles)</td>
                <td className="p-3">No (if L &lt; d)</td>
                <td className="p-3 text-emerald-400 font-bold">Yes</td>
                <td className="p-3 text-emerald-400">Yes</td>
              </tr>
              <tr>
                <td className="p-3 font-sans font-semibold text-foreground">Optimal?</td>
                <td className="p-3 text-emerald-400">Yes (uniform costs)</td>
                <td className="p-3 text-rose-400">No</td>
                <td className="p-3 text-rose-400">No</td>
                <td className="p-3 text-emerald-400 font-bold">Yes (uniform costs)</td>
                <td className="p-3 text-emerald-400">Yes (uniform costs)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 7. Formal Mathematical Proof of IDDFS Overhead */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-card-edge pb-2">
          <h2 className="text-2xl font-medium sm:text-[30px] text-foreground font-display">
            Formal Mathematical Foundations
          </h2>
          <Button size="sm" variant="outline" onClick={() => setShowMath(!showMath)}>
            {showMath ? 'Hide Formal Math' : 'Show Formal Math'}
          </Button>
        </div>

        {showMath && (
          <Card className="p-5 space-y-4 border-card-edge bg-card-fill">
            <h4 className="font-montserrat font-semibold text-foreground text-sm">
              Proof: Asymptotic Node Generation in IDDFS (Korf, 1985)
            </h4>
            <p className="text-xs text-neutral-300 leading-relaxed font-sans">
              In IDDFS, nodes at level 1 are generated d times, level 2 are generated d-1 times,
              down to level d which is generated exactly once:
            </p>
            <div className="p-3 rounded bg-neutral-900 border border-card-edge font-mono text-xs text-center">
              N_IDDFS = (d)·b¹ + (d-1)·b² + (d-2)·b³ + ... + (1)·b^d
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed font-sans">
              By comparison, standard BFS generates:
            </p>
            <div className="p-3 rounded bg-neutral-900 border border-card-edge font-mono text-xs text-center">
              N_BFS = b¹ + b² + ... + b^d
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed font-sans">
              Factoring the power series yields the ratio:
            </p>
            <div className="p-3 rounded bg-neutral-900 border border-card-edge font-mono text-xs text-center">
              N_IDDFS / N_BFS ≈ b / (b - 1)
            </div>
            <p className="text-xs text-neutral-400 font-sans">
              For b = 10, the ratio is 10/9 ≈ 1.11. IDDFS pays an asymptotic time penalty of only
              11% to gain the monumental benefit of linear O(bd) memory!
            </p>
          </Card>
        )}
      </section>

      {/* 8. Python Reference Code */}
      <section className="space-y-4">
        <h2 className="text-2xl font-medium sm:text-[30px] text-foreground font-display">
          Code It in Python: IDDFS Implementation
        </h2>
        <Card className="p-4 bg-neutral-950 border-card-edge text-neutral-200 font-mono text-xs overflow-x-auto">
          <pre>{`def dls(graph, current, goal, limit, path):
    path.append(current)
    if current == goal:
        return path
    if limit <= 0:
        path.pop()
        return "CUTOFF"
    
    cutoff_occurred = False
    for neighbor in graph.get(current, []):
        if neighbor not in path:
            result = dls(graph, neighbor, goal, limit - 1, path)
            if result == "CUTOFF":
                cutoff_occurred = True
            elif result is not None:
                return result
    path.pop()
    return "CUTOFF" if cutoff_occurred else None

def iddfs(graph, start, goal, max_depth=50):
    for depth in range(max_depth):
        path = []
        result = dls(graph, start, goal, depth, path)
        if result != "CUTOFF" and result is not None:
            return result
    return None`}</pre>
        </Card>
      </section>

      {/* 9. Make It Fail */}
      <section className="space-y-4">
        <h2 className="text-2xl font-medium sm:text-[30px] text-foreground font-display">
          Make It Fail
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="p-4 border-card-edge bg-card-fill space-y-2">
            <h4 className="font-montserrat font-semibold text-rose-400 text-sm">
              DFS Infinite Loop in Cyclic Graph
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              If an edge connects node A to B and B back to A, naive DFS pushes A onto the stack,
              then B, then A, descending in an endless ping-pong cycle until the Python stack blows
              with a RecursionError.
            </p>
          </Card>
          <Card className="p-4 border-card-edge bg-card-fill space-y-2">
            <h4 className="font-montserrat font-semibold text-amber-400 text-sm">
              DLS Premature Cutoff Trap
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              If the engineer guesses depth limit L = 3 for a graph where the goal exists at depth d
              = 4, DLS returns failure / cutoff without finding the path, leaving the system
              stranded despite a valid path existing.
            </p>
          </Card>
        </div>
      </section>

      {/* 10. Strengths, Limitations & When NOT to Use */}
      <section className="space-y-4">
        <h2 className="text-2xl font-medium sm:text-[30px] text-foreground font-display">
          Strengths, Limitations &amp; When NOT to Use
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <Card className="p-4 border-card-edge bg-card-fill space-y-2">
            <h4 className="font-montserrat font-semibold text-emerald-400 text-sm">
              Strengths (CO4 Analysis)
            </h4>
            <ul className="text-neutral-400 space-y-1 list-disc pl-4">
              <li>
                IDDFS is the preferred default method when search space is large and depth is
                unknown.
              </li>
              <li>
                Guarantees finding shortest path in unweighted graphs with strictly linear O(bd)
                memory.
              </li>
              <li>
                Bidirectional search provides quadratic speedup when goal state is uniquely known.
              </li>
            </ul>
          </Card>
          <Card className="p-4 border-card-edge bg-card-fill space-y-2">
            <h4 className="font-montserrat font-semibold text-rose-400 text-sm">
              Limitations &amp; When NOT to Use
            </h4>
            <ul className="text-neutral-400 space-y-1 list-disc pl-4">
              <li>
                Cannot find the cheapest cost path when step costs differ (requires Dijkstra / UCS).
              </li>
              <li>
                Bidirectional search fails when goal is an abstract set (e.g. checkmate in chess).
              </li>
              <li>
                Completely blind: explores irrelevant nodes that informed heuristic searches ignore.
              </li>
            </ul>
          </Card>
        </div>
      </section>

      {/* 11. Common Misconceptions */}
      <section className="space-y-4">
        <h2 className="text-2xl font-medium sm:text-[30px] text-foreground font-display">
          Common Misconceptions
        </h2>
        <div className="space-y-3">
          <Callout type="warning" title="Misconception: DFS is always faster than BFS">
            <p className="text-xs leading-relaxed">
              DFS is only faster if you get lucky and the goal happens to sit down the first branch
              explored. If the goal sits down the last branch, DFS explores the entire tree (O(b^m))
              before finding it.
            </p>
          </Callout>
          <Callout
            type="note"
            title="Misconception: IDDFS re-evaluates all previous nodes exponentially"
          >
            <p className="text-xs leading-relaxed">
              While previous nodes are regenerated, the total node count is dominated by the deepest
              tier. The overhead is asymptotically negligible: only b / (b - 1).
            </p>
          </Callout>
        </div>
      </section>

      {/* 12. Check Yourself Quiz */}
      <section className="space-y-4">
        <Quiz conceptId="u2-uninformed-search" items={quizItems} unitAccent={2} />
      </section>

      {/* 13. Exam & Viva Corner */}
      <section className="space-y-4">
        <h2 className="text-2xl font-medium sm:text-[30px] text-foreground font-display">
          Exam &amp; Viva Corner
        </h2>
        <Card className="p-6 border-card-edge bg-card-fill space-y-4">
          <div className="space-y-2">
            <h4 className="font-montserrat font-semibold text-foreground text-sm">
              Q: Explain why IDDFS is both complete and optimal under uniform step costs. (SPPU /
              NEP 6 Marks)
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              <strong>Answer:</strong> Completeness: Because the depth limit L increases
              systematically by 1 on each iteration (0, 1, 2, ...), no finite branch can be skipped.
              If a solution exists at depth d, IDDFS will explore level d and terminate. Optimality:
              Because depth limit increments by 1, the first solution discovered must be at the
              shallowest possible depth d. Since all step costs are uniform, shallowest depth
              corresponds to minimum path cost.
            </p>
          </div>
        </Card>
      </section>

      {/* 14. Summary & Key Takeaways */}
      <section className="space-y-4">
        <h2 className="text-2xl font-medium sm:text-[30px] text-foreground font-display">
          Summary &amp; Key Takeaways
        </h2>
        <Card className="p-6 border-card-edge bg-card-fill space-y-3">
          <ul className="text-xs text-neutral-400 space-y-2 list-disc pl-5">
            <li>
              BFS guarantees optimal solutions but fails catastrophically due to exponential O(b^d)
              memory.
            </li>
            <li>
              DFS uses minimal linear O(bm) memory but is incomplete on infinite graphs and
              suboptimal.
            </li>
            <li>
              IDDFS marries the best of both worlds: complete and optimal with linear O(bd) memory.
            </li>
            <li>
              Bidirectional search meets in the middle, cutting time and space from O(b^d) to
              O(b^(d/2)).
            </li>
          </ul>
        </Card>
      </section>
    </div>
  );
}
