import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Callout } from '@/components/ui/Callout';
import { Quiz } from '@/features/quiz/Quiz';
import { ExpertSystemArchitectureLab } from '@/labs/expert-systems/ExpertSystemArchitectureLab';
import { Link } from 'react-router-dom';

const ES_QUIZ = [
  {
    id: 'es-q1',
    question:
      'Why is the "Explanation Facility" (Why/How) considered mandatory for production expert systems in clinical medicine?',
    options: [
      {
        id: 'opt-a',
        text: 'Because clinicians bear legal and ethical liability; they cannot prescribe life-altering treatments based on unexplainable black-box recommendations',
        isCorrect: true,
        explanation:
          'Correct! An expert system must be able to explain "Why" it is asking a question and "How" it reached a diagnosis so human practitioners can audit the logical rationale.',
      },
      {
        id: 'opt-b',
        text: 'Because without an explanation facility, the inference engine cannot execute forward chaining',
        isCorrect: false,
        explanation:
          'Incorrect. The inference engine executes chaining independently; the explanation facility merely records and renders the derivation tree.',
      },
      {
        id: 'opt-c',
        text: 'Because medical knowledge bases do not have rules',
        isCorrect: false,
        explanation:
          'Incorrect. Medical expert systems (like MYCIN) are built almost entirely from hundreds of clinical rules.',
      },
      {
        id: 'opt-d',
        text: 'Because the explanation facility automatically compiles the Prolog code into C++',
        isCorrect: false,
        explanation: 'Incorrect. Explanation facilities have nothing to do with code compilation.',
      },
    ],
  },
  {
    id: 'es-q2',
    question: 'What is the "Knowledge Acquisition Bottleneck" identified by Edward Feigenbaum?',
    options: [
      {
        id: 'opt-a',
        text: 'The difficult, time-consuming process of extracting implicit, tacit heuristics from human experts and translating them into formal production rules',
        isCorrect: true,
        explanation:
          'Correct! Human experts rely on subconscious intuition and heuristics that are notoriously difficult to articulate, making rule elicitation the slowest phase in expert system engineering.',
      },
      {
        id: 'opt-b',
        text: 'The physical limit of hard drive speeds when reading knowledge base files',
        isCorrect: false,
        explanation:
          'Incorrect. The bottleneck is a human cognitive and elicitation hurdle, not a disk I/O bottleneck.',
      },
      {
        id: 'opt-c',
        text: 'The inability of inference engines to evaluate more than 10 rules per second',
        isCorrect: false,
        explanation: 'Incorrect. The RETE algorithm easily matches thousands of rules per second.',
      },
      {
        id: 'opt-d',
        text: 'The restriction that expert systems can only run on Lisp machines',
        isCorrect: false,
        explanation:
          'Incorrect. While early systems ran on Lisp machines, the bottleneck is foundational to knowledge engineering across any platform.',
      },
    ],
  },
  {
    id: 'es-q3',
    question:
      'In the MYCIN expert system, how is the Certainty Factor CF(h, e) defined from Measure of Belief (MB) and Measure of Disbelief (MD)?',
    options: [
      {
        id: 'opt-a',
        text: 'CF(h, e) = MB(h, e) - MD(h, e), ranging from -1.0 (definitely false) to +1.0 (definitely true)',
        isCorrect: true,
        explanation:
          'Correct! Certainty Factors balance evidence supporting a hypothesis against evidence refuting it on a normalized scale from -1.0 to +1.0.',
      },
      {
        id: 'opt-b',
        text: 'CF(h, e) = MB(h, e) × MD(h, e)',
        isCorrect: false,
        explanation:
          'Incorrect. Multiplying belief and disbelief would be nonsensical when disbelief is high.',
      },
      {
        id: 'opt-c',
        text: 'CF(h, e) = log(MB(h, e) / MD(h, e))',
        isCorrect: false,
        explanation:
          'Incorrect. That represents log-odds (Bayesian likelihood ratio), not the Stanford MYCIN certainty factor formulation.',
      },
      {
        id: 'opt-d',
        text: 'CF(h, e) is always a boolean True/False value',
        isCorrect: false,
        explanation:
          'Incorrect. Certainty factors are real numbers capturing degrees of probabilistic belief.',
      },
    ],
  },
  {
    id: 'es-q4',
    question: 'What is the primary role of the "Knowledge Engineer" in building an expert system?',
    options: [
      {
        id: 'opt-a',
        text: 'To interview domain experts, uncover their problem-solving heuristics, and structure that knowledge into a consistent, executable formal representation',
        isCorrect: true,
        explanation:
          'Correct! The knowledge engineer acts as the bridge between human domain experts (e.g. physicians, mineralogists) and the computerized rule base.',
      },
      {
        id: 'opt-b',
        text: 'To manually diagnose patients when the computer is offline',
        isCorrect: false,
        explanation:
          'Incorrect. The knowledge engineer is a software/AI specialist, not the domain practitioner.',
      },
      {
        id: 'opt-c',
        text: 'To write device drivers for medical lab sensors',
        isCorrect: false,
        explanation: 'Incorrect. That is hardware engineering.',
      },
      {
        id: 'opt-d',
        text: 'To train deep convolutional neural networks on raw medical scans',
        isCorrect: false,
        explanation:
          'Incorrect. Classic expert systems are symbolic rule-based systems, not deep learning pipelines.',
      },
    ],
  },
];

export function ExpertSystemsPage() {
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
          Architecture of Expert Systems
        </span>
      </nav>

      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="unit" unit={1}>
            Topic 2.08
          </Badge>
          <Badge variant="default">Unit 1 &bull; 1.4 Hours</Badge>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-warm-950 dark:text-warm-50 tracking-tight font-serif">
          Architecture of Expert Systems &amp; Knowledge Acquisition
        </h1>
        <p className="text-lg text-warm-600 dark:text-warm-400 font-sans leading-relaxed">
          How artificial intelligence encapsulates the rare, hard-won judgment of world-class human
          specialists into modular, explainable, and production-grade knowledge systems.
        </p>
      </header>

      {/* 1. Hook */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase font-bold tracking-wider text-warm-500">The Scenario</h2>
        <Card className="p-5 border-l-4 border-l-accent-primary bg-warm-50 dark:bg-warm-900/30">
          <p className="text-warm-800 dark:text-warm-200 leading-relaxed italic">
            &ldquo;In 1976 at Stanford University, blood infections killed thousands annually
            because identifying specific bacteria required 48 hours of culturing. MYCIN, a
            rule-based expert system developed by Edward Shortliffe, matched 600 rules against
            patient vitals and outperformed Stanford medical faculty in selecting correct
            antimicrobial therapy, with an explanation for every single choice.&rdquo;
          </p>
        </Card>
      </section>

      {/* 2. Intuition */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Intuition: Separating Knowledge from Inference
        </h2>
        <p className="text-warm-700 dark:text-warm-300 leading-relaxed">
          In traditional software, domain business logic is tangled inside nested{' '}
          <code>if-else</code> code blocks. If a tax law or hospital protocol changes, software
          engineers must rewrite and recompile the codebase, risking regression bugs.
        </p>
        <p className="text-warm-700 dark:text-warm-300 leading-relaxed">
          The breakthrough insight of <strong>Expert Systems</strong> is the strict architectural
          separation of:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <Card className="p-4 border-warm-200 dark:border-warm-800">
            <span className="text-xs uppercase font-bold text-rose-600 dark:text-rose-400">
              Declarative
            </span>
            <h4 className="font-bold text-warm-900 dark:text-warm-100 mb-1">
              The Knowledge Base (WHAT to believe)
            </h4>
            <p className="text-xs text-warm-600 dark:text-warm-400">
              Clean, modular domain rules authored by specialists. Rules can be inserted, edited, or
              retired without changing a single line of inference engine code.
            </p>
          </Card>
          <Card className="p-4 border-warm-200 dark:border-warm-800">
            <span className="text-xs uppercase font-bold text-amber-600 dark:text-amber-400">
              Procedural
            </span>
            <h4 className="font-bold text-warm-900 dark:text-warm-100 mb-1">
              The Inference Engine (HOW to reason)
            </h4>
            <p className="text-xs text-warm-600 dark:text-warm-400">
              A universal deductive reasoning engine that resolves Horn clauses, schedules rule
              firing, and generates transparent proof traces.
            </p>
          </Card>
        </div>
      </section>

      {/* 3. Try-It-First Prediction */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Predict Then Reveal: The Tacit Knowledge Dilemma
        </h2>
        <Card className="p-5 border-warm-200 dark:border-warm-800">
          <p className="text-warm-800 dark:text-warm-200 mb-4 font-medium">
            You interview a veteran cardiologist with 35 years of emergency experience and ask:
            &ldquo;How exactly do you know within 3 seconds whether an ECG shows an atypical
            myocardial infarction?&rdquo;
            <br />
            Why is the cardiologist unable to write down a complete, neat list of 10 boolean rules?
          </p>

          <div className="flex flex-wrap gap-3">
            <Button
              variant={prediction === 'tacit' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setPrediction('tacit')}
            >
              Tacit Heuristic Knowledge (Feigenbaum Bottleneck)
            </Button>
            <Button
              variant={prediction === 'memory' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setPrediction('memory')}
            >
              The doctor forgot the medical textbook formulas
            </Button>
          </div>

          {prediction && (
            <div className="mt-4 p-4 rounded-lg bg-warm-100 dark:bg-warm-800/60 text-sm">
              {prediction === 'tacit' ? (
                <p className="text-emerald-700 dark:text-emerald-300 font-medium">
                  <strong>Exactly right!</strong> Human expertise is largely{' '}
                  <em>tacit and heuristic</em>, compiled from thousands of past patient encounters.
                  This communication gap between human instinct and formal computer logic is the
                  renowned <strong>Knowledge Acquisition Bottleneck</strong>.
                </p>
              ) : (
                <p className="text-rose-700 dark:text-rose-300 font-medium">
                  <strong>Not quite.</strong> The cardiologist knows the textbook cold. But textbook
                  rules only cover clean, idealized cases. True experts use subconscious heuristics
                  and pattern-matching that require skilled Knowledge Engineers to extract through
                  protocol analysis!
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
            Interactive Architecture &amp; Validation Lab
          </h2>
          <Badge variant="unit" unit={1}>
            Subsystem Explorer
          </Badge>
        </div>
        <p className="text-sm text-warm-600 dark:text-warm-400">
          Explore the 6 core components of an expert system, test what happens when critical modules
          fail, and run automated consistency checks on candidate rule bases.
        </p>

        <ExpertSystemArchitectureLab />
      </section>

      {/* 5. Hand-Worked Example */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Hand-Worked Example: The Match-Resolve-Act Cycle
        </h2>
        <p className="text-warm-700 dark:text-warm-300 leading-relaxed text-sm">
          Every cycle of a production rule system executes in three deterministic phases:
        </p>

        <div className="space-y-3 text-xs">
          <Card className="p-3 border-warm-200 dark:border-warm-800 font-mono">
            <span className="text-blue-600 dark:text-blue-400 font-bold font-sans">
              Phase 1: MATCH
            </span>
            <p className="mt-1">
              Compare all rule premises against current Working Memory. If Rule 1 (
              <code>Fever ∧ Cough</code>) and Rule 4 (<code>Fever ∧ Chills</code>) are both
              satisfied, they enter the <strong>Conflict Set</strong>.
            </p>
          </Card>
          <Card className="p-3 border-warm-200 dark:border-warm-800 font-mono">
            <span className="text-amber-600 dark:text-amber-400 font-bold font-sans">
              Phase 2: RESOLVE (Conflict Resolution)
            </span>
            <p className="mt-1">
              Apply conflict resolution strategies (e.g. Specificity: Rule 4 has 3 premises vs Rule
              1 with 2 premises &rarr; Rule 4 selected).
            </p>
          </Card>
          <Card className="p-3 border-warm-200 dark:border-warm-800 font-mono">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold font-sans">
              Phase 3: ACT (Fire Rule)
            </span>
            <p className="mt-1">
              Execute the conclusion or action of the winning rule. Add <code>SuspectMalaria</code>{' '}
              to Working Memory. Repeat cycle until Conflict Set is empty.
            </p>
          </Card>
        </div>
      </section>

      {/* 6. Formal Machinery */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
            The Formal Machinery: Certainty Factors (MYCIN Model)
          </h2>
          <Button size="sm" variant="outline" onClick={() => setShowMath(!showMath)}>
            {showMath ? 'Hide Formal Math' : 'Show Formal Math'}
          </Button>
        </div>

        {showMath && (
          <Card className="p-5 space-y-4 border-warm-300 dark:border-warm-700 bg-warm-50/50 dark:bg-warm-900/30">
            <h4 className="font-bold text-warm-900 dark:text-warm-100">
              1. Definition of Certainty Factor
            </h4>
            <p className="text-sm text-warm-700 dark:text-warm-300">
              Let $h$ be a medical hypothesis and $e$ be observed clinical evidence. The Measure of
              Belief $MB(h, e)$ and Measure of Disbelief $MD(h, e)$ define the Certainty Factor:
            </p>
            <div className="p-3 bg-white dark:bg-warm-900 rounded font-mono text-sm text-center border border-warm-200 dark:border-warm-800">
              CF(h, e) = MB(h, e) - MD(h, e) &nbsp;&nbsp; where CF ∈ [-1.0, +1.0]
            </div>

            <h4 className="font-bold text-warm-900 dark:text-warm-100 pt-2">
              2. Combination of Multiple Evidence Sources
            </h4>
            <p className="text-sm text-warm-700 dark:text-warm-300">
              When two independent clinical rules both conclude hypothesis h with positive certainty
              factors CF₁ &gt; 0 and CF₂ &gt; 0:
            </p>
            <div className="p-3 bg-white dark:bg-warm-900 rounded font-mono text-xs text-center border border-warm-200 dark:border-warm-800">
              CF_combine(CF₁, CF₂) = CF₁ + CF₂ × (1 - CF₁)
            </div>
            <p className="text-xs text-warm-600 dark:text-warm-400">
              Notice: If CF₁ = 0.8 and CF₂ = 0.5, then CF_combine = 0.8 + 0.5(1 - 0.8) = 0.90.
              Confidence monotonically increases as independent positive evidence accumulates!
            </p>
          </Card>
        )}
      </section>

      {/* 7. Algorithm & Pseudocode */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Algorithm: The RETE Match Algorithm (Forgy, 1979)
        </h2>
        <Card className="p-4 bg-warm-900 text-warm-100 font-mono text-xs overflow-x-auto">
          <pre>{`// The RETE algorithm compiles production rules into a rooted directed acyclic graph:
// 1. Root Node: Receives working memory element changes (assert/retract)
// 2. 1-Input Nodes (Alpha Network): Evaluates intra-element conditions (e.g. type == 'fever')
// 3. 2-Input Nodes (Beta Network): Performs inter-element joins (e.g. fever.patient == cough.patient)
// 4. Terminal Nodes: Represents fully satisfied rules ready to enter the Conflict Set

function RETE_ASSERT(fact, working_memory):
    alpha_matches = PASS_THROUGH_ALPHA_NETWORK(fact)
    for each alpha in alpha_matches:
        BETA_MEMORY_JOIN(alpha, working_memory)
    UPDATE_CONFLICT_SET()`}</pre>
        </Card>
      </section>

      {/* 8. Production Python Snippet */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Python Implementation: Expert System with Explanation Facility
        </h2>
        <Card className="p-4 bg-warm-900 text-warm-100 font-mono text-xs overflow-x-auto">
          <pre>{`class ClinicalExpertSystem:
    def __init__(self, rules):
        self.rules = rules
        self.working_memory = {}
        self.justifications = {}  # Stores "How" proof tree

    def assert_fact(self, fact, value=True, reason="User Observation"):
        self.working_memory[fact] = value
        self.justifications[fact] = reason

    def explain_how(self, goal):
        """Displays proof tree showing how a conclusion was derived."""
        if goal not in self.justifications:
            return f"Fact '{goal}' is unknown or was not proven."
        return f"Derived '{goal}' via: {self.justifications[goal]}"

    def run_inference(self):
        changed = True
        while changed:
            changed = False
            for r in self.rules:
                if r.conclusion not in self.working_memory:
                    if all(self.working_memory.get(p, False) for p in r.premises):
                        self.assert_fact(r.conclusion, True, reason=f"Rule {r.id}: ({' & '.join(r.premises)})")
                        changed = True`}</pre>
        </Card>
      </section>

      {/* 9. Make It Fail */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Make It Fail: Knowledge Base Degradation
        </h2>
        <Card className="p-4 border-amber-300 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20">
          <h4 className="font-bold text-amber-900 dark:text-amber-200 mb-2">
            The Maintenance Nightmare of Giant Rule Bases
          </h4>
          <p className="text-xs text-warm-700 dark:text-warm-300 mb-2 leading-relaxed">
            In early enterprise systems (like DEC&rsquo;s famous XCON with 10,000 rules for
            configuring VAX computers), adding a single new rule often created unforeseen
            contradictions with 15 older rules written by engineers who had left the company 5 years
            prior.
          </p>
          <p className="text-xs text-warm-700 dark:text-warm-300 leading-relaxed font-semibold">
            Without automated consistency checkers (as demonstrated in our lab above), rule
            interactions grow quadratically $O(R^2)$, leading to catastrophic diagnostic errors.
          </p>
        </Card>
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
                <strong>Total Traceability:</strong> Every diagnosis comes with an unassailable
                audit trail showing exact rules fired.
              </li>
              <li>
                <strong>Democratic Expertise:</strong> Encapsulates world-class knowledge and
                distributes it to remote rural clinics lacking specialists.
              </li>
              <li>
                <strong>Heuristic Handling:</strong> Can incorporate real-world rules of thumb that
                textbooks fail to codify.
              </li>
            </ul>
          </Card>
          <Card className="p-5 border-rose-300 dark:border-rose-800 bg-rose-50/30 dark:bg-rose-950/20">
            <h4 className="font-bold text-rose-900 dark:text-rose-200 mb-2">Limitations</h4>
            <ul className="text-xs space-y-2 text-warm-700 dark:text-warm-300 list-disc pl-4">
              <li>
                <strong>Zero Common Sense:</strong> If a medical system is told a patient is a
                200-year-old table, it may dutifully diagnose anemia because it lacks basic
                ontological common sense.
              </li>
              <li>
                <strong>Brittle at Boundaries:</strong> Performs brilliantly inside narrow bounds,
                but fails completely on unprecedented edge cases.
              </li>
              <li>
                <strong>No Self-Learning:</strong> Cannot discover new patterns from data without
                human knowledge engineering.
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
            title="Misconception: Expert systems and Machine Learning are mutually exclusive"
          >
            <p className="text-xs leading-relaxed">
              Modern AI systems use <strong>neuro-symbolic architectures</strong>: machine learning
              models handle perception (e.g. computer vision segmenting an MRI scan), while expert
              rule systems enforce safety constraints and compliance rules over the extracted
              features.
            </p>
          </Callout>
          <Callout
            type="note"
            title="Misconception: An expert system is just a giant switch-case statement"
          >
            <p className="text-xs leading-relaxed">
              In a switch-case statement, the execution order is hardcoded into the control flow. In
              an expert system, the inference engine dynamically decides what to fire based on
              pattern matching against working memory, enabling multi-step recursive deductions that
              no static switch statement could anticipate.
            </p>
          </Callout>
        </div>
      </section>

      {/* 12. Assessment */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Check Your Understanding
        </h2>
        <Quiz conceptId="u1-expert-systems" items={ES_QUIZ} unitAccent={1} />
      </section>

      {/* 13. Exam & Viva Corner */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Exam & Viva Corner
        </h2>
        <Card className="p-5 border-warm-200 dark:border-warm-800 space-y-4">
          <div className="border-b border-warm-200 dark:border-warm-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-primary">
              University Exam Classic (8 Marks)
            </span>
            <h4 className="font-semibold text-warm-900 dark:text-warm-100 mt-1">
              &ldquo;Draw a neat architectural diagram of an Expert System and explain the function
              of each component. What is the role of the Knowledge Acquisition subsystem?&rdquo;
            </h4>
            <p className="text-xs text-warm-600 dark:text-warm-400 mt-1">
              <strong>Key marking criteria:</strong> Draw the 6 blocks: UI, Explanation Facility,
              Inference Engine, Working Memory, Knowledge Base, and Knowledge Acquisition. Clearly
              state that Working Memory stores transient session facts while Knowledge Base stores
              persistent domain rules. Explain the Knowledge Engineer&rsquo;s role in bridging tacit
              domain wisdom into explicit formal rules.
            </p>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-accent-primary">
              Viva Voce Question
            </span>
            <h4 className="font-semibold text-warm-900 dark:text-warm-100 mt-1">
              &ldquo;Explain the difference between a &lsquo;Why&rsquo; question and a
              &lsquo;How&rsquo; question in an expert system consultation.&rdquo;
            </h4>
            <p className="text-xs text-warm-600 dark:text-warm-400 mt-1">
              <strong>Expected Answer:</strong>
              &bull; <strong>Why:</strong> Asked by the user during the consultation when prompted
              for an input. The system responds with the immediate goal or rule it is currently
              trying to satisfy.
              <br />
              &bull; <strong>How:</strong> Asked by the user after a diagnosis is generated. The
              system traces backwards through the proof tree, displaying the sequence of rules and
              verified facts that justified the final conclusion.
            </p>
          </div>
        </Card>
      </section>

      {/* 14. Summary & Next Steps */}
      <section className="space-y-4 pt-4 border-t border-warm-200 dark:border-warm-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-semibold text-warm-500">
              Next: Case Study 1
            </span>
            <h3 className="text-lg font-bold text-warm-900 dark:text-warm-100">
              Case Study 1: Medical Diagnosis System
            </h3>
            <p className="text-xs text-warm-600 dark:text-warm-400">
              Put expert system theory into practice: experience a clinical consultation with full
              interactive &ldquo;Why&rdquo; and &ldquo;How&rdquo; explanation facilities.
            </p>
          </div>
          <Link to="/case-studies/medical-diagnosis">
            <Button variant="primary">Launch Medical Case Study &rarr;</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
