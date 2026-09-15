import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Quiz } from '@/features/quiz/Quiz';
import { RegularizationLab } from '@/labs/regularization/RegularizationLab';

export const RegularizationPage: React.FC = () => {
  const quizItems = [
    {
      id: 'reg-q1',
      question:
        'Geometrically, why does Lasso (L1 regularization) drive parameter weights strictly to zero, whereas Ridge (L2) only shrinks them asymptotically?',
      options: [
        {
          id: 'A',
          text: 'The L1 norm constraint forms a sharp-cornered diamond/rhombus with vertices located on the coordinate axes; smooth elliptical loss contours are statistically far more likely to contact a sharp axis vertex first.',
          isCorrect: true,
          explanation:
            'In two dimensions, the L1 constraint region is a rotated square (|theta_1| + |theta_2| <= t) with sharp points directly on the theta_1 and theta_2 axes. Elliptical OLS loss contours expand until they touch this boundary, which usually occurs at a sharp corner where one coordinate is strictly zero.',
        },
        {
          id: 'B',
          text: 'Because Lasso uses 16-bit floating point precision which rounds small numbers to zero.',
          isCorrect: false,
          explanation: 'Precision rounding is hardware quantization, not mathematical sparsity.',
        },
        {
          id: 'C',
          text: 'Because the Ridge derivative is always zero.',
          isCorrect: false,
          explanation: 'The Ridge derivative is 2*theta, which is only zero at theta=0.',
        },
      ],
    },
    {
      id: 'reg-q2',
      question:
        'Why MUST continuous features be standardized to zero mean and unit variance before fitting Ridge or Lasso regression?',
      options: [
        {
          id: 'A',
          text: 'Because the regularization penalty treats all weights equally in the penalty summation; unscaled features with large numerical magnitudes will naturally have tiny weights and escape penalization.',
          isCorrect: true,
          explanation:
            'If feature 1 is measured in millimeters (values in thousands) and feature 2 is in kilometers (values in decimals), the OLS weight for feature 1 is tiny while feature 2 is huge. Penalizing sum(theta_j^2) without scaling severely penalizes feature 2 while completely ignoring feature 1.',
        },
        {
          id: 'B',
          text: 'Because Scikit-Learn will raise a syntax error if inputs are unscaled.',
          isCorrect: false,
          explanation:
            'Code will execute without errors, but the mathematical solution will be distorted.',
        },
        {
          id: 'C',
          text: 'Because unscaled features cause computer CPUs to overheat.',
          isCorrect: false,
          explanation: 'Hardware performance is unrelated to statistical scaling requirements.',
        },
      ],
    },
    {
      id: 'reg-q3',
      question:
        'When two features X1 and X2 are strongly collinear (e.g., correlation r > 0.95), how do Lasso and Ridge behave differently?',
      options: [
        {
          id: 'A',
          text: 'Lasso arbitrarily selects one feature and forces the other to zero, while Ridge shrinks both weights proportionally together (the grouping effect).',
          isCorrect: true,
          explanation:
            'Lasso breaks collinear ties arbitrarily, retaining one predictor and setting the other to zero based on microscopic noise. Ridge regression distributes credit evenly across collinear predictors, shrinking both coefficients together without destabilizing variance.',
        },
        {
          id: 'B',
          text: 'Both algorithms crash due to matrix singularity.',
          isCorrect: false,
          explanation:
            'Ridge normal equation (X^TX + alpha*I) is strictly non-singular even with collinearity.',
        },
        {
          id: 'C',
          text: 'Lasso doubles both coefficients while Ridge zeroes them out.',
          isCorrect: false,
          explanation: 'Regularization shrinks coefficients; it never inflates them.',
        },
      ],
    },
    {
      id: 'reg-q4',
      question:
        'What specific advantage does Elastic Net provide over pure Lasso when dealing with high-dimensional data where the number of features p exceeds sample size n (p > n)?',
      options: [
        {
          id: 'A',
          text: 'Pure Lasso can select at most n non-zero features before saturating; Elastic Net can select all relevant features while grouping correlated predictors together.',
          isCorrect: true,
          explanation:
            'Mathematically, pure Lasso coordinate descent cannot select more than n non-zero predictors when p > n. By combining L2 curvature with L1 thresholding, Elastic Net overcomes the n-predictor saturation limit and stabilizes selection among correlated feature clusters.',
        },
        {
          id: 'B',
          text: 'Elastic Net eliminates the need for training data.',
          isCorrect: false,
          explanation: 'All regression algorithms require empirical training observations.',
        },
        {
          id: 'C',
          text: 'Elastic Net executes in O(1) constant time regardless of dataset size.',
          isCorrect: false,
          explanation: 'Iterative coordinate descent requires iterative passes across the data.',
        },
      ],
    },
    {
      id: 'reg-q5',
      question:
        'In the Ridge normal equation theta = (X^T X + alpha * I)^(-1) X^T y, why should the intercept column theta_0 NOT be regularized?',
      options: [
        {
          id: 'A',
          text: 'Penalizing the intercept shrinks the baseline prediction towards zero, making the model sensitive to arbitrary vertical shifts in the target variable y.',
          isCorrect: true,
          explanation:
            'The intercept represents the expected mean of the target when all predictors are zero. Penalizing it forces the line towards the coordinate origin (0, 0), which introduces severe artificial bias if y has a non-zero mean.',
        },
        {
          id: 'B',
          text: 'Because the identity matrix I cannot have numbers on its first row.',
          isCorrect: false,
          explanation: 'Matrix algebra supports arbitrary diagonal values.',
        },
        {
          id: 'C',
          text: 'Because Python lists cannot store the zeroth element.',
          isCorrect: false,
          explanation: 'Python arrays are zero-indexed.',
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
            Unit 3: Self-Study
          </Badge>
          <Badge variant="outline" className="border-stone-800 text-stone-400">
            0.5 Hours • CO2, CO4
          </Badge>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-stone-100">
          Regularization: Ridge (L2), Lasso (L1) & Elastic Net
        </h1>
        <p className="text-base text-stone-400 max-w-3xl leading-relaxed">
          When linear regression models face high-dimensional feature spaces or strong
          multicollinearity, Ordinary Least Squares parameters explode in variance. Regularization
          introduces{' '}
          <span className="font-medium text-stone-200">
            mathematically calibrated parameter constraints
          </span>{' '}
          that trade small amounts of bias for dramatic reductions in model variance.
        </p>
      </section>

      {/* 2. Mathematical Formulation of Losses */}
      <section className="space-y-6">
        <div className="border-b border-stone-800 pb-2">
          <h2 className="font-display text-xl font-semibold text-stone-100">
            Mathematical Formulation: The Three Penalties
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Formal definitions of L2 Tikhonov shrinkage, L1 sparsity penalties, and Elastic Net
            convex combinations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-stone-800 bg-stone-950/60">
            <CardHeader className="pb-2">
              <h3 className="font-display text-sm font-semibold text-sky-400">
                1. Ridge Regression (L2)
              </h3>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-stone-400">
              <p>Adds quadratic penalty on parameter magnitudes:</p>
              <div className="p-2.5 bg-stone-900 rounded border border-stone-800 font-mono text-sky-300">
                J(θ) = MSE + α · Σ θⱼ²
              </div>
              <p>
                Shrinks all weights continuously toward zero. Never sets weights strictly to zero;
                retains all predictors in the model.
              </p>
            </CardContent>
          </Card>

          <Card className="border-stone-800 bg-stone-950/60">
            <CardHeader className="pb-2">
              <h3 className="font-display text-sm font-semibold text-emerald-400">
                2. Lasso Regression (L1)
              </h3>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-stone-400">
              <p>Adds absolute value penalty on weights:</p>
              <div className="p-2.5 bg-stone-900 rounded border border-stone-800 font-mono text-emerald-300">
                J(θ) = MSE + α · Σ |θⱼ|
              </div>
              <p>
                Drives non-informative or redundant weights strictly to 0.0, performing automatic
                embedded feature selection.
              </p>
            </CardContent>
          </Card>

          <Card className="border-stone-800 bg-stone-950/60">
            <CardHeader className="pb-2">
              <h3 className="font-display text-sm font-semibold text-purple-400">
                3. Elastic Net (L1 + L2)
              </h3>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-stone-400">
              <p>Combines L1 and L2 penalties with ratio ρ:</p>
              <div className="p-2.5 bg-stone-900 rounded border border-stone-800 font-mono text-purple-300">
                J(θ) = MSE + α [ρ·||θ||₁ + ½(1-ρ)·||θ||₂²]
              </div>
              <p>
                Balances Lasso sparsity with Ridge grouping; handles correlated feature clusters and
                datasets where p &gt; n.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 3. Derivations & Coordinate Descent */}
      <section className="space-y-4">
        <div className="border-b border-stone-800 pb-2">
          <h2 className="font-display text-xl font-semibold text-stone-100">
            Closed-Form Solution vs Coordinate Descent
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Why Ridge has an analytical closed-form while Lasso requires iterative soft-thresholding
          </p>
        </div>
        <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/30 space-y-3 text-sm text-stone-300">
          <h4 className="font-medium text-stone-100">Ridge Analytical Normal Equation</h4>
          <p className="leading-relaxed text-xs">
            Because the L2 penalty is smooth and continuously differentiable everywhere, taking the
            gradient ∇J(θ) and setting it to zero yields an exact closed-form matrix solution:
          </p>
          <div className="p-3 bg-stone-950 rounded font-mono text-xs text-sky-300">
            θ_Ridge = (Xᵀ X + α m I')⁻¹ Xᵀ y
          </div>
          <p className="leading-relaxed text-xs text-stone-400">
            Notice that adding α·m to the diagonal ensures that XᵀX + αmI' is strictly positive
            definite and invertible even when XᵀX is singular due to extreme multicollinearity.
          </p>

          <h4 className="font-medium text-stone-100 pt-2">
            Lasso Non-Differentiability & Soft-Thresholding
          </h4>
          <p className="leading-relaxed text-xs">
            The L1 penalty |θⱼ| has a non-differentiable sharp kink at θⱼ = 0. We solve it using{' '}
            <span className="font-medium text-stone-200">Coordinate Descent</span>, cycling through
            each feature j and updating its weight using the soft-thresholding operator:
          </p>
          <div className="p-3 bg-stone-950 rounded font-mono text-xs text-emerald-400">
            S(ρⱼ, α) = sign(ρⱼ) · max(|ρⱼ| - α, 0)
          </div>
          <p className="leading-relaxed text-xs text-stone-400">
            If the partial residual correlation |ρⱼ| is less than or equal to penalty α, the
            coefficient is clamped strictly to zero.
          </p>
        </div>
      </section>

      {/* 4. Interactive Simulation Studio */}
      <section className="space-y-4">
        <div className="border-b border-stone-800 pb-2">
          <h2 className="font-display text-xl font-semibold text-stone-100">
            Interactive Regularization Studio
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Sweep penalty strength α, inspect shrinkage trace curves, and examine the geometric
            constraint diamond
          </p>
        </div>
        <RegularizationLab />
      </section>

      {/* 5. Geometric Interpretation */}
      <section className="space-y-4">
        <div className="border-b border-stone-800 pb-2">
          <h2 className="font-display text-xl font-semibold text-stone-100">
            Geometric Interpretation: Why Lasso Produces Exact Zeros
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Understanding the interaction between loss ellipsoids and constraint boundaries
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/30 space-y-2">
            <h4 className="font-semibold text-sky-300">Ridge: Circular Constraint Ball</h4>
            <p className="text-stone-400 leading-relaxed">
              The Ridge constraint ||θ||₂² ≤ t represents a smooth circle or hypersphere. The
              expanding elliptical contours of the MSE loss function touch the smooth spherical
              surface at an arbitrary tangent point. Because the boundary has no sharp corners, the
              tangent touchpoint almost never lies exactly on a coordinate axis.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/30 space-y-2">
            <h4 className="font-semibold text-emerald-300">Lasso: Polytope Diamond Corners</h4>
            <p className="text-stone-400 leading-relaxed">
              The Lasso constraint ||θ||₁ ≤ t forms a diamond with sharp vertices directly on the
              coordinate axes. When the elliptical loss contours expand outward from the
              unconstrained OLS optimum, they are{' '}
              <span className="font-medium text-stone-200">
                statistically far more likely to intersect a protruding vertex
              </span>{' '}
              than a flat edge, immediately locking one or more coefficients to exactly 0.0.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Multicollinearity & Grouping */}
      <section className="space-y-4">
        <div className="border-b border-stone-800 pb-2">
          <h2 className="font-display text-xl font-semibold text-stone-100">
            Multicollinearity & The Grouping Effect
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Comparing how L1 and L2 handle redundant, highly correlated predictor variables
          </p>
        </div>
        <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/30 text-xs text-stone-300 space-y-2 leading-relaxed">
          <p>
            Consider two features X₁ and X₂ with correlation r = 0.98 (e.g. house area in sq.ft and
            house area in sq.meters):
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-stone-400">
            <li>
              <strong className="text-stone-200">OLS Regression:</strong> Suffers extreme variance;
              one coefficient might be +5,000 while the other is -4,990.
            </li>
            <li>
              <strong className="text-sky-300">Ridge (L2):</strong> Distributes the weight evenly
              between the two predictors, shrinking both coefficients together (e.g. +5.0 and +5.0).
            </li>
            <li>
              <strong className="text-emerald-300">Lasso (L1):</strong> Arbitrarily picks one
              feature and forces the other to 0.0 based on tiny random fluctuations in the training
              sample.
            </li>
            <li>
              <strong className="text-purple-300">Elastic Net:</strong> Leverages the L2 penalty
              component to group the correlated features together while using the L1 penalty to
              prune out true background noise.
            </li>
          </ul>
        </div>
      </section>

      {/* 7. Production Python & Scikit-Learn Implementation */}
      <section className="space-y-4">
        <div className="border-b border-stone-800 pb-2">
          <h2 className="font-display text-xl font-semibold text-stone-100">
            Production Python & Scikit-Learn Implementation
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Automated hyperparameter tuning with RidgeCV, LassoCV, and ElasticNetCV
          </p>
        </div>
        <div className="p-4 rounded-lg border border-stone-800 bg-stone-950 font-mono text-xs text-stone-300 overflow-x-auto">
          <pre>{`import numpy as np
from sklearn.linear_model import RidgeCV, LassoCV, ElasticNetCV
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline

# 1. Define hyperparameter alpha search grid across 5 orders of magnitude
alphas = np.logspace(-3, 3, 50)

# 2. Production Ridge Pipeline with 5-Fold Cross-Validation
ridge_pipeline = make_pipeline(
    StandardScaler(),
    RidgeCV(alphas=alphas, cv=5)
)

# 3. Production Lasso Pipeline (Coordinate Descent)
lasso_pipeline = make_pipeline(
    StandardScaler(),
    LassoCV(alphas=alphas, cv=5, max_iter=2000, random_state=42)
)

# 4. Production Elastic Net Pipeline (tunes both alpha and L1 ratio)
elastic_pipeline = make_pipeline(
    StandardScaler(),
    ElasticNetCV(
        l1_ratio=[0.1, 0.5, 0.7, 0.9, 0.99],
        alphas=alphas,
        cv=5,
        max_iter=2000,
        random_state=42
    )
)

# Training:
# ridge_pipeline.fit(X_train, y_train)
# print("Best Ridge alpha:", ridge_pipeline.named_steps['ridgecv'].alpha_)`}</pre>
        </div>
      </section>

      {/* 8. Common Pitfalls & Edge Cases */}
      <section className="space-y-4">
        <div className="border-b border-stone-800 pb-2">
          <h2 className="font-display text-xl font-semibold text-stone-100">
            Common Pitfalls & Edge Cases
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Frequent implementation mistakes encountered in academic exams and industry pipelines
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-lg border border-red-900/30 bg-red-950/10 space-y-2">
            <h4 className="font-semibold text-red-200">Forgetting Feature Standardization</h4>
            <p className="text-stone-400 leading-relaxed">
              Applying Ridge or Lasso without standardizing features causes variables with large
              scales to be penalized less than variables with small scales.
              <span className="font-medium text-stone-200">
                Always wrap models in a StandardScaler pipeline
              </span>{' '}
              to equalize regularization penalties.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-amber-900/30 bg-amber-950/10 space-y-2">
            <h4 className="font-semibold text-amber-200">Regularizing the Intercept (θ₀)</h4>
            <p className="text-stone-400 leading-relaxed">
              If the intercept is regularized, the regression line is artificially pulled toward the
              origin (0, 0). If the true target mean is 1,000, penalizing the intercept will
              severely bias all predictions downward.
            </p>
          </div>
        </div>
      </section>

      {/* 9. Industrial Applications */}
      <section className="space-y-4">
        <div className="border-b border-stone-800 pb-2">
          <h2 className="font-display text-xl font-semibold text-stone-100">
            Industrial Applications & Real-World Use Cases
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Where regularization enables high-dimensional modeling without catastrophic overfitting
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-stone-900/40 rounded border border-stone-800 space-y-1">
            <div className="font-semibold text-stone-200">Genomics & Microarrays</div>
            <p className="text-stone-400">
              With 20,000 gene expression features on only 150 cancer patients (p &gt;&gt; n), Lasso
              isolates the 12 causative biomarkers while zeroing out background noise.
            </p>
          </div>
          <div className="p-3 bg-stone-900/40 rounded border border-stone-800 space-y-1">
            <div className="font-semibold text-stone-200">Quantitative Finance</div>
            <p className="text-stone-400">
              Portfolio risk factor models use Ridge regression to stabilize beta estimates across
              hundreds of collinear macro-economic indicators.
            </p>
          </div>
          <div className="p-3 bg-stone-900/40 rounded border border-stone-800 space-y-1">
            <div className="font-semibold text-stone-200">NLP Text Bag-of-Words</div>
            <p className="text-stone-400">
              Document sentiment regression models with 50,000 vocabulary words use Elastic Net to
              select key expressive n-grams without saturating feature capacity.
            </p>
          </div>
        </div>
      </section>

      {/* 10. Viva Voce & Interview Defense */}
      <section className="space-y-4">
        <div className="border-b border-stone-800 pb-2">
          <h2 className="font-display text-xl font-semibold text-stone-100">
            Viva Voce & Interview Defense (MIT AOE Exam Focus)
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Standard oral examination defense questions on regularized regression
          </p>
        </div>
        <div className="space-y-3 text-sm">
          <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/30 space-y-1.5">
            <h4 className="font-medium text-amber-400">
              Q1: What is the primary difference between L1 (Lasso) and L2 (Ridge) regularization?
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              Ridge (L2) adds a squared penalty Σ θⱼ², shrinking weights smoothly toward zero while
              keeping all features in the model. Lasso (L1) adds an absolute penalty Σ |θⱼ|, which
              drives non-essential weights strictly to zero, producing sparse models and automatic
              feature selection.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/30 space-y-1.5">
            <h4 className="font-medium text-amber-400">
              Q2: How does Ridge regression guarantee that the normal equation matrix inverse always
              exists?
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              The Ridge normal equation is θ = (XᵀX + αmI)⁻¹ Xᵀy. Even if XᵀX is singular
              (determinant zero due to collinear features), adding a positive scalar αm to the
              diagonal ensures all eigenvalues are strictly positive, making the matrix strictly
              invertible.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/30 space-y-1.5">
            <h4 className="font-medium text-amber-400">
              Q3: When should you choose Elastic Net over Lasso?
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              When features exhibit strong pairwise correlations (where Lasso arbitrarily picks one
              and drops the other) or when the number of predictors p exceeds the number of
              observations n (where Lasso can select at most n features).
            </p>
          </div>

          <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/30 space-y-1.5">
            <h4 className="font-medium text-amber-400">
              Q4: What happens to a linear regression model as the regularization parameter α
              approaches infinity (α → ∞)?
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              All regression coefficients θ₁ through θₚ are driven to zero. The model degrades into
              a flat horizontal line predicting only the sample mean intercept θ₀ = ȳ, representing
              maximum bias and zero variance.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/30 space-y-1.5">
            <h4 className="font-medium text-amber-400">
              Q5: How do we choose the optimal value of the hyperparameter α in production?
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              Through K-Fold Cross-Validation across a logarithmic grid of alpha values (e.g. 10⁻³
              to 10³). We select the alpha that minimizes the validation Mean Squared Error on
              held-out folds.
            </p>
          </div>
        </div>
      </section>

      {/* 11. Key Takeaways & Comparison Matrix */}
      <section className="space-y-4">
        <div className="border-b border-stone-800 pb-2">
          <h2 className="font-display text-xl font-semibold text-stone-100">
            Key Takeaways & Comparison Matrix
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Summary comparison of OLS, Ridge, Lasso, and Elastic Net
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-stone-800 rounded font-mono">
            <thead className="bg-stone-900 text-stone-300">
              <tr>
                <th className="p-3 border-b border-stone-800">Model</th>
                <th className="p-3 border-b border-stone-800">Penalty Term</th>
                <th className="p-3 border-b border-stone-800">Sparsity (Zero Weights)</th>
                <th className="p-3 border-b border-stone-800">Solution Type</th>
                <th className="p-3 border-b border-stone-800">Best When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 text-stone-300">
              <tr>
                <td className="p-3 font-semibold text-stone-400">OLS</td>
                <td className="p-3">None</td>
                <td className="p-3 text-red-400">No (Dense)</td>
                <td className="p-3">Analytical Closed-Form</td>
                <td className="p-3">n &gt;&gt; p, no collinearity</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-sky-400">Ridge</td>
                <td className="p-3">L2: Σ θⱼ²</td>
                <td className="p-3 text-amber-400">No (Shrunk)</td>
                <td className="p-3">Analytical Closed-Form</td>
                <td className="p-3">Many small true effects, collinear features</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-emerald-400">Lasso</td>
                <td className="p-3">L1: Σ |θⱼ|</td>
                <td className="p-3 text-emerald-400">Yes (Exact Zeros)</td>
                <td className="p-3">Coordinate Descent</td>
                <td className="p-3">Few dominant features, feature selection needed</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-purple-400">Elastic Net</td>
                <td className="p-3">L1 + L2</td>
                <td className="p-3 text-emerald-400">Yes (Exact Zeros)</td>
                <td className="p-3">Coordinate Descent</td>
                <td className="p-3">p &gt; n, correlated feature groups</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 12. Knowledge Check Micro-Quiz */}
      <section className="space-y-4">
        <div className="border-b border-stone-800 pb-2">
          <h2 className="font-display text-xl font-semibold text-stone-100">
            Knowledge Check Quiz
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Test your comprehension of regularization mathematics and geometry
          </p>
        </div>
        <Quiz conceptId="u3-self-regularization" items={quizItems} unitAccent={3} />
      </section>

      {/* 13. Next Step Navigation */}
      <section className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-stone-800">
        <div>
          <span className="text-xs font-mono text-stone-500 uppercase tracking-wider">
            Previous Case Study
          </span>
          <div className="mt-1">
            <Link
              to="/case-studies/healthcare-regression"
              className="text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
            >
              ← Case Study: Healthcare Medical Cost Regression
            </Link>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono text-stone-500 uppercase tracking-wider">
            Next: Further Reading
          </span>
          <div className="mt-1">
            <Link
              to="/learn/unit-3/kfold-cross-validation"
              className="text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
            >
              K-Fold Cross-Validation & Resampling →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
