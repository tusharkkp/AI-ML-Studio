import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { UNIT2_QUESTION_BANK } from '@/features/quiz/unit2QuestionBank';
import { useProgressStore } from '@/features/progress/useProgressStore';
import { SeededRNG } from '@/utils/rng';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, XCircle, RotateCcw, ArrowLeft, Award, BookOpen } from 'lucide-react';

export function Unit2ExamPage() {
  const [examSeed, setExamSeed] = useState<number>(42);
  const [questions, setQuestions] = useState(UNIT2_QUESTION_BANK);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [timeLeftSec, setTimeLeftSec] = useState<number>(25 * 60); // 25 minutes
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  const recordQuizScore = useProgressStore((state) => state.recordQuizScore);

  // Initialize questions
  useEffect(() => {
    const rng = new SeededRNG(examSeed);
    const shuffled = rng.shuffle([...UNIT2_QUESTION_BANK]).slice(0, 20);
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

    // Calculate score
    let score = 0;
    questions.forEach((q) => {
      const selected = selectedAnswers[q.id];
      const correct = q.options.find((opt) => opt.isCorrect)?.id;
      if (selected && selected === correct) {
        score++;
      }
    });

    const percent = Math.round((score / questions.length) * 100);
    recordQuizScore('u2-exam', percent);

    if (percent >= 70) {
      try {
        void confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Safe confetti fallback
      }
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setTimeLeftSec(25 * 60);
    setIsTimerRunning(true);
    setExamSeed((prev) => prev + 1);
  };

  // Outcome score breakdowns
  const co1Total = questions.filter((q) => q.outcome === 'CO1').length;
  const co4Total = questions.filter((q) => q.outcome === 'CO4').length;

  let co1Correct = 0;
  let co4Correct = 0;
  let totalScore = 0;

  questions.forEach((q) => {
    const selected = selectedAnswers[q.id];
    const correct = q.options.find((opt) => opt.isCorrect)?.id;
    if (selected && selected === correct) {
      totalScore++;
      if (q.outcome === 'CO1') co1Correct++;
      if (q.outcome === 'CO4') co4Correct++;
    }
  });

  const percentage = Math.round((totalScore / questions.length) * 100);
  const isPassed = percentage >= 70;
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="min-h-screen bg-[#0c0a09] text-stone-300 antialiased py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/learn/unit-2"
            className="inline-flex items-center gap-2 text-xs font-medium text-stone-400 hover:text-[#fef3c7] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Unit 2 Overview
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="unit">Unit 2</Badge>
            <Badge variant="default">Comprehensive Exam</Badge>
            <span className="text-xs text-stone-500 font-mono">20 Questions</span>
          </div>
        </div>

        {/* Header & Exam Status Bar */}
        <header className="space-y-4 border-b border-[#292524] pb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white font-heading">
                Unit 2 Final Examination
              </h1>
              <p className="text-sm text-stone-400 mt-1">
                AI Search Strategies, Constraint Satisfaction, Adversarial Games, and Genetic
                Optimization.
              </p>
            </div>

            {/* Timer and Progress Box */}
            <div className="flex items-center gap-4 bg-[#141210] border border-[#292524] px-4 py-2.5 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock
                  className={`w-4 h-4 ${timeLeftSec < 300 ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`}
                />
                <span className="font-mono text-sm font-bold text-white">
                  {formatTime(timeLeftSec)}
                </span>
              </div>
              <div className="h-4 w-[1px] bg-stone-700" />
              <div className="text-xs text-stone-400">
                <span className="font-semibold text-white">{answeredCount}</span> of 20 answered
              </div>
            </div>
          </div>
        </header>

        {/* Results Card (Visible upon submission) */}
        {submitted && (
          <Card
            className={`p-6 border ${isPassed ? 'bg-emerald-950/20 border-emerald-800/60' : 'bg-rose-950/20 border-rose-800/60'}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-[#292524]">
              <div className="flex items-center gap-3">
                <Award className={`w-8 h-8 ${isPassed ? 'text-emerald-400' : 'text-rose-400'}`} />
                <div>
                  <h2 className="text-xl font-bold text-white font-heading">
                    {isPassed ? 'Examination Passed!' : 'Requires Review'}
                  </h2>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Passing threshold is 70% (14/20). Your score:{' '}
                    <span className="font-bold text-white">
                      {totalScore}/20 ({percentage}%)
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleRetake} className="text-xs">
                  <RotateCcw className="w-3.5 h-3.5 mr-1" /> Retake Exam
                </Button>
                <Link to="/cheatsheets/unit-2">
                  <Button variant="primary" size="sm" className="text-xs">
                    <BookOpen className="w-3.5 h-3.5 mr-1" /> Open Unit 2 Cheat Sheet
                  </Button>
                </Link>
              </div>
            </div>

            {/* Course Outcomes Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-[#110f0e] rounded border border-[#292524]">
                <div className="flex justify-between font-semibold text-stone-200 mb-1">
                  <span>CO1: Search, Reasoning & CSP</span>
                  <span className="font-mono text-amber-400">
                    {co1Correct} / {co1Total}
                  </span>
                </div>
                <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full"
                    style={{ width: `${co1Total > 0 ? (co1Correct / co1Total) * 100 : 0}%` }}
                  />
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Problem formulation, A* consistency, CSP AC-3, Minimax alpha-beta.
                </p>
              </div>

              <div className="p-3 bg-[#110f0e] rounded border border-[#292524]">
                <div className="flex justify-between font-semibold text-stone-200 mb-1">
                  <span>CO4: Strengths & Algorithmic Limits</span>
                  <span className="font-mono text-sky-400">
                    {co4Correct} / {co4Total}
                  </span>
                </div>
                <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-sky-400 h-full"
                    style={{ width: `${co4Total > 0 ? (co4Correct / co4Total) * 100 : 0}%` }}
                  />
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  BFS vs DFS trade-offs, horizon effect, schema theorem, game theory.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Question List */}
        <div className="space-y-6">
          {questions.map((q, idx) => {
            const selectedOptId = selectedAnswers[q.id];
            const correctOpt = q.options.find((opt) => opt.isCorrect);
            const isCorrect = selectedOptId === correctOpt?.id;

            return (
              <Card
                key={q.id}
                className={`p-6 bg-[#171412] border transition-colors ${
                  submitted
                    ? isCorrect
                      ? 'border-emerald-800/60 bg-emerald-950/10'
                      : 'border-rose-800/60 bg-rose-950/10'
                    : 'border-[#292524]'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400">Q{idx + 1}.</span>
                    <Badge variant="unit">{q.topic}</Badge>
                    <Badge variant="default">{q.outcome}</Badge>
                  </div>
                  {submitted && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold">
                      {isCorrect ? (
                        <span className="flex items-center gap-1 text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" /> Correct (+1)
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-rose-400">
                          <XCircle className="w-4 h-4" /> Incorrect (0)
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <p className="text-sm text-stone-200 font-medium leading-relaxed mb-4">
                  {q.question}
                </p>

                {/* Options */}
                <div className="space-y-2">
                  {q.options.map((opt) => {
                    const isSelected = selectedOptId === opt.id;
                    let optStyle =
                      'bg-[#141210] border-[#292524] text-stone-300 hover:border-stone-700';

                    if (submitted) {
                      if (opt.isCorrect) {
                        optStyle = 'bg-emerald-950/40 border-emerald-700 text-white font-medium';
                      } else if (isSelected) {
                        optStyle = 'bg-rose-950/40 border-rose-700 text-stone-300 line-through';
                      } else {
                        optStyle = 'bg-[#141210] border-[#292524] opacity-50';
                      }
                    } else if (isSelected) {
                      optStyle = 'bg-[#1f1b18] border-stone-400 text-white font-medium';
                    }

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        disabled={submitted}
                        onClick={() => handleSelect(q.id, opt.id)}
                        className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-start gap-3 ${optStyle}`}
                      >
                        <span className="font-mono uppercase font-semibold text-stone-400 mt-0.5">
                          {opt.id}.
                        </span>
                        <div className="flex-1 leading-relaxed">{opt.text}</div>
                      </button>
                    );
                  })}
                </div>

                {/* Answer Explanation (Post-submission) */}
                {submitted && (
                  <div className="mt-4 p-3 bg-[#110f0e] rounded border border-[#292524] text-xs leading-relaxed space-y-1.5">
                    <div className="font-semibold text-stone-200">Rationale & Explanation:</div>
                    <p className="text-stone-400">{correctOpt?.explanation}</p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Submit Bar */}
        {!submitted && (
          <div className="sticky bottom-4 bg-[#141210] border border-[#292524] p-4 rounded-xl flex items-center justify-between gap-4 shadow-2xl">
            <div className="text-xs text-stone-400">
              <span className="font-bold text-white">{answeredCount}</span> of 20 questions
              answered.
              {answeredCount < 20 && (
                <span className="text-amber-400 ml-1.5">({20 - answeredCount} unanswered)</span>
              )}
            </div>
            <Button variant="primary" size="md" onClick={handleSubmit} className="text-xs">
              Submit Unit 2 Examination
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
