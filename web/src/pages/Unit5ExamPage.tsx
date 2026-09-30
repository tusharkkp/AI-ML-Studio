import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { UNIT5_QUESTION_BANK } from '@/features/quiz/unit5QuestionBank';
import { useProgressStore } from '@/features/progress/useProgressStore';
import { SeededRNG } from '@/utils/rng';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, XCircle, RotateCcw, ArrowLeft, Award, BookOpen } from 'lucide-react';

export function Unit5ExamPage() {
  const [examSeed, setExamSeed] = useState<number>(505);
  const [questions, setQuestions] = useState(UNIT5_QUESTION_BANK);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [timeLeftSec, setTimeLeftSec] = useState<number>(25 * 60); // 25 minutes for 20 questions
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  const recordQuizScore = useProgressStore((state) => state.recordQuizScore);

  // Initialize questions
  useEffect(() => {
    const rng = new SeededRNG(examSeed);
    const shuffled = rng.shuffle([...UNIT5_QUESTION_BANK]).slice(0, 20);
    setQuestions(shuffled);
  }, [examSeed]);

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

    let correctCount = 0;
    questions.forEach((q) => {
      const chosen = selectedAnswers[q.id];
      const correctOpt = q.options.find((o) => o.isCorrect);
      if (chosen && correctOpt && chosen === correctOpt.id) {
        correctCount++;
      }
    });

    const pct = Math.round((correctCount / questions.length) * 100);
    recordQuizScore('u5-exam', pct, 70);

    if (pct >= 70) {
      void confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleRetake = () => {
    setSubmitted(false);
    setSelectedAnswers({});
    setTimeLeftSec(25 * 60);
    setIsTimerRunning(true);
    setExamSeed((s) => s + 17);
  };

  // Outcome score tracking
  const scoreStats = (() => {
    let correct = 0;
    const outcomeScores: Record<string, { correct: number; total: number }> = {
      CO2: { correct: 0, total: 0 },
      CO3: { correct: 0, total: 0 },
      CO4: { correct: 0, total: 0 },
    };

    questions.forEach((q) => {
      const chosen = selectedAnswers[q.id];
      const correctOpt = q.options.find((o) => o.isCorrect);
      const isRight = Boolean(chosen && correctOpt && chosen === correctOpt.id);

      if (isRight) correct++;

      const oc = q.outcome || 'CO2';
      const targetScore = outcomeScores[oc];
      if (targetScore) {
        targetScore.total++;
        if (isRight) targetScore.correct++;
      }
    });

    return {
      correct,
      total: questions.length,
      pct: Math.round((correct / (questions.length || 1)) * 100),
      outcomeScores,
    };
  })();

  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-8">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link
          to="/learn/unit-5"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Unit 5 Directory
        </Link>
        <span className="text-neutral-600">/</span>
        <span className="text-xs font-mono text-neutral-300">Comprehensive Exam</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-orange-50/15">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">MIT AOE Unit 5 Assessment</Badge>
            <Badge variant="default">20 Questions • 25 Mins</Badge>
          </div>
          <h1 className="font-manrope text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-2">
            Unit 5: Linear &amp; decision models comprehensive exam
          </h1>
          <p className="text-xs text-neutral-400 font-montserrat mt-1">
            Validates CO2 (Trees, SVM Hyperplanes, Kernels), CO3 (Pruning, Soft Margins, Random
            Forests), and CO4 (Ensemble Ambiguity, Stacking Leakage, Clinical Evaluation).
          </p>
        </div>

        {/* Timer Box */}
        <div className="flex items-center gap-3 bg-neutral-900 border border-orange-50/10 px-4 py-2 rounded-lg self-start sm:self-auto">
          <Clock
            className={`size-4 ${timeLeftSec < 300 ? 'text-red-400 animate-pulse' : 'text-amber-400'}`}
          />
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-neutral-500 font-mono">
              Time Remaining
            </div>
            <div
              className={`font-mono text-base font-bold ${
                timeLeftSec < 300 ? 'text-red-400' : 'text-neutral-100'
              }`}
            >
              {formatTime(timeLeftSec)}
            </div>
          </div>
        </div>
      </div>

      {/* Score Summary Banner if Submitted */}
      {submitted && (
        <Card className="p-6 border-amber-900/40 bg-neutral-950/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-orange-50/10">
            <div>
              <div className="flex items-center gap-2">
                <Award
                  className={`size-6 ${scoreStats.pct >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}
                />
                <span className="text-xl font-bold text-neutral-100 font-manrope">
                  {scoreStats.pct >= 70 ? 'Examination Passed!' : 'Review Recommended'}
                </span>
                <Badge variant={scoreStats.pct >= 70 ? 'success' : 'warning'}>
                  {scoreStats.pct}% Score
                </Badge>
              </div>
              <p className="text-xs text-neutral-400 mt-1 font-montserrat">
                You scored {scoreStats.correct} out of {scoreStats.total} questions correctly.
                Passing threshold is 70%.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetake}
                className="flex items-center gap-1.5"
              >
                <RotateCcw className="size-3.5" />
                Retake Exam
              </Button>
              <Link to="/cheatsheets/unit-5">
                <Button variant="primary" size="sm" className="flex items-center gap-1.5">
                  <BookOpen className="size-3.5" />
                  Unit 5 Cheat Sheet
                </Button>
              </Link>
            </div>
          </div>

          {/* Outcome Score Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            {Object.entries(scoreStats.outcomeScores).map(([co, val]) => {
              const coPct = val.total > 0 ? Math.round((val.correct / val.total) * 100) : 0;
              return (
                <div key={co} className="p-3 bg-neutral-900/60 rounded border border-orange-50/10">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-neutral-400">{co} Mastery</span>
                    <span className="font-bold text-neutral-200">
                      {val.correct}/{val.total} ({coPct}%)
                    </span>
                  </div>
                  <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        coPct >= 70 ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${coPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Questions List */}
      <div className="space-y-6">
        {questions.map((q, idx) => {
          const chosenOpt = selectedAnswers[q.id];
          const isAnswered = Boolean(chosenOpt);

          return (
            <Card
              key={q.id}
              className={`p-6 border transition-colors ${
                submitted
                  ? chosenOpt === q.options.find((o) => o.isCorrect)?.id
                    ? 'border-emerald-500/40 bg-emerald-950/10'
                    : 'border-red-500/40 bg-red-950/10'
                  : isAnswered
                    ? 'border-orange-50/30 bg-neutral-900/40'
                    : 'border-orange-50/10 bg-neutral-900/20'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-neutral-500">
                    Q{String(idx + 1).padStart(2, '0')}
                  </span>
                  <Badge variant="outline" size="sm">
                    {q.outcome}
                  </Badge>
                  <span className="text-xs font-mono text-neutral-400">{q.topic}</span>
                </div>

                {submitted && (
                  <div>
                    {chosenOpt === q.options.find((o) => o.isCorrect)?.id ? (
                      <span className="flex items-center gap-1 text-xs text-emerald-400 font-mono">
                        <CheckCircle2 className="size-3.5" /> Correct (+1)
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-red-400 font-mono">
                        <XCircle className="size-3.5" /> Incorrect
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Question Text */}
              <p className="text-sm font-semibold text-neutral-100 font-montserrat leading-relaxed mb-4">
                {q.question}
              </p>

              {/* Options */}
              <div className="space-y-2">
                {q.options.map((opt) => {
                  const isSelected = chosenOpt === opt.id;
                  const showCorrect = submitted && opt.isCorrect;
                  const showWrong = submitted && isSelected && !opt.isCorrect;

                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelect(q.id, opt.id)}
                      className={`p-3 rounded-lg border text-xs font-montserrat transition-all cursor-pointer ${
                        showCorrect
                          ? 'border-emerald-500/60 bg-emerald-950/40 text-emerald-200 font-medium'
                          : showWrong
                            ? 'border-red-500/60 bg-red-950/40 text-red-200'
                            : isSelected
                              ? 'border-brand bg-brand/10 text-white font-medium'
                              : 'border-orange-50/10 bg-black/20 text-neutral-400 hover:text-neutral-200 hover:border-orange-50/20'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="font-mono font-bold uppercase text-neutral-500 mt-0.5">
                          {opt.id}.
                        </span>
                        <div className="flex-1 leading-relaxed">
                          <div>{opt.text}</div>
                          {submitted && (showCorrect || showWrong) && (
                            <p className="text-[11px] text-neutral-400 mt-1.5 font-sans pt-1 border-t border-orange-50/10">
                              <span className="font-semibold text-neutral-300">Explanation:</span>{' '}
                              {opt.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Bottom Sticky Action Bar */}
      {!submitted && (
        <div className="sticky bottom-4 bg-neutral-900/90 backdrop-blur-md p-4 rounded-xl border border-orange-50/15 flex items-center justify-between">
          <div className="text-xs font-mono text-neutral-400">
            Answered <span className="text-neutral-100 font-bold">{answeredCount}</span> of{' '}
            <span className="text-neutral-100 font-bold">{questions.length}</span> questions
          </div>
          <Button
            variant="primary"
            disabled={answeredCount === 0}
            onClick={handleSubmit}
            className="text-xs"
          >
            Submit Unit 5 Examination
          </Button>
        </div>
      )}
    </div>
  );
}
