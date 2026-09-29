import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Quiz, type QuizItem } from '@/features/quiz/Quiz';
import { RandomForestLab } from '@/labs/random-forest/RandomForestLab';
import { useProgressStore } from '@/features/progress/useProgressStore';
import {
  Trees,
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
    id: 'u5-rf-q1',
    question:
      'In bootstrap sampling with replacement of size N from a dataset of size N, what exact mathematical fraction of the unique training samples is expected to be chosen in the bootstrap sample as N approaches infinity?',
    options: [
      {
        id: 'opt-a',
        text: 'Exactly 50.0% of the dataset.',
        isCorrect: false,
        explanation:
          'Sampling with replacement allows repeated picks, so more than half of the distinct instances are selected.',
      },
      {
        id: 'opt-b',
        text: 'Approximately 63.2% (1 - 1/e), leaving ~36.8% as Out-of-Bag (OOB) samples.',
        isCorrect: true,
        explanation:
          'The probability of a sample NOT being chosen in N draws is (1 - 1/N)^N -> 1/e ≈ 0.3679. Hence 1 - 0.3679 ≈ 0.6321 are chosen.',
      },
      {
        id: 'opt-c',
        text: '100% of the dataset because N draws are made.',
        isCorrect: false,
        explanation:
          'Because draws are made with replacement, duplicates occur, leaving over a third of samples untouched.',
      },
      {
        id: 'opt-d',
        text: 'It depends on the number of features in the dataset.',
        isCorrect: false,
        explanation:
          'Bootstrap sampling operates across rows (instances), completely independent of the feature dimension d.',
      },
    ],
  },
  {
    id: 'u5-rf-q2',
    question:
      'Why does Breiman Random Forest algorithm enforce random feature subspace sampling (e.g. m = floor(sqrt(d))) at every split rather than standard Bagging (m = d)?',
    options: [
      {
        id: 'opt-a',
        text: 'To de-correlate the individual trees so that a dominant, strong feature does not dictate the root split of every tree.',
        isCorrect: true,
        explanation:
          'If one feature is very predictive, standard Bagging will pick it as root in every tree, causing high correlation rho. Subsampling forces trees to explore alternative predictive paths.',
      },
      {
        id: 'opt-b',
        text: 'To guarantee that all decision trees grow to infinite depth.',
        isCorrect: false,
        explanation:
          'Tree depth is controlled by max_depth and min_samples_split, not feature subspace size.',
      },
      {
        id: 'opt-c',
        text: 'To convert the algorithm into a linear classifier.',
        isCorrect: false,
        explanation:
          'Random Forest decision boundaries remain highly non-linear orthogonal piecewise ensembles.',
      },
      {
        id: 'opt-d',
        text: 'To eliminate the need for bootstrap sampling.',
        isCorrect: false,
        explanation:
          'Random Forest uses BOTH bootstrap row sampling (bagging) AND column subspace sampling simultaneously.',
      },
    ],
  },
  {
    id: 'u5-rf-q3',
    question:
      'What is the primary operational advantage of the Out-of-Bag (OOB) error estimate in Random Forests?',
    options: [
      {
        id: 'opt-a',
        text: 'It provides an unbiased test error estimate during training without requiring an independent validation or cross-validation set.',
        isCorrect: true,
        explanation:
          'Each sample is evaluated only using the ~36.8% of trees that never saw it in their bootstrap training set, providing an internal cross-validation for free.',
      },
      {
        id: 'opt-b',
        text: 'It guarantees that the training set error drops to exactly zero.',
        isCorrect: false,
        explanation:
          'OOB error measures out-of-sample generalization error, not in-bag training error.',
      },
      {
        id: 'opt-c',
        text: 'It speeds up training by skipping 36.8% of all data points completely.',
        isCorrect: false,
        explanation:
          'All points are used across the ensemble; each tree simply trains on its own random subset.',
      },
      {
        id: 'opt-d',
        text: 'It converts the Random Forest into a neural network.',
        isCorrect: false,
        explanation:
          'OOB is a validation technique for bagging ensembles, unrelated to deep learning architectures.',
      },
    ],
  },
];

export function BaggingRandomForestsPage() {
  const [copiedPython, setCopiedPython] = useState(false);
  const getConceptProgress = useProgressStore((state) => state.getConceptProgress);
  const progress = getConceptProgress('u5-bagging-random-forests');
  const isCompleted = Boolean(progress?.labCompleted || progress?.read);

  const pythonSnippet = `import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# 1. Synthesize complex tabular dataset with 20 features
X, y = make_classification(
    n_samples=2000,
    n_features=20,
    n_informative=12,
    n_redundant=4,
    random_state=42
)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)

# 2. Baseline: Single deep unconstrained Decision Tree (high variance)
tree = DecisionTreeClassifier(random_state=42)
tree.fit(X_train, y_train)
tree_train_acc = accuracy_score(y_train, tree.predict(X_train))
tree_test_acc = accuracy_score(y_test, tree.predict(X_test))

print(f"--- Single Decision Tree ---")
print(f"Train Accuracy: {tree_train_acc * 100:.2f}% (Overfitting)")
print(f"Test Accuracy:  {tree_test_acc * 100:.2f}%\\n")

# 3. Breiman's Random Forest with Out-of-Bag (OOB) scoring
# max_features='sqrt' enforces m = floor(sqrt(20)) = 4 features per split
rf = RandomForestClassifier(
    n_estimators=100,
    max_features='sqrt',
    oob_score=True,
    random_state=42,
    n_jobs=-1
)
rf.fit(X_train, y_train)

rf_train_acc = accuracy_score(y_train, rf.predict(X_train))
rf_test_acc = accuracy_score(y_test, rf.predict(X_test))

print(f"--- Random Forest (100 Trees, m=sqrt(20)) ---")
print(f"Train Accuracy: {rf_train_acc * 100:.2f}%")
print(f"Test Accuracy:  {rf_test_acc * 100:.2f}% (Variance Reduced)")
print(f"OOB Score:      {rf.oob_score_ * 100:.2f}% (Internal Validation)")

# 4. Top 3 Feature Importances (MDI - Mean Decrease in Impurity)
importances = rf.feature_importances_
top_indices = np.argsort(importances)[::-1][:3]
print("\\nTop 3 Informative Features:")
for idx in top_indices:
    print(f"  Feature #{idx:02d}: {importances[idx]:.4f}")
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
            <span className="text-foreground dark:text-neutral-200">Bagging & Random Forests</span>
          </nav>
          {isCompleted && (
            <Badge variant="success" size="sm">
              Completed
            </Badge>
          )}
        </div>

        <h1 className="font-manrope text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Bagging (bootstrap aggregation) & random forests
        </h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 max-w-3xl font-montserrat leading-relaxed">
          How Leo Breiman transformed brittle, high-variance decision trees into the most dependable
          general-purpose classifier in modern data science through{' '}
          <span className="font-montserrat font-medium text-yellow-800 dark:text-orange-100">
            bootstrap sampling and random feature subspace de-correlation
          </span>
          .
        </p>

        {/* Syllabus Tag Chips */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant="unit" unit={5}>
            Unit 5 Core
          </Badge>
          <Badge variant="outline">1.0 Hour</Badge>
          <Badge variant="outline">Course Outcome: CO3, CO4</Badge>
          <Badge variant="outline">Breiman 2001</Badge>
        </div>
      </div>

      {/* 2. Intuition */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="size-5 text-amber-400" />
          <h2 className="font-manrope text-2xl font-semibold tracking-tight text-foreground">
            1. Intuition: why one tree is brittle but a forest is resilient
          </h2>
        </div>
        <p className="text-sm text-neutral-700 dark:text-neutral-300 font-montserrat leading-relaxed">
          Decision trees possess low bias but notoriously high variance. A single rogue outlier
          point or slight modification in the training dataset can cause a completely different
          feature to be chosen at the root, radically altering every downstream branch. This makes
          individual trees brittle, unstable, and prone to overfitting noisy training quirks.
        </p>
        <p className="text-sm text-neutral-700 dark:text-neutral-300 font-montserrat leading-relaxed">
          Bootstrap Aggregation (Bagging) addresses this vulnerability directly: instead of relying
          on one tree trained on all data, we draw dozens of random bootstrap replicates with
          replacement and train a deep tree on each replicate. But Breiman discovered a vital catch:
          if one feature is overwhelmingly strong, every bagged tree will still choose it at the
          root, producing heavily correlated trees. To break this correlation, Random Forests
          enforce{' '}
          <strong className="text-foreground dark:text-white">Random Feature Subspaces</strong>: at
          every split, the tree is only permitted to consider a small random subset of features (m ≈
          √d). This forces diverse exploration and drives prediction variance down to near zero.
        </p>
      </section>

      {/* 3. Interactive Lab */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Trees className="size-5 text-brand" />
          <h2 className="font-manrope text-2xl font-semibold tracking-tight text-foreground">
            2. Interactive lab: Random Forest bagging & subspace explorer
          </h2>
        </div>
        <p className="text-sm text-neutral-700 dark:text-neutral-300 font-montserrat">
          Compare the jagged, overfitted decision boundaries of a single decision tree against the
          smooth, robust probability contours of a Random Forest. Adjust tree count and subspace
          parameters to observe real-time Out-of-Bag (OOB) error reduction.
        </p>
        <RandomForestLab />
      </section>

      {/* 4. Step-by-Step on Paper */}
      <section className="space-y-4">
        <h2 className="font-manrope text-2xl font-semibold tracking-tight text-foreground">
          3. Step-by-step on paper: the 63.2% bootstrap mathematical proof
        </h2>
        <p className="text-sm text-neutral-700 dark:text-neutral-300 font-montserrat leading-relaxed">
          Students often ask: &quot;Why does bootstrap sampling leave out roughly a third of the
          dataset?&quot; Let us derive this fundamental probability step by step.
        </p>

        <Card className="p-5 border border-orange-50/15 bg-neutral-900/40 space-y-4 font-mono text-xs">
          <div>
            <div className="text-orange-200 font-bold mb-1">
              Step 1: Probability of a Specific Sample Not Being Picked
            </div>
            <p className="text-neutral-300 font-montserrat">
              Suppose a dataset contains $N$ distinct samples. When drawing a single item uniformly
              at random with replacement:
            </p>
            <div className="text-neutral-200 mt-1">
              P(specific sample i is chosen on draw 1) = {'1 / N'}
            </div>
            <div className="text-neutral-200">
              P(specific sample i is NOT chosen on draw 1) = {'1 - 1 / N'}
            </div>
          </div>

          <div className="border-t border-orange-50/10 pt-3">
            <div className="text-orange-200 font-bold mb-1">
              Step 2: Probability Across N Independent Draws
            </div>
            <p className="text-neutral-300 font-montserrat">
              Because draws are independent with replacement, the probability that sample $i$ is NOT
              chosen in any of the $N$ total draws is:
            </p>
            <div className="text-neutral-200 mt-1">
              {'P(sample i is Out-of-Bag) = (1 - 1 / N)^N'}
            </div>
          </div>

          <div className="border-t border-orange-50/10 pt-3">
            <div className="text-orange-200 font-bold mb-1">
              Step 3: Evaluate Asymptotic Limit as N → ∞
            </div>
            <p className="text-neutral-300 font-montserrat">
              Recall the classic calculus definition of the exponential constant e: as N approaches
              infinity, (1 + x/N)^N = e^x. Setting x = -1:
            </p>
            <div className="text-emerald-400 font-bold my-1">
              {
                '\\lim_{N \\to \\infty} \\left(1 - \\frac{1}{N}\\right)^N = e^{-1} = \\frac{1}{e} \\approx 0.367879 \\approx 36.8\\%'
              }
            </div>
            <div className="text-orange-200 font-bold">
              {'P(Sample Included In-Bag) = 1 - \\frac{1}{e} \\approx 0.632121 \\approx 63.2\\%'}
            </div>
            <p className="text-neutral-400 font-montserrat mt-1">
              Hence, every bootstrap tree trains on roughly 63.2% unique records, naturally leaving
              36.8% untouched as pristine validation data!
            </p>
          </div>
        </Card>
      </section>

      {/* 5. Formal Mathematical Foundations */}
      <section className="space-y-4">
        <h2 className="font-manrope text-2xl font-semibold tracking-tight text-foreground">
          4. Formal mathematical foundations: variance & subspace de-correlation
        </h2>
        <p className="text-sm text-neutral-700 dark:text-neutral-300 font-montserrat leading-relaxed">
          Leo Breiman formulated Random Forests in 2001 to resolve the variance limits of standard
          Bagging.
        </p>

        <Card className="p-6 border border-orange-50/15 bg-neutral-900/40 space-y-4 text-xs font-montserrat">
          <div>
            <h3 className="font-manrope text-sm font-semibold text-orange-200">
              The Variance of Averaged Correlated Random Variables
            </h3>
            <p className="text-neutral-300 mt-1">
              Let B be the number of trees. If each tree has variance $\sigma^2$ and any two
              distinct trees have pairwise correlation coefficient $\rho$, the variance of their
              simple average T_avg(x) = (1/B) sum(T_b(x)) is:
            </p>
            <div className="my-2 p-3 bg-black/50 border border-orange-50/10 rounded font-mono text-neutral-200 text-center">
              {'$$ \\text{Var}(\\bar{T}(x)) = \\rho \\sigma^2 + \\frac{1 - \\rho}{B} \\sigma^2 $$'}
            </div>
            <p className="text-neutral-400">
              As $B \to \infty$, the second term $(1 - \rho) \sigma^2 / B \to 0$. However, the first
              term $\rho \sigma^2$ remains unchanged! This proves that{' '}
              <strong className="text-white">
                tree correlation $\rho$ sets the theoretical performance ceiling of Bagging
              </strong>
              .
            </p>
          </div>

          <div className="border-t border-orange-50/10 pt-4">
            <h3 className="font-manrope text-sm font-semibold text-orange-200">
              The Breiman Subspace Solution (m ≈ √d)
            </h3>
            <p className="text-neutral-300 mt-1">
              By forcing each node split to evaluate only m = floor(sqrt(d)) randomly sampled
              features (for classification) or m = floor(d/3) (for regression), Random Forests
              dramatically decrease the inter-tree correlation $\rho$. Even though individual tree
              variance $\sigma^2$ increases slightly due to suboptimal splits, the reduction in
              $\rho$ is so steep that net ensemble variance plummets.
            </p>
          </div>

          <div className="border-t border-orange-50/10 pt-4">
            <h3 className="font-manrope text-sm font-semibold text-orange-200">
              Out-of-Bag (OOB) Generalization Risk
            </h3>
            <div className="my-2 p-3 bg-black/50 border border-orange-50/10 rounded font-mono text-neutral-200 text-center">
              {
                '$$ \\text{Err}_{\\text{OOB}} = \\frac{1}{N} \\sum_{i=1}^N L\\left(y_i, \\text{mode}_{b \\in \\mathcal{B}_i} \\{ T_b(x_i) \\}\\right) $$'
              }
            </div>
            <p className="text-neutral-400">
              Where B_i is the subset of all trees whose bootstrap training set did not contain
              sample i. Breiman proved that OOB error is asymptotically equivalent to leave-one-out
              cross-validation!
            </p>
          </div>
        </Card>
      </section>

      {/* 6. Algorithm Pseudocode */}
      <section className="space-y-4">
        <h2 className="font-manrope text-2xl font-semibold tracking-tight text-foreground">
          5. Algorithm pseudocode: Breiman Random Forest
        </h2>
        <Card className="p-4 border border-orange-50/15 bg-neutral-900/40 font-mono text-xs text-neutral-300 space-y-1">
          <div className="text-neutral-500">
            {'// Algorithm: Breiman Random Forest Training & Inference'}
          </div>
          <div>
            <strong className="text-orange-200">Input:</strong> Dataset D of size N, Number of trees
            B, Subspace size m
          </div>
          <div>
            <strong className="text-orange-200">Output:</strong> Ensemble of B decorrelated decision
            trees
          </div>
          <div className="pt-2 text-neutral-500">{'// Training loop'}</div>
          <div>
            <strong>for</strong> b = 1 <strong>to</strong> B <strong>do</strong>:
          </div>
          <div className="pl-4">D_b = Draw bootstrap sample of size N with replacement from D</div>
          <div className="pl-4">T_b = Grow unpruned decision tree on D_b:</div>
          <div className="pl-8">
            <strong>at each internal node:</strong>
          </div>
          <div className="pl-12">
            Select m feature indices at random from all d features (m &lt;&lt; d)
          </div>
          <div className="pl-12">
            Pick best feature and threshold among these m candidates minimizing Gini
          </div>
          <div className="pl-12">Split node into left and right child nodes</div>
          <div>
            <strong>end for</strong>
          </div>
          <div className="pt-2 text-neutral-500">{'// Inference on test point x'}</div>
          <div>
            <strong>return</strong> y_pred = mode({'{ T_1(x), T_2(x), ..., T_B(x) }'})
          </div>
        </Card>
      </section>

      {/* 7. Code It in Python */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="size-5 text-brand" />
            <h2 className="font-manrope text-2xl font-semibold tracking-tight text-foreground">
              6. Code it in Python: Scikit-Learn RandomForestClassifier & OOB
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
            7. Make it fail: edge cases where Random Forests degrade
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-5 border border-rose-500/20 bg-rose-950/10 space-y-2">
            <h4 className="font-manrope text-sm font-semibold text-rose-300">
              Failure Mode 1: High-Dimensional Extreme Sparsity (NLP / Text TF-IDF)
            </h4>
            <p className="text-xs text-neutral-300 font-montserrat leading-relaxed">
              When dealing with bag-of-words or TF-IDF matrices ($d = 50,000$ features with only 20
              non-zero words per document), selecting $m = \sqrt{50000} \approx 223$ random features
              per split will almost always pick 223 features that are all zeroes. The trees struggle
              to find any informative split, and linear models (Logistic Regression / Linear SVM)
              dramatically outperform the forest.
            </p>
          </Card>

          <Card className="p-5 border border-amber-500/20 bg-amber-950/10 space-y-2">
            <h4 className="font-manrope text-sm font-semibold text-amber-300">
              Failure Mode 2: Extrapolation Beyond Training Range (Regression Trends)
            </h4>
            <p className="text-xs text-neutral-300 font-montserrat leading-relaxed">
              Because decision trees predict constant step values in bounded leaf boxes, Random
              Forest regressors cannot extrapolate linear trends beyond the maximum and minimum $y$
              values observed in training. On time-series stock prices or GDP projections, Random
              Forests predict a flat horizontal line once inputs exceed historical bounds.
            </p>
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
              Strengths of Random Forests
            </h3>
            <ul className="space-y-2 text-neutral-300 list-disc pl-4">
              <li>
                <strong>Robust Default Hyperparameters:</strong> Often achieves near-optimal tabular
                benchmark performance with zero tuning.
              </li>
              <li>
                <strong>No Feature Scaling Required:</strong> Invariant to monotonic
                transformations, handling mixed numerical and categorical scales effortlessly.
              </li>
              <li>
                <strong>Free Validation Metric:</strong> Out-of-Bag (OOB) error eliminates the
                necessity of sacrificing 20% of data for a validation split.
              </li>
              <li>
                <strong>Trivially Parallelizable:</strong> All $B$ trees can be trained
                simultaneously across all CPU cores (`n_jobs=-1`).
              </li>
            </ul>
          </Card>

          <Card className="p-5 border border-orange-50/15 bg-neutral-900/30 space-y-3">
            <h3 className="font-manrope text-sm font-semibold text-rose-400">
              Limitations & When NOT to Use
            </h3>
            <ul className="space-y-2 text-neutral-300 list-disc pl-4">
              <li>
                <strong>Large Model Disk Footprint:</strong> Storing 500 deep unpruned trees on
                dense datasets can consume hundreds of megabytes in memory.
              </li>
              <li>
                <strong>Loss of Intuitive Tree Interpretability:</strong> You can no longer trace a
                simple top-down flowchart for human auditors.
              </li>
              <li>
                <strong>Inability to Extrapolate Trends:</strong> Piecewise constant terminal leaves
                fail on continuous upward trends.
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
              Myth: &quot;Adding more trees (e.g. 1000 instead of 100) causes Random Forests to
              overfit the training data.&quot;
            </div>
            <p className="text-neutral-300 mt-1">
              <strong>Reality:</strong> Leo Breiman proved via the Strong Law of Large Numbers that
              as $B \to \infty$, Random Forest generalization error converges to a fixed limiting
              value. Adding more trees does NOT cause overfitting; it merely wastes computation once
              the variance reduction asymptote is achieved.
            </p>
          </Card>

          <Card className="p-4 border border-orange-50/15 bg-neutral-900/30">
            <div className="font-semibold text-orange-200">
              Myth: &quot;Random Forests require pre-pruning like max_depth to avoid high
              error.&quot;
            </div>
            <p className="text-neutral-300 mt-1">
              <strong>Reality:</strong> Unlike single trees which must be aggressively pruned,
              Random Forests thrive when individual trees are grown deep and unpruned (low bias,
              high variance), because ensemble averaging handles the variance reduction.
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
        <Quiz conceptId="u5-bagging-random-forests" items={QUIZ_ITEMS} />
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
              Q1: Differentiate between Bagging and Random Forests.
            </div>
            <p className="text-neutral-300 leading-relaxed">
              <strong>Answer:</strong> Both algorithms employ bootstrap aggregation across rows.
              However, standard Bagging considers all $d$ features at every node split ($m = d$),
              allowing strong features to dominate every tree. Random Forests inject an additional
              layer of randomness by considering only a random feature subset (m ≈ √d) at each
              split, drastically de-correlating the trees.
            </p>
          </Card>

          <Card className="p-4 border border-orange-50/15 bg-neutral-900/30 space-y-2">
            <div className="font-semibold text-foreground dark:text-white">
              Q2: What is Mean Decrease in Impurity (MDI) feature importance?
            </div>
            <p className="text-neutral-300 leading-relaxed">
              <strong>Answer:</strong> MDI measures the total reduction in node impurity (Gini or
              Entropy) brought by all splits on a given feature, weighted by the fraction of samples
              reaching each node, averaged across all trees in the forest. High MDI indicates a
              feature frequently provides decisive splits.
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
              <strong>Bootstrap Coverage:</strong> Drawing $N$ times with replacement captures
              roughly 63.2% unique records, providing an inherent 36.8% Out-of-Bag validation
              partition.
            </li>
            <li>
              <strong>Double Randomization:</strong> Random Forest achieves robustness by combining
              row-level bootstrap bagging with column-level random subspace sampling (m ≈ √d).
            </li>
            <li>
              <strong>Variance Mastery:</strong> Tree averaging reduces variance down to the
              correlation floor $\rho \sigma^2$. Subspace sampling shrinks $\rho$, unlocking
              exceptional tabular accuracy.
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
            Boosting Concepts & Stacking (Stacked Generalization)
          </h3>
          <p className="text-xs text-neutral-400 font-montserrat">
            Shift from parallel variance reduction to sequential bias correction: how AdaBoost turns
            weak stumps into formidable classifiers and Stacking meta-learners blend heterogeneous
            models.
          </p>
        </div>
        <Link to="/learn/unit-5/boosting-stacking">
          <Button
            size="sm"
            variant="primary"
            className="flex items-center gap-1.5 text-xs whitespace-nowrap"
          >
            <span>Explore Boosting & Stacking</span>
            <ArrowRight className="size-3.5" />
          </Button>
        </Link>
      </section>
    </div>
  );
}
