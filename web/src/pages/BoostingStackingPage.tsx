import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Quiz, type QuizItem } from '@/features/quiz/Quiz';
import { BoostingStackingLab } from '@/labs/boosting-stacking/BoostingStackingLab';
import { useProgressStore } from '@/features/progress/useProgressStore';
import {
  Zap,
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
    id: 'u5-boost-q1',
    question:
      'In the AdaBoost algorithm, what happens to the weight w_i of a training instance x_i that was correctly classified by weak learner h_t with weight alpha_t > 0?',
    options: [
      {
        id: 'opt-a',
        text: 'Its weight increases by a factor of exp(alpha_t).',
        isCorrect: false,
        explanation:
          'Weights of correctly classified samples decrease, while misclassified samples increase.',
      },
      {
        id: 'opt-b',
        text: 'Its weight is multiplied by exp(-alpha_t), decreasing its relative importance in subsequent rounds.',
        isCorrect: true,
        explanation:
          'Because y_i * h_t(x_i) = +1, the update rule multiplies the weight by exp(-alpha_t). Since alpha_t > 0, exp(-alpha_t) < 1, shrinking the sample weight.',
      },
      {
        id: 'opt-c',
        text: 'Its weight is set immediately to zero and never evaluated again.',
        isCorrect: false,
        explanation:
          'Weights are normalized by Z_t but remain strictly positive across all boosting rounds.',
      },
      {
        id: 'opt-d',
        text: 'Its weight remains completely unchanged.',
        isCorrect: false,
        explanation: 'Every sample weight is updated and normalized in every boosting round.',
      },
    ],
  },
  {
    id: 'u5-boost-q2',
    question:
      'Why is Wolpert Stacking (Stacked Generalization) strictly trained using Out-of-Fold (OOF) cross-validation rather than standard in-sample predictions?',
    options: [
      {
        id: 'opt-a',
        text: 'To prevent the Level-1 meta-model from overfitting to the training memorization and high confidence of overfitted base models.',
        isCorrect: true,
        explanation:
          'If a complex base model (like a 1-NN or deep tree) has 100% training accuracy through memorization, the meta-model would put 100% weight on it. OOF predictions reflect true out-of-sample generalization capacity.',
      },
      {
        id: 'opt-b',
        text: 'Because Scikit-Learn cannot fit models without cross-validation.',
        isCorrect: false,
        explanation:
          'Scikit-Learn supports direct fit methods; OOF is a fundamental mathematical protocol to prevent leakage.',
      },
      {
        id: 'opt-c',
        text: 'To convert non-linear base learners into linear ones.',
        isCorrect: false,
        explanation:
          'Stacking preserves the non-linear representations of heterogeneous base models.',
      },
      {
        id: 'opt-d',
        text: 'To force all base models to use identical decision tree depths.',
        isCorrect: false,
        explanation:
          'Stacking thrives precisely on heterogeneous base models with completely different inductive biases.',
      },
    ],
  },
  {
    id: 'u5-boost-q3',
    question: 'What is the fundamental architectural difference between Bagging and Boosting?',
    options: [
      {
        id: 'opt-a',
        text: 'Bagging trains trees sequentially to minimize bias, whereas Boosting trains trees in parallel to minimize variance.',
        isCorrect: false,
        explanation:
          'This is inverted: Bagging is parallel and minimizes variance; Boosting is sequential and minimizes bias.',
      },
      {
        id: 'opt-b',
        text: 'Bagging builds base learners independently in parallel to reduce variance, whereas Boosting trains weak learners sequentially to iteratively correct residual bias.',
        isCorrect: true,
        explanation:
          'Bagging uses bootstrap averaging in parallel to shrink variance. Boosting uses sequential sample reweighting to focus on hard samples and reduce bias.',
      },
      {
        id: 'opt-c',
        text: 'Bagging can only be used for regression, while Boosting can only be used for classification.',
        isCorrect: false,
        explanation:
          'Both Bagging (Random Forest Regressor) and Boosting (AdaBoost / Gradient Boosting Regressor) apply equally to classification and regression.',
      },
      {
        id: 'opt-d',
        text: 'Boosting requires zero hyperparameter tuning compared to Bagging.',
        isCorrect: false,
        explanation:
          'Boosting is significantly more sensitive to hyperparameters (learning rate, number of estimators, max depth) and prone to overfitting on noise.',
      },
    ],
  },
];

export function BoostingStackingPage() {
  const [copiedPython, setCopiedPython] = useState(false);
  const getConceptProgress = useProgressStore((state) => state.getConceptProgress);
  const progress = getConceptProgress('u5-boosting-stacking');
  const isCompleted = Boolean(progress?.labCompleted || progress?.read);

  const pythonSnippet = `import numpy as np
from sklearn.ensemble import AdaBoostClassifier, StackingClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# 1. Synthesize non-linear tabular dataset
X, y = make_classification(
    n_samples=1200,
    n_features=15,
    n_informative=10,
    n_classes=2,
    random_state=42
)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# 2. AdaBoost with Decision Stumps (max_depth=1)
stump = DecisionTreeClassifier(max_depth=1)
adaboost = AdaBoostClassifier(
    estimator=stump,
    n_estimators=50,
    learning_rate=1.0,
    random_state=42
)
adaboost.fit(X_train, y_train)
ada_acc = accuracy_score(y_test, adaboost.predict(X_test))
print(f"AdaBoost (50 Stumps) Test Accuracy: {ada_acc * 100:.2f}%")

# 3. Wolpert Stacking Classifier with Out-of-Fold (OOF) cross-validation
# Level-0 Heterogeneous Base Learners
base_estimators = [
    ('dt', DecisionTreeClassifier(max_depth=4, random_state=42)),
    ('knn', KNeighborsClassifier(n_neighbors=5)),
    ('svc', SVC(probability=True, kernel='rbf', random_state=42))
]

# Level-1 Meta-Learner (Blender)
meta_learner = LogisticRegression(random_state=42)

stacking = StackingClassifier(
    estimators=base_estimators,
    final_estimator=meta_learner,
    cv=5, # 5-fold out-of-fold cross-validation
    n_jobs=-1
)
stacking.fit(X_train, y_train)
stack_acc = accuracy_score(y_test, stacking.predict(X_test))
print(f"Wolpert Stacking Blender Test Accuracy: {stack_acc * 100:.2f}%")
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
            <span className="text-foreground dark:text-neutral-200">Boosting & Stacking</span>
          </nav>
          {isCompleted && (
            <Badge variant="success" size="sm">
              Completed
            </Badge>
          )}
        </div>

        <h1 className="font-manrope text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Boosting concepts & stacking (stacked generalization)
        </h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 max-w-3xl font-montserrat leading-relaxed">
          From parallel averaging to sequential error correction: discover how AdaBoost chains
          simple decision stumps into formidable classifiers and how Wolpert Stacking blends
          heterogeneous models with{' '}
          <span className="font-montserrat font-medium text-yellow-800 dark:text-orange-100">
            leak-free out-of-fold meta-features
          </span>
          .
        </p>

        {/* Syllabus Tag Chips */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant="unit" unit={5}>
            Unit 5 Core
          </Badge>
          <Badge variant="outline">0.8 Hours</Badge>
          <Badge variant="outline">Course Outcome: CO3, CO4</Badge>
          <Badge variant="outline">Freund & Schapire / Wolpert</Badge>
        </div>
      </div>

      {/* 2. Intuition */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="size-5 text-amber-400" />
          <h2 className="font-manrope text-2xl font-semibold tracking-tight text-foreground">
            1. Intuition: sequential tutors and committee chairpersons
          </h2>
        </div>
        <p className="text-sm text-neutral-700 dark:text-neutral-300 font-montserrat leading-relaxed">
          Suppose a student is preparing for an engineering licensing exam. Rather than hiring ten
          tutors who all teach the exact same syllabus simultaneously (Bagging), the student hires
          tutors sequentially. The first tutor covers all topics and tests the student. The second
          tutor ignores the questions the student answered easily, focusing strictly on the topics
          the student failed. The third tutor focuses on the remaining tricky questions that both
          earlier tutors missed. This sequential focus on hard samples is the essence of{' '}
          <strong className="text-foreground dark:text-white">Boosting</strong>.
        </p>
        <p className="text-sm text-neutral-700 dark:text-neutral-300 font-montserrat leading-relaxed">
          <strong className="text-foreground dark:text-white">Stacking</strong>, introduced by David
          Wolpert in 1992, takes a different philosophical path. Instead of training multiple
          variations of the same model, Stacking invites completely different thinkers to the table:
          an SVM (geometric margin), a decision tree (orthogonal partitions), and a k-NN (local
          neighborhood). A Level-1 meta-model acts as the committee chairperson, learning through
          experience which specialist to trust under specific input conditions.
        </p>
      </section>

      {/* 3. Interactive Lab */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="size-5 text-brand" />
          <h2 className="font-manrope text-2xl font-semibold tracking-tight text-foreground">
            2. Interactive lab: AdaBoost reweighting & stacking blender studio
          </h2>
        </div>
        <p className="text-sm text-neutral-700 dark:text-neutral-300 font-montserrat">
          Step through sequential boosting rounds to watch sample weights swell dynamically on
          misclassified points, or switch tabs to configure a three-model Stacking meta-learner
          pipeline.
        </p>
        <BoostingStackingLab />
      </section>

      {/* 4. Step-by-Step on Paper */}
      <section className="space-y-4">
        <h2 className="font-manrope text-2xl font-semibold tracking-tight text-foreground">
          3. Step-by-step on paper: hand-calculating AdaBoost round 1
        </h2>
        <p className="text-sm text-neutral-700 dark:text-neutral-300 font-montserrat leading-relaxed">
          Let us trace the exact arithmetic of AdaBoost on a toy dataset of $N = 4$ samples with
          initial uniform weights $w_i^{1} = \frac{1}
          {4} = 0.25$.
        </p>

        <Card className="p-5 border border-orange-50/15 bg-neutral-900/40 space-y-4 font-mono text-xs">
          <div>
            <div className="text-orange-200 font-bold mb-1">
              Step 1: Fit Weak Learner & Calculate Weighted Error ε_1
            </div>
            <p className="text-neutral-300 font-montserrat">
              Suppose candidate stump $h_1(x)$ classifies samples 1, 2, and 3 correctly, but
              misclassifies sample 4.
            </p>
            <div className="text-neutral-200 mt-1">
              {'\\epsilon_1 = \\sum_{i: y_i \\ne h_1(x_i)} w_i^{(1)} = w_4^{(1)} = 0.25'}
            </div>
          </div>

          <div className="border-t border-orange-50/10 pt-3">
            <div className="text-orange-200 font-bold mb-1">
              Step 2: Calculate Stump Voting Weight α_1
            </div>
            <div className="text-neutral-200 mt-1">
              {
                '\\alpha_1 = \\frac{1}{2} \\ln \\left(\\frac{1 - \\epsilon_1}{\\epsilon_1}\\right) = \\frac{1}{2} \\ln \\left(\\frac{0.75}{0.25}\\right) = \\frac{1}{2} \\ln(3) \\approx 0.5493'
              }
            </div>
          </div>

          <div className="border-t border-orange-50/10 pt-3">
            <div className="text-orange-200 font-bold mb-1">
              Step 3: Update Unnormalized Sample Weights
            </div>
            <div className="space-y-1 text-neutral-300">
              <div>
                For correct samples (1, 2, 3):{' '}
                {
                  'w_i \\leftarrow 0.25 \\times e^{-0.5493} = 0.25 \\times \\frac{1}{\\sqrt{3}} \\approx 0.1443'
                }
              </div>
              <div>
                For misclassified sample (4):{' '}
                {
                  'w_4 \\leftarrow 0.25 \\times e^{+0.5493} = 0.25 \\times \\sqrt{3} \\approx 0.4330'
                }
              </div>
            </div>
          </div>

          <div className="border-t border-orange-50/10 pt-3">
            <div className="text-orange-200 font-bold mb-1">
              Step 4: Normalize by Partition Function Z_1
            </div>
            <div className="text-neutral-200">
              {'Z_1 = 3 \\times 0.1443 + 0.4330 = 0.4330 + 0.4330 = 0.8660'}
            </div>
            <div className="text-emerald-400 font-bold mt-1">
              {
                'w_{1,2,3}^{(2)} = \\frac{0.1443}{0.8660} = 0.1667 (16.7\\%) \\quad | \\quad w_4^{(2)} = \\frac{0.4330}{0.8660} = 0.5000 (50.0\\%)'
              }
            </div>
            <p className="text-neutral-400 font-montserrat mt-1">
              In round 2, sample 4 alone commands 50% of the entire sample weight distribution! Any
              new stump that misclassifies sample 4 will immediately incur an unacceptable error
              rate of $\ge 0.50$.
            </p>
          </div>
        </Card>
      </section>

      {/* 5. Formal Mathematical Foundations */}
      <section className="space-y-4">
        <h2 className="font-manrope text-2xl font-semibold tracking-tight text-foreground">
          4. Formal mathematical foundations: exponential loss & meta-learning
        </h2>
        <Card className="p-6 border border-orange-50/15 bg-neutral-900/40 space-y-4 text-xs font-montserrat">
          <div>
            <h3 className="font-manrope text-sm font-semibold text-orange-200">
              AdaBoost as Forward Stagewise Additive Modeling (SAMME)
            </h3>
            <p className="text-neutral-300 mt-1">
              AdaBoost minimizes the convex surrogate{' '}
              <strong className="text-white">Exponential Loss</strong>:
            </p>
            <div className="my-2 p-3 bg-black/50 border border-orange-50/10 rounded font-mono text-neutral-200 text-center">
              {'$$ L_{\\text{exp}}(y, f(x)) = \\sum_{i=1}^N \\exp(-y_i f_m(x_i)) $$'}
            </div>
            <p className="text-neutral-400">
              {
                'Where each stage adds a weighted stump: f_m(x) = f_{m-1}(x) + \\alpha_m h_m(x). Setting the derivative of exponential loss to zero yields the closed-form stump weight \\alpha_m = 0.5 \\ln((1 - \\epsilon_m) / \\epsilon_m).'
              }
            </p>
          </div>

          <div className="border-t border-orange-50/10 pt-4">
            <h3 className="font-manrope text-sm font-semibold text-orange-200">
              Wolpert Stacking (Stacked Generalization, 1992)
            </h3>
            <p className="text-neutral-300 mt-1">
              Given training set D of N sample pairs (x_i, y_i) and K base algorithms A_1, ..., A_K:
            </p>
            <ol className="list-decimal pl-5 space-y-1 text-neutral-400 mt-1">
              <li>Partition D into V cross-validation folds D_1, ..., D_V.</li>
              <li>
                For each fold v, train base learners on out-of-fold data and generate out-of-fold
                predictions for all validation samples.
              </li>
              <li>
                Form Level-1 dataset D_meta = [z_i, y_i] where z_i is the vector of out-of-fold base
                model predictions.
              </li>
              <li>
                Train Level-1 meta-model on D_meta to predict final labels from base predictions.
              </li>
            </ol>
          </div>
        </Card>
      </section>

      {/* 6. Algorithm Pseudocode */}
      <section className="space-y-4">
        <h2 className="font-manrope text-2xl font-semibold tracking-tight text-foreground">
          5. Algorithm pseudocode: AdaBoost.M1
        </h2>
        <Card className="p-4 border border-orange-50/15 bg-neutral-900/40 font-mono text-xs text-neutral-300 space-y-1">
          <div className="text-neutral-500">{'// Algorithm: AdaBoost.M1 (Freund & Schapire)'}</div>
          <div>
            <strong className="text-orange-200">Input:</strong> D = {'{(x_i, y_i)}'}, y_i in{' '}
            {'{-1, +1}'}, Rounds T
          </div>
          <div>Initialize weights w_i^(1) = 1 / N for all i = 1 ... N</div>
          <div>
            <strong>for</strong> t = 1 <strong>to</strong> T <strong>do</strong>:
          </div>
          <div className="pl-4">Fit weak classifier h_t to D using distribution w^(t)</div>
          <div className="pl-4">
            Compute weighted error: eps_t = sum_{'{i: y_i != h_t(x_i)}'} w_i^(t)
          </div>
          <div className="pl-4">
            <strong>if</strong> eps_t &gt;= 0.5 <strong>then</strong> break or invert polarity
          </div>
          <div className="pl-4">
            Compute classifier weight: alpha_t = 0.5 * ln((1 - eps_t) / eps_t)
          </div>
          <div className="pl-4">
            Update sample weights: w_i^(t+1) = w_i^(t) * exp(-alpha_t * y_i * h_t(x_i))
          </div>
          <div className="pl-4">Normalize: Z_t = sum_j w_j^(t+1); w_i^(t+1) = w_i^(t+1) / Z_t</div>
          <div>
            <strong>end for</strong>
          </div>
          <div>
            <strong>return</strong> H(x) = sign( sum_{'{t=1}'}^T alpha_t * h_t(x) )
          </div>
        </Card>
      </section>

      {/* 7. Code It in Python */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="size-5 text-brand" />
            <h2 className="font-manrope text-2xl font-semibold tracking-tight text-foreground">
              6. Code it in Python: AdaBoost & StackingClassifier
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
            7. Make it fail: where Boosting & Stacking collapse
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-5 border border-rose-500/20 bg-rose-950/10 space-y-2">
            <h4 className="font-manrope text-sm font-semibold text-rose-300">
              Failure Mode 1: Noisy Labels & Outlier Obsession
            </h4>
            <p className="text-xs text-neutral-300 font-montserrat leading-relaxed">
              Because the exponential loss function grows exponentially with margin violations
              ($\exp(-y f(x))$), AdaBoost is extremely sensitive to mislabeled data. If 2% of
              samples have corrupted labels, AdaBoost will exponentially inflate their weights round
              after round, eventually forcing the entire ensemble to contort its boundary to
              memorize noise.
            </p>
            <div className="text-[11px] font-mono text-rose-200/80 bg-black/30 p-2 rounded">
              Remedy: Switch to Gradient Boosted Trees (LightGBM / XGBoost) with Huber or Logistic
              loss, which penalize outliers linearly rather than exponentially.
            </div>
          </Card>

          <Card className="p-5 border border-amber-500/20 bg-amber-950/10 space-y-2">
            <h4 className="font-manrope text-sm font-semibold text-amber-300">
              Failure Mode 2: In-Sample Stacking Target Leakage
            </h4>
            <p className="text-xs text-neutral-300 font-montserrat leading-relaxed">
              If an engineer skips K-fold out-of-fold cross-validation and trains the Level-1
              meta-model directly on the in-sample training predictions of base models, catastrophic
              failure occurs. A base 1-Nearest Neighbor classifier with 100% training accuracy will
              trick the meta-learner into assigning 100% weight to it, completely ignoring the other
              models.
            </p>
            <div className="text-[11px] font-mono text-amber-200/80 bg-black/30 p-2 rounded">
              Remedy: Always enforce `cv=5` in Scikit-Learn `StackingClassifier` to generate
              strictly out-of-fold meta-features.
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
              Strengths of Boosting & Stacking
            </h3>
            <ul className="space-y-2 text-neutral-300 list-disc pl-4">
              <li>
                <strong>Bias Reduction:</strong> Converts high-bias, simple weak learners (e.g.
                decision stumps) into arbitrary complex decision surfaces.
              </li>
              <li>
                <strong>Heterogeneous Synergy:</strong> Stacking unites completely different
                inductive biases (linear, tree-based, distance metric) without manual heuristic
                rules.
              </li>
              <li>
                <strong>Benchmark Dominance:</strong> Modern Gradient Boosting (XGBoost, CatBoost,
                LightGBM) remains the undisputed gold standard on structured tabular business
                problems.
              </li>
            </ul>
          </Card>

          <Card className="p-5 border border-orange-50/15 bg-neutral-900/30 space-y-3">
            <h3 className="font-manrope text-sm font-semibold text-rose-400">
              Limitations & When NOT to Use
            </h3>
            <ul className="space-y-2 text-neutral-300 list-disc pl-4">
              <li>
                <strong>Vulnerability to Noise:</strong> Unlike Bagging (which dampens noise through
                averaging), Boosting actively concentrates on noise points.
              </li>
              <li>
                <strong>Non-Parallelizable Training:</strong> Each boosting round strictly depends
                on the weight distribution produced by the preceding round.
              </li>
              <li>
                <strong>Stacking Pipeline Complexity:</strong> Deploying a multi-level stacking
                model into production requires maintaining and monitoring multiple distinct
                inference runtimes.
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
              Myth: &quot;A weak learner in AdaBoost must be at least 70% or 80% accurate to be
              useful.&quot;
            </div>
            <p className="text-neutral-300 mt-1">
              <strong>Reality:</strong> The theoretical definition of a weak learner in PAC-learning
              requires only that its accuracy be strictly greater than 50% (slightly better than a
              random coin toss: error &lt; 0.5 - &gamma; where &gamma; &gt; 0). AdaBoost will
              successfully amplify even 52% accurate decision stumps into a 99% ensemble!
            </p>
          </Card>

          <Card className="p-4 border border-orange-50/15 bg-neutral-900/30">
            <div className="font-semibold text-orange-200">
              Myth: &quot;Stacking is just a weighted average of model predictions.&quot;
            </div>
            <p className="text-neutral-300 mt-1">
              <strong>Reality:</strong> Simple voting/averaging assigns fixed weights across the
              entire feature space. A non-linear Level-1 meta-model (or logistic regression with
              bias) learns which model to trust in specific regions of the input space based on
              feature patterns.
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
        <Quiz conceptId="u5-boosting-stacking" items={QUIZ_ITEMS} />
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
              Q1: Derive the condition under which a base learner is rejected in AdaBoost.
            </div>
            <p className="text-neutral-300 leading-relaxed">
              <strong>Answer:</strong> A base learner is rejected if its weighted error $\epsilon_t
              \ge 0.5$. When $\epsilon_t = 0.5$, $\alpha_t = 0.5 \ln(0.5 / 0.5) = 0$, giving the
              model zero weight. If $\epsilon_t &gt; 0.5$, $\alpha_t &lt; 0$, meaning the classifier
              is worse than random guessing and its predictions would have to be inverted.
            </p>
          </Card>

          <Card className="p-4 border border-orange-50/15 bg-neutral-900/30 space-y-2">
            <div className="font-semibold text-foreground dark:text-white">
              Q2: Explain why Level-1 meta-models in Stacking are typically simple linear or
              logistic models rather than deep neural networks.
            </div>
            <p className="text-neutral-300 leading-relaxed">
              <strong>Answer:</strong> Level-1 meta-models take only $K$ features (where $K$ is the
              number of base estimators, typically 3 to 10). Because the base models have already
              extracted high-level non-linear representations from the original input features, a
              simple linear model (Logistic Regression or Ridge) is sufficient to blend them without
              risking secondary overfitting.
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
              <strong>Sequential Error Correction:</strong> Boosting chains weak, high-bias models
              sequentially, multiplying the weights of misclassified instances by $\exp(\alpha_t)$.
            </li>
            <li>
              <strong>Exponential Loss:</strong> AdaBoost greedily minimizes exponential margin
              loss, yielding the exact closed-form weighting $\alpha_t = 0.5 \ln((1 - \epsilon_t) /
              \epsilon_t)$.
            </li>
            <li>
              <strong>Stacked Generalization:</strong> Stacking blends heterogeneous models via an
              out-of-fold cross-validated meta-feature dataset, completely preventing data leakage.
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
            Systematic Performance Evaluation of ML Models
          </h3>
          <p className="text-xs text-neutral-400 font-montserrat">
            Beyond naive accuracy: how to rigorously evaluate, calibrate, and statistically compare
            classifiers using ROC vs PR curves, Brier scores, and stratified cross-validation.
          </p>
        </div>
        <Link to="/learn/unit-5/performance-evaluation">
          <Button
            size="sm"
            variant="primary"
            className="flex items-center gap-1.5 text-xs whitespace-nowrap"
          >
            <span>Explore Model Evaluation</span>
            <ArrowRight className="size-3.5" />
          </Button>
        </Link>
      </section>
    </div>
  );
}
