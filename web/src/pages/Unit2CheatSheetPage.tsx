import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Link } from 'react-router-dom';
import { Printer, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

const VIVA_FLASHCARDS: Flashcard[] = [
  {
    id: 'f1',
    question: 'Why does IDDFS combine the best advantages of BFS and DFS?',
    answer:
      'IDDFS achieves shortest-path optimality like BFS for unit step costs while consuming only linear memory O(bd) like DFS. The node regeneration overhead at shallow depths is bounded by b / (b - 1), making it asymptotically optimal.',
  },
  {
    id: 'f2',
    question: 'What is the distinction between admissibility and consistency for A* heuristics?',
    answer:
      "Admissibility requires h(n) <= h*(n) (never overestimates). Consistency requires the triangle inequality h(n) <= c(n, a, n') + h(n'). Consistency guarantees that when A* expands a node, the found path is strictly optimal, eliminating the need to ever reopen closed states in Graph Search.",
  },
  {
    id: 'f3',
    question: 'What is the time complexity of AC-3 arc consistency in CSPs?',
    answer:
      'O(c * d^3), where c is the number of binary constraints (giving 2c directed arcs) and d is the maximum domain size. An arc can be re-added to the queue at most d times, and each revision performs d^2 pairwise checks.',
  },
  {
    id: 'f4',
    question: 'Why is MRV called a "fail-first" heuristic, while LCV is called "succeed-first"?',
    answer:
      'MRV selects the variable with the fewest remaining valid choices, pruning failing subtrees as close to the root as possible. LCV selects the value that rules out the fewest choices for unassigned neighbors, maximizing the probability of finding a solution on the first attempt.',
  },
  {
    id: 'f5',
    question:
      'How much does Alpha-Beta pruning improve Minimax search depth under optimal move ordering?',
    answer:
      'It cuts the effective branching factor from b to sqrt(b), reducing time complexity from O(b^d) to O(b^(d/2)). This effectively doubles the search depth achievable in the same computation time.',
  },
  {
    id: 'f6',
    question: 'What causes the Horizon Effect in game-playing engines, and how is it solved?',
    answer:
      'The Horizon Effect occurs when search truncates at an arbitrary depth d, making the engine blind to catastrophic tactical exchanges occurring at d+1. It is solved using Quiescence Search, which extends search along capture sequences until the board is tactically quiet.',
  },
  {
    id: 'f7',
    question: "According to Holland's Schema Theorem, which schemas grow exponentially?",
    answer:
      'Short defining length delta(H), low order o(H), and above-average fitness f(H) schemas receive exponentially increasing reproductive trials over generations.',
  },
  {
    id: 'f8',
    question: "Why is the unique Nash Equilibrium in the Prisoner's Dilemma Pareto suboptimal?",
    answer:
      'Defection strictly dominates Cooperation for both individual players, compelling both to Defect for payoffs of (-2, -2). However, mutual cooperation yields (0, 0), which would make both strictly better off without harming either.',
  },
];

export function Unit2CheatSheetPage() {
  const [openCards, setOpenCards] = useState<Record<string, boolean>>({});

  const toggleCard = (id: string) => {
    setOpenCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 print:py-0 print:px-0 bg-[#0c0a09] text-stone-300 font-sans">
      {/* Top Action Bar (Hidden when printing) */}
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden border-b border-[#292524] pb-4">
        <div>
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs text-stone-500 mb-1"
          >
            <Link to="/learn/unit-2" className="hover:text-stone-300 transition-colors">
              Unit 2: AI Search Strategies
            </Link>
            <span>/</span>
            <span className="text-[#fef3c7] font-semibold">Master Revision Cheat Sheet</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            Unit 2: AI Search Strategies (Master Revision Sheet)
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/learn/unit-2/exam">
            <Button size="sm" variant="outline" className="text-xs">
              Take Practice Exam &rarr;
            </Button>
          </Link>
          <Button size="sm" variant="primary" onClick={() => window.print()} className="text-xs">
            <Printer className="w-3.5 h-3.5 mr-1" /> Print / Save PDF
          </Button>
        </div>
      </div>

      {/* Printable Sheet Container */}
      <div className="space-y-6 print:text-black">
        {/* Table 1: Master Search Algorithms Comparison */}
        <Card className="p-4 bg-[#171412] border-[#292524] text-xs">
          <div className="flex items-center justify-between border-b border-[#292524] pb-2 mb-3">
            <span className="font-bold text-sm uppercase tracking-wider text-white font-heading">
              1. Master Search Algorithms Complexity Matrix
            </span>
            <Badge variant="unit">Syllabus Core (CO1 & CO4)</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-[11px] border-collapse">
              <thead>
                <tr className="border-b border-[#292524] text-stone-400">
                  <th className="py-2 pr-3">Algorithm</th>
                  <th className="py-2 px-2">Complete?</th>
                  <th className="py-2 px-2">Optimal?</th>
                  <th className="py-2 px-2">Time Complexity</th>
                  <th className="py-2 px-2">Space Complexity</th>
                  <th className="py-2 pl-2">Frontier Data Structure</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#292524]/60 text-stone-300">
                <tr>
                  <td className="py-2 pr-3 font-semibold text-amber-300">BFS</td>
                  <td className="py-2 px-2 text-emerald-400">Yes (if b &lt; ∞)</td>
                  <td className="py-2 px-2 text-emerald-400">Yes (unit costs)</td>
                  <td className="py-2 px-2">O(b^d)</td>
                  <td className="py-2 px-2 text-rose-400">O(b^d) [RAM killer]</td>
                  <td className="py-2 pl-2">FIFO Queue</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3 font-semibold text-amber-300">DFS</td>
                  <td className="py-2 px-2 text-rose-400">No (infinite loops)</td>
                  <td className="py-2 px-2 text-rose-400">No</td>
                  <td className="py-2 px-2">O(b^m)</td>
                  <td className="py-2 px-2 text-emerald-400">O(b · m) [Linear]</td>
                  <td className="py-2 pl-2">LIFO Stack</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3 font-semibold text-amber-300">DLS</td>
                  <td className="py-2 px-2 text-rose-400">No (if d &gt; l)</td>
                  <td className="py-2 px-2 text-rose-400">No</td>
                  <td className="py-2 px-2">O(b^l)</td>
                  <td className="py-2 px-2 text-emerald-400">O(b · l) [Linear]</td>
                  <td className="py-2 pl-2">LIFO Stack</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3 font-semibold text-emerald-400">IDDFS</td>
                  <td className="py-2 px-2 text-emerald-400">Yes (if b &lt; ∞)</td>
                  <td className="py-2 px-2 text-emerald-400">Yes (unit costs)</td>
                  <td className="py-2 px-2">O(b^d)</td>
                  <td className="py-2 px-2 text-emerald-400">O(b · d) [Linear]</td>
                  <td className="py-2 pl-2">LIFO Stack</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3 font-semibold text-sky-300">Bidirectional</td>
                  <td className="py-2 px-2 text-emerald-400">Yes</td>
                  <td className="py-2 px-2 text-emerald-400">Yes (unit costs)</td>
                  <td className="py-2 px-2 text-emerald-400">O(2 · b^(d/2))</td>
                  <td className="py-2 px-2">O(b^(d/2))</td>
                  <td className="py-2 pl-2">Two FIFO Queues</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3 font-semibold text-stone-400">Greedy Best-First</td>
                  <td className="py-2 px-2 text-rose-400">No</td>
                  <td className="py-2 px-2 text-rose-400">No</td>
                  <td className="py-2 px-2">O(b^m)</td>
                  <td className="py-2 px-2">O(b^m)</td>
                  <td className="py-2 pl-2">Priority Queue [f(n)=h(n)]</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3 font-semibold text-amber-400">A* (Consistent h)</td>
                  <td className="py-2 px-2 text-emerald-400">Yes</td>
                  <td className="py-2 px-2 text-emerald-400">Yes (Graph &amp; Tree)</td>
                  <td className="py-2 px-2">O(b^d)</td>
                  <td className="py-2 px-2">O(b^d)</td>
                  <td className="py-2 pl-2">Priority Queue [f=g+h]</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* Row 2: Informed Search & Local Search */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 2: A* Heuristics */}
          <Card className="p-4 bg-[#171412] border-[#292524] text-xs space-y-2">
            <div className="font-bold text-sm uppercase tracking-wider text-white border-b border-[#292524] pb-2 font-heading">
              2. Heuristic Search & Admissibility
            </div>
            <div>
              <strong className="text-amber-300 font-mono">Evaluation Function:</strong> f(n) = g(n)
              + h(n)
              <br />
              <span className="text-stone-400">
                g(n) = exact path cost from start; h(n) = estimated remaining cost to goal.
              </span>
            </div>
            <div>
              <strong className="text-amber-300 font-mono">Admissibility:</strong> 0 &le; h(n) &le;
              h*(n)
              <br />
              <span className="text-stone-400">
                Never overestimates true cost. Guarantees A* Tree Search optimality.
              </span>
            </div>
            <div>
              <strong className="text-amber-300 font-mono">
                Consistency (Triangle Inequality):
              </strong>{' '}
              h(n) &le; c(n, a, n') + h(n')
              <br />
              <span className="text-stone-400">
                Guarantees monotonic f-values and optimal Graph Search without reopening closed
                nodes.
              </span>
            </div>
          </Card>

          {/* Card 3: Local Search & Simulated Annealing */}
          <Card className="p-4 bg-[#171412] border-[#292524] text-xs space-y-2">
            <div className="font-bold text-sm uppercase tracking-wider text-white border-b border-[#292524] pb-2 font-heading">
              3. Local Search & Simulated Annealing
            </div>
            <div>
              <strong className="text-sky-300 font-mono">Steepest Ascent:</strong> s' = argmax_
              {'{n}'} f(n)
              <br />
              <span className="text-stone-400">
                Memory = O(1). Fails on local maxima, ridges, and flat plateaux.
              </span>
            </div>
            <div>
              <strong className="text-sky-300 font-mono">Metropolis Acceptance Criterion:</strong>
              <br />
              If &Delta;E = f(n) - f(current) &gt; 0, always accept move.
              <br />
              If &Delta;E &lt; 0, accept worsening move with probability P = e^(&Delta;E / T).
            </div>
            <div>
              <strong className="text-sky-300 font-mono">Cooling Schedule:</strong> T_(k+1) =
              &alpha; &middot; T_k (&alpha; &approx; 0.95).
            </div>
          </Card>
        </div>

        {/* Row 3: CSP & Adversarial Search */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 4: CSP & AC-3 */}
          <Card className="p-4 bg-[#171412] border-[#292524] text-xs space-y-2">
            <div className="font-bold text-sm uppercase tracking-wider text-white border-b border-[#292524] pb-2 font-heading">
              4. Constraint Satisfaction Problems (CSP)
            </div>
            <div>
              <strong className="text-emerald-300 font-mono">CSP Tuple:</strong> &#123;X, D, C&#125;
              (Variables, Domains, Constraints).
            </div>
            <div>
              <strong className="text-emerald-300 font-mono">AC-3 Arc Consistency:</strong> Time
              complexity O(c &middot; d^3).
              <br />
              <span className="text-stone-400">
                Arc (X_i, X_j) is consistent if for every x in D(X_i), there exists y in D(X_j)
                satisfying constraint.
              </span>
            </div>
            <div>
              <strong className="text-emerald-300 font-mono">
                MRV (Minimum Remaining Values):
              </strong>{' '}
              Fail-first variable ordering.
            </div>
            <div>
              <strong className="text-emerald-300 font-mono">
                LCV (Least Constraining Value):
              </strong>{' '}
              Succeed-first value ordering.
            </div>
          </Card>

          {/* Card 5: Adversarial Search & Minimax */}
          <Card className="p-4 bg-[#171412] border-[#292524] text-xs space-y-2">
            <div className="font-bold text-sm uppercase tracking-wider text-white border-b border-[#292524] pb-2 font-heading">
              5. Adversarial Search & Alpha-Beta
            </div>
            <div>
              <strong className="text-rose-300 font-mono">Minimax Value:</strong> MAX maximizes
              payoffs; MIN minimizes payoffs.
            </div>
            <div>
              <strong className="text-rose-300 font-mono">Alpha-Beta Pruning:</strong>
              <br />
              &alpha; = highest value MAX can guarantee; &beta; = lowest value MIN can guarantee.
              <br />
              Prune when &alpha; &ge; &beta; (does NOT alter minimax root score!).
            </div>
            <div>
              <strong className="text-rose-300 font-mono">Horizon Effect:</strong> Depth truncation
              misses tactics; resolved by Quiescence Search.
            </div>
          </Card>
        </div>

        {/* Row 4: Genetic Algorithms & Game Theory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 6: Genetic Algorithms */}
          <Card className="p-4 bg-[#171412] border-[#292524] text-xs space-y-2">
            <div className="font-bold text-sm uppercase tracking-wider text-white border-b border-[#292524] pb-2 font-heading">
              6. Genetic Algorithms (GA)
            </div>
            <div>
              <strong className="text-purple-300 font-mono">Reproduction Loop:</strong> Selection
              &rarr; Crossover (rate p_c) &rarr; Mutation (rate p_m) &rarr; Elitism.
            </div>
            <div>
              <strong className="text-purple-300 font-mono">Holland's Schema Theorem:</strong> Short
              defining length &delta;(H), low order o(H), and above-average fitness f(H) schemas
              grow exponentially.
            </div>
            <div>
              <strong className="text-purple-300 font-mono">Elitism:</strong> Copies top E
              chromosomes unchanged, guaranteeing monotonic fitness.
            </div>
          </Card>

          {/* Card 7: Game Theory */}
          <Card className="p-4 bg-[#171412] border-[#292524] text-xs space-y-2">
            <div className="font-bold text-sm uppercase tracking-wider text-white border-b border-[#292524] pb-2 font-heading">
              7. Game Theory & Nash Equilibrium
            </div>
            <div>
              <strong className="text-amber-300 font-mono">Normal Form:</strong> G = &lang;N, (A_i),
              (u_i)&rang;.
            </div>
            <div>
              <strong className="text-amber-300 font-mono">Nash Equilibrium:</strong> Profile a*
              where u_i(a_i*, a_-i*) &ge; u_i(a_i, a_-i*) for all a_i.
            </div>
            <div>
              <strong className="text-amber-300 font-mono">Prisoner's Dilemma:</strong> (Defect,
              Defect) is unique Nash (-2, -2), but Pareto suboptimal.
            </div>
            <div>
              <strong className="text-amber-300 font-mono">Minimax Theorem:</strong> In zero-sum
              games, Minimax strategy equals Nash Equilibrium.
            </div>
          </Card>
        </div>

        {/* Section 8: Interactive Viva Flashcards */}
        <Card className="p-6 bg-[#171412] border-[#292524]">
          <div className="flex items-center justify-between mb-4 border-b border-[#292524] pb-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <h2 className="text-base font-bold text-white font-heading">
                8. Viva Voce & Oral Exam Flashcards (Click to Reveal)
              </h2>
            </div>
            <Badge variant="unit">8 Key Questions</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {VIVA_FLASHCARDS.map((card) => {
              const isOpen = !!openCards[card.id];
              return (
                <div
                  key={card.id}
                  className="p-3 bg-[#12100e] border border-[#292524] rounded-lg text-xs space-y-2"
                >
                  <button
                    type="button"
                    onClick={() => toggleCard(card.id)}
                    className="w-full text-left font-semibold text-stone-200 flex items-center justify-between gap-2"
                  >
                    <span>{card.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-stone-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="pt-2 border-t border-[#292524] text-stone-400 leading-relaxed text-[11px] bg-[#171412] p-2 rounded">
                      <strong className="text-[#fef3c7]">Model Answer: </strong>
                      {card.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
