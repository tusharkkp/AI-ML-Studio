import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Quiz, type QuizItem } from '@/features/quiz/Quiz';
import { ModelEvaluationLab } from '@/labs/model-evaluation/ModelEvaluationLab';
import { useProgressStore } from '@/features/progress/useProgressStore';
import {
  BarChart2,
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
    id: 'u5-eval-q1',
    question:
      'In a medical screening task where only 1% of patients have a rare condition, a naive classifier that predicts negative for 100% of patients achieves 99% accuracy. Why is the Precision-Recall (PR) curve preferred over the ROC curve for this problem?',
    options: [
      {
        id: 'opt-a',
        text: 'Because ROC curves can only be drawn for neural networks.',
        isCorrect: false,
        explanation:
          'ROC curves apply to any probabilistic or continuous score classifier regardless of architecture.',
      },
      {
        id: 'opt-b',
        text: 'Because ROC False Positive Rate (FP / N) uses the enormous negative pool in the denominator, masking high false-alarm counts, whereas Precision (TP / (TP + FP)) directly penalizes false alarms.',
        isCorrect: true,
        explanation:
          'When negative instances vastly outnumber positives, a large absolute number of false positives produces a misleadingly tiny FPR. Precision directly exposes the fact that the majority of positive alerts are false alarms.',
      },
      {
        id: 'opt-c',
        text: 'Because Precision and Recall are unaffected by decision thresholds.',
        isCorrect: false,
        explanation: 'Both Precision and Recall sweep through all threshold cutoffs from 1 to 0.',
      },
      {
        id: 'opt-d',
        text: 'Because the PR curve is always symmetrical around the 45-degree diagonal.',
        isCorrect: false,
        explanation:
          'PR curves are non-symmetric, starting at high precision and dropping toward the positive class prevalence.',
      },
    ],
  },
  {
    id: 'u5-eval-q2',
    question: 'What does the Brier Score evaluate in probabilistic classification models?',
    options: [
      {
        id: 'opt-a',
        text: 'The mean squared difference between predicted probabilities and actual binary class outcomes (calibration quality).',
        isCorrect: true,
        explanation:
          'Brier Score = (1/N) * sum((p_i - y_i)^2). It measures probability calibration and accuracy simultaneously: 0 indicates perfect certainty and correctness.',
      },
      {
        id: 'opt-b',
        text: 'The number of features chosen in random forest splits.',
        isCorrect: false,
        explanation: 'Feature count is a hyperparameter (m), not an evaluation metric.',
      },
      {
        id: 'opt-c',
        text: 'The execution latency of model inference on edge devices.',
        isCorrect: false,
        explanation: 'Latency is measured in milliseconds, not by the Brier score.',
      },
      {
        id: 'opt-d',
        text: 'The training speedup achieved by GPU parallelization.',
        isCorrect: false,
        explanation: 'Brier score is purely a mathematical probability scoring rule.',
      },
    ],
  },
  {
    id: 'u5-eval-q3',
    question:
      'Why is McNemar test or Dietterich 5x2cv paired t-test recommended over a standard 10-fold cross-validation paired t-test when comparing two learning algorithms?',
    options: [
      {
        id: 'opt-a',
        text: 'Because standard 10-fold cross-validation test sets overlap across folds during training, violating the independence assumption of Student t-test and causing high Type I error.',
        isCorrect: true,
        explanation:
          'In standard K-fold CV, the training sets across any two folds overlap by (K-2)/(K-1) = 80%, producing highly correlated test differences. Dietterich 5x2cv and McNemar test control for this correlation.',
      },
      {
        id: 'opt-b',
        text: 'Because 10-fold cross-validation is only permitted for linear regression.',
        isCorrect: false,
        explanation: 'K-fold CV applies to any supervised learning algorithm.',
      },
      {
        id: 'opt-c',
        text: 'Because McNemar test only requires a single data point.',
        isCorrect: false,
        explanation:
          'McNemar test evaluates the 2x2 contingency table of discordant errors across the full test set.',
      },
      {
        id: 'opt-d',
        text: 'Because paired t-tests can never be applied to machine learning.',
        isCorrect: false,
        explanation:
          'Paired statistical testing is valid when calibrated specifically for fold correlation.',
      },
    ],
  },
];

export function PerformanceEvaluationPage() {
  const [copiedPython, setCopiedPython] = useState(false);
  const getConceptProgress = useProgressStore((state) => state.getConceptProgress);
  const progress = getConceptProgress('u5-performance-evaluation');
  const isCompleted = Boolean(progress?.labCompleted || progress?.read);

  const pythonSnippet = `import numpy as np
from sklearn.metrics import (
    classification_report,
    roc_auc_score,
    precision_recall_curve,
    auc,
    brier_score_loss,
    confusion_matrix
)
from sklearn.model_selection import StratifiedKFold
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import make_classification

# 1. Synthesize imbalanced challenge dataset (95% Neg, 5% Pos)
X, y = make_classification(
    n_samples=2000,
    n_features=12,
    weights=[0.95, 0.05],
    flip_y=0.01,
    random_state=42
)

# 2. Stratified 5-Fold Cross-Validation (preserves 95:5 class ratio per fold)
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
fold_aucs = []
fold_pr_aucs = []
fold_brier = []

model = RandomForestClassifier(n_estimators=100, random_state=42)

for fold, (train_idx, val_idx) in enumerate(skf.split(X, y), 1):
    X_train, y_train = X[train_idx], y[train_idx]
    X_val, y_val = X[val_idx], y[val_idx]
    
    model.fit(X_train, y_train)
    probs = model.predict_proba(X_val)[:, 1]
    preds = model.predict(X_val)
    
    # Compute robust metrics
    roc = roc_auc_score(y_val, probs)
    precision, recall, _ = precision_recall_curve(y_val, probs)
    pr_auc = auc(recall, precision)
    brier = brier_score_loss(y_val, probs)
    
    fold_aucs.append(roc)
    fold_pr_aucs.append(pr_auc)
    fold_brier.append(brier)
    print(f"Fold {fold}: ROC-AUC={roc:.3f} | PR-AUC={pr_auc:.3f} | Brier={brier:.3f}")

print("\\n--- Systematic Evaluation Summary ---")
print(f"Mean ROC-AUC:    {np.mean(fold_aucs):.4f} +/- {np.std(fold_aucs):.4f}")
print(f"Mean PR-AUC:     {np.mean(fold_pr_aucs):.4f} +/- {np.std(fold_pr_aucs):.4f}")
print(f"Mean Brier Loss: {np.mean(fold_brier):.4f} +/- {np.std(fold_brier):.4f}")
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
            <span className="text-foreground dark:text-neutral-200">Systematic Evaluation</span>
          </nav>
          {isCompleted && (
            <Badge variant="success" size="sm">
              Completed
            </Badge>
          )}
        </div>

        <h1 className="font-manrope text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Systematic performance evaluation of ML models
        </h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 max-w-3xl font-montserrat leading-relaxed">
          Beyond naive accuracy: how to rigorously assess, calibrate, and statistically compare
          classifiers using confusion matrices, ROC vs PR trade-offs, Brier calibration, and{' '}
          <span className="font-montserrat font-medium text-yellow-800 dark:text-orange-100">
            stratified k-fold hypothesis testing
          </span>
          .
        </p>

        {/* Syllabus Tag Chips */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant="unit" unit={5}>
            Unit 5 Core
          </Badge>
          <Badge variant="outline">0.6 Hours</Badge>
          <Badge variant="outline">Course Outcome: CO4</Badge>
          <Badge variant="outline">Statistical Validation</Badge>
        </div>
      </div>

      {/* 2. Intuition */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="size-5 text-amber-400" />
          <h2 className="font-manrope text-2xl font-semibold tracking-tight text-foreground">
            1. Intuition: why naive accuracy is dangerous in production
          </h2>
        </div>
        <p className="text-sm text-neutral-700 dark:text-neutral-300 font-montserrat leading-relaxed">
          Imagine an engineer designing an airport security scanner for detecting prohibited items.
          Because prohibited items occur in only 1 out of every 10,000 bags (0.01% prevalence), a
          broken scanner that simply beeps green for every single passenger achieves an astounding{' '}
          <strong className="text-foreground dark:text-white">99.99% accuracy</strong>. In reality,
          it has detected zero threats and failed entirely at its mission.
        </p>
        <p className="text-sm text-neutral-700 dark:text-neutral-300 font-montserrat leading-relaxed">
          Machine learning models deployed in healthcare, finance, cyber-security, and autonomous
          driving operate under severe asymmetric costs. A false negative (missing a malignant tumor
          or fraudulent transaction) is orders of magnitude more damaging than a false positive.
          Systematic performance evaluation provides the diagnostic toolkit to audit sensitivity,
          precision, calibration, and statistical significance across all decision thresholds.
        </p>
      </section>

      {/* 3. Interactive Lab */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <BarChart2 className="size-5 text-brand" />
          <h2 className="font-manrope text-2xl font-semibold tracking-tight text-foreground">
            2. Interactive lab: systematic model evaluation & benchmarking studio
          </h2>
        </div>
        <p className="text-sm text-neutral-700 dark:text-neutral-300 font-montserrat">
          Toggle between balanced, imbalanced (95:5), and noisy scenarios. Inspect comprehensive
          metric tables, compare ROC vs PR curves, evaluate probability calibration, and observe
          fold variance.
        </p>
        <ModelEvaluationLab />
      </section>

      {/* 4. Step-by-Step on Paper */}
      <section className="space-y-4">
        <h2 className="font-manrope text-2xl font-semibold tracking-tight text-foreground">
          3. Step-by-step on paper: auditing a 100-patient medical screening
        </h2>
        <p className="text-sm text-neutral-700 dark:text-neutral-300 font-montserrat leading-relaxed">
          Let us trace the confusion matrix arithmetic for a clinical test evaluating 100 patients,
          where 10 have the disease (Actual Positives) and 90 are healthy (Actual Negatives).
        </p>

        <Card className="p-5 border border-orange-50/15 bg-neutral-900/40 space-y-4 font-mono text-xs">
          <div>
            <div className="text-orange-200 font-bold mb-1">
              Step 1: Inspect the Raw 2x2 Contingency Matrix
            </div>
            <div className="grid grid-cols-2 gap-2 text-neutral-300 bg-black/40 p-3 rounded">
              <div>True Positives (TP): 8</div>
              <div>False Positives (FP): 6</div>
              <div>False Negatives (FN): 2</div>
              <div>True Negatives (TN): 84</div>
            </div>
          </div>

          <div className="border-t border-orange-50/10 pt-3">
            <div className="text-orange-200 font-bold mb-1">
              Step 2: Calculate Precision & Recall (Sensitivity)
            </div>
            <div className="space-y-1 text-neutral-300">
              <div>
                {'Recall (TPR) = \\frac{TP}{TP + FN} = \\frac{8}{8 + 2} = \\frac{8}{10} = 80.0\\%'}
              </div>
              <div>
                {
                  'Precision (PPV) = \\frac{TP}{TP + FP} = \\frac{8}{8 + 6} = \\frac{8}{14} \\approx 57.14\\%'
                }
              </div>
              <div className="text-neutral-400 font-montserrat mt-1">
                Notice: When the test alerts positive, there is only a 57.1% chance the patient
                actually has the disease. 42.9% of positive alarms are false!
              </div>
            </div>
          </div>

          <div className="border-t border-orange-50/10 pt-3">
            <div className="text-orange-200 font-bold mb-1">
              Step 3: Calculate Specificity & Harmonic F1-Score
            </div>
            <div className="space-y-1 text-neutral-300">
              <div>
                {
                  'Specificity (TNR) = \\frac{TN}{TN + FP} = \\frac{84}{84 + 6} = \\frac{84}{90} \\approx 93.33\\%'
                }
              </div>
              <div className="text-emerald-400 font-bold">
                {
                  'F_1 = 2 \\times \\frac{\\text{Precision} \\times \\text{Recall}}{\\text{Precision} + \\text{Recall}} = 2 \\times \\frac{0.5714 \\times 0.80}{0.5714 + 0.80} = \\frac{0.9142}{1.3714} \\approx 0.6667 (66.7\\%)'
                }
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* 5. Formal Mathematical Foundations */}
      <section className="space-y-4">
        <h2 className="font-manrope text-2xl font-semibold tracking-tight text-foreground">
          4. Formal mathematical foundations: calibration & hypothesis testing
        </h2>
        <Card className="p-6 border border-orange-50/15 bg-neutral-900/40 space-y-4 text-xs font-montserrat">
          <div>
            <h3 className="font-manrope text-sm font-semibold text-orange-200">
              Brier Calibration Score (Strictly Proper Scoring Rule)
            </h3>
            <p className="text-neutral-300 mt-1">
              For $N$ instances with binary labels $y_i \in [0, 1]$ and predicted probabilities $p_i
              \in [0, 1]$:
            </p>
            <div className="my-2 p-3 bg-black/50 border border-orange-50/10 rounded font-mono text-neutral-200 text-center">
              {'$$ \\text{BS} = \\frac{1}{N} \\sum_{i=1}^N (p_i - y_i)^2 $$'}
            </div>
            <p className="text-neutral-400">
              The Brier score decomposes into{' '}
              <strong className="text-white">Reliability - Resolution + Uncertainty</strong>. A
              lower Brier score indicates both superior confidence calibration and discriminative
              sharpness.
            </p>
          </div>

          <div className="border-t border-orange-50/10 pt-4">
            <h3 className="font-manrope text-sm font-semibold text-orange-200">
              Statistical Significance: McNemar Chi-Square Test
            </h3>
            <p className="text-neutral-300 mt-1">
              To test whether Algorithm A and Algorithm B perform significantly differently without
              cross-validation fold contamination, build a $2 \times 2$ contingency table of
              discordant errors on the holdout test set:
            </p>
            <div className="my-2 p-3 bg-black/50 border border-orange-50/10 rounded font-mono text-neutral-200 text-center">
              {'$$ \\chi^2 = \\frac{(|b - c| - 1)^2}{b + c} \\sim \\chi^2_1 $$'}
            </div>
            <p className="text-neutral-400">
              Where $b$ is the number of samples model A got correct but model B got wrong, and $c$
              is the reverse. If $\chi^2 &gt; 3.84$ ($p &lt; 0.05$), we reject the null hypothesis
              of equal performance.
            </p>
          </div>
        </Card>
      </section>

      {/* 6. Algorithm Pseudocode */}
      <section className="space-y-4">
        <h2 className="font-manrope text-2xl font-semibold tracking-tight text-foreground">
          5. Algorithm pseudocode: Stratified K-Fold Cross-Validation
        </h2>
        <Card className="p-4 border border-orange-50/15 bg-neutral-900/40 font-mono text-xs text-neutral-300 space-y-1">
          <div className="text-neutral-500">{'// Algorithm: Stratified K-Fold Validation'}</div>
          <div>
            <strong className="text-orange-200">Input:</strong> Dataset D = {'{(x_i, y_i)}'}, Number
            of folds K, Algorithm A
          </div>
          <div>
            <strong className="text-orange-200">Output:</strong> Vector of holdout metric scores
            across K folds
          </div>
          <div className="pt-2 text-neutral-500">
            {'// Partition maintaining exact class ratio in each fold'}
          </div>
          <div>Separate D into class subsets D_pos and D_neg</div>
          <div>Randomly partition D_pos into K equal subsets pos_1, ..., pos_K</div>
          <div>Randomly partition D_neg into K equal subsets neg_1, ..., neg_K</div>
          <div>Form fold partitions: Fold_k = pos_k UNION neg_k for k = 1 ... K</div>
          <div className="pt-2 text-neutral-500">{'// Evaluation loop'}</div>
          <div>
            <strong>for</strong> k = 1 <strong>to</strong> K <strong>do</strong>:
          </div>
          <div className="pl-4">D_train = D \ Fold_k</div>
          <div className="pl-4">D_val = Fold_k</div>
          <div className="pl-4">model_k = A.fit(D_train)</div>
          <div className="pl-4">score_k = Evaluate(model_k, D_val)</div>
          <div>
            <strong>end for</strong>
          </div>
          <div>
            <strong>return</strong> mean(scores), std(scores)
          </div>
        </Card>
      </section>

      {/* 7. Code It in Python */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="size-5 text-brand" />
            <h2 className="font-manrope text-2xl font-semibold tracking-tight text-foreground">
              6. Code it in Python: Scikit-Learn Stratified CV & PR-AUC
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
            7. Make it fail: standard cross-validation leakage traps
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-5 border border-rose-500/20 bg-rose-950/10 space-y-2">
            <h4 className="font-manrope text-sm font-semibold text-rose-300">
              Trap 1: Preprocessing Before the Cross-Validation Split
            </h4>
            <p className="text-xs text-neutral-300 font-montserrat leading-relaxed">
              Applying `StandardScaler.fit_transform()` or target-encoding on the entire dataset
              prior to running `kfold.split()` leaks mean and variance statistics from the
              validation fold into the training folds. The reported test error will be artificially
              optimistic, leading to unexpected performance degradation upon live deployment.
            </p>
          </Card>

          <Card className="p-5 border border-amber-500/20 bg-amber-950/10 space-y-2">
            <h4 className="font-manrope text-sm font-semibold text-amber-300">
              Trap 2: Grouped Patient Leakage in Medical Imaging
            </h4>
            <p className="text-xs text-neutral-300 font-montserrat leading-relaxed">
              If a patient has 10 chest X-rays in a dataset and you perform standard random K-fold
              splits, 8 images of that patient enter training while 2 enter validation. A
              high-capacity model simply memorizes the patient anatomical bone structure rather than
              pathology. Always use `GroupKFold(groups=patient_id)`.
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
              Best Practices for Model Selection
            </h3>
            <ul className="space-y-2 text-neutral-300 list-disc pl-4">
              <li>
                <strong>Always Stratify:</strong> Enforce stratified splits whenever classification
                target labels have unequal frequencies.
              </li>
              <li>
                <strong>Match Metric to Business Loss:</strong> In fraud detection, optimize Recall
                at fixed 95% Precision. In spam filtering, optimize Precision at 99% Specificity.
              </li>
              <li>
                <strong>Report Confidence Intervals:</strong> Never report a single bare mean
                accuracy; always provide standard deviation across folds ($\mu \pm \sigma$).
              </li>
            </ul>
          </Card>

          <Card className="p-5 border border-orange-50/15 bg-neutral-900/30 space-y-3">
            <h3 className="font-manrope text-sm font-semibold text-rose-400">
              When Naive CV Fails
            </h3>
            <ul className="space-y-2 text-neutral-300 list-disc pl-4">
              <li>
                <strong>Temporal Time-Series Data:</strong> Random K-fold trains on the future to
                predict the past. Use forward-chaining `TimeSeriesSplit`.
              </li>
              <li>
                <strong>Massive Datasets:</strong> 10-fold CV on 100M rows is computationally
                prohibitive; use a single large, pristine holdout test partition instead.
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
              Myth: &quot;A model with ROC-AUC of 0.95 is guaranteed to be ready for deployment in
              extreme fraud detection.&quot;
            </div>
            <p className="text-neutral-300 mt-1">
              <strong>Reality:</strong> On a dataset with 0.01% fraud prevalence, an ROC-AUC of 0.95
              might correspond to a False Positive Rate of 5%. That 5% false alarm rate on millions
              of transactions means 50,000 legitimate customers will be wrongfully blocked every
              day, destroying customer trust.
            </p>
          </Card>

          <Card className="p-4 border border-orange-50/15 bg-neutral-900/30">
            <div className="font-semibold text-orange-200">
              Myth: &quot;Cross-validation produces a single final model that you deploy to
              production.&quot;
            </div>
            <p className="text-neutral-300 mt-1">
              <strong>Reality:</strong> K-fold cross-validation trains K distinct models purely to
              evaluate generalization performance. Once the pipeline architecture and
              hyperparameters are finalized, you train one final model on 100% of the training
              dataset.
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
        <Quiz conceptId="u5-performance-evaluation" items={QUIZ_ITEMS} />
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
              Q1: Define Balanced Accuracy and write its formula.
            </div>
            <p className="text-neutral-300 leading-relaxed">
              <strong>Answer:</strong> Balanced Accuracy is the arithmetic mean of sensitivity (true
              positive rate) and specificity (true negative rate): Balanced Accuracy = 0.5 * (TPR +
              TNR). For completely imbalanced dummy models that guess the majority class, balanced
              accuracy drops to 50%, accurately reflecting zero discriminative power.
            </p>
          </Card>

          <Card className="p-4 border border-orange-50/15 bg-neutral-900/30 space-y-2">
            <div className="font-semibold text-foreground dark:text-white">
              Q2: Explain why probability calibration is crucial when deploying classification
              models into decision-support systems.
            </div>
            <p className="text-neutral-300 leading-relaxed">
              <strong>Answer:</strong> Classifiers frequently produce uncalibrated probabilities
              (e.g. SVMs or Naive Bayes tend to output extreme probabilities near 0 and 1 due to
              independence assumptions). If a model predicts an 80% risk of heart failure, doctors
              need that prediction to correspond to an empirical 80% incidence rate to make
              cost-effective triage decisions.
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
              <strong>Metric Alignment:</strong> Accuracy is deceptive under class imbalance. Always
              prioritize Precision-Recall AUC, Balanced Accuracy, or cost-weighted F-beta metrics.
            </li>
            <li>
              <strong>Probability Calibration:</strong> Use reliability diagrams and Brier scoring
              to ensure continuous model scores reflect true empirical likelihoods.
            </li>
            <li>
              <strong>Leak-Free Validation:</strong> Package feature transformations inside
              pipelines to prevent information leakage across cross-validation splits.
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
            Case Study: Pima Indians Diabetes Prediction Pipeline
          </h3>
          <p className="text-xs text-neutral-400 font-montserrat">
            Put Unit 5 models to the test on a classic clinical benchmark: feature scaling, outlier
            imputation, and comparing Trees, SVMs, and Ensembles.
          </p>
        </div>
        <Link to="/learn/unit-5">
          <Button
            size="sm"
            variant="primary"
            className="flex items-center gap-1.5 text-xs whitespace-nowrap"
          >
            <span>Return to Unit 5 Overview</span>
            <ArrowRight className="size-3.5" />
          </Button>
        </Link>
      </section>
    </div>
  );
}
