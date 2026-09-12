import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Quiz } from '@/features/quiz/Quiz';
import { PolynomialRegressionLab } from '@/labs/polynomial-regression/PolynomialRegressionLab';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  GitBranch,
  AlertTriangle,
  Code2,
  HelpCircle,
} from 'lucide-react';

export function PolynomialRegressionPage() {
  const quizItems = [
    {
      id: 'poly-q1',
      question:
        'Why is Polynomial Regression mathematically classified as a "Linear Model" despite producing curved non-linear decision surfaces in data space?',
      options: [
        {
          id: 'A',
          text: 'Because the hypothesis equation is strictly linear with respect to the unknown parameters theta, even though the feature basis transformations phi(x) = x^k are non-linear.',
          isCorrect: true,
          explanation:
            'In statistics, "linearity" is defined strictly with respect to parameters theta, not the input features x. Because y_hat = theta_0 + theta_1 phi_1(x) + ... + theta_d phi_d(x) is a linear combination of theta, the objective function J(theta) remains convex and solvable via the Normal Equation.',
        },
        {
          id: 'B',
          text: 'Because it only works on straight lines.',
          isCorrect: false,
          explanation:
            'Polynomial regression fits parabolic, cubic, and higher-order curved surfaces.',
        },
        {
          id: 'C',
          text: 'Because it requires linear search in memory.',
          isCorrect: false,
          explanation: 'Algorithmic search order has nothing to do with statistical linearity.',
        },
      ],
    },
    {
      id: 'poly-q2',
      question: 'What is Runge Phenomenon in the context of high-degree polynomial curve fitting?',
      options: [
        {
          id: 'A',
          text: 'A severe problem of wild, high-amplitude numerical oscillations occurring near the edges of the interval when using high-degree polynomial interpolation across equispaced data points.',
          isCorrect: true,
          explanation:
            'Discovered by mathematician Carl Runge in 1901, increasing polynomial degree d on equally spaced sample points causes the interpolation error near the boundaries to diverge toward infinity, leading to catastrophic test error.',
        },
        {
          id: 'B',
          text: 'A hardware defect where floating-point math rounds to zero.',
          isCorrect: false,
          explanation:
            'Runge phenomenon is a fundamental mathematical property of polynomial basis expansion.',
        },
        {
          id: 'C',
          text: 'An optimization failure where gradient descent gets stuck in a local minimum.',
          isCorrect: false,
          explanation: 'Runge phenomenon occurs even with exact analytical matrix solutions.',
        },
      ],
    },
    {
      id: 'poly-q3',
      question:
        'As the polynomial degree d is increased from 1 to 10 on a fixed training dataset, how do the Training MSE and Test MSE typically behave?',
      options: [
        {
          id: 'A',
          text: 'Training MSE decreases monotonically toward zero (memorization), while Test MSE initially decreases, reaches an optimal minimum, and then skyrockets exponentially (overfitting).',
          isCorrect: true,
          explanation:
            'Higher degrees grant the model additional capacity to pass through every individual training point, driving train MSE to 0. However, out-of-sample generalization error forms a U-shaped curve that explodes once the model begins fitting random sample noise.',
        },
        {
          id: 'B',
          text: 'Both Training and Test MSE increase simultaneously at every degree step.',
          isCorrect: false,
          explanation: 'Train MSE never increases when adding polynomial terms.',
        },
        {
          id: 'C',
          text: 'Training MSE stays constant while Test MSE drops to zero.',
          isCorrect: false,
          explanation: 'Test MSE almost never reaches zero in noisy empirical data.',
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
        <span className="text-xs font-mono text-stone-300">Polynomial Regression</span>
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
          Polynomial Regression: Non-Linear Modeling with Linear Machinery
        </h1>
        <p className="text-base text-stone-300 leading-relaxed max-w-3xl font-sans">
          Nature is rarely straight. When data displays curved trajectories like aerodynamic drag,
          braking distances, or biological growth, polynomial regression injects non-linear power
          into linear models by generating{' '}
          <span className="text-amber-100 font-medium">higher-order feature powers</span> while
          preserving convex linear optimization.
        </p>
      </div>

      {/* Section 1: Intuition */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100">
          1. Intuition: The Power of Feature Transformation
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed text-sm text-stone-300">
          <div className="p-5 rounded-xl border border-stone-800 bg-stone-900/40 space-y-3">
            <h3 className="font-montserrat text-base font-semibold text-stone-100 flex items-center gap-2">
              <GitBranch className="size-4 text-amber-400" />
              The Linear Illusion
            </h3>
            <p>
              Suppose an engineer wants to predict vehicle stopping distance from speed. Physics
              dictates that kinetic energy is proportional to velocity squared: E<sub>k</sub> =
              (1/2)mv&sup2;.
            </p>
            <p>
              A simple straight line will catastrophically underpredict stopping distance at highway
              speeds. By creating a synthetic feature{' '}
              <span className="font-mono text-stone-200">
                x<sub>2</sub> = x&sup2;
              </span>
              , the algorithm fits a standard linear model on the transformed feature space that
              curves parabolically in the original space.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-stone-800 bg-stone-900/40 space-y-3">
            <h3 className="font-montserrat text-base font-semibold text-stone-100">
              The Double-Edged Sword of High Degrees
            </h3>
            <p>
              If degree 2 is good, why not use degree 20? A high-degree polynomial has enough
              parameters to wiggle and touch every single training point with zero error.
            </p>
            <p>
              However, between points and at the boundary edges, the curve explodes into wild
              oscillations known as{' '}
              <span className="text-amber-100 font-medium">Runge phenomenon</span>, destroying
              real-world test performance.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Interactive Lab */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100">
          2. Interactive Lab: Polynomial Degree Sweeper &amp; Overfitting Arena
        </h2>
        <p className="text-sm text-stone-300 leading-relaxed font-sans">
          Slide the polynomial degree slider from 1 to 7. Observe the widening gulf between training
          error and held-out test error as model complexity escalates.
        </p>
        <PolynomialRegressionLab />
      </section>

      {/* Section 3: Mathematical Formalism */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100">
          3. Mathematical Formulation &amp; The Vandermonde Matrix
        </h2>
        <Card className="p-6 border-stone-800 bg-stone-900/40 space-y-5">
          <p className="text-sm text-stone-300 leading-relaxed font-sans">
            A polynomial regression model of degree{' '}
            <span className="font-mono text-stone-200">d</span> models the target as:
          </p>
          <div className="p-3 rounded-lg bg-stone-950 border border-stone-800 font-mono text-xs text-amber-200/90 text-center">
            ŷ = &theta;<sub>0</sub> + &theta;<sub>1</sub>x + &theta;<sub>2</sub>x&sup2; + &theta;
            <sub>3</sub>x&sup3; + ... + &theta;<sub>d</sub>x<sup>d</sup>
          </div>

          <p className="text-sm text-stone-300 leading-relaxed font-sans">
            We map each scalar input instance{' '}
            <span className="font-mono text-stone-200">
              x<sup>(i)</sup>
            </span>{' '}
            into a (d+1)-dimensional feature vector via the basis function:
          </p>
          <div className="p-3 rounded-lg bg-stone-950 border border-stone-800 font-mono text-xs text-stone-200 text-center">
            &phi;(x) = [1, x, x&sup2;, x&sup3;, ..., x<sup>d</sup>]<sup>T</sup>
          </div>

          <p className="text-sm text-stone-300 leading-relaxed font-sans">
            Stacking these basis vectors across all{' '}
            <span className="font-mono text-stone-200">m</span> training instances produces the
            famous <span className="text-amber-100 font-medium">Vandermonde Design Matrix</span>:
          </p>
          <div className="p-4 rounded-xl border border-stone-800 bg-stone-950 font-mono text-xs text-stone-300 overflow-x-auto text-center">
            X = [ [1, x<sub>1</sub>, x<sub>1</sub>&sup2;, ..., x<sub>1</sub>
            <sup>d</sup>], <br />
            [1, x<sub>2</sub>, x<sub>2</sub>&sup2;, ..., x<sub>2</sub>
            <sup>d</sup>], <br />
            ..., <br />
            [1, x<sub>m</sub>, x<sub>m</sub>&sup2;, ..., x<sub>m</sub>
            <sup>d</sup>] ]
          </div>
        </Card>
      </section>

      {/* Section 4: Runge Phenomenon */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100">
          4. Runge Phenomenon: The Peril of Boundary Extrapolation
        </h2>
        <div className="p-5 rounded-xl border border-rose-500/30 bg-rose-950/20 space-y-3 text-sm text-stone-300 leading-relaxed font-sans">
          <div className="flex items-center gap-2 font-montserrat font-semibold text-rose-300">
            <AlertTriangle className="size-4" />
            Why High Degrees Destabilize Interpolation
          </div>
          <p>
            In 1901, German mathematician Carl Runge proved that using high-degree polynomials to
            interpolate equispaced points on simple smooth functions like{' '}
            <span className="font-mono text-stone-200">f(x) = 1 / (1 + 25x&sup2;)</span> causes the
            interpolation error near the boundaries of the interval to diverge toward infinity.
          </p>
          <p className="text-xs text-stone-400">
            In modern machine learning, we rarely use raw polynomial regression beyond degree d = 3
            or 4. For complex non-linear curves, engineers use Splines, Decision Trees, or Kernel
            Ridge Regression rather than high-degree monomials.
          </p>
        </div>
      </section>

      {/* Section 5: Python Reference Implementation */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100 flex items-center gap-2">
          <Code2 className="size-5 text-amber-400" />
          5. Python Reference Implementation: Scikit-Learn Pipeline
        </h2>
        <div className="p-4 rounded-xl border border-stone-800 bg-stone-950 font-mono text-xs text-stone-300 overflow-x-auto leading-relaxed">
          <pre>{`import numpy as np
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import PolynomialFeatures, StandardScaler
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.metrics import mean_squared_error

# 1. Non-linear sample training data
X = np.array([[1.0], [2.2], [3.5], [4.8], [5.9], [7.1], [8.4], [9.6]])
y = np.array([17.5, 19.8, 14.2, 5.6, 4.2, 7.9, 16.5, 20.1])

# 2. Build Polynomial Pipeline (Degree = 3)
degree = 3
poly_model = make_pipeline(
    PolynomialFeatures(degree=degree, include_bias=True),
    StandardScaler(),          # Feature scaling is crucial because x^d grows exponentially!
    LinearRegression()
)

poly_model.fit(X, y)
y_pred = poly_model.predict(X)

print(f"Polynomial Degree {degree} Fit MSE: {mean_squared_error(y, y_pred):.4f}")`}</pre>
        </div>
      </section>

      {/* Section 6: Viva Voce Corner */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100 flex items-center gap-2">
          <HelpCircle className="size-5 text-amber-400" />
          6. Viva Voce Q&amp;A Corner
        </h2>
        <div className="space-y-3">
          <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/40 space-y-1.5">
            <h4 className="font-montserrat text-sm font-semibold text-stone-200">
              Q1: Why must feature scaling be performed before fitting high-degree polynomials?
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              <strong>Answer:</strong> If an input feature x ranges from 1 to 100, then x&sup3;
              reaches 1,000,000 and x&sup5; reaches 10,000,000,000. These astronomical differences
              in scale create near-singular ill-conditioned matrices (extremely large condition
              number), causing severe floating-point numerical errors during matrix inversion.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/40 space-y-1.5">
            <h4 className="font-montserrat text-sm font-semibold text-stone-200">
              Q2: How do you select the optimal polynomial degree in practice?
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              <strong>Answer:</strong> By using K-Fold Cross-Validation on held-out validation data.
              We sweep degrees d from 1 to K and choose the degree that achieves the minimum
              validation error, rather than relying on training error (which trivially favors the
              highest degree).
            </p>
          </div>
        </div>
      </section>

      {/* Section 7: Knowledge Check */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100">
          7. Knowledge Check
        </h2>
        <Quiz conceptId="u3-polynomial-regression" items={quizItems} unitAccent={3} />
      </section>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between border-t border-stone-800 pt-6">
        <Link
          to="/learn/unit-3/multiple-linear-regression"
          className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-stone-200 font-mono transition-colors"
        >
          <ArrowLeft className="size-4" />
          Previous: Multiple Linear Regression
        </Link>
        <Link
          to="/learn/unit-3/bias-variance-tradeoff"
          className="inline-flex items-center gap-2 text-sm bg-stone-100 text-stone-950 hover:bg-stone-200 font-semibold px-4 py-2 rounded-lg rounded-br-none transition-colors"
        >
          Next: Bias-Variance Tradeoff
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
          1. Runge, Carl. &quot;&Uuml;ber empirische Funktionen und die Interpolation zwischen
          &auml;quidistanten Punkten.&quot; <em>Zeitschrift f&uuml;r Mathematik und Physik</em>,
          1901.
        </p>
        <p>
          2. Bishop, Christopher M. <em>Pattern Recognition and Machine Learning</em>. Springer,
          2006. Chapter 1.
        </p>
      </div>
    </div>
  );
}
