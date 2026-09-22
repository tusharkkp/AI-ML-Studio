import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Quiz } from '@/features/quiz/Quiz';
import { CustomerChurnLab } from '@/labs/customer-churn/CustomerChurnLab';

export const CustomerChurnCaseStudyPage: React.FC = () => {
  const quizItems = [
    {
      id: 'churn-q1',
      question:
        'In customer churn modeling, why is a model with 85% raw accuracy often considered a catastrophic failure for the business?',
      options: [
        {
          id: 'A',
          text: 'Because of the Accuracy Paradox: if base churn prevalence is 15%, a trivial dummy classifier predicting "never churns" achieves 85% accuracy while failing to detect 100% of churners, causing total loss of customer equity.',
          isCorrect: true,
          explanation:
            'When classes are severely imbalanced, accuracy measures majority-class stability rather than detection capability. In churn prediction, Recall and cost-weighted ROI are the decisive engineering metrics.',
        },
        {
          id: 'B',
          text: 'Because telecommunication regulators require accuracy to exceed 99.9%.',
          isCorrect: false,
          explanation:
            'Regulatory compliance does not impose arbitrary accuracy thresholds. The issue is economic failure from unmitigated subscriber loss.',
        },
        {
          id: 'C',
          text: 'Because accuracy cannot be computed on numeric datasets.',
          isCorrect: false,
          explanation:
            'Accuracy is a simple ratio of correct predictions over total predictions; it is universally computable.',
        },
      ],
    },
    {
      id: 'churn-q2',
      question:
        'If customer acquisition cost is CAC = $500 (cost of a False Negative) and an incentive discount offer costs $50 (cost of a False Positive), what is the theoretically optimal decision threshold τ* under expected cost minimization?',
      options: [
        {
          id: 'A',
          text: 'τ* = c_FP / (c_FP + c_FN) = 50 / (50 + 500) ≈ 0.091, meaning any customer with > 9.1% churn risk should receive the discount.',
          isCorrect: true,
          explanation:
            'Bayes decision theory proves that the optimal threshold equals the ratio of false positive cost to the sum of false positive and false negative costs. When missing a churner costs 10x more than giving an unnecessary discount, the threshold shifts heavily downward to maximize recall.',
        },
        {
          id: 'B',
          text: 'τ* = 0.50, because equal probability represents the point of maximum entropy.',
          isCorrect: false,
          explanation:
            'The standard 0.5 threshold assumes symmetric error costs (c_FP = c_FN), which is almost never true in real-world business applications.',
        },
        {
          id: 'C',
          text: 'τ* = 500 / 50 = 10.0, an integer multiplier.',
          isCorrect: false,
          explanation: 'A decision threshold must be a probability bounded between 0 and 1.',
        },
      ],
    },
    {
      id: 'churn-q3',
      question:
        'Why does a distance-based baseline model like k-NN fail to perform effectively on raw telecom churn features without StandardScaler?',
      options: [
        {
          id: 'A',
          text: 'Monthly charges ($20 to $120) and tenure (1 to 72 months) have numerical variances that completely dwarf categorical contract indicators (0 to 2) and support calls (0 to 6), corrupting metric distance calculation.',
          isCorrect: true,
          explanation:
            'Distance metrics treat all dimensions as isotropic coordinates. A $50 difference in monthly fee completely drowns out a critical contract status difference of 1 unless features are standardized to zero mean and unit variance.',
        },
        {
          id: 'B',
          text: 'Because k-NN requires all features to be boolean true/false values.',
          isCorrect: false,
          explanation:
            'k-NN works seamlessly with continuous numeric features, provided they are properly scaled.',
        },
        {
          id: 'C',
          text: 'Because unscaled features cause k-NN to suffer from division by zero.',
          isCorrect: false,
          explanation:
            'Distance calculations never divide by feature values; unscaled features cause scale dominance, not numerical exceptions.',
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
        <span className="text-foreground">Case study: Customer churn</span>
      </nav>

      {/* Hero */}
      <header className="mb-10">
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline">Case Study</Badge>
          <Badge variant="outline">0.5 Hours</Badge>
          <Badge variant="outline">CO2, CO3, CO4</Badge>
        </div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Case study: Customer churn prediction pipeline
        </h1>
        <p className="mt-3 text-lg text-neutral-400 leading-relaxed">
          From statistical probabilities to business balance sheets.{' '}
          <span className="text-cream font-medium">
            Building an end-to-end subscriber retention pipeline with cost-sensitive threshold
            optimization,
          </span>{' '}
          where catching a flight-risk subscriber is worth ten times more than avoiding a false
          alarm.
        </p>
      </header>

      {/* 1. Intuition */}
      <section className="mb-10">
        <h2 className="section-heading">1. Intuition</h2>
        <p className="body-text">
          In subscription businesses like telecommunications, software-as-a-service (SaaS), and
          banking, acquiring a new customer costs 5 to 10 times more than retaining an existing
          subscriber. When a high-value customer cancels their service, their lifetime revenue
          evaporates immediately.
        </p>
        <p className="body-text mt-3">
          Standard textbook machine learning teaches students to set the classification decision
          threshold at <span className="text-cream font-medium">tau = 0.50</span>. But in the
          executive boardroom, error costs are profoundly asymmetric. If our model misses a churning
          customer (a False Negative), the company loses $500 in customer equity. If our model
          incorrectly flags a loyal customer (a False Positive), we spend $50 sending them a
          retention discount code. Shifting the threshold to accommodate these real-world economics
          turns a mediocre classifier into a high-ROI enterprise asset.
        </p>
      </section>

      {/* 2. Interactive lab */}
      <section className="mb-10">
        <h2 className="section-heading">2. Interactive lab</h2>
        <p className="body-text mb-4">
          Experiment with the telecom subscriber pipeline below. Toggle between standardized and
          unscaled features, activate class weighting, compare Logistic Regression against a k-NN
          baseline, and drag the decision threshold slider to witness how the profit-maximizing
          threshold tau* dramatically outperforms the default 0.50 setting.
        </p>
        <CustomerChurnLab />
      </section>

      {/* 3. Step by step on paper */}
      <section className="mb-10">
        <h2 className="section-heading">3. Step-by-step on paper</h2>
        <div className="space-y-3 rounded-xl border border-warm-border bg-surface p-5">
          {[
            [
              'Ingest and encode features',
              'Represent each subscriber by numeric features: tenure (months), monthly charges ($), contract duration (0: month-to-month, 1: 1-year, 2: 2-year), and technical support tickets.',
            ],
            [
              'Standardize feature scales',
              'Compute z = (x - mean) / std for each feature to guarantee equal metric weighting across all attributes.',
            ],
            [
              'Compensate for class imbalance',
              'Because only ~20% of customers churn, apply class weights (1:4 ratio) or SMOTE to prevent the optimizer from predicting the majority non-churn class.',
            ],
            [
              'Train probabilistic classifier',
              'Fit logistic regression or k-NN to estimate the continuous posterior probability P(churn = 1 | x).',
            ],
            [
              'Construct business cost matrix',
              'Define c_FN = $500 (lost customer) and c_FP = $50 (retention offer cost). Determine the optimal decision threshold tau* = c_FP / (c_FP + c_FN).',
            ],
            [
              'Execute proactive retention',
              'Deploy retention incentives to all subscribers whose predicted churn probability exceeds tau*. Calculate total net financial savings.',
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
        <div className="space-y-4 text-sm text-neutral-300">
          <div className="rounded-lg border border-warm-border bg-surface p-4 font-mono text-xs leading-loose">
            <div className="text-neutral-500 mb-2">// Business Expected Cost Function</div>
            <div>E[Cost] = c_FP · FP + c_FN · FN + c_TP · TP + c_TN · TN</div>
            <div className="mt-2 text-neutral-500">// Normalised Cost Parameters</div>
            <div>c_FN = $500 (loss per undetected churner)</div>
            <div>c_FP = $50 (cost per unnecessary retention discount)</div>
            <div>c_TP = $50 (cost of successful retention discount)</div>
            <div>c_TN = $0 (loyal customer left undisturbed)</div>
            <div className="mt-2 text-neutral-500">
              // Optimal Bayes Decision Threshold Condition
            </div>
            <div>P(y = 1 | x) · c_FN &gt; (1 - P(y = 1 | x)) · c_FP</div>
            <div>==&gt; tau* = c_FP / (c_FP + c_FN) = 50 / (50 + 500) = 50 / 550 ≈ 0.091</div>
            <div className="mt-2 text-neutral-500">
              // Net Enterprise Savings vs No Model Baseline
            </div>
            <div>Net Savings = TP · ($500 - $50) - FP · $50 = TP · $450 - FP · $50</div>
          </div>
          <p>
            Bayes decision theory shows that minimizing expected financial cost is mathematically
            equivalent to sweeping the ROC curve to find the operating point where the tangent slope
            equals the cost ratio:{' '}
            <span className="text-cream font-medium">
              d(TPR) / d(FPR) = (c_FP / c_FN) · (P(y=0) / P(y=1))
            </span>
            . Whenever the cost of a false negative dominates, the optimal decision boundary shifts
            to capture high-risk cases aggressively.
          </p>
        </div>
      </section>

      {/* 5. Pseudocode */}
      <section className="mb-10">
        <h2 className="section-heading">5. Algorithm pseudocode</h2>
        <pre className="overflow-x-auto rounded-xl border border-warm-border bg-surface p-4 text-xs leading-relaxed text-neutral-300">
          {`function ChurnOptimizationPipeline(X_train, y_train, X_test, y_test, c_FP, c_FN):
    // 1. Preprocessing
    scaler ← FitStandardScaler(X_train)
    X_train_scaled ← scaler.transform(X_train)
    X_test_scaled  ← scaler.transform(X_test)

    // 2. Class Weighting
    weight_positive ← count(y_train == 0) / count(y_train == 1)
    model ← TrainLogisticRegression(X_train_scaled, y_train, class_weight=weight_positive)

    // 3. Probabilistic Scoring
    probabilities ← model.predict_proba(X_test_scaled)

    // 4. Threshold Grid Search for Profit Maximization
    best_tau ← 0.50
    max_savings ← -infinity

    for tau in [0.05, 0.06, ..., 0.90]:
        y_pred ← (probabilities >= tau) ? 1 : 0
        tp, fp, fn ← confusion_matrix(y_test, y_pred)
        savings ← tp * (c_FN - c_FP) - fp * c_FP

        if savings > max_savings:
            max_savings ← savings
            best_tau ← tau

    return model, best_tau, max_savings`}
        </pre>
      </section>

      {/* 6. Code in Python */}
      <section className="mb-10">
        <h2 className="section-heading">6. Code it in Python</h2>
        <pre className="overflow-x-auto rounded-xl border border-warm-border bg-surface p-4 text-xs leading-relaxed text-neutral-300">
          {`import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import confusion_matrix

def train_churn_pipeline(X_train, y_train, X_test, y_test):
    # 1. Feature scaling pipeline
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # 2. Balanced logistic regression
    model = LogisticRegression(class_weight='balanced', max_iter=1000)
    model.fit(X_train_scaled, y_train)

    # 3. Predict continuous probabilities
    probs = model.predict_proba(X_test_scaled)[:, 1]

    # 4. Economic threshold sweep (CAC=$500, Retention Offer=$50)
    c_fn = 500
    c_fp = 50
    best_tau = 0.5
    best_profit = -float('inf')

    for tau in np.linspace(0.05, 0.85, 81):
        preds = (probs >= tau).astype(int)
        tn, fp, fn, tp = confusion_matrix(y_test, preds).ravel()
        net_savings = tp * (c_fn - c_fp) - fp * c_fp

        if net_savings > best_profit:
            best_profit = net_savings
            best_tau = tau

    print(f"Optimal Threshold tau*: {best_tau:.2f}")
    print(f"Net Financial Savings: \${best_profit:,.2f}")
    return model, best_tau`}
        </pre>
      </section>

      {/* 7. Make it fail */}
      <section className="mb-10">
        <h2 className="section-heading">7. Make it fail</h2>
        <div className="space-y-3 text-sm text-neutral-400">
          <p>
            <span className="font-semibold text-red-400">The 0.50 threshold trap:</span> Run the lab
            with threshold set to 0.50. Because the model outputs calibrated probabilities and the
            positive class is a minority, very few predictions cross the 0.50 barrier. Recall
            plummets, causing the company to miss majority of actual churners and hemorrhaging
            hundreds of thousands in subscriber equity.
          </p>
          <p>
            <span className="font-semibold text-red-400">
              Unscaled features in distance models:
            </span>{' '}
            Toggle off StandardScaler in the lab while running the k-NN baseline. Notice how monthly
            charges ($100+) completely obliterate tenure and contract type in distance calculations,
            resulting in degraded ranking and erratic neighbor selection.
          </p>
          <p>
            <span className="font-semibold text-red-400">Over-offering discounts:</span> Dragging
            tau down to 0.02 flags virtually everyone as a flight risk. While Recall reaches 100%,
            False Positives explode, wasting immense capital giving unneeded discounts to loyal
            customers who had no intention of leaving.
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
              <li>Directly optimizes enterprise financial return rather than abstract loss</li>
              <li>Calibrated probabilities enable flexible tiered incentive campaigns</li>
              <li>
                Transparent feature coefficients reveal root churn drivers (e.g. contract type)
              </li>
              <li>Robust to class imbalance via threshold tuning and sample weighting</li>
              <li>Seamlessly integrates into existing CRM and customer success software</li>
            </ul>
          </div>
          <div className="rounded-xl border border-red-700/40 bg-red-900/20 p-4">
            <p className="mb-2 font-semibold text-red-300">Limitations and when not to use</p>
            <ul className="space-y-1 text-sm text-neutral-300 list-disc list-inside">
              <li>Requires accurate estimates of business costs (CAC and retention discounts)</li>
              <li>
                Risk of perverse incentives: customers may intentionally threaten churn to get
                discounts
              </li>
              <li>
                Assumes stationary customer behavior; macro-economic shifts require retraining
              </li>
              <li>Does not explain the psychological "why" behind qualitative dissatisfaction</li>
              <li>
                Not suitable if intervention budget is strictly capped (requires top-K rank
                selection)
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 9. Common Misconceptions */}
      <section className="mb-10">
        <h2 className="section-heading">9. Common misconceptions</h2>
        <div className="space-y-4">
          {[
            {
              myth: '0.50 is always the default classification threshold',
              truth:
                '0.50 is only optimal when classes are perfectly balanced and false positives cost the exact same as false negatives. In real business problems, this symmetry virtually never exists.',
            },
            {
              myth: 'Maximizing accuracy maximizes company profit',
              truth:
                'A model with 90% accuracy that catches 0 churners makes $0 in savings. A model with 75% accuracy that catches 80% of churners can save millions. Business ROI and accuracy often trade off.',
            },
            {
              myth: 'SMOTE synthetic oversampling is required for every imbalanced problem',
              truth:
                'Cost-sensitive threshold tuning or class-weighted log-loss J(theta) often achieves superior or equal performance to SMOTE without injecting artificial synthetic vectors into the feature space.',
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
        <Quiz conceptId="u4-case-churn" items={quizItems} />
      </section>

      {/* 11. Exam corner */}
      <section className="mb-10">
        <h2 className="section-heading">11. Exam and viva corner</h2>
        <div className="space-y-3">
          {[
            [
              'What is cost-sensitive learning and why is it preferred over data resampling in financial applications?',
              'Cost-sensitive learning modifies the objective loss function or post-processing threshold based on misclassification costs (c_FN vs c_FP). Unlike resampling (undersampling/oversampling), it preserves the true empirical distribution and avoids data deletion or synthetic artifacts.',
            ],
            [
              'Why is the Precision-Recall (PR) curve preferred over the ROC curve when assessing churn models?',
              'ROC curves evaluate True Positive Rate against False Positive Rate. When the negative class is massive (e.g. 98% non-churn), large increases in false positives produce only tiny changes in FPR, making ROC curves look deceptively optimistic. PR curves isolate positive class precision directly.',
            ],
            [
              'Explain the relationship between the Bayes decision boundary and the cost ratio.',
              'The decision rule predicts class 1 if P(y=1|x) / P(y=0|x) > c_FP / c_FN. Taking the logarithm gives the log-odds threshold: theta^T x > ln(c_FP / c_FN).',
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
            Subscriber churn prediction is fundamentally an asymmetric cost-sensitive problem.
          </li>
          <li>
            The Accuracy Paradox causes high-accuracy classifiers to completely miss rare churn
            events.
          </li>
          <li>
            StandardScaler is essential to prevent high-magnitude features from distorting distance
            calculations and gradient updates.
          </li>
          <li>
            The optimal decision threshold tau* = c_FP / (c_FP + c_FN) shifts downward when false
            negatives carry heavy business penalties.
          </li>
          <li>Tuning tau directly optimizes net financial savings and shareholder value.</li>
        </ul>
      </section>

      {/* 13. What's next */}
      <section>
        <h2 className="section-heading">13. What's next</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              to: '/learn/unit-4/knn',
              label: 'k-Nearest neighbors (k-NN)',
              desc: 'Explore lazy instance-based learning, Voronoi cells, and distance metrics.',
            },
            {
              to: '/learn/unit-4/variational-inference',
              label: 'Variational inference',
              desc: 'Learn how modern probabilistic AI solves intractable posterior distributions via ELBO optimization.',
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
