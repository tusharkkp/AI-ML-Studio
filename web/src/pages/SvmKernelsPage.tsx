import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Quiz } from '@/features/quiz/Quiz';
import { SvmKernelTrickLab } from '@/labs/svm-kernel/SvmKernelTrickLab';
import { useProgressStore } from '@/features/progress/useProgressStore';
import { Layers, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

const QUIZ_ITEMS = [
  {
    id: 'svm-k-q1',
    question:
      'What is the fundamental computational advantage of the "Kernel Trick" in Support Vector Machines?',
    options: [
      {
        id: 'a',
        text: 'It explicitly computes and stores all high-dimensional coordinates in memory before training',
        isCorrect: false,
        explanation:
          'Incorrect. Explicitly computing high-dimensional coordinates would trigger severe memory explosion and the curse of dimensionality.',
      },
      {
        id: 'b',
        text: 'It evaluates inner products in high-dimensional feature space directly using a function of low-dimensional coordinates',
        isCorrect: true,
        explanation:
          'Correct. By computing K(x, z) = <phi(x), phi(z)> directly, we obtain the geometric benefits of high dimensions without ever mapping or storing the transformed vectors.',
      },
      {
        id: 'c',
        text: 'It removes the need to calculate the intercept bias term b during inference',
        isCorrect: false,
        explanation:
          'Incorrect. The intercept b is still required and computed from support vectors on the margin.',
      },
      {
        id: 'd',
        text: 'It eliminates all support vectors and converts SVM into a decision tree',
        isCorrect: false,
        explanation:
          'Incorrect. Kernel SVM remains a maximum-margin dual optimization problem with support vectors.',
      },
    ],
  },
  {
    id: 'svm-k-q2',
    question:
      'Why does the Gaussian Radial Basis Function (RBF) kernel implicitly correspond to an infinite-dimensional feature space?',
    options: [
      {
        id: 'a',
        text: 'Because the Taylor series expansion of exp(-gamma ||x - z||^2) contains polynomial terms of every degree up to infinity',
        isCorrect: true,
        explanation:
          'Correct. Expanding exp(2*gamma*x^T z) via its power series yields an infinite sum of polynomial basis functions, projecting samples into Hilbert space.',
      },
      {
        id: 'b',
        text: 'Because gamma is an irrational floating point number with infinite decimals',
        isCorrect: false,
        explanation:
          'Incorrect. Infinite dimensionality stems from the analytical Taylor expansion of the exponential function, not the precision of gamma.',
      },
      {
        id: 'c',
        text: 'Because the training dataset must contain infinite samples to calculate the Gram matrix',
        isCorrect: false,
        explanation:
          'Incorrect. The Gram matrix is finite with dimension N x N, where N is the number of training samples.',
      },
      {
        id: 'd',
        text: 'Because RBF kernels require infinite iterations to converge',
        isCorrect: false,
        explanation:
          'Incorrect. Convex quadratic programs with RBF kernels converge in finite iterations.',
      },
    ],
  },
  {
    id: 'svm-k-q3',
    question:
      'What happens to the decision boundary when the RBF parameter gamma is set to an excessively large value (e.g., gamma = 10.0)?',
    options: [
      {
        id: 'a',
        text: 'The decision boundary flattens into a global linear line across the entire dataset',
        isCorrect: false,
        explanation:
          'Incorrect. Very small gamma values (gamma -> 0) flatten the boundary; high gamma values do the opposite.',
      },
      {
        id: 'b',
        text: 'The radius of influence of each support vector shrinks, creating isolated island pockets around individual points (severe overfitting)',
        isCorrect: true,
        explanation:
          'Correct. High gamma restricts each Gaussian bell to a narrow spike, memorizing individual training samples and failing on unseen test points.',
      },
      {
        id: 'c',
        text: 'The margin width becomes infinitely wide',
        isCorrect: false,
        explanation: 'Incorrect. Tight island boundaries correspond to zero margin generalization.',
      },
      {
        id: 'd',
        text: 'The model automatically switches to a polynomial kernel',
        isCorrect: false,
        explanation: 'Incorrect. Kernel type is fixed; parameter gamma controls RBF curvature.',
      },
    ],
  },
  {
    id: 'svm-k-q4',
    question:
      "According to Mercer's Theorem, which mathematical condition must a function K(x, z) satisfy to be a valid SVM kernel?",
    options: [
      {
        id: 'a',
        text: 'Its Gram matrix must be symmetric and positive semi-definite for any set of input vectors',
        isCorrect: true,
        explanation:
          "Correct. Mercer's condition guarantees that K(x, z) corresponds to an inner product in some valid inner product space, preventing the convex quadratic optimizer from diverging.",
      },
      {
        id: 'b',
        text: 'Its derivative must equal zero at all points along the coordinate axes',
        isCorrect: false,
        explanation: 'Incorrect. Kernel functions need not have zero derivatives.',
      },
      {
        id: 'c',
        text: 'It must output only negative integer values',
        isCorrect: false,
        explanation:
          'Incorrect. Kernels measure inner products and similarities, typically producing positive values.',
      },
      {
        id: 'd',
        text: 'It must be bounded strictly between -1 and 0',
        isCorrect: false,
        explanation:
          'Incorrect. Linear and polynomial kernels can take arbitrarily large positive values.',
      },
    ],
  },
];

export function SvmKernelsPage() {
  const [showMath, setShowMath] = useState(false);
  const [predictionMade, setPredictionMade] = useState(false);
  const getConceptProgress = useProgressStore((state) => state.getConceptProgress);
  const progress = getConceptProgress('u5-svm-kernels');
  const isCompleted = progress?.labCompleted || progress?.read;

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 sm:px-10 font-sans text-neutral-300">
      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex items-center gap-2 text-xs text-neutral-400"
      >
        <Link to="/learn/unit-5" className="hover:text-brand transition-colors">
          Unit 5: Linear & Decision Models
        </Link>
        <span>/</span>
        <span className="text-neutral-200">The Kernel Trick</span>
      </nav>

      {/* 1. Header Section */}
      <header className="border-b border-border/40 pb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="unit">Unit 5 · Topic 5</Badge>
          <Badge variant="outline">CO2: Real-World ML</Badge>
          <Badge variant="outline">CO4: Approximations & Limits</Badge>
          <Badge variant="default">35 min read & lab</Badge>
          {isCompleted && (
            <Badge variant="success" className="flex items-center gap-1">
              <CheckCircle className="size-3" /> Completed
            </Badge>
          )}
        </div>

        <h1 className="font-manrope text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground">
          SVM Soft-Margin & The Kernel Trick
        </h1>
        <p className="mt-3 text-base sm:text-lg text-neutral-400 max-w-3xl leading-relaxed">
          How do you separate non-linear rings and complex spirals using a straight ruler? Discover
          Cover's theorem and the high-dimensional projection trick.
        </p>
      </header>

      {/* 2. The Hook (<= 80 words) */}
      <section className="mt-8">
        <Card className="p-5 sm:p-6 rounded-xl border border-orange-50/15 bg-black/10 backdrop-blur-sm shadow-none">
          <div className="flex items-start gap-3">
            <Layers className="size-5 text-amber-300 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-xs uppercase tracking-wider font-semibold text-amber-200/90 mb-1">
                The concentric circle conundrum
              </h2>
              <p className="text-sm leading-relaxed text-neutral-300">
                Place a blue poker chip on a table and surround it with red poker chips in a ring.
                No straight knife can cut between blue and red without cutting across the red
                boundary.{' '}
                <span className="font-montserrat font-medium text-yellow-800 dark:text-orange-100">
                  Now push the center of the tablecloth upwards
                </span>{' '}
                into the third dimension. Suddenly, a horizontal cardboard sheet slices between the
                elevated blue peak and the lower red ring.
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* 3. Intuition */}
      <section className="mt-12 space-y-4">
        <h2 className="font-manrope text-2xl font-medium tracking-tight text-foreground">
          1. Intuition: Cover's theorem & inner products
        </h2>
        <p className="text-sm leading-relaxed text-neutral-300">
          Cover's Theorem states that a complex classification problem cast non-linearly into a
          higher-dimensional space is more likely to be linearly separable than in the original
          space. However, calculating coordinates in a million dimensions would crash any computer.{' '}
          <span className="font-montserrat font-medium text-yellow-800 dark:text-orange-100">
            The kernel trick avoids this explosion entirely
          </span>{' '}
          by calculating only the inner product between samples.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <Card className="p-4 rounded-xl border border-border/50 bg-black/15 shadow-none">
            <span className="text-xs font-mono font-bold text-amber-300">Linear Kernel</span>
            <h3 className="text-sm font-semibold text-foreground mt-1 mb-1">
              {'$$K(x, z) = x^T z$$'}
            </h3>
            <p className="text-xs text-neutral-400">
              Standard dot product in original space. Fast and ideal when features far outnumber
              samples (e.g. text classification).
            </p>
          </Card>

          <Card className="p-4 rounded-xl border border-border/50 bg-black/15 shadow-none">
            <span className="text-xs font-mono font-bold text-amber-300">Polynomial Kernel</span>
            <h3 className="text-sm font-semibold text-foreground mt-1 mb-1">
              {'$$K(x, z) = (x^T z + c)^d$$'}
            </h3>
            <p className="text-xs text-neutral-400">
              Captures feature interactions up to degree d (e.g. cross-terms x₁x₂, x₁², x₂²) without
              manual feature engineering.
            </p>
          </Card>

          <Card className="p-4 rounded-xl border border-border/50 bg-black/15 shadow-none">
            <span className="text-xs font-mono font-bold text-amber-300">Gaussian RBF Kernel</span>
            <h3 className="text-sm font-semibold text-foreground mt-1 mb-1">
              {'$$\\exp(-\\gamma \\|x - z\\|^2)$$'}
            </h3>
            <p className="text-xs text-neutral-400">
              Measures similarity as a bell-shaped radial decay. Maps data into an
              infinite-dimensional Hilbert space.
            </p>
          </Card>
        </div>
      </section>

      {/* 4. Interactive Lab with Predict-Then-Reveal */}
      <section className="mt-12 space-y-4">
        <h2 className="font-manrope text-2xl font-medium tracking-tight text-foreground">
          2. Interactive Lab: High-dimensional lift studio
        </h2>

        {!predictionMade && (
          <div className="rounded-xl border border-amber-900/40 bg-amber-950/15 p-4 text-xs text-neutral-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-semibold text-amber-200 block mb-0.5">
                Predict before tuning:
              </span>
              On the concentric circles dataset, toggle from 2D contour to 3D lift. Where will the
              inner circle points land along the vertical z axis?
            </div>
            <Button
              size="sm"
              variant="primary"
              className="shrink-0"
              onClick={() => setPredictionMade(true)}
            >
              Reveal & explore
            </Button>
          </div>
        )}

        <SvmKernelTrickLab />
      </section>

      {/* 5. Step-by-Step on Paper */}
      <section className="mt-12 space-y-4">
        <h2 className="font-manrope text-2xl font-medium tracking-tight text-foreground">
          3. Step-by-step on paper: 1D to 2D polynomial lift
        </h2>
        <p className="text-sm leading-relaxed text-neutral-300">
          Consider three points on a 1D number line:
        </p>

        <div className="rounded-lg border border-border/60 bg-neutral-900/60 p-4 font-mono text-xs space-y-1">
          <div>Point 1: x₁ = -1, y₁ = +1</div>
          <div>Point 2: x₂ = 0, y₂ = -1 (trapped in the middle!)</div>
          <div>Point 3: x₃ = +1, y₃ = +1</div>
        </div>

        <div className="space-y-3 text-xs leading-relaxed text-neutral-300">
          <p>
            <strong>In 1D space:</strong> No single threshold value can separate class +1 (at both
            ends -1 and +1) from class -1 (at 0). A single linear cut can only create two
            half-spaces.
          </p>
          <p>
            <strong>The feature mapping:</strong> Let us define a non-linear mapping{' '}
            {'$$\\phi(x) = (x, x^2)$$'}. Transforming our three points into 2D:
          </p>
          <div className="rounded bg-neutral-900/80 p-3 font-mono text-[11px] overflow-x-auto">
            <div>{`\\phi(x_1) = \\phi(-1) = (-1, (-1)^2) = (-1, 1), \\quad y_1 = +1`}</div>
            <div>{`\\phi(x_2) = \\phi(0) = (0, 0^2) = (0, 0), \\quad y_2 = -1`}</div>
            <div>{`\\phi(x_3) = \\phi(1) = (1, 1^2) = (1, 1), \\quad y_3 = +1`}</div>
          </div>
          <p>
            <strong>The linear separator in 2D:</strong> Look at the second coordinate{' '}
            {'$$z = x^2$$'}. Point 2 has {'$$z = 0$$'}, while Points 1 and 3 both have {'$$z = 1$$'}
            . The horizontal line {'$$z = 0.5$$'} (or {'$$w = [0, 1], b = -0.5$$'}) cleanly
            separates class +1 from class -1 with 100% accuracy!
          </p>
        </div>
      </section>

      {/* 6. Formal Mathematical Foundations */}
      <section className="mt-12 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-manrope text-2xl font-medium tracking-tight text-foreground">
            4. Formal mathematical foundations
          </h2>
          <Button size="sm" variant="outline" onClick={() => setShowMath(!showMath)}>
            {showMath ? 'Collapse derivation' : 'Show math details'}
          </Button>
        </div>

        <p className="text-sm leading-relaxed text-neutral-300">
          The dual formulation of SVM requires data points only in terms of pairwise inner products{' '}
          {'$$x_i^T x_j$$'}.
        </p>

        {showMath && (
          <Card className="p-5 sm:p-6 rounded-xl border border-orange-50/15 bg-black/15 backdrop-blur-sm space-y-4 text-xs leading-relaxed">
            <div>
              <h3 className="font-semibold text-amber-200 mb-1">
                Dual Objective with Kernel Substitution
              </h3>
              <p className="text-neutral-400 mb-2">
                Replace every dot product {'$$x_i^T x_j$$'} with the kernel function{' '}
                {'$$K(x_i, x_j)$$'}:
              </p>
              <div className="rounded bg-neutral-900/80 p-3 font-mono text-[11px] overflow-x-auto">
                {
                  '$$\\max_{\\alpha} \\sum_{i=1}^N \\alpha_i - \\frac{1}{2} \\sum_{i=1}^N \\sum_{j=1}^N \\alpha_i \\alpha_j y_i y_j K(x_i, x_j)$$'
                }
                `
                <br />
                {
                  '$$\\text{subject to } 0 \\le \\alpha_i \\le C, \\quad \\sum_{i=1}^N \\alpha_i y_i = 0$$'
                }
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-amber-200 mb-1">Dual Prediction Function</h3>
              <p className="text-neutral-400 mb-2">
                Classification of an unseen test sample x is computed using only support vectors:
              </p>
              <div className="rounded bg-neutral-900/80 p-3 font-mono text-[11px] overflow-x-auto">
                {
                  '$$f(x) = \\text{sign}\\left( \\sum_{i \\in \\text{SV}} \\alpha_i y_i K(x_i, x) + b \\right)$$'
                }
                `
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-amber-200 mb-1">Mercer's Condition</h3>
              <p className="text-neutral-400">
                A function {'$$K(x, z)$$'} can be decomposed into an inner product in some Hilbert
                space if and only if the Gram matrix K (where {'$$K_{ij} = K(x_i, x_j)$$'}) is
                symmetric and positive semi-definite: {'$$c^T K c \\ge 0$$'} for all non-zero
                vectors c.
              </p>
            </div>
          </Card>
        )}
      </section>

      {/* 7. Algorithm Pseudocode */}
      <section className="mt-12 space-y-4">
        <h2 className="font-manrope text-2xl font-medium tracking-tight text-foreground">
          5. Algorithm pseudocode: Kernelized prediction
        </h2>
        <Card className="p-4 rounded-xl border border-border/50 bg-black/20 font-mono text-xs overflow-x-auto">
          <pre className="text-neutral-300 leading-snug">
            {`Algorithm: Dual Kernelized SVM Evaluation
Input: Query point x, Support vector indices SV, α vector, labels y, bias b, Kernel K
Output: Predicted class y_pred in {-1, +1}, decision value f(x)

1. Set decisionValue = b
2. For each support vector index i in SV:
3.   kVal = evaluateKernel(X[i], x, KernelConfig)
4.   decisionValue += α[i] * y[i] * kVal
5. If decisionValue >= 0:
6.   y_pred = +1
7. Else:
8.   y_pred = -1
9. Return (y_pred, decisionValue)`}
          </pre>
        </Card>
      </section>

      {/* 8. Code It in Python */}
      <section className="mt-12 space-y-4">
        <h2 className="font-manrope text-2xl font-medium tracking-tight text-foreground">
          6. Code it in Python
        </h2>
        <Card className="p-4 rounded-xl border border-border/50 bg-black/20 font-mono text-xs overflow-x-auto">
          <pre className="text-neutral-300 leading-snug">
            {`from sklearn.svm import SVC
from sklearn.datasets import make_circles
from sklearn.model_selection import GridSearchCV
import numpy as np

# 1. Generate non-linear concentric circles
X, y = make_circles(n_samples=200, noise=0.08, factor=0.4, random_state=42)
y = 2 * y - 1  # Map {0, 1} to {-1, +1}

# 2. Grid search for optimal (C, gamma) hyperparameters
param_grid = {
    'C': [0.1, 1.0, 10.0, 100.0],
    'gamma': [0.1, 0.5, 1.0, 2.0]
}
grid = GridSearchCV(SVC(kernel='rbf'), param_grid, cv=5)
grid.fit(X, y)

print("Optimal parameters:", grid.best_params_)
print(f"Cross-validated accuracy: {grid.best_score_ * 100:.1f}%")

# 3. Best estimator support vectors count
best_svm = grid.best_estimator_
print(f"Active support vectors: {len(best_svm.support_)} / {len(X)}")`}
          </pre>
        </Card>
      </section>

      {/* 9. Make It Fail */}
      <section className="mt-12 space-y-4">
        <h2 className="font-manrope text-2xl font-medium tracking-tight text-foreground flex items-center gap-2">
          <AlertTriangle className="size-5 text-orange-400" />
          7. Make it fail: The gamma hyperparameter trap
        </h2>
        <p className="text-sm leading-relaxed text-neutral-300">
          The RBF kernel parameter gamma defines the inverse radius of influence of each support
          vector:
        </p>

        <Card className="p-4 rounded-xl border border-orange-500/20 bg-orange-950/10 space-y-2 text-xs">
          <p className="text-neutral-300">
            <strong>The failure mechanism:</strong> When gamma is set to a massive value (e.g.,{' '}
            {'$$\\gamma = 20$$'}), the term {'$$\\exp(-\\gamma \\|x - z\\|^2)$$'}' drops to zero
            unless x is virtually identical to z.
          </p>
          <p className="text-neutral-300">
            <strong>The consequence:</strong> The decision boundary forms tight, isolated circular
            islands around each individual positive training point. Training accuracy reaches 100%,
            but test accuracy collapses because any point lying outside these microscopic islands is
            arbitrarily classified as negative.
          </p>
          <p className="text-amber-300 font-semibold">
            Tuning rule: Always calibrate gamma and C simultaneously using cross-validation over a
            logarithmic grid.
          </p>
        </Card>
      </section>

      {/* 10. Strengths, Limitations & When NOT to Use */}
      <section className="mt-12 space-y-4">
        <h2 className="font-manrope text-2xl font-medium tracking-tight text-foreground">
          8. Strengths, limitations & when NOT to use
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4 rounded-xl border border-emerald-900/30 bg-emerald-950/10 shadow-none text-xs space-y-2">
            <h3 className="font-semibold text-emerald-300 text-sm">Strengths</h3>
            <ul className="space-y-1.5 text-neutral-300 list-disc list-inside">
              <li>
                <strong>Arbitrary non-linear boundaries:</strong> Seamlessly separates concentric
                rings, intertwined spirals, and complex medical biomarkers.
              </li>
              <li>
                <strong>No explicit coordinates needed:</strong> Evaluates inner products directly,
                avoiding high-dimensional memory explosion.
              </li>
              <li>
                <strong>Robust regularization:</strong> Parameter C prevents severe overfitting when
                balanced with appropriate kernel bandwidth.
              </li>
            </ul>
          </Card>

          <Card className="p-4 rounded-xl border border-red-900/30 bg-red-950/10 shadow-none text-xs space-y-2">
            <h3 className="font-semibold text-red-300 text-sm">Limitations & When NOT to use</h3>
            <ul className="space-y-1.5 text-neutral-300 list-disc list-inside">
              <li>
                <strong>Quadratic memory footprint:</strong> The Gram matrix requires {'$$O(N^2)$$'}{' '}
                storage, exhausting RAM on datasets with more than 50,000 samples.
              </li>
              <li>
                <strong>Hyperparameter sensitivity:</strong> Highly sensitive to the combination of
                C and gamma; poor tuning causes either underfitting or island memorization.
              </li>
              <li>
                <strong>Black-box interpretability:</strong> In infinite-dimensional Hilbert space,
                feature weights w cannot be explicitly listed or inspected.
              </li>
            </ul>
          </Card>
        </div>
      </section>

      {/* 11. Common Misconceptions */}
      <section className="mt-12 space-y-4">
        <h2 className="font-manrope text-2xl font-medium tracking-tight text-foreground">
          9. Common misconceptions
        </h2>
        <div className="space-y-3">
          <Card className="p-4 rounded-xl border border-border/50 bg-black/15 shadow-none text-xs">
            <span className="font-semibold text-red-300 block mb-1">
              Misconception: "The kernel trick explicitly transforms all points into higher
              dimensions."
            </span>
            <p className="text-neutral-400">
              Reality: Points are never transformed or mapped. The algorithm only computes the
              scalar inner product K(x, z) between pairs of original low-dimensional vectors.
            </p>
          </Card>

          <Card className="p-4 rounded-xl border border-border/50 bg-black/15 shadow-none text-xs">
            <span className="font-semibold text-red-300 block mb-1">
              Misconception: "An RBF kernel is always superior to a linear kernel."
            </span>
            <p className="text-neutral-400">
              Reality: When the number of features d is much larger than sample size N (e.g. text
              classification with 50,000 TF-IDF tokens), data is already linearly separable. A
              linear SVM trains in seconds, whereas an RBF kernel wastes computation and risks
              overfitting.
            </p>
          </Card>
        </div>
      </section>

      {/* 12. Check Yourself (Micro-Quiz) */}
      <section className="mt-12 space-y-4">
        <h2 className="font-manrope text-2xl font-medium tracking-tight text-foreground">
          10. Check yourself: Micro-quiz
        </h2>
        <Quiz conceptId="u5-svm-kernels" items={QUIZ_ITEMS} />
      </section>

      {/* 13. Exam & Viva Corner */}
      <section className="mt-12 space-y-4">
        <h2 className="font-manrope text-2xl font-medium tracking-tight text-foreground">
          11. Exam & viva corner
        </h2>
        <Card className="p-5 rounded-xl border border-border/50 bg-black/15 space-y-3 text-xs">
          <div>
            <h3 className="font-semibold text-amber-200">
              Q: Explain Mercer's Condition and why it is critical for SVM kernels.
            </h3>
            <p className="text-neutral-400 mt-1 leading-relaxed">
              Model answer: Mercer's theorem states that any continuous, symmetric function K(x, z)
              that produces a positive semi-definite Gram matrix corresponds to an inner product in
              some Hilbert feature space. This is critical because it ensures the SVM dual objective
              remains concave (its minimization is convex), guaranteeing a unique global minimum
              without saddle points or local traps.
            </p>
          </div>

          <div className="pt-2 border-t border-border/40">
            <h3 className="font-semibold text-amber-200">
              Q: Compare the RBF kernel and the Polynomial kernel in terms of parameter tuning.
            </h3>
            <p className="text-neutral-400 mt-1 leading-relaxed">
              Model answer: The polynomial kernel requires tuning degree d and constant c, but high
              degrees suffer from numerical instability and exponential values. The RBF kernel
              depends only on gamma, which smoothly controls the Gaussian curvature and is bounded
              between 0 and 1, making it far more numerically stable.
            </p>
          </div>
        </Card>
      </section>

      {/* 14. Summary & What's Next */}
      <section className="mt-12 border-t border-border/40 pt-8 pb-16">
        <h2 className="font-manrope text-2xl font-medium tracking-tight text-foreground mb-3">
          12. Summary & key takeaways
        </h2>
        <ul className="space-y-2 text-xs text-neutral-300 list-disc list-inside mb-6">
          <li>
            Cover's theorem proves non-linearly separable patterns become linearly separable when
            projected into higher dimensions.
          </li>
          <li>
            The Kernel Trick computes high-dimensional inner products directly without evaluating or
            storing the transformed coordinates.
          </li>
          <li>
            The Gaussian RBF kernel maps data into an infinite-dimensional Hilbert space via its
            Taylor series expansion.
          </li>
          <li>
            The parameter gamma controls the radius of influence of support vectors; high gamma
            risks island overfitting.
          </li>
          <li>
            Mercer's theorem guarantees that positive semi-definite Gram matrices maintain convex
            quadratic optimization.
          </li>
        </ul>

        <div className="flex items-center justify-between p-4 rounded-xl border border-orange-50/20 bg-black/20">
          <div>
            <span className="text-[11px] text-neutral-400 block">Next topic</span>
            <span className="text-sm font-semibold text-foreground">
              Ensemble Methods: Significance & Diversity
            </span>
          </div>
          <Link to="/learn/unit-5/ensemble-significance">
            <Button variant="primary" size="sm">
              Discover ensembles <ArrowRight className="size-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
