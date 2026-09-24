import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { UNIT4_QUESTION_BANK } from '@/features/quiz/unit4QuestionBank';
import { useProgressStore } from '@/features/progress/useProgressStore';
import { SeededRNG } from '@/utils/rng';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, XCircle, RotateCcw, ArrowLeft, Award, BookOpen } from 'lucide-react';

export function Unit4ExamPage() {
  const [examSeed, setExamSeed] = useState<number>(404);
  const [questions, setQuestions] = useState(UNIT4_QUESTION_BANK);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [timeLeftSec, setTimeLeftSec] = useState<number>(25 * 60); // 25 minutes for 20 questions
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  const recordQuizScore = useProgressStore((state) => state.recordQuizScore);

  // Initialize questions
  useEffect(() => {
    const rng = new SeededRNG(examSeed);
    const shuffled = rng.shuffle([...UNIT4_QUESTION_BANK]).slice(0, 20);
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
    recordQuizScore('u4-exam', pct, 70);

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
    setExamSeed((s) => s + 13);
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
          to="/learn/unit-4"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Unit 4 Directory
        </Link>
        <span className="text-neutral-600">/</span>
        <span className="text-xs font-mono text-neutral-300">Comprehensive Exam</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">MIT AOE Unit 4 Assessment</Badge>
            <Badge variant="default">20 Questions • 25 Mins</Badge>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-2">
            Unit 4: Instances &amp; Probabilistic Models Exam
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Validates CO2 (Probabilistic Formulation), CO3 (Evaluation &amp; Threshold Tuning), and
            CO4 (Model Analysis &amp; Tradeoffs).
          </p>
        </div>

        {/* Timer Box */}
        <div className="flex items-center gap-3 bg-neutral-900 border border-neutral-800 px-4 py-2 rounded-lg self-start sm:self-auto">
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
            <div>
              <div className="flex items-center gap-2">
                <Award className="size-6 text-amber-400" />
                <h2 className="text-xl font-bold text-foreground">
                  Exam Complete: {scoreStats.pct}%
                </h2>
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                You answered {scoreStats.correct} out of {scoreStats.total} questions correctly.
                {scoreStats.pct >= 70
                  ? ' Congratulations! You have achieved Unit 4 course outcome competency.'
                  : ' Review the detailed rationale feedback below and attempt a fresh session.'}
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRetake}
              className="gap-2 border-amber-900/50 hover:bg-amber-950/30 text-amber-200"
            >
              <RotateCcw className="size-3.5" />
              Retake Exam (New Seed)
            </Button>
          </div>

          {/* Outcome Breakdown Bars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
            {(['CO2', 'CO3', 'CO4'] as const).map((oc) => {
              const data = scoreStats.outcomeScores[oc] ?? { correct: 0, total: 1 };
              const ocPct = Math.round((data.correct / (data.total || 1)) * 100);
              const label =
                oc === 'CO2'
                  ? 'CO2: Probabilistic Models'
                  : oc === 'CO3'
                    ? 'CO3: Metrics & Thresholds'
                    : 'CO4: Strengths & Limits';

              return (
                <div
                  key={oc}
                  className="bg-neutral-900/60 p-3 rounded-lg border border-neutral-800"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-neutral-300">{label}</span>
                    <span className="font-mono text-amber-300 font-bold">{ocPct}%</span>
                  </div>
                  <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden mt-2">
                    <div
                      className={`h-full transition-all duration-500 ${
                        ocPct >= 70 ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${ocPct}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-neutral-500 font-mono mt-1 text-right">
                    {data.correct} / {data.total} passed
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Progress & Quick Stats Bar */}
      {!submitted && (
        <div className="flex items-center justify-between bg-neutral-900/40 border border-neutral-800/80 px-4 py-2.5 rounded-lg text-xs">
          <div className="flex items-center gap-2 text-neutral-400">
            <BookOpen className="size-4 text-amber-400" />
            <span>
              Progress: <strong className="text-neutral-200">{answeredCount}</strong> of{' '}
              {questions.length} answered
            </span>
          </div>
          <div className="w-32 bg-neutral-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full transition-all duration-300"
              style={{ width: `${(answeredCount / questions.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Question List */}
      <div className="space-y-6">
        {questions.map((q, index) => {
          const selected = selectedAnswers[q.id];
          const isAnswered = Boolean(selected);
          const correctOpt = q.options.find((o) => o.isCorrect);
          const isUserCorrect = submitted && selected === correctOpt?.id;

          return (
            <Card
              key={q.id}
              className={`p-6 transition-all border ${
                submitted
                  ? isUserCorrect
                    ? 'border-emerald-800/50 bg-emerald-950/10'
                    : 'border-red-900/50 bg-red-950/10'
                  : isAnswered
                    ? 'border-neutral-700 bg-neutral-900/40'
                    : 'border-border/60 bg-neutral-900/20'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-bold">
                    Q{index + 1}
                  </span>
                  <Badge variant="outline" className="text-[10px] font-mono border-neutral-800">
                    {q.topic}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-[10px] font-mono border-amber-900/40 text-amber-400"
                  >
                    {q.outcome}
                  </Badge>
                </div>

                {submitted && (
                  <div>
                    {isUserCorrect ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                        <CheckCircle2 className="size-4" /> Correct (+1)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-400">
                        <XCircle className="size-4" /> Incorrect (0)
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Question Text */}
              <p className="text-sm font-medium text-foreground mt-3 leading-relaxed">
                {q.question}
              </p>

              {/* Options */}
              <div className="space-y-2 mt-4">
                {q.options.map((opt) => {
                  const isChosen = selected === opt.id;
                  const isRight = opt.isCorrect;

                  let optStyle = 'border-neutral-800 hover:border-neutral-700 bg-neutral-900/40';

                  if (submitted) {
                    if (isRight) {
                      optStyle = 'border-emerald-600 bg-emerald-950/30 text-emerald-200';
                    } else if (isChosen && !isRight) {
                      optStyle = 'border-red-600 bg-red-950/30 text-red-200';
                    } else {
                      optStyle = 'border-neutral-800/40 bg-neutral-900/20 opacity-50';
                    }
                  } else if (isChosen) {
                    optStyle = 'border-amber-500 bg-amber-950/20 text-neutral-100';
                  }

                  return (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => handleSelect(q.id, opt.id)}
                      disabled={submitted}
                      className={`w-full text-left p-3.5 rounded-lg border text-xs transition-colors flex items-start gap-3 ${optStyle}`}
                    >
                      <span
                        className={`size-5 rounded flex items-center justify-center font-mono text-[11px] font-bold uppercase shrink-0 mt-0.5 ${
                          submitted
                            ? isRight
                              ? 'bg-emerald-600 text-white'
                              : isChosen
                                ? 'bg-red-600 text-white'
                                : 'bg-neutral-800 text-neutral-400'
                            : isChosen
                              ? 'bg-amber-500 text-neutral-950'
                              : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {opt.id}
                      </span>
                      <div className="flex-1">
                        <span className="leading-relaxed">{opt.text}</span>
                        {submitted && (isRight || isChosen) && (
                          <p className="mt-2 text-[11px] opacity-80 border-t border-white/10 pt-1.5">
                            <strong className="text-neutral-300">Rationale:</strong>{' '}
                            {opt.explanation}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Submission Footer */}
      {!submitted && (
        <div className="sticky bottom-6 flex items-center justify-between bg-neutral-950/90 border border-neutral-800 backdrop-blur-md p-4 rounded-xl shadow-2xl">
          <div className="text-xs text-neutral-400">
            {answeredCount === questions.length ? (
              <span className="text-emerald-400 font-medium">
                All 20 questions answered. Ready to submit!
              </span>
            ) : (
              <span>{questions.length - answeredCount} unanswered questions remaining.</span>
            )}
          </div>
          <Button
            variant="primary"
            onClick={handleSubmit}
            className="rounded-lg rounded-br-none bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-xs px-5"
          >
            Submit Exam &amp; Reveal Rationale
          </Button>
        </div>
      )}
    </div>
  );
}
