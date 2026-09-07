import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Callout } from '@/components/ui/Callout';
import { Quiz } from '@/features/quiz/Quiz';
import { CspLab } from '@/labs/csp/CspLab';
import { ArrowLeft } from 'lucide-react';

export function CspPage() {
  const [showMath, setShowMath] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<string | null>(null);

  const quizItems = [
    {
      id: 'csp-q1',
      question:
        'What is the worst-case time complexity of the AC-3 arc-consistency algorithm on a CSP with c binary constraints and maximum domain size d?',
      options: [
        {
          id: 'A',
          text: 'O(c · d³)',
          isCorrect: true,
          explanation:
            'A binary CSP has c constraints, yielding 2c directed arcs. Each arc (X, Y) can be inserted into the queue at most d times (since domain of X has size at most d and can only shrink). Each revision of arc (X, Y) takes O(d²) checks. Therefore, total time is O(c · d · d²) = O(c · d³).',
        },
        {
          id: 'B',
          text: 'O(d^c)',
          isCorrect: false,
          explanation:
            'O(d^c) represents full exponential search, whereas AC-3 runs in polynomial time.',
        },
        {
          id: 'C',
          text: 'O(c + d)',
          isCorrect: false,
          explanation: 'Linear time is insufficient to propagate pairwise constraint interactions.',
        },
      ],
    },
    {
      id: 'csp-q2',
      question:
        'Why does the Minimum Remaining Values (MRV) heuristic choose the variable with the smallest current domain?',
      options: [
        {
          id: 'A',
          text: 'It is a fail-first heuristic: by choosing the most constrained variable, if an assignment is doomed to fail, it fails immediately near the top of the search tree, pruning massive subtrees.',
          isCorrect: true,
          explanation:
            'MRV minimizes the branching factor at the current decision point. If a variable has only 1 legal value left, choosing it immediately forces the required value; if it has 0, it detects failure immediately without wasting search on other variables.',
        },
        {
          id: 'B',
          text: 'It maximizes the number of remaining options for downstream variables.',
          isCorrect: false,
          explanation:
            'That is the purpose of Least Constraining Value (LCV), which applies to value ordering rather than variable selection.',
        },
        {
          id: 'C',
          text: 'It eliminates the need to run backtracking search altogether.',
          isCorrect: false,
          explanation:
            'MRV guides variable ordering within backtracking search; it does not replace it.',
        },
      ],
    },
    {
      id: 'csp-q3',
      question:
        'In the Australia map coloring problem with 3 colors (Red, Green, Blue), why does assigning South Australia (SA) first drastically accelerate the search?',
      options: [
        {
          id: 'A',
          text: 'SA is the variable of highest degree: it shares borders with 5 other regions (WA, NT, Q, NSW, V), so constraint propagation immediately restricts domains across the entire continent.',
          isCorrect: true,
          explanation:
            'The Degree Heuristic selects the variable involved in the largest number of constraints with unassigned variables. Because SA borders almost all regions, coloring SA immediately reduces neighboring domains, triggering rapid forward checking.',
        },
        {
          id: 'B',
          text: 'SA has the largest geographic area on the map.',
          isCorrect: false,
          explanation: 'Geographic area has no mathematical bearing on discrete graph coloring.',
        },
        {
          id: 'C',
          text: 'SA is mathematically disconnected from Tasmania.',
          isCorrect: false,
          explanation:
            'Tasmania is disconnected from everything, which makes it trivial, not a constraint driver.',
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
        <span className="text-xs font-mono text-neutral-300">Constraint Satisfaction Problems</span>
      </div>

      {/* Hero Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">Unit 2: AI Search</Badge>
          <Badge variant="default">1.4 Lecture Hours</Badge>
          <Badge variant="unit">CO1, CO3, CO4</Badge>
        </div>
        <h1 className="font-montserrat text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Constraint Satisfaction Problems: AC-3 & Backtracking
        </h1>
        <p className="text-base text-neutral-300 leading-relaxed max-w-3xl">
          By factoring states into{' '}
          <span className="font-montserrat text-highlight font-semibold">
            variables with discrete domains and explicit constraints
          </span>
          , general-purpose constraint propagation prunes exponential search spaces without
          domain-specific heuristics.
        </p>
      </div>

      {/* Section 1: Intuition & The "Aha!" Moment */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-foreground">
          1. Intuition: Sudoku and The Ripple Effect
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed text-sm text-neutral-300">
          <div className="p-5 rounded-2xl border border-card-edge bg-card-fill/60 space-y-3">
            <h3 className="font-montserrat text-base font-semibold text-foreground">
              Blind Guessing vs Logical Elimination
            </h3>
            <p>
              When human beings solve a Sudoku puzzle, nobody writes down 9 in the top-left cell and
              blindly tries 10^80 combinations until finding a solution. Instead, you look at the
              row, column, and 3x3 box, crossing out impossible digits until only one candidate
              remains.
            </p>
            <p>
              In classical state-space search (like BFS or DFS), states are atomic black boxes with
              no internal structure. In a{' '}
              <span className="font-montserrat text-highlight font-semibold">
                Constraint Satisfaction Problem (CSP)
              </span>
              , states are transparent sets of variables with values. This structured representation
              allows algorithms to detect contradictions early.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-card-edge bg-card-fill/60 space-y-3">
            <h3 className="font-montserrat text-base font-semibold text-foreground">
              Inference as an Engine of Search
            </h3>
            <p>
              Every time you assign a value to one variable, a ripple effect cascades across all
              connected constraints. If variable A cannot equal variable B, assigning A = Red
              immediately removes Red from B domain.
            </p>
            <p>
              The AC-3 (Arc Consistency) algorithm automates this ripple effect. By iteratively
              checking pairwise arcs, it eliminates impossible domain values before search even
              begins, transforming exponential dead-ends into rapid linear assignments.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Interactive Lab */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-foreground">
          2. Interactive Lab: Backtracking & AC-3 Propagation Studio
        </h2>
        <p className="text-sm text-neutral-300 leading-relaxed">
          Step through the Australia Map Coloring problem and the 4-Queens puzzle. Watch remaining
          domain sizes shrink in real-time, toggle MRV variable selection, and observe AC-3 detect
          immediate domain wipeout on unsatisfiable graphs.
        </p>
        <CspLab />
      </section>

      {/* Section 3: Predict-Then-Reveal Challenge */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-foreground">
          3. Predict-Then-Reveal: The Central Hub
        </h2>
        <Card className="p-6 border-card-edge bg-card-fill">
          <p className="text-sm text-neutral-200 leading-relaxed mb-4">
            In Australia Map Coloring with 3 colors (Red, Green, Blue), which territory has the
            highest degree (most neighbors), and what happens when you assign it first?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <button
              onClick={() => setPrediction('sa')}
              className={`p-3 rounded-xl border text-xs text-left transition-colors ${
                prediction === 'sa'
                  ? 'border-brand bg-brand/10 text-foreground font-semibold'
                  : 'border-card-edge bg-card-fill/60 text-neutral-400 hover:text-foreground'
              }`}
            >
              <strong>A) South Australia (SA)</strong> has 5 neighbors; assigning SA immediately
              reduces the domains of WA, NT, Q, NSW, and V to only 2 colors each.
            </button>

            <button
              onClick={() => setPrediction('wa')}
              className={`p-3 rounded-xl border text-xs text-left transition-colors ${
                prediction === 'wa'
                  ? 'border-brand bg-brand/10 text-foreground font-semibold'
                  : 'border-card-edge bg-card-fill/60 text-neutral-400 hover:text-foreground'
              }`}
            >
              <strong>B) Western Australia (WA)</strong> has the most neighbors because it occupies
              the largest geographic area.
            </button>

            <button
              onClick={() => setPrediction('tasmania')}
              className={`p-3 rounded-xl border text-xs text-left transition-colors ${
                prediction === 'tasmania'
                  ? 'border-brand bg-brand/10 text-foreground font-semibold'
                  : 'border-card-edge bg-card-fill/60 text-neutral-400 hover:text-foreground'
              }`}
            >
              <strong>C) Tasmania (T)</strong> because it is isolated and requires the most
              constraints.
            </button>
          </div>

          {prediction && (
            <Callout
              type={prediction === 'sa' ? 'tip' : 'warning'}
              title={prediction === 'sa' ? 'Prediction Verified!' : 'Inspect the Adjacency Graph'}
            >
              {prediction === 'sa' ? (
                <p className="text-xs text-neutral-300">
                  Spot on! South Australia (SA) shares borders with WA, NT, Q, NSW, and V (degree
                  5). Under the Degree Heuristic, selecting SA as the very first variable constrains
                  5 out of the 6 remaining continental regions simultaneously, making subsequent MRV
                  assignments trivial!
                </p>
              ) : (
                <p className="text-xs text-neutral-300">
                  Notice that Western Australia only borders NT and SA (degree 2), and Tasmania
                  borders nobody (degree 0). South Australia (SA) sits at the geographic and
                  topological crossroads, bordering 5 territories!
                </p>
              )}
            </Callout>
          )}
        </Card>
      </section>

      {/* Section 4: Step-by-Step on Paper */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-foreground">
          4. Step-by-Step on Paper: Tracing AC-3 on Australia Map
        </h2>
        <Card className="p-6 border-card-edge bg-card-fill space-y-4 text-sm text-neutral-300 leading-relaxed">
          <p>
            Suppose we assign <span className="font-mono text-rose-400">WA = Red</span> and{' '}
            <span className="font-mono text-emerald-400">NT = Green</span>. Let us trace how AC-3
            prunes the domain of South Australia (SA):
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono border border-card-edge text-left">
              <thead className="bg-neutral-900/80 text-neutral-300 border-b border-card-edge">
                <tr>
                  <th className="p-2.5">Step</th>
                  <th className="p-2.5">Arc Evaluated (X, Y)</th>
                  <th className="p-2.5">Domain of X Before</th>
                  <th className="p-2.5">Domain of Y</th>
                  <th className="p-2.5">Values Pruned from X</th>
                  <th className="p-2.5">Domain of X After</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-edge/50">
                <tr>
                  <td className="p-2.5 font-bold text-foreground">1</td>
                  <td className="p-2.5 text-brand font-bold">(SA, WA)</td>
                  <td className="p-2.5">&#123; Red, Green, Blue &#125;</td>
                  <td className="p-2.5">&#123; Red &#125;</td>
                  <td className="p-2.5 text-rose-400 font-bold">Red (conflicts with WA)</td>
                  <td className="p-2.5">&#123; Green, Blue &#125;</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-foreground">2</td>
                  <td className="p-2.5 text-brand font-bold">(SA, NT)</td>
                  <td className="p-2.5">&#123; Green, Blue &#125;</td>
                  <td className="p-2.5">&#123; Green &#125;</td>
                  <td className="p-2.5 text-emerald-400 font-bold">Green (conflicts with NT)</td>
                  <td className="p-2.5 text-blue-400 font-bold">&#123; Blue &#125; (Singleton!)</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-foreground">3</td>
                  <td className="p-2.5 text-brand font-bold">(Q, SA)</td>
                  <td className="p-2.5">&#123; Red, Green, Blue &#125;</td>
                  <td className="p-2.5">&#123; Blue &#125;</td>
                  <td className="p-2.5 text-blue-400 font-bold">Blue (conflicts with SA)</td>
                  <td className="p-2.5">&#123; Red, Green &#125;</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-xs text-neutral-400">
            Notice that after Step 2, South Australia domain shrank to a single value{' '}
            <span className="font-mono text-blue-400">&#123; Blue &#125;</span>. MRV will
            immediately select SA on the next iteration without guessing!
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
              Formal CSP Definition
            </h3>
            <p>
              A Constraint Satisfaction Problem is formally defined as a 3-tuple{' '}
              <span className="font-mono text-brand font-bold">⟨X, D, C⟩</span>:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-neutral-400">
              <li>
                <strong>X:</strong> a finite set of variables {'{X₁, X₂, ..., Xₙ}'}.
              </li>
              <li>
                <strong>D:</strong> a set of domains {'{D₁, D₂, ..., Dₙ}'}, where each Dᵢ is a set
                of permissible values for variable Xᵢ.
              </li>
              <li>
                <strong>C:</strong> a set of constraints {'{C₁, C₂, ..., Cₘ}'}, where each
                constraint Cᵢ consists of a scope of variables and a relation defining allowable
                value combinations.
              </li>
            </ul>
          </div>

          {showMath && (
            <div className="p-5 rounded-xl border border-brand/30 bg-card-fill space-y-4 text-xs font-mono">
              <h3 className="font-montserrat text-sm font-semibold text-foreground">
                Arc Consistency Definition & Complexity
              </h3>
              <p>
                A directed arc (Xᵢ, Xⱼ) is arc-consistent if for every value x ∈ Dᵢ, there exists
                some value y ∈ Dⱼ such that (x, y) satisfies all binary constraints between Xᵢ and
                Xⱼ.
              </p>
              <div className="pt-2">
                <h4 className="font-montserrat font-semibold text-foreground text-xs mb-1">
                  Complexity Proof of AC-3: O(c · d³)
                </h4>
                <p className="text-neutral-300">
                  {
                    'Let c be the number of binary constraints and d = max |Dᵢ|. The initial queue contains 2c directed arcs. When Dᵢ is revised, each revision tests at most d × d = d² pairs. An arc (Xₖ, Xᵢ) can be reinserted into the queue at most d times (since Dᵢ can only shrink at most d times before wipeout). Hence, total arc revisions across the entire algorithm is at most 2c · d. Each revision takes O(d²) work, yielding total worst-case time O(c · d³).'
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
          6. Algorithm Pseudocode: AC-3 & Backtracking
        </h2>
        <Card className="p-4 border-card-edge bg-[#0a0a0a] font-mono text-xs text-neutral-300 overflow-x-auto">
          <pre className="leading-relaxed">
            {`function AC3(csp):
    queue = all directed arcs (Xi, Xj) in csp
    
    while not queue.is_empty():
        (Xi, Xj) = queue.pop_first()
        if REVISE(csp, Xi, Xj):
            if length(domain[Xi]) == 0:
                return false // Domain wipeout: CSP is unsatisfiable
            for each Xk in NEIGHBORS(Xi) - {Xj}:
                queue.push((Xk, Xi))
                
    return true

function REVISE(csp, Xi, Xj):
    revised = false
    for each x in domain[Xi]:
        if no y in domain[Xj] satisfies constraint(x, y):
            delete x from domain[Xi]
            revised = true
    return revised`}
          </pre>
        </Card>
      </section>

      {/* Section 7: Code It in Python */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-foreground">
          7. Code It in Python: Backtracking Search with MRV
        </h2>
        <Card className="p-4 border-card-edge bg-[#0a0a0a] font-mono text-xs text-neutral-300 overflow-x-auto">
          <pre className="leading-relaxed">
            {`from typing import Dict, List, Optional, Any

def backtracking_search(
    variables: List[str],
    domains: Dict[str, List[Any]],
    constraints: List[tuple]
) -> Optional[Dict[str, Any]]:
    """CSP Backtracking with MRV variable selection and Forward Checking."""
    
    def is_consistent(var: str, val: Any, assignment: Dict[str, Any]) -> bool:
        for v1, v2, predicate in constraints:
            if v1 == var and v2 in assignment:
                if not predicate(val, assignment[v2]):
                    return False
            if v2 == var and v1 in assignment:
                if not predicate(assignment[v1], val):
                    return False
        return True

    def backtrack(assignment: Dict[str, Any], cur_domains: Dict[str, List[Any]]):
        if len(assignment) == len(variables):
            return assignment

        # MRV: Choose unassigned variable with smallest domain
        unassigned = [v for v in variables if v not in assignment]
        var = min(unassigned, key=lambda v: len(cur_domains[v]))

        for val in cur_domains[var]:
            if is_consistent(var, val, assignment):
                assignment[var] = val
                
                # Forward checking on neighbors
                new_domains = {v: list(cur_domains[v]) for v in variables}
                new_domains[var] = [val]
                valid = True
                
                for v1, v2, predicate in constraints:
                    nbr = v2 if v1 == var else (v1 if v2 == var else None)
                    if nbr and nbr not in assignment:
                        new_domains[nbr] = [
                            y for y in new_domains[nbr]
                            if predicate(val, y) if v1 == var else predicate(y, val)
                        ]
                        if not new_domains[nbr]:
                            valid = False
                            break

                if valid:
                    res = backtrack(assignment, new_domains)
                    if res:
                        return res

                del assignment[var]

        return None

    return backtrack({}, domains)`}
          </pre>
        </Card>
      </section>

      {/* Section 8: "Make It Fail" Laboratory */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-foreground">
          8. "Make It Fail" Laboratory: K₄ Complete Graph
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
          <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/20 space-y-2">
            <h3 className="font-montserrat text-sm font-semibold text-rose-300">
              Failure Mode 1: Domain Wipeout on Complete Graph K₄
            </h3>
            <p className="text-neutral-300">
              Select <span className="font-mono text-rose-400">K₄ 2-Color</span> in the simulator
              above. A complete graph on 4 vertices requires at least 4 colors. Restricting the
              domain to 2 colors causes AC-3 to cascade domain deletions until vertex D has domain ∅
              on step 3!
            </p>
          </div>

          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 space-y-2">
            <h3 className="font-montserrat text-sm font-semibold text-amber-300">
              Failure Mode 2: Chronological Backtracking Thrashing
            </h3>
            <p className="text-neutral-300">
              Without Forward Checking or AC-3, naive chronological backtracking tries every
              permutation in deeper subtrees even when a variable at depth 1 makes the entire puzzle
              unsolvable. This phenomenon is called{' '}
              <span className="font-montserrat text-highlight font-semibold">search thrashing</span>
              .
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
                  General-purpose
                </span>
                : domain-independent heuristics (MRV, Degree, LCV) work across map coloring, Sudoku,
                and circuit layout.
              </li>
              <li>Inference prunes exponential subtrees early.</li>
              <li>Detects global unsatisfiability before search begins.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-card-edge bg-card-fill/60 space-y-2">
            <h3 className="font-montserrat text-sm font-semibold text-rose-400">Limitations</h3>
            <ul className="list-disc pl-4 space-y-1.5 text-neutral-300">
              <li>
                <span className="font-montserrat text-highlight font-semibold">NP-Complete</span>:
                worst-case time complexity remains exponential O(d^n).
              </li>
              <li>Memory overhead of maintaining domain sets across recursion levels.</li>
              <li>High-arity constraints (e.g. AllDifferent) require specialized propagators.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-card-edge bg-card-fill/60 space-y-2">
            <h3 className="font-montserrat text-sm font-semibold text-amber-400">
              When NOT to Use
            </h3>
            <ul className="list-disc pl-4 space-y-1.5 text-neutral-300">
              <li>
                When the problem has continuous variables and linear constraints (use Linear
                Programming / Simplex instead).
              </li>
              <li>
                When optimal action paths through time are required (use A* or Reinforcement
                Learning).
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
              <em>
                "If AC-3 returns true, a valid solution is guaranteed to exist without search."
              </em>
            </p>
            <p className="text-neutral-400">
              <strong>Reality:</strong> False! AC-3 only guarantees pairwise consistency between
              pairs of variables. Higher-order conflicts across 3 or more variables can still render
              the problem unsatisfiable. Backtracking search is still required to discover or prove
              solutions.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-card-edge bg-card-fill/60 space-y-1">
            <span className="font-semibold text-rose-400 font-montserrat">Misconception 2:</span>
            <p className="text-neutral-300">
              <em>"MRV and LCV choose variables and values using the same criterion."</em>
            </p>
            <p className="text-neutral-400">
              <strong>Reality:</strong> They are philosophical opposites! MRV chooses the{' '}
              <span className="font-montserrat text-highlight font-semibold">
                most constrained variable
              </span>{' '}
              (fail-first principle: prune doomed branches early). LCV chooses the{' '}
              <span className="font-montserrat text-highlight font-semibold">
                least constraining value
              </span>{' '}
              (succeed-first principle: leave maximum flexibility for downstream variables).
            </p>
          </div>
        </div>
      </section>

      {/* Section 11: Check Yourself */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-foreground">
          11. Check Yourself: Micro-Quiz
        </h2>
        <Quiz conceptId="u2-csp" items={quizItems} />
      </section>

      {/* Section 12: Real-World Applications */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-foreground">
          12. Real-World Applications: University Timetabling & Compiler Register Allocation
        </h2>
        <Card className="p-5 border-card-edge bg-card-fill space-y-3 text-xs leading-relaxed">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-neutral-400">
            <div className="p-3 rounded-lg border border-card-edge bg-neutral-900/50">
              <span className="font-bold text-foreground block mb-1">
                University Exam Scheduling
              </span>
              Variables are courses, domains are exam time-slots, and constraints state that no two
              exams taken by the same student can share the same time-slot.
            </div>
            <div className="p-3 rounded-lg border border-card-edge bg-neutral-900/50">
              <span className="font-bold text-foreground block mb-1">
                Compiler Register Allocation
              </span>
              Variables are program variables, domains are physical CPU hardware registers (R0-R15),
              and constraints state that variables with overlapping lifespans cannot occupy the same
              register.
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
              Q1: Explain the MRV (Minimum Remaining Values) and Degree heuristics with an example.
            </span>
            <p className="text-neutral-300">
              <strong>Model Answer:</strong> MRV selects the unassigned variable with the fewest
              remaining legal values in its domain (also called the "most constrained variable"
              heuristic). The Degree heuristic serves as a tie-breaker, selecting the variable
              involved in the largest number of constraints with other unassigned variables. In
              Australia map coloring, if WA has 1 color and SA has 1 color, Degree heuristic picks
              SA because it has 5 neighbors compared to WA 2.
            </p>
          </div>

          <div className="space-y-1">
            <span className="font-mono text-brand font-bold">
              Q2: When does AC-3 trigger a Domain Wipeout?
            </span>
            <p className="text-neutral-300">
              <strong>Model Answer:</strong> AC-3 triggers a domain wipeout when the revision of an
              arc (Xᵢ, Xⱼ) deletes every single value from the domain of Xᵢ (making |Dᵢ| = 0). This
              proves mathematically that the current partial assignment is completely inconsistent
              and cannot be extended to any valid solution, allowing the solver to backtrack
              immediately.
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
            <strong>CSP tuple ⟨X, D, C⟩:</strong> variables, domains, and constraints provide
            transparent structure that empowers general-purpose search.
          </li>
          <li>
            <strong>AC-3 propagates constraints in O(c · d³):</strong> eliminates invalid domain
            values before search, pruning exponential dead-ends.
          </li>
          <li>
            <strong>Fail-First (MRV) vs Succeed-First (LCV):</strong> choose the hardest variable
            first to fail quickly, but choose the easiest value first to leave room for future
            variables.
          </li>
          <li>
            <strong>Backtracking + Forward Checking:</strong> combines systematic search with
            lightweight inference for rapid problem resolution.
          </li>
        </ul>
      </section>
    </div>
  );
}
