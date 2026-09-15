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
    question: 'Why is Ordinary Least Squares cost function J(θ) strictly convex?',
    answer:
      'Because J(θ) is a quadratic function of parameters θ whose Hessian matrix ∇²J = (1/m) XᵀX is positive semi-definite everywhere. Convexity mathematically guarantees that there are zero suboptimal local minima.',
  },
  {
    id: 'f2',
    question: 'What is the exact time complexity of the Normal Equation θ = (XᵀX)⁻¹ Xᵀy?',
    answer:
      'O(n·p² + p³), where n is the number of samples and p is the number of features. Computing XᵀX takes O(n p²), and inverting the resulting p×p matrix takes O(p³). For p > 10,000, iterative gradient descent is required.',
  },
  {
    id: 'f3',
    question:
      'Under what specific statistical condition does XᵀX become singular (non-invertible)?',
    answer:
      'When features exhibit perfect multicollinearity (one feature is an exact linear combination of others) or when the number of features exceeds the sample size (p > n). In both cases, rank(X) < p, making det(XᵀX) = 0.',
  },
  {
    id: 'f4',
    question: 'Why does adding a small Ridge stabilizer α·I eliminate matrix singularity?',
    answer:
      'Adding positive scalar α to the diagonal of XᵀX shifts all eigenvalues by +α, ensuring every eigenvalue is strictly positive (λᵢ ≥ α > 0). This makes XᵀX + αI strictly positive definite and invertible.',
  },
  {
    id: 'f5',
    question: 'What causes the Runge Phenomenon in high-degree polynomial regression?',
    answer:
      'High-degree polynomial interpolation across equidistant sample nodes causes the condition number of the Vandermonde matrix to explode, generating violent oscillations near the domain endpoints.',
  },
  {
    id: 'f6',
    question: 'In the Bias-Variance tradeoff, what represents irreducible error σ²?',
    answer:
      'Intrinsic random noise in the data generating process Var(ε) caused by unmeasured latent variables or physical measurement sensor limits that no machine learning algorithm can predict.',
  },
  {
    id: 'f7',
    question: 'Why is Locally Weighted Linear Regression called a "lazy" or memory-based learner?',
    answer:
      'Because it does not learn a fixed, compact set of parameters during training. To make any query prediction, it must retain the entire training set in memory and re-fit a weighted least squares problem on the fly.',
  },
  {
    id: 'f8',
    question: 'What is the Dummy Variable Trap when one-hot encoding categorical features?',
    answer:
      'Including all K dummy variables alongside an intercept column vector creates an exact linear dependency (Σ Dⱼ = 1 = x₀), producing a singular design matrix. Dropping one category (K - 1 dummies) resolves this.',
  },
  {
    id: 'f9',
    question: 'Why does MSE penalize outliers much more severely than MAE?',
    answer:
      'Because MSE squares individual residuals (e²). A residual of 10 adds 100 to the error sum, while a residual of 2 adds only 4 (a 25x penalty for a 5x error increase). MAE treats error magnitude strictly linearly.',
  },
  {
    id: 'f10',
    question: 'Under what condition can the R² score evaluate to a negative number?',
    answer:
      'On held-out test data, if the model predictions fit worse than a simple horizontal line predicting the sample mean ȳ, then SS_res > SS_tot, making 1 - (SS_res / SS_tot) strictly negative.',
  },
  {
    id: 'f11',
    question:
      'What statistical violation does a funnel shape in a Residuals vs Fitted plot indicate?',
    answer:
      'Heteroscedasticity: error variance is not constant across prediction tiers, violating the Gauss-Markov theorem and invalidating ordinary least squares standard errors and p-values.',
  },
  {
    id: 'f12',
    question: 'Geometrically, why does Lasso (L1) produce exact zeros while Ridge (L2) does not?',
    answer:
      'The L1 constraint region is a rotated diamond with sharp vertices situated directly on the coordinate axes. Expanding elliptical loss contours touch these protruding vertices first, forcing one or more weights to exactly 0.0.',
  },
  {
    id: 'f13',
    question: 'Why must continuous features always be standardized before applying Ridge or Lasso?',
    answer:
      'Because regularization penalizes all weights equally in Σ θⱼ² or Σ |θⱼ|. Unscaled features with large raw values naturally produce tiny weights and escape penalization, while small-scale features are over-penalized.',
  },
  {
    id: 'f14',
    question: 'Why should random K-Fold CV never be applied to time-series forecasting data?',
    answer:
      'Random splitting creates lookahead bias: the model trains on future dates to predict past dates. TimeSeriesSplit enforces walk-forward evaluation where fold k only trains on chronological time steps prior to validation.',
  },
  {
    id: 'f15',
    question: 'What is the "One Standard Error Rule" in cross-validated model selection?',
    answer:
      'Select the simplest (most heavily regularized) model whose cross-validation score is within one standard error of the best performing model, protecting against overfitting to random CV sampling noise.',
  },
];

export function Unit3CheatSheetPage() {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const toggleCard = (id: string) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    VIVA_FLASHCARDS.forEach((c) => {
      all[c.id] = true;
    });
    setExpandedCards(all);
  };

  const collapseAll = () => {
    setExpandedCards({});
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-10">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link
          to="/learn/unit-3"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Unit 3 Directory
        </Link>
        <span className="text-neutral-600">/</span>
        <span className="text-xs font-mono text-neutral-300">Master Revision Cheat Sheet</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">MIT AOE B.Tech AI & ML (2304322T)</Badge>
            <Badge variant="default">Unit 3: ML Fundamentals (7 Hours)</Badge>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground mt-2">
            Unit 3 Master Revision Cheat Sheet & Viva Defense
          </h1>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            High-yield mathematical formulas, algorithmic closed forms, diagnostic plot
            interpretations, and oral viva questions for Semester End Examinations (SEE).
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => window.print()}
          className="self-start sm:self-auto gap-2 text-xs"
        >
          <Printer className="size-3.5" /> Print / Save PDF
        </Button>
      </div>

      {/* Section 1: Mathematical Formula Matrix */}
      <section className="space-y-4">
        <div className="border-b border-border/60 pb-2 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-foreground">
            1. Core Mathematical Formula Reference
          </h2>
          <Badge variant="outline" className="text-brand font-mono text-xs">
            CO2, CO3
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <Card className="p-4 space-y-2 border-border/60 bg-neutral-950/60">
            <div className="font-semibold text-brand">OLS Simple Linear Regression</div>
            <div className="p-2.5 bg-neutral-900 rounded border border-neutral-800 text-neutral-300">
              θ₁ = Σ(xᵢ - x̄)(yᵢ - ȳ) / Σ(xᵢ - x̄)²
              <br />
              θ₀ = ȳ - θ₁ · x̄
            </div>
            <p className="text-neutral-400 font-sans text-[11px]">
              Minimizes sum of squared vertical residuals along y-axis.
            </p>
          </Card>

          <Card className="p-4 space-y-2 border-border/60 bg-neutral-950/60">
            <div className="font-semibold text-brand">Vectorized Gradient Descent Update</div>
            <div className="p-2.5 bg-neutral-900 rounded border border-neutral-800 text-neutral-300">
              θ := θ - (α / m) · Xᵀ (Xθ - y)
            </div>
            <p className="text-neutral-400 font-sans text-[11px]">
              Step size α must satisfy α &lt; 2 / λ_max to avoid divergence.
            </p>
          </Card>

          <Card className="p-4 space-y-2 border-border/60 bg-neutral-950/60">
            <div className="font-semibold text-brand">Normal Equation (Multiple Regression)</div>
            <div className="p-2.5 bg-neutral-900 rounded border border-neutral-800 text-sky-400">
              θ = (Xᵀ X)⁻¹ Xᵀ y
            </div>
            <p className="text-neutral-400 font-sans text-[11px]">
              Exact closed-form solution. Computational complexity O(np² + p³).
            </p>
          </Card>

          <Card className="p-4 space-y-2 border-border/60 bg-neutral-950/60">
            <div className="font-semibold text-brand">Ridge Regression Closed-Form (L2)</div>
            <div className="p-2.5 bg-neutral-900 rounded border border-neutral-800 text-sky-400">
              θ_Ridge = (Xᵀ X + α m I')⁻¹ Xᵀ y
            </div>
            <p className="text-neutral-400 font-sans text-[11px]">
              Intercept row I'[0,0] = 0. Guarantees non-singular invertible matrix.
            </p>
          </Card>

          <Card className="p-4 space-y-2 border-border/60 bg-neutral-950/60">
            <div className="font-semibold text-brand">Lasso Soft-Thresholding Update (L1)</div>
            <div className="p-2.5 bg-neutral-900 rounded border border-neutral-800 text-emerald-400">
              θⱼ = sign(ρⱼ) · max(|ρⱼ| - α, 0) / zⱼ
            </div>
            <p className="text-neutral-400 font-sans text-[11px]">
              Clamps weights strictly to 0 when |ρⱼ| ≤ α, producing sparsity.
            </p>
          </Card>

          <Card className="p-4 space-y-2 border-border/60 bg-neutral-950/60">
            <div className="font-semibold text-brand">Locally Weighted Linear Regression</div>
            <div className="p-2.5 bg-neutral-900 rounded border border-neutral-800 text-purple-400">
              θ(x) = (Xᵀ W X)⁻¹ Xᵀ W y
              <br />
              W_ii = exp(- (x^(i) - x)² / (2τ²))
            </div>
            <p className="text-neutral-400 font-sans text-[11px]">
              Non-parametric bandwidth τ governs spatial smoothing window.
            </p>
          </Card>
        </div>
      </section>

      {/* Section 2: Model Architecture Comparison Matrix */}
      <section className="space-y-4">
        <div className="border-b border-border/60 pb-2">
          <h2 className="font-display text-xl font-semibold text-foreground">
            2. Regression Model Architecture Comparison Matrix
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Algorithmic assumptions, sparsity, computational scaling, and optimal regimes
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-border/60 rounded font-mono">
            <thead className="bg-neutral-900 text-neutral-300">
              <tr>
                <th className="p-2.5 border-b border-border/60">Model Type</th>
                <th className="p-2.5 border-b border-border/60">Parametric?</th>
                <th className="p-2.5 border-b border-border/60">Loss Penalty</th>
                <th className="p-2.5 border-b border-border/60">Sparse?</th>
                <th className="p-2.5 border-b border-border/60">Collinearity Handling</th>
                <th className="p-2.5 border-b border-border/60">Best Applied When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-neutral-300">
              <tr>
                <td className="p-2.5 font-bold text-foreground">OLS Linear</td>
                <td className="p-2.5">Yes</td>
                <td className="p-2.5">None</td>
                <td className="p-2.5 text-red-400">No</td>
                <td className="p-2.5 text-red-400">Singular matrix fails</td>
                <td className="p-2.5">n &gt;&gt; p, linear relationship</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-foreground">Polynomial</td>
                <td className="p-2.5">Yes</td>
                <td className="p-2.5">None</td>
                <td className="p-2.5 text-red-400">No</td>
                <td className="p-2.5 text-red-400">Extreme Runge oscillations</td>
                <td className="p-2.5">Known low-degree physical laws (d ≤ 3)</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-purple-400">Locally Weighted</td>
                <td className="p-2.5 text-amber-400">No (Memory)</td>
                <td className="p-2.5">Kernel Distance</td>
                <td className="p-2.5 text-red-400">No</td>
                <td className="p-2.5 text-amber-400">Moderate</td>
                <td className="p-2.5">Low-dimensional non-linear sensor logs</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-sky-400">Ridge (L2)</td>
                <td className="p-2.5">Yes</td>
                <td className="p-2.5">α · Σ θⱼ²</td>
                <td className="p-2.5 text-amber-400">No (Shrunk)</td>
                <td className="p-2.5 text-emerald-400">Stable (groups collinear terms)</td>
                <td className="p-2.5">Many correlated predictors</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-emerald-400">Lasso (L1)</td>
                <td className="p-2.5">Yes</td>
                <td className="p-2.5">α · Σ |θⱼ|</td>
                <td className="p-2.5 text-emerald-400">Yes (Exact 0)</td>
                <td className="p-2.5 text-amber-400">Arbitrarily selects one</td>
                <td className="p-2.5">Embedded feature selection, sparse true signals</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-brand">Elastic Net</td>
                <td className="p-2.5">Yes</td>
                <td className="p-2.5">L1 + L2</td>
                <td className="p-2.5 text-emerald-400">Yes (Exact 0)</td>
                <td className="p-2.5 text-emerald-400">Excellent (groups + prunes)</td>
                <td className="p-2.5">High-dimensional genomics & NLP (p &gt; n)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 3: Diagnostic Plots Master Guide */}
      <section className="space-y-4">
        <div className="border-b border-border/60 pb-2">
          <h2 className="font-display text-xl font-semibold text-foreground">
            3. Residual Diagnostic Plots Guide
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            How to diagnose violations of Gauss-Markov assumptions from residual geometry
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <Card className="p-4 space-y-1.5 border-border/60 bg-neutral-950/60">
            <div className="font-semibold text-foreground">
              Residuals vs Fitted (Linearity & Variance)
            </div>
            <p className="text-neutral-400">
              <strong>Healthy:</strong> Random, unpatterned horizontal band centered at e = 0.
              <br />
              <strong>Funnel Shape:</strong> Indicates heteroscedasticity (expanding error
              variance).
              <br />
              <strong>Parabolic Arc:</strong> Indicates missing non-linear / quadratic features.
            </p>
          </Card>

          <Card className="p-4 space-y-1.5 border-border/60 bg-neutral-950/60">
            <div className="font-semibold text-foreground">
              Normal Q-Q Plot (Gaussian Residuals)
            </div>
            <p className="text-neutral-400">
              <strong>Healthy:</strong> Standardized residuals trace the 45-degree diagonal line.
              <br />
              <strong>S-Shape Curve:</strong> Indicates heavy-tailed error distributions (kurtosis).
              <br />
              <strong>Upward Bowing:</strong> Indicates positive right-skewed residuals.
            </p>
          </Card>
        </div>
      </section>

      {/* Section 4: 15 Oral Viva Voce Flashcards */}
      <section className="space-y-4">
        <div className="border-b border-border/60 pb-2 flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold text-foreground">
              4. Oral Viva Voce Defense Flashcards (15 Questions)
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Click any question to reveal model answers for MIT AOE oral exam defense
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={expandAll} className="text-xs">
              Expand All
            </Button>
            <Button variant="outline" size="sm" onClick={collapseAll} className="text-xs">
              Collapse All
            </Button>
          </div>
        </div>

        <div className="space-y-2.5">
          {VIVA_FLASHCARDS.map((card, idx) => {
            const isExpanded = Boolean(expandedCards[card.id]);
            return (
              <div
                key={card.id}
                className="border border-border/60 rounded-lg overflow-hidden bg-neutral-950/40"
              >
                <div
                  onClick={() => toggleCard(card.id)}
                  className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-neutral-900/60 transition-colors"
                >
                  <div className="flex items-center gap-2.5 text-xs font-medium text-foreground">
                    <span className="font-mono text-brand font-bold text-[11px]">Q{idx + 1}.</span>
                    <span>{card.question}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="size-4 text-neutral-400" />
                  ) : (
                    <ChevronDown className="size-4 text-neutral-400" />
                  )}
                </div>

                {isExpanded && (
                  <div className="p-3.5 pt-0 border-t border-border/40 bg-neutral-900/40 text-xs text-neutral-300 leading-relaxed space-y-1">
                    <div className="font-semibold text-brand text-[10px] uppercase tracking-wider font-mono">
                      Model Answer:
                    </div>
                    <p className="text-neutral-300">{card.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
