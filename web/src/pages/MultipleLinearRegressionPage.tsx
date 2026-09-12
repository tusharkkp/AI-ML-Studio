import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Quiz } from '@/features/quiz/Quiz';
import { MultipleLinearRegressionLab } from '@/labs/multiple-regression/MultipleLinearRegressionLab';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Layers,
  ShieldAlert,
  Code2,
  HelpCircle,
} from 'lucide-react';

export function MultipleLinearRegressionPage() {
  const [showDerivation, setShowDerivation] = useState<boolean>(false);

  const quizItems = [
    {
      id: 'mlr-q1',
      question:
        'In the Normal Equation theta = (X^T * X)^(-1) * X^T * y, under what mathematical condition is the matrix (X^T * X) non-invertible (singular)?',
      options: [
        {
          id: 'A',
          text: 'When features exhibit perfect multicollinearity (redundant linear dependence among features) or when the number of features d exceeds the number of training samples m (d > m).',
          isCorrect: true,
          explanation:
            'If one feature is an exact linear combination of another, the columns of X are linearly dependent, making det(X^T * X) = 0. Similarly, if d > m, the rank of X is at most m, so the (d+1)x(d+1) matrix X^T * X cannot have full rank.',
        },
        {
          id: 'B',
          text: 'Only when all feature values are strictly positive real numbers.',
          isCorrect: false,
          explanation:
            'Positive values do not cause singularity; linear dependence causes singularity.',
        },
        {
          id: 'C',
          text: 'Whenever the learning rate alpha is chosen too large.',
          isCorrect: false,
          explanation:
            'The Normal Equation is an analytical closed-form solution with zero learning rate parameter.',
        },
      ],
    },
    {
      id: 'mlr-q2',
      question:
        'Why does standard R-squared always increase (or stay constant) when adding new predictor features, even if the new features are pure random noise?',
      options: [
        {
          id: 'A',
          text: 'Adding any feature provides the OLS optimization additional degrees of freedom to fit accidental sample noise in training data, mechanically decreasing the sum of squared residuals.',
          isCorrect: true,
          explanation:
            'Because least squares minimization is unrestricted, additional parameters can never worsen the in-sample fit. To detect whether new features genuinely improve generalization, engineers use Adjusted R^2, which penalizes extra parameters.',
        },
        {
          id: 'B',
          text: 'Because computers round small matrix determinants up to 1.0.',
          isCorrect: false,
          explanation:
            'This is an algebraic property of least squares objective functions, not a rounding error.',
        },
        {
          id: 'C',
          text: 'Because gradient descent automatically prunes noise features.',
          isCorrect: false,
          explanation: 'Standard gradient descent fits all features without L1 lasso sparsity.',
        },
      ],
    },
    {
      id: 'mlr-q3',
      question:
        'When dealing with a massive dataset containing 50,000 features and 1,000,000 rows, which method should you choose to fit a linear regression model?',
      options: [
        {
          id: 'A',
          text: 'Gradient Descent, because inverting a 50,000 x 50,000 matrix via Normal Equation requires O(d^3) operations, which is computationally prohibitive.',
          isCorrect: true,
          explanation:
            'Inverting a matrix with d = 50,000 takes on the order of 50,000^3 = 1.25 x 10^14 floating-point operations and gigabytes of memory. Gradient Descent scales gracefully with O(k * m * d).',
        },
        {
          id: 'B',
          text: 'The Normal Equation, because matrix inversion is always instantaneous on GPU.',
          isCorrect: false,
          explanation:
            'O(d^3) complexity on 50,000 features exhausts GPU memory and requires hours of compute.',
        },
        {
          id: 'C',
          text: 'Neither method can be used for datasets with more than 10 features.',
          isCorrect: false,
          explanation: 'Both methods routinely handle large multi-feature datasets.',
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
          Multiple Linear Regression &amp; Normal Equation
        </span>
      </div>

      {/* Hero Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="border-stone-800 text-stone-300">
            Unit 3: ML Fundamentals
          </Badge>
          <Badge variant="default" className="bg-stone-800 text-stone-200">
            1.2 Lecture Hours
          </Badge>
          <Badge variant="unit" className="border-amber-500/30 text-amber-300">
            CO2, CO3
          </Badge>
        </div>
        <h1 className="font-montserrat text-3xl sm:text-4xl font-bold tracking-tight text-stone-100">
          Multiple Linear Regression &amp; The Matrix Normal Equation
        </h1>
        <p className="text-base text-stone-300 leading-relaxed max-w-3xl font-sans">
          Real-world engineering outcomes depend on dozens of interacting variables. Multiple linear
          regression models a target as a linear combination of multiple feature dimensions, fitting
          a <span className="text-amber-100 font-medium">multidimensional hyperplane</span> directly
          through vector matrix algebra.
        </p>
      </div>

      {/* Section 1: Intuition */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100">
          1. Intuition: From a 2D Line to an N-Dimensional Hyperplane
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed text-sm text-stone-300">
          <div className="p-5 rounded-xl border border-stone-800 bg-stone-900/40 space-y-3">
            <h3 className="font-montserrat text-base font-semibold text-stone-100 flex items-center gap-2">
              <Layers className="size-4 text-amber-400" />
              Geometric Transition
            </h3>
            <p>
              In simple linear regression with 1 feature, the model is a straight line drawn across
              a 2D sheet of paper.
            </p>
            <p>
              With 2 features (e.g. House Area and Number of Bedrooms), the model becomes a flat,
              rigid 2D sheet (a plane) floating inside a 3D room. With 10 features, it becomes a
              10-dimensional hyperplane spanning an 11-dimensional vector space.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-stone-800 bg-stone-900/40 space-y-3">
            <h3 className="font-montserrat text-base font-semibold text-stone-100">
              Interpreting Partial Regression Coefficients
            </h3>
            <p>
              Each coefficient{' '}
              <span className="font-mono text-stone-200">
                &theta;<sub>j</sub>
              </span>{' '}
              represents the expected change in target{' '}
              <span className="font-mono text-amber-200/90">y</span> when feature{' '}
              <span className="font-mono text-stone-200">
                x<sub>j</sub>
              </span>{' '}
              increases by 1 unit,{' '}
              <span className="text-amber-100 font-medium">
                holding all other features strictly constant
              </span>{' '}
              (ceteris paribus).
            </p>
            <p>
              This isolated attribution makes linear regression one of the most transparent,
              interpretable models in production engineering.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Interactive Lab */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100">
          2. Interactive Lab: 3D Hyperplane Fitting &amp; Singularity Explorer
        </h2>
        <p className="text-sm text-stone-300 leading-relaxed font-sans">
          Rotate the 3D perspective to observe how the regression plane slices through data points.
          Toggle the collinearity trigger to experience what happens when the design matrix becomes
          singular.
        </p>
        <MultipleLinearRegressionLab />
      </section>

      {/* Section 3: Mathematical Formalism */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100">
          3. Matrix Formulation &amp; Normal Equation Derivation
        </h2>
        <Card className="p-6 border-stone-800 bg-stone-900/40 space-y-5">
          <p className="text-sm text-stone-300 leading-relaxed font-sans">
            Let the design matrix{' '}
            <span className="font-mono text-stone-200">
              X &isin; &reals;<sup>m &times; (d+1)</sup>
            </span>{' '}
            contain a leading column of ones representing intercept &theta;<sub>0</sub>, and let{' '}
            <span className="font-mono text-stone-200">
              y &isin; &reals;<sup>m</sup>
            </span>{' '}
            be the target vector:
          </p>
          <div className="p-3 rounded-lg bg-stone-950 border border-stone-800 font-mono text-xs text-stone-300 text-center">
            ŷ = X &times; &theta; = &theta;<sub>0</sub> + &theta;<sub>1</sub>x<sub>1</sub> + ... +
            &theta;<sub>d</sub>x<sub>d</sub>
          </div>

          <p className="text-sm text-stone-300 leading-relaxed font-sans">
            In compact vector notation, the Mean Squared Error cost function is:
          </p>
          <div className="p-3 rounded-lg bg-stone-950 border border-stone-800 font-mono text-xs text-amber-200/90 text-center">
            J(&theta;) = (1 / 2m) &times; (X&theta; - y)<sup>T</sup> (X&theta; - y)
          </div>

          {/* Derivation toggle */}
          <div className="pt-2 border-t border-stone-800/80">
            <button
              onClick={() => setShowDerivation(!showDerivation)}
              className="text-xs font-mono text-amber-300 hover:text-amber-200 underline decoration-dotted flex items-center gap-1.5"
            >
              {showDerivation
                ? 'Hide Matrix Calculus Derivation'
                : 'Show Full Matrix Calculus Derivation of the Normal Equation'}
            </button>

            {showDerivation && (
              <div className="mt-4 p-4 rounded-xl border border-stone-800 bg-stone-950 space-y-3 text-xs text-stone-300 font-mono leading-relaxed">
                <p className="text-stone-400">Step 1: Expand the quadratic matrix product:</p>
                <div className="p-2 rounded bg-stone-900 text-stone-200">
                  (X&theta; - y)<sup>T</sup>(X&theta; - y) = &theta;<sup>T</sup>X<sup>T</sup>
                  X&theta; - 2 y<sup>T</sup>X&theta; + y<sup>T</sup>y
                </div>

                <p className="text-stone-400">
                  Step 2: Take vector gradient &nabla;<sub>&theta;</sub> using matrix derivative
                  identities:
                </p>
                <div className="p-2 rounded bg-stone-900 text-amber-200/90">
                  &nabla;<sub>&theta;</sub> J(&theta;) = (1/m) [ X<sup>T</sup>X&theta; - X
                  <sup>T</sup>y ]
                </div>

                <p className="text-stone-400">
                  Step 3: Set gradient to zero vector and solve for &theta;:
                </p>
                <div className="p-2 rounded bg-stone-900 text-emerald-300 font-bold">
                  X<sup>T</sup>X &theta; = X<sup>T</sup>y =&gt; &theta; = (X<sup>T</sup>X)
                  <sup>-1</sup> X<sup>T</sup>y
                </div>
                <p className="text-stone-400 font-sans text-xs">
                  This single matrix equation computes all d+1 optimal parameters in one closed-form
                  operation without iterations or learning rate tuning.
                </p>
              </div>
            )}
          </div>
        </Card>
      </section>

      {/* Section 4: Normal Equation vs Gradient Descent */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100">
          4. Algorithmic Trade-Off: Normal Equation vs Gradient Descent
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-800 bg-stone-900/70 text-stone-300 font-mono">
                <th className="p-3">Criterion</th>
                <th className="p-3 text-emerald-400">Normal Equation</th>
                <th className="p-3 text-cyan-400">Gradient Descent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 text-stone-300 font-sans">
              <tr>
                <td className="p-3 font-mono text-stone-400">Hyperparameters</td>
                <td className="p-3">None (zero tuning required)</td>
                <td className="p-3">Requires choosing learning rate &alpha;</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-stone-400">Feature Scaling</td>
                <td className="p-3">Not necessary (exact algebraic solution)</td>
                <td className="p-3">Mandatory (otherwise ravines cause oscillation)</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-stone-400">Time Complexity</td>
                <td className="p-3 font-mono text-rose-300">O(d&sup3;) due to matrix inversion</td>
                <td className="p-3 font-mono text-emerald-400">
                  O(k &times; m &times; d) per iteration
                </td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-stone-400">Optimal Use Case</td>
                <td className="p-3">Small to medium features (d &le; 10,000)</td>
                <td className="p-3">Massive feature dimensions (d &gt; 10,000)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 5: Multicollinearity & Adjusted R2 */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100">
          5. Pitfalls: Multicollinearity &amp; The Adjusted R&sup2; Penalty
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed text-sm text-stone-300">
          <div className="p-5 rounded-xl border border-rose-500/30 bg-rose-950/20 space-y-3">
            <h3 className="font-montserrat text-base font-semibold text-rose-300 flex items-center gap-2">
              <ShieldAlert className="size-4" />
              Multicollinearity &amp; Singular Matrices
            </h3>
            <p>
              When two or more features are highly correlated (e.g., House Area in sq ft and House
              Area in sq meters), the columns of design matrix X are linearly dependent.
            </p>
            <p className="text-xs text-stone-400">
              The Gram matrix X<sup>T</sup>X becomes singular (det &approx; 0), causing its inverse
              to blow up with wild, unstable coefficients. Solution: Compute Variance Inflation
              Factor (VIF), prune collinear columns, or use L2 Ridge regularization (&lambda;I).
            </p>
          </div>

          <div className="p-5 rounded-xl border border-amber-500/30 bg-stone-900/40 space-y-3">
            <h3 className="font-montserrat text-base font-semibold text-stone-200">
              Why Raw R&sup2; Lies: Enter Adjusted R&sup2;
            </h3>
            <p>
              In multiple regression, adding any arbitrary variable (even lottery numbers or shoe
              size) mechanically increases raw R&sup2; by fitting spurious sample noise.
            </p>
            <div className="p-2 rounded bg-stone-950 font-mono text-xs text-amber-200/90">
              R̄&sup2; = 1 - (1 - R&sup2;) &times; [(m - 1) / (m - d - 1)]
            </div>
            <p className="text-xs text-stone-400">
              Adjusted R&sup2; penalizes each additional feature parameter d unless that feature
              reduces residual sum of squares more than expected by random chance alone.
            </p>
          </div>
        </div>
      </section>

      {/* Section 6: Python Code */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100 flex items-center gap-2">
          <Code2 className="size-5 text-amber-400" />
          6. Python Reference Implementation: NumPy vs Scikit-Learn
        </h2>
        <div className="p-4 rounded-xl border border-stone-800 bg-stone-950 font-mono text-xs text-stone-300 overflow-x-auto leading-relaxed">
          <pre>{`import numpy as np
from sklearn.linear_model import LinearRegression

# Multiple features: Area (x1) and Bedrooms (x2)
X = np.array([
    [6.0, 2], [7.5, 2], [8.0, 3], [9.2, 3], [10.5, 3],
    [11.0, 4], [12.5, 3], [13.0, 4], [14.5, 4], [16.0, 5]
])
y = np.array([48.0, 55.0, 64.0, 72.0, 81.0, 92.0, 96.0, 105.0, 118.0, 135.0])

# 1. Solve via Normal Equation in NumPy: theta = inv(X_b.T @ X_b) @ X_b.T @ y
m = len(X)
X_b = np.c_[np.ones((m, 1)), X]  # Add bias column of 1s
theta_best = np.linalg.inv(X_b.T @ X_b) @ X_b.T @ y

print(f"NumPy Normal Eq: Intercept = {theta_best[0]:.2f}, theta_1 = {theta_best[1]:.2f}, theta_2 = {theta_best[2]:.2f}")

# 2. Production Scikit-Learn
model = LinearRegression().fit(X, y)
print(f"Sklearn Fit:     Intercept = {model.intercept_:.2f}, Coeffs = {model.coef_}")`}</pre>
        </div>
      </section>

      {/* Section 7: Viva Voce Corner */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100 flex items-center gap-2">
          <HelpCircle className="size-5 text-amber-400" />
          7. Viva Voce Q&amp;A Corner
        </h2>
        <div className="space-y-3">
          <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/40 space-y-1.5">
            <h4 className="font-montserrat text-sm font-semibold text-stone-200">
              Q1: What is the dummy variable trap in multiple linear regression?
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              <strong>Answer:</strong> When converting a categorical feature with K categories into
              one-hot binary dummy variables, if you include all K dummy columns alongside the
              intercept column, their sum equals 1.0 (exact linear combination of the bias column).
              This creates perfect multicollinearity. To prevent singularity, always drop one dummy
              column (use K - 1 dummies).
            </p>
          </div>

          <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/40 space-y-1.5">
            <h4 className="font-montserrat text-sm font-semibold text-stone-200">
              Q2: What is the Variance Inflation Factor (VIF)?
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              <strong>Answer:</strong> VIF measures how much the variance of an estimated regression
              coefficient is inflated due to collinearity with other features: VIF<sub>j</sub> = 1 /
              (1 - R<sub>j</sub>&sup2;), where R<sub>j</sub>&sup2; is obtained by regressing feature
              x<sub>j</sub> on all other features. A VIF &gt; 5 or 10 indicates severe
              multicollinearity requiring feature removal.
            </p>
          </div>
        </div>
      </section>

      {/* Section 8: Knowledge Check */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100">
          8. Knowledge Check
        </h2>
        <Quiz conceptId="u3-multiple-linear-regression" items={quizItems} unitAccent={3} />
      </section>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between border-t border-stone-800 pt-6">
        <Link
          to="/learn/unit-3/gradient-descent"
          className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-stone-200 font-mono transition-colors"
        >
          <ArrowLeft className="size-4" />
          Previous: Gradient Descent
        </Link>
        <Link
          to="/learn/unit-3/polynomial-regression"
          className="inline-flex items-center gap-2 text-sm bg-stone-100 text-stone-950 hover:bg-stone-200 font-semibold px-4 py-2 rounded-lg rounded-br-none transition-colors"
        >
          Next: Polynomial Regression
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
          1. Strang, Gilbert. <em>Linear Algebra and Its Applications</em>. Cengage Learning, 2006.
        </p>
        <p>
          2. Hastie, Trevor, et al. <em>The Elements of Statistical Learning</em>. Springer, 2009.
          Chapter 3.
        </p>
      </div>
    </div>
  );
}
