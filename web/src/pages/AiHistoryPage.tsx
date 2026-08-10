import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Callout } from '@/components/ui/Callout';
import { Quiz, QuizItem } from '@/features/quiz/Quiz';
import { useProgressStore } from '@/features/progress/useProgressStore';

interface Milestone {
  year: string;
  era: 'foundations' | 'symbolic' | 'winter' | 'expert' | 'deeplearning';
  title: string;
  pioneers: string;
  significance: string;
  keyLesson: string;
}

const MILESTONES: Milestone[] = [
  {
    year: '1950',
    era: 'foundations',
    title: 'The Imitation Game & The Turing Test',
    pioneers: 'Alan Turing',
    significance:
      'Proposed operational test for machine intelligence: Can a computer fool an interrogator into thinking it is human via conversational text?',
    keyLesson:
      'Shifted AI from intractable philosophical questions ("Can machines think?") to behavioral benchmarks.',
  },
  {
    year: '1956',
    era: 'foundations',
    title: 'The Dartmouth Summer Research Project',
    pioneers: 'John McCarthy, Marvin Minsky, Claude Shannon, Nathaniel Rochester',
    significance:
      'The official birth of AI as an academic discipline. Coined the phrase "Artificial Intelligence".',
    keyLesson:
      'Set the ambitious assertion that every aspect of learning can in principle be simulated by a machine.',
  },
  {
    year: '1966',
    era: 'symbolic',
    title: 'ELIZA: First Conversational Psychotherapist',
    pioneers: 'Joseph Weizenbaum (MIT)',
    significance:
      'Used simple keyword pattern matching and substitution to simulate a Rogerian psychotherapist.',
    keyLesson:
      'The "ELIZA Effect": Humans readily attribute genuine empathy and deep understanding to simple automated rules.',
  },
  {
    year: '1974',
    era: 'winter',
    title: 'The First AI Winter (1974–1980)',
    pioneers: 'Sir James Lighthill (Lighthill Report)',
    significance:
      'Government funding collapsed after early symbolic systems failed to scale due to combinatorial explosion.',
    keyLesson:
      'Combinatorial explosion cannot be solved by naive brute force without heuristic guidance.',
  },
  {
    year: '1980',
    era: 'expert',
    title: 'The Expert Systems Boom (1980–1987)',
    pioneers: 'Edward Feigenbaum, DEC (XCON)',
    significance:
      'Rule-based systems (MYCIN, XCON) saved companies tens of millions of dollars by encoding human expert knowledge into IF-THEN rules.',
    keyLesson:
      'Domain-specific knowledge delivers practical commercial value, but hand-crafted rules are brittle to maintain.',
  },
  {
    year: '1987',
    era: 'winter',
    title: 'The Second AI Winter (1987–1993)',
    pioneers: 'Market forces',
    significance:
      'Specialized Lisp hardware collapsed as general-purpose desktop PCs became faster and cheaper; expert systems proved too brittle to update.',
    keyLesson:
      'Knowledge acquisition bottleneck: human experts cannot easily articulate all tacit rules.',
  },
  {
    year: '1997',
    era: 'deeplearning',
    title: 'Deep Blue Defeats Garry Kasparov',
    pioneers: 'IBM Research',
    significance:
      'First time a computer program defeated the reigning World Chess Champion under tournament conditions.',
    keyLesson:
      'Massive parallel hardware combined with minimax alpha-beta search and grandmaster evaluation functions outperforms human intuition.',
  },
  {
    year: '2012',
    era: 'deeplearning',
    title: 'The Deep Learning Revolution (AlexNet)',
    pioneers: 'Alex Krizhevsky, Ilya Sutskever, Geoffrey Hinton',
    significance:
      'Convolutional neural network crushed traditional computer vision on ImageNet by a massive 10.8% margin, powered by GPUs and big data.',
    keyLesson:
      'Learned hierarchical representations from data beat hand-crafted symbolic features.',
  },
  {
    year: '2022',
    era: 'deeplearning',
    title: 'Foundation Models & Generative AI',
    pioneers: 'OpenAI, Google DeepMind, Anthropic',
    significance:
      'Self-attention Transformer architectures scaled to hundreds of billions of parameters exhibit emergent in-context learning.',
    keyLesson:
      'Scaling compute, data, and parameters yields general-purpose reasoning primitives across modalities.',
  },
];

export function AiHistoryPage() {
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone>(MILESTONES[0]!);
  const markRead = useProgressStore((state) => state.markRead);

  useEffect(() => {
    markRead('u1-history-foundations');
  }, [markRead]);

  const quizItems: QuizItem[] = [
    {
      id: 'q1',
      question:
        'At which historic workshop was the term "Artificial Intelligence" officially coined?',
      options: [
        {
          id: 'A',
          text: '1950 London Computing Conference',
          isCorrect: false,
          explanation: 'Turing published his paper in 1950, but did not coin the phrase AI.',
        },
        {
          id: 'B',
          text: '1956 Dartmouth Summer Research Project',
          isCorrect: true,
          explanation:
            'Organized by John McCarthy, Marvin Minsky, Claude Shannon, and Nathaniel Rochester.',
        },
        {
          id: 'C',
          text: '1966 MIT AI Lab Opening',
          isCorrect: false,
          explanation: 'ELIZA was created around 1966, a decade after AI was founded.',
        },
      ],
    },
    {
      id: 'q2',
      question: 'What triggered the "First AI Winter" in the mid-1970s?',
      options: [
        {
          id: 'A',
          text: 'Lighthill Report and failure of early symbolic systems to overcome combinatorial explosion in complex real-world tasks.',
          isCorrect: true,
          explanation:
            'The UK Lighthill Report (1973) and US DARPA cuts pulled funding due to unfulfilled promises and combinatorial scaling bottlenecks.',
        },
        {
          id: 'B',
          text: 'The rise of personal computers replacing mainframes.',
          isCorrect: false,
          explanation: 'The microcomputer boom occurred in the 1980s.',
        },
        {
          id: 'C',
          text: 'The ban on neural network research by international treaty.',
          isCorrect: false,
          explanation: 'There was never any treaty ban.',
        },
      ],
    },
    {
      id: 'q3',
      question:
        'What was the primary limitation of 1980s commercial Expert Systems (such as XCON)?',
      options: [
        {
          id: 'A',
          text: 'They could not run on digital computers.',
          isCorrect: false,
          explanation: 'They ran successfully on DEC VAX computers.',
        },
        {
          id: 'B',
          text: 'The "knowledge acquisition bottleneck" and brittleness: human rules were expensive to extract, hard to update, and failed on edge cases.',
          isCorrect: true,
          explanation:
            'Expert systems lack common sense and break catastrophically when encountering inputs outside their strict IF-THEN rules.',
        },
        {
          id: 'C',
          text: 'They relied entirely on deep neural networks.',
          isCorrect: false,
          explanation: 'Expert systems were strictly symbolic rule engines, not neural networks.',
        },
      ],
    },
    {
      id: 'q4',
      question:
        'What was Alan Turing’s primary insight in proposing the Imitation Game (Turing Test)?',
      options: [
        {
          id: 'A',
          text: 'To prove that computers possess a human soul.',
          isCorrect: false,
          explanation: 'Turing explicitly rejected theological arguments.',
        },
        {
          id: 'B',
          text: 'To replace vague philosophical debates about "thinking" with an objective, behavioral test of conversational indistinguishability.',
          isCorrect: true,
          explanation:
            'Turing argued that if a machine cannot be distinguished from a human by an interrogator via text, it demonstrates intelligent behavior.',
        },
        {
          id: 'C',
          text: 'To measure floating-point arithmetic speed.',
          isCorrect: false,
          explanation: 'Raw compute speed is not the Turing test.',
        },
      ],
    },
  ];

  return (
    <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
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
          <Badge variant="outline">Syllabus Topic: u1-history-foundations</Badge>
          <span className="flex items-center text-xs text-studio-500 ml-auto">
            <Clock className="h-3.5 w-3.5 mr-1" />
            12 min read & lab
          </span>
        </div>

        <h1 className="font-display text-3xl font-extrabold tracking-tight text-studio-900 dark:text-studio-50 sm:text-4xl">
          AI Foundations & The Great Evolution
        </h1>
        <p className="mt-3 text-lg text-studio-600 dark:text-studio-400">
          From Alan Turing’s 1950 imitation game through the AI winters to the modern foundation
          model era.
        </p>
      </header>

      {/* Hook */}
      <section className="mb-10">
        <div className="rounded-2xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent p-6 border-l-4 border-unit-1">
          <h2 className="font-display text-xl font-bold text-studio-900 dark:text-studio-100 mb-2">
            The 70-Year Pendulum
          </h2>
          <p className="text-base text-studio-700 dark:text-studio-300 leading-relaxed">
            In 1950, Alan Turing asked: <em>"Can machines think?"</em> For the next four decades,
            scientists attempted to program intelligence using pure symbolic logic and hand-written
            rules. Every attempt crashed against the wall of real-world messiness, plunging AI into
            two brutal "Winters." Why did symbolic AI fail, and why is today's statistical AI
            flourishing?
          </p>
        </div>
      </section>

      {/* Interactive Timeline Explorer */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-unit-1">
              Interactive Explorer
            </span>
            <h2 className="font-display text-2xl font-bold text-studio-900 dark:text-studio-100">
              The AI Timeline Explorer
            </h2>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-12 rounded-2xl border border-studio-200 bg-studio-50/70 p-5 dark:border-studio-800 dark:bg-studio-900/60 shadow-studio">
          {/* Timeline scrollbar */}
          <div className="md:col-span-5 space-y-2 max-h-[420px] overflow-y-auto pr-2">
            {MILESTONES.map((m) => (
              <button
                key={m.year + m.title}
                type="button"
                onClick={() => setSelectedMilestone(m)}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${
                  selectedMilestone.year === m.year
                    ? 'bg-unit-1 text-white border-unit-1 shadow-subtle'
                    : 'bg-white text-studio-800 border-studio-200 hover:bg-studio-100 dark:bg-studio-900 dark:text-studio-200 dark:border-studio-800'
                }`}
              >
                <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-black/10 dark:bg-white/10">
                  {m.year}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-xs truncate">{m.title}</p>
                  <p className="text-[11px] opacity-80 truncate">{m.pioneers}</p>
                </div>
                <ChevronRight className="h-4 w-4 opacity-60 self-center" />
              </button>
            ))}
          </div>

          {/* Selected Milestone Detail Card */}
          <div className="md:col-span-7 flex flex-col justify-between rounded-xl bg-white p-6 dark:bg-studio-950 border border-studio-200 dark:border-studio-800">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-2xl font-extrabold text-unit-1">
                  {selectedMilestone.year}
                </span>
                <Badge variant="outline" size="sm">
                  {selectedMilestone.era.toUpperCase()}
                </Badge>
              </div>

              <h3 className="font-display text-xl font-bold text-studio-900 dark:text-studio-50 mb-1">
                {selectedMilestone.title}
              </h3>
              <p className="text-xs text-studio-500 font-medium mb-4">
                Pioneers: {selectedMilestone.pioneers}
              </p>

              <div className="space-y-3 text-sm text-studio-700 dark:text-studio-300 leading-relaxed">
                <p>{selectedMilestone.significance}</p>
                <div className="rounded-lg bg-studio-100/70 p-3 dark:bg-studio-900 border border-studio-200 dark:border-studio-800 text-xs">
                  <span className="font-bold text-unit-1 mr-1">Historical Takeaway:</span>
                  {selectedMilestone.keyLesson}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conceptual Comparison: Symbolic vs Statistical AI */}
      <section className="mb-10">
        <h2 className="font-display text-2xl font-bold text-studio-900 dark:text-studio-100 mb-4">
          The Two Paridigms: Symbolic AI vs Statistical ML
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-studio-200 bg-white p-5 dark:border-studio-800 dark:bg-studio-900">
            <h3 className="font-display font-bold text-base text-studio-900 dark:text-studio-100 mb-2">
              Symbolic AI (GOFAI — Good Old-Fashioned AI)
            </h3>
            <ul className="text-xs text-studio-600 dark:text-studio-400 space-y-1.5 list-disc pl-4">
              <li>
                <strong>Philosophy:</strong> Intelligence is physical symbol manipulation (rules,
                logic, graphs).
              </li>
              <li>
                <strong>How it works:</strong> Humans write explicit IF-THEN rules; engine deducts
                conclusions.
              </li>
              <li>
                <strong>Strengths:</strong> 100% interpretable, verifiable, transparent proofs.
              </li>
              <li>
                <strong>Weakness:</strong> Fails completely on sensory data (pixels, audio, messy
                natural language).
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-studio-200 bg-white p-5 dark:border-studio-800 dark:bg-studio-900">
            <h3 className="font-display font-bold text-base text-studio-900 dark:text-studio-100 mb-2">
              Statistical Machine Learning (Connectionist)
            </h3>
            <ul className="text-xs text-studio-600 dark:text-studio-400 space-y-1.5 list-disc pl-4">
              <li>
                <strong>Philosophy:</strong> Intelligence emerges from statistical patterns in raw
                data.
              </li>
              <li>
                <strong>How it works:</strong> Machine learns numerical weights via optimization
                (gradient descent).
              </li>
              <li>
                <strong>Strengths:</strong> Tolerates noise, handles high-dimensional pixels/speech
                seamlessly.
              </li>
              <li>
                <strong>Weakness:</strong> Black-box opacity, hallucination, lack of formal
                verification.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Misconceptions */}
      <section className="mb-10">
        <h2 className="font-display text-2xl font-bold text-studio-900 dark:text-studio-100 mb-4">
          Common Misconceptions
        </h2>
        <div className="space-y-3">
          <Callout
            type="misconception"
            title="Misconception: 'The Turing test proves a machine is conscious'"
          >
            The Turing test is an operational test of{' '}
            <strong>behavioral indistinguishability</strong>, not subjective consciousness. A system
            can match human text output through statistics without experiencing subjective feelings.
          </Callout>
          <Callout
            type="misconception"
            title="Misconception: 'Symbolic AI is obsolete and useless today'"
          >
            False! Mission-critical avionics, medical drug interaction checking, and compiler
            verification rely on symbolic logic and SAT solvers because they provide{' '}
            <strong>100% mathematical guarantees</strong> that neural networks cannot offer.
          </Callout>
        </div>
      </section>

      {/* Quiz */}
      <section className="mb-10">
        <Quiz conceptId="u1-history-foundations" items={quizItems} unitAccent={1} />
      </section>

      {/* Exam & Viva */}
      <section className="mb-10">
        <h2 className="font-display text-2xl font-bold text-studio-900 dark:text-studio-100 mb-4">
          Exam & Viva Corner
        </h2>
        <div className="rounded-xl border border-studio-200 bg-white p-4 dark:border-studio-800 dark:bg-studio-900">
          <p className="font-bold text-sm text-studio-900 dark:text-studio-100 mb-1">
            Q1: Explain the Turing Test with a neat diagram. What are its limitations? [5 Marks]
          </p>
          <p className="text-xs text-studio-600 dark:text-studio-400 leading-relaxed">
            <strong>Model Answer Outline:</strong> Diagram shows interrogator (C) communicating via
            teletype with Human (B) and Machine (A). Explain the 30% threshold over 5-minute
            conversations. Limitations: tests linguistic imitation rather than true intelligence;
            vulnerable to conversational tricks (ELIZA effect); ignores visual perception and
            physical manipulation.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="rounded-2xl border border-studio-200 bg-studio-100 p-6 dark:border-studio-800 dark:bg-studio-900">
        <h3 className="font-display text-lg font-bold text-studio-900 dark:text-studio-50 mb-3">
          Summary & Key Takeaways
        </h3>
        <ul className="text-xs text-studio-700 dark:text-studio-300 space-y-1.5 list-disc pl-4 mb-6">
          <li>1950: Alan Turing introduced the imitation game benchmark.</li>
          <li>1956: Dartmouth workshop officially founded the field of Artificial Intelligence.</li>
          <li>
            Two AI Winters occurred (1974 & 1987) when overpromised systems hit combinatorial
            bottlenecks.
          </li>
          <li>
            Expert systems demonstrated commercial value in the 1980s but suffered from brittleness.
          </li>
          <li>
            2012–Present: Compute (GPUs) + Big Data + Deep Learning ignited the modern AI
            renaissance.
          </li>
        </ul>
        <div className="flex items-center justify-between border-t border-studio-200/80 pt-4 dark:border-studio-800">
          <Link
            to="/learn/unit-1"
            className="text-xs font-semibold text-studio-500 hover:text-studio-700"
          >
            ← Unit 1 Overview
          </Link>
          <Link
            to="/learn/unit-1/intelligent-agents"
            className="text-xs font-bold text-unit-1 hover:underline"
          >
            Next: Intelligent Agents & PEAS →
          </Link>
        </div>
      </footer>
    </article>
  );
}
