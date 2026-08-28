import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Callout } from '@/components/ui/Callout';
import { Quiz } from '@/features/quiz/Quiz';
import { StateSpaceLab } from '@/labs/state-space/StateSpaceLab';
import { ArrowLeft } from 'lucide-react';

export function StateSpaceSearchPage() {
  const [showMath, setShowMath] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<string | null>(null);

  const quizItems = [
    {
      id: 'ss-q1',
      question:
        'In the Missionaries and Cannibals problem with 3 of each and a 2-person boat, what is the total number of mathematically possible state tuples (M, C, B), and how many of them are strictly legal?',
      options: [
        {
          id: 'A',
          text: '32 possible configurations; exactly 16 are legal.',
          isCorrect: true,
          explanation:
            'Missionaries on left can be 0..3 (4 values), Cannibals 0..3 (4 values), Boat on left or right (2 values): 4 × 4 × 2 = 32 configurations. Exactly 16 satisfy the non-starvation constraint M >= C on both banks (when M > 0).',
        },
        {
          id: 'B',
          text: '64 possible configurations; 32 are legal.',
          isCorrect: false,
          explanation: 'The boat has only 2 sides, and M and C each range only from 0 to 3.',
        },
        {
          id: 'C',
          text: '9 possible configurations; only 3 are legal.',
          isCorrect: false,
          explanation: '32 configurations exist since M and C are independent discrete counts.',
        },
      ],
    },
    {
      id: 'ss-q2',
      question:
        'Which component of a formal state-space search problem defines the legal moves executable from a given state s?',
      options: [
        {
          id: 'A',
          text: 'Actions(s)',
          isCorrect: true,
          explanation:
            'Actions(s) returns the set of valid operator actions that can be legally performed when the agent is in state s.',
        },
        {
          id: 'B',
          text: 'GoalTest(s)',
          isCorrect: false,
          explanation: 'GoalTest(s) evaluates whether state s satisfies the target objective.',
        },
        {
          id: 'C',
          text: 'PathCost(c)',
          isCorrect: false,
          explanation:
            'PathCost computes the cumulative sum of step costs along a transition path.',
        },
      ],
    },
    {
      id: 'ss-q3',
      question:
        'Why does a naive state-space search algorithm without a visited/explored set fail on simple problems like river crossing?',
      options: [
        {
          id: 'A',
          text: 'It gets trapped in infinite ping-pong cycles transporting passengers back and forth between identical states.',
          isCorrect: true,
          explanation:
            'Without cycle prevention, an agent can transport 1 cannibal across and immediately bring them back, repeating endlessly without ever advancing toward the goal.',
        },
        {
          id: 'B',
          text: 'The boat runs out of fuel.',
          isCorrect: false,
          explanation: 'Standard river crossing formalisms assume unbounded operator steps.',
        },
        {
          id: 'C',
          text: 'The state space is mathematically continuous.',
          isCorrect: false,
          explanation: 'The state space is strictly discrete and finite.',
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
            Unit 2 · Lecture Topic 2.1
          </Badge>
          <Badge variant="outline" size="sm">
            CO1 (L3 Apply)
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-foreground font-display">
          State-Space Search &amp; Problem Formulation
        </h1>
        <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl leading-relaxed">
          Before an AI algorithm can search for a solution, the world must be formalized into
          states, actions, transitions, and costs. Watch how classical puzzles transform into
          solvable graphs.
        </p>
      </header>

      {/* 2. Hook & The Scenario */}
      <section className="space-y-4">
        <h2 className="text-xs uppercase font-mono tracking-wider text-neutral-500">
          The River Crossing Dilemma
        </h2>
        <Card className="p-6 border-card-edge bg-card-fill backdrop-blur-sm">
          <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
            Three missionaries and three cannibals stand on the left bank of a fast-moving river.
            They have a single rowboat that holds at most two people. If cannibals ever outnumber
            missionaries on either riverbank, the missionaries will be overpowered and eaten. How
            can all six cross safely to the right bank?
          </p>
        </Card>
      </section>

      {/* 3. Intuition: Formulating Reality into Math */}
      <section className="space-y-4">
        <h2 className="text-2xl font-medium sm:text-[30px] text-foreground font-display">
          Intuition: From Puzzle to Search Graph
        </h2>
        <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
          Computers cannot solve puzzles expressed as human stories. An intelligent agent requires a{' '}
          <span className="highlight">precise mathematical abstraction</span> called a{' '}
          <strong>State Space</strong>. A state captures only the details relevant to deciding the
          next action:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl border border-card-edge bg-card-fill">
            <span className="text-neutral-500 block mb-1">State Variable 1</span>
            <span className="text-foreground font-bold">M_L ∈ &#123;0, 1, 2, 3&#125;</span>
            <p className="text-[11px] text-neutral-500 mt-1 font-sans">
              Number of missionaries currently on the left bank.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-card-edge bg-card-fill">
            <span className="text-neutral-500 block mb-1">State Variable 2</span>
            <span className="text-foreground font-bold">C_L ∈ &#123;0, 1, 2, 3&#125;</span>
            <p className="text-[11px] text-neutral-500 mt-1 font-sans">
              Number of cannibals currently on the left bank.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-card-edge bg-card-fill">
            <span className="text-neutral-500 block mb-1">State Variable 3</span>
            <span className="text-foreground font-bold">B ∈ &#123;'L', 'R'&#125;</span>
            <p className="text-[11px] text-neutral-500 mt-1 font-sans">
              Current docking position of the rowboat.
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
            Prediction Challenge: Can you send 1 Missionary and 0 Cannibals on the first move?
          </h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            If you send 1 Missionary across in the boat from (3, 3, 'L'), what happens on the left
            bank?
          </p>

          <div className="flex flex-wrap gap-2">
            {[
              { id: 'safe', label: 'It is a valid and safe move.' },
              { id: 'feast', label: 'Disaster! Cannibals feast on the left bank.' },
              { id: 'boat', label: 'Illegal because boat requires 2 people.' },
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
              {prediction === 'feast' ? (
                <p className="text-emerald-400 font-semibold">
                  ✓ Exactly correct! Moving 1 Missionary leaves 2 Missionaries and 3 Cannibals on
                  the left bank. Because 2 &lt; 3, the missionaries are immediately overpowered!
                </p>
              ) : (
                <p className="text-rose-400 font-semibold">
                  ✗ Incorrect: Sending 1 Missionary leaves 2 Missionaries and 3 Cannibals on the
                  left bank. The non-starvation constraint is violated!
                </p>
              )}
            </div>
          )}
        </Card>
      </section>

      {/* 5. Interactive Simulation Lab */}
      <section className="space-y-4">
        <h2 className="text-2xl font-medium sm:text-[30px] text-foreground font-display">
          Interactive River Crossing Laboratory
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Test moves manually or step through the optimal 11-step solution path:
        </p>
        <StateSpaceLab />
      </section>

      {/* 6. Step-by-Step State Transition Table */}
      <section className="space-y-4">
        <h2 className="text-2xl font-medium sm:text-[30px] text-foreground font-display">
          Step-by-Step on Paper: The 11-Step Solution
        </h2>
        <div className="overflow-x-auto rounded-xl border border-card-edge bg-card-fill">
          <table className="w-full text-xs font-mono text-left">
            <thead className="border-b border-card-edge bg-neutral-900/60 text-neutral-400 uppercase text-[10px]">
              <tr>
                <th className="p-3">Step</th>
                <th className="p-3">State (ML, CL, Boat)</th>
                <th className="p-3">Action Executed</th>
                <th className="p-3">Resulting State</th>
                <th className="p-3 font-sans">Why This Move is Safe</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-edge">
              {[
                {
                  s: 1,
                  start: '(3, 3, L)',
                  act: 'Send 2C →',
                  end: '(3, 1, R)',
                  note: 'Leaves 3M, 1C on left; 0M, 2C on right. Safe.',
                },
                {
                  s: 2,
                  start: '(3, 1, R)',
                  act: '← Return 1C',
                  end: '(3, 2, L)',
                  note: 'Left has 3M, 2C; Right has 0M, 1C. Safe.',
                },
                {
                  s: 3,
                  start: '(3, 2, L)',
                  act: 'Send 2C →',
                  end: '(3, 0, R)',
                  note: 'Left has 3M, 0C; Right has 0M, 3C. Safe.',
                },
                {
                  s: 4,
                  start: '(3, 0, R)',
                  act: '← Return 1C',
                  end: '(3, 1, L)',
                  note: 'Cannibal returns boat.',
                },
                {
                  s: 5,
                  start: '(3, 1, L)',
                  act: 'Send 2M →',
                  end: '(1, 1, R)',
                  note: 'Left has 1M, 1C; Right has 2M, 2C. Equal on both banks!',
                },
                {
                  s: 6,
                  start: '(1, 1, R)',
                  act: '← Return 1M 1C',
                  end: '(2, 2, L)',
                  note: 'Crucial turnaround move to prevent feast.',
                },
                {
                  s: 7,
                  start: '(2, 2, L)',
                  act: 'Send 2M →',
                  end: '(0, 2, R)',
                  note: 'Left has 0M, 2C; Right has 3M, 1C. Safe!',
                },
                {
                  s: 8,
                  start: '(0, 2, R)',
                  act: '← Return 1C',
                  end: '(0, 3, L)',
                  note: 'Cannibal brings boat back to collect peers.',
                },
                {
                  s: 9,
                  start: '(0, 3, L)',
                  act: 'Send 2C →',
                  end: '(0, 1, R)',
                  note: 'Two cannibals cross.',
                },
                {
                  s: 10,
                  start: '(0, 1, R)',
                  act: '← Return 1C',
                  end: '(0, 2, L)',
                  note: 'One cannibal returns.',
                },
                {
                  s: 11,
                  start: '(0, 2, L)',
                  act: 'Send 2C →',
                  end: '(0, 0, R)',
                  note: 'Goal reached: All 6 crossed safely!',
                },
              ].map((row) => (
                <tr key={row.s} className="hover:bg-neutral-900/30">
                  <td className="p-3 font-bold text-neutral-400">{row.s}</td>
                  <td className="p-3 text-neutral-300">{row.start}</td>
                  <td className="p-3 text-brand font-semibold">{row.act}</td>
                  <td className="p-3 text-foreground font-bold">{row.end}</td>
                  <td className="p-3 font-sans text-neutral-400">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 7. Formal Mathematical Foundations */}
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
              The 5-Tuple Problem Formulation (Russell &amp; Norvig)
            </h4>
            <div className="p-3 rounded bg-neutral-900 border border-card-edge font-mono text-xs text-center">
              Problem = ⟨S₀, Actions(s), Result(s, a), GoalTest(s), PathCost(c)⟩
            </div>
            <ul className="text-xs text-neutral-400 space-y-2 list-disc pl-5">
              <li>
                <strong>Initial State S₀:</strong> The starting configuration where the agent
                begins: S₀ = (3, 3, 'L').
              </li>
              <li>
                <strong>Actions(s):</strong> Set of applicable operator actions in state s: Actions
                ∈ &#123;(1, 0), (2, 0), (0, 1), (0, 2), (1, 1)&#125;.
              </li>
              <li>
                <strong>Transition Model Result(s, a):</strong> Deterministic function mapping state
                s and action a to next state s'.
              </li>
              <li>
                <strong>Goal Test GoalTest(s):</strong> Boolean predicate checking if target state
                is achieved: GoalTest(s) = (M_L = 0 ∧ C_L = 0 ∧ B = 'R').
              </li>
              <li>
                <strong>Path Cost c(s, a, s'):</strong> Numeric cost of transition; in unweighted
                river crossing, step cost = 1.
              </li>
            </ul>
          </Card>
        )}
      </section>

      {/* 8. Python Reference Code */}
      <section className="space-y-4">
        <h2 className="text-2xl font-medium sm:text-[30px] text-foreground font-display">
          Code It in Python: State-Space Explorer
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Clean generator function in Python exploring state transitions:
        </p>
        <Card className="p-4 bg-neutral-950 border-card-edge text-neutral-200 font-mono text-xs overflow-x-auto">
          <pre>{`from collections import deque

def is_valid(ml, cl):
    # Check boundaries
    if not (0 <= ml <= 3 and 0 <= cl <= 3):
        return False
    mr, cr = 3 - ml, 3 - cl
    # Check non-starvation condition on both banks
    if (ml > 0 and ml < cl) or (mr > 0 and mr < cr):
        return False
    return True

def get_successors(state):
    ml, cl, b = state
    moves = [(1, 0), (2, 0), (0, 1), (0, 2), (1, 1)]
    successors = []
    for m, c in moves:
        if b == 'L':
            next_state = (ml - m, cl - c, 'R')
        else:
            next_state = (ml + m, cl + c, 'L')
        if is_valid(next_state[0], next_state[1]):
            successors.append(next_state)
    return successors

def solve_river_crossing():
    start = (3, 3, 'L')
    goal = (0, 0, 'R')
    queue = deque([[start]])
    visited = {start}

    while queue:
        path = queue.popleft()
        current = path[-1]
        if current == goal:
            return path
        for succ in get_successors(current):
            if succ not in visited:
                visited.add(succ)
                queue.append(path + [succ])
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
              Trap 1: The Cannibal Feast
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              If an agent prioritizes speed over safety and sends 1 Missionary across on step 1, the
              left bank immediately collapses into (2M, 3C). The missionaries are devoured,
              resulting in instant terminal failure.
            </p>
          </Card>
          <Card className="p-4 border-card-edge bg-card-fill space-y-2">
            <h4 className="font-montserrat font-semibold text-amber-400 text-sm">
              Trap 2: Ping-Pong Loop Without Explored Set
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Sending 2 Cannibals to the right bank and immediately bringing 2 Cannibals back
              results in the identical state (3, 3, 'L'). Without a visited hash set, graph search
              degenerates into an infinite memory-exhausting loop.
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
              <li>Provides a rigorous, mathematically complete framework for discrete puzzles.</li>
              <li>Decouples problem formulation from the search algorithm (BFS, DFS, A*).</li>
              <li>
                Guarantees optimal solution discovery when paired with appropriate algorithms.
              </li>
            </ul>
          </Card>
          <Card className="p-4 border-card-edge bg-card-fill space-y-2">
            <h4 className="font-montserrat font-semibold text-rose-400 text-sm">
              Limitations &amp; When NOT to Use
            </h4>
            <ul className="text-neutral-400 space-y-1 list-disc pl-4">
              <li>Combinatorial explosion: Real-world problems (like chess) have 10¹²⁰ states.</li>
              <li>Cannot natively handle continuous physics without state discretization.</li>
              <li>
                Unusable when actions have stochastic non-deterministic outcomes without Markov
                models.
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
          <Callout type="warning" title="Misconception: A state includes the agent's full history">
            <p className="text-xs leading-relaxed">
              A state does NOT need to store how the agent arrived there. Under the Markov property,
              the state captures solely the current configuration necessary to predict valid future
              transitions.
            </p>
          </Callout>
          <Callout type="note" title="Misconception: All state spaces can be generated upfront">
            <p className="text-xs leading-relaxed">
              For small puzzles (32 states), the full state space graph can be materialized in
              memory. For realistic problems, state spaces are generated on-the-fly via successor
              functions.
            </p>
          </Callout>
        </div>
      </section>

      {/* 12. Check Yourself Quiz */}
      <section className="space-y-4">
        <Quiz conceptId="u2-state-space-search" items={quizItems} unitAccent={2} />
      </section>

      {/* 13. Exam & Viva Corner */}
      <section className="space-y-4">
        <h2 className="text-2xl font-medium sm:text-[30px] text-foreground font-display">
          Exam &amp; Viva Corner
        </h2>
        <Card className="p-6 border-card-edge bg-card-fill space-y-4">
          <div className="space-y-2">
            <h4 className="font-montserrat font-semibold text-foreground text-sm">
              Q: Define the 5 components of a formal search problem formulation (SPPU / NEP 4 Marks)
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              <strong>Answer:</strong> 1) Initial State: The starting world configuration. 2)
              Actions(s): Available legal actions from state s. 3) Transition Model Result(s, a):
              Outcome state resulting from action a in state s. 4) Goal Test: Boolean check whether
              a state satisfies the objective. 5) Path Cost: Sum of individual step costs along the
              solution trajectory.
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
              State-space search converts human problems into graphs of discrete states and
              transition edges.
            </li>
            <li>
              In the Missionaries &amp; Cannibals problem, exactly 16 of the 32 configurations are
              legally survivable.
            </li>
            <li>
              Cycle detection via an explored set is mandatory to prevent infinite loops in cyclic
              state spaces.
            </li>
            <li>
              Optimal solution requires exactly 11 boat crossings, with the crucial turning point at
              step 6 returning 1M and 1C.
            </li>
          </ul>
        </Card>
      </section>
    </div>
  );
}
