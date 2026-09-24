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
      'Why does Naive Bayes perform remarkably well in text classification despite the obvious violation of conditional independence?',
    answer:
      'Classification decisions depend only on which class has the higher probability, not on the exact calibration of the posterior. Even when correlated words inflate or distort probabilities, the correct class often retains the maximum ranking score (optimality under 0-1 loss).',
  },
  {
    id: 'f2',
    question:
      'Derive the gradient update rule for logistic regression under binary cross-entropy loss.',
    answer:
      'For J(θ) = -1/m ∑ [yᵢ ln σ(zᵢ) + (1-yᵢ) ln(1-σ(zᵢ))], using chain rule ∂J/∂θ = ∂J/∂p̂ · ∂p̂/∂z · ∂z/∂θ yields ∂J/∂θ = (1/m) X̃ᵀ (p̂ - y). The update is θ := θ - α · (1/m) X̃ᵀ (p̂ - y). The derivative of sigmoid σ(1-σ) cancels exactly with the cross-entropy logarithm.',
  },
  {
    id: 'f3',
    question:
      'What is the Accuracy Paradox and how does it manifest in high-stakes medical diagnosis?',
    answer:
      'In a population with 1% disease prevalence, a trivial dummy model predicting "healthy" for 100% of patients achieves 99% accuracy while having 0% sensitivity/recall, missing every single sick patient and causing fatal outcomes.',
  },
  {
    id: 'f4',
    question:
      'Why is the Precision-Recall (PR) curve superior to ROC-AUC when evaluating severely imbalanced fraud or customer churn datasets?',
    answer:
      'ROC-AUC plots TPR against FPR = FP / (FP + TN). When the negative class is vast (e.g. 99% of samples), large increases in false positives cause only negligible changes in FPR, making ROC look deceptively flawless. PR curves isolate positive precision TP / (TP + FP) directly.',
  },
  {
    id: 'f5',
    question:
      'Why is feature standardization mandatory for k-NN but completely irrelevant for Naive Bayes?',
    answer:
      'k-NN computes isotropic geometric distances across all dimensions: unscaled features with large numerical magnitudes (e.g. salary: $80,000) completely drown out small-scale features (e.g. age: 30). Naive Bayes models each feature distribution independently per class, so feature scale factors cancel out.',
  },
  {
    id: 'f6',
    question:
      'State the Cover and Hart (1967) theorem regarding 1-Nearest Neighbor asymptotic error.',
    answer:
      'As sample size N -> ∞, the probability of error of a 1-NN classifier R_1NN is bounded by the Bayes optimal error rate R* according to: R* <= R_1NN <= 2 · R* · (1 - R*) <= 2 · R*. Even the simplest 1-NN classifier captures at least half the information contained in an infinite training set.',
  },
  {
    id: 'f7',
    question:
      'Explain why the Evidence Lower Bound (ELBO) can never exceed the true marginal log evidence ln p(x).',
    answer:
      'From the identity ln p(x) = ELBO(φ) + KL(q_φ ∥ p), because the Kullback-Leibler divergence is strictly non-negative (KL >= 0 by Gibbs inequality), ELBO(φ) = ln p(x) - KL(q ∥ p) is mathematically bounded from above by ln p(x).',
  },
  {
    id: 'f8',
    question:
      'Why does reverse KL divergence in Variational Inference result in mode-seeking (variance underestimation)?',
    answer:
      'VI minimizes KL(q ∥ p) = E_q[ln(q / p)]. If q(z) > 0 where true posterior p(z|x) ≈ 0, the ratio q/p explodes toward infinity, generating an infinite loss penalty. Thus, q(z) must be zero wherever p(z) is low (zero-forcing property), collapsing onto a single mode.',
  },
];

export function Unit4CheatSheetPage() {
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
            to="/learn/unit-4"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            Unit 4 Directory
          </Link>
          <span className="text-neutral-600">/</span>
          <span className="text-xs font-mono text-neutral-300">Revision Cheat Sheet</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handlePrint}
          className="gap-2 border-amber-900/40 text-amber-300 hover:bg-amber-950/20"
        >
          <Printer className="size-3.5" />
          Print / Save PDF
        </Button>
      </div>

      {/* Sheet Header */}
      <div className="border-b border-[#292524] pb-6">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant="outline" className="border-amber-700/50 text-amber-300 font-mono text-xs">
            MIT AOE Course 2304322T
          </Badge>
          <Badge
            variant="outline"
            className="border-neutral-700 text-neutral-300 font-mono text-xs"
          >
            6 Syllabus Hours • Exam Cheat Sheet
          </Badge>
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
          Unit 4: Instances &amp; Probabilistic Models Master Revision
        </h1>
        <p className="text-xs text-neutral-400 mt-1 max-w-3xl leading-relaxed">
          High-density reference covering Bayes theorem, Naive Bayes conditional independence,
          Laplace smoothing, Logistic regression, Classification metrics, ROC-AUC, k-NN lazy
          learning, and Variational Inference ELBO optimization.
        </p>
      </div>

      {/* Section 1: Master Paradigm Comparison Table */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-amber-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-200">
            1. Master Paradigm Comparison: Generative vs Discriminative vs Instance-Based
          </h2>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#292524] bg-[#0c0a09]">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#1c1917] text-stone-400 border-b border-[#292524]">
              <tr>
                <th className="p-3">Model</th>
                <th className="p-3">Paradigm</th>
                <th className="p-3">Mathematical Goal</th>
                <th className="p-3">Fit Time</th>
                <th className="p-3">Inference</th>
                <th className="p-3">Key Strength</th>
                <th className="p-3">Fatal Failure Mode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#292524] text-stone-300">
              <tr>
                <td className="p-3 font-semibold text-amber-300">Naive Bayes</td>
                <td className="p-3">Generative</td>
                <td className="p-3">P(X, Y) = P(Y) ∏ P(X_i|Y)</td>
                <td className="p-3 text-emerald-400">O(N · d)</td>
                <td className="p-3 text-emerald-400">O(C · d)</td>
                <td className="p-3">Fast; missing data friendly</td>
                <td className="p-3 text-red-400">Zero-frequency trap</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-emerald-300">Logistic Regression</td>
                <td className="p-3">Discriminative</td>
                <td className="p-3">P(Y|X) = σ(θᵀX̃)</td>
                <td className="p-3 text-amber-400">O(Iter · N · d)</td>
                <td className="p-3 text-emerald-400">O(d)</td>
                <td className="p-3">Calibrated probabilities</td>
                <td className="p-3 text-red-400">XOR linear inseparability</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-blue-300">k-NN</td>
                <td className="p-3">Instance-Based</td>
                <td className="p-3">vote(k nearest neighbors)</td>
                <td className="p-3 text-emerald-400">O(1) (store data)</td>
                <td className="p-3 text-red-400">O(N · d)</td>
                <td className="p-3">Complex non-linear regions</td>
                <td className="p-3 text-red-400">Curse of dimensionality</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 2: Mathematical Formula Cards */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-amber-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-200">
            2. Core Mathematical Formulations
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Bayes' Rule */}
          <Card className="p-4 bg-[#0c0a09] border border-[#292524] space-y-2">
            <span className="text-xs font-bold text-amber-300 font-mono">
              Bayes Theorem &amp; Total Probability
            </span>
            <div className="bg-[#1c1917] p-2.5 rounded font-mono text-[11px] text-stone-300 leading-relaxed border border-[#292524]">
              <div>P(C_k | X) = [ P(X | C_k) · P(C_k) ] / P(X)</div>
              <div className="text-stone-500 mt-1">P(X) = ∑_j P(X | C_j) · P(C_j)</div>
            </div>
            <p className="text-[11px] text-stone-400 leading-normal">
              Posterior = [Likelihood × Prior] / Evidence. When prevalence is small, false positives
              dominate due to base-rate fallacy.
            </p>
          </Card>

          {/* Card 2: Laplace Smoothing */}
          <Card className="p-4 bg-[#0c0a09] border border-[#292524] space-y-2">
            <span className="text-xs font-bold text-amber-300 font-mono">
              Laplace / Additive Smoothing
            </span>
            <div className="bg-[#1c1917] p-2.5 rounded font-mono text-[11px] text-stone-300 leading-relaxed border border-[#292524]">
              <div>P(w_i | C) = ( count(w_i, C) + α ) / ( ∑_w count(w, C) + α·|V| )</div>
              <div className="text-stone-500 mt-1">α = 1: Laplace | α &lt; 1: Lidstone</div>
            </div>
            <p className="text-[11px] text-stone-400 leading-normal">
              Injects uniform prior pseudo-counts α to prevent a single unseen token from
              multiplying class probability to absolute zero.
            </p>
          </Card>

          {/* Card 3: Sigmoid & Binary Cross-Entropy */}
          <Card className="p-4 bg-[#0c0a09] border border-[#292524] space-y-2">
            <span className="text-xs font-bold text-emerald-300 font-mono">
              Logistic Sigmoid &amp; Cross-Entropy Loss
            </span>
            <div className="bg-[#1c1917] p-2.5 rounded font-mono text-[11px] text-stone-300 leading-relaxed border border-[#292524]">
              <div>σ(z) = 1 / (1 + e^-z) | z = θᵀX̃</div>
              <div>J(θ) = -1/m ∑ [ y ln(p̂) + (1-y) ln(1-p̂) ]</div>
              <div className="text-stone-500 mt-1">∇J(θ) = (1/m) X̃ᵀ (p̂ - y)</div>
            </div>
            <p className="text-[11px] text-stone-400 leading-normal">
              Cross-entropy yields a strictly convex loss surface. Gradient update rule takes
              identical linear residual form as OLS.
            </p>
          </Card>

          {/* Card 4: Classification Metrics */}
          <Card className="p-4 bg-[#0c0a09] border border-[#292524] space-y-2">
            <span className="text-xs font-bold text-emerald-300 font-mono">
              Classification Metrics Matrix
            </span>
            <div className="bg-[#1c1917] p-2.5 rounded font-mono text-[11px] text-stone-300 leading-relaxed border border-[#292524]">
              <div>Accuracy = (TP + TN) / (TP + FP + TN + FN)</div>
              <div>Precision = TP / (TP + FP) | Recall = TP / (TP + FN)</div>
              <div>F1 = 2·P·R / (P + R) | Specificity = TN / (TN + FP)</div>
            </div>
            <p className="text-[11px] text-stone-400 leading-normal">
              F1 is the harmonic mean of Precision and Recall. High precision guards against false
              alarms; high recall catches rare events.
            </p>
          </Card>

          {/* Card 5: Cost-Sensitive Threshold */}
          <Card className="p-4 bg-[#0c0a09] border border-[#292524] space-y-2">
            <span className="text-xs font-bold text-blue-300 font-mono">
              Optimal Bayes Decision Threshold
            </span>
            <div className="bg-[#1c1917] p-2.5 rounded font-mono text-[11px] text-stone-300 leading-relaxed border border-[#292524]">
              <div>τ* = c_FP / (c_FP + c_FN)</div>
              <div className="text-stone-500 mt-1">
                c_FN: Cost of Miss ($500) | c_FP: Cost of False Alarm ($50)
              </div>
            </div>
            <p className="text-[11px] text-stone-400 leading-normal">
              When missing a positive instance costs 10x more than a false alarm, threshold shifts
              from 0.50 down to ~0.09 to maximize business ROI.
            </p>
          </Card>

          {/* Card 6: Variational Inference ELBO */}
          <Card className="p-4 bg-[#0c0a09] border border-[#292524] space-y-2">
            <span className="text-xs font-bold text-purple-300 font-mono">
              Evidence Lower Bound (ELBO) Identity
            </span>
            <div className="bg-[#1c1917] p-2.5 rounded font-mono text-[11px] text-stone-300 leading-relaxed border border-[#292524]">
              <div>ln p(x) = ELBO(φ) + KL(q_φ(z) ∥ p(z|x))</div>
              <div>ELBO(φ) = E_q[ ln p(x, z) ] - E_q[ ln q_φ(z) ]</div>
            </div>
            <p className="text-[11px] text-stone-400 leading-normal">
              Since ln p(x) is constant, maximizing ELBO directly minimizes non-negative KL
              divergence, turning integration into optimization.
            </p>
          </Card>
        </div>
      </section>

      {/* Section 3: Interactive Oral Viva Flashcards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-amber-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-200">
              3. Interactive Oral Viva Flashcards (8 High-Yield Questions)
            </h2>
          </div>
          <span className="text-xs text-stone-500 font-mono">Click to reveal answer</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {VIVA_FLASHCARDS.map((card, idx) => {
            const isRevealed = Boolean(expandedCards[card.id]);
            return (
              <div
                key={card.id}
                onClick={() => toggleCard(card.id)}
                className={`cursor-pointer rounded-xl border p-4 transition-all text-xs select-none ${
                  isRevealed
                    ? 'border-amber-700/60 bg-amber-950/15'
                    : 'border-[#292524] bg-[#0c0a09] hover:border-neutral-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-amber-400 font-bold">VIVA {idx + 1}</span>
                  </div>
                  {isRevealed ? (
                    <ChevronUp className="size-3.5 text-stone-400" />
                  ) : (
                    <ChevronDown className="size-3.5 text-stone-400" />
                  )}
                </div>

                <p className="font-semibold text-stone-200 mt-2 leading-relaxed">{card.question}</p>

                {isRevealed && (
                  <div className="mt-3 pt-3 border-t border-[#292524] text-stone-300 leading-relaxed font-sans">
                    <strong className="text-amber-300 block mb-1 font-mono text-[11px]">
                      Model Answer:
                    </strong>
                    {card.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 4: Unit Navigation */}
      <div className="pt-6 border-t border-[#292524] flex flex-wrap items-center justify-between gap-4 text-xs">
        <Link
          to="/learn/unit-4/exam"
          className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold transition-colors"
        >
          Launch 20-Question Unit 4 Timed Exam
        </Link>
        <div className="flex items-center gap-4 text-stone-400">
          <span>Other cheat sheets:</span>
          <Link to="/cheatsheets/unit-1" className="hover:text-amber-300">
            Unit 1
          </Link>
          <Link to="/cheatsheets/unit-2" className="hover:text-amber-300">
            Unit 2
          </Link>
          <Link to="/cheatsheets/unit-3" className="hover:text-amber-300">
            Unit 3
          </Link>
        </div>
      </div>
    </div>
  );
}
