import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Quiz, type QuizItem } from '@/features/quiz/Quiz';
import { EnsembleDiversityLab } from '@/labs/ensemble-diversity/EnsembleDiversityLab';
import { useProgressStore } from '@/features/progress/useProgressStore';
import {
  Users,
  XCircle,
  Lightbulb,
  FileCode,
  BookOpen,
  HelpCircle,
  ArrowRight,
  Copy,
  Check,
} from 'lucide-react';

const QUIZ_ITEMS: QuizItem[] = [
  {
    id: 'u5-ens-q1',
    question:
      'According to the Condorcet Jury Theorem, what is the fundamental prerequisite for an ensemble of majority voters to outperform an individual voter as the number of voters grows?',
    options: [
      {
        id: 'opt-a',
        text: 'All base voters must be identical neural networks trained on the exact same dataset.',
        isCorrect: false,
        explanation:
          'Identical models make identical errors, causing correlation to reach 1 and destroying ensemble benefit.',
      },
      {
        id: 'opt-b',
        text: 'Each independent base voter must have an individual accuracy probability p strictly greater than 0.5.',
        isCorrect: true,
        explanation:
          'If p > 0.5 and errors are independent, the binomial probability that the majority vote is correct converges to 1 as M approaches infinity.',
      },
      {
        id: 'opt-c',
        text: 'The ensemble size must be an even number so ties can be decided by random coin flips.',
        isCorrect: false,
        explanation:
          'Ensembles typically prefer odd sizes to eliminate ties completely without coin tossing.',
      },
      {
        id: 'opt-d',
        text: 'The base models must have zero bias and zero variance simultaneously.',
        isCorrect: false,
        explanation:
          'Ensembles explicitly exist because individual models have either non-zero variance or non-zero bias.',
      },
    ],
  },
  {
    id: 'u5-ens-q2',
    question:
      'In the Krogh-Vedelsby ambiguity decomposition (Ensemble Error = Mean Individual Error - Diversity), what happens if all models produce identical predictions on all test inputs?',
    options: [
      {
        id: 'opt-a',
        text: 'The diversity term collapses to zero, and the ensemble error is exactly equal to the individual model error.',
        isCorrect: true,
        explanation:
          'When models agree completely, diversity is zero. The ensemble provides zero variance reduction over a single model.',
      },
      {
        id: 'opt-b',
        text: 'The ensemble error drops to zero because unanimity proves absolute truth.',
        isCorrect: false,
        explanation:
          'Unanimous agreement does not mean correctness. If all models share the same flaw, they will unanimously predict the wrong class.',
      },
      {
        id: 'opt-c',
        text: 'The variance decreases by a factor of 1/M.',
        isCorrect: false,
        explanation:
          'The 1/M reduction only holds when model errors are completely uncorrelated (correlation = 0).',
      },
      {
        id: 'opt-d',
        text: 'The models must be retrained using a higher learning rate.',
        isCorrect: false,
        explanation:
          'Learning rate does not resolve fundamental lack of hypothesis diversity in identical models.',
      },
    ],
  },
  {
    id: 'u5-ens-q3',
    question:
      'What is the primary mechanism through which averaging multiple independent models reduces generalization error?',
    options: [
      {
        id: 'opt-a',
        text: 'It reduces the irreducible Bayes error of the underlying data distribution.',
        isCorrect: false,
        explanation:
          'Irreducible noise is an inherent property of the physical problem and cannot be lowered by any algorithm.',
      },
      {
        id: 'opt-b',
        text: 'It primarily reduces the variance component of error without increasing individual model bias.',
        isCorrect: true,
        explanation:
          'Averaging uncorrelated estimates shrinks variance by up to 1/M while preserving the average expectation (bias).',
      },
      {
        id: 'opt-c',
        text: 'It increases the bias of the decision boundary to prevent smooth curves.',
        isCorrect: false,
        explanation:
          'Ensemble averaging smooths jagged step functions, reducing variance rather than increasing bias.',
      },
      {
        id: 'opt-d',
        text: 'It eliminates the need for cross-validation and testing datasets.',
        isCorrect: false,
        explanation:
          'Validation remains strictly required to ensure hyperparameters and ensemble weights are not overfitting.',
      },
    ],
  },
];

export function EnsembleSignificancePage() {
  const [copiedPython, setCopiedPython] = useState(false);
  const getConceptProgress = useProgressStore((state) => state.getConceptProgress);
  const progress = getConceptProgress('u5-ensemble-significance');
  const isCompleted = Boolean(progress?.labCompleted || progress?.read);

  const pythonSnippet = `import numpy as np
from sklearn.ensemble import VotingClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.datasets import make_moons
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# 1. Synthesize non-linear dataset
X, y = make_moons(n_samples=1000, noise=0.30, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# 2. Define diverse base learners (different inductive biases)
clf1 = DecisionTreeClassifier(max_depth=3, random_state=42)
clf2 = LogisticRegression(random_state=42)
clf3 = KNeighborsClassifier(n_neighbors=5)

# 3. Fit base learners and inspect individual accuracies
for name, clf in [("Decision Tree", clf1), ("Logistic Regression", clf2), ("k-NN", clf3)]:
    clf.fit(X_train, y_train)
    acc = accuracy_score(y_test, clf.predict(X_test))
    print(f"{name:20s} Test Accuracy: {acc * 100:.2f}%")

# 4. Construct majority voting ensemble
ensemble = VotingClassifier(
    estimators=[('dt', clf1), ('lr', clf2), ('knn', clf3)],
    voting='hard'
)
ensemble.fit(X_train, y_train)
ens_acc = accuracy_score(y_test, ensemble.predict(X_test))
print(f"\\n{'Ensemble (Majority)':20s} Test Accuracy: {ens_acc * 100:.2f}%")
print(f"Accuracy Gain: +{(ens_acc - max(acc for acc in [accuracy_score(y_test, c.predict(X_test)) for c in [clf1, clf2, clf3]])) * 100:.2f}%")
`;

  const copyCode = () => {
    void navigator.clipboard.writeText(pythonSnippet);
    setCopiedPython(true);
    setTimeout(() => setCopiedPython(false), 2000);
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 sm:px-12 space-y-12">
      {/* 1. Hero Header & Syllabus Mapping */}
      <div className="border-b border-orange-50/15 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs font-mono text-neutral-400"
          >
            <Link to="/learn/unit-5" className="hover:text-brand transition-colors">
              Unit 5: Linear & Decision Models
            </Link>
            <span>/</span>
            <span className="text-foreground dark:text-neutral-200">Ensemble Significance</span>
          </nav>
          {isCompleted && (
            <Badge variant="success" size="sm">
              Completed
            </Badge>
          )}
        </div>

        <h1 className="font-manrope text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Ensemble learning significance (bias vs variance)
        </h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 max-w-3xl font-montserrat leading-relaxed">
          Why settle for one fallible hypothesis when a committee of diverse models can cancel out
          each other errors? Discover the mathematical foundations of ensemble learning, where{' '}
          <span className="font-montserrat font-medium text-yellow-800 dark:text-orange-100">
            collective intelligence emerges from uncorrelated diversity
          </span>
          .
        </p>

        {/* Syllabus Tag Chips */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant="unit" unit={5}>
            Unit 5 Core
          </Badge>
          <Badge variant="outline">0.6 Hours</Badge>
          <Badge variant="outline">Course Outcome: CO3, CO4</Badge>
          <Badge variant="outline">Condorcet Theorem</Badge>
        </div>
      </div>

      {/* 2. Intuition */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="size-5 text-amber-400" />
          <h2 className="font-manrope text-2xl font-semibold tracking-tight text-foreground">
            1. Intuition: the wisdom of the crowd
          </h2>
        </div>
        <p className="text-sm text-neutral-700 dark:text-neutral-300 font-montserrat leading-relaxed">
          Imagine asking a single physician to diagnose a complex, borderline radiology scan. Even
          an exceptional specialist might suffer from momentary fatigue, subtle visual blind spots,
          or personal biases. But if you assemble a panel of seven board-certified specialists with
          differing training backgrounds, individual idiosyncratic mistakes cancel each other out.
          If each specialist is right 70% of the time independently, the probability that the
          majority of seven doctors is correct rises to over 87%.
        </p>
        <p className="text-sm text-neutral-700 dark:text-neutral-300 font-montserrat leading-relaxed">
          In machine learning, every individual model possesses an inductive bias: decision trees
          favor orthogonal hyperplanes, logistic regressors enforce linear half-spaces, and nearest
          neighbor models rely on local metric spheres. By combining multiple diverse hypotheses, an
          ensemble creates flexible meta-boundaries that no single constituent model could ever
          represent on its own.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <Card className="p-4 border border-orange-50/15 bg-neutral-900/30">
            <h4 className="font-manrope text-sm font-semibold text-foreground dark:text-white">
              The Individual Flaw
            </h4>
            <p className="text-xs text-neutral-400 mt-1 font-montserrat">
              Single high-capacity models easily overfit specific noise artifacts or get trapped in
              local minima.
            </p>
          </Card>
          <Card className="p-4 border border-orange-50/15 bg-neutral-900/30">
            <h4 className="font-manrope text-sm font-semibold text-foreground dark:text-white">
              Error Decoupling
            </h4>
            <p className="text-xs text-neutral-400 mt-1 font-montserrat">
              When models err on completely different sample instances, their collective majority
              vote remains correct.
            </p>
          </Card>
          <Card className="p-4 border border-orange-50/15 bg-neutral-900/30">
            <h4 className="font-manrope text-sm font-semibold text-foreground dark:text-white">
              Variance Shrinkage
            </h4>
            <p className="text-xs text-neutral-400 mt-1 font-montserrat">
              Averaging decorrelated estimators systematically reduces prediction variance toward a
              smooth envelope.
            </p>
          </Card>
        </div>
      </section>

      {/* 3. Interactive Lab */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="size-5 text-brand" />
          <h2 className="font-manrope text-2xl font-semibold tracking-tight text-foreground">
            2. Interactive lab: Condorcet jury theorem & diversity simulator
          </h2>
        </div>
        <p className="text-sm text-neutral-700 dark:text-neutral-300 font-montserrat">
          Experiment with the sliders below to explore the boundary where ensembles shine or fail.
          Watch how increasing voter size drives majority accuracy toward 100%, and witness the
          destructive effect of inter-model correlation.
        </p>
        <EnsembleDiversityLab />
      </section>

      {/* 4. Step-by-Step on Paper */}
      <section className="space-y-4">
        <h2 className="font-manrope text-2xl font-semibold tracking-tight text-foreground">
          3. Step-by-step on paper: proving Condorcet majority gain
        </h2>
        <p className="text-sm text-neutral-700 dark:text-neutral-300 font-montserrat leading-relaxed">
          Let us trace by hand a committee of $M = 5$ independent binary classifiers, each having an
          individual accuracy probability $p = 0.60$ (so error rate $q = 1 - p = 0.40$).
        </p>

        <Card className="p-5 border border-orange-50/15 bg-neutral-900/40 space-y-4 font-mono text-xs">
          <div>
            <div className="text-orange-200 font-bold mb-1">
              Step 1: Determine the Majority Threshold
            </div>
            <p className="text-neutral-300 font-montserrat">
              For $M = 5$, a majority decision requires at least 3 models to agree on the correct
              label. The possible winning counts of correct voters are $k \in [3, 4, 5]$.
            </p>
          </div>

          <div className="border-t border-orange-50/10 pt-3">
            <div className="text-orange-200 font-bold mb-1">
              Step 2: Calculate Binomial Term Probabilities
            </div>
            <div className="space-y-1 text-neutral-300">
              <div>
                P(exactly 3 correct) ={' '}
                {
                  '\\binom{5}{3} p^3 (1-p)^2 = 10 \\times (0.6)^3 \\times (0.4)^2 = 10 \\times 0.216 \\times 0.16 = 0.3456'
                }
              </div>
              <div>
                P(exactly 4 correct) ={' '}
                {
                  '\\binom{5}{4} p^4 (1-p)^1 = 5 \\times (0.6)^4 \\times (0.4)^1 = 5 \\times 0.1296 \\times 0.4 = 0.2592'
                }
              </div>
              <div>
                P(exactly 5 correct) ={' '}
                {'\\binom{5}{5} p^5 (1-p)^0 = 1 \\times (0.6)^5 \\times 1 = 0.07776'}
              </div>
            </div>
          </div>

          <div className="border-t border-orange-50/10 pt-3">
            <div className="text-orange-200 font-bold mb-1">
              Step 3: Sum the Mutually Exclusive Events
            </div>
            <div className="text-emerald-400 font-bold">
              {'P(Majority Correct) = 0.3456 + 0.2592 + 0.07776 = 0.68256 \\approx 68.26\\%'}
            </div>
            <p className="text-neutral-400 font-montserrat mt-1">
              By combining 5 weak models with 60% accuracy, our ensemble accuracy climbed to 68.26%
              (a net gain of +8.26% with zero extra training data).
            </p>
          </div>
        </Card>
      </section>

      {/* 5. Formal Mathematical Foundations */}
      <section className="space-y-4">
        <h2 className="font-manrope text-2xl font-semibold tracking-tight text-foreground">
          4. Formal mathematical foundations: Krogh-Vedelsby & covariance
        </h2>
        <p className="text-sm text-neutral-700 dark:text-neutral-300 font-montserrat leading-relaxed">
          The theoretical cornerstone of ensemble learning rests on two rigorous mathematical
          decompositions: the Krogh-Vedelsby Ambiguity Identity and the Bias-Variance-Covariance
          formulation.
        </p>

        <Card className="p-6 border border-orange-50/15 bg-neutral-900/40 space-y-4 text-xs font-montserrat">
          <div>
            <h3 className="font-manrope text-sm font-semibold text-orange-200">
              The Krogh-Vedelsby Ambiguity Identity (1995)
            </h3>
            <p className="text-neutral-300 mt-1">
              For an ensemble of $M$ regressors $f_m(x)$ with weights $w_m \ge 0, \sum w_m = 1$, the
              ensemble squared error decomposes exactly into:
            </p>
            <div className="my-2 p-3 bg-black/50 border border-orange-50/10 rounded font-mono text-neutral-200 text-center">
              {
                '$$ (f_{\\text{ens}}(x) - y)^2 = \\sum_{m=1}^M w_m (f_m(x) - y)^2 - \\sum_{m=1}^M w_m (f_m(x) - f_{\\text{ens}}(x))^2 $$'
              }
            </div>
            <p className="text-neutral-400">
              In words:{' '}
              <strong className="text-white">
                Ensemble Error = Weighted Average Individual Error - Ambiguity (Diversity)
              </strong>
              . Because the ambiguity term is a sum of squares, it is strictly non-negative. Hence,
              the ensemble error is always less than or equal to the average error of its individual
              constituents.
            </p>
          </div>

          <div className="border-t border-orange-50/10 pt-4">
            <h3 className="font-manrope text-sm font-semibold text-orange-200">
              Variance-Covariance Decomposition
            </h3>
            <p className="text-neutral-300 mt-1">
              If $M$ estimators each have variance $\sigma^2$ and pairwise correlation coefficient
              $\rho \in [0, 1]$, the variance of their simple average f_avg = (1/M) sum(f_m) is:
            </p>
            <div className="my-2 p-3 bg-black/50 border border-orange-50/10 rounded font-mono text-neutral-200 text-center">
              {'$$ \\text{Var}(\\bar{f}) = \\rho \\sigma^2 + \\frac{1 - \\rho}{M} \\sigma^2 $$'}
            </div>
            <p className="text-neutral-400">Notice the two asymptotic limits:</p>
            <ul className="list-disc pl-5 space-y-1 text-neutral-400 mt-1">
              <li>
                If errors are perfectly independent ($\rho = 0$), the ensemble variance converges to
                zero: Var(f) &rarr; 0 as M approaches infinity.
              </li>
              <li>
                If errors are identical ($\rho = 1$), the ensemble variance remains stuck at
                $\sigma^2$, rendering the ensemble completely impotent.
              </li>
            </ul>
          </div>
        </Card>
      </section>

      {/* 6. Algorithm Pseudocode */}
      <section className="space-y-4">
        <h2 className="font-manrope text-2xl font-semibold tracking-tight text-foreground">
          5. Algorithm pseudocode: majority voting ensemble
        </h2>
        <Card className="p-4 border border-orange-50/15 bg-neutral-900/40 font-mono text-xs text-neutral-300 space-y-1">
          <div className="text-neutral-500">
            {'// Algorithm: Majority Voting Classifier (Hard & Soft)'}
          </div>
          <div>
            <strong className="text-orange-200">Input:</strong> Training set D, Base learning
            algorithms A_1, A_2, ..., A_M, Query x
          </div>
          <div>
            <strong className="text-orange-200">Output:</strong> Aggregated prediction y_pred
          </div>
          <div className="pt-2 text-neutral-500">
            {'// Phase 1: Train heterogeneous models on training dataset'}
          </div>
          <div>
            <strong>for</strong> m = 1 <strong>to</strong> M <strong>do</strong>:
          </div>
          <div className="pl-4">h_m = A_m.train(D)</div>
          <div>
            <strong>end for</strong>
          </div>
          <div className="pt-2 text-neutral-500">
            {'// Phase 2: Inference aggregation for query x'}
          </div>
          <div>
            <strong>if</strong> voting == &quot;hard&quot; <strong>then</strong>:
          </div>
          <div className="pl-4">y_pred = mode({'{ h_1(x), h_2(x), ..., h_M(x) }'})</div>
          <div>
            <strong>else if</strong> voting == &quot;soft&quot; <strong>then</strong>:
          </div>
          <div className="pl-4">P(c|x) = (1 / M) * sum_{'{m=1}'}^M P_m(y=c|x)</div>
          <div className="pl-4">y_pred = argmax_c P(c|x)</div>
          <div>
            <strong>end if</strong>
          </div>
          <div>
            <strong>return</strong> y_pred
          </div>
        </Card>
      </section>

      {/* 7. Code It in Python */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="size-5 text-brand" />
            <h2 className="font-manrope text-2xl font-semibold tracking-tight text-foreground">
              6. Code it in Python: Scikit-Learn VotingClassifier
            </h2>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={copyCode}
            className="flex items-center gap-1.5 text-xs"
          >
            {copiedPython ? (
              <Check className="size-3 text-emerald-400" />
            ) : (
              <Copy className="size-3" />
            )}
            <span>{copiedPython ? 'Copied' : 'Copy Code'}</span>
          </Button>
        </div>
        <Card className="p-4 border border-orange-50/15 bg-black/60 font-mono text-xs text-neutral-300 overflow-x-auto">
          <pre>{pythonSnippet}</pre>
        </Card>
      </section>

      {/* 8. Make It Fail */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <XCircle className="size-5 text-rose-400" />
          <h2 className="font-manrope text-2xl font-semibold tracking-tight text-foreground">
            7. Make it fail: the two deadly ensemble pitfalls
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-5 border border-rose-500/20 bg-rose-950/10 space-y-2">
            <h4 className="font-manrope text-sm font-semibold text-rose-300 flex items-center gap-1.5">
              <span>Failure Mode 1: The Incompetent Jury (p &lt; 0.5)</span>
            </h4>
            <p className="text-xs text-neutral-300 font-montserrat leading-relaxed">
              If individual classifiers are worse than random guessing ($p = 0.40$), the Condorcet
              jury theorem operates in reverse. As you increase committee size from $M = 3$ to $M =
              51$, the probability of a majority correct prediction converges to{' '}
              <strong className="text-rose-400">zero</strong>. The committee actively systematizes
              and solidifies incorrect choices.
            </p>
            <div className="text-[11px] font-mono text-rose-200/80 bg-black/30 p-2 rounded">
              Remedy: Always verify that all base learners achieve statistical validation accuracy
              significantly above random baseline before ensembling.
            </div>
          </Card>

          <Card className="p-5 border border-amber-500/20 bg-amber-950/10 space-y-2">
            <h4 className="font-manrope text-sm font-semibold text-amber-300 flex items-center gap-1.5">
              <span>Failure Mode 2: The Echo Chamber (Correlation ρ → 1)</span>
            </h4>
            <p className="text-xs text-neutral-300 font-montserrat leading-relaxed">
              Combining 100 decision trees that were trained on identical bootstrap data with
              identical splits provides virtually zero variance reduction. When error correlation
              approaches 1, ensemble variance remains stuck at $\sigma^2$. You pay 100x the compute
              cost for 1x performance.
            </p>
            <div className="text-[11px] font-mono text-amber-200/80 bg-black/30 p-2 rounded">
              Remedy: Inject diversity intentionally via bootstrap sample perturbation (Bagging),
              feature subspace sampling (Random Forests), or heterogeneous model architectures.
            </div>
          </Card>
        </div>
      </section>

      {/* 9. Strengths, Limitations & When NOT to Use */}
      <section className="space-y-4">
        <h2 className="font-manrope text-2xl font-semibold tracking-tight text-foreground">
          8. Strengths, limitations & when NOT to use
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-montserrat">
          <Card className="p-5 border border-orange-50/15 bg-neutral-900/30 space-y-3">
            <h3 className="font-manrope text-sm font-semibold text-emerald-400">
              When Ensembles Excel
            </h3>
            <ul className="space-y-2 text-neutral-300 list-disc pl-4">
              <li>
                <strong>Kaggle / Competitive Benchmarks:</strong> When extracting the final
                fractions of a percent in ROC-AUC or F1-score determines leaderboard victory.
              </li>
              <li>
                <strong>Unstable Base Estimators:</strong> High-variance models like deep decision
                trees, neural networks, or unstable feature subsets benefit immensely from
                averaging.
              </li>
              <li>
                <strong>Multimodal Data Distributions:</strong> Combining rule-based logic with
                statistical linear models to handle mixed symbolic-numerical tabular datasets.
              </li>
            </ul>
          </Card>

          <Card className="p-5 border border-orange-50/15 bg-neutral-900/30 space-y-3">
            <h3 className="font-manrope text-sm font-semibold text-rose-400">
              When NOT to Use Ensembles
            </h3>
            <ul className="space-y-2 text-neutral-300 list-disc pl-4">
              <li>
                <strong>Strict Regulatory Interpretability:</strong> Clinical or loan underwriting
                settings requiring clear single-tree decision rules or OLS regression coefficients.
              </li>
              <li>
                <strong>Ultra Low-Latency Inference:</strong> Microsecond edge execution (e.g.
                automotive radar or high-frequency trading) cannot afford evaluating 50 separate
                models sequentially.
              </li>
              <li>
                <strong>Severe Memory Constraints:</strong> Embedded microcontrollers (MCUs) with
                64KB RAM cannot store 100 random forest trees or 10 gradient boosted ensembles.
              </li>
            </ul>
          </Card>
        </div>
      </section>

      {/* 10. Common Misconceptions */}
      <section className="space-y-4">
        <h2 className="font-manrope text-2xl font-semibold tracking-tight text-foreground">
          9. Common misconceptions
        </h2>
        <div className="space-y-3 text-xs font-montserrat">
          <Card className="p-4 border border-orange-50/15 bg-neutral-900/30">
            <div className="font-semibold text-orange-200">
              Myth: &quot;Ensembling always produces higher test accuracy than any single
              constituent model.&quot;
            </div>
            <p className="text-neutral-300 mt-1">
              <strong>Reality:</strong> If one model in the pool is dramatically superior (e.g. an
              SVM with 95% accuracy) while the remaining models are weak (60% accuracy), a
              democratic majority vote will dilute and drag down the superior model. Weights must be
              tuned or weak models pruned.
            </p>
          </Card>

          <Card className="p-4 border border-orange-50/15 bg-neutral-900/30">
            <div className="font-semibold text-orange-200">
              Myth: &quot;A soft voting ensemble simply calculates the same prediction as hard
              voting.&quot;
            </div>
            <p className="text-neutral-300 mt-1">
              <strong>Reality:</strong> Hard voting counts binary votes, ignoring conviction. Soft
              voting sums calibrated class probabilities $\sum P(y=c|x)$. A model that is 99%
              certain can outvote two models that are only 51% confident, leading to significantly
              better calibration and ROC-AUC scores.
            </p>
          </Card>
        </div>
      </section>

      {/* 11. Check Yourself (Micro-Quiz) */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="size-5 text-brand" />
          <h2 className="font-manrope text-2xl font-semibold tracking-tight text-foreground">
            10. Check yourself: concept mastery quiz
          </h2>
        </div>
        <Quiz conceptId="u5-ensemble-significance" items={QUIZ_ITEMS} />
      </section>

      {/* 12. Exam & Viva Corner */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="size-5 text-orange-200" />
          <h2 className="font-manrope text-2xl font-semibold tracking-tight text-foreground">
            11. Exam & viva corner: MIT AOE / Pune University questions
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-montserrat">
          <Card className="p-4 border border-orange-50/15 bg-neutral-900/30 space-y-2">
            <div className="font-semibold text-foreground dark:text-white">
              Q1: State the Condorcet Jury Theorem and its two core assumptions.
            </div>
            <p className="text-neutral-300 leading-relaxed">
              <strong>Answer:</strong> The theorem states that if a group makes a decision by
              majority rule and each voter has an independent probability $p &gt; 0.5$ of being
              correct, the probability of the majority reaching the correct verdict increases with
              group size $M$ and converges to 1 as $M \to \infty$. The two assumptions are: (1)
              Competence ($p &gt; 0.5$) and (2) Independence (conditional error correlation $\rho =
              0$).
            </p>
          </Card>

          <Card className="p-4 border border-orange-50/15 bg-neutral-900/30 space-y-2">
            <div className="font-semibold text-foreground dark:text-white">
              Q2: Distinguish between Hard Voting and Soft Voting in ensemble classification.
            </div>
            <p className="text-neutral-300 leading-relaxed">
              <strong>Answer:</strong> Hard voting predicts the class label that received the
              highest number of discrete votes (majority rule). Soft voting averages the predicted
              class probabilities across all well-calibrated base estimators and predicts the class
              with the highest average probability. Soft voting typically yields higher accuracy
              because it weights high-confidence decisions.
            </p>
          </Card>
        </div>
      </section>

      {/* 13. Summary & Key Takeaways */}
      <section className="space-y-4">
        <h2 className="font-manrope text-2xl font-semibold tracking-tight text-foreground">
          12. Summary & key takeaways
        </h2>
        <Card className="p-6 border border-orange-50/15 bg-neutral-900/40 space-y-3 text-xs font-montserrat">
          <ul className="space-y-2 text-neutral-300 list-disc pl-4">
            <li>
              <strong>Ensemble Promise:</strong> Combining diverse, competent hypotheses reduces
              generalization variance without incurring additional model bias.
            </li>
            <li>
              <strong>Ambiguity Decomposition:</strong> Ensemble Mean Squared Error strictly equals
              the average constituent error minus the model diversity (ambiguity).
            </li>
            <li>
              <strong>The Role of Diversity:</strong> Correlated errors destroy ensemble advantages.
              Effective ensembling requires conscious mechanisms to decorrelate base estimators
              (bootstrap subsets, subspace sampling, heterogeneous architectures).
            </li>
          </ul>
        </Card>
      </section>

      {/* 14. What's Next */}
      <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-orange-50/15 pt-6">
        <div>
          <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
            Next Syllabus Topic
          </div>
          <h3 className="font-manrope text-lg font-semibold text-foreground dark:text-white mt-0.5">
            Bagging (Bootstrap Aggregation) & Random Forests
          </h3>
          <p className="text-xs text-neutral-400 font-montserrat">
            How Leo Breiman transformed high-variance decision trees into the most robust tabular
            classifier in machine learning history.
          </p>
        </div>
        <Link to="/learn/unit-5/bagging-random-forests">
          <Button
            size="sm"
            variant="primary"
            className="flex items-center gap-1.5 text-xs whitespace-nowrap"
          >
            <span>Explore Random Forests</span>
            <ArrowRight className="size-3.5" />
          </Button>
        </Link>
      </section>
    </div>
  );
}
