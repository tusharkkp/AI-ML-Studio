import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { UNIT3_QUESTION_BANK } from '@/features/quiz/unit3QuestionBank';
import { useProgressStore } from '@/features/progress/useProgressStore';
import { SeededRNG } from '@/utils/rng';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, XCircle, RotateCcw, ArrowLeft, Award, BookOpen } from 'lucide-react';

export function Unit3ExamPage() {
  const [examSeed, setExamSeed] = useState<number>(101);
  const [questions, setQuestions] = useState(UNIT3_QUESTION_BANK);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [timeLeftSec, setTimeLeftSec] = useState<number>(30 * 60); // 30 minutes for 20 questions
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  const recordQuizScore = useProgressStore((state) => state.recordQuizScore);

  // Initialize questions
  useEffect(() => {
    const rng = new SeededRNG(examSeed);
    const shuffled = rng.shuffle([...UNIT3_QUESTION_BANK]).slice(0, 20);
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
    recordQuizScore('u3-exam', correctCount, pct);

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
    setTimeLeftSec(30 * 60);
    setIsTimerRunning(true);
    setExamSeed((s) => s + 7);
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
      if (!outcomeScores[oc]) {
        outcomeScores[oc] = { correct: 0, total: 0 };
      }
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

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-8">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link
          to="/learn/unit-3"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Unit 3 Directory
        </Link>
        <span className="text-neutral-600">/</span>
        <span className="text-xs font-mono text-neutral-300">Comprehensive Exam</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">MIT AOE Unit 3 Assessment</Badge>
            <Badge variant="default">20 Questions • 30 Mins</Badge>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-2">
            Unit 3: ML Fundamentals Comprehensive Exam
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Validates CO2 (Formulation), CO3 (Optimization & Diagnostics), and CO4 (Applications &
            Evaluation).
          </p>
        </div>

        {/* Timer Box */}
        <div className="flex items-center gap-3 bg-neutral-900 border border-neutral-800 px-4 py-2 rounded-lg self-start sm:self-auto">
          <Clock
            className={`size-4 ${timeLeftSec < 300 ? 'text-red-400 animate-pulse' : 'text-brand'}`}
          />
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-neutral-500 font-mono">
              Time Remaining
            </div>
            <div
              className={`font-mono text-base font-bold ${timeLeftSec < 300 ? 'text-red-400' : 'text-neutral-100'}`}
            >
              {formatTime(timeLeftSec)}
            </div>
          </div>
        </div>
      </div>

      {/* Score Summary Banner if Submitted */}
      {submitted && (
        <Card className="p-6 border-brand/30 bg-neutral-950/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
            <div>
              <div className="flex items-center gap-2">
                <Award
                  className={`size-5 ${scoreStats.pct >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}
                />
                <h3 className="font-display text-lg font-bold text-foreground">
                  Exam Complete: {scoreStats.pct >= 70 ? 'Passed with Distinction' : 'Needs Review'}
                </h3>
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                You scored {scoreStats.correct} / {scoreStats.total} ({scoreStats.pct}%)
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetake}
                className="gap-1.5 text-xs"
              >
                <RotateCcw className="size-3.5" /> Retake Exam
              </Button>
              <Link to="/cheatsheets/unit-3">
                <Button variant="primary" size="sm" className="gap-1.5 text-xs">
                  <BookOpen className="size-3.5" /> Master Cheat Sheet
                </Button>
              </Link>
            </div>
          </div>

          {/* Outcome breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
            {Object.entries(scoreStats.outcomeScores).map(([outcome, data]) => {
              const p = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
              return (
                <div
                  key={outcome}
                  className="p-3 bg-neutral-900/60 rounded border border-neutral-800 text-xs"
                >
                  <div className="flex items-center justify-between text-neutral-400 font-mono">
                    <span>{outcome} Mastery</span>
                    <span className="font-bold text-foreground">{p}%</span>
                  </div>
                  <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full ${p >= 70 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                      style={{ width: `${p}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-1">
                    {data.correct} of {data.total} answered correctly
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Question List */}
      <div className="space-y-6">
        {questions.map((q, idx) => {
          const selected = selectedAnswers[q.id];
          const correctOpt = q.options.find((o) => o.isCorrect);
          const isCorrect = submitted && selected === correctOpt?.id;
          const isWrong = submitted && selected && selected !== correctOpt?.id;

          return (
            <Card
              key={q.id}
              className={`p-5 transition-colors ${
                submitted
                  ? isCorrect
                    ? 'border-emerald-500/40 bg-emerald-950/10'
                    : isWrong
                      ? 'border-red-500/40 bg-red-950/10'
                      : 'border-border/60'
                  : 'border-border/60'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-neutral-400">Q{idx + 1}.</span>
                  <Badge variant="outline" className="text-[10px] font-mono border-neutral-800">
                    {q.topic}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-[10px] font-mono border-neutral-800 text-brand"
                  >
                    {q.outcome}
                  </Badge>
                </div>
                {submitted && (
                  <div>
                    {isCorrect && (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-mono">
                        <CheckCircle2 className="size-3.5" /> +1 Mark
                      </span>
                    )}
                    {isWrong && (
                      <span className="inline-flex items-center gap-1 text-xs text-red-400 font-mono">
                        <XCircle className="size-3.5" /> 0 Marks
                      </span>
                    )}
                  </div>
                )}
              </div>

              <p className="text-sm font-medium text-foreground mt-3 leading-relaxed">
                {q.question}
              </p>

              {/* Options */}
              <div className="space-y-2 mt-4">
                {q.options.map((opt) => {
                  const isChecked = selected === opt.id;
                  let borderClass = 'border-neutral-800 hover:border-neutral-700 bg-neutral-900/40';

                  if (submitted) {
                    if (opt.isCorrect) {
                      borderClass = 'border-emerald-500/60 bg-emerald-950/20 text-emerald-200';
                    } else if (isChecked && !opt.isCorrect) {
                      borderClass = 'border-red-500/60 bg-red-950/20 text-red-200';
                    } else {
                      borderClass = 'border-neutral-800 opacity-60';
                    }
                  } else if (isChecked) {
                    borderClass = 'border-brand bg-brand/5 text-foreground';
                  }

                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelect(q.id, opt.id)}
                      className={`p-3 rounded-lg border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${borderClass}`}
                    >
                      <span className="font-mono font-bold uppercase text-[10px] mt-0.5 px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300">
                        {opt.id}
                      </span>
                      <div className="flex-1 leading-relaxed">{opt.text}</div>
                    </div>
                  );
                })}
              </div>

              {/* Explanation after submission */}
              {submitted && correctOpt && (
                <div className="mt-3 p-3 bg-neutral-900/80 rounded border border-neutral-800 text-xs text-neutral-300 space-y-1">
                  <div className="font-semibold text-neutral-200 flex items-center gap-1.5">
                    <BookOpen className="size-3.5 text-brand" /> Explanation:
                  </div>
                  <p className="leading-relaxed text-neutral-400">{correctOpt.explanation}</p>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Submit footer button */}
      {!submitted && (
        <div className="sticky bottom-6 bg-neutral-950/90 backdrop-blur border border-neutral-800 p-4 rounded-xl flex items-center justify-between shadow-2xl">
          <div className="text-xs text-neutral-400 font-mono">
            Answered: {Object.keys(selectedAnswers).length} of {questions.length} Questions
          </div>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={Object.keys(selectedAnswers).length === 0}
            className="px-6 text-sm"
          >
            Submit Final Exam
          </Button>
        </div>
      )}
    </div>
  );
}
