import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useProgressStore } from '@/features/progress/useProgressStore';
import { SeededRNG } from '@/utils/rng';
import { UNIT1_QUESTION_BANK } from '@/features/quiz/unit1QuestionBank';
import { UNIT2_QUESTION_BANK } from '@/features/quiz/unit2QuestionBank';
import { UNIT3_QUESTION_BANK } from '@/features/quiz/unit3QuestionBank';
import { UNIT4_QUESTION_BANK } from '@/features/quiz/unit4QuestionBank';
import { UNIT5_QUESTION_BANK } from '@/features/quiz/unit5QuestionBank';
import {
  Award,
  Clock,
  RotateCcw,
  ArrowRight,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Brain,
  FileCheck,
} from 'lucide-react';

interface Flashcard {
  id: string;
  unit: string;
  unitBadge: string;
  topic: string;
  question: string;
  answer: string;
}

const GLOBAL_VIVA_CARDS: Flashcard[] = [
  {
    id: 'v1',
    unit: 'Unit 1: Basics of AI',
    unitBadge: 'U1',
    topic: 'Rational Agents',
    question: 'What defines a rational agent under the Russell & Norvig PEAS formulation?',
    answer:
      'A rational agent selects whatever action maximizes its expected performance measure given its percept sequence history and built-in knowledge base. Rationality does not mean omniscience or perfection; it means optimal expected utility under uncertainty.',
  },
  {
    id: 'v2',
    unit: 'Unit 1: Basics of AI',
    unitBadge: 'U1',
    topic: 'Forward vs Backward Chaining',
    question:
      'When is forward chaining strictly preferred over backward chaining in rule-based expert systems?',
    answer:
      'Forward chaining is data-driven and preferred when all evidence/symptoms are readily available upfront and you need to infer all possible conclusions (e.g. real-time patient monitoring or automated trading). Backward chaining is goal-driven, preferred when querying a specific hypothesis (e.g. legal compliance verification).',
  },
  {
    id: 'v3',
    unit: 'Unit 2: AI Search Strategies',
    unitBadge: 'U2',
    topic: 'A* Admissibility',
    question: 'Why does an overestimating heuristic cause A* search to lose its optimal guarantee?',
    answer:
      'If h(n) > h*(n), A* overestimates the remaining cost to the goal. A path leading to the true shortest solution might appear artificially expensive on the priority queue, causing A* to prematurely pop and terminate on a suboptimal path that appeared falsely cheaper.',
  },
  {
    id: 'v4',
    unit: 'Unit 2: AI Search Strategies',
    unitBadge: 'U2',
    topic: 'Alpha-Beta Cutoffs',
    question: 'How does optimal move ordering affect Alpha-Beta pruning time complexity?',
    answer:
      'Under worst-case move ordering, alpha-beta explores all b^d leaves (no cutoffs). Under optimal move ordering (best moves evaluated first), time complexity shrinks from O(b^d) to O(b^(d/2)), effectively doubling the achievable search depth in the same time limit.',
  },
  {
    id: 'v5',
    unit: 'Unit 3: ML Fundamentals',
    unitBadge: 'U3',
    topic: 'Ridge vs Lasso',
    question:
      'Why does L1 regularization (Lasso) produce true parameter sparsity while L2 (Ridge) does not?',
    answer:
      'The L1 diamond constraint region has sharp corners on the coordinate axes. The elliptical MSE loss contours frequently intersect these corners first, driving coefficients exactly to zero. The L2 circle is smooth everywhere, shrinking weights toward zero asymptotically without hitting zero.',
  },
  {
    id: 'v6',
    unit: 'Unit 3: ML Fundamentals',
    unitBadge: 'U3',
    topic: 'Locally Weighted Regression',
    question:
      'Why is Locally Weighted Regression (LWR) classified as a non-parametric lazy learner?',
    answer:
      'LWR does not learn a fixed, finite set of global parameters during training. At inference time, it assigns weights w_i = exp(-||x_i - x_query||^2 / 2tau^2) based on proximity to the query point and solves a local weighted least-squares problem, requiring the entire dataset in memory.',
  },
  {
    id: 'v7',
    unit: 'Unit 4: Probabilistic Models',
    unitBadge: 'U4',
    topic: 'Naive Bayes Zero Trap',
    question:
      'How does Laplace (additive) smoothing protect Naive Bayes from zero-frequency probability collapse?',
    answer:
      'If a vocabulary word has zero counts in class C, its conditional probability P(w|C) is 0. Multiplying likelihoods across all words causes the entire posterior to collapse to zero. Laplace smoothing adds alpha to the numerator and alpha*|V| to the denominator, ensuring strictly positive probabilities.',
  },
  {
    id: 'v8',
    unit: 'Unit 4: Probabilistic Models',
    unitBadge: 'U4',
    topic: 'ROC vs PR Curves',
    question:
      'Why should you prefer a Precision-Recall curve over ROC-AUC when evaluating credit card fraud detection?',
    answer:
      'In fraud detection, the negative class (legitimate transactions) is 99.9% of the dataset. Because False Positive Rate = FP / (FP + TN), a massive TN denominator suppresses FPR, making ROC-AUC look deceptively pristine. The PR curve ignores TN entirely, isolating true positive precision.',
  },
  {
    id: 'v9',
    unit: 'Unit 5: Linear & Decision Models',
    unitBadge: 'U5',
    topic: 'SVM Maximum Margin',
    question: 'Why does maximizing margin 2/||w|| lead to minimizing 0.5 * ||w||^2?',
    answer:
      'The orthogonal width between canonical margins w^T x + b = +-1 is 2/||w||. Maximizing 2/||w|| is equivalent to minimizing ||w||/2. Squaring yields the convex quadratic program min 0.5 ||w||^2, which guarantees a single global minimum solvable via Karush-Kuhn-Tucker (KKT) dual methods.',
  },
  {
    id: 'v10',
    unit: 'Unit 5: Linear & Decision Models',
    unitBadge: 'U5',
    topic: 'Random Forest Feature Subspaces',
    question:
      'What is the statistical rationale for choosing m ≈ sqrt(d) features at each tree split in Random Forests?',
    answer:
      'If a dataset has one dominant feature, all trees in standard Bagging choose it as the root split, producing highly correlated trees (high rho). Restricting candidate splits to a random subspace of m = sqrt(d) features forces trees to use diverse secondary features, decorrelating the ensemble and reducing variance.',
  },
];

const UNIT_EXAMS = [
  {
    unit: 1,
    badge: 'U1',
    title: 'Unit 1: Basics of AI Exam',
    desc: 'Intelligent agents, PEAS framework, propositional logic, and knowledge-based expert systems.',
    questionsCount: 20,
    durationMins: 25,
    examId: 'u1-exam',
    href: '/learn/unit-1/exam',
  },
  {
    unit: 2,
    badge: 'U2',
    title: 'Unit 2: AI Search Strategies Exam',
    desc: 'Uninformed search, A* heuristic admissibility, local hill climbing, CSP AC-3, and adversarial minimax.',
    questionsCount: 20,
    durationMins: 25,
    examId: 'u2-exam',
    href: '/learn/unit-2/exam',
  },
  {
    unit: 3,
    badge: 'U3',
    title: 'Unit 3: ML Fundamentals Exam',
    desc: 'Linear & multiple regression, gradient descent learning dynamics, polynomial curves, and regularization.',
    questionsCount: 20,
    durationMins: 25,
    examId: 'u3-exam',
    href: '/learn/unit-3/exam',
  },
  {
    unit: 4,
    badge: 'U4',
    title: 'Unit 4: Instances & Probabilistic Models Exam',
    desc: 'Bayesian inference, Naive Bayes, logistic classification, confusion matrix metrics, and ROC-AUC sweeper.',
    questionsCount: 20,
    durationMins: 25,
    examId: 'u4-exam',
    href: '/learn/unit-4/exam',
  },
  {
    unit: 5,
    badge: 'U5',
    title: 'Unit 5: Linear & Decision Models Exam',
    desc: 'Decision tree splits & pruning, SVM hyperplanes & kernel trick, Random Forests, and AdaBoost mechanics.',
    questionsCount: 20,
    durationMins: 25,
    examId: 'u5-exam',
    href: '/learn/unit-5/exam',
  },
];

export function PracticePage() {
  const [activeTab, setActiveTab] = useState<'hub' | 'mock' | 'viva'>('hub');
  const [examSeed, setExamSeed] = useState<number>(777);

  // Zustand Store Progress
  const getConceptProgress = useProgressStore((state) => state.getConceptProgress);
  const recordQuizScore = useProgressStore((state) => state.recordQuizScore);

  // Mock Exam State
  const [mockSelected, setMockSelected] = useState<Record<string, string>>({});
  const [mockSubmitted, setMockSubmitted] = useState<boolean>(false);
  const [mockTimeSec, setMockTimeSec] = useState<number>(45 * 60); // 45 minutes for 30 questions
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Viva Flashcard State
  const [revealedCards, setRevealedCards] = useState<Record<string, boolean>>({});
  const [vivaFilter, setVivaFilter] = useState<string>('all');

  // Assemble 30 questions across all 5 units (6 per unit)
  const mockQuestions = useMemo(() => {
    const rng = new SeededRNG(examSeed);
    const q1 = rng.shuffle([...UNIT1_QUESTION_BANK]).slice(0, 6);
    const q2 = rng.shuffle([...UNIT2_QUESTION_BANK]).slice(0, 6);
    const q3 = rng.shuffle([...UNIT3_QUESTION_BANK]).slice(0, 6);
    const q4 = rng.shuffle([...UNIT4_QUESTION_BANK]).slice(0, 6);
    const q5 = rng.shuffle([...UNIT5_QUESTION_BANK]).slice(0, 6);
    return rng.shuffle([...q1, ...q2, ...q3, ...q4, ...q5]);
  }, [examSeed]);

  // Timer countdown for Mock Exam
  useEffect(() => {
    if (!isTimerRunning || mockSubmitted) return;

    const interval = setInterval(() => {
      setMockTimeSec((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setMockSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, mockSubmitted]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStartMock = () => {
    setActiveTab('mock');
    setMockSubmitted(false);
    setMockSelected({});
    setMockTimeSec(45 * 60);
    setIsTimerRunning(true);
    setExamSeed((s) => s + 7);
  };

  const handleSelectMockOption = (qId: string, optId: string) => {
    if (mockSubmitted) return;
    setMockSelected((prev) => ({ ...prev, [qId]: optId }));
  };

  const handleSubmitMock = () => {
    setMockSubmitted(true);
    setIsTimerRunning(false);

    let correctCount = 0;
    mockQuestions.forEach((q) => {
      const chosen = mockSelected[q.id];
      const correct = q.options.find((o) => o.isCorrect);
      if (chosen && correct && chosen === correct.id) {
        correctCount++;
      }
    });

    const pct = Math.round((correctCount / mockQuestions.length) * 100);
    recordQuizScore('mock-exam', pct, 70);

    if (pct >= 70) {
      void confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  };

  const mockScoreStats = (() => {
    let correct = 0;
    const coScores: Record<string, { correct: number; total: number }> = {
      CO1: { correct: 0, total: 0 },
      CO2: { correct: 0, total: 0 },
      CO3: { correct: 0, total: 0 },
      CO4: { correct: 0, total: 0 },
    };

    mockQuestions.forEach((q) => {
      const chosen = mockSelected[q.id];
      const correctOpt = q.options.find((o) => o.isCorrect);
      const isRight = Boolean(chosen && correctOpt && chosen === correctOpt.id);
      if (isRight) correct++;

      const co = q.outcome || 'CO2';
      if (coScores[co]) {
        coScores[co].total++;
        if (isRight) coScores[co].correct++;
      }
    });

    return {
      correct,
      total: mockQuestions.length,
      pct: Math.round((correct / (mockQuestions.length || 1)) * 100),
      coScores,
    };
  })();

  const toggleViva = (id: string) => {
    setRevealedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredVivaCards = useMemo(() => {
    if (vivaFilter === 'all') return GLOBAL_VIVA_CARDS;
    return GLOBAL_VIVA_CARDS.filter((c) => c.unitBadge.toLowerCase() === vivaFilter.toLowerCase());
  }, [vivaFilter]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:px-12 space-y-10">
      {/* 1. Header Banner */}
      <div className="border-b border-orange-50/15 pb-6">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant="unit">Practice &amp; Assessment</Badge>
          <Badge variant="outline">MIT AOE Course 2304322T</Badge>
          <Badge variant="outline">CO1, CO2, CO3, CO4</Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-foreground font-manrope">
          Practice &amp; examination hub
        </h1>
        <p className="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-300 font-montserrat leading-relaxed max-w-3xl">
          Prepare for university semester tests and oral viva examinations with{' '}
          <span className="font-montserrat font-medium text-yellow-800 dark:text-orange-100">
            timed assessments, full-length cross-unit mock simulations, and viva cards
          </span>
          .
        </p>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-6">
          {[
            { id: 'hub', label: '1. Unit Assessments & Diagnostic', icon: GraduationCap },
            { id: 'mock', label: '2. Comprehensive Mock Simulator (30 Qs)', icon: FileCheck },
            { id: 'viva', label: '3. Oral Viva Flashcards', icon: Brain },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as 'hub' | 'mock' | 'viva');
                  if (tab.id === 'mock' && !isTimerRunning && !mockSubmitted) {
                    setIsTimerRunning(true);
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-manrope font-semibold transition-all border ${
                  activeTab === tab.id
                    ? 'border-brand bg-brand text-white shadow-none'
                    : 'border-orange-50/10 bg-black/20 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Icon className="size-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: UNIT ASSESSMENTS & DIAGNOSTIC RECAP */}
      {activeTab === 'hub' && (
        <div className="space-y-8">
          {/* Mock Exam Feature Card Banner */}
          <Card className="p-6 border-orange-50/20 bg-neutral-900/60 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="size-10 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center text-brand shrink-0">
                <Sparkles className="size-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-manrope text-lg font-bold text-foreground">
                  Full-Length Mixed Mock Examination (30 Questions)
                </h3>
                <p className="text-xs text-neutral-400 font-montserrat max-w-2xl leading-relaxed">
                  Synthesizes 6 questions from each syllabus unit into a 45-minute timed simulation.
                  Evaluates overall readiness across Course Outcomes CO1, CO2, CO3, and CO4.
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              onClick={handleStartMock}
              className="text-xs font-semibold whitespace-nowrap self-start md:self-auto flex items-center gap-2"
            >
              <span>Launch Mock Simulation</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </Card>

          {/* Unit Exams Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-manrope text-base font-semibold text-foreground">
                Unit-by-Unit Timed Assessments (20 Questions Each)
              </h3>
              <span className="text-xs font-mono text-neutral-400">Passing Grade: 70%</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {UNIT_EXAMS.map((exam) => {
                const storedProgress = getConceptProgress(exam.examId);
                const score = storedProgress?.quizScore ?? null;
                const hasPassed = storedProgress?.quizPassed ?? false;

                return (
                  <Card
                    key={exam.unit}
                    className="p-5 border-orange-50/15 bg-neutral-900/40 flex flex-col justify-between space-y-4 hover:border-orange-50/30 transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{exam.badge}</Badge>
                        {score !== null ? (
                          <Badge variant={hasPassed ? 'success' : 'warning'} size="sm">
                            Score: {score}%
                          </Badge>
                        ) : (
                          <span className="text-[10px] font-mono text-neutral-500 uppercase">
                            Not Attempted
                          </span>
                        )}
                      </div>

                      <h4 className="font-manrope text-sm font-bold text-foreground">
                        {exam.title}
                      </h4>
                      <p className="text-xs text-neutral-400 font-montserrat leading-relaxed">
                        {exam.desc}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-orange-50/10 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-400">
                        <Clock className="size-3 text-neutral-500" />
                        <span>{exam.durationMins} Mins • 20 Qs</span>
                      </div>
                      <Link to={exam.href}>
                        <Button variant="outline" size="sm" className="text-xs">
                          {score !== null ? 'Retake' : 'Start'}
                        </Button>
                      </Link>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COMPREHENSIVE MOCK SIMULATOR */}
      {activeTab === 'mock' && (
        <div className="space-y-8">
          {/* Header & Sticky Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-orange-50/15">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="unit">30 Questions</Badge>
                <Badge variant="outline">Units 1 to 5 Synthesis</Badge>
                <Badge variant="outline">MIT AOE Mock Test</Badge>
              </div>
              <h2 className="font-manrope text-xl sm:text-2xl font-bold text-foreground mt-2">
                Full-length comprehensive mock examination
              </h2>
            </div>

            {/* Timer Box */}
            <div className="flex items-center gap-3 bg-neutral-900 border border-orange-50/15 px-4 py-2 rounded-lg self-start sm:self-auto">
              <Clock
                className={`size-4 ${mockTimeSec < 300 ? 'text-red-400 animate-pulse' : 'text-amber-400'}`}
              />
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-wider text-neutral-500 font-mono">
                  Time Remaining
                </div>
                <div
                  className={`font-mono text-base font-bold ${
                    mockTimeSec < 300 ? 'text-red-400' : 'text-neutral-100'
                  }`}
                >
                  {formatTimer(mockTimeSec)}
                </div>
              </div>
            </div>
          </div>

          {/* Results Summary if Submitted */}
          {mockSubmitted && (
            <Card className="p-6 border-amber-900/40 bg-neutral-950/80 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-orange-50/10">
                <div>
                  <div className="flex items-center gap-2">
                    <Award
                      className={`size-6 ${mockScoreStats.pct >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}
                    />
                    <span className="text-xl font-bold text-neutral-100 font-manrope">
                      {mockScoreStats.pct >= 70
                        ? 'Mock Exam Passed!'
                        : 'Targeted Revision Recommended'}
                    </span>
                    <Badge variant={mockScoreStats.pct >= 70 ? 'success' : 'warning'}>
                      {mockScoreStats.pct}% Score
                    </Badge>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1 font-montserrat">
                    You answered {mockScoreStats.correct} of {mockScoreStats.total} questions
                    correctly across all five units.
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStartMock}
                  className="flex items-center gap-1.5 text-xs"
                >
                  <RotateCcw className="size-3.5" />
                  Regenerate New Mock
                </Button>
              </div>

              {/* CO Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {Object.entries(mockScoreStats.coScores).map(([co, data]) => {
                  const pct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
                  return (
                    <div
                      key={co}
                      className="p-2.5 bg-neutral-900/60 rounded border border-orange-50/10 text-xs font-mono"
                    >
                      <div className="text-neutral-400">{co} Mastery:</div>
                      <div className="font-bold text-neutral-200 mt-0.5">
                        {data.correct} / {data.total} ({pct}%)
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Questions List */}
          <div className="space-y-6">
            {mockQuestions.map((q, idx) => {
              const chosen = mockSelected[q.id];
              const isAnswered = Boolean(chosen);

              return (
                <Card
                  key={q.id}
                  className={`p-6 border transition-colors ${
                    mockSubmitted
                      ? chosen === q.options.find((o) => o.isCorrect)?.id
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

                    {mockSubmitted && (
                      <div>
                        {chosen === q.options.find((o) => o.isCorrect)?.id ? (
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

                  <p className="text-sm font-semibold text-neutral-100 font-montserrat leading-relaxed mb-4">
                    {q.question}
                  </p>

                  <div className="space-y-2">
                    {q.options.map((opt) => {
                      const isSelected = chosen === opt.id;
                      const showCorrect = mockSubmitted && opt.isCorrect;
                      const showWrong = mockSubmitted && isSelected && !opt.isCorrect;

                      return (
                        <div
                          key={opt.id}
                          onClick={() => handleSelectMockOption(q.id, opt.id)}
                          className={`p-3 rounded-lg border text-xs font-montserrat transition-all cursor-pointer ${
                            showCorrect
                              ? 'border-emerald-500/60 bg-emerald-950/40 text-emerald-200 font-medium'
                              : showWrong
                                ? 'border-red-500/60 bg-red-950/40 text-red-200'
                                : isSelected
                                  ? 'border-brand bg-brand/10 text-white font-medium'
                                  : 'border-orange-50/10 bg-black/20 text-neutral-400 hover:text-neutral-200'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <span className="font-mono font-bold uppercase text-neutral-500 mt-0.5">
                              {opt.id}.
                            </span>
                            <div className="flex-1 leading-relaxed">
                              <div>{opt.text}</div>
                              {mockSubmitted && (showCorrect || showWrong) && (
                                <p className="text-[11px] text-neutral-400 mt-1.5 font-sans pt-1 border-t border-orange-50/10">
                                  <span className="font-semibold text-neutral-300">
                                    Explanation:
                                  </span>{' '}
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

          {/* Sticky Submit Bar */}
          {!mockSubmitted && (
            <div className="sticky bottom-4 bg-neutral-900/90 backdrop-blur-md p-4 rounded-xl border border-orange-50/15 flex items-center justify-between">
              <div className="text-xs font-mono text-neutral-400">
                Answered{' '}
                <span className="text-neutral-100 font-bold">
                  {Object.keys(mockSelected).length}
                </span>{' '}
                of <span className="text-neutral-100 font-bold">{mockQuestions.length}</span>{' '}
                questions
              </div>
              <Button
                variant="primary"
                disabled={Object.keys(mockSelected).length === 0}
                onClick={handleSubmitMock}
                className="text-xs"
              >
                Submit Mock Examination
              </Button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ORAL VIVA VOCE FLASHCARDS */}
      {activeTab === 'viva' && (
        <div className="space-y-6">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 border-b border-orange-50/10 pb-4">
            <span className="text-xs font-mono text-neutral-400 uppercase">Filter by Unit:</span>
            {[
              { id: 'all', label: 'All Units (10 Flagships)' },
              { id: 'u1', label: 'Unit 1: Basics' },
              { id: 'u2', label: 'Unit 2: Search' },
              { id: 'u3', label: 'Unit 3: Regression' },
              { id: 'u4', label: 'Unit 4: Bayes & Metrics' },
              { id: 'u5', label: 'Unit 5: Trees & SVM' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setVivaFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                  vivaFilter === f.id
                    ? 'border-brand bg-brand text-white font-bold'
                    : 'border-orange-50/10 bg-black/20 text-neutral-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Flashcards List */}
          <div className="space-y-3">
            {filteredVivaCards.map((card, idx) => {
              const isRevealed = Boolean(revealedCards[card.id]);

              return (
                <Card
                  key={card.id}
                  onClick={() => toggleViva(card.id)}
                  className="p-5 border-orange-50/15 bg-neutral-900/40 hover:border-orange-50/30 transition-all cursor-pointer space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" size="sm">
                        {card.unitBadge}
                      </Badge>
                      <span className="text-xs font-mono text-neutral-400">{card.topic}</span>
                    </div>

                    <Button variant="ghost" size="sm" className="p-1 h-auto text-neutral-400">
                      {isRevealed ? (
                        <ChevronUp className="size-4" />
                      ) : (
                        <ChevronDown className="size-4" />
                      )}
                    </Button>
                  </div>

                  <p className="text-sm font-semibold text-neutral-100 font-montserrat leading-relaxed">
                    Q{idx + 1}. {card.question}
                  </p>

                  {isRevealed ? (
                    <div className="text-xs text-neutral-300 font-sans leading-relaxed pt-3 border-t border-orange-50/10 bg-black/20 p-3 rounded-lg">
                      <span className="font-semibold text-cream block mb-1">
                        Model Answer Outline:
                      </span>
                      {card.answer}
                    </div>
                  ) : (
                    <div className="text-[11px] font-mono text-neutral-500 italic">
                      Click to reveal answer outline &rarr;
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
