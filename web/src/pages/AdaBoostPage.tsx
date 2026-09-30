import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Quiz } from '@/features/quiz/Quiz';
import { useProgressStore } from '@/features/progress/useProgressStore';
import { AdaBoostMechanicsLab } from '@/labs/adaboost-mechanics/AdaBoostMechanicsLab';
import {
  Zap,
  Layers,
  AlertTriangle,
  HelpCircle,
  Award,
  ArrowRight,
  Copy,
  Check,
} from 'lucide-react';

export const AdaBoostPage: React.FC = () => {
  const [copiedPython, setCopiedPython] = useState(false);
  const getConceptProgress = useProgressStore((state) => state.getConceptProgress);
  const progress = getConceptProgress('u5-self-adaboost');
  const isCompleted = Boolean(progress?.labCompleted || progress?.read);

  const pythonSnippet = `import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import AdaBoostClassifier
from sklearn.metrics import accuracy_score

# 1. Generate Non-Linear 2D Dataset
X, y = make_classification(
    n_samples=500, n_features=2, n_redundant=0, n_informative=2,
    n_clusters_per_class=1, flip_y=0.05, random_state=42
)
# Convert binary labels from {0, 1} to {-1, +1} standard AdaBoost notation
y_signed = np.where(y == 0, -1, 1)
X_train, X_test, y_train, y_test = train_test_split(X, y_signed, test_size=0.25, random_state=42)

# 2. Pure NumPy Implementation of Freund & Schapire AdaBoost.M1
class ScratchAdaBoost:
    def __init__(self, n_estimators=10):
        self.n_estimators = n_estimators
        self.alphas = []
        self.models = []

    def fit(self, X, y):
        n = len(X)
        w = np.full(n, 1.0 / n)  # Initialize uniform weights

        for t in range(self.n_estimators):
            # Fit weak learner (decision stump: max_depth=1)
            stump = DecisionTreeClassifier(max_depth=1)
            stump.fit(X, y, sample_weight=w)
            pred = stump.predict(X)

            # Calculate weighted error: epsilon_t
            misclassified = (pred != y)
            eps_t = np.sum(w[misclassified]) / np.sum(w)
            eps_t = np.clip(eps_t, 1e-10, 0.4999)

            # Compute classifier voting weight: alpha_t
            alpha_t = 0.5 * np.log((1.0 - eps_t) / eps_t)

            # Update sample weights: w_i := w_i * exp(-alpha * y_i * h(x_i))
            w = w * np.exp(-alpha_t * y * pred)
            w = w / np.sum(w)  # Normalize via Z_t

            self.alphas.append(alpha_t)
            self.models.append(stump)

    def predict(self, X):
        # Weighted sign aggregation: sign(sum(alpha_t * h_t(x)))
        stump_preds = np.array([alpha * stump.predict(X) for alpha, stump in zip(self.alphas, self.models)])
        return np.sign(np.sum(stump_preds, axis=0))

# 3. Benchmark Scratch AdaBoost against Single Decision Stump
stump_baseline = DecisionTreeClassifier(max_depth=1).fit(X_train, y_train)
base_acc = accuracy_score(y_test, stump_baseline.predict(X_test))

ada = ScratchAdaBoost(n_estimators=20)
ada.fit(X_train, y_train)
ada_acc = accuracy_score(y_test, ada.predict(X_test))

print(f"Single Weak Stump Test Accuracy:   {base_acc * 100:.2f}%")
print(f"20-Round AdaBoost Test Accuracy:     {ada_acc * 100:.2f}%")
print(f"Ensemble Accuracy Gain:            +{(ada_acc - base_acc) * 100:.2f}%")
`;

  const copyCode = () => {
    void navigator.clipboard.writeText(pythonSnippet);
    setCopiedPython(true);
    setTimeout(() => setCopiedPython(false), 2000);
  };

  const quizItems = [
    {
      id: 'ada-q1',
      question:
        'In AdaBoost, what is the consequence if a weak learner produces a training error rate of exactly ε = 0.50 (equivalent to a random coin toss)?',
      options: [
        {
          id: 'A',
          text: 'Its voting weight becomes α = 0, meaning it contributes zero influence to the final ensemble prediction.',
          isCorrect: true,
          explanation:
            'When epsilon = 0.50, (1 - eps)/eps = 1.0, and ln(1.0) = 0. The formula alpha = 0.5 * ln((1-eps)/eps) yields alpha = 0, completely muting the useless classifier.',
        },
        {
          id: 'B',
          text: 'Its voting weight becomes infinite, causing algorithm failure.',
          isCorrect: false,
          explanation:
            'Alpha reaches infinity only when the error approaches zero (epsilon -> 0), not 0.50.',
        },
        {
          id: 'C',
          text: 'The sample weights are inverted by -180 degrees.',
          isCorrect: false,
          explanation:
            'Inversion occurs when error exceeds 0.50 (where alpha becomes negative), not at 0.50.',
        },
      ],
    },
    {
      id: 'ada-q2',
      question:
        'Why is the normalization constant Z_t in AdaBoost analytically equivalent to 2 * sqrt(ε_t * (1 - ε_t))?',
      options: [
        {
          id: 'A',
          text: 'Because substituting alpha_t = 0.5 * ln((1 - eps_t) / eps_t) into the sum of exponential weight updates over correctly and incorrectly classified partitions simplifies algebraically to 2 * sqrt(eps_t * (1 - eps_t)).',
          isCorrect: true,
          explanation:
            'For correct samples, exp(-alpha) = sqrt(eps/(1-eps)). For incorrect samples, exp(+alpha) = sqrt((1-eps)/eps). Multiplying by their respective weight sums (1-eps) and eps yields sqrt(eps*(1-eps)) + sqrt(eps*(1-eps)) = 2*sqrt(eps*(1-eps)).',
        },
        {
          id: 'B',
          text: 'Because Z_t is defined as the Euclidean L2 norm of the weight vector.',
          isCorrect: false,
          explanation:
            'Z_t is an L1 sum of updated probabilities, not an L2 Euclidean vector norm.',
        },
        {
          id: 'C',
          text: 'Because AdaBoost assumes a normal Gaussian error distribution.',
          isCorrect: false,
          explanation:
            'AdaBoost makes no Gaussian assumption; it is a non-parametric exponential loss minimizer.',
        },
      ],
    },
    {
      id: 'ada-q3',
      question:
        'What is the primary architectural vulnerability of AdaBoost when applied to noisy real-world data?',
      options: [
        {
          id: 'A',
          text: 'Severe sensitivity to label noise and mislabeled outliers, because AdaBoost exponentially multiplies the weights of unclassifiable points on every round, forcing subsequent stumps to fit pure noise.',
          isCorrect: true,
          explanation:
            'Because the loss is exponential, an outlier that can never be correctly classified has its weight multiplied by exp(alpha) round after round, quickly monopolizing the total weight budget and destroying the decision boundary.',
        },
        {
          id: 'B',
          text: 'Inability to reduce bias on complex non-linear datasets.',
          isCorrect: false,
          explanation:
            'Boosting is specifically designed to reduce bias, driving training error toward zero.',
        },
        {
          id: 'C',
          text: 'High variance on small sample sizes.',
          isCorrect: false,
          explanation:
            'AdaBoost uses constrained weak learners (stumps) with low variance; its flaw is outlier fragility.',
        },
      ],
    },
  ];

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
            <span className="text-foreground dark:text-neutral-200">AdaBoost Mechanics</span>
          </nav>
          {isCompleted && (
            <Badge variant="success" size="sm">
              Completed
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="unit">Unit 5 Self-Study</Badge>
          <Badge variant="outline">0.5 Hour Lab</Badge>
          <Badge variant="outline">Course Outcome: CO3, CO4</Badge>
          <Badge variant="outline">Sequential Ensemble</Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground font-manrope">
          Self-study: AdaBoost algorithm mechanics
        </h1>
        <p className="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-300 font-montserrat leading-relaxed max-w-3xl">
          Dissect Yoav Freund and Robert Schapire's landmark AdaBoost.M1 algorithm, tracking how{' '}
          <span className="font-montserrat font-medium text-yellow-800 dark:text-orange-100">
            sequential sample reweighting converts weak decision stumps into a robust strong
            classifier
          </span>
          .
        </p>
      </div>

      {/* 2. Intuition */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground font-manrope flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          1. Intuitive foundation: The student and teacher analogy
        </h2>
        <div className="text-sm text-neutral-600 dark:text-neutral-300 font-montserrat leading-relaxed space-y-3">
          <p>
            Imagine a student preparing for a challenging engineering exam. On their first mock
            test, they answer 70% of questions correctly and miss 30%. In Bagging, they would simply
            take another mock test drawn at random. In AdaBoost, however, the student highlights the
            30% missed questions with red ink, spending disproportionately more revision time on
            their weaknesses.
          </p>
          <p>
            On the next mock exam, questions previously missed carry heavier weight. A new weak
            tutor (decision stump) is trained specifically to master those difficult edge cases. In
            the final exam board, tutors who proved highly accurate receive authoritative louder
            votes ({'\\(\\alpha_t\\)'}), while mediocre tutors receive muted votes, producing a
            collective decision that vastly outperforms any individual teacher.
          </p>
        </div>
      </section>

      {/* 3. Interactive Lab */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground font-manrope flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand" />
            2. Interactive lab: Round-by-round weight dynamics
          </h2>
          <Badge variant="outline" size="sm">
            Interactive Engine
          </Badge>
        </div>
        <p className="text-xs text-neutral-400 font-montserrat">
          Scrub through sequential boosting rounds, observe sample weights expand for misclassified
          points, and explore the sensitivity of classifier voting power {'\\(\\alpha\\)'}.
        </p>
        <AdaBoostMechanicsLab />
      </section>

      {/* 4. Step-by-Step on Paper */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground font-manrope">
          3. Step-by-step on paper: The three core formulas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-montserrat">
          <Card className="p-4 border-orange-50/15 bg-neutral-900/40 space-y-2">
            <div className="font-bold font-manrope text-sm text-amber-400">
              Step 1: Weighted Error (ε_t)
            </div>
            <p className="text-neutral-300 leading-relaxed">
              Sum the weights of all training points misclassified by weak learner {'\\(h_t\\)'}:
            </p>
            <div className="p-2 rounded bg-black/40 font-mono text-cream text-center">
              {'$$\\epsilon_t = \\sum_{i: y_i \\neq h_t(x_i)} w_i^{(t)}$$'}
            </div>
          </Card>

          <Card className="p-4 border-orange-50/15 bg-neutral-900/40 space-y-2">
            <div className="font-bold font-manrope text-sm text-emerald-400">
              Step 2: Learner Weight (α_t)
            </div>
            <p className="text-neutral-300 leading-relaxed">
              Compute voting authority based on log-odds ratio:
            </p>
            <div className="p-2 rounded bg-black/40 font-mono text-cream text-center">
              {
                '$$\\alpha_t = \\frac{1}{2} \\ln\\left(\\frac{1 - \\epsilon_t}{\\epsilon_t}\\right)$$'
              }
            </div>
          </Card>

          <Card className="p-4 border-orange-50/15 bg-neutral-900/40 space-y-2">
            <div className="font-bold font-manrope text-sm text-blue-400">
              Step 3: Weight Update (w_i)
            </div>
            <p className="text-neutral-300 leading-relaxed">
              Multiply misclassified weights by {'\\(e^{\\alpha_t}\\)'} and re-normalize via{' '}
              {'\\(Z_t\\)'}:
            </p>
            <div className="p-2 rounded bg-black/40 font-mono text-cream text-center">
              {'$$w_i^{(t+1)} = \\frac{w_i^{(t)} e^{-\\alpha_t y_i h_t(x_i)}}{Z_t}$$'}
            </div>
          </Card>
        </div>
      </section>

      {/* 5. Formal Mathematical Foundations */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground font-manrope">
          4. Formal mathematical foundations: Exponential loss minimization
        </h2>
        <div className="p-5 rounded-xl border border-orange-50/15 bg-neutral-900/50 space-y-4 text-xs font-montserrat leading-relaxed">
          <p className="text-neutral-300">
            Jerome Friedman, Trevor Hastie, and Robert Tibshirani (2000) proved that AdaBoost is an
            exact form of sequential stage-wise additive modeling minimizing the exponential loss
            function:
          </p>
          <div className="p-2.5 rounded-lg bg-black/40 font-mono text-center text-cream my-2">
            {'$$L(y, F(\\mathbf{x})) = \\sum_{i=1}^N \\exp\\left(-y_i F(\\mathbf{x}_i)\\right)$$'}
          </div>
          <p className="text-neutral-300">
            Where {'\\(F(\\mathbf{x}) = \\sum_{t=1}^T \\alpha_t h_t(\\mathbf{x})\\)'}. At step{' '}
            {'\\(t\\)'}, fixing previous learners {'\\(F_{t-1}\\)'}, the loss is:
          </p>
          <div className="p-2.5 rounded-lg bg-black/40 font-mono text-center text-cream my-2">
            {
              '$$L = \\sum_{i=1}^N \\exp\\left(-y_i (F_{t-1}(\\mathbf{x}_i) + \\alpha_t h_t(\\mathbf{x}_i))\\right) = \\sum_{i=1}^N w_i^{(t)} \\exp\\left(-\\alpha_t y_i h_t(\\mathbf{x}_i)\\right)$$'
            }
          </div>
          <p className="text-neutral-300">
            Splitting the sum into correctly classified points ({'\\(y_i = h_t(x_i)\\)'}) and
            misclassified points ({'\\(y_i \\neq h_t(x_i)\\)'}):
          </p>
          <div className="p-2.5 rounded-lg bg-black/40 font-mono text-center text-cream my-2">
            {'$$L = e^{-\\alpha_t} (1 - \\epsilon_t) + e^{\\alpha_t} \\epsilon_t$$'}
          </div>
          <p className="text-neutral-300">
            Differentiating with respect to {'\\(\\alpha_t\\)'} and setting the gradient to zero:
          </p>
          <div className="p-2.5 rounded-lg bg-black/40 font-mono text-center text-cream my-2">
            {
              '$$\\frac{\\partial L}{\\partial \\alpha_t} = -e^{-\\alpha_t}(1 - \\epsilon_t) + e^{\\alpha_t}\\epsilon_t = 0 \\implies e^{2\\alpha_t} = \\frac{1 - \\epsilon_t}{\\epsilon_t} \\implies \\alpha_t = \\frac{1}{2}\\ln\\left(\\frac{1-\\epsilon_t}{\\epsilon_t}\\right)$$'
            }
          </div>
          <p className="text-neutral-400">
            This proves that the heuristic voting weight in AdaBoost is the exact global minimum of
            exponential loss.
          </p>
        </div>
      </section>

      {/* 6. Algorithm Pseudocode */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground font-manrope">
          5. Algorithm pseudocode: AdaBoost.M1
        </h2>
        <Card className="p-5 border-orange-50/15 bg-black/30 font-mono text-xs leading-relaxed overflow-x-auto text-neutral-300">
          <pre>{`ALGORITHM AdaBoost_M1(Dataset D = {(x_1, y_1), ..., (x_n, y_n)}, Rounds T):
  1. Initialize weights: w_i^(1) = 1 / n for all i = 1, ..., n
  
  2. For round t = 1 to T:
       a. Train weak classifier h_t: X -> {-1, +1} using weights w^(t)
       
       b. Compute weighted error:
            eps_t = SUM_{i=1}^n w_i^(t) * I(y_i != h_t(x_i))
            
       c. If eps_t >= 0.5:
            Stop or invert predictions (h_t := -h_t)
            
       d. Compute voting weight:
            alpha_t = 0.5 * ln((1 - eps_t) / eps_t)
            
       e. Update sample weights:
            w_i^(t+1) = w_i^(t) * exp(-alpha_t * y_i * h_t(x_i))
            
       f. Normalize weights:
            Z_t = SUM_{i=1}^n w_i^(t+1)
            w_i^(t+1) = w_i^(t+1) / Z_t
            
  3. Final Strong Classifier:
       H(x) = sign( SUM_{t=1}^T alpha_t * h_t(x) )`}</pre>
        </Card>
      </section>

      {/* 7. Code It in Python */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground font-manrope">
            6. Code it in Python: Pure NumPy implementation
          </h2>
          <Button
            size="sm"
            variant="outline"
            onClick={copyCode}
            className="flex items-center gap-1.5 text-xs"
          >
            {copiedPython ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Code
              </>
            )}
          </Button>
        </div>
        <Card className="p-5 border-orange-50/15 bg-black/40 font-mono text-xs leading-relaxed overflow-x-auto text-neutral-300">
          <pre>{pythonSnippet}</pre>
        </Card>
      </section>

      {/* 8. Make It Fail */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground font-manrope flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
          7. Make it fail: Exponential outlier trap
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-montserrat">
          <Card className="p-4 border-yellow-500/20 bg-yellow-950/10 space-y-2">
            <h4 className="font-bold text-yellow-400 font-manrope text-sm">
              Pathology: Outlier Weight Explosions
            </h4>
            <p className="text-neutral-300 leading-relaxed">
              Because AdaBoost updates weights via {'\\(e^{\\alpha_t}\\)'}, an uncorrectable noisy
              label or outlier has its weight multiplied exponentially on every successive round.
              Within 5 rounds, 2 outliers can command 80% of the entire sample weight, forcing
              subsequent stumps to fit nonsense boundaries.
            </p>
          </Card>

          <Card className="p-4 border-yellow-500/20 bg-yellow-950/10 space-y-2">
            <h4 className="font-bold text-yellow-400 font-manrope text-sm">
              Mitigation: Gradient Boosting & Huber Loss
            </h4>
            <p className="text-neutral-300 leading-relaxed">
              Modern gradient boosting frameworks (XGBoost, LightGBM) replace the brittle
              exponential loss with robust Huber loss or logistic deviance, preventing extreme
              outliers from exerting unbounded influence on tree splits.
            </p>
          </Card>
        </div>
      </section>

      {/* 9. Strengths, Limitations & When NOT to Use */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground font-manrope">
          8. Strengths, limitations & when NOT to use
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-montserrat">
          <Card className="p-4 border-emerald-500/20 bg-emerald-950/10 space-y-2">
            <h4 className="font-bold text-emerald-400 font-manrope text-sm">
              Strengths of AdaBoost
            </h4>
            <ul className="list-disc list-inside space-y-1 text-neutral-300">
              <li>
                Converts extremely simple weak learners (1-split stumps) into non-linear boundaries.
              </li>
              <li>
                Minimal hyperparameter tuning (primarily rounds {'\\(T\\)'} and learning rate).
              </li>
              <li>Empirically resistant to overfitting when clean margin conditions hold.</li>
              <li>Provides natural feature importance rankings from cumulative stump weights.</li>
            </ul>
          </Card>

          <Card className="p-4 border-red-500/20 bg-red-950/10 space-y-2">
            <h4 className="font-bold text-red-400 font-manrope text-sm">
              When NOT to Use AdaBoost
            </h4>
            <ul className="list-disc list-inside space-y-1 text-neutral-300">
              <li>
                Do NOT use on datasets with significant label corruption or heavy sensor noise.
              </li>
              <li>
                Sequential training cannot be easily parallelized across CPU cores like Random
                Forests.
              </li>
              <li>
                Sub-optimal for regression tasks compared to gradient boosted regression trees.
              </li>
              <li>Slow inference if thousands of weak estimators are accumulated.</li>
            </ul>
          </Card>
        </div>
      </section>

      {/* 10. Common Misconceptions */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground font-manrope">
          9. Common misconceptions
        </h2>
        <div className="space-y-3 text-xs font-montserrat">
          {[
            {
              myth: 'AdaBoost always overfits when T is very large (e.g. T = 1,000).',
              fact: 'Schapire et al. (1998) demonstrated that AdaBoost often continues to lower generalization test error even after training error hits 0%, because additional rounds maximize the margin distribution of data points.',
            },
            {
              myth: 'AdaBoost resamples the data like Bagging does.',
              fact: 'Standard AdaBoost maintains the exact same dataset across all rounds, altering only the numerical probability distribution w_i over the fixed points.',
            },
            {
              myth: 'A weak learner must achieve at least 80% accuracy to be useful.',
              fact: 'A weak learner only needs to be slightly better than random guessing (error < 50%). Even a 51% accurate stump contributes positive boosting signal.',
            },
          ].map((item, idx) => (
            <Card key={idx} className="p-4 border-orange-50/10 bg-neutral-900/40 space-y-1">
              <div className="font-bold text-red-400 font-manrope text-sm">Myth: "{item.myth}"</div>
              <div className="text-neutral-300 leading-relaxed">
                <span className="text-emerald-400 font-semibold">Reality:</span> {item.fact}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 11. Check Yourself (Micro-Quiz) */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground font-manrope flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-brand" />
          10. Check yourself: AdaBoost mechanics micro-quiz
        </h2>
        <Quiz items={quizItems} conceptId="u5-self-adaboost" />
      </section>

      {/* 12. Exam & Viva Corner */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground font-manrope flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-500" />
          11. Exam & viva corner
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-montserrat">
          <Card className="p-4 border-orange-50/15 bg-neutral-900/40 space-y-2">
            <h4 className="font-bold text-foreground font-manrope text-sm">
              Viva Question 1: What happens if error ε_t &gt; 0.5?
            </h4>
            <p className="text-neutral-400 leading-relaxed">
              "If epsilon exceeds 0.5, the classifier is worse than random guessing. AdaBoost
              handles this by either terminating the loop early or simply negating the weak
              learner's predictions: an 80% error rate becomes a 20% error rate under flipped
              polarity, yielding alpha = 0.5 * ln(0.8/0.2) = 0.693."
            </p>
          </Card>

          <Card className="p-4 border-orange-50/15 bg-neutral-900/40 space-y-2">
            <h4 className="font-bold text-foreground font-manrope text-sm">
              Viva Question 2: How does AdaBoost differ fundamentally from Random Forests?
            </h4>
            <p className="text-neutral-400 leading-relaxed">
              "Random Forests train independent deep trees in parallel on bootstrap samples to
              reduce variance. AdaBoost trains weak shallow stumps sequentially on reweighted data
              to systematically reduce bias."
            </p>
          </Card>
        </div>
      </section>

      {/* 13. Summary & Key Takeaways */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground font-manrope">
          12. Summary & key takeaways
        </h2>
        <Card className="p-5 border-orange-50/15 bg-black/20 space-y-2 text-xs font-montserrat text-neutral-300 leading-relaxed">
          <p>
            1. <strong className="text-foreground">Sequential Adaptive Weighting:</strong> Points
            misclassified in round {'\\(t\\)'} have their weights scaled up by{' '}
            {'\\(e^{\\alpha_t}\\)'}, forcing round {'\\(t+1\\)'} to focus on edge-boundary
            ambiguities.
          </p>
          <p>
            2. <strong className="text-foreground">Optimal Voting Weight:</strong> Classifier voting
            weight
            {'\\(\\alpha_t = \\frac{1}{2}\\ln\\frac{1-\\epsilon_t}{\\epsilon_t}\\)'} strictly
            minimizes exponential loss; near-perfect learners receive dominant votes while
            coin-flips receive zero vote.
          </p>
          <p>
            3. <strong className="text-foreground">Outlier Vulnerability:</strong> Because
            exponential loss grows explosively on unclassifiable outliers, AdaBoost requires clean
            datasets or modern gradient boosting Huber formulations.
          </p>
        </Card>
      </section>

      {/* 14. What's Next */}
      <section className="border-t border-orange-50/15 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-xs text-neutral-400 font-mono">Next Further Reading</div>
          <div className="text-base font-semibold text-foreground font-manrope">
            Further Reading: Decision Tree for Regression
          </div>
        </div>
        <Link to="/learn/unit-5/decision-tree-regression">
          <Button variant="primary" className="flex items-center gap-2 text-xs">
            Continue to Decision Tree Regression
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </section>
    </div>
  );
};
