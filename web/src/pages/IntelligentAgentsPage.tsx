import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, AlertOctagon } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Callout } from '@/components/ui/Callout';
import { Toggle } from '@/components/ui/Toggle';
import { Quiz, QuizItem } from '@/features/quiz/Quiz';
import { VacuumWorldLab } from '@/labs/vacuum-world/VacuumWorldLab';
import { useProgressStore } from '@/features/progress/useProgressStore';

export function IntelligentAgentsPage() {
  const [showMath, setShowMath] = useState(false);
  const markRead = useProgressStore((state) => state.markRead);
  const markLabCompleted = useProgressStore((state) => state.markLabCompleted);

  useEffect(() => {
    markRead('u1-intelligent-agents');
  }, [markRead]);

  const quizItems: QuizItem[] = [
    {
      id: 'q1',
      question:
        'What is the fundamental difference between an Omniscient agent and a Rational agent?',
      options: [
        {
          id: 'A',
          text: 'An omniscient agent uses a utility function, while a rational agent only uses rules.',
          isCorrect: false,
          explanation:
            'Both can utilize utility functions or rules; that does not define omniscience.',
        },
        {
          id: 'B',
          text: 'An omniscient agent knows the actual future outcome of its actions, whereas a rational agent maximizes expected performance given its current percept history.',
          isCorrect: true,
          explanation:
            'Rationality depends on what the agent can perceive and reasonably expect, whereas omniscience requires impossible clairvoyance of all future events.',
        },
        {
          id: 'C',
          text: 'A rational agent never makes mistakes, while an omniscient agent learns from trial and error.',
          isCorrect: false,
          explanation:
            'Rational agents can make mistakes when operating in partially observable or stochastic environments.',
        },
      ],
    },
    {
      id: 'q2',
      question:
        'In Russell & Norvig’s vacuum world, why does a Simple Reflex agent fail and oscillate infinitely in a clean 2-room environment?',
      options: [
        {
          id: 'A',
          text: 'Because its battery is infinite.',
          isCorrect: false,
          explanation:
            'Infinite battery allows it to keep moving, but the cause of oscillation is the lack of internal memory.',
        },
        {
          id: 'B',
          text: 'Because it lacks internal state (memory) to record that the adjacent room has already been cleaned, relying strictly on current percept [Location, Clean].',
          isCorrect: true,
          explanation:
            'Condition-action rules have no memory: [A, Clean] -> Right, [B, Clean] -> Left, creating an inescapable infinite ping-pong loop.',
        },
        {
          id: 'C',
          text: 'Because its suction motor produces negative reward.',
          isCorrect: false,
          explanation:
            'Suction only occurs on dirty tiles; in a clean world it moves between rooms without sucking.',
        },
      ],
    },
    {
      id: 'q3',
      question: 'In the PEAS framework, what does the letter "S" stand for?',
      options: [
        {
          id: 'A',
          text: 'Speed (the clock rate of the agent processor)',
          isCorrect: false,
          explanation:
            'Speed is a hardware specification, not a component of the task environment.',
        },
        {
          id: 'B',
          text: 'Sensors (the mechanisms through which the agent perceives its environment)',
          isCorrect: true,
          explanation: 'PEAS stands for Performance measure, Environment, Actuators, and Sensors.',
        },
        {
          id: 'C',
          text: 'States (the set of all reachable world configurations)',
          isCorrect: false,
          explanation: 'States are part of the Environment description, not the S in PEAS.',
        },
      ],
    },
    {
      id: 'q4',
      question:
        'Why are Table-Driven agents (storing an explicit lookup table mapping every possible percept sequence to an action) practically infeasible for real-world AI?',
      options: [
        {
          id: 'A',
          text: 'Because lookup tables cannot run in deterministic environments.',
          isCorrect: false,
          explanation:
            'Lookup tables work easily in deterministic environments; the issue is table size.',
        },
        {
          id: 'B',
          text: 'Because the number of entries grows exponentially with time: |Percepts|^Time, requiring more memory than atoms in the universe for even simple tasks.',
          isCorrect: true,
          explanation:
            'A visual agent with 1 megapixel video over 1 hour has |P|^T entries exceeding astronomical scales. Agents must use concise programs, not giant lookup tables.',
        },
        {
          id: 'C',
          text: 'Because Python dictionaries do not support tuple indexing.',
          isCorrect: false,
          explanation:
            'Python tuples can be dictionary keys; the limitation is fundamental mathematical combinatorics.',
        },
      ],
    },
  ];

  return (
    <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* 1. Header & Metadata */}
      <header className="mb-8 border-b border-studio-200 pb-8 dark:border-studio-800">
        <Link
          to="/learn/unit-1"
          className="inline-flex items-center text-xs font-semibold text-studio-500 hover:text-unit-1 mb-4 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1" />
          Back to Unit 1: Basics of AI
        </Link>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="unit" unit={1}>
            Unit 1 · Basics of AI
          </Badge>
          <Badge variant="outline">Syllabus Topic: u1-intelligent-agents</Badge>
          <span className="flex items-center text-xs text-studio-500 ml-auto">
            <Clock className="h-3.5 w-3.5 mr-1" />
            18 min read & lab
          </span>
        </div>

        <h1 className="font-display text-3xl font-extrabold tracking-tight text-studio-900 dark:text-studio-50 sm:text-4xl">
          Intelligent Agents & The PEAS Framework
        </h1>
        <p className="mt-3 text-lg text-studio-600 dark:text-studio-400">
          How artificial agents perceive their world, select rational actions, and why memory
          separates intelligent agents from mindless automatons.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-studio-500 pt-3 border-t border-studio-100 dark:border-studio-800">
          <span>
            <strong>Course Outcomes:</strong> CO1 (Agent Principles), CO4 (Rationality Limits)
          </span>
          <span>
            <strong>Prerequisites:</strong> None (Foundational topic)
          </span>
        </div>
      </header>

      {/* 2. The Hook */}
      <section className="mb-10">
        <div className="rounded-2xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent p-6 border-l-4 border-unit-1">
          <h2 className="font-display text-xl font-bold text-studio-900 dark:text-studio-100 mb-2">
            The Ping-Pong Roomba Tragedy
          </h2>
          <p className="text-base text-studio-700 dark:text-studio-300 leading-relaxed">
            A robotic vacuum cleans Room A, rolls into Room B, vacuums Room B, and then bounces back
            to Room A. Both rooms are now completely clean. Yet, because the robot has no memory, it
            sees: <em>[Room A, Clean]</em>. Its rulebook says: <em>"If clean, move right."</em> It
            arrives in B: <em>"If clean, move left."</em> It oscillates forever until its battery
            drops to zero. Why is an agent without memory fundamentally irrational?
          </p>
        </div>
      </section>

      {/* 3. Intuition */}
      <section className="mb-10">
        <h2 className="font-display text-2xl font-bold text-studio-900 dark:text-studio-100 mb-4">
          Intuition: The Perception-Action Loop
        </h2>
        <p className="text-base text-studio-700 dark:text-studio-300 leading-relaxed mb-4">
          An <strong>Agent</strong> is anything that can perceive its environment through{' '}
          <strong>Sensors</strong> and act upon that environment through <strong>Actuators</strong>.
        </p>
        <p className="text-base text-studio-700 dark:text-studio-300 leading-relaxed mb-4">
          A human has eyes, ears, and organs for sensors; hands, legs, and vocal cords for
          actuators. A robotic vacuum has optical dirt sensors and bump switches; drive wheels and a
          suction impeller for actuators.
        </p>

        <Callout type="tip" title="What Makes an Agent 'Rational'?">
          Rationality does <strong>not</strong> mean perfection or clairvoyance. For each possible
          percept sequence, a rational agent selects an action expected to{' '}
          <strong>maximize its performance measure</strong>, given the evidence provided by its
          percept history and its built-in knowledge.
        </Callout>
      </section>

      {/* 4. Interactive Simulator Lab */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-unit-1">
              Interactive Lab
            </span>
            <h2 className="font-display text-2xl font-bold text-studio-900 dark:text-studio-100">
              Vacuum Cleaner World & PEAS Builder
            </h2>
          </div>
        </div>

        <p className="text-sm text-studio-600 dark:text-studio-400 mb-4">
          Toggle between the 4 agent architectures below. Click <em>Oscillation Trap</em> to watch
          the simple reflex agent fail, then switch to <em>Model-Based Reflex</em> to watch it use
          internal memory to halt gracefully.
        </p>

        <VacuumWorldLab
          onCleanAll={() => {
            markLabCompleted('u1-intelligent-agents');
          }}
        />
      </section>

      {/* 5. Step-Through on a Small Hand-Checkable Example */}
      <section className="mb-10">
        <h2 className="font-display text-2xl font-bold text-studio-900 dark:text-studio-100 mb-4">
          Step-by-Step on Paper: Reflex vs Model-Based
        </h2>
        <p className="text-sm text-studio-700 dark:text-studio-300 leading-relaxed mb-4">
          Let’s hand-trace both agent types starting in <strong>Room A (Clean)</strong> with{' '}
          <strong>Room B (Clean)</strong>:
        </p>

        <div className="overflow-x-auto my-4">
          <table className="w-full text-left text-xs border border-studio-200 dark:border-studio-800 rounded-xl overflow-hidden">
            <thead className="bg-studio-100 dark:bg-studio-800 text-studio-800 dark:text-studio-200 font-bold">
              <tr>
                <th className="p-3">Step</th>
                <th className="p-3">Percept [Loc, Status]</th>
                <th className="p-3">Simple Reflex Action</th>
                <th className="p-3">Model-Based Internal State</th>
                <th className="p-3">Model-Based Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-studio-100 dark:divide-studio-800 font-mono">
              <tr className="bg-white dark:bg-studio-900">
                <td className="p-3">1</td>
                <td className="p-3">[A, Clean]</td>
                <td className="p-3 text-amber-600 font-bold">Move Right</td>
                <td className="p-3">Visited: [A]</td>
                <td className="p-3 text-unit-1 font-bold">Move Right (seek unvisited)</td>
              </tr>
              <tr className="bg-studio-50/50 dark:bg-studio-800/40">
                <td className="p-3">2</td>
                <td className="p-3">[B, Clean]</td>
                <td className="p-3 text-amber-600 font-bold">Move Left</td>
                <td className="p-3">Visited: [A, B] (All clean!)</td>
                <td className="p-3 text-emerald-600 font-bold">NOOP (Halt & Save Power)</td>
              </tr>
              <tr className="bg-white dark:bg-studio-900">
                <td className="p-3">3</td>
                <td className="p-3">[A, Clean]</td>
                <td className="p-3 text-rose-600 font-bold">Move Right (Infinite loop!)</td>
                <td className="p-3">None</td>
                <td className="p-3 text-studio-400 font-sans">Already halted</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 6. The Math (Collapsible) */}
      <section className="mb-10">
        <div className="flex items-center justify-between border-b border-studio-200 pb-3 dark:border-studio-800">
          <h2 className="font-display text-2xl font-bold text-studio-900 dark:text-studio-100">
            Formal Mathematical Definition of an Agent
          </h2>
          <Toggle label="Show the math" checked={showMath} onChange={setShowMath} />
        </div>

        {showMath && (
          <div className="mt-4 space-y-4 rounded-xl bg-studio-100/50 p-6 dark:bg-studio-900/40 border border-studio-200 dark:border-studio-800 text-sm leading-relaxed">
            <div>
              <h3 className="font-bold text-studio-900 dark:text-studio-100 mb-1">
                The Agent Function
              </h3>
              <p className="text-studio-700 dark:text-studio-300">
                Mathematically, an agent is completely characterized by an{' '}
                <strong>agent function</strong> \(f\) that maps any given percept sequence to an
                action:
              </p>
              <div className="my-2 p-3 bg-white dark:bg-studio-950 rounded-lg font-mono text-center text-unit-1 font-bold">
                f: P* → A
              </div>
              <p className="text-xs text-studio-500">
                Where P* denotes the history of all percept sequences received up to the current
                time, and A is the set of possible actions.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-studio-900 dark:text-studio-100 mb-1">
                Expected Utility Maximization
              </h3>
              <p className="text-studio-700 dark:text-studio-300">
                A rational agent selects action a* that maximizes expected utility given percept
                sequence p:
              </p>
              <div className="my-2 p-3 bg-white dark:bg-studio-950 rounded-lg font-mono text-center text-xs">
                {"a* = argmax_{a ∈ A} ∑_{s'} P(s' | s, a) · U(s')"}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 7. Pseudocode */}
      <section className="mb-10">
        <h2 className="font-display text-2xl font-bold text-studio-900 dark:text-studio-100 mb-4">
          Agent Architectures Pseudocode
        </h2>
        <div className="rounded-xl bg-studio-950 p-4 font-mono text-xs text-studio-200 overflow-x-auto border border-studio-800">
          <pre>{`# 1. Simple Reflex Agent
function SIMPLE-REFLEX-AGENT(percept) returns action:
  state = INTERPRET-INPUT(percept)
  rule = RULE-MATCH(state, rules)
  return rule.ACTION

# 2. Model-Based Reflex Agent (Maintains Internal State)
function MODEL-BASED-REFLEX-AGENT(percept) returns action:
  persistent: state, model, rules, action
  state = UPDATE-STATE(state, action, percept, model)
  rule = RULE-MATCH(state, rules)
  action = rule.ACTION
  return action`}</pre>
        </div>
      </section>

      {/* 8. Code Lab (Python) */}
      <section className="mb-10">
        <h2 className="font-display text-2xl font-bold text-studio-900 dark:text-studio-100 mb-4">
          Code It in Python
        </h2>
        <div className="rounded-xl bg-studio-950 p-4 font-mono text-xs text-studio-200 overflow-x-auto border border-studio-800">
          <pre>{`class ModelBasedVacuumAgent:
    def __init__(self):
        self.visited = set()
        self.cleaned = set()

    def select_action(self, location, status):
        self.visited.add(location)
        if status == 'dirty':
            self.cleaned.add(location)
            return 'suck'

        # Check if all accessible rooms are clean
        if len(self.cleaned) == 2 or self.visited == {'A', 'B'}:
            return 'noop'  # Halt gracefully!

        return 'right' if location == 'A' else 'left'`}</pre>
        </div>
      </section>

      {/* 9. Make It Fail */}
      <section className="mb-10">
        <div className="rounded-2xl border border-rose-300 bg-rose-50/60 p-6 dark:border-rose-900 dark:bg-rose-950/20">
          <h2 className="font-display text-xl font-bold text-rose-900 dark:text-rose-200 flex items-center gap-2 mb-2">
            <AlertOctagon className="h-5 w-5 text-rose-600" />
            Make It Fail: Partial Observability & Reflex Blindness
          </h2>
          <p className="text-sm text-studio-700 dark:text-studio-300 leading-relaxed mb-3">
            In our interactive simulator above, switch the layout to <strong>3-Room Linear</strong>{' '}
            with dirty Room C, and select <strong>Simple Reflex</strong>.
          </p>
          <p className="text-sm text-studio-700 dark:text-studio-300 leading-relaxed">
            Because a simple reflex agent only knows <em>"If clean in B, go left"</em>, it will{' '}
            <strong>never visit Room C</strong>! The simple reflex agent is structurally incapable
            of operating in environments requiring sequential exploration because it has no memory
            of where it has been.
          </p>
        </div>
      </section>

      {/* 10. Strengths, Limitations & When NOT to use (CO4) */}
      <section className="mb-10">
        <h2 className="font-display text-2xl font-bold text-studio-900 dark:text-studio-100 mb-4">
          Architectural Strengths, Limitations & Trade-Offs (CO4)
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-studio-200 bg-white p-4 dark:border-studio-800 dark:bg-studio-900">
            <h3 className="font-bold text-sm text-studio-900 dark:text-studio-100 mb-1">
              Simple Reflex Agents
            </h3>
            <p className="text-xs text-studio-600 dark:text-studio-400 mb-2">
              <strong>Strengths:</strong> Zero memory footprint \(O(1)\), blazing fast \(O(1)\)
              decision speed.
              <br />
              <strong>Fatal Flaw:</strong> Infinite loops in partially observable environments;
              unable to adapt.
            </p>
          </div>

          <div className="rounded-xl border border-studio-200 bg-white p-4 dark:border-studio-800 dark:bg-studio-900">
            <h3 className="font-bold text-sm text-studio-900 dark:text-studio-100 mb-1">
              Model-Based Reflex Agents
            </h3>
            <p className="text-xs text-studio-600 dark:text-studio-400 mb-2">
              <strong>Strengths:</strong> Maintains internal memory; overcomes partial
              observability; knows when to halt.
              <br />
              <strong>Trade-off:</strong> Requires state update logic and transition models of how
              the world changes.
            </p>
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
            title="Misconception 1: 'Rationality guarantees 100% successful outcomes'"
          >
            Rationality depends on what is <strong>expected</strong>, not clairvoyant hindsight. If
            a self-driving car crosses an intersection on green and a falling tree crushes it, the
            car made a completely rational choice despite the tragic outcome.
          </Callout>

          <Callout
            type="misconception"
            title="Misconception 2: 'A simple reflex agent can never be rational'"
          >
            If the environment is <strong>fully observable and static</strong>, a simple reflex
            agent can be completely rational! Memory is only required when the current percept does
            not contain the full state of the world.
          </Callout>
        </div>
      </section>

      {/* 12. Check Yourself Quiz */}
      <section className="mb-10">
        <Quiz conceptId="u1-intelligent-agents" items={quizItems} unitAccent={1} />
      </section>

      {/* 13. Exam & Viva Corner */}
      <section className="mb-10">
        <h2 className="font-display text-2xl font-bold text-studio-900 dark:text-studio-100 mb-4">
          Exam & Viva Corner
        </h2>

        <div className="space-y-4">
          <div className="rounded-xl border border-studio-200 bg-white p-4 dark:border-studio-800 dark:bg-studio-900">
            <p className="font-bold text-sm text-studio-900 dark:text-studio-100 mb-1">
              Q1: Formulate the PEAS description for an Automated Taxi Driver. [5 Marks]
            </p>
            <p className="text-xs text-studio-600 dark:text-studio-400 leading-relaxed">
              <strong>Model Outline:</strong>
              <br />• <strong>P (Performance):</strong> Safety, speed, legal compliance, passenger
              comfort, fuel efficiency.
              <br />• <strong>E (Environment):</strong> Urban roads, pedestrians, traffic lights,
              varying weather.
              <br />• <strong>A (Actuators):</strong> Steering wheel, accelerator, brake, display
              screen, horn.
              <br />• <strong>S (Sensors):</strong> Video cameras, LiDAR, radar, GPS, speedometer,
              odometer.
            </p>
          </div>

          <div className="rounded-xl border border-studio-200 bg-white p-4 dark:border-studio-800 dark:bg-studio-900">
            <p className="font-bold text-sm text-studio-900 dark:text-studio-100 mb-1">
              Viva Voce: Why is an environment classified as 'Partially Observable', and which agent
              architecture handles it?
            </p>
            <p className="text-xs text-studio-600 dark:text-studio-400 leading-relaxed">
              <strong>Quick Answer:</strong> When an agent's sensors cannot detect the complete
              state of the environment at each point in time. Handled by{' '}
              <strong>Model-Based Agents</strong>, which maintain an internal model of unseen
              aspects of the world.
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
          <li>An agent perceives via sensors and acts via actuators (\(f: P^* \to A\)).</li>
          <li>
            Rationality maximizes expected performance measure, distinct from clairvoyant
            omniscience.
          </li>
          <li>PEAS formalizes Performance measure, Environment, Actuators, and Sensors.</li>
          <li>
            Simple reflex agents rely only on current percepts; model-based agents maintain internal
            state.
          </li>
          <li>
            Table-driven agents suffer from combinatorial explosion \(|P|^T\), making agent programs
            essential.
          </li>
        </ul>

        <div className="flex items-center justify-between border-t border-studio-200/80 pt-4 dark:border-studio-800">
          <Link
            to="/learn/unit-1"
            className="text-xs font-semibold text-studio-500 hover:text-studio-700 dark:hover:text-studio-300"
          >
            ← Unit 1 Overview
          </Link>
          <Link
            to="/learn/unit-1/knowledge-representation"
            className="inline-flex items-center text-xs font-bold text-unit-1 hover:underline"
          >
            Next: Knowledge Representation & Logic →
          </Link>
        </div>
      </footer>
    </article>
  );
}
