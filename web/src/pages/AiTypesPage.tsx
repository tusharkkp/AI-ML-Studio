import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Quiz, QuizItem } from '@/features/quiz/Quiz';
import { useProgressStore } from '@/features/progress/useProgressStore';

interface ClassifierItem {
  id: string;
  name: string;
  description: string;
  correctCategory: 'ANI' | 'AGI' | 'ASI';
  explanation: string;
}

const CLASSIFIER_ITEMS: ClassifierItem[] = [
  {
    id: '1',
    name: 'AlphaFold 3',
    description:
      'Predicts the 3D atomic structure of nearly all known biological molecules with astronomical precision.',
    correctCategory: 'ANI',
    explanation:
      'AlphaFold is superhuman at molecular modeling, but cannot read a bedtime story, play chess, or tie a shoelace. It is textbook Artificial Narrow Intelligence (ANI).',
  },
  {
    id: '2',
    name: 'Waymo Autonomous Driving System',
    description:
      'Safely navigates real-world urban city traffic in San Francisco and Phoenix without a safety driver.',
    correctCategory: 'ANI',
    explanation:
      'A driving system is specialized exclusively for vehicular trajectory planning and object avoidance. It cannot perform any task outside its road domain.',
  },
  {
    id: '3',
    name: 'Fictional "HAL 9000" (from 2001: A Space Odyssey)',
    description:
      'Operates spaceship life support, converses naturally, plays chess, lip-reads, and exhibits autonomous self-preservation goals.',
    correctCategory: 'AGI',
    explanation:
      'HAL demonstrates cross-domain human-level reasoning, emotional manipulation, and transfer learning across arbitrary tasks.',
  },
  {
    id: '4',
    name: 'Stockfish 16 (Chess Engine)',
    description:
      'Boasts an Elo rating of 3500+, easily destroying any human grandmaster in history.',
    correctCategory: 'ANI',
    explanation:
      'Superhuman chess performance does not equate to general intelligence; Stockfish cannot even play checkers unless rewritten from scratch.',
  },
];

export function AiTypesPage() {
  const [userSelections, setUserSelections] = useState<Record<string, 'ANI' | 'AGI' | 'ASI'>>({});
  const [submitted, setSubmitted] = useState(false);
  const markRead = useProgressStore((state) => state.markRead);

  useEffect(() => {
    markRead('u1-types-applications');
  }, [markRead]);

  const handleSelect = (itemId: string, cat: 'ANI' | 'AGI' | 'ASI') => {
    if (submitted) return;
    setUserSelections((prev) => ({ ...prev, [itemId]: cat }));
  };

  const calculateScore = () => {
    let correct = 0;
    CLASSIFIER_ITEMS.forEach((it) => {
      if (userSelections[it.id] === it.correctCategory) correct++;
    });
    return Math.round((correct / CLASSIFIER_ITEMS.length) * 100);
  };

  const quizItems: QuizItem[] = [
    {
      id: 'q1',
      question:
        'Which category encompasses 100% of all practical artificial intelligence deployed in the real world today?',
      options: [
        {
          id: 'A',
          text: 'Artificial General Intelligence (AGI)',
          isCorrect: false,
          explanation:
            'AGI (human-level flexible learning across arbitrary domains) has not yet been achieved.',
        },
        {
          id: 'B',
          text: 'Artificial Narrow Intelligence (ANI)',
          isCorrect: true,
          explanation:
            'All modern systems — including LLMs, facial recognition, recommendation engines, and medical imaging — are ANI systems specialized in pattern recognition.',
        },
        {
          id: 'C',
          text: 'Artificial Superintelligence (ASI)',
          isCorrect: false,
          explanation: 'ASI is a theoretical future capability.',
        },
      ],
    },
    {
      id: 'q2',
      question:
        'What is the hallmark capability that separates Artificial General Intelligence (AGI) from Artificial Narrow Intelligence (ANI)?',
      options: [
        {
          id: 'A',
          text: 'AGI uses GPUs while ANI uses CPUs.',
          isCorrect: false,
          explanation: 'Hardware compute is orthogonal to cognitive generality.',
        },
        {
          id: 'B',
          text: 'Transfer learning: the ability to apply knowledge learned in one domain to solve completely novel tasks without retraining.',
          isCorrect: true,
          explanation:
            'Generality is defined by flexible problem solving across unfamiliar environments without task-specific architectural redesign.',
        },
        {
          id: 'C',
          text: 'ANI requires electricity while AGI runs on solar energy.',
          isCorrect: false,
          explanation: 'Nonsense distractor.',
        },
      ],
    },
    {
      id: 'q3',
      question:
        'Why does an autonomous vehicle system like Waymo qualify as ANI despite having dozens of neural networks for vision, LiDAR, audio, and planning?',
      options: [
        {
          id: 'A',
          text: 'Because its capabilities are bound strictly to the domain of road navigation.',
          isCorrect: true,
          explanation:
            'A system with many sub-models is still Narrow if its collective purpose is confined to a single specialized task.',
        },
        {
          id: 'B',
          text: 'Because it cannot drive faster than 65 mph.',
          isCorrect: false,
          explanation: 'Speed limits are legal constraints, not intelligence classifications.',
        },
        {
          id: 'C',
          text: 'Because it does not utilize backpropagation.',
          isCorrect: false,
          explanation: 'Autonomous driving models heavily use backpropagation in training.',
        },
      ],
    },
    {
      id: 'q4',
      question: 'What is Nick Bostrom’s definition of Artificial Superintelligence (ASI)?',
      options: [
        {
          id: 'A',
          text: 'Any computer that has over 1 Petabyte of RAM.',
          isCorrect: false,
          explanation: 'Memory storage capacity is not intelligence.',
        },
        {
          id: 'B',
          text: 'An intellect that is much smarter than the best human brains in practically every field, including scientific creativity, general wisdom, and social skills.',
          isCorrect: true,
          explanation:
            'Bostrom formally defines ASI by comprehensive cognitive superiority across all domains.',
        },
        {
          id: 'C',
          text: 'An AI that can pass the Turing test in less than 1 second.',
          isCorrect: false,
          explanation: 'Response latency is not the definition of superintelligence.',
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
          <Badge variant="outline">Syllabus Topic: u1-types-applications</Badge>
          <span className="flex items-center text-xs text-studio-500 ml-auto">
            <Clock className="h-3.5 w-3.5 mr-1" />
            14 min read & lab
          </span>
        </div>

        <h1 className="font-display text-3xl font-extrabold tracking-tight text-studio-900 dark:text-studio-50 sm:text-4xl">
          Types & Applications of AI: ANI, AGI & ASI
        </h1>
        <p className="mt-3 text-lg text-studio-600 dark:text-studio-400">
          From single-task mastery to theoretical superintelligence: categorizing artificial
          cognitive systems.
        </p>
      </header>

      {/* Hook */}
      <section className="mb-10">
        <div className="rounded-2xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent p-6 border-l-4 border-unit-1">
          <h2 className="font-display text-xl font-bold text-studio-900 dark:text-studio-100 mb-2">
            The World Champion That Can't Play Tic-Tac-Toe
          </h2>
          <p className="text-base text-studio-700 dark:text-studio-300 leading-relaxed">
            In 2016, DeepMind’s AlphaGo played "Move 37" against 18-time world champion Lee Sedol —
            a move so creative it stunned master commentators. Yet, if you placed a 3×3 Tic-Tac-Toe
            board in front of AlphaGo, it could not make a single legal move. Why? Because AlphaGo
            is an <strong>Artificial Narrow Intelligence</strong>.
          </p>
        </div>
      </section>

      {/* Definitions Grid */}
      <section className="mb-12">
        <h2 className="font-display text-2xl font-bold text-studio-900 dark:text-studio-100 mb-4">
          The Three Tiers of Machine Intelligence
        </h2>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-sky-200 bg-sky-50/50 p-5 dark:border-sky-800 dark:bg-sky-950/20">
            <Badge variant="outline" size="sm" className="mb-2">
              TIER 1
            </Badge>
            <h3 className="font-display font-bold text-base text-sky-950 dark:text-sky-200 mb-1">
              ANI (Narrow AI)
            </h3>
            <p className="text-xs font-semibold text-sky-700 dark:text-sky-400 mb-2">
              Status: 100% of Today's AI
            </p>
            <p className="text-xs text-studio-600 dark:text-studio-400 leading-relaxed">
              Mastery over <em>one specific task</em>. Cannot generalize beyond its training
              distribution. Examples: Siri, ChatGPT, Tesla FSD, AlphaFold.
            </p>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5 dark:border-amber-800 dark:bg-amber-950/20">
            <Badge variant="outline" size="sm" className="mb-2">
              TIER 2
            </Badge>
            <h3 className="font-display font-bold text-base text-amber-950 dark:text-amber-200 mb-1">
              AGI (General AI)
            </h3>
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-2">
              Status: Active Research Frontier
            </p>
            <p className="text-xs text-studio-600 dark:text-studio-400 leading-relaxed">
              Human-level cognitive flexibility across <em>any intellectual task</em>. Learns
              without retraining, understands context, abstracts analogies.
            </p>
          </div>

          <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-5 dark:border-rose-800 dark:bg-rose-950/20">
            <Badge variant="outline" size="sm" className="mb-2">
              TIER 3
            </Badge>
            <h3 className="font-display font-bold text-base text-rose-950 dark:text-rose-200 mb-1">
              ASI (Superintelligence)
            </h3>
            <p className="text-xs font-semibold text-rose-700 dark:text-rose-400 mb-2">
              Status: Theoretical Future
            </p>
            <p className="text-xs text-studio-600 dark:text-studio-400 leading-relaxed">
              Intellect vastly superior to all combined human intelligence across scientific
              discovery, social wisdom, and strategic planning.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Sorter Lab */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-unit-1">
              Interactive Game
            </span>
            <h2 className="font-display text-2xl font-bold text-studio-900 dark:text-studio-100">
              The AI Classifier Challenge
            </h2>
          </div>
        </div>

        <p className="text-sm text-studio-600 dark:text-studio-400 mb-4">
          Test your conceptual understanding by categorizing these systems into ANI, AGI, or ASI:
        </p>

        <div className="rounded-2xl border border-studio-200 bg-studio-50/70 p-5 dark:border-studio-800 dark:bg-studio-900/60 shadow-studio space-y-4">
          <div className="divide-y divide-studio-200 dark:divide-studio-800">
            {CLASSIFIER_ITEMS.map((item) => {
              const selected = userSelections[item.id];
              const isCorrect = selected === item.correctCategory;

              return (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                    <div>
                      <h4 className="font-display font-bold text-sm text-studio-900 dark:text-studio-100">
                        {item.name}
                      </h4>
                      <p className="text-xs text-studio-600 dark:text-studio-400 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {(['ANI', 'AGI', 'ASI'] as const).map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          disabled={submitted}
                          onClick={() => handleSelect(item.id, cat)}
                          className={`px-3 py-1 text-xs font-mono font-bold rounded-lg border transition-all ${
                            selected === cat
                              ? 'bg-unit-1 text-white border-unit-1'
                              : 'bg-white text-studio-700 border-studio-200 hover:bg-studio-100 dark:bg-studio-900 dark:text-studio-300 dark:border-studio-700'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {submitted && (
                    <div
                      className={`mt-2 p-2.5 rounded-lg text-xs leading-relaxed flex items-start gap-2 ${
                        isCorrect
                          ? 'bg-emerald-100/70 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200'
                          : 'bg-rose-100/70 text-rose-900 dark:bg-rose-950/40 dark:text-rose-200'
                      }`}
                    >
                      {isCorrect ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="h-4 w-4 text-rose-600 flex-shrink-0 mt-0.5" />
                      )}
                      <span>
                        <strong>
                          {isCorrect ? 'Correct!' : `Actually ${item.correctCategory}:`}
                        </strong>{' '}
                        {item.explanation}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-studio-200 dark:border-studio-800 flex items-center justify-between">
            {!submitted ? (
              <Button
                variant="accent"
                size="sm"
                unitAccent={1}
                disabled={Object.keys(userSelections).length < CLASSIFIER_ITEMS.length}
                onClick={() => setSubmitted(true)}
              >
                Submit Classifications ({Object.keys(userSelections).length}/
                {CLASSIFIER_ITEMS.length})
              </Button>
            ) : (
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-studio-700 dark:text-studio-300">
                  Score: {calculateScore()}%
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setUserSelections({});
                    setSubmitted(false);
                  }}
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1" />
                  Try Again
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quiz */}
      <section className="mb-10">
        <Quiz conceptId="u1-types-applications" items={quizItems} unitAccent={1} />
      </section>

      {/* Exam & Viva */}
      <section className="mb-10">
        <h2 className="font-display text-2xl font-bold text-studio-900 dark:text-studio-100 mb-4">
          Exam & Viva Corner
        </h2>
        <div className="rounded-xl border border-studio-200 bg-white p-4 dark:border-studio-800 dark:bg-studio-900">
          <p className="font-bold text-sm text-studio-900 dark:text-studio-100 mb-1">
            Q1: Compare Narrow AI, General AI, and Superintelligence with examples. [5 Marks]
          </p>
          <p className="text-xs text-studio-600 dark:text-studio-400 leading-relaxed">
            <strong>Model Outline:</strong> Define ANI (dedicated single domain, e.g. AlphaFold,
            Siri); define AGI (human-comparable cross-domain flexibility, hypothetical); define ASI
            (exceeds all human cognition). Highlight that current commercial deployment is
            exclusively ANI.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="rounded-2xl border border-studio-200 bg-studio-100 p-6 dark:border-studio-800 dark:bg-studio-900">
        <h3 className="font-display text-lg font-bold text-studio-900 dark:text-studio-50 mb-3">
          Summary & Key Takeaways
        </h3>
        <ul className="text-xs text-studio-700 dark:text-studio-300 space-y-1.5 list-disc pl-4 mb-6">
          <li>ANI specializes in dedicated domains (chess, translation, protein folding).</li>
          <li>AGI refers to flexible, cross-domain human-level cognitive faculties.</li>
          <li>ASI denotes intelligence radically exceeding all human minds combined.</li>
          <li>Every existing AI model today is classified as Narrow AI.</li>
        </ul>
        <div className="flex items-center justify-between border-t border-studio-200/80 pt-4 dark:border-studio-800">
          <Link
            to="/learn/unit-1/history-foundations"
            className="text-xs font-semibold text-studio-500 hover:text-studio-700"
          >
            ← Foundations & History
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
