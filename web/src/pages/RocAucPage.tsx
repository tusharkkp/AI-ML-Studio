import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Quiz } from '@/features/quiz/Quiz';
import { RocAucLab } from '@/labs/roc-auc/RocAucLab';

export const RocAucPage: React.FC = () => {
  const quizItems = [
    {
      id: 'roc-q1',
      question: 'What does AUC (Area Under the ROC Curve) represent probabilistically?',
      options: [
        {
          id: 'A',
          text: 'The probability that the model assigns a higher score to a randomly chosen positive sample than to a randomly chosen negative sample.',
          isCorrect: true,
          explanation:
            "This is the Wilcoxon-Mann-Whitney statistic interpretation of AUC. AUC = 0.85 means that 85% of all (positive, negative) pairs are correctly ranked by the model's score.",
        },
        {
          id: 'B',
          text: 'The fraction of positive samples the model correctly classifies at a threshold of 0.5.',
          isCorrect: false,
          explanation:
            'That is the recall (sensitivity) at τ = 0.5, a single operating point. AUC integrates over all thresholds.',
        },
        {
          id: 'C',
          text: 'The total accuracy of the model across all possible datasets.',
          isCorrect: false,
          explanation:
            'AUC measures ranking quality on a fixed dataset across all thresholds. It does not aggregate across datasets.',
        },
      ],
    },
    {
      id: 'roc-q2',
      question: 'Why is AUC a better model comparison metric than accuracy on imbalanced datasets?',
      options: [
        {
          id: 'A',
          text: 'AUC is threshold-independent: it measures ranking quality across all operating points, so it is unaffected by class imbalance in the same way accuracy is. A constant "always-negative" classifier has AUC = 0.5 despite high accuracy.',
          isCorrect: true,
          explanation:
            'The ROC curve plots (FPR, TPR) at every possible threshold. A random classifier produces a diagonal line (AUC = 0.5). AUC captures the full tradeoff picture independent of class proportions.',
        },
        {
          id: 'B',
          text: 'AUC is higher than accuracy for all classifiers, making it easier to compare.',
          isCorrect: false,
          explanation:
            'AUC is not numerically higher than accuracy; they are different quantities. A random classifier has AUC = 0.5 regardless of dataset balance.',
        },
        {
          id: 'C',
          text: 'AUC automatically balances precision and recall, replacing the need for F1.',
          isCorrect: false,
          explanation:
            'AUC is based on TPR and FPR (not precision). Precision-Recall AUC (PR-AUC) is a separate metric that is more informative on highly imbalanced datasets.',
        },
      ],
    },
    {
      id: 'roc-q3',
      question:
        'Moving the decision threshold τ from 0.9 to 0.1 on the ROC curve shifts the operating point in which direction?',
      options: [
        {
          id: 'A',
          text: 'From the bottom-left (low TPR, low FPR) toward the top-right (high TPR, high FPR): lowering τ classifies more samples as positive, catching more true positives but also more false positives.',
          isCorrect: true,
          explanation:
            'At τ = 1 (predict all negative): TPR = 0, FPR = 0 -- bottom-left corner. At τ = 0 (predict all positive): TPR = 1, FPR = 1 -- top-right corner. Lowering τ moves along the curve from BL to TR.',
        },
        {
          id: 'B',
          text: 'From top-right toward bottom-left: lowering the threshold makes the model more conservative.',
          isCorrect: false,
          explanation:
            'Lowering the threshold makes the classifier less conservative (more things classified positive). It moves from BL to TR on the ROC curve.',
        },
        {
          id: 'C',
          text: 'The operating point stays fixed; only the AUC changes when τ changes.',
          isCorrect: false,
          explanation:
            'AUC is fixed for a trained model. Changing τ moves the operating point along the fixed ROC curve, changing the (FPR, TPR) pair.',
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
        <span className="text-foreground">ROC curve and AUC</span>
      </nav>

      {/* Hero */}
      <header className="mb-10">
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline">Evaluation</Badge>
          <Badge variant="outline">6 Hours</Badge>
        </div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          ROC curve and AUC
        </h1>
        <p className="mt-3 text-lg text-neutral-400 leading-relaxed">
          Every classifier has a dial you can turn.{' '}
          <span className="text-cream font-medium">The ROC curve traces the full tradeoff</span>{' '}
          between catching true positives and tolerating false alarms across every possible decision
          threshold, and AUC collapses that curve to a single ranking quality score.
        </p>
      </header>

      {/* 1. Intuition */}
      <section className="mb-10">
        <h2 className="section-heading">1. Intuition</h2>
        <p className="body-text">
          A logistic regression outputs a probability score in [0, 1] for every patient. To make a
          binary decision (positive/negative), you pick a threshold τ. High τ = conservative doctor
          who only diagnoses when very confident; low τ = cautious doctor who flags anything
          suspicious.
        </p>
        <p className="body-text mt-3">
          The <span className="text-cream font-medium">ROC curve</span> (Receiver Operating
          Characteristic) sweeps τ from 1 down to 0 and plots each resulting (FPR, TPR) pair. At τ =
          1 you predict nobody positive -- zero FP and zero TP, the bottom-left corner. At τ = 0 you
          predict everyone positive -- all TP captured, but maximum FP, the top-right corner. The
          curve bows toward the top-left; the closer it hugs that corner, the better the model.
        </p>
        <p className="body-text mt-3">
          <strong>AUC</strong> (Area Under the Curve) is the integral of this curve via the
          trapezoidal rule. Probabilistically, AUC equals the probability that the model assigns a
          higher score to a randomly chosen positive than a randomly chosen negative -- pure ranking
          quality, threshold-free.
        </p>
      </section>

      {/* 2. Interactive lab */}
      <section className="mb-10">
        <h2 className="section-heading">2. Interactive lab</h2>
        <p className="body-text mb-4">
          Adjust the class distributions (means and spread) and watch the ROC curve and AUC respond
          live. Drag the threshold slider and observe the orange operating point moving along the
          ROC curve. Set σ to maximum overlap to drive AUC toward 0.5 -- the "make it fail"
          scenario.
        </p>
        <RocAucLab />
      </section>

      {/* 3. Step-by-step on paper */}
      <section className="mb-10">
        <h2 className="section-heading">3. Step-by-step on paper</h2>
        <div className="space-y-3 rounded-xl border border-warm-border bg-surface p-5">
          {[
            [
              'Score the dataset',
              'Run your trained classifier and collect a continuous score (e.g. P(y=1|x)) for every sample.',
            ],
            ['Sort by score descending', 'Order all samples from highest score to lowest.'],
            [
              'Sweep thresholds',
              'For each unique score value, set that as τ. Classify all samples above τ as positive, below as negative.',
            ],
            [
              'Compute (FPR, TPR)',
              'For each τ: TPR = TP / (TP + FN), FPR = FP / (FP + TN). Record the pair.',
            ],
            ['Plot the curve', 'Plot FPR on x-axis, TPR on y-axis. Connect the (FPR, TPR) points.'],
            [
              'Compute AUC',
              'Apply the trapezoidal rule: AUC = Σ (FPR[i+1] - FPR[i]) · (TPR[i] + TPR[i+1]) / 2.',
            ],
          ].map(([step, desc], i) => (
            <div key={i} className="flex gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/20 text-xs font-bold text-brand">
                {i + 1}
              </span>
              <div>
                <span className="font-semibold text-foreground">{step}: </span>
                <span className="text-neutral-400 text-sm">{desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Formal math */}
      <section className="mb-10">
        <h2 className="section-heading">4. Formal mathematical foundations</h2>
        <div className="rounded-lg border border-warm-border bg-surface p-4 font-mono text-xs leading-loose text-neutral-300">
          <div className="text-neutral-500 mb-1">// ROC curve axes</div>
          <div>TPR(τ) = TP(τ) / (TP(τ) + FN(τ)) // Sensitivity / Recall</div>
          <div>FPR(τ) = FP(τ) / (FP(τ) + TN(τ)) // 1 - Specificity</div>
          <div className="mt-2 text-neutral-500">// AUC via trapezoidal rule</div>
          <div>AUC = ∫₀¹ TPR(FPR) dFPR</div>
          <div> ≈ Σᵢ (FPR[i+1] - FPR[i]) · (TPR[i+1] + TPR[i]) / 2</div>
          <div className="mt-2 text-neutral-500">
            // Probabilistic interpretation (Wilcoxon-Mann-Whitney)
          </div>
          <div>AUC = P(score(x⁺) &gt; score(x⁻)) // x⁺ ∈ class 1, x⁻ ∈ class 0</div>
          <div className="mt-2 text-neutral-500">// Benchmarks</div>
          <div>AUC = 0.5 → random classifier (diagonal ROC)</div>
          <div>AUC = 1.0 → perfect ranking (upper-left corner)</div>
        </div>
      </section>

      {/* 5. Pseudocode */}
      <section className="mb-10">
        <h2 className="section-heading">5. Algorithm pseudocode</h2>
        <pre className="overflow-x-auto rounded-xl border border-warm-border bg-surface p-4 text-xs leading-relaxed text-neutral-300">
          {`function ComputeRoc(y_true, scores, steps=100):
    points = []
    for i from steps downto 0:
        τ = i / steps
        preds = [1 if s >= τ else 0 for s in scores]
        TP, FP, TN, FN = confusionMatrix(y_true, preds)
        tpr = TP / (TP + FN) if (TP+FN)>0 else 0
        fpr = FP / (FP + TN) if (FP+TN)>0 else 0
        points.append((fpr, tpr, τ))
    return sorted(points, key=fpr)

function ComputeAUC(roc_points):
    auc = 0
    for i in range(1, len(roc_points)):
        dFpr = roc_points[i].fpr - roc_points[i-1].fpr
        avgTpr = (roc_points[i].tpr + roc_points[i-1].tpr) / 2
        auc += dFpr * avgTpr       // trapezoidal
    return clamp(auc, 0, 1)`}
        </pre>
      </section>

      {/* 6. Python */}
      <section className="mb-10">
        <h2 className="section-heading">6. Code it in Python</h2>
        <pre className="overflow-x-auto rounded-xl border border-warm-border bg-surface p-4 text-xs leading-relaxed text-neutral-300">
          {`from sklearn.metrics import roc_curve, auc, roc_auc_score
from sklearn.linear_model import LogisticRegression
import matplotlib.pyplot as plt
import numpy as np

# Generate a simple separable dataset
rng = np.random.default_rng(42)
X0 = rng.normal([-1, -1], 0.8, (50, 2))
X1 = rng.normal([ 1,  1], 0.8, (50, 2))
X  = np.vstack([X0, X1])
y  = np.array([0]*50 + [1]*50)

# Train logistic regression
clf = LogisticRegression().fit(X, y)
scores = clf.predict_proba(X)[:, 1]   # P(y=1|x)

# ROC curve
fpr, tpr, thresholds = roc_curve(y, scores)
print(f"AUC = {auc(fpr, tpr):.4f}")   # should be near 1.0

# Plot
plt.plot(fpr, tpr, label=f"AUC = {roc_auc_score(y, scores):.3f}")
plt.plot([0,1], [0,1], 'k--', label="Random (AUC=0.5)")
plt.xlabel("FPR (1 - Specificity)")
plt.ylabel("TPR (Recall)")
plt.title("ROC Curve")
plt.legend()
plt.show()`}
        </pre>
      </section>

      {/* 7. Make it fail */}
      <section className="mb-10">
        <h2 className="section-heading">7. Make it fail</h2>
        <div className="space-y-3 text-sm text-neutral-400">
          <p>
            <span className="font-semibold text-red-400">Heavy overlap (AUC near 0.5):</span> In the
            lab, drag "Spread σ" to 4.0 while keeping both class means near 0. The two Gaussian
            distributions completely overlap -- the model cannot distinguish classes, AUC collapses
            toward 0.5.
          </p>
          <p>
            <span className="font-semibold text-red-400">AUC is insensitive to calibration:</span>{' '}
            AUC measures ranking order, not probability calibration. A model that outputs all scores
            between 0.45 and 0.55 can have a perfect AUC if relative ordering is correct, but its
            probabilities are poorly calibrated. Use Brier score or Platt scaling when calibration
            matters.
          </p>
          <p>
            <span className="font-semibold text-red-400">
              PR-AUC vs ROC-AUC on extreme imbalance:
            </span>{' '}
            ROC-AUC can look optimistic when negatives vastly outnumber positives (FPR stays tiny
            even with many FPs). Prefer Precision-Recall AUC for very rare positive events.
          </p>
        </div>
      </section>

      {/* 8. Strengths & Limitations */}
      <section className="mb-10">
        <h2 className="section-heading">8. Strengths, limitations, and when not to use it</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-green-700/40 bg-green-900/20 p-4">
            <p className="mb-2 font-semibold text-green-300">Strengths</p>
            <ul className="space-y-1 text-sm text-neutral-300 list-disc list-inside">
              <li>Threshold-independent -- compare models without picking τ</li>
              <li>Invariant to class imbalance changes</li>
              <li>Probabilistic interpretation via Wilcoxon-Mann-Whitney</li>
              <li>Standard in medical diagnostic studies (AUROC)</li>
            </ul>
          </div>
          <div className="rounded-xl border border-red-700/40 bg-red-900/20 p-4">
            <p className="mb-2 font-semibold text-red-300">Limitations and when not to use</p>
            <ul className="space-y-1 text-sm text-neutral-300 list-disc list-inside">
              <li>Insensitive to calibration errors</li>
              <li>Misleading on extremely imbalanced datasets -- prefer PR-AUC</li>
              <li>Assumes scores are on the same scale across classes</li>
              <li>A single AUC hides shape differences in the curve</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 9. Misconceptions */}
      <section className="mb-10">
        <h2 className="section-heading">9. Common misconceptions</h2>
        <div className="space-y-4">
          {[
            {
              myth: 'AUC = 0.8 means the model is 80% accurate',
              truth:
                'AUC is not accuracy. AUC = 0.8 means the model ranks a random positive above a random negative 80% of the time. Accuracy depends on both the classifier and the chosen threshold τ.',
            },
            {
              myth: 'Higher AUC is always better',
              truth:
                'On very rare positive events, ROC-AUC can be deceptively high while PR-AUC reveals poor precision. Always examine both curves for highly imbalanced problems.',
            },
            {
              myth: 'The ROC curve goes from bottom-right to top-left as τ decreases',
              truth:
                'It goes from bottom-left (τ=1, predict all negative) to top-right (τ=0, predict all positive). Lowering τ increases both TPR and FPR.',
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
        <Quiz conceptId="u4-roc-auc" items={quizItems} />
      </section>

      {/* 11. Exam corner */}
      <section className="mb-10">
        <h2 className="section-heading">11. Exam and viva corner</h2>
        <div className="space-y-3">
          {[
            [
              'What are the axes of an ROC curve and what do the corner points represent?',
              'X-axis: FPR (False Positive Rate = 1 - Specificity). Y-axis: TPR (True Positive Rate = Sensitivity / Recall). Bottom-left (0,0): τ=1, predict all negative. Top-right (1,1): τ=0, predict all positive. Top-left (0,1): perfect classifier.',
            ],
            [
              'Why is the trapezoidal rule used for AUC computation?',
              'The ROC curve is a piecewise step function (discrete thresholds). The trapezoidal rule approximates the integral by summing trapezoids between adjacent (FPR, TPR) points: AUC ≈ Σ (Δfpr) · (tpr[i] + tpr[i+1]) / 2.',
            ],
            [
              'Explain the Wilcoxon-Mann-Whitney interpretation of AUC.',
              'AUC = P(score(x⁺) > score(x⁻)) where x⁺ is a random positive sample and x⁻ is a random negative. It equals the fraction of all (positive, negative) pairs where the positive receives a higher score -- pure ranking quality.',
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
            The ROC curve plots (FPR, TPR) at every decision threshold τ, from (0,0) to (1,1).
          </li>
          <li>AUC = area under the ROC curve, computed via the trapezoidal rule.</li>
          <li>AUC = 1.0 is perfect; AUC = 0.5 is a random classifier on the diagonal.</li>
          <li>
            AUC probabilistically equals P(score(positive) greater than score(negative)) --
            threshold-free ranking quality.
          </li>
          <li>
            Lowering τ increases recall but also increases FPR; the ROC curve visualises all such
            tradeoffs.
          </li>
          <li>
            On very imbalanced data, complement ROC-AUC with PR-AUC for a full evaluation picture.
          </li>
        </ul>
      </section>

      {/* 13. What's next */}
      <section>
        <h2 className="section-heading">13. What's next</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              to: '/learn/unit-4/classification-metrics',
              label: 'Classification metrics',
              desc: 'Confusion matrix, F1, MCC -- threshold-dependent evaluation counterpart.',
            },
            {
              to: '/learn/unit-4',
              label: 'Unit 4 overview',
              desc: 'Return to the probabilistic models unit map.',
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
