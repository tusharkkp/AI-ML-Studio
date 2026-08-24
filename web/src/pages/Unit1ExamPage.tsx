import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { UNIT1_QUESTION_BANK } from '@/features/quiz/unit1QuestionBank';
import { useProgressStore } from '@/features/progress/useProgressStore';
import { SeededRNG } from '@/utils/rng';
import { Link } from 'react-router-dom';

export function Unit1ExamPage() {
  const [examSeed, setExamSeed] = useState<number>(42);
  const [questions, setQuestions] = useState(UNIT1_QUESTION_BANK);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [timeLeftSec, setTimeLeftSec] = useState<number>(25 * 60); // 25 minutes
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  const recordQuizScore = useProgressStore((state) => state.recordQuizScore);

  // Initialize or shuffle questions
  useEffect(() => {
    // Pick 20 questions deterministically using SeededRNG
    const rng = new SeededRNG(42);
    const shuffled = rng.shuffle([...UNIT1_QUESTION_BANK]).slice(0, 20);
    setQuestions(shuffled);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!isTimerRunning || submitted) return;

    const timer = setInterval(() => {
      setTimeLeftSec((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerRunning, submitted]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelect = (qId: string, optId: string) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optId }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setIsTimerRunning(false);

    // Calculate score
    let score = 0;
    questions.forEach((q) => {
      const chosen = selectedAnswers[q.id];
      const correctOpt = q.options.find((o) => o.isCorrect)?.id;
      if (chosen === correctOpt) score++;
    });

    recordQuizScore('u1-exam', score, questions.length);

    if (score / questions.length >= 0.7) {
      void confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  // Score breakdown
  const calculateOutcomes = () => {
    let co1Total = 0;
    let co1Correct = 0;
    let co4Total = 0;
    let co4Correct = 0;

    questions.forEach((q) => {
      const chosen = selectedAnswers[q.id];
      const correctOpt = q.options.find((o) => o.isCorrect)?.id;
      const isRight = chosen === correctOpt;

      if (q.outcome === 'CO1') {
        co1Total++;
        if (isRight) co1Correct++;
      } else {
        co4Total++;
        if (isRight) co4Correct++;
      }
    });

    const totalCorrect = co1Correct + co4Correct;
    return {
      totalScore: totalCorrect,
      totalCount: questions.length,
      pct: Math.round((totalCorrect / questions.length) * 100),
      co1Pct: co1Total > 0 ? Math.round((co1Correct / co1Total) * 100) : 0,
      co4Pct: co4Total > 0 ? Math.round((co4Correct / co4Total) * 100) : 0,
    };
  };

  const results = submitted ? calculateOutcomes() : null;
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-warm-500">
        <Link to="/learn/unit-1" className="hover:text-warm-800 dark:hover:text-warm-200">
          Unit 1: Basics of AI
        </Link>
        <span>/</span>
        <span className="text-warm-900 dark:text-warm-100 font-semibold">
          Timed Unit 1 Examination
        </span>
      </nav>

      {/* Header & Live Timer Bar */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-warm-200 dark:border-warm-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="unit" unit={1}>
              Comprehensive Examination
            </Badge>
            <Badge variant="default">Unit 1 &bull; 20 Questions</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-warm-950 dark:text-warm-50 font-serif">
            Unit 1 Summative Assessment (CO1 &bull; CO4)
          </h1>
        </div>

        {!submitted && (
          <div className="flex items-center gap-3 bg-warm-100 dark:bg-warm-800/80 px-4 py-2 rounded-xl border border-warm-200 dark:border-warm-700">
            <span className="text-xs uppercase font-bold text-warm-500">Time Remaining:</span>
            <span
              className={`font-mono text-lg font-bold ${
                timeLeftSec < 300
                  ? 'text-rose-600 animate-pulse'
                  : 'text-warm-900 dark:text-warm-100'
              }`}
            >
              {formatTime(timeLeftSec)}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="text-xs"
            >
              {isTimerRunning ? 'Pause' : 'Resume'}
            </Button>
          </div>
        )}
      </header>

      {/* Results Scorecard (if submitted) */}
      {submitted && results && (
        <Card className="p-6 border-card-edge bg-card-fill backdrop-blur-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-warm-200 dark:border-warm-800 pb-4 mb-4">
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-warm-500">
                Examination Scorecard
              </span>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-4xl font-extrabold text-warm-950 dark:text-warm-50 font-serif">
                  {results.pct}%
                </span>
                <Badge variant={results.pct >= 60 ? 'success' : 'danger'} size="md">
                  {results.pct >= 60 ? 'PASSED &bull; CREDITS EARNED' : 'NEEDS REVISION (< 60%)'}
                </Badge>
              </div>
            </div>
            <div className="text-right text-xs font-mono text-warm-500">
              Score: {results.totalScore} of {results.totalCount} correct
            </div>
          </div>

          {/* Outcome Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-xs">
            <div className="p-4 rounded-xl bg-white dark:bg-warm-800 border border-warm-200 dark:border-warm-700">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-warm-900 dark:text-warm-100">
                  CO1: Perception, Logic &amp; Reasoning
                </span>
                <span className="font-mono font-bold text-accent-primary">{results.co1Pct}%</span>
              </div>
              <p className="text-[11px] text-warm-500 mb-2">
                Bloom Level L3: Applying formal logic, PEAS models, truth tables, and unification.
              </p>
              <div className="w-full bg-warm-200 dark:bg-warm-700 rounded-full h-1.5">
                <div
                  className="bg-accent-primary h-1.5 rounded-full"
                  style={{ width: `${results.co1Pct}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-warm-800 border border-warm-200 dark:border-warm-700">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-warm-900 dark:text-warm-100">
                  CO4: Strengths, Limits &amp; Ethics
                </span>
                <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                  {results.co4Pct}%
                </span>
              </div>
              <p className="text-[11px] text-warm-500 mb-2">
                Bloom Level L4: Critical analysis of agent limits, expert systems, and societal
                impact.
              </p>
              <div className="w-full bg-warm-200 dark:bg-warm-700 rounded-full h-1.5">
                <div
                  className="bg-purple-600 h-1.5 rounded-full"
                  style={{ width: `${results.co4Pct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <Link to="/cheatsheets/unit-1">
              <Button variant="outline" size="sm">
                Download Revision Cheat Sheet
              </Button>
            </Link>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setSubmitted(false);
                setSelectedAnswers({});
                setTimeLeftSec(25 * 60);
                setIsTimerRunning(true);
                const nextSeed = examSeed + 1;
                setExamSeed(nextSeed);
                const rng = new SeededRNG(nextSeed);
                const shuffled = rng.shuffle([...UNIT1_QUESTION_BANK]).slice(0, 20);
                setQuestions(shuffled);
              }}
            >
              Retake Exam (New Questions)
            </Button>
          </div>
        </Card>
      )}

      {/* Answer Progress Tracker */}
      {!submitted && (
        <div className="flex items-center justify-between text-xs text-warm-600 dark:text-warm-400 border border-warm-200 dark:border-warm-800 p-3 rounded-lg bg-warm-50 dark:bg-warm-850">
          <span>
            Questions Answered: <strong>{answeredCount}</strong> of{' '}
            <strong>{questions.length}</strong>
          </span>
          <Button size="sm" variant="primary" disabled={answeredCount === 0} onClick={handleSubmit}>
            Submit Final Exam &rarr;
          </Button>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-6">
        {questions.map((q, idx) => {
          const chosenOpt = selectedAnswers[q.id];
          const correctOpt = q.options.find((o) => o.isCorrect)?.id;
          const isCorrect = chosenOpt === correctOpt;

          return (
            <Card
              key={q.id}
              className={`p-5 border transition-all ${
                submitted
                  ? isCorrect
                    ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/20 dark:bg-emerald-950/20'
                    : 'border-rose-300 dark:border-rose-800 bg-rose-50/20 dark:bg-rose-950/20'
                  : 'border-warm-200 dark:border-warm-800 bg-white dark:bg-warm-900/40'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-warm-400 font-mono">Q{idx + 1}</span>
                  <Badge variant="default" size="sm">
                    {q.topic}
                  </Badge>
                  <Badge variant="unit" unit={1} size="sm">
                    {q.outcome}
                  </Badge>
                </div>
                {submitted && (
                  <Badge variant={isCorrect ? 'success' : 'danger'} size="sm">
                    {isCorrect ? '✓ Correct (+1)' : '✗ Incorrect (0)'}
                  </Badge>
                )}
              </div>

              <h3 className="text-sm font-bold text-warm-900 dark:text-warm-100 mb-4 leading-relaxed">
                {q.question}
              </h3>

              <div className="space-y-2">
                {q.options.map((opt) => {
                  const isSelected = chosenOpt === opt.id;
                  let optStyle =
                    'border-warm-200 dark:border-warm-800 hover:border-warm-400 bg-warm-50 dark:bg-warm-800/40 text-warm-800 dark:text-warm-200';

                  if (submitted) {
                    if (opt.isCorrect) {
                      optStyle =
                        'border-emerald-500 bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-100 font-bold';
                    } else if (isSelected && !opt.isCorrect) {
                      optStyle =
                        'border-rose-500 bg-rose-100/70 dark:bg-rose-950/60 text-rose-950 dark:text-rose-100';
                    }
                  } else if (isSelected) {
                    optStyle =
                      'border-accent-primary bg-accent-primary/10 text-accent-primary font-bold';
                  }

                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelect(q.id, opt.id)}
                      className={`p-3 rounded-lg border text-xs cursor-pointer transition-colors flex items-start gap-2.5 ${optStyle}`}
                    >
                      <span className="font-mono uppercase font-bold shrink-0">{opt.id})</span>
                      <div className="flex-1">
                        <p>{opt.text}</p>
                        {submitted && (isSelected || opt.isCorrect) && (
                          <p className="mt-1 text-[11px] opacity-90 font-normal">
                            <em>Explanation:</em> {opt.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Bottom Submit Button */}
      {!submitted && (
        <div className="flex justify-end pt-4 border-t border-warm-200 dark:border-warm-800">
          <Button size="lg" variant="primary" onClick={handleSubmit}>
            Submit All {questions.length} Answers &rarr;
          </Button>
        </div>
      )}
    </div>
  );
}
