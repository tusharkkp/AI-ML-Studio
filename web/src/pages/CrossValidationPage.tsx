import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Quiz } from '@/features/quiz/Quiz';
import { CrossValidationLab } from '@/labs/cross-validation/CrossValidationLab';

export const CrossValidationPage: React.FC = () => {
  const quizItems = [
    {
      id: 'cv-q1',
      question:
        'Why is Leave-One-Out Cross-Validation (LOOCV, K = n) prone to higher variance of the error estimator than 10-Fold Cross-Validation?',
      options: [
        {
          id: 'A',
          text: 'Because the n training sets in LOOCV overlap almost completely (sharing (n - 1) / n samples); their error estimates are highly positively correlated, and the average of strongly correlated variables has higher variance.',
          isCorrect: true,
          explanation:
            'While LOOCV is nearly unbiased because each model trains on almost the entire dataset, the n fitted models are virtually identical copies of each other. The variance of the sum of positively correlated random variables is higher than the sum of more independent estimates (such as in 5-fold or 10-fold CV).',
        },
        {
          id: 'B',
          text: 'Because LOOCV requires running a neural network on a supercomputer.',
          isCorrect: false,
          explanation:
            'Computational complexity is a cost issue, not statistical variance of the estimator.',
        },
        {
          id: 'C',
          text: 'Because LOOCV cannot compute mean squared errors.',
          isCorrect: false,
          explanation:
            'MSE is computed identically by taking the average of squared test residuals.',
        },
      ],
    },
    {
      id: 'cv-q2',
      question:
        'What is the critical rule for preventing data leakage when applying feature scaling (like StandardScaler) inside a cross-validation loop?',
      options: [
        {
          id: 'A',
          text: 'The scaler must be fit EXCLUSIVELY on the training fold of each split, and then used to transform both the training fold and the validation fold without ever fitting on the validation fold.',
          isCorrect: true,
          explanation:
            'If scaler.fit() touches the validation fold or is performed on the whole dataset prior to splitting, information about the validation mean and standard deviation leaks into training parameter weights, producing falsely optimistic validation scores that fail in production.',
        },
        {
          id: 'B',
          text: 'The scaler should be deleted after the first fold.',
          isCorrect: false,
          explanation: 'A fresh scaler instance must be fit for every fold.',
        },
        {
          id: 'C',
          text: 'Feature scaling is mathematically forbidden when using cross-validation.',
          isCorrect: false,
          explanation: 'Feature scaling is essential for gradient descent and regularized models.',
        },
      ],
    },
    {
      id: 'cv-q3',
      question:
        'Why must time-series financial stock price models NEVER use standard random K-Fold cross-validation?',
      options: [
        {
          id: 'A',
          text: 'Random splitting produces lookahead bias: training on future days (e.g. Wednesday and Friday) to predict past days (e.g. Thursday), which is impossible in live trading.',
          isCorrect: true,
          explanation:
            'Time-series data has strict temporal causality. A model trained on future market conditions will exploit forward autocorrelation that does not exist in real-time deployment. TimeSeriesSplit enforces walk-forward evaluation.',
        },
        {
          id: 'B',
          text: 'Because stock prices can only be modeled using integer numbers.',
          isCorrect: false,
          explanation: 'Stock prices are continuous real numbers.',
        },
        {
          id: 'C',
          text: 'Because Wall Street banks have outlawed K-Fold cross validation.',
          isCorrect: false,
          explanation: 'This is a statistical causality principle, not a regulatory ban.',
        },
      ],
    },
    {
      id: 'cv-q4',
      question:
        'What is the "One Standard Error Rule" (1-SE Rule) frequently used in cross-validated model selection?',
      options: [
        {
          id: 'A',
          text: 'Select the simplest or most regularized model whose cross-validation score is within one standard error of the best performing model score.',
          isCorrect: true,
          explanation:
            'Heuristically introduced by Hastie, Tibshirani, and Friedman, the 1-SE rule acknowledges that the lowest numerical CV error may just be random sampling noise. Choosing the simplest model within 1 SE of the minimum protects against unnecessary model complexity.',
        },
        {
          id: 'B',
          text: 'Reject all models whose training error exceeds 1.0.',
          isCorrect: false,
          explanation: 'This is an arbitrary threshold, not the 1-SE rule.',
        },
        {
          id: 'C',
          text: 'Only train models that have exactly one feature.',
          isCorrect: false,
          explanation: 'The 1-SE rule applies across any model family and feature count.',
        },
      ],
    },
    {
      id: 'cv-q5',
      question:
        'In medical datasets where patients have multiple biopsy records, why must Group K-Fold be used instead of standard K-Fold?',
      options: [
        {
          id: 'A',
          text: 'To ensure all biopsies from the same patient are assigned to the same fold; otherwise, the model memorizes patient-specific biological signatures across train and test partitions.',
          isCorrect: true,
          explanation:
            'If biopsy #1 from Patient A is in train and biopsy #2 from Patient A is in validation, the model recognizes patient-level genetic markers, falsely inflating accuracy while failing completely when tested on a new unseen patient.',
        },
        {
          id: 'B',
          text: 'Because doctors require patients to be grouped alphabetically.',
          isCorrect: false,
          explanation: 'Alphabetical grouping has no medical significance.',
        },
        {
          id: 'C',
          text: 'Because Scikit-Learn cannot run KFold on string identifiers.',
          isCorrect: false,
          explanation: 'GroupKFold accepts arbitrary group arrays.',
        },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-12">
      {/* 1. Hero Header & Course Context */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="border-amber-500/30 text-amber-400">
            MIT AOE B.Tech AI & ML (2304322T)
          </Badge>
          <Badge variant="outline" className="border-stone-800 text-stone-400">
            Unit 3: Further Reading
          </Badge>
          <Badge variant="outline" className="border-stone-800 text-stone-400">
            0.3 Hours • CO2, CO4
          </Badge>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-stone-100">
          K-Fold Cross-Validation, Resampling & Variance Estimation
        </h1>
        <p className="text-base text-stone-400 max-w-3xl leading-relaxed">
          A single train-test split produces highly volatile performance estimates that depend
          heavily on random sampling luck. K-Fold Cross-Validation solves this by{' '}
          <span className="font-medium text-stone-200">
            rotating holdout validation sets across non-overlapping partitions
          </span>
          , providing an unbiased estimator of true generalization error.
        </p>
      </section>

      {/* 2. Conceptual Foundation & Mathematical Definition */}
      <section className="space-y-6">
        <div className="border-b border-stone-800 pb-2">
          <h2 className="font-display text-xl font-semibold text-stone-100">
            Mathematical Formulation: The Cross-Validation Estimator
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Formal aggregation of holdout errors across K non-overlapping folds
          </p>
        </div>
        <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/30 space-y-3 text-sm text-stone-300">
          <p className="leading-relaxed">
            The dataset D of size n is partitioned into K approximately equal-sized disjoint subsets
            C₁, C₂, ..., C_K:
          </p>
          <div className="p-3 bg-stone-950 rounded font-mono text-xs text-amber-300">
            {
              'CV_(K) = (1 / K) · Σₖ₌₁ᴷ MSEₖ = (1 / K) · Σₖ₌₁ᴷ [ (1 / nₖ) · Σ_{i ∈ C_k} (yᵢ - f̂_{(-k)}(xᵢ))² ]'
            }
          </div>
          <p className="leading-relaxed text-xs text-stone-400">
            where f̂_(-k) denotes the model trained on all data excluding fold k, and n_k is the
            number of samples in fold k.
          </p>
        </div>
      </section>

      {/* 3. Tradeoffs: Choosing K */}
      <section className="space-y-4">
        <div className="border-b border-stone-800 pb-2">
          <h2 className="font-display text-xl font-semibold text-stone-100">
            Tradeoffs in Choosing K: Bias vs Variance vs Computation
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Comparing K=5, K=10, and Leave-One-Out Cross-Validation (LOOCV)
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/30 space-y-2">
            <h4 className="font-semibold text-stone-200">K = 5 (Fast & Low Variance)</h4>
            <p className="text-stone-400 leading-relaxed">
              Trains on 80% of data. Fast execution with low variance between folds. Slight
              pessimistic bias because models train on fewer samples than the full dataset.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/30 space-y-2">
            <h4 className="font-semibold text-amber-300">K = 10 (Gold Standard)</h4>
            <p className="text-stone-400 leading-relaxed">
              Trains on 90% of data. The universally recommended sweet spot in empirical statistical
              learning, offering negligible bias and well-calibrated variance.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/30 space-y-2">
            <h4 className="font-semibold text-stone-200">LOOCV (K = n)</h4>
            <p className="text-stone-400 leading-relaxed">
              Nearly zero bias because each model trains on n-1 samples. However, high computational
              cost (n fits) and surprisingly high estimator variance due to correlated training
              sets.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Interactive Simulation Studio */}
      <section className="space-y-4">
        <div className="border-b border-stone-800 pb-2">
          <h2 className="font-display text-xl font-semibold text-stone-100">
            Interactive Cross-Validation Studio
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Inspect partition matrices, cycle active validation folds, and compare standard vs
            time-series walk-forward schemes
          </p>
        </div>
        <CrossValidationLab />
      </section>

      {/* 5. Partitioning Strategies */}
      <section className="space-y-4">
        <div className="border-b border-stone-800 pb-2">
          <h2 className="font-display text-xl font-semibold text-stone-100">
            Partitioning Strategies Catalog
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Selecting the right resampling scheme for structured, imbalanced, and sequential data
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/30 space-y-2">
            <h4 className="font-semibold text-emerald-300">Stratified K-Fold</h4>
            <p className="text-stone-400 leading-relaxed">
              Rearranges partitions so each fold contains approximately the same percentage of
              target labels or continuous quantiles as the master dataset. Crucial for imbalanced
              targets.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/30 space-y-2">
            <h4 className="font-semibold text-sky-300">Group K-Fold</h4>
            <p className="text-stone-400 leading-relaxed">
              Ensures that observations belonging to the same cluster (e.g. multiple transactions
              from the same user or patient) never span both training and validation folds.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/30 space-y-2">
            <h4 className="font-semibold text-amber-300">Time-Series Walk-Forward Split</h4>
            <p className="text-stone-400 leading-relaxed">
              Strictly preserves chronological causality. Fold k only trains on indices prior to the
              validation window, preventing lookahead bias in financial and demand forecasts.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/30 space-y-2">
            <h4 className="font-semibold text-purple-300">Nested Cross-Validation</h4>
            <p className="text-stone-400 leading-relaxed">
              An outer loop assesses overall generalization error, while an inner loop tunes
              hyperparameters. Prevents hyperparameter selection bias from contaminating test
              scores.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Data Leakage Pitfalls */}
      <section className="space-y-4">
        <div className="border-b border-stone-800 pb-2">
          <h2 className="font-display text-xl font-semibold text-stone-100">
            Data Leakage: The Silent Model Destroyer
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            How improper preprocessing pipeline placement corrupts cross-validation validity
          </p>
        </div>
        <div className="p-4 rounded-lg border border-red-900/30 bg-red-950/10 text-xs text-stone-300 space-y-2 leading-relaxed">
          <h4 className="font-semibold text-red-200">The Global Preprocessing Trap</h4>
          <p>
            If you run{' '}
            <code className="text-amber-300 font-mono">StandardScaler().fit_transform(X)</code> on
            the entire dataset BEFORE calling cross_val_score, the validation fold mean and standard
            deviation are baked into the training set.
            <span className="font-medium text-stone-200">
              Always encapsulate preprocessing inside a Pipeline
            </span>{' '}
            so transformers are fit exclusively on training folds.
          </p>
        </div>
      </section>

      {/* 7. Production Python & Scikit-Learn Pipeline */}
      <section className="space-y-4">
        <div className="border-b border-stone-800 pb-2">
          <h2 className="font-display text-xl font-semibold text-stone-100">
            Production Python & Scikit-Learn Pipeline
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Implementing leak-proof pipelines with KFold, TimeSeriesSplit, and GridSearchCV
          </p>
        </div>
        <div className="p-4 rounded-lg border border-stone-800 bg-stone-950 font-mono text-xs text-stone-300 overflow-x-auto">
          <pre>{`import numpy as np
from sklearn.model_selection import KFold, TimeSeriesSplit, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import Ridge
from sklearn.pipeline import Pipeline

# 1. Encapsulate transformer and estimator into a leak-proof Pipeline
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('regressor', Ridge(alpha=1.0))
])

# 2. Configure 5-Fold Cross-Validation with fixed random seed
cv_strategy = KFold(n_splits=5, shuffle=True, random_state=42)

# 3. Compute cross-validated MSE scores
# scores = cross_val_score(
#     pipeline, X, y,
#     cv=cv_strategy,
#     scoring='neg_mean_squared_error'
# )
# cv_mse = -scores
# print(f"Mean CV MSE: {cv_mse.mean():.3f} +/- {cv_mse.std() / np.sqrt(5):.3f}")

# 4. For temporal sequential data, switch to TimeSeriesSplit
ts_cv = TimeSeriesSplit(n_splits=5)`}</pre>
        </div>
      </section>

      {/* 8. Viva Voce & Interview Defense */}
      <section className="space-y-4">
        <div className="border-b border-stone-800 pb-2">
          <h2 className="font-display text-xl font-semibold text-stone-100">
            Viva Voce & Interview Defense (MIT AOE Exam Focus)
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Essential oral questions on cross-validation mechanics and statistical properties
          </p>
        </div>
        <div className="space-y-3 text-sm">
          <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/30 space-y-1.5">
            <h4 className="font-medium text-amber-400">
              Q1: What is the main purpose of K-Fold Cross-Validation?
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              To reliably estimate the generalization error of a machine learning model on unseen
              data and to tune hyperparameters without overfitting to a single arbitrary train-test
              split.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/30 space-y-1.5">
            <h4 className="font-medium text-amber-400">
              Q2: Why is K = 10 universally favored over K = 2 or LOOCV?
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              K = 2 only trains on 50% of the data, introducing severe pessimistic bias. LOOCV (K =
              n) has minimal bias but high computational cost and high estimator variance due to
              overlapping training sets. K = 10 achieves an optimal empirical compromise.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/30 space-y-1.5">
            <h4 className="font-medium text-amber-400">
              Q3: What happens if you perform feature selection on the entire dataset before running
              cross-validation?
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              This causes catastrophic data leakage. The features selected already know the labels
              of the test folds, producing artificially inflated cross-validation scores that
              completely fail when deployed on truly new data.
            </p>
          </div>
        </div>
      </section>

      {/* 9. Key Takeaways & Summary */}
      <section className="space-y-4">
        <div className="border-b border-stone-800 pb-2">
          <h2 className="font-display text-xl font-semibold text-stone-100">
            Key Takeaways & Summary
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Best practices for rigorous model validation
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-stone-900/40 rounded border border-stone-800">
            <div className="font-semibold text-stone-200">Always Use Pipelines</div>
            <p className="text-stone-400 mt-1">
              Place scalers, imputers, and encoders inside Scikit-Learn Pipelines so they are fit
              strictly on training partitions.
            </p>
          </div>
          <div className="p-3 bg-stone-900/40 rounded border border-stone-800">
            <div className="font-semibold text-stone-200">Respect Temporal Order</div>
            <p className="text-stone-400 mt-1">
              Never use random shuffled K-Fold on sequential or time-series data. Use
              TimeSeriesSplit to avoid lookahead leakage.
            </p>
          </div>
        </div>
      </section>

      {/* 10. Knowledge Check Micro-Quiz */}
      <section className="space-y-4">
        <div className="border-b border-stone-800 pb-2">
          <h2 className="font-display text-xl font-semibold text-stone-100">
            Knowledge Check Quiz
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Test your understanding of resampling and cross-validation protocols
          </p>
        </div>
        <Quiz conceptId="u3-further-kfold-cv" items={quizItems} unitAccent={3} />
      </section>

      {/* 11. Next Step Navigation */}
      <section className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-stone-800">
        <div>
          <span className="text-xs font-mono text-stone-500 uppercase tracking-wider">
            Previous Concept
          </span>
          <div className="mt-1">
            <Link
              to="/learn/unit-3/regularization"
              className="text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
            >
              ← Ridge, Lasso & Elastic Net Regularization
            </Link>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono text-stone-500 uppercase tracking-wider">
            Next: Unit 3 Assessment
          </span>
          <div className="mt-1">
            <Link
              to="/learn/unit-3/exam"
              className="text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
            >
              Unit 3 Comprehensive 20-Question Exam →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
