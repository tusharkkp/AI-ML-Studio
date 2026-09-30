import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Quiz } from '@/features/quiz/Quiz';
import { useProgressStore } from '@/features/progress/useProgressStore';
import { DecisionTreeRegressionLab } from '@/labs/dt-regression/DecisionTreeRegressionLab';
import {
  GitBranch,
  TrendingUp,
  AlertTriangle,
  HelpCircle,
  Award,
  ArrowRight,
  Copy,
  Check,
} from 'lucide-react';

export const DecisionTreeRegressionPage: React.FC = () => {
  const [copiedPython, setCopiedPython] = useState(false);
  const getConceptProgress = useProgressStore((state) => state.getConceptProgress);
  const progress = getConceptProgress('u5-further-dt-regression');
  const isCompleted = Boolean(progress?.labCompleted || progress?.read);

  const pythonSnippet = `import numpy as np
import matplotlib.pyplot as plt
from sklearn.tree import DecisionTreeRegressor
from sklearn.metrics import mean_squared_error

# 1. Generate Non-Linear 1D Wave Dataset
np.random.seed(42)
X = np.sort(np.random.rand(80, 1) * 5, axis=0)
y = np.sin(X).ravel() + np.random.normal(0, 0.15, X.shape[0])

# 2. Fit Regression Trees at Varying Depths
# Depth 2 (smooth step generalization) vs Depth 5 (overfitting noisy points)
regr_depth2 = DecisionTreeRegressor(max_depth=2, random_state=42)
regr_depth5 = DecisionTreeRegressor(max_depth=5, random_state=42)

regr_depth2.fit(X, y)
regr_depth5.fit(X, y)

# 3. Test In-Domain Predictions and Out-of-Domain Extrapolation [0, 8]
X_test = np.arange(0.0, 8.0, 0.02)[:, np.newaxis]
y_pred2 = regr_depth2.predict(X_test)
y_pred5 = regr_depth5.predict(X_test)

mse2 = mean_squared_error(y, regr_depth2.predict(X))
mse5 = mean_squared_error(y, regr_depth5.predict(X))

print(f"Depth 2 Training MSE: {mse2:.4f} (Leaves: {regr_depth2.get_n_leaves()})")
print(f"Depth 5 Training MSE: {mse5:.4f} (Leaves: {regr_depth5.get_n_leaves()})")
print(f"Extrapolation check at x=7.5: Pred={y_pred2[-1]:.3f} (Constant step trap)")
`;

  const copyCode = () => {
    void navigator.clipboard.writeText(pythonSnippet);
    setCopiedPython(true);
    setTimeout(() => setCopiedPython(false), 2000);
  };

  const quizItems = [
    {
      id: 'dtr-q1',
      question:
        'What mathematical split criterion does a CART regression tree optimize at each internal node when choosing feature j and threshold s?',
      options: [
        {
          id: 'A',
          text: 'Variance Reduction / Reduction in Sum of Squared Errors (SSE), seeking the split that minimizes the weighted sum of child leaf variances.',
          isCorrect: true,
          explanation:
            'While classification trees use Gini impurity or Entropy, regression trees evaluate continuous targets by minimizing residual sum of squares (SSE) or variance reduction: Var(S) - [|S_L|/|S| Var(S_L) + |S_R|/|S| Var(S_R)].',
        },
        {
          id: 'B',
          text: 'Information Gain using Shannon Entropy of continuous bin histograms.',
          isCorrect: false,
          explanation:
            'Standard CART regression trees minimize squared error loss (variance) rather than binning continuous variables into discrete entropy histograms.',
        },
        {
          id: 'C',
          text: 'Margin maximization between upper and lower residual quantiles.',
          isCorrect: false,
          explanation:
            'Margin maximization is the optimization objective of Support Vector Machines, not CART regression trees.',
        },
      ],
    },
    {
      id: 'dtr-q2',
      question:
        'Why does a decision tree regressor produce completely flat horizontal predictions when queried outside its training domain (e.g. predicting future dates or higher incomes)?',
      options: [
        {
          id: 'A',
          text: 'Because decision trees partition input space into orthogonal hypercubes with constant leaf predictions: any query beyond x_max routes to the outermost leaf, outputting that leaf constant without trend slope.',
          isCorrect: true,
          explanation:
            'Tree models do not compute a global slope or gradient (unlike linear models or neural nets). If training data spans x in [0, 10], any query at x = 100 falls into the rightmost leaf with no slope extrapolation.',
        },
        {
          id: 'B',
          text: 'Because scikit-learn clips all inputs to the range [0, 1] internally.',
          isCorrect: false,
          explanation:
            'Scikit-learn does not clip inputs; the limitation is intrinsic to the piecewise constant mathematical structure of the tree.',
        },
        {
          id: 'C',
          text: 'Because regression trees can only be evaluated on training instances.',
          isCorrect: false,
          explanation:
            'Regression trees can evaluate any query point; the issue is that out-of-domain extrapolation outputs a flat constant.',
        },
      ],
    },
    {
      id: 'dtr-q3',
      question:
        'In a regression tree leaf node m containing dataset partition S_m, what value minimizes the Mean Squared Error loss L(y, c) = sum (y_i - c)^2?',
      options: [
        {
          id: 'A',
          text: 'c* = mean(y_i) for all i in S_m, because the sample mean is the unique minimizer of quadratic Euclidean distance.',
          isCorrect: true,
          explanation:
            'Differentiating sum (y_i - c)^2 with respect to c and setting to zero yields -2 * sum (y_i - c) = 0 => c* = (1/N) * sum y_i. If Mean Absolute Error (MAE / L1) were used instead, the optimal leaf value would be the median.',
        },
        {
          id: 'B',
          text: 'c* = median(y_i), which minimizes squared error.',
          isCorrect: false,
          explanation:
            'The median minimizes L1 Mean Absolute Error, whereas the mean minimizes L2 Mean Squared Error.',
        },
        {
          id: 'C',
          text: 'c* = mode(y_i), representing the most frequent continuous value.',
          isCorrect: false,
          explanation:
            'Continuous real variables rarely have identical duplicate values; the mode is undefined for continuous distributions.',
        },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 sm:px-12 space-y-12">
      {/* 1. Hero Header & Syllabus Mapping */}
      <div className="border-b border-orange-50/15 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs font-mono text-neutral-400"
          >
            <Link to="/learn/unit-5" className="hover:text-brand transition-colors">
              Unit 5: Linear & Decision Models
            </Link>
            <span>/</span>
            <span className="text-foreground dark:text-neutral-200">Decision Tree Regression</span>
          </nav>
          {isCompleted && (
            <Badge variant="success" size="sm">
              Completed
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="unit">Unit 5 Further Reading</Badge>
          <Badge variant="outline">0.3 Hour Lab</Badge>
          <Badge variant="outline">Course Outcome: CO3, CO4</Badge>
          <Badge variant="outline">CART Continuous Regression</Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground font-manrope">
          Further reading: Decision tree for regression
        </h1>
        <p className="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-300 font-montserrat leading-relaxed max-w-3xl">
          Explore Leo Breiman's CART regression architecture, learning how recursive variance
          reduction constructs{' '}
          <span className="font-montserrat font-medium text-yellow-800 dark:text-orange-100">
            piecewise constant staircase approximations and why trees cannot extrapolate trends
          </span>
          .
        </p>
      </div>

      {/* 2. Intuition */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground font-manrope flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-emerald-400" />
          1. Geometric intuition: Slicing curves into flat steps
        </h2>
        <div className="text-sm text-neutral-600 dark:text-neutral-300 font-montserrat leading-relaxed space-y-3">
          <p>
            When we use decision trees for classification, the tree draws orthogonal dividing lines
            to separate cats from dogs. When predicting a continuous numerical quantity like housing
            prices or temperatures, however, the tree partitions the continuous input space into
            rectangular bins. Inside each terminal leaf bin, the tree predicts a single horizontal
            flat value: the sample average of all training points that landed there.
          </p>
          <p>
            As tree depth increases, the staircase steps become narrower and more numerous, hugging
            smooth curves with increasing fidelity. But this piecewise constant nature reveals a
            fundamental quirk: a decision tree model has zero concept of a mathematical derivative
            or slope. If asked to predict future revenue beyond the historical maximum training
            period,{' '}
            <span className="font-montserrat font-medium text-yellow-800 dark:text-orange-100">
              a regression tree outputs a completely flat horizontal line forever
            </span>
            , making it structurally blind to unbounded upward trends.
          </p>
        </div>
      </section>

      {/* 3. Interactive Lab */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground font-manrope flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand" />
            2. Interactive lab: Piecewise constant staircase studio
          </h2>
          <Badge variant="outline" size="sm">
            Interactive Engine
          </Badge>
        </div>
        <p className="text-xs text-neutral-400 font-montserrat">
          Adjust tree depth from 1 to 6, watch variance reduction create step boundaries, and
          witness the extrapolation trap on queries beyond {'\\(x > 1.0\\)'}.
        </p>
        <DecisionTreeRegressionLab />
      </section>

      {/* 4. Step-by-Step on Paper */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground font-manrope">
          3. Step-by-step on paper: Splitting on variance reduction
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-montserrat">
          <Card className="p-4 border-orange-50/15 bg-neutral-900/40 space-y-2">
            <div className="font-bold font-manrope text-sm text-foreground flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-brand/20 text-brand flex items-center justify-center font-mono">
                1
              </span>
              Compute Parent Variance
            </div>
            <p className="text-neutral-400 leading-relaxed">
              Calculate total parent variance on subset {'\\(S\\)'}:
            </p>
            <div className="p-2 rounded bg-black/40 font-mono text-cream text-center">
              {'$$\\text{Var}(S) = \\frac{1}{|S|}\\sum_{i \\in S}(y_i - \\bar{y}_S)^2$$'}
            </div>
          </Card>

          <Card className="p-4 border-orange-50/15 bg-neutral-900/40 space-y-2">
            <div className="font-bold font-manrope text-sm text-foreground flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-brand/20 text-brand flex items-center justify-center font-mono">
                2
              </span>
              Find Candidate Split (j, s)
            </div>
            <p className="text-neutral-400 leading-relaxed">
              Evaluate all thresholds {'\\(s\\)'} across features {'\\(j\\)'} to maximize variance
              reduction:
            </p>
            <div className="p-2 rounded bg-black/40 font-mono text-cream text-center">
              {
                '$$\\Delta = \\text{Var}(S) - \\left[\\frac{|S_L|}{|S|}\\text{Var}(S_L) + \\frac{|S_R|}{|S|}\\text{Var}(S_R)\\right]$$'
              }
            </div>
          </Card>

          <Card className="p-4 border-orange-50/15 bg-neutral-900/40 space-y-2">
            <div className="font-bold font-manrope text-sm text-foreground flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-brand/20 text-brand flex items-center justify-center font-mono">
                3
              </span>
              Assign Leaf Mean (c*)
            </div>
            <p className="text-neutral-400 leading-relaxed">
              When stopping depth is reached, assign constant prediction equal to local partition
              average:
            </p>
            <div className="p-2 rounded bg-black/40 font-mono text-cream text-center">
              {'$$c_m^* = \\frac{1}{|S_m|}\\sum_{i \\in S_m} y_i$$'}
            </div>
          </Card>
        </div>
      </section>

      {/* 5. Formal Mathematical Foundations */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground font-manrope">
          4. Formal mathematical foundations: CART continuous regression
        </h2>
        <div className="p-5 rounded-xl border border-orange-50/15 bg-neutral-900/50 space-y-4 text-xs font-montserrat leading-relaxed">
          <p className="text-neutral-300">
            Consider a continuous dataset{' '}
            {'\\(D = \\{(\\mathbf{x}_1, y_1), \\dots, (\\mathbf{x}_N, y_N)\\}\\)'} where{' '}
            {'\\(y_i \\in \\mathbb{R}\\)'}. A regression tree partitions the feature space into{' '}
            {'\\(M\\)'} disjoint orthogonal regions {'\\(R_1, R_2, \\dots, R_M\\)'}. The tree model
            is formally expressed as:
          </p>
          <div className="p-2.5 rounded-lg bg-black/40 font-mono text-center text-cream my-2">
            {'$$f(\\mathbf{x}) = \\sum_{m=1}^M c_m \\cdot I(\\mathbf{x} \\in R_m)$$'}
          </div>
          <p className="text-neutral-300">
            Under squared error loss {'\\(L(y, f(\\mathbf{x})) = (y - f(\\mathbf{x}))^2\\)'}, the
            optimal leaf parameter {'\\(\\hat{c}_m\\)'}
            is the sample mean of {'\\(y_i\\)'} in region {'\\(R_m\\)'}:
          </p>
          <div className="p-2.5 rounded-lg bg-black/40 font-mono text-center text-cream my-2">
            {
              '$$\\hat{c}_m = \\text{ave}(y_i \\mid \\mathbf{x}_i \\in R_m) = \\frac{1}{N_m} \\sum_{\\mathbf{x}_i \\in R_m} y_i$$'
            }
          </div>
          <p className="text-neutral-300">
            At any internal node, seeking the optimal splitting variable {'\\(j\\)'} and split point{' '}
            {'\\(s\\)'} defines two half-planes:
          </p>
          <div className="p-2.5 rounded-lg bg-black/40 font-mono text-center text-cream my-2">
            {
              '$$R_1(j, s) = \\{\\mathbf{x} \\mid x_j \\le s\\}, \\quad R_2(j, s) = \\{\\mathbf{x} \\mid x_j > s\\}$$'
            }
          </div>
          <p className="text-neutral-300">The algorithm solves:</p>
          <div className="p-2.5 rounded-lg bg-black/40 font-mono text-center text-cream my-2">
            {
              '$$\\min_{j, s} \\left[ \\sum_{\\mathbf{x}_i \\in R_1(j, s)} (y_i - \\hat{c}_1)^2 + \\sum_{\\mathbf{x}_i \\in R_2(j, s)} (y_i - \\hat{c}_2)^2 \\right]$$'
            }
          </div>
        </div>
      </section>

      {/* 6. Algorithm Pseudocode */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground font-manrope">
          5. Algorithm pseudocode: CART recursive regression tree
        </h2>
        <Card className="p-5 border-orange-50/15 bg-black/30 font-mono text-xs leading-relaxed overflow-x-auto text-neutral-300">
          <pre>{`ALGORITHM BuildRegressionTree(Dataset S, current_depth, max_depth, min_samples):
  1. Calculate sample mean: c_hat = Mean(y_i for all i in S)
  2. Calculate node SSE: SSE = SUM_{i in S} (y_i - c_hat)^2
  
  3. IF current_depth >= max_depth OR |S| <= min_samples OR SSE < epsilon:
       RETURN LeafNode(value = c_hat)
       
  4. Initialize best_reduction = -infinity, best_j = None, best_s = None
  
  5. FOR each feature j in {1, ..., d}:
       FOR each candidate threshold s between adjacent sorted values in S[j]:
         S_L = { (x, y) in S | x_j <= s }
         S_R = { (x, y) in S | x_j > s }
         
         IF |S_L| == 0 OR |S_R| == 0:
           CONTINUE
           
         SSE_L = SUM_{i in S_L} (y_i - Mean(S_L))^2
         SSE_R = SUM_{i in S_R} (y_i - Mean(S_R))^2
         
         reduction = SSE - (SSE_L + SSE_R)
         
         IF reduction > best_reduction:
           best_reduction = reduction
           best_j = j
           best_s = s
           best_S_L = S_L
           best_S_R = S_R
           
  6. IF best_reduction <= 0:
       RETURN LeafNode(value = c_hat)
       
  7. LeftSubtree  = BuildRegressionTree(best_S_L, current_depth + 1, max_depth, min_samples)
  8. RightSubtree = BuildRegressionTree(best_S_R, current_depth + 1, max_depth, min_samples)
  
  9. RETURN InternalNode(feature = best_j, threshold = best_s, left = LeftSubtree, right = RightSubtree)`}</pre>
        </Card>
      </section>

      {/* 7. Code It in Python */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground font-manrope">
            6. Code it in Python: Scikit-learn regression tree
          </h2>
          <Button
            size="sm"
            variant="outline"
            onClick={copyCode}
            className="flex items-center gap-1.5 text-xs"
          >
            {copiedPython ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Code
              </>
            )}
          </Button>
        </div>
        <Card className="p-5 border-orange-50/15 bg-black/40 font-mono text-xs leading-relaxed overflow-x-auto text-neutral-300">
          <pre>{pythonSnippet}</pre>
        </Card>
      </section>

      {/* 8. Make It Fail */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground font-manrope flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
          7. Make it fail: The flat extrapolation trap
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-montserrat">
          <Card className="p-4 border-yellow-500/20 bg-yellow-950/10 space-y-2">
            <h4 className="font-bold text-yellow-400 font-manrope text-sm">
              Extrapolation Blindness (x &gt; x_max)
            </h4>
            <p className="text-neutral-300 leading-relaxed">
              If a regression tree is trained on stock prices or GDP from 2000 to 2024, querying it
              for year 2030 will output the exact flat horizontal mean of the 2024 rightmost leaf
              node! A regression tree cannot learn or project continuous slopes like linear models
              or splines.
            </p>
          </Card>

          <Card className="p-4 border-yellow-500/20 bg-yellow-950/10 space-y-2">
            <h4 className="font-bold text-yellow-400 font-manrope text-sm">
              Discontinuous Step Artifacts
            </h4>
            <p className="text-neutral-300 leading-relaxed">
              Real physical phenomena (aerodynamics, temperatures, acoustic waves) are continuous
              and smooth ({'\\(C^1\\)'} differentiable). A regression tree outputs jump
              discontinuities at split thresholds, causing unnatural cliffs in predicted
              trajectories.
            </p>
          </Card>
        </div>
      </section>

      {/* 9. Strengths, Limitations & When NOT to Use */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground font-manrope">
          8. Strengths, limitations & when NOT to use
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-montserrat">
          <Card className="p-4 border-emerald-500/20 bg-emerald-950/10 space-y-2">
            <h4 className="font-bold text-emerald-400 font-manrope text-sm">
              Strengths of Regression Trees
            </h4>
            <ul className="list-disc list-inside space-y-1 text-neutral-300">
              <li>
                Non-parametric: captures arbitrary complex non-linear relations without feature
                transformations.
              </li>
              <li>
                Robust to outliers in predictors {'\\(\\mathbf{x}\\)'} due to rank-based splitting.
              </li>
              <li>Natively accommodates mixed categorical and numerical feature sets.</li>
              <li>Directly interpretable if tree depth is shallow ({'\\(\\le 3\\)'}).</li>
            </ul>
          </Card>

          <Card className="p-4 border-red-500/20 bg-red-950/10 space-y-2">
            <h4 className="font-bold text-red-400 font-manrope text-sm">
              Limitations & When NOT to Use
            </h4>
            <ul className="list-disc list-inside space-y-1 text-neutral-300">
              <li>
                Do NOT use for time-series forecasting where upward or downward extrapolation is
                required.
              </li>
              <li>
                High variance: small changes in training data can completely alter the tree
                structure.
              </li>
              <li>
                Inefficient at modeling simple linear diagonal trends (requires dozens of staircase
                steps).
              </li>
              <li>
                Step discontinuities are unsuitable for control systems requiring smooth gradients.
              </li>
            </ul>
          </Card>
        </div>
      </section>

      {/* 10. Common Misconceptions */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground font-manrope">
          9. Common misconceptions
        </h2>
        <div className="space-y-3 text-xs font-montserrat">
          {[
            {
              myth: 'DecisionTreeRegressor fits a linear regression line inside each leaf.',
              fact: 'Standard CART regression trees predict a single constant scalar value (the partition mean) per leaf. Fitting linear models in leaves is a specialized extension known as Model Trees (e.g. M5P algorithm).',
            },
            {
              myth: 'Regression trees optimize Information Gain using Shannon Entropy.',
              fact: 'Entropy is formulated for discrete probability distributions. Standard regression trees minimize continuous squared loss (variance reduction) or absolute error.',
            },
            {
              myth: 'Normalizing features with StandardScaler improves regression tree accuracy.',
              fact: 'Because tree splitting depends solely on ordering inequalities (x_j <= s), monotonic scaling transformations have zero effect on split locations or tree topology.',
            },
          ].map((item, idx) => (
            <Card key={idx} className="p-4 border-orange-50/10 bg-neutral-900/40 space-y-1">
              <div className="font-bold text-red-400 font-manrope text-sm">Myth: "{item.myth}"</div>
              <div className="text-neutral-300 leading-relaxed">
                <span className="text-emerald-400 font-semibold">Reality:</span> {item.fact}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 11. Check Yourself (Micro-Quiz) */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground font-manrope flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-brand" />
          10. Check yourself: Regression tree micro-quiz
        </h2>
        <Quiz items={quizItems} conceptId="u5-further-dt-regression" />
      </section>

      {/* 12. Exam & Viva Corner */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground font-manrope flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-500" />
          11. Exam & viva corner
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-montserrat">
          <Card className="p-4 border-orange-50/15 bg-neutral-900/40 space-y-2">
            <h4 className="font-bold text-foreground font-manrope text-sm">
              Viva Question 1: How does CART choose the prediction value in each leaf?
            </h4>
            <p className="text-neutral-400 leading-relaxed">
              "Under Mean Squared Error loss (L2), the leaf prediction is the arithmetic mean of
              targets in that node because the mean minimizes quadratic distance. If the tree
              optimizes Mean Absolute Error (L1), the optimal leaf prediction is the median."
            </p>
          </Card>

          <Card className="p-4 border-orange-50/15 bg-neutral-900/40 space-y-2">
            <h4 className="font-bold text-foreground font-manrope text-sm">
              Viva Question 2: Why are regression trees dangerous for financial forecasting?
            </h4>
            <p className="text-neutral-400 leading-relaxed">
              "Financial time series frequently experience inflationary trends or market growth
              outside historical ranges. A regression tree cannot extrapolate: any input above
              historical maximum outputs the last leaf's constant mean, completely ignoring growth
              trends."
            </p>
          </Card>
        </div>
      </section>

      {/* 13. Summary & Key Takeaways */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground font-manrope">
          12. Summary & key takeaways
        </h2>
        <Card className="p-5 border-orange-50/15 bg-black/20 space-y-2 text-xs font-montserrat text-neutral-300 leading-relaxed">
          <p>
            1. <strong className="text-foreground">Continuous Variance Reduction:</strong> CART
            regression trees recursively split feature space by finding thresholds that maximize
            reduction in squared error (SSE) or variance.
          </p>
          <p>
            2. <strong className="text-foreground">Piecewise Constant Functions:</strong>{' '}
            Predictions are discrete staircase horizontal steps, with each leaf outputting the local
            partition mean {'\\(\\bar{y}_m\\)'}.
          </p>
          <p>
            3. <strong className="text-foreground">Inability to Extrapolate:</strong> Because trees
            do not fit continuous slopes, queries beyond the training domain produce flat horizontal
            lines, making them unsuited for trending time series.
          </p>
        </Card>
      </section>

      {/* 14. What's Next */}
      <section className="border-t border-orange-50/15 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-xs text-neutral-400 font-mono">Unit 5 Capstone</div>
          <div className="text-base font-semibold text-foreground font-manrope">
            Unit 5 Timed Practice Exam & Master Cheat Sheet
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/cheatsheets/unit-5">
            <Button variant="outline" className="text-xs">
              Open Revision Sheet
            </Button>
          </Link>
          <Link to="/learn/unit-5/exam">
            <Button variant="primary" className="flex items-center gap-2 text-xs">
              Take Unit 5 Exam
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
