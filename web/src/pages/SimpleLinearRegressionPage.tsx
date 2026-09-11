import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Quiz } from '@/features/quiz/Quiz';
import { SimpleLinearRegressionLab } from '@/labs/linear-regression/SimpleLinearRegressionLab';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calculator,
  Code2,
  AlertOctagon,
  HelpCircle,
} from 'lucide-react';

export function SimpleLinearRegressionPage() {
  const [showDerivation, setShowDerivation] = useState<boolean>(false);

  const quizItems = [
    {
      id: 'slr-q1',
      question:
        'Why does the Ordinary Least Squares (OLS) cost function J(theta0, theta1) square the residual differences (y - y_hat)^2 instead of taking simple unweighted differences (y - y_hat)?',
      options: [
        {
          id: 'A',
          text: 'Squaring ensures that positive and negative errors do not cancel out algebraically, and it penalizes larger outlier errors quadratically.',
          isCorrect: true,
          explanation:
            'If we used unweighted differences, a positive error of +50 and a negative error of -50 would sum to zero, misleadingly suggesting a perfect fit. Squaring guarantees non-negativity, penalizes large mistakes heavily, and yields a smooth, convex differentiable paraboloid.',
        },
        {
          id: 'B',
          text: 'Because negative numbers cannot be represented in binary computer memory.',
          isCorrect: false,
          explanation: 'Computers easily handle signed negative numbers via two complement.',
        },
        {
          id: 'C',
          text: 'Squaring allows the regression line to bend into a non-linear polynomial curve.',
          isCorrect: false,
          explanation:
            'Simple linear regression produces a strictly straight line; the squaring is in the loss function, not the model hypothesis.',
        },
      ],
    },
    {
      id: 'slr-q2',
      question:
        'What does an R-squared value of 0.85 mathematically indicate about a linear regression model?',
      options: [
        {
          id: 'A',
          text: '85% of the total variance in the dependent variable y is explained by the linear relationship with feature x.',
          isCorrect: true,
          explanation:
            'R^2 = 1 - (SS_res / SS_tot). It quantifies the proportion of total variance in y that is successfully captured and predicted by the regression line relative to a baseline mean predictor.',
        },
        {
          id: 'B',
          text: 'The model will make accurate predictions exactly 85 out of 100 times in production.',
          isCorrect: false,
          explanation:
            'R^2 is a variance proportion metric, not a discrete classification accuracy percentage.',
        },
        {
          id: 'C',
          text: 'The slope theta_1 of the regression line is exactly 0.85.',
          isCorrect: false,
          explanation:
            'Slope theta_1 and goodness of fit R^2 are completely distinct mathematical quantities.',
        },
      ],
    },
    {
      id: 'slr-q3',
      question: 'Can the coefficient of determination R-squared ever evaluate to a negative value?',
      options: [
        {
          id: 'A',
          text: 'Yes: when evaluating on test data or when using an arbitrarily chosen line that performs worse than the simple horizontal sample mean baseline.',
          isCorrect: true,
          explanation:
            'Because R^2 = 1 - (SS_res / SS_tot), if the sum of squared residuals SS_res exceeds the total variance SS_tot (which happens when a line fits worse than predicting y_mean for all points), R^2 drops below zero.',
        },
        {
          id: 'B',
          text: 'No: because squaring any number in the numerator always produces a non-negative result.',
          isCorrect: false,
          explanation:
            'While SS_res and SS_tot are non-negative, the ratio SS_res / SS_tot can exceed 1, making 1 - ratio negative.',
        },
        {
          id: 'C',
          text: 'Only if the learning rate alpha is set to zero.',
          isCorrect: false,
          explanation:
            'OLS closed-form calculation does not involve a learning rate hyperparameter.',
        },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-12">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link
          to="/learn/unit-3"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-stone-400 hover:text-stone-200 transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Unit 3 Directory
        </Link>
        <span className="text-stone-700">/</span>
        <span className="text-xs font-mono text-stone-300">
          Simple Linear Regression &amp; Cost Function
        </span>
      </div>

      {/* Hero Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="border-stone-800 text-stone-300">
            Unit 3: ML Fundamentals
          </Badge>
          <Badge variant="default" className="bg-stone-800 text-stone-200">
            1.5 Lecture Hours
          </Badge>
          <Badge variant="unit" className="border-amber-500/30 text-amber-300">
            CO2, CO3
          </Badge>
        </div>
        <h1 className="font-montserrat text-3xl sm:text-4xl font-bold tracking-tight text-stone-100">
          Simple Linear Regression &amp; The Mean Squared Error Cost Function
        </h1>
        <p className="text-base text-stone-300 leading-relaxed max-w-3xl font-sans">
          Linear regression is the foundational baseline of all statistical learning. It models the
          relationship between a continuous scalar input feature and an output target by finding a
          line that{' '}
          <span className="text-amber-100 font-medium">
            minimizes the sum of squared vertical residuals
          </span>
          .
        </p>
      </div>

      {/* Section 1: Intuition */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100">
          1. Intuition: Finding the Best Line Through a Cloud of Points
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed text-sm text-stone-300">
          <div className="p-5 rounded-xl border border-stone-800 bg-stone-900/40 space-y-3">
            <h3 className="font-montserrat text-base font-semibold text-stone-100">
              The Physical Balancing Rod Analogy
            </h3>
            <p>
              Imagine each data point on a 2D scatter plot is a fixed steel peg. You lay a rigid
              wooden ruler across the pegs and attach a vertical spring from each peg to the ruler.
            </p>
            <p>
              The spring tension pulls on the ruler with force proportional to the vertical
              distance. The position where the ruler naturally settles into static equilibrium is
              the exact{' '}
              <span className="text-amber-100 font-medium">Ordinary Least Squares line</span>.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-stone-800 bg-stone-900/40 space-y-3">
            <h3 className="font-montserrat text-base font-semibold text-stone-100">
              Why Vertical Errors Instead of Perpendicular Distances?
            </h3>
            <p>
              In supervised learning, the input feature{' '}
              <span className="font-mono text-stone-200">x</span> is treated as an error-free
              independent variable (e.g. Years of Experience).
            </p>
            <p>
              Our goal is specifically predicting the target{' '}
              <span className="font-mono text-amber-200/90">y</span> (Salary). Therefore, error is
              only measured along the vertical y-axis: the discrepancy between actual outcome and
              predicted value.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Interactive Lab */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100">
          2. Interactive Lab: Parameter Tuning &amp; Residual Visualization
        </h2>
        <p className="text-sm text-stone-300 leading-relaxed font-sans">
          Use the interactive sliders below to manually align the regression line with the MIT AOE
          Salary dataset. Toggle the squared error boxes to inspect how large errors expand
          geometrically.
        </p>
        <SimpleLinearRegressionLab />
      </section>

      {/* Section 3: Mathematical Formalism */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100">
          3. Mathematical Formulation of Ordinary Least Squares
        </h2>
        <Card className="p-6 border-stone-800 bg-stone-900/40 space-y-5">
          <div className="space-y-3">
            <h3 className="font-montserrat text-base font-bold text-stone-200 flex items-center gap-2">
              <Calculator className="size-4 text-amber-400" />
              Hypothesis &amp; Cost Function
            </h3>
            <p className="text-sm text-stone-300 leading-relaxed font-sans">
              For a single predictor feature <span className="font-mono text-stone-200">x</span>,
              the linear hypothesis is parameterized by intercept{' '}
              <span className="font-mono text-stone-200">
                &theta;<sub>0</sub>
              </span>{' '}
              and slope{' '}
              <span className="font-mono text-stone-200">
                &theta;<sub>1</sub>
              </span>
              :
            </p>
            <div className="p-3 rounded-lg bg-stone-950 border border-stone-800 font-mono text-xs text-amber-200/90 text-center">
              h<sub>&theta;</sub>(x) = &theta;<sub>0</sub> + &theta;<sub>1</sub> &times; x
            </div>

            <p className="text-sm text-stone-300 leading-relaxed font-sans">
              The Mean Squared Error (MSE) cost function measures the average squared discrepancy
              across all <span className="font-mono text-stone-200">m</span> training instances:
            </p>
            <div className="p-3 rounded-lg bg-stone-950 border border-stone-800 font-mono text-xs text-stone-200 text-center">
              J(&theta;<sub>0</sub>, &theta;<sub>1</sub>) = (1 / 2m) &times; &sum;<sub>i=1</sub>
              <sup>m</sup> (h<sub>&theta;</sub>(x<sup>(i)</sup>) - y<sup>(i)</sup>)<sup>2</sup>
            </div>
            <p className="text-xs text-stone-400 font-sans">
              Note: The factor of 1/2 is an algebraic convenience that cancels the exponent 2 during
              partial differentiation.
            </p>
          </div>

          {/* Derivation toggle */}
          <div className="pt-2 border-t border-stone-800/80">
            <button
              onClick={() => setShowDerivation(!showDerivation)}
              className="text-xs font-mono text-amber-300 hover:text-amber-200 underline decoration-dotted flex items-center gap-1.5"
            >
              {showDerivation
                ? 'Hide Analytical OLS Derivation'
                : 'Show Full Calculus Derivation of Closed-Form OLS'}
            </button>

            {showDerivation && (
              <div className="mt-4 p-4 rounded-xl border border-stone-800 bg-stone-950 space-y-3 text-xs text-stone-300 font-mono leading-relaxed">
                <p className="text-stone-400">
                  Step 1: Compute partial derivatives of J with respect to &theta;<sub>0</sub> and
                  &theta;<sub>1</sub>:
                </p>
                <div className="p-2 rounded bg-stone-900 text-amber-200/90">
                  &part;J / &part;&theta;<sub>0</sub> = (1/m) &sum; ( (&theta;<sub>0</sub> + &theta;
                  <sub>1</sub> x<sup>(i)</sup>) - y<sup>(i)</sup> ) = 0
                </div>
                <div className="p-2 rounded bg-stone-900 text-amber-200/90">
                  &part;J / &part;&theta;<sub>1</sub> = (1/m) &sum; ( (&theta;<sub>0</sub> + &theta;
                  <sub>1</sub> x<sup>(i)</sup>) - y<sup>(i)</sup> ) &times; x<sup>(i)</sup> = 0
                </div>

                <p className="text-stone-400">
                  Step 2: From &part;J/&part;&theta;<sub>0</sub> = 0, divide by m:
                </p>
                <div className="p-2 rounded bg-stone-900 text-stone-200">
                  &theta;<sub>0</sub> + &theta;<sub>1</sub> x̄ - ȳ = 0 =&gt; &theta;<sub>0</sub> = ȳ
                  - &theta;<sub>1</sub> x̄
                </div>

                <p className="text-stone-400">
                  Step 3: Substitute &theta;<sub>0</sub> into the &part;J/&part;&theta;<sub>1</sub>{' '}
                  equation and solve for &theta;<sub>1</sub>:
                </p>
                <div className="p-2 rounded bg-stone-900 text-emerald-300">
                  &theta;<sub>1</sub> = &sum; (x<sup>(i)</sup> - x̄)(y<sup>(i)</sup> - ȳ) / &sum; (x
                  <sup>(i)</sup> - x̄)<sup>2</sup> = Cov(x, y) / Var(x)
                </div>
                <p className="text-stone-400 font-sans text-xs">
                  This guarantees the unique global minimum because the Hessian matrix of J is
                  strictly positive definite.
                </p>
              </div>
            )}
          </div>
        </Card>
      </section>

      {/* Section 4: The 4 Assumptions */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100">
          4. The 4 Fundamental Assumptions of Classical Linear Regression
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/40 space-y-2">
            <Badge variant="outline" className="border-blue-400 text-blue-300 font-mono text-xs">
              L - Linearity
            </Badge>
            <p className="text-xs text-stone-300 font-sans leading-relaxed">
              The relationship between the independent predictor X and the conditional mean of Y is
              strictly linear in parameters.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/40 space-y-2">
            <Badge
              variant="outline"
              className="border-emerald-400 text-emerald-300 font-mono text-xs"
            >
              I - Independence
            </Badge>
            <p className="text-xs text-stone-300 font-sans leading-relaxed">
              Residual errors are uncorrelated across observations (no serial autocorrelation in
              time-series sequences).
            </p>
          </div>

          <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/40 space-y-2">
            <Badge variant="outline" className="border-amber-400 text-amber-300 font-mono text-xs">
              N - Normality
            </Badge>
            <p className="text-xs text-stone-300 font-sans leading-relaxed">
              Residual errors are normally distributed around zero with constant variance
              &sigma;&sup2;: &epsilon; ~ N(0, &sigma;&sup2;).
            </p>
          </div>

          <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/40 space-y-2">
            <Badge
              variant="outline"
              className="border-purple-400 text-purple-300 font-mono text-xs"
            >
              E - Equal Variance
            </Badge>
            <p className="text-xs text-stone-300 font-sans leading-relaxed">
              Homoscedasticity: The spread of error residuals remains constant across all values of
              feature X.
            </p>
          </div>
        </div>
      </section>

      {/* Section 5: Evaluation Metrics */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100">
          5. Model Evaluation Metrics: MSE, RMSE, MAE, and R&sup2;
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/40 space-y-2">
            <h4 className="font-montserrat text-sm font-bold text-stone-200">
              Mean Squared Error (MSE) &amp; Root MSE (RMSE)
            </h4>
            <div className="p-2 rounded bg-stone-950 font-mono text-xs text-stone-300">
              MSE = (1/m) &sum; (y - ŷ)&sup2; | RMSE = &radic;MSE
            </div>
            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              MSE penalizes large outlier blunders severely due to squaring. RMSE restores the error
              metric to the original physical units of the dependent variable (e.g. dollars or
              marks).
            </p>
          </div>

          <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/40 space-y-2">
            <h4 className="font-montserrat text-sm font-bold text-stone-200">
              Coefficient of Determination (R&sup2;)
            </h4>
            <div className="p-2 rounded bg-stone-950 font-mono text-xs text-stone-300">
              R&sup2; = 1 - (SS_res / SS_tot) = 1 - &sum;(y - ŷ)&sup2; / &sum;(y - ȳ)&sup2;
            </div>
            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              R&sup2; measures proportion of variance explained. An R&sup2; of 1.0 is perfect
              prediction. An R&sup2; of 0 means the model performs no better than simply guessing
              the mean ȳ. Negative R&sup2; indicates worse performance than the horizontal mean
              line.
            </p>
          </div>
        </div>
      </section>

      {/* Section 6: Python Code */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100 flex items-center gap-2">
          <Code2 className="size-5 text-amber-400" />
          6. Python Reference Implementation: Pure NumPy vs Scikit-Learn
        </h2>
        <div className="p-4 rounded-xl border border-stone-800 bg-stone-950 font-mono text-xs text-stone-300 overflow-x-auto leading-relaxed">
          <pre>{`import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

# 1. Dataset: Years of Experience (X) and Salary in $k (y)
x = np.array([1.1, 1.3, 1.5, 2.0, 2.2, 2.9, 3.0, 3.2, 4.0, 5.1, 6.8, 8.7, 10.3])
y = np.array([39.3, 46.2, 37.7, 43.5, 39.9, 56.6, 60.1, 54.5, 55.8, 66.0, 91.7, 109.4, 122.4])

# 2. Pure NumPy Analytical OLS Closed-Form Calculation
x_mean = np.mean(x)
y_mean = np.mean(y)

theta_1 = np.sum((x - x_mean) * (y - y_mean)) / np.sum((x - x_mean) ** 2)
theta_0 = y_mean - theta_1 * x_mean

print(f"NumPy Analytical: Slope = {theta_1:.4f}, Intercept = {theta_0:.4f}")

# 3. Scikit-Learn Production Fit
X_reshaped = x.reshape(-1, 1)
model = LinearRegression().fit(X_reshaped, y)
y_pred = model.predict(X_reshaped)

print(f"Sklearn Fit:      Slope = {model.coef_[0]:.4f}, Intercept = {model.intercept_:.4f}")
print(f"R-squared:        {r2_score(y, y_pred):.4f}")
print(f"RMSE ($k):        {np.sqrt(mean_squared_error(y, y_pred)):.4f}")`}</pre>
        </div>
      </section>

      {/* Section 7: "Make It Fail" */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100 flex items-center gap-2">
          <AlertOctagon className="size-5 text-rose-400" />
          7. &quot;Make It Fail&quot;: Outlier Leverage &amp; Heteroscedasticity
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed text-sm text-stone-300">
          <div className="p-5 rounded-xl border border-rose-500/30 bg-rose-950/20 space-y-3">
            <h3 className="font-montserrat text-base font-semibold text-rose-300">
              High-Leverage Outliers Can Tilt the Entire Line
            </h3>
            <p>
              Because OLS squares the error terms, an extreme outlier far along the x-axis has
              quadratic torque on the slope &theta;<sub>1</sub>.
            </p>
            <p className="text-xs text-stone-400">
              A single corrupted data point (e.g. 10 years experience earning $1,000,000 due to a
              clerical typo) will drastically drag the entire line upward, destroying predictions
              for all valid points. Solution: Use robust regression (Huber Loss or RANSAC).
            </p>
          </div>

          <div className="p-5 rounded-xl border border-rose-500/30 bg-rose-950/20 space-y-3">
            <h3 className="font-montserrat text-base font-semibold text-rose-300">
              Heteroscedasticity: The Expanding Funnel
            </h3>
            <p>
              When variance of residuals increases as X grows (e.g., higher income individuals have
              much wider discretionary spending variation), the assumption of constant error
              variance is violated.
            </p>
            <p className="text-xs text-stone-400">
              OLS parameter estimates remain unbiased, but standard errors and statistical
              confidence intervals become completely untrustworthy. Solution: Apply log
              transformations or Weighted Least Squares (WLS).
            </p>
          </div>
        </div>
      </section>

      {/* Section 8: MIT AOE Syllabus Alignment */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100">
          8. MIT AOE Syllabus Alignment &amp; Examination Focus
        </h2>
        <Card className="p-6 border-stone-800 bg-stone-900/40 space-y-4">
          <p className="text-sm text-stone-300 leading-relaxed font-sans">
            In the MIT Academy of Engineering B.Tech curriculum (Course 2304322T Unit III), this
            topic is tested through both theoretical derivations and numerical problem solving (6 to
            8 marks):
          </p>
          <div className="p-4 rounded-xl border border-stone-800 bg-stone-950/70 space-y-2 text-xs">
            <span className="font-mono text-amber-400 font-semibold">
              Typical Exam Numerical Problem:
            </span>
            <p className="text-stone-300 italic">
              &quot;Given 5 data points (x, y): (1, 2), (2, 3), (3, 5), (4, 4), (5, 6). Calculate
              the linear regression line parameters &theta;<sub>0</sub> and &theta;<sub>1</sub>{' '}
              using Ordinary Least Squares. Predict the value of y when x = 6.&quot;
            </p>
            <div className="pt-2 text-stone-400 space-y-1">
              <p>&bull; Step 1: Calculate x̄ = 3.0, ȳ = 4.0</p>
              <p>
                &bull; Step 2: &sum; (x - x̄)(y - ȳ) = 9.0; &sum; (x - x̄)&sup2; = 10.0 =&gt; &theta;
                <sub>1</sub> = 0.90
              </p>
              <p>
                &bull; Step 3: &theta;<sub>0</sub> = 4.0 - (0.90 &times; 3.0) = 1.30
              </p>
              <p>&bull; Step 4: For x = 6 =&gt; ŷ = 1.30 + 0.90(6) = 6.70</p>
            </div>
          </div>
        </Card>
      </section>

      {/* Section 9: Viva Voce Corner */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100 flex items-center gap-2">
          <HelpCircle className="size-5 text-amber-400" />
          9. Viva Voce Q&amp;A Corner
        </h2>
        <div className="space-y-3">
          <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/40 space-y-1.5">
            <h4 className="font-montserrat text-sm font-semibold text-stone-200">
              Q1: Does a high R&sup2; value prove that feature X causes target Y?
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              <strong>Answer:</strong> Absolutely not. Correlation does not imply causation. A high
              R&sup2; merely indicates linear association. For example, ice cream sales and shark
              attacks have a high R&sup2; correlation because both increase during hot summer months
              (a confounding variable), not because eating ice cream causes shark attacks.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/40 space-y-1.5">
            <h4 className="font-montserrat text-sm font-semibold text-stone-200">
              Q2: Under what condition does the Ordinary Least Squares line pass through the point
              (x̄, ȳ)?
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              <strong>Answer:</strong> Under all conditions. Because &theta;<sub>0</sub> = ȳ -
              &theta;<sub>1</sub> x̄, substituting x = x̄ yields ŷ = (ȳ - &theta;<sub>1</sub> x̄) +
              &theta;<sub>1</sub> x̄ = ȳ. Thus, every OLS regression line with an intercept term is
              mathematically guaranteed to pass directly through the centroid (x̄, ȳ) of the dataset.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/40 space-y-1.5">
            <h4 className="font-montserrat text-sm font-semibold text-stone-200">
              Q3: When should you prefer Gradient Descent over the analytical OLS formula?
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              <strong>Answer:</strong> Analytical OLS matrix inversion requires computing (X
              <sup>T</sup>X)<sup>-1</sup>, which scales with O(n&sup3;) where n is feature
              dimension. When n exceeds 10,000 features or when data arrives in streaming batches
              that do not fit in RAM, Gradient Descent is vastly superior computationally.
            </p>
          </div>
        </div>
      </section>

      {/* Section 10: Knowledge Check */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100">
          10. Knowledge Check
        </h2>
        <Quiz conceptId="u3-simple-linear-regression" items={quizItems} unitAccent={3} />
      </section>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between border-t border-stone-800 pt-6">
        <Link
          to="/learn/unit-3/ml-paradigms"
          className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-stone-200 font-mono transition-colors"
        >
          <ArrowLeft className="size-4" />
          Previous: ML Paradigms
        </Link>
        <Link
          to="/learn/unit-3/gradient-descent"
          className="inline-flex items-center gap-2 text-sm bg-stone-100 text-stone-950 hover:bg-stone-200 font-semibold px-4 py-2 rounded-lg rounded-br-none transition-colors"
        >
          Next: Gradient Descent Optimization
          <ArrowRight className="size-4" />
        </Link>
      </div>

      {/* Academic References */}
      <div className="p-4 rounded-xl border border-stone-800/60 bg-stone-900/20 text-xs text-stone-500 space-y-1 font-mono">
        <div className="flex items-center gap-1.5 text-stone-400 font-semibold">
          <BookOpen className="size-3.5" />
          Academic References
        </div>
        <p>
          1. Montgomery, Douglas C., Elizabeth A. Peck, and G. Geoffrey Vining.{' '}
          <em>Introduction to Linear Regression Analysis</em>. John Wiley &amp; Sons, 2021.
        </p>
        <p>
          2. James, Gareth, et al.{' '}
          <em>An Introduction to Statistical Learning: with Applications in Python</em>. Springer,
          2023. Chapter 3.
        </p>
      </div>
    </div>
  );
}
