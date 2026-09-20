import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Quiz } from '@/features/quiz/Quiz';
import { ConfusionMatrixLab } from '@/labs/confusion-matrix/ConfusionMatrixLab';

export const ClassificationMetricsPage: React.FC = () => {
  const quizItems = [
    {
      id: 'cm-q1',
      question:
        'A disease screening test achieves 99% accuracy on a dataset where only 1% of patients are truly positive. What is the most likely explanation?',
      options: [
        {
          id: 'A',
          text: 'The "accuracy paradox": a naive classifier that always predicts "healthy" also achieves 99% accuracy because the negative class dominates, yet it has 0% recall and is clinically worthless.',
          isCorrect: true,
          explanation:
            'With 1% prevalence, predicting "no disease" for everyone is correct 99% of the time. Accuracy alone is misleading on imbalanced datasets. Use Balanced Accuracy, F1, or MCC instead.',
        },
        {
          id: 'B',
          text: 'The test is excellent because 99% accuracy is near-perfect.',
          isCorrect: false,
          explanation:
            'Not necessarily. On a highly imbalanced dataset, 99% accuracy can be achieved by a trivial constant classifier with no predictive power.',
        },
        {
          id: 'C',
          text: 'The 1% positive samples were all correctly identified, giving perfect sensitivity.',
          isCorrect: false,
          explanation:
            'If the model always predicts negative, it classifies 0 out of all positive cases correctly, achieving 0% sensitivity (recall) despite 99% accuracy.',
        },
      ],
    },
    {
      id: 'cm-q2',
      question:
        'In a fraud detection system, what is the cost of a False Negative, and how should you tune the decision threshold τ?',
      options: [
        {
          id: 'A',
          text: 'A False Negative means a fraudulent transaction is classified as legitimate (missed fraud). To minimise FN, lower τ (increase recall) at the cost of more False Positives (legitimate transactions flagged).',
          isCorrect: true,
          explanation:
            'FN in fraud detection lets real fraud slip through undetected -- potentially catastrophic. Lowering τ makes the model more sensitive, catching more fraud (higher recall) but also flagging more good transactions (lower precision).',
        },
        {
          id: 'B',
          text: 'A False Negative means a legitimate transaction is blocked. Raise τ to allow more transactions through.',
          isCorrect: false,
          explanation:
            'That describes a False Positive (legitimate flagged as fraudulent). A False Negative in fraud detection is an actual fraudulent transaction predicted as legitimate.',
        },
        {
          id: 'C',
          text: 'False Negatives have no cost in fraud detection; only False Positives (customer friction) matter.',
          isCorrect: false,
          explanation:
            'Missed fraud (FN) has direct financial and reputational costs. The optimal threshold balances FN cost against FP customer friction, typically using cost-sensitive threshold selection.',
        },
      ],
    },
    {
      id: 'cm-q3',
      question: 'When is the Matthews Correlation Coefficient (MCC) preferred over F1 score?',
      options: [
        {
          id: 'A',
          text: 'When both positive and negative classes matter and the dataset is severely imbalanced. MCC accounts for all four confusion matrix cells (TP, TN, FP, FN), whereas F1 ignores TN entirely.',
          isCorrect: true,
          explanation:
            'F1 = 2·TP / (2·TP + FP + FN). It completely ignores TN. If you have a large TN count (common in imbalanced problems), F1 does not reflect how well you handle negatives. MCC = (TP·TN - FP·FN) / sqrt(...) incorporates all four cells.',
        },
        {
          id: 'B',
          text: 'When the dataset is perfectly balanced and you need a metric that emphasises precision over recall.',
          isCorrect: false,
          explanation:
            "On balanced datasets F1 and MCC often agree. MCC's advantage specifically shines on imbalanced datasets where TN dominates.",
        },
        {
          id: 'C',
          text: 'MCC is always better than F1; F1 should never be used.',
          isCorrect: false,
          explanation:
            'F1 is a widely accepted, interpretable metric and a perfectly valid choice for many tasks, especially NLP. The choice depends on whether the TN base rate is important to the problem.',
        },
      ],
    },
  ];

  return (
    <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-neutral-500">
        <Link to="/learn/unit-4" className="hover:text-foreground transition-colors">
          Unit 4
        </Link>
        <span>/</span>
        <span className="text-foreground">Classification metrics</span>
      </nav>

      {/* Hero */}
      <header className="mb-10">
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline">Evaluation</Badge>
          <Badge variant="outline">6 Hours</Badge>
        </div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Classification metrics
        </h1>
        <p className="mt-3 text-lg text-neutral-400 leading-relaxed">
          Accuracy is a liar.{' '}
          <span className="text-cream font-medium">
            A 2x2 confusion matrix is the atomic unit of evaluation
          </span>{' '}
          -- from it flows precision, recall, F1, MCC, and the entire vocabulary of model diagnosis.
        </p>
      </header>

      {/* 1. Intuition */}
      <section className="mb-10">
        <h2 className="section-heading">1. Intuition</h2>
        <p className="body-text">
          Imagine a hospital test for a rare disease that affects 1% of the population. A doctor who
          always says "you're healthy" is correct 99% of the time -- but has caught zero actual
          cases. This is the <span className="text-cream font-medium">accuracy paradox</span>: a
          single number cannot capture the asymmetric costs of different types of errors.
        </p>
        <p className="body-text mt-3">
          The confusion matrix fixes this by decomposing predictions into four categories: True
          Positives (correct positive predictions), False Positives (healthy people labelled sick),
          False Negatives (sick people labelled healthy -- often the most dangerous error), and True
          Negatives (correct negative predictions). Every metric is a different weighted view of
          these four cells.
        </p>
      </section>

      {/* 2. Interactive lab */}
      <section className="mb-10">
        <h2 className="section-heading">2. Interactive lab</h2>
        <p className="body-text mb-4">
          Drag the TP, FP, FN, TN sliders and watch all seven metrics update instantly. Switch to
          "Explore accuracy paradox" to see how a 1% prevalence rate breaks accuracy as a metric.
        </p>
        <ConfusionMatrixLab />
      </section>

      {/* 3. Step-by-step on paper */}
      <section className="mb-10">
        <h2 className="section-heading">3. Step-by-step on paper</h2>
        <div className="overflow-x-auto rounded-xl border border-warm-border bg-surface">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-warm-border">
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400">Metric</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400">
                  Formula
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400">
                  When to use
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-border">
              {[
                ['Accuracy', '(TP+TN) / total', 'Balanced classes only'],
                ['Precision (PPV)', 'TP / (TP+FP)', 'Minimise false alarms (spam filter)'],
                [
                  'Recall (Sensitivity)',
                  'TP / (TP+FN)',
                  'Minimise missed positives (cancer screen)',
                ],
                ['Specificity (TNR)', 'TN / (TN+FP)', 'Confirm healthy patients'],
                ['F1 Score', '2PR / (P+R)', 'Imbalanced data, both P and R matter'],
                ['MCC', '(TP·TN-FP·FN)/√…', 'Imbalanced data, TN also matters'],
                ['Balanced Accuracy', '(Recall+Specificity)/2', 'Simple imbalance correction'],
              ].map(([m, f, u]) => (
                <tr key={m as string} className="text-xs">
                  <td className="px-4 py-2.5 font-medium text-foreground">{m}</td>
                  <td className="px-4 py-2.5 font-mono text-neutral-400">{f}</td>
                  <td className="px-4 py-2.5 text-neutral-500">{u}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Formal math */}
      <section className="mb-10">
        <h2 className="section-heading">4. Formal mathematical foundations</h2>
        <div className="rounded-lg border border-warm-border bg-surface p-4 font-mono text-xs leading-loose text-neutral-300">
          <div className="text-neutral-500 mb-1">// Confusion matrix notation</div>
          <div>
            TP = |{'{y=1, ŷ=1}'}| FP = |{'{y=0, ŷ=1}'}|
          </div>
          <div>
            FN = |{'{y=1, ŷ=0}'}| TN = |{'{y=0, ŷ=0}'}|
          </div>
          <div className="mt-2 text-neutral-500">// Metrics</div>
          <div>Accuracy = (TP + TN) / (TP + FP + TN + FN)</div>
          <div>Precision (PPV) = TP / (TP + FP)</div>
          <div>Recall (TPR) = TP / (TP + FN)</div>
          <div>Specificity(TNR) = TN / (TN + FP)</div>
          <div>FPR = FP / (FP + TN) = 1 - TNR</div>
          <div>F1 = 2 * P * R / (P + R)</div>
          <div>MCC = (TP*TN - FP*FN) / sqrt((TP+FP)(TP+FN)(TN+FP)(TN+FN))</div>
          <div>MCC range: [-1, +1] (0 = random, 1 = perfect, -1 = perfectly wrong)</div>
        </div>
      </section>

      {/* 5. Pseudocode */}
      <section className="mb-10">
        <h2 className="section-heading">5. Algorithm pseudocode</h2>
        <pre className="overflow-x-auto rounded-xl border border-warm-border bg-surface p-4 text-xs leading-relaxed text-neutral-300">
          {`function ComputeMetrics(y_true, y_pred):
    TP = FP = TN = FN = 0
    for i in range(len(y_true)):
        if y_true[i] == 1 and y_pred[i] == 1: TP++
        if y_true[i] == 0 and y_pred[i] == 1: FP++
        if y_true[i] == 0 and y_pred[i] == 0: TN++
        if y_true[i] == 1 and y_pred[i] == 0: FN++

    precision = TP / (TP + FP)   // 0/0 → NaN
    recall    = TP / (TP + FN)   // 0/0 → NaN
    f1        = 2*P*R / (P + R)
    mcc       = (TP*TN - FP*FN) / sqrt((TP+FP)(TP+FN)(TN+FP)(TN+FN))
    return {TP, FP, TN, FN, precision, recall, f1, mcc}`}
        </pre>
      </section>

      {/* 6. Python */}
      <section className="mb-10">
        <h2 className="section-heading">6. Code it in Python</h2>
        <pre className="overflow-x-auto rounded-xl border border-warm-border bg-surface p-4 text-xs leading-relaxed text-neutral-300">
          {`from sklearn.metrics import (
    confusion_matrix, classification_report,
    matthews_corrcoef, balanced_accuracy_score, roc_auc_score
)

y_true = [1, 1, 1, 0, 0, 0, 0, 0, 0, 0]  # 30% positive class
y_pred = [1, 1, 0, 0, 0, 0, 0, 0, 1, 0]

cm = confusion_matrix(y_true, y_pred)
print("Confusion matrix:\\n", cm)
print(classification_report(y_true, y_pred))
print(f"MCC:              {matthews_corrcoef(y_true, y_pred):.3f}")
print(f"Balanced accuracy:{balanced_accuracy_score(y_true, y_pred):.3f}")`}
        </pre>
      </section>

      {/* 7. Make it fail */}
      <section className="mb-10">
        <h2 className="section-heading">7. Make it fail</h2>
        <div className="space-y-3 text-sm text-neutral-400">
          <p>
            <span className="font-semibold text-red-400">Accuracy paradox:</span> Set prevalence to
            1% in the lab and observe: accuracy stays near 99% even when Recall = 0 because the
            model always predicts negative.
          </p>
          <p>
            <span className="font-semibold text-red-400">F1 ignores TNs:</span> Set TN = 0 and FP =
            0 while keeping TP and FN non-zero. Precision and Recall are well-defined but TN
            vanishes from F1 entirely. MCC drops accordingly.
          </p>
          <p>
            <span className="font-semibold text-red-400">MCC = 0 for constant predictions:</span>{' '}
            Predict all-positive or all-negative. The denominator of MCC contains a zero factor, so
            MCC = 0, correctly indicating a random-level predictor.
          </p>
        </div>
      </section>

      {/* 8. Strengths & Limitations */}
      <section className="mb-10">
        <h2 className="section-heading">8. Strengths, limitations, and when not to use it</h2>
        <div className="space-y-2 text-sm text-neutral-400">
          <p>
            <span className="font-semibold text-green-300">Strengths:</span> Each metric targets a
            specific error type, enabling domain-guided optimisation (medical: maximise recall;
            spam: maximise precision). MCC is considered one of the most reliable single-number
            classifiers.
          </p>
          <p>
            <span className="font-semibold text-red-300">When not to rely on accuracy alone:</span>{' '}
            Any imbalanced dataset -- medical, fraud, anomaly detection. When positives are rare,
            accuracy is dominated by the easy negative majority.
          </p>
          <p>
            <span className="font-semibold text-yellow-300">Limitations:</span> These metrics depend
            on a fixed decision threshold τ. Threshold-free evaluation (ROC-AUC) is preferable when
            comparing models or when the operating threshold is unknown.
          </p>
        </div>
      </section>

      {/* 9. Misconceptions */}
      <section className="mb-10">
        <h2 className="section-heading">9. Common misconceptions</h2>
        <div className="space-y-4">
          {[
            {
              myth: 'High accuracy always means a good model',
              truth:
                'Accuracy is dominated by the majority class on imbalanced datasets. Always check recall/F1/MCC alongside accuracy.',
            },
            {
              myth: 'Precision and recall can both be maximised simultaneously',
              truth:
                'There is an inherent tradeoff: lowering τ raises recall but drops precision, and vice versa. The F1 score is their harmonic mean, and the PR curve visualises all tradeoffs.',
            },
            {
              myth: 'F1 is always the best metric for imbalanced data',
              truth:
                'F1 ignores TN. If correctly identifying negatives matters (e.g. flagging legitimate transactions as safe), use MCC or balanced accuracy instead.',
            },
          ].map(({ myth, truth }) => (
            <div key={myth} className="rounded-lg border border-warm-border bg-surface p-4">
              <p className="font-semibold text-orange-300 text-sm">Myth: {myth}</p>
              <p className="mt-1 text-sm text-neutral-400">{truth}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 10. Quiz */}
      <section className="mb-10">
        <h2 className="section-heading">10. Check yourself</h2>
        <Quiz conceptId="u4-classification-metrics" items={quizItems} />
      </section>

      {/* 11. Exam corner */}
      <section className="mb-10">
        <h2 className="section-heading">11. Exam and viva corner</h2>
        <div className="space-y-3">
          {[
            [
              'Define Type I and Type II errors in classification.',
              'Type I error = False Positive (FP): predicting positive when actually negative. Type II error = False Negative (FN): predicting negative when actually positive. In hypothesis testing: Type I = rejecting a true null; Type II = failing to reject a false null.',
            ],
            [
              'Why is MCC range [-1, 1] and what does MCC = 0 mean?',
              'MCC = (TP·TN - FP·FN) / sqrt(…). When predictions are random, TP·TN ≈ FP·FN in expectation, yielding MCC ≈ 0. MCC = 1 is perfect. MCC = -1 means perfectly wrong predictions (flip all to get perfect accuracy).',
            ],
            [
              'Explain the precision-recall tradeoff with a concrete example.',
              'A spam filter at τ = 0.9 (very conservative): only flags highly-confident spam -- high precision (rarely flags ham) but low recall (misses ambiguous spam). At τ = 0.3: flags more spam -- high recall but lower precision (more ham flagged). The PR curve traces all operating points.',
            ],
          ].map(([q, a]) => (
            <details key={q as string} className="rounded-lg border border-warm-border bg-surface">
              <summary className="cursor-pointer p-4 text-sm font-medium text-foreground">
                {q}
              </summary>
              <div className="border-t border-warm-border px-4 pb-4 pt-3 text-sm text-neutral-400">
                {a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* 12. Summary */}
      <section className="mb-10">
        <h2 className="section-heading">12. Summary and key takeaways</h2>
        <ul className="space-y-2 text-sm text-neutral-400 list-disc list-inside">
          <li>
            The confusion matrix decomposes predictions into TP, FP, FN, TN -- every metric flows
            from these four cells.
          </li>
          <li>Accuracy is misleading on imbalanced datasets (accuracy paradox).</li>
          <li>
            Precision = fewer false alarms; Recall = fewer missed positives. They trade off against
            each other.
          </li>
          <li>F1 is the harmonic mean of precision and recall, but ignores TN.</li>
          <li>
            MCC accounts for all four cells and is recommended for highly imbalanced problems.
          </li>
          <li>
            Always choose the metric aligned to the domain cost: medical screening prioritises
            recall; spam filters prioritise precision.
          </li>
        </ul>
      </section>

      {/* 13. What's next */}
      <section>
        <h2 className="section-heading">13. What's next</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              to: '/learn/unit-4/roc-auc',
              label: 'ROC curve and AUC',
              desc: 'Threshold-free evaluation of classifiers using the ROC curve.',
            },
            {
              to: '/learn/unit-4/logistic-regression',
              label: 'Logistic regression',
              desc: 'The model behind those probability scores you just evaluated.',
            },
          ].map(({ to, label, desc }) => (
            <Link
              key={to}
              to={to}
              className="group rounded-xl border border-warm-border bg-surface p-4 transition-colors hover:border-brand/50"
            >
              <div className="font-semibold text-foreground group-hover:text-brand transition-colors">
                {label}
              </div>
              <div className="mt-1 text-sm text-neutral-500">{desc}</div>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
};
