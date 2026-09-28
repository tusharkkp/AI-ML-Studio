import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Quiz } from '@/features/quiz/Quiz';
import { SvmMarginLab } from '@/labs/svm/SvmMarginLab';
import { useProgressStore } from '@/features/progress/useProgressStore';
import { Shield, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

const QUIZ_ITEMS = [
  {
    id: 'svm-q1',
    question:
      'What geometrically determines the orientation and position of the SVM optimal decision boundary?',
    options: [
      {
        id: 'a',
        text: 'The arithmetic mean of all training data points across both classes',
        isCorrect: false,
        explanation:
          'Incorrect. Points located deep inside class clusters have zero Lagrange multipliers and exert zero influence on the hyperplane.',
      },
      {
        id: 'b',
        text: 'Exclusively the subset of training samples known as support vectors',
        isCorrect: true,
        explanation:
          'Correct. Only the data points lying on the margin gutters or violating the margin have non-zero Lagrange multipliers (alpha_i > 0).',
      },
      {
        id: 'c',
        text: 'The points with the smallest feature values across the axes',
        isCorrect: false,
        explanation:
          'Incorrect. Feature magnitude does not determine support vector status; geometric distance to the boundary does.',
      },
      {
        id: 'd',
        text: 'Every training sample equally with uniform weighting',
        isCorrect: false,
        explanation:
          'Incorrect. Unlike linear regression or Gaussian naive Bayes, SVM produces a sparse dual solution.',
      },
    ],
  },
  {
    id: 'svm-q2',
    question:
      'If the weight vector norm ||w|| increases, what happens to the geometric margin width between the support vector gutters?',
    options: [
      {
        id: 'a',
        text: 'The margin width narrows, because margin is given by 2 / ||w||',
        isCorrect: true,
        explanation:
          'Correct. The margin distance between the gutters w^T x + b = +1 and w^T x + b = -1 is exactly 2 / ||w||. Maximizing the margin corresponds to minimizing ||w||^2.',
      },
      {
        id: 'b',
        text: 'The margin width expands proportionally to ||w||',
        isCorrect: false,
        explanation:
          'Incorrect. Margin width is inversely proportional to the Euclidean norm of the weight vector.',
      },
      {
        id: 'c',
        text: 'The margin width remains completely unchanged regardless of ||w||',
        isCorrect: false,
        explanation:
          'Incorrect. ||w|| directly controls the slope and spatial gap between the functional margin boundaries.',
      },
      {
        id: 'd',
        text: 'The margin width rotates by ninety degrees in feature space',
        isCorrect: false,
        explanation: 'Incorrect. Vector norm affects scale and width, not perpendicular rotation.',
      },
    ],
  },
  {
    id: 'svm-q3',
    question:
      'What is the primary effect of choosing a very large regularization parameter C (e.g., C = 1000) in soft-margin SVM?',
    options: [
      {
        id: 'a',
        text: 'It forces a wider, softer margin that ignores noisy outliers',
        isCorrect: false,
        explanation:
          'Incorrect. Low C values yield soft margins; high C values heavily penalize margin violations.',
      },
      {
        id: 'b',
        text: 'It heavily penalizes slack violations, creating a narrow hard margin that risks overfitting',
        isCorrect: true,
        explanation:
          'Correct. As C approaches infinity, any margin penetration incur prohibitive loss, forcing the optimizer to fit noisy outliers at the cost of narrower margins.',
      },
      {
        id: 'c',
        text: 'It converts the linear kernel into an exponential radial basis function',
        isCorrect: false,
        explanation:
          'Incorrect. C is the penalty tradeoff parameter, completely independent of kernel selection.',
      },
      {
        id: 'd',
        text: 'It reduces the optimization runtime to linear time complexity',
        isCorrect: false,
        explanation:
          'Incorrect. High C often slows down quadratic solver convergence due to ill-conditioned dual box constraints.',
      },
    ],
  },
  {
    id: 'svm-q4',
    question:
      'Under Karush-Kuhn-Tucker (KKT) complementary slackness, what is the value of alpha_i for a data point safely inside its own class region?',
    options: [
      {
        id: 'a',
        text: 'alpha_i = C',
        isCorrect: false,
        explanation:
          'Incorrect. alpha_i = C corresponds to bounded support vectors that violate the margin gutter (xi_i > 0).',
      },
      {
        id: 'b',
        text: 'alpha_i = 0',
        isCorrect: true,
        explanation:
          'Correct. Because y_i(w^T x_i + b) > 1, the bracket term is strictly positive, forcing alpha_i = 0 by complementary slackness.',
      },
      {
        id: 'c',
        text: 'alpha_i is equal to the sample Euclidean distance from the origin',
        isCorrect: false,
        explanation:
          'Incorrect. Lagrange multipliers are dual optimization variables, not distance metrics from the coordinate origin.',
      },
      {
        id: 'd',
        text: 'alpha_i = -1',
        isCorrect: false,
        explanation:
          'Incorrect. Dual Lagrange multipliers in SVM are non-negative constraints (alpha_i >= 0).',
      },
    ],
  },
];

export function SvmFundamentalsPage() {
  const [showMath, setShowMath] = useState(false);
  const [predictionMade, setPredictionMade] = useState(false);
  const getConceptProgress = useProgressStore((state) => state.getConceptProgress);
  const progress = getConceptProgress('u5-svm-fundamentals');
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
        <span className="text-neutral-200">SVM Fundamentals</span>
      </nav>

      {/* 1. Header Section */}
      <header className="border-b border-border/40 pb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="unit">Unit 5 · Topic 4</Badge>
          <Badge variant="outline">CO4: Strengths & Limitations</Badge>
          <Badge variant="outline">CO3: Hyperparameter Optimization</Badge>
          <Badge variant="default">35 min read & lab</Badge>
          {isCompleted && (
            <Badge variant="success" className="flex items-center gap-1">
              <CheckCircle className="size-3" /> Completed
            </Badge>
          )}
        </div>

        <h1 className="font-manrope text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground">
          Support Vector Machines: Hyperplane & Margin
        </h1>
        <p className="mt-3 text-base sm:text-lg text-neutral-400 max-w-3xl leading-relaxed">
          Why settle for any separating line when you can construct the widest possible safety
          corridor? Explore the convex quadratic geometry behind the maximum margin classifier.
        </p>
      </header>

      {/* 2. The Hook (<= 80 words) */}
      <section className="mt-8">
        <Card className="p-5 sm:p-6 rounded-xl border border-orange-50/15 bg-black/10 backdrop-blur-sm shadow-none">
          <div className="flex items-start gap-3">
            <Shield className="size-5 text-amber-300 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-xs uppercase tracking-wider font-semibold text-amber-200/90 mb-1">
                The safety buffer challenge
              </h2>
              <p className="text-sm leading-relaxed text-neutral-300">
                Imagine two opposing armies camped across a plain. Any line between them avoids
                conflict today, but a sudden breeze or stumble puts soldiers dangerously close.{' '}
                <span className="font-montserrat font-medium text-yellow-800 dark:text-orange-100">
                  The safest border is the one maximizing the neutral no-man's-land
                </span>{' '}
                between them. Support Vector Machines construct this exact widest street, making
                predictions robust against noisy test-time jitter.
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* 3. Intuition */}
      <section className="mt-12 space-y-4">
        <h2 className="font-manrope text-2xl font-medium tracking-tight text-foreground">
          1. Intuition: The widest street principle
        </h2>
        <p className="text-sm leading-relaxed text-neutral-300">
          When data is linearly separable, an infinite number of candidate hyperplanes can achieve
          zero training error. Logistic regression finds one based on cross-entropy likelihood,
          while perceptrons stop at the first dividing line they stumble upon. SVM takes a
          fundamentally different stance:{' '}
          <span className="font-montserrat font-medium text-yellow-800 dark:text-orange-100">
            it picks the unique hyperplane that maximizes the geometric margin
          </span>{' '}
          to the closest data points.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <Card className="p-4 rounded-xl border border-border/50 bg-black/15 shadow-none">
            <span className="text-xs font-mono font-bold text-amber-300">01. The Hyperplane</span>
            <h3 className="text-sm font-semibold text-foreground mt-1 mb-1">Decision boundary</h3>
            <p className="text-xs text-neutral-400">
              The flat affine subspace {'$$w^T x + b = 0$$'} that cuts the feature space into two
              opposing class territories (+1 and -1).
            </p>
          </Card>

          <Card className="p-4 rounded-xl border border-border/50 bg-black/15 shadow-none">
            <span className="text-xs font-mono font-bold text-amber-300">02. Margin Gutters</span>
            <h3 className="text-sm font-semibold text-foreground mt-1 mb-1">Parallel boundaries</h3>
            <p className="text-xs text-neutral-400">
              The boundary lines {'$$w^T x + b = \\pm 1$$'}. The perpendicular distance between
              these gutters is {'$$\\frac{2}{\\|w\\|}$$'}.
            </p>
          </Card>

          <Card className="p-4 rounded-xl border border-border/50 bg-black/15 shadow-none">
            <span className="text-xs font-mono font-bold text-amber-300">03. Support Vectors</span>
            <h3 className="text-sm font-semibold text-foreground mt-1 mb-1">
              The critical pillars
            </h3>
            <p className="text-xs text-neutral-400">
              The only training samples that touch the gutters or penetrate the margin corridor.
              They alone dictate the orientation and intercept.
            </p>
          </Card>
        </div>
      </section>

      {/* 4. Interactive Lab with Predict-Then-Reveal */}
      <section className="mt-12 space-y-4">
        <h2 className="font-manrope text-2xl font-medium tracking-tight text-foreground">
          2. Interactive Lab: Maximum margin studio
        </h2>

        {!predictionMade && (
          <div className="rounded-xl border border-amber-900/40 bg-amber-950/15 p-4 text-xs text-neutral-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-semibold text-amber-200 block mb-0.5">
                Predict before tuning:
              </span>
              If you decrease penalty C from 10 to 0.05 on noisy data, what will happen to the
              margin corridor and support vectors?
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

        <SvmMarginLab />
      </section>

      {/* 5. Step-by-Step on Paper */}
      <section className="mt-12 space-y-4">
        <h2 className="font-manrope text-2xl font-medium tracking-tight text-foreground">
          3. Step-by-step on paper: 3-point geometry
        </h2>
        <p className="text-sm leading-relaxed text-neutral-300">
          Let us calculate the exact maximum margin hyperplane by hand for three 2D points:
        </p>

        <div className="rounded-lg border border-border/60 bg-neutral-900/60 p-4 font-mono text-xs space-y-1">
          <div>Point 1: x₁ = [1, 1], y₁ = +1</div>
          <div>Point 2: x₂ = [2, 0], y₂ = +1</div>
          <div>Point 3: x₃ = [0, 0], y₃ = -1</div>
        </div>

        <div className="space-y-3 text-xs leading-relaxed text-neutral-300">
          <p>
            <strong>Step 1: Identify support vector candidates.</strong> Point x₃ is at the origin
            with label -1. Point x₁ is closest to the origin with label +1. The separating line must
            be perpendicular to the vector joining (0,0) and (1,1).
          </p>
          <p>
            <strong>Step 2: Solve the hyperplane equations.</strong> The margin equations require{' '}
            {'$$w_1(1) + w_2(1) + b = +1$$'} and {'$$w_1(0) + w_2(0) + b = -1$$'}. From the second
            equation, {'$$b = -1$$'}. Substituting into the first gives{' '}
            {'$$w_1 + w_2 - 1 = 1 \\implies w_1 + w_2 = 2$$'}. By symmetry, {'$$w_1 = 1$$'} and{' '}
            {'$$w_2 = 1$$'}.
          </p>
          <p>
            <strong>Step 3: Calculate the geometric margin.</strong> The Euclidean norm is{' '}
            {'$$\\|w\\| = \\sqrt{1^2 + 1^2} = \\sqrt{2}$$'}. The margin width between the gutters is{' '}
            {'$$\\frac{2}{\\|w\\|} = \\frac{2}{\\sqrt{2}} = \\sqrt{2} \\approx 1.414$$'}.
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
          Support Vector Machine training is formalized as a convex quadratic programming problem
          with linear inequality constraints.
        </p>

        {showMath && (
          <Card className="p-5 sm:p-6 rounded-xl border border-orange-50/15 bg-black/15 backdrop-blur-sm space-y-4 text-xs leading-relaxed">
            <div>
              <h3 className="font-semibold text-amber-200 mb-1">Primal Soft-Margin Formulation</h3>
              <p className="text-neutral-400 mb-2">
                We balance margin maximization (minimizing norm) against total margin violations
                using slack variables {'$$\\xi_i$$'}:
              </p>
              <div className="rounded bg-neutral-900/80 p-3 font-mono text-[11px] overflow-x-auto">
                {'$$\\min_{w, b, \\xi} \\frac{1}{2} \\|w\\|^2 + C \\sum_{i=1}^N \\xi_i$$'}
                <br />
                {
                  '$$\\text{subject to } y_i (w^T x_i + b) \\ge 1 - \\xi_i, \\quad \\xi_i \\ge 0 \\quad \\forall i$$'
                }
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-amber-200 mb-1">The Lagrangian Dual Formulation</h3>
              <p className="text-neutral-400 mb-2">
                By introducing Lagrange multipliers {'$$\\alpha_i \\ge 0$$'}, the problem converts
                to a dual optimization problem depending only on inner products:
              </p>
              <div className="rounded bg-neutral-900/80 p-3 font-mono text-[11px] overflow-x-auto">
                {
                  '$$\\max_{\\alpha} \\sum_{i=1}^N \\alpha_i - \\frac{1}{2} \\sum_{i=1}^N \\sum_{j=1}^N \\alpha_i \\alpha_j y_i y_j (x_i^T x_j)$$'
                }
                `
                <br />
                {
                  '$$\\text{subject to } 0 \\le \\alpha_i \\le C, \\quad \\sum_{i=1}^N \\alpha_i y_i = 0$$'
                }
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-amber-200 mb-1">
                Karush-Kuhn-Tucker (KKT) Conditions
              </h3>
              <p className="text-neutral-400">
                At the optimal solution, the complementary slackness conditions state:
                {'$$\\alpha_i [y_i(w^T x_i + b) - 1 + \\xi_i] = 0$$'}. If a point is safely beyond
                the margin ({'$$y_i(w^T x_i + b) > 1$$'}), then {'$$\\alpha_i = 0$$'}. It has zero
                impact on the weights.
              </p>
            </div>
          </Card>
        )}
      </section>

      {/* 7. Algorithm Pseudocode */}
      <section className="mt-12 space-y-4">
        <h2 className="font-manrope text-2xl font-medium tracking-tight text-foreground">
          5. Algorithm pseudocode: Platt's SMO
        </h2>
        <Card className="p-4 rounded-xl border border-border/50 bg-black/20 font-mono text-xs overflow-x-auto">
          <pre className="text-neutral-300 leading-snug">
            {`Algorithm: Simplified Sequential Minimal Optimization (SMO)
Input: Training matrix X (N x d), labels y in {-1, +1}, penalty C, tolerance tol
Output: Alpha vector α, intercept b, weight vector w

1. Initialize α_i = 0 for all i in [1..N], b = 0
2. While passes < maxPasses and not converged:
3.   numChangedAlphas = 0
4.   For i = 1 to N:
5.     E_i = f(x_i) - y_i
6.     If (y_i * E_i < -tol and α_i < C) or (y_i * E_i > tol and α_i > 0):
7.       Select index j != i (heuristic or random)
8.       E_j = f(x_j) - y_j
9.       Compute clipping bounds L, H from α_i, α_j, y_i, y_j, and C
10.      Compute η = 2 * K(x_i, x_j) - K(x_i, x_i) - K(x_j, x_j)
11.      If η >= 0: continue
12.      α_j_new = clip(α_j - (y_j * (E_i - E_j)) / η, L, H)
13.      α_i_new = α_i + y_i * y_j * (α_j - α_j_new)
14.      Update b_1, b_2, and b based on KKT conditions
15.      numChangedAlphas += 1
16.   If numChangedAlphas == 0: passes += 1 else: passes = 0
17. Compute w = Σ α_i * y_i * x_i for all support vectors (α_i > 0)`}
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
import numpy as np

# 1. Linearly separable synthetic points
X = np.array([[1.0, 2.2], [2.2, 3.0], [2.5, 1.2],
              [-1.0, -1.2], [-2.2, -1.0], [-1.2, -2.5]])
y = np.array([1, 1, 1, -1, -1, -1])

# 2. Train linear maximum margin classifier
clf = SVC(kernel='linear', C=1.0)
clf.fit(X, y)

# 3. Inspect hyperplanes and support vectors
print("Weights w:", clf.coef_[0])
print("Bias b:", clf.intercept_[0])
print("Support vector indices:", clf.support_)
print("Support vector coordinates:\\n", clf.support_vectors_)

# 4. Calculate geometric margin width: 2 / ||w||
w_norm = np.linalg.norm(clf.coef_[0])
margin_width = 2.0 / w_norm
print(f"Margin width: {margin_width:.4f}")`}
          </pre>
        </Card>
      </section>

      {/* 9. Make It Fail */}
      <section className="mt-12 space-y-4">
        <h2 className="font-manrope text-2xl font-medium tracking-tight text-foreground flex items-center gap-2">
          <AlertTriangle className="size-5 text-orange-400" />
          7. Make it fail: The linear non-separability trap
        </h2>
        <p className="text-sm leading-relaxed text-neutral-300">
          What happens when data points cannot be separated by any single straight line? Look at the
          classic XOR problem:
        </p>

        <Card className="p-4 rounded-xl border border-orange-500/20 bg-orange-950/10 space-y-2 text-xs">
          <p className="text-neutral-300">
            <strong>The failure mechanism:</strong> In XOR, diagonal points share labels: (+1, +1)
            and (-1, -1) belong to class +1, while (+1, -1) and (-1, +1) belong to class -1. No flat
            hyperplane can cut across both diagonals simultaneously.
          </p>
          <p className="text-neutral-300">
            <strong>The consequence:</strong> A linear SVM solver with high C will either oscillate,
            blow up slack penalties, or place the hyperplane arbitrarily, yielding 50% chance
            accuracy.
          </p>
          <p className="text-amber-300 font-semibold">
            The solution: The Kernel Trick (covered in our next lesson), which maps these
            coordinates into higher dimensions where a hyperplane can slice through them!
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
                <strong>Convex global optimum:</strong> No local minima; unlike neural networks, the
                quadratic program always finds the unique optimal hyperplane.
              </li>
              <li>
                <strong>Sparse dual solution:</strong> Only support vectors need to be stored in
                memory for inference.
              </li>
              <li>
                <strong>High-dimensional robustness:</strong> Performs exceptionally well even when
                number of features exceeds sample count (e.g., text, genomics).
              </li>
            </ul>
          </Card>

          <Card className="p-4 rounded-xl border border-red-900/30 bg-red-950/10 shadow-none text-xs space-y-2">
            <h3 className="font-semibold text-red-300 text-sm">Limitations & When NOT to use</h3>
            <ul className="space-y-1.5 text-neutral-300 list-disc list-inside">
              <li>
                <strong>Training complexity:</strong> Scales between {'$$O(N^2)$$'} and{' '}
                {'$$O(N^3)$$'} with sample size N. Unsuitable for datasets with millions of rows.
              </li>
              <li>
                <strong>Extreme sensitivity to scaling:</strong> Features must be standardized (zero
                mean, unit variance) or distance-based margins collapse.
              </li>
              <li>
                <strong>No calibrated probabilities:</strong> SVM produces raw signed distances,
                requiring Platt scaling for probabilities.
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
              Misconception: "Every training point contributes to drawing the SVM boundary."
            </span>
            <p className="text-neutral-400">
              Reality: Points that lie safely on the correct side of the margin gutter have Lagrange
              multiplier alpha = 0. You can delete 90% of the training set without changing the
              boundary line by a single pixel.
            </p>
          </Card>

          <Card className="p-4 rounded-xl border border-border/50 bg-black/15 shadow-none text-xs">
            <span className="font-semibold text-red-300 block mb-1">
              Misconception: "A higher C parameter always makes the model perform better."
            </span>
            <p className="text-neutral-400">
              Reality: A very high C parameter creates a hard margin with zero tolerance for errors,
              causing the boundary to bend awkwardly around noisy outliers and severely overfitting
              test data.
            </p>
          </Card>
        </div>
      </section>

      {/* 12. Check Yourself (Micro-Quiz) */}
      <section className="mt-12 space-y-4">
        <h2 className="font-manrope text-2xl font-medium tracking-tight text-foreground">
          10. Check yourself: Micro-quiz
        </h2>
        <Quiz conceptId="u5-svm-fundamentals" items={QUIZ_ITEMS} />
      </section>

      {/* 13. Exam & Viva Corner */}
      <section className="mt-12 space-y-4">
        <h2 className="font-manrope text-2xl font-medium tracking-tight text-foreground">
          11. Exam & viva corner
        </h2>
        <Card className="p-5 rounded-xl border border-border/50 bg-black/15 space-y-3 text-xs">
          <div>
            <h3 className="font-semibold text-amber-200">
              Q: Derive why the geometric margin width between gutters is 2 / ||w||.
            </h3>
            <p className="text-neutral-400 mt-1 leading-relaxed">
              Model answer: Let x_pos lie on the positive gutter (w^T x_pos + b = +1) and x_neg lie
              on the negative gutter (w^T x_neg + b = -1). The vector connecting them is projected
              onto the unit normal vector w / ||w||. The margin width is:
              {
                '$$\\gamma = \\frac{w^T (x_{pos} - x_{neg})}{\\|w\\|} = \\frac{(1 - b) - (-1 - b)}{\\|w\\|} = \\frac{2}{\\|w\\|}$$'
              }
              .
            </p>
          </div>

          <div className="pt-2 border-t border-border/40">
            <h3 className="font-semibold text-amber-200">
              Q: What are the role of slack variables ξ_i in soft-margin SVM?
            </h3>
            <p className="text-neutral-400 mt-1 leading-relaxed">
              Model answer: Slack variables allow for classification violations in non-linearly
              separable or noisy data. If 0 &lt; ξ_i &le; 1, the point is correctly classified but
              falls within the margin corridor. If ξ_i &gt; 1, the point is misclassified.
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
            SVM is a maximum margin classifier that searches for the widest street between classes.
          </li>
          <li>
            The margin distance equals 2 / ||w||, making margin maximization equivalent to
            minimizing ||w||^2 / 2.
          </li>
          <li>
            Only support vectors (alpha_i &gt; 0) determine the separating hyperplane parameters w
            and b.
          </li>
          <li>
            The regularization parameter C balances margin width against slack violation penalties.
          </li>
          <li>
            Linear SVM fails on non-separable geometries such as concentric circles and XOR
            problems.
          </li>
        </ul>

        <div className="flex items-center justify-between p-4 rounded-xl border border-orange-50/20 bg-black/20">
          <div>
            <span className="text-[11px] text-neutral-400 block">Next topic</span>
            <span className="text-sm font-semibold text-foreground">
              SVM Soft-Margin & The Kernel Trick
            </span>
          </div>
          <Link to="/learn/unit-5/svm-kernels">
            <Button variant="primary" size="sm">
              Explore kernel trick <ArrowRight className="size-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
