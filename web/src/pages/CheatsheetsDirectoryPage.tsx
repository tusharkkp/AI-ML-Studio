import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { FileText, ArrowRight, Printer, Sparkles, GraduationCap } from 'lucide-react';

interface CheatsheetMeta {
  unitNumber: number;
  badge: 'U1' | 'U2' | 'U3' | 'U4';
  title: string;
  subtitle: string;
  hours: number;
  href: string;
  examHref: string;
  topics: string[];
  formulas: string[];
}

const CHEATSHEETS: CheatsheetMeta[] = [
  {
    unitNumber: 1,
    badge: 'U1',
    title: 'Basics of AI',
    subtitle: 'Agents, PEAS framing, logic, and expert reasoning systems',
    hours: 8,
    href: '/cheatsheets/unit-1',
    examHref: '/learn/unit-1/exam',
    topics: [
      'PEAS Framework (Performance, Environment, Actuators, Sensors)',
      'Agent Types (Simple Reflex, Model-Based, Goal-Based, Utility-Based)',
      'First-Order Logic: Universal (∀) and Existential (∃) quantifiers',
      'Forward vs Backward Chaining (Data-driven vs Goal-driven inference)',
      'Expert System Architecture (Rule base, Working memory, Inference engine)',
    ],
    formulas: [
      '∀x (Human(x) → Mortal(x))',
      'Conflict resolution: Specificity & Recency',
      'PEAS: Cleanliness score, Grid sensor, Suction actuator',
    ],
  },
  {
    unitNumber: 2,
    badge: 'U2',
    title: 'AI Search Strategies',
    subtitle: 'Uninformed, heuristic, adversarial, and constraint satisfaction',
    hours: 8,
    href: '/cheatsheets/unit-2',
    examHref: '/learn/unit-2/exam',
    topics: [
      'Uninformed Search: BFS (O(b^d)), DFS (O(b*m)), UCS (optimal for cost)',
      'A* Search: Admissible (h(n) ≤ h*(n)) and Consistent heuristics',
      'Constraint Satisfaction Problems: Backtracking, Forward Checking, AC-3',
      'Adversarial Search: Minimax theorem, Alpha-Beta pruning guarantees',
      'Local Optimization: Hill Climbing local optima & Simulated Annealing schedule',
    ],
    formulas: [
      'f(n) = g(n) + h(n)',
      'Admissibility: 0 ≤ h(n) ≤ h*(n)',
      'α-β pruning: prune when β ≤ α',
      'P(accept) = exp(-ΔE / T)',
    ],
  },
  {
    unitNumber: 3,
    badge: 'U3',
    title: 'ML Fundamentals',
    subtitle: 'Cost surfaces, gradient optimization, regularization, and validation',
    hours: 7,
    href: '/cheatsheets/unit-3',
    examHref: '/learn/unit-3/exam',
    topics: [
      'Simple & Multiple Linear Regression: Ordinary Least Squares (OLS)',
      'Gradient Descent: Learning rate η, Batch vs Mini-batch vs Stochastic',
      'Bias-Variance Decomposition: Error = Bias² + Variance + Irreducible Noise',
      'Regularization: L2 Ridge (w_ols / (1 + λ)) vs L1 Lasso (feature sparsity)',
      'Evaluation: MSE, RMSE, MAE, R² coefficient of determination',
    ],
    formulas: [
      'J(w, b) = (1 / 2m) Σ (h_w(x^(i)) - y^(i))²',
      'w := w - η ∇_w J(w)',
      'R² = 1 - (SS_res / SS_tot)',
      'J_Ridge = J_0 + λ Σ w_j²',
    ],
  },
  {
    unitNumber: 4,
    badge: 'U4',
    title: 'Instances & Probabilistic Models',
    subtitle: 'Bayesian inference, Naive Bayes, logistic regression, and ROC analysis',
    hours: 6,
    href: '/cheatsheets/unit-4',
    examHref: '/learn/unit-4/exam',
    topics: [
      'Bayes Theorem: Prior, Likelihood, Marginal Evidence, Posterior',
      'Naive Bayes: Conditional independence assumption and Laplace smoothing',
      'Logistic Regression: Sigmoid activation, log-odds link, Cross-Entropy loss',
      'Classification Metrics: Precision, Recall, F1-Score, Specificity',
      'ROC-AUC: Sweeping decision thresholds from 1 to 0 and TPR vs FPR trade-off',
    ],
    formulas: [
      'P(A|B) = [P(B|A) P(A)] / P(B)',
      'σ(z) = 1 / (1 + exp(-z))',
      'J_BCE = -(1/m) Σ [y ln(p) + (1-y) ln(1-p)]',
      'P(w_i|C) = (count + α) / (N + α|V|)',
    ],
  },
];

export function CheatsheetsDirectoryPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:px-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-orange-50/15 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-2">
            <Link to="/" className="hover:text-brand transition-colors">
              AIML Studio
            </Link>
            <span>/</span>
            <span className="text-foreground dark:text-neutral-200">Revision Hub</span>
          </div>
          <h1 className="font-manrope text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Quick revision cheat sheets
          </h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl font-montserrat">
            Condensed mathematical formulas, algorithmic guarantees, and viva interview flashcards
            tailored for{' '}
            <span className="font-montserrat font-medium text-yellow-800 dark:text-orange-100">
              MIT AOE Course 2304322T examinations
            </span>
            .
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.print()}
            className="flex items-center gap-2"
          >
            <Printer className="size-3.5" />
            <span>Print All Guides</span>
          </Button>
        </div>
      </div>

      {/* Grid of Cheat Sheet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CHEATSHEETS.map((sheet) => (
          <Card
            key={sheet.unitNumber}
            className="p-6 border border-orange-50/15 bg-neutral-900/40 backdrop-blur-sm flex flex-col justify-between hover:border-orange-50/30 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded border border-orange-50/20 bg-black/40 text-xs font-mono font-bold text-orange-200">
                    {sheet.badge}
                  </span>
                  <span className="text-xs font-mono text-neutral-400">
                    Unit {sheet.unitNumber}
                  </span>
                </div>
                <Badge variant="outline" size="sm">
                  {sheet.hours} Hours
                </Badge>
              </div>

              <h2 className="font-manrope text-xl font-semibold text-foreground dark:text-white">
                {sheet.title}
              </h2>
              <p className="text-xs text-neutral-400 mt-1 mb-4 font-montserrat">{sheet.subtitle}</p>

              {/* Core Syllabus Points */}
              <div className="space-y-2 mb-4">
                <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500">
                  Key Formulas & Theoretical Pillars
                </div>
                <div className="space-y-1.5">
                  {sheet.formulas.map((form, idx) => (
                    <div
                      key={idx}
                      className="text-xs font-mono bg-black/30 border border-orange-50/10 rounded px-2.5 py-1 text-neutral-300"
                    >
                      {form}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1 text-xs text-neutral-400 mb-6 font-montserrat">
                <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                  Exam & Viva Highlights
                </div>
                <ul className="list-disc pl-4 space-y-1">
                  {sheet.topics.slice(0, 3).map((topic, idx) => (
                    <li key={idx} className="leading-snug">
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-orange-50/10 flex items-center justify-between gap-3">
              <Link to={sheet.examHref} className="flex-1">
                <Button size="sm" variant="outline" className="w-full text-xs">
                  <GraduationCap className="size-3.5 mr-1" />
                  Practice Exam
                </Button>
              </Link>
              <Link to={sheet.href} className="flex-1">
                <Button
                  size="sm"
                  variant="primary"
                  className="w-full text-xs flex items-center justify-center gap-1"
                >
                  <FileText className="size-3.5" />
                  <span>Open Sheet</span>
                  <ArrowRight className="size-3" />
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {/* Unit 5 In-Progress Banner */}
      <Card className="p-6 border border-dashed border-orange-50/20 bg-neutral-900/20 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="size-8 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center text-brand shrink-0">
            <Sparkles className="size-4" />
          </div>
          <div>
            <h3 className="font-manrope text-base font-semibold text-foreground dark:text-white">
              Unit 5: Linear & Decision Models Cheat Sheet
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5 font-montserrat">
              Currently compiling formulas for Decision Trees (Entropy, Gini, Information Gain),
              Support Vector Machines (Max Margin, Dual Form, Kernels), and Ensembles (Condorcet,
              Bagging, AdaBoost).
            </p>
          </div>
        </div>
        <Link to="/learn/unit-5">
          <Button size="sm" variant="outline" className="text-xs whitespace-nowrap">
            Explore Unit 5 Modules &rarr;
          </Button>
        </Link>
      </Card>
    </div>
  );
}
