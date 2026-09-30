import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Link } from 'react-router-dom';
import { Printer, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';

interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

const VIVA_FLASHCARDS: Flashcard[] = [
  {
    id: 'f1',
    question:
      'What is the fundamental difference between Pre-Pruning and Post-Pruning in Decision Trees?',
    answer:
      'Pre-pruning halts tree construction early based on heuristics (max_depth, min_samples_split, min_impurity_decrease), which is fast but risks horizon effects (stopping right before a high-gain compound split). Post-pruning builds a maximal unconstrained tree first, then collapses subtrees using cost-complexity pruning (R_alpha(T) = R(T) + alpha * |T|) on holdout validation data.',
  },
  {
    id: 'f2',
    question:
      'Explain why maximizing the SVM geometric margin 2 / ||w|| is formulated as minimizing 0.5 * ||w||^2.',
    answer:
      'The geometric distance between canonical margin gutters w^T x + b = +1 and w^T x + b = -1 is 2 / ||w||. Maximizing 2 / ||w|| is equivalent to minimizing ||w|| / 2. Squaring the norm yields a convex quadratic objective function J(w) = 0.5 * ||w||^2, which guarantees a single unique global minimum with zero local minima and allows quadratic programming solvers to find the exact optimum.',
  },
  {
    id: 'f3',
    question: "State Mercer's theorem and explain why it is essential for SVM kernel functions.",
    answer:
      'Mercer’s condition requires that for any valid kernel function K(x, z), the resulting Gram matrix K_{ij} = K(x_i, x_j) must be symmetric positive semi-definite (all eigenvalues lambda >= 0). This guarantees that the optimization problem remains strictly convex and corresponds to an inner product in a valid reproducing kernel Hilbert space (RKHS) without generating imaginary distances.',
  },
  {
    id: 'f4',
    question:
      'How does the regularizer parameter C in Soft-Margin SVM balance the bias-variance trade-off?',
    answer:
      'C weights the penalty on margin slack violations: min 0.5 * ||w||^2 + C * sum xi_i. A very large C heavily penalizes errors, forcing a narrow margin that conforms strictly to training points (low bias, high variance, risk of overfitting). A small C prioritizes a wider margin gutters and ignores individual margin intrusions (high bias, low variance, robust to noise).',
  },
  {
    id: 'f5',
    question:
      'Prove why an ensemble of identical, perfectly correlated classifiers (rho = 1) provides zero error reduction.',
    answer:
      'Ensemble variance is given by Var(f_ens) = rho * sigma^2 + ((1 - rho) / B) * sigma^2. If rho = 1 (all models make identical errors), the second term vanishes and Var(f_ens) = 1 * sigma^2 = sigma^2. Without diversity (rho < 1), an ensemble of 1,000 models has the exact same variance and error rate as a single model.',
  },
  {
    id: 'f6',
    question:
      'Why does Random Forest randomly sample m ≈ sqrt(d) features at each split instead of using all d features?',
    answer:
      'If a few features are overwhelmingly predictive (e.g. glucose in diabetes prediction), every tree in standard Bagging will choose that exact feature for the root split, making all trees structurally correlated (high rho). Restricting each split to a random subset of m = sqrt(d) features forces trees to use alternative secondary features, decorrelating the trees and drastically lowering ensemble variance.',
  },
  {
    id: 'f7',
    question:
      'What causes AdaBoost to fail catastrophically on noisy datasets containing mislabeled samples?',
    answer:
      'AdaBoost optimizes an exponential loss function L = sum exp(-y_i F(x_i)). An unclassifiable noisy outlier has its sample weight multiplied by exp(alpha) on every successive round. Within a few iterations, mislabeled points command over 80% of total sample weight, forcing subsequent decision stumps to sacrifice the entire clean dataset just to isolate noisy outliers.',
  },
  {
    id: 'f8',
    question:
      'Why are Decision Tree Regressors incapable of extrapolating continuous linear trends beyond the training domain?',
    answer:
      'Decision trees partition input space into orthogonal hypercubes with piecewise constant leaf predictions. They do not calculate continuous gradients or slopes (unlike linear regression or neural networks). Any query point x > x_max falls into the rightmost terminal leaf and simply returns that leaf’s constant mean, producing a flat horizontal line forever.',
  },
];

export function Unit5CheatSheetPage() {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const toggleCard = (id: string) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-8 font-sans print:p-0 print:space-y-4">
      {/* Navigation and Print Controls */}
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-3">
          <Link
            to="/learn/unit-5"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            Unit 5 Directory
          </Link>
          <span className="text-neutral-600">/</span>
          <span className="text-xs font-mono text-neutral-300">Revision Cheat Sheet</span>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={handlePrint}
          className="flex items-center gap-2 text-xs"
        >
          <Printer className="size-3.5" />
          Print / Save PDF
        </Button>
      </div>

      {/* Header Banner */}
      <div className="border-b border-orange-50/15 pb-4">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant="unit">Unit 5 Cheat Sheet</Badge>
          <Badge variant="outline">8 Hours Syllabus</Badge>
          <Badge variant="outline">Course Code: 2304322T</Badge>
          <Badge variant="outline">MIT Academy of Engineering</Badge>
        </div>
        <h1 className="font-manrope text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Unit 5: Linear &amp; decision models revision sheet
        </h1>
        <p className="text-xs text-neutral-400 mt-1 font-montserrat">
          Mathematical formulas, margin derivations, kernel geometries, ensemble theorems, and viva
          interview flashcards.
        </p>
      </div>

      {/* 1. Formula Vault */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold font-manrope text-foreground flex items-center gap-2">
          <span className="size-2 rounded-full bg-brand" />
          1. Mathematical Formula Vault
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Entropy & Information Gain */}
          <Card className="p-4 border-orange-50/15 bg-neutral-900/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-400">
                Shannon Entropy &amp; Information Gain
              </span>
              <Badge variant="outline" size="sm">
                ID3 / C4.5
              </Badge>
            </div>
            <div className="p-2.5 rounded bg-black/40 font-mono text-xs text-cream text-center">
              H(S) = - Σ p_k log₂ p_k
            </div>
            <div className="p-2.5 rounded bg-black/40 font-mono text-xs text-cream text-center">
              IG(S, A) = H(S) - Σ (|S_v| / |S|) H(S_v)
            </div>
            <p className="text-[11px] text-neutral-400 font-montserrat leading-relaxed">
              Measures expected reduction in entropy. For binary classes, maximum entropy is 1.0 bit
              (at p=0.5), minimum is 0.0 bits.
            </p>
          </Card>

          {/* Card 2: Gini Impurity */}
          <Card className="p-4 border-orange-50/15 bg-neutral-900/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-400">
                Gini Impurity &amp; Gain
              </span>
              <Badge variant="outline" size="sm">
                Breiman CART
              </Badge>
            </div>
            <div className="p-2.5 rounded bg-black/40 font-mono text-xs text-cream text-center">
              Gini(S) = 1 - Σ (p_k)²
            </div>
            <div className="p-2.5 rounded bg-black/40 font-mono text-xs text-cream text-center">
              ΔGini = Gini(S) - [ (|S_L|/|S|) Gini(S_L) + (|S_R|/|S|) Gini(S_R) ]
            </div>
            <p className="text-[11px] text-neutral-400 font-montserrat leading-relaxed">
              Avoids log computations. Maximum binary Gini is 0.50 (at p=0.5), minimum is 0.0 (pure
              node).
            </p>
          </Card>

          {/* Card 3: SVM Hard Margin & Dual QP */}
          <Card className="p-4 border-orange-50/15 bg-neutral-900/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-blue-400">
                SVM Maximum Geometric Margin
              </span>
              <Badge variant="outline" size="sm">
                Vapnik 1995
              </Badge>
            </div>
            <div className="p-2.5 rounded bg-black/40 font-mono text-xs text-cream text-center">
              γ = 2 / ||w||₂ ⇒ min 0.5 ||w||² s.t. y_i(w^T x_i + b) ≥ 1
            </div>
            <div className="p-2.5 rounded bg-black/40 font-mono text-xs text-cream text-center">
              w* = Σ α_i y_i x_i (Only Support Vectors have α_i &gt; 0)
            </div>
            <p className="text-[11px] text-neutral-400 font-montserrat leading-relaxed">
              Separating hyperplane w^T x + b = 0. Gutters are at ±1. Dual QP solves for Lagrange
              multipliers α_i.
            </p>
          </Card>

          {/* Card 4: Soft-Margin SVM & Slack Variables */}
          <Card className="p-4 border-orange-50/15 bg-neutral-900/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-purple-400">
                Soft-Margin SVM &amp; Box Constraint
              </span>
              <Badge variant="outline" size="sm">
                C-SVC
              </Badge>
            </div>
            <div className="p-2.5 rounded bg-black/40 font-mono text-xs text-cream text-center">
              min 0.5 ||w||² + C Σ ξ_i s.t. y_i(w^T x_i + b) ≥ 1 - ξ_i, ξ_i ≥ 0
            </div>
            <div className="p-2.5 rounded bg-black/40 font-mono text-xs text-cream text-center">
              Dual Box Constraint: 0 ≤ α_i ≤ C
            </div>
            <p className="text-[11px] text-neutral-400 font-montserrat leading-relaxed">
              ξ_i = 0 (on/outside gutter), 0 &lt; ξ_i ≤ 1 (inside margin, correct), ξ_i &gt; 1
              (misclassified).
            </p>
          </Card>

          {/* Card 5: Common Kernel Functions */}
          <Card className="p-4 border-orange-50/15 bg-neutral-900/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-pink-400">
                Kernel Trick Functions K(x, z)
              </span>
              <Badge variant="outline" size="sm">
                RKHS Lift
              </Badge>
            </div>
            <div className="p-2 rounded bg-black/40 font-mono text-xs text-cream text-center">
              Polynomial: K(x, z) = (x^T z + c)^d
            </div>
            <div className="p-2 rounded bg-black/40 font-mono text-xs text-cream text-center">
              RBF (Gaussian): K(x, z) = exp(-γ ||x - z||²) [γ = 1 / 2σ²]
            </div>
            <p className="text-[11px] text-neutral-400 font-montserrat leading-relaxed">
              Computes inner products in infinite-dimensional Hilbert space at O(d) cost without
              explicit mapping.
            </p>
          </Card>

          {/* Card 6: Ensemble Diversity & Krogh-Vedelsby */}
          <Card className="p-4 border-orange-50/15 bg-neutral-900/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-yellow-400">
                Ensemble Ambiguity Decomposition
              </span>
              <Badge variant="outline" size="sm">
                Krogh-Vedelsby 1995
              </Badge>
            </div>
            <div className="p-2.5 rounded bg-black/40 font-mono text-xs text-cream text-center">
              E_ens = Mean Individual Error - Ensemble Diversity (Ambiguity)
            </div>
            <div className="p-2.5 rounded bg-black/40 font-mono text-xs text-cream text-center">
              Var(f̄) = ρ σ² + [(1 - ρ) / B] σ²
            </div>
            <p className="text-[11px] text-neutral-400 font-montserrat leading-relaxed">
              Ambiguity is non-negative, guaranteeing ensemble error ≤ average individual error.
              Diversity ρ controls variance reduction.
            </p>
          </Card>

          {/* Card 7: Random Forest & OOB Error */}
          <Card className="p-4 border-orange-50/15 bg-neutral-900/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-teal-400">
                Random Forest &amp; Out-of-Bag (OOB)
              </span>
              <Badge variant="outline" size="sm">
                Breiman 2001
              </Badge>
            </div>
            <div className="p-2.5 rounded bg-black/40 font-mono text-xs text-cream text-center">
              OOB Fraction = lim (1 - 1/N)^N = 1/e ≈ 36.8%
            </div>
            <div className="p-2.5 rounded bg-black/40 font-mono text-xs text-cream text-center">
              Feature Subspace: m = ⌊√d⌋ (Classif.) or m = ⌊d/3⌋ (Regr.)
            </div>
            <p className="text-[11px] text-neutral-400 font-montserrat leading-relaxed">
              Out-of-bag validation provides free unbiased cross-validation. Random feature
              subsetting decorrelates trees.
            </p>
          </Card>

          {/* Card 8: AdaBoost Weight & Alpha Updates */}
          <Card className="p-4 border-orange-50/15 bg-neutral-900/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-400">
                AdaBoost.M1 Weight Mechanics
              </span>
              <Badge variant="outline" size="sm">
                Freund &amp; Schapire 1995
              </Badge>
            </div>
            <div className="p-2.5 rounded bg-black/40 font-mono text-xs text-cream text-center">
              α_t = 0.5 · ln((1 - ε_t) / ε_t)
            </div>
            <div className="p-2.5 rounded bg-black/40 font-mono text-xs text-cream text-center">
              w_i^(t+1) = [w_i^(t) · exp(-α_t y_i h_t(x_i))] / Z_t
            </div>
            <p className="text-[11px] text-neutral-400 font-montserrat leading-relaxed">
              Z_t = 2√(ε_t(1 - ε_t)). Exponential loss minimizer; misclassified instances expand
              weights exponentially.
            </p>
          </Card>
        </div>
      </section>

      {/* 2. Model Decision Matrix */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold font-manrope text-foreground flex items-center gap-2">
          <span className="size-2 rounded-full bg-brand" />
          2. Model Selection &amp; Comparison Matrix
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse border border-orange-50/15 font-montserrat">
            <thead>
              <tr className="bg-neutral-900/80 text-neutral-300 font-manrope font-semibold">
                <th className="p-2.5 border border-orange-50/15">Model</th>
                <th className="p-2.5 border border-orange-50/15">Bias / Variance</th>
                <th className="p-2.5 border border-orange-50/15">Interpretability</th>
                <th className="p-2.5 border border-orange-50/15">Training Speed</th>
                <th className="p-2.5 border border-orange-50/15">High Dim (d &gt;&gt; N)</th>
                <th className="p-2.5 border border-orange-50/15">Outlier Sensitivity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-50/10 text-neutral-300 font-sans">
              <tr className="hover:bg-neutral-900/30">
                <td className="p-2.5 font-bold font-manrope text-foreground">
                  Decision Tree (Unpruned)
                </td>
                <td className="p-2.5 text-amber-300">Low Bias / High Var</td>
                <td className="p-2.5 text-emerald-400">High (Visual IF-THEN)</td>
                <td className="p-2.5 text-emerald-400">Fast O(d N log N)</td>
                <td className="p-2.5 text-neutral-400">Moderate</td>
                <td className="p-2.5 text-emerald-400">Robust (Rank splits)</td>
              </tr>
              <tr className="hover:bg-neutral-900/30">
                <td className="p-2.5 font-bold font-manrope text-foreground">Linear SVM</td>
                <td className="p-2.5">High Bias / Low Var</td>
                <td className="p-2.5">Moderate (Weights w)</td>
                <td className="p-2.5 text-emerald-400">Fast O(d N)</td>
                <td className="p-2.5 text-emerald-400">Excellent (Margin bound)</td>
                <td className="p-2.5 text-neutral-300">Moderate (Slack C)</td>
              </tr>
              <tr className="hover:bg-neutral-900/30">
                <td className="p-2.5 font-bold font-manrope text-foreground">Kernel SVM (RBF)</td>
                <td className="p-2.5 text-emerald-400">Tunable via C &amp; γ</td>
                <td className="p-2.5 text-red-400">Low (Black box)</td>
                <td className="p-2.5 text-red-400">Slow O(N² ~ N³)</td>
                <td className="p-2.5 text-emerald-400">Strong (Infinite RKHS)</td>
                <td className="p-2.5 text-amber-300">Sensitive to γ &amp; C</td>
              </tr>
              <tr className="hover:bg-neutral-900/30">
                <td className="p-2.5 font-bold font-manrope text-foreground">Random Forest</td>
                <td className="p-2.5 text-emerald-400">Low Bias / Low Var</td>
                <td className="p-2.5">Moderate (MDI Importance)</td>
                <td className="p-2.5">Medium (Parallel B trees)</td>
                <td className="p-2.5 text-emerald-400">Strong (Subspaces)</td>
                <td className="p-2.5 text-emerald-400">Very Robust</td>
              </tr>
              <tr className="hover:bg-neutral-900/30">
                <td className="p-2.5 font-bold font-manrope text-foreground">AdaBoost</td>
                <td className="p-2.5 text-emerald-400">Drives Bias Down</td>
                <td className="p-2.5">Low-Medium (Stump sum)</td>
                <td className="p-2.5">Medium (Sequential T)</td>
                <td className="p-2.5">Moderate</td>
                <td className="p-2.5 text-red-400">Severe (Exp weight)</td>
              </tr>
              <tr className="hover:bg-neutral-900/30">
                <td className="p-2.5 font-bold font-manrope text-foreground">Stacking Blender</td>
                <td className="p-2.5 text-emerald-400">Lowest Error Meta</td>
                <td className="p-2.5 text-red-400">Low (Multi-tier blend)</td>
                <td className="p-2.5 text-red-400">Slowest (K-Fold CV)</td>
                <td className="p-2.5">Depends on base models</td>
                <td className="p-2.5 text-neutral-300">Inherits base mix</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. Viva Voce Flashcards */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold font-manrope text-foreground flex items-center gap-2">
          <span className="size-2 rounded-full bg-brand" />
          3. Oral Viva Examination Flashcards
        </h2>

        <div className="space-y-3">
          {VIVA_FLASHCARDS.map((card, idx) => {
            const isExpanded = expandedCards[card.id];

            return (
              <Card
                key={card.id}
                className="p-4 border-orange-50/15 bg-neutral-900/40 space-y-2 cursor-pointer transition-colors hover:border-orange-50/30"
                onClick={() => toggleCard(card.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-neutral-500 font-bold">
                      Q{idx + 1}.
                    </span>
                    <span className="text-xs font-semibold text-neutral-100 font-montserrat">
                      {card.question}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" className="p-1 h-auto text-neutral-400">
                    {isExpanded ? (
                      <ChevronUp className="size-4" />
                    ) : (
                      <ChevronDown className="size-4" />
                    )}
                  </Button>
                </div>

                {isExpanded && (
                  <div className="text-xs text-neutral-300 font-sans leading-relaxed pt-2 border-t border-orange-50/10">
                    <span className="font-semibold text-cream">Answer:</span> {card.answer}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </section>

      {/* 4. Traps, Misconceptions & Exam Warnings */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold font-manrope text-foreground flex items-center gap-2">
          <span className="size-2 rounded-full bg-brand" />
          4. Pitfalls &amp; Exam Traps to Avoid
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-montserrat">
          <Card className="p-4 border-red-500/20 bg-red-950/10 space-y-1.5">
            <h4 className="font-bold text-red-400 font-manrope">
              Trap 1: Standardizing Features for Decision Trees
            </h4>
            <p className="text-neutral-300 leading-relaxed">
              Never waste compute applying StandardScaler or MinMaxScaler to Tree or Random Forest
              pipelines. Tree splits rely purely on rank inequalities (x_j ≤ s), making them
              completely invariant to monotonic scaling!
            </p>
          </Card>

          <Card className="p-4 border-red-500/20 bg-red-950/10 space-y-1.5">
            <h4 className="font-bold text-red-400 font-manrope">
              Trap 2: Forgetting Scaling for SVM
            </h4>
            <p className="text-neutral-300 leading-relaxed">
              Unlike trees, SVM solves for a Euclidean geometric margin ||w||₂. If one feature has
              scale 10,000 and another has scale 0.1, the large feature completely dominates the
              norm, destroying SVM accuracy. Feature scaling is mandatory!
            </p>
          </Card>

          <Card className="p-4 border-red-500/20 bg-red-950/10 space-y-1.5">
            <h4 className="font-bold text-red-400 font-manrope">
              Trap 3: Target Leakage in Stacking
            </h4>
            <p className="text-neutral-300 leading-relaxed">
              Never generate meta-features by training base models on dataset D and predicting on
              the same dataset D. Deep base models will output 100% accuracy, causing the meta-model
              to severely overfit. Always generate meta-features out-of-fold.
            </p>
          </Card>

          <Card className="p-4 border-red-500/20 bg-red-950/10 space-y-1.5">
            <h4 className="font-bold text-red-400 font-manrope">
              Trap 4: Extrapolating with Regression Trees
            </h4>
            <p className="text-neutral-300 leading-relaxed">
              Decision tree regressors partition space into flat horizontal steps. If you query x
              &gt; x_max on trending time-series, the tree outputs the outermost leaf constant
              forever, failing to capture linear or exponential growth.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}
