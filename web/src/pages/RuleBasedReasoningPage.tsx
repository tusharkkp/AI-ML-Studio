import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Callout } from '@/components/ui/Callout';
import { Quiz } from '@/features/quiz/Quiz';
import { ChainingLab } from '@/labs/chaining/ChainingLab';
import { Link } from 'react-router-dom';

const CHAINING_QUIZ = [
  {
    id: 'ch-q1',
    question: 'When should an AI architect choose Backward Chaining over Forward Chaining?',
    options: [
      {
        id: 'opt-a',
        text: 'When there is a specific target hypothesis to prove or disprove, and asking about all possible input facts would overwhelm the user',
        isCorrect: true,
        explanation:
          'Correct! Backward chaining is goal-driven. In medical diagnosis or interactive troubleshooting, you only ask the patient questions relevant to the specific candidate disease being tested.',
      },
      {
        id: 'opt-b',
        text: 'When new sensor data arrives continuously at high frequency and all consequences must be precomputed',
        isCorrect: false,
        explanation:
          'Incorrect. Continuous data monitoring and sensor synthesis are ideal for data-driven Forward Chaining.',
      },
      {
        id: 'opt-c',
        text: 'Because backward chaining cannot handle Horn clauses',
        isCorrect: false,
        explanation:
          'Incorrect. Backward chaining is specifically designed to resolve Horn clauses through goal unification (as in Prolog).',
      },
      {
        id: 'opt-d',
        text: 'Because backward chaining executes in constant time O(1)',
        isCorrect: false,
        explanation:
          'Incorrect. Backward chaining is an exhaustive depth-first search on proof trees and is not O(1).',
      },
    ],
  },
  {
    id: 'ch-q2',
    question:
      'What is the time complexity of Forward Chaining on a propositional Horn clause knowledge base with N clauses?',
    options: [
      {
        id: 'opt-a',
        text: 'Linear time O(N) using the count-array agenda algorithm',
        isCorrect: true,
        explanation:
          'Correct! By maintaining an array of remaining premise counts for each rule and processing each fact at most once from the agenda, forward chaining runs in linear time with respect to the total size of the knowledge base.',
      },
      {
        id: 'opt-b',
        text: 'Exponential time O(2^N) due to truth table model checking',
        isCorrect: false,
        explanation:
          'Incorrect. While general propositional logic is NP-complete, restriction to Horn clauses reduces inference to linear time!',
      },
      {
        id: 'opt-c',
        text: 'O(N!) due to permutations of rule firing order',
        isCorrect: false,
        explanation:
          'Incorrect. Horn clause resolution is monotonic: rule firing order does not affect the set of derived facts.',
      },
      {
        id: 'opt-d',
        text: 'Logarithmic time O(log N)',
        isCorrect: false,
        explanation: 'Incorrect. Every relevant premise must be decremented at least once.',
      },
    ],
  },
  {
    id: 'ch-q3',
    question:
      'In a production rule system, what is the role of the "Conflict Resolution" strategy?',
    options: [
      {
        id: 'opt-a',
        text: 'To select which single rule to execute when multiple rule conditions are simultaneously satisfied in the conflict set',
        isCorrect: true,
        explanation:
          'Correct! When the agenda contains multiple rules whose IF premises are all satisfied, conflict resolution strategies (e.g. specificity, recency, priority weights) decide which one fires first.',
      },
      {
        id: 'opt-b',
        text: 'To delete contradictory rules from the database permanently',
        isCorrect: false,
        explanation:
          'Incorrect. Conflict resolution does not delete rules; it schedules which active rule fires in the match-resolve-act cycle.',
      },
      {
        id: 'opt-c',
        text: 'To convert First-Order sentences into Propositional Logic',
        isCorrect: false,
        explanation: 'Incorrect. That is propositionalization, not conflict resolution.',
      },
      {
        id: 'opt-d',
        text: 'To check if a Prolog file has syntax errors',
        isCorrect: false,
        explanation: 'Incorrect. Conflict resolution is an inference engine runtime mechanism.',
      },
    ],
  },
  {
    id: 'ch-q4',
    question: 'What is a "Horn Clause" in mathematical logic?',
    options: [
      {
        id: 'opt-a',
        text: 'A clause (disjunction of literals) containing at most ONE positive literal',
        isCorrect: true,
        explanation:
          'Correct! A Horn clause has at most one positive literal: (¬P ∨ ¬Q ∨ ... ∨ R), which is logically equivalent to the implication (P ∧ Q ∧ ... → R).',
      },
      {
        id: 'opt-b',
        text: 'A clause containing only negative literals and no variables',
        isCorrect: false,
        explanation:
          'Incorrect. A clause with only negative literals is an integrity constraint (goal clause), which is just one special case of Horn clauses.',
      },
      {
        id: 'opt-c',
        text: 'A formula with infinite nested quantifiers',
        isCorrect: false,
        explanation: 'Incorrect. Horn clauses are simple disjunctions of literals.',
      },
      {
        id: 'opt-d',
        text: 'Any sentence that can be evaluated in constant time',
        isCorrect: false,
        explanation:
          'Incorrect. Horn clauses are a syntactic form, not a computational complexity class.',
      },
    ],
  },
];

export function RuleBasedReasoningPage() {
  const [prediction, setPrediction] = useState<string | null>(null);
  const [showMath, setShowMath] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-warm-500">
        <Link to="/learn/unit-1" className="hover:text-warm-800 dark:hover:text-warm-200">
          Unit 1: Basics of AI
        </Link>
        <span>/</span>
        <span className="text-warm-900 dark:text-warm-100 font-semibold">
          Rule-Based Reasoning: Chaining
        </span>
      </nav>

      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="unit" unit={1}>
            Topic 2.07
          </Badge>
          <Badge variant="default">Unit 1 &bull; 2 Hours</Badge>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-warm-950 dark:text-warm-50 tracking-tight font-serif">
          Rule-Based Reasoning: Forward &amp; Backward Chaining
        </h1>
        <p className="text-lg text-warm-600 dark:text-warm-400 font-sans leading-relaxed">
          How production expert systems derive actionable insights from Horn clauses, contrasting
          bottom-up data-driven exploration against top-down goal-directed hypothesis testing.
        </p>
      </header>

      {/* 1. Hook */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase font-bold tracking-wider text-warm-500">The Scenario</h2>
        <Card className="p-5 border-l-4 border-l-accent-primary bg-warm-50 dark:bg-warm-900/30">
          <p className="text-warm-800 dark:text-warm-200 leading-relaxed italic">
            &ldquo;An intensive care monitoring system receives 500 patient telemetry signals per
            second: heart rate, blood oxygen, pupil dilation, EEG spikes. Does it wait for a doctor
            to ask a question, or immediately deduce emergency interventions? In contrast, when a
            clinician suspects sepsis, how does the diagnostic assistant verify the hypothesis
            without ordering 10,000 irrelevant lab tests?&rdquo;
          </p>
        </Card>
      </section>

      {/* 2. Intuition */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Intuition: Two Directions of Thought
        </h2>
        <p className="text-warm-700 dark:text-warm-300 leading-relaxed">
          In rule-based artificial intelligence, domain expertise is expressed as a collection of{' '}
          <strong>Production Rules</strong> of the form:
        </p>
        <div className="p-3 bg-warm-100 dark:bg-warm-800/60 rounded font-mono text-center text-sm font-bold text-warm-800 dark:text-warm-200 border border-warm-200 dark:border-warm-700">
          IF Premise₁ AND Premise₂ AND ... THEN Conclusion / Action
        </div>
        <p className="text-warm-700 dark:text-warm-300 leading-relaxed">
          There are two complementary ways to execute these rules:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <Card className="p-4 border-warm-200 dark:border-warm-800">
            <span className="text-xs uppercase font-bold text-accent-primary">Bottom-Up</span>
            <h4 className="font-bold text-warm-900 dark:text-warm-100 mb-1">
              Forward Chaining (Data-Driven)
            </h4>
            <p className="text-xs text-warm-600 dark:text-warm-400">
              Start with known facts. Match rules whose IF conditions are true. Fire the rules to
              add new conclusions to the fact base. Repeat until no more rules can fire.
            </p>
          </Card>
          <Card className="p-4 border-warm-200 dark:border-warm-800">
            <span className="text-xs uppercase font-bold text-accent-primary">Top-Down</span>
            <h4 className="font-bold text-warm-900 dark:text-warm-100 mb-1">
              Backward Chaining (Goal-Driven)
            </h4>
            <p className="text-xs text-warm-600 dark:text-warm-400">
              Start with a hypothesis query. Find rules that conclude this hypothesis. Turn their IF
              premises into new subgoals. Recursively work backward until matching known ground
              facts.
            </p>
          </Card>
        </div>
      </section>

      {/* 3. Try-It-First Prediction */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Predict Then Reveal: The Emergency Triage
        </h2>
        <Card className="p-5 border-warm-200 dark:border-warm-800">
          <p className="text-warm-800 dark:text-warm-200 mb-4 font-medium">
            You are designing an autonomous nuclear reactor safety system that continuously reads
            2,000 temperature and pressure sensors. If pressure exceeds safety thresholds, the
            control rods must automatically scram within 50 milliseconds.
            <br />
            Which chaining paradigm must this safety system implement?
          </p>

          <div className="flex flex-wrap gap-3">
            <Button
              variant={prediction === 'forward' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setPrediction('forward')}
            >
              Forward Chaining (Data-Driven)
            </Button>
            <Button
              variant={prediction === 'backward' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setPrediction('backward')}
            >
              Backward Chaining (Goal-Driven)
            </Button>
          </div>

          {prediction && (
            <div className="mt-4 p-4 rounded-lg bg-warm-100 dark:bg-warm-800/60 text-sm">
              {prediction === 'forward' ? (
                <p className="text-emerald-700 dark:text-emerald-300 font-medium">
                  <strong>Spot on!</strong> Forward chaining takes continuous incoming telemetry
                  (facts), pushes them through the count agenda, and immediately triggers shutdown
                  actions without waiting for someone to query whether a meltdown is occurring.
                </p>
              ) : (
                <p className="text-rose-700 dark:text-rose-300 font-medium">
                  <strong>Think again!</strong> Backward chaining waits for someone to pose a
                  question (&ldquo;Is the core melting?&rdquo;), and then works backwards to check
                  sensors. An emergency sentinel cannot wait for queries; it must react immediately
                  to incoming data!
                </p>
              )}
            </div>
          )}
        </Card>
      </section>

      {/* 4. Interactive Lab */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
            Interactive Chaining Lab
          </h2>
          <Badge variant="unit" unit={1}>
            Dual Engine Simulator
          </Badge>
        </div>
        <p className="text-sm text-warm-600 dark:text-warm-400">
          Toggle between data-driven Forward Chaining and goal-directed Backward Chaining. Modify
          initial facts and watch how proof trees expand.
        </p>

        <ChainingLab />
      </section>

      {/* 5. Hand-Worked Example */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Hand-Worked Example: Animal Identification
        </h2>
        <p className="text-warm-700 dark:text-warm-300 leading-relaxed text-sm">
          Consider knowledge base:
          <br />
          <code>R1: HasFeathers → Bird</code>
          <br />
          <code>R2: Bird ∧ CanFly → FlyingBird</code>
          <br />
          <code>R3: FlyingBird ∧ PreyHunter → Eagle</code>
          <br />
          <strong>Known Facts:</strong> <code>&#123;HasFeathers, CanFly, PreyHunter&#125;</code>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <Card className="p-3 border-warm-200 dark:border-warm-800 space-y-2">
            <span className="font-bold text-accent-primary font-sans">Forward Chaining Trace</span>
            <p>1. Agenda: [HasFeathers, CanFly, PreyHunter]</p>
            <p>
              2. Dequeue <code>HasFeathers</code> &rarr; R1 count drops to 0 &rarr; Fire R1 &rarr;
              Add <code>Bird</code> to agenda.
            </p>
            <p>
              3. Dequeue <code>Bird</code> &rarr; R2 premise satisfied (CanFly also true) &rarr;
              Fire R2 &rarr; Add <code>FlyingBird</code>.
            </p>
            <p>
              4. Dequeue <code>FlyingBird</code> &rarr; R3 premise satisfied (PreyHunter true)
              &rarr; Fire R3 &rarr; Derived <code>Eagle</code>!
            </p>
          </Card>
          <Card className="p-3 border-warm-200 dark:border-warm-800 space-y-2">
            <span className="font-bold text-accent-primary font-sans">Backward Chaining Trace</span>
            <p>
              1. Goal = <code>Eagle</code>. Rule R3 concludes Eagle.
            </p>
            <p>
              2. Subgoal 1 = <code>FlyingBird</code>. Rule R2 concludes FlyingBird.
            </p>
            <p>
              3. Subgoal 1a = <code>Bird</code>. Rule R1 concludes Bird. Subgoal{' '}
              <code>HasFeathers</code> is in Fact Base (TRUE).
            </p>
            <p>
              4. Subgoal 1b = <code>CanFly</code> is in Fact Base (TRUE). Therefore FlyingBird is
              TRUE.
            </p>
            <p>
              5. Subgoal 2 = <code>PreyHunter</code> is in Fact Base (TRUE). Therefore{' '}
              <code>Eagle</code> is PROVED!
            </p>
          </Card>
        </div>
      </section>

      {/* 6. Formal Machinery */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
            The Formal Machinery
          </h2>
          <Button size="sm" variant="outline" onClick={() => setShowMath(!showMath)}>
            {showMath ? 'Hide Formal Math' : 'Show Formal Math'}
          </Button>
        </div>

        {showMath && (
          <Card className="p-5 space-y-4 border-warm-300 dark:border-warm-700 bg-warm-50/50 dark:bg-warm-900/30">
            <h4 className="font-bold text-warm-900 dark:text-warm-100">
              1. Horn Clauses & Definite Clauses
            </h4>
            <p className="text-sm text-warm-700 dark:text-warm-300">
              A <strong>definite clause</strong> is a disjunction of literals with exactly{' '}
              <em>one</em> positive literal:
            </p>
            <div className="p-3 bg-white dark:bg-warm-900 rounded font-mono text-xs text-center border border-warm-200 dark:border-warm-800">
              ¬p₁ ∨ ¬p₂ ∨ ... ∨ ¬pₖ ∨ q &nbsp;≡&nbsp; (p₁ ∧ p₂ ∧ ... ∧ pₖ) ⟹ q
            </div>

            <h4 className="font-bold text-warm-900 dark:text-warm-100 pt-2">
              2. Soundness and Completeness on Horn Bases
            </h4>
            <p className="text-sm text-warm-700 dark:text-warm-300">
              For general propositional sentences, satisfiability is NP-complete. However, on
              knowledge bases consisting strictly of definite Horn clauses:
            </p>
            <ul className="list-disc pl-5 text-sm space-y-1 text-warm-700 dark:text-warm-300">
              <li>Forward chaining runs in O(size(KB)) linear time.</li>
              <li>
                Every sentence derived by forward chaining is entailed by the KB (
                <strong>Soundness</strong>).
              </li>
              <li>
                Every atomic sentence entailed by the KB is guaranteed to be derived by forward
                chaining (<strong>Completeness</strong>).
              </li>
            </ul>
          </Card>
        )}
      </section>

      {/* 7. Algorithm & Pseudocode */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Algorithm: Linear-Time Forward Chaining
        </h2>
        <Card className="p-4 bg-warm-900 text-warm-100 font-mono text-xs overflow-x-auto">
          <pre>{`function PL-FC-ENTAILS?(KB, q):
    count = table indexed by clause, count[c] = number of premises
    inferred = table indexed by symbol, initially all false
    agenda = queue of symbols initially known to be true in KB

    while agenda is not empty:
        p = POP(agenda)
        if p == q: return true
        if inferred[p] == false:
            inferred[p] = true
            for each clause c in KB where p is in c.premises:
                decrement count[c]
                if count[c] == 0:
                    PUSH(c.conclusion, agenda)
    return false`}</pre>
        </Card>
      </section>

      {/* 8. Production Python Snippet */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Python Implementation: Production Rule Chainer
        </h2>
        <Card className="p-4 bg-warm-900 text-warm-100 font-mono text-xs overflow-x-auto">
          <pre>{`from collections import deque, defaultdict

class HornRule:
    def __init__(self, id, premises, conclusion):
        self.id = id
        self.premises = premises
        self.conclusion = conclusion

def forward_chain(rules, initial_facts, target_goal=None):
    known_facts = set(initial_facts)
    agenda = deque(initial_facts)
    count = {r.id: len(r.premises) for r in rules}
    premise_map = defaultdict(list)
    
    for r in rules:
        for p in r.premises:
            premise_map[p].append(r)
            
    while agenda:
        fact = agenda.popleft()
        if fact == target_goal:
            return True, known_facts
            
        for rule in premise_map[fact]:
            count[rule.id] -= 1
            if count[rule.id] == 0:
                new_fact = rule.conclusion
                if new_fact not in known_facts:
                    known_facts.add(new_fact)
                    agenda.append(new_fact)
                    
    return (target_goal in known_facts if target_goal else True), known_facts`}</pre>
        </Card>
      </section>

      {/* 9. Make It Fail */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Make It Fail: Conflict Resolution &amp; Circular Loops
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4 border-amber-300 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20">
            <h4 className="font-bold text-amber-900 dark:text-amber-200 mb-2">
              Failure 1: Conflict Resolution Incoherence
            </h4>
            <p className="text-xs text-warm-700 dark:text-warm-300 mb-2 leading-relaxed">
              When two rules contradict (e.g. &ldquo;If high speed then alert&rdquo; and &ldquo;If
              emergency vehicle then silence alert&rdquo;), which fires first? Without principled
              conflict resolution (like specificity or rule priorities), non-deterministic race
              conditions occur.
            </p>
          </Card>
          <Card className="p-4 border-amber-300 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20">
            <h4 className="font-bold text-amber-900 dark:text-amber-200 mb-2">
              Failure 2: Infinite Cyclic Goal Recursion
            </h4>
            <p className="text-xs text-warm-700 dark:text-warm-300 mb-2 leading-relaxed">
              In backward chaining, if rule $R_1$ says $A \to B$ and rule $R_2$ says $B \to A$, an
              unmemoized goal-directed solver will bounce between proving $A$ and $B$ until stack
              overflow. A visited goal stack is essential.
            </p>
          </Card>
        </div>
      </section>

      {/* 10. Strengths & Limitations */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Strengths, Limitations &amp; CO4 Assessment
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="p-5 border-emerald-300 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/20">
            <h4 className="font-bold text-emerald-900 dark:text-emerald-200 mb-2">Strengths</h4>
            <ul className="text-xs space-y-2 text-warm-700 dark:text-warm-300 list-disc pl-4">
              <li>
                <strong>Explainability:</strong> Provides complete audit trails. The system can
                answer &ldquo;Why did you ask this question?&rdquo; and &ldquo;How did you reach
                this diagnosis?&rdquo;
              </li>
              <li>
                <strong>Modularity:</strong> Rules can be added, updated, or removed independently
                of the underlying inference engine.
              </li>
              <li>
                <strong>Linear Efficiency:</strong> Horn clause forward chaining scales reliably to
                thousands of rules.
              </li>
            </ul>
          </Card>
          <Card className="p-5 border-rose-300 dark:border-rose-800 bg-rose-50/30 dark:bg-rose-950/20">
            <h4 className="font-bold text-rose-900 dark:text-rose-200 mb-2">Limitations</h4>
            <ul className="text-xs space-y-2 text-warm-700 dark:text-warm-300 list-disc pl-4">
              <li>
                <strong>Knowledge Acquisition Bottleneck:</strong> Hand-crafting 10,000 rules
                requires domain experts and knowledge engineers working for months.
              </li>
              <li>
                <strong>Brittleness:</strong> Fails completely when encountering unforeseen
                situations just outside the rule boundaries.
              </li>
              <li>
                <strong>Hard to Handle Noise:</strong> Crisp boolean rules cannot easily model noisy
                continuous sensor data or probabilistic uncertainties.
              </li>
            </ul>
          </Card>
        </div>
      </section>

      {/* 11. Misconceptions */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Common Misconceptions
        </h2>
        <div className="space-y-3">
          <Callout
            type="warning"
            title="Misconception: Forward and backward chaining reach different answers"
          >
            <p className="text-xs leading-relaxed">
              On pure Horn clause knowledge bases, forward chaining and backward chaining are
              mathematically <strong>equivalent</strong> in what they prove. The difference is
              purely computational direction: whether you explore outward from data or narrow inward
              toward a goal.
            </p>
          </Callout>
          <Callout
            type="note"
            title="Misconception: Rule-based systems are obsolete because of Deep Learning"
          >
            <p className="text-xs leading-relaxed">
              Rule engines (like Drools, CLIPS, and modern neuro-symbolic wrappers) remain dominant
              in regulated industries (tax law, avionics, medical eligibility, compliance) where
              100% deterministic traceability and legal auditability are strictly mandated.
            </p>
          </Callout>
        </div>
      </section>

      {/* 12. Assessment */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Check Your Understanding
        </h2>
        <Quiz conceptId="u1-rule-based-reasoning" items={CHAINING_QUIZ} unitAccent={1} />
      </section>

      {/* 13. Exam & Viva Corner */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Exam & Viva Corner
        </h2>
        <Card className="p-5 border-warm-200 dark:border-warm-800 space-y-4">
          <div className="border-b border-warm-200 dark:border-warm-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-primary">
              Frequent University Question (6 Marks)
            </span>
            <h4 className="font-semibold text-warm-900 dark:text-warm-100 mt-1">
              &ldquo;Differentiate between Forward Chaining and Backward Chaining with respect to:
              strategy, execution direction, suitability, and user interaction.&rdquo;
            </h4>
            <p className="text-xs text-warm-600 dark:text-warm-400 mt-1">
              <strong>Answer Table:</strong>
              <br />
              &bull; <strong>Strategy:</strong> Data-driven vs Goal-driven.
              <br />
              &bull; <strong>Direction:</strong> From known facts to conclusions vs From query
              backwards to subgoals.
              <br />
              &bull; <strong>Suitability:</strong> Continuous monitoring, planning, synthesis vs
              Interactive diagnosis, troubleshooting, verification.
              <br />
              &bull; <strong>User Interaction:</strong> Passive (all data provided initially) vs
              Active (system asks targeted questions).
            </p>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-accent-primary">
              Viva Voce Question
            </span>
            <h4 className="font-semibold text-warm-900 dark:text-warm-100 mt-1">
              &ldquo;Name three conflict resolution strategies used in production rule
              systems.&rdquo;
            </h4>
            <p className="text-xs text-warm-600 dark:text-warm-400 mt-1">
              <strong>Expected Answer:</strong>
              1. <em>Specificity:</em> Choose the rule with the most specific premises (e.g.
              &ldquo;Penguin & Bird&rdquo; over &ldquo;Bird&rdquo;). 2. <em>Recency:</em> Choose the
              rule whose premises were derived most recently in working memory. 3.{' '}
              <em>Refractoriness:</em> Prevent the identical rule from firing twice on the same set
              of facts.
            </p>
          </div>
        </Card>
      </section>

      {/* 14. Summary & Next Steps */}
      <section className="space-y-4 pt-4 border-t border-warm-200 dark:border-warm-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-semibold text-warm-500">Next Concept</span>
            <h3 className="text-lg font-bold text-warm-900 dark:text-warm-100">
              Architecture of Expert Systems & Knowledge Acquisition
            </h3>
            <p className="text-xs text-warm-600 dark:text-warm-400">
              Explore how knowledge bases, inference engines, explanation facilities, and domain
              experts collaborate in real-world systems.
            </p>
          </div>
          <Link to="/learn/unit-1/expert-systems">
            <Button variant="primary">Continue to Expert Systems &rarr;</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
