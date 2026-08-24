import { useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, RotateCcw, Award } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useProgressStore } from '@/features/progress/useProgressStore';

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface QuizItem {
  id: string;
  question: string;
  codeSnippet?: string;
  options: QuizOption[];
  bloomLevel?: 'remember' | 'understand' | 'apply' | 'analyze';
}

export interface QuizProps {
  conceptId: string;
  items: QuizItem[];
  unitAccent?: 1 | 2 | 3 | 4 | 5 | 6;
  onPass?: () => void;
}

export function Quiz({ conceptId, items, unitAccent = 2, onPass }: QuizProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const recordQuizScore = useProgressStore((state) => state.recordQuizScore);

  const totalQuestions = items.length;
  const answeredCount = Object.keys(selectedAnswers).length;

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    items.forEach((item) => {
      const selectedId = selectedAnswers[item.id];
      const correctOption = item.options.find((opt) => opt.isCorrect);
      if (selectedId && correctOption && selectedId === correctOption.id) {
        correct++;
      }
    });
    return Math.round((correct / totalQuestions) * 100);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const score = calculateScore();
    recordQuizScore(conceptId, score);

    if (score === 100) {
      try {
        void confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {
        // ignore if canvas not supported
      }
    }

    if (score >= 75) {
      onPass?.();
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  const score = submitted ? calculateScore() : 0;
  const isPassed = score >= 75;

  return (
    <div className="my-8 rounded-2xl border border-card-edge bg-card-fill backdrop-blur-sm p-6">
      <div className="flex items-center justify-between border-b border-card-edge pb-4">
        <div>
          <span className="text-xs font-mono text-neutral-500">Knowledge check</span>
          <h3 className="font-montserrat text-xl font-semibold text-foreground">Check Yourself</h3>
        </div>
        <span className="text-xs font-medium text-studio-500">
          {answeredCount} of {totalQuestions} answered
        </span>
      </div>

      {/* Quiz questions */}
      <div className="divide-y divide-studio-100 dark:divide-studio-800">
        {items.map((item, qIdx) => {
          const selectedOptionId = selectedAnswers[item.id];

          return (
            <div key={item.id} className="py-6 first:pt-4 last:pb-2">
              <p className="font-display font-semibold text-studio-900 dark:text-studio-100 mb-3 text-base">
                <span className="font-mono text-studio-400 mr-2">{qIdx + 1}.</span>
                {item.question}
              </p>

              {item.codeSnippet && (
                <pre className="mb-4 rounded-lg bg-studio-950 p-3 font-mono text-xs text-studio-200 overflow-x-auto">
                  {item.codeSnippet}
                </pre>
              )}

              {/* Options */}
              <div className="space-y-2.5">
                {item.options.map((option) => {
                  const isSelected = selectedOptionId === option.id;
                  let optionStyle =
                    'border-studio-200 hover:border-studio-300 bg-studio-50/50 dark:border-studio-800 dark:bg-studio-800/30 text-studio-800 dark:text-studio-200';

                  if (submitted) {
                    if (option.isCorrect) {
                      optionStyle =
                        'border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200 font-medium';
                    } else if (isSelected && !option.isCorrect) {
                      optionStyle =
                        'border-rose-500 bg-rose-50 text-rose-900 dark:bg-rose-950/40 dark:text-rose-200';
                    } else {
                      optionStyle = 'opacity-50 border-studio-200 dark:border-studio-800';
                    }
                  } else if (isSelected) {
                    optionStyle =
                      'border-unit-2 bg-unit-2/5 text-unit-2 dark:bg-unit-2/10 font-medium ring-1 ring-unit-2';
                  }

                  return (
                    <div key={option.id} className="flex flex-col">
                      <button
                        type="button"
                        disabled={submitted}
                        onClick={() => handleSelectOption(item.id, option.id)}
                        className={`flex items-start text-left w-full p-3.5 rounded-xl border transition-all text-sm leading-relaxed ${optionStyle}`}
                      >
                        <span className="mr-3 font-mono font-bold text-xs uppercase opacity-75">
                          {option.id}.
                        </span>
                        <span className="flex-1">{option.text}</span>
                        {submitted && option.isCorrect && (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 ml-2 flex-shrink-0" />
                        )}
                        {submitted && isSelected && !option.isCorrect && (
                          <XCircle className="h-5 w-5 text-rose-600 dark:text-rose-400 ml-2 flex-shrink-0" />
                        )}
                      </button>

                      {/* Explanation displayed when submitted */}
                      {submitted && (isSelected || option.isCorrect) && (
                        <div
                          className={`mt-1.5 ml-8 text-xs p-2.5 rounded-lg leading-relaxed ${
                            option.isCorrect
                              ? 'bg-emerald-100/60 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                              : 'bg-rose-100/60 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300'
                          }`}
                        >
                          <span className="font-bold mr-1">
                            {option.isCorrect ? 'Correct:' : 'Why this is wrong:'}
                          </span>
                          {option.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quiz footer / score report */}
      <div className="mt-6 pt-4 border-t border-studio-100 dark:border-studio-800 flex flex-wrap items-center justify-between gap-4">
        {!submitted ? (
          <Button
            variant="accent"
            size="md"
            unitAccent={unitAccent}
            disabled={answeredCount < totalQuestions}
            onClick={handleSubmit}
          >
            Check Answers ({answeredCount}/{totalQuestions})
          </Button>
        ) : (
          <div className="flex flex-wrap items-center justify-between w-full gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl ${
                  isPassed
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                }`}
              >
                <Award className="h-6 w-6" />
              </div>
              <div>
                <p className="font-display font-bold text-base text-studio-900 dark:text-studio-50">
                  {score === 100
                    ? 'Perfect! You mastered this concept.'
                    : isPassed
                      ? 'Well done! Passing score achieved.'
                      : 'Review the explanations and try again.'}
                </p>
                <p className="text-xs text-studio-500">
                  Your Score: <span className="font-mono font-bold text-sm">{score}%</span> (Pass
                  threshold: 75%)
                </p>
              </div>
            </div>

            <Button variant="secondary" size="sm" onClick={handleRetry}>
              <RotateCcw className="h-4 w-4 mr-1.5" />
              Retry Quiz
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
