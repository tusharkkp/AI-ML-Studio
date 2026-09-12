import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Quiz } from '@/features/quiz/Quiz';
import { BiasVarianceLab } from '@/labs/bias-variance/BiasVarianceLab';
import { ArrowLeft, ArrowRight, BookOpen, Target, Scale, HelpCircle } from 'lucide-react';

export function BiasVariancePage() {
  const [showDerivation, setShowDerivation] = useState<boolean>(false);

  const quizItems = [
    {
      id: 'bv-q1',
      question:
        'In the expected test error decomposition E[(y - f̂(x))^2] = Bias^2 + Variance + sigma^2, what specifically causes the irreducible error term sigma^2?',
      options: [
        {
          id: 'A',
          text: 'Inherent noise, unmeasured latent confounding variables, or measurement sensor error in the true physical generation process that no algorithm can ever predict.',
          isCorrect: true,
          explanation:
            'Irreducible error sigma^2 represents intrinsic stochasticity in the data generation process (Var(epsilon)). Even a hypothetically omniscient model knowing the true function f(x) perfectly will still suffer error sigma^2 on noisy test targets y = f(x) + epsilon.',
        },
        {
          id: 'B',
          text: 'Using 32-bit floating point precision instead of 64-bit precision.',
          isCorrect: false,
          explanation:
            'Floating point precision is numerical roundoff, not the statistical data noise sigma^2.',
        },
        {
          id: 'C',
          text: 'Setting the train-test split ratio to 80/20 instead of 70/30.',
          isCorrect: false,
          explanation:
            'Split ratios affect sample size for estimating parameters, not irreducible ground-truth noise.',
        },
      ],
    },
    {
      id: 'bv-q2',
      question:
        'A model exhibits 99.8% accuracy on the training dataset, but drops to 64.2% accuracy on the held-out validation dataset. What condition is this and what is the primary remedy?',
      options: [
        {
          id: 'A',
          text: 'High Variance (Overfitting). Remedies include gathering more training instances, pruning irrelevant features, or applying L1/L2 regularization.',
          isCorrect: true,
          explanation:
            'A large generalization gap between near-perfect training score and mediocre validation score is the hallmark of High Variance. The model has memorized idiosyncrasies of the training set. Adding training data or increasing regularization constrains model capacity.',
        },
        {
          id: 'B',
          text: 'High Bias (Underfitting). The model needs more polynomial degree terms.',
          isCorrect: false,
          explanation: '99.8% training accuracy indicates very low bias, not high bias.',
        },
        {
          id: 'C',
          text: 'Zero error convergence. The model is ready for immediate production deployment.',
          isCorrect: false,
          explanation: 'A model with 64% validation accuracy will perform poorly in production.',
        },
      ],
    },
    {
      id: 'bv-q3',
      question:
        'Why does collecting a significantly larger training dataset reduce Variance without increasing Bias?',
      options: [
        {
          id: 'A',
          text: 'With more diverse training samples, accidental spurious correlations cancel out, forcing the estimated parameters across different dataset draws to become more consistent and stable.',
          isCorrect: true,
          explanation:
            'Variance measures how much the learned model f̂ varies when trained on different random samples of data. As sample size m grows, the law of large numbers stabilizes parameter estimates, shrinking Var[f̂] while preserving the model expressive capacity.',
        },
        {
          id: 'B',
          text: 'Because larger datasets automatically set the learning rate to zero.',
          isCorrect: false,
          explanation: 'Dataset size does not modify learning rate.',
        },
        {
          id: 'C',
          text: 'It only works if all data points are identical duplicates.',
          isCorrect: false,
          explanation: 'Duplicate data provides zero new information.',
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
        <span className="text-xs font-mono text-stone-300">Bias-Variance Tradeoff</span>
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
            CO2, CO3, CO4
          </Badge>
        </div>
        <h1 className="font-montserrat text-3xl sm:text-4xl font-bold tracking-tight text-stone-100">
          The Bias-Variance Tradeoff: The Central Dilemma of Machine Learning
        </h1>
        <p className="text-base text-stone-300 leading-relaxed max-w-3xl font-sans">
          Every predictive algorithm faces an inescapable tension: simplify assumptions to prevent
          erratic hallucinations, or increase flexibility to capture intricate non-linear reality.
          Understanding this{' '}
          <span className="text-amber-100 font-medium">statistical tug-of-war</span> is the single
          most important diagnostic skill in machine learning engineering.
        </p>
      </div>

      {/* Section 1: Intuition */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100">
          1. Intuition: The Stubborn Dogmatist vs The Impressionable Child
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed text-sm text-stone-300">
          <div className="p-5 rounded-xl border border-stone-800 bg-stone-900/40 space-y-3">
            <h3 className="font-montserrat text-base font-semibold text-stone-100 flex items-center gap-2">
              <Target className="size-4 text-amber-400" />
              High Bias: The Stubborn Dogmatist
            </h3>
            <p>
              A high-bias model has rigid, preconvinced assumptions before seeing the data. Even
              when evidence strongly indicates a non-linear quadratic curve, a linear model
              stubbornly forces a straight line through the points.
            </p>
            <p>
              It has low variance (it produces almost the exact same straight line regardless of
              which training sample you give it), but suffers huge systemic error:{' '}
              <span className="text-amber-100 font-medium">Underfitting</span>.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-stone-800 bg-stone-900/40 space-y-3">
            <h3 className="font-montserrat text-base font-semibold text-stone-100 flex items-center gap-2">
              <Scale className="size-4 text-amber-400" />
              High Variance: The Impressionable Child
            </h3>
            <p>
              A high-variance model has enormous capacity and zero skepticism. It believes every
              outlier, typo, and random speck of background noise is an essential universal law.
            </p>
            <p>
              Train it on Dataset A, and it bends into loop-de-loops. Train it on Dataset B, and it
              bends in the opposite direction. It has low bias on training data, but fails to
              generalize: <span className="text-amber-100 font-medium">Overfitting</span>.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Interactive Lab */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100">
          2. Interactive Lab: Ensemble Spaghetti Curves &amp; Error Decomposition
        </h2>
        <p className="text-sm text-stone-300 leading-relaxed font-sans">
          Experiment with 15 simultaneous models trained on different random draws from the same
          underlying reality. Observe the spread of curves and identify the sweet spot on the
          U-shaped error curve.
        </p>
        <BiasVarianceLab />
      </section>

      {/* Section 3: Mathematical Formalism */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100">
          3. Mathematical Decomposition of Expected Generalization Error
        </h2>
        <Card className="p-6 border-stone-800 bg-stone-900/40 space-y-5">
          <p className="text-sm text-stone-300 leading-relaxed font-sans">
            Assume the true data generation process is{' '}
            <span className="font-mono text-stone-200">y = f(x) + &epsilon;</span>, where noise
            &epsilon; has mean zero{' '}
            <span className="font-mono text-stone-200">E[&epsilon;] = 0</span> and variance{' '}
            <span className="font-mono text-stone-200">Var(&epsilon;) = &sigma;&sup2;</span>.
          </p>

          <p className="text-sm text-stone-300 leading-relaxed font-sans">
            The expected out-of-sample squared error of an estimated model{' '}
            <span className="font-mono text-stone-200">f̂(x)</span> decomposes rigorously into three
            distinct terms:
          </p>
          <div className="p-3 rounded-lg bg-stone-950 border border-stone-800 font-mono text-xs text-amber-200/90 text-center">
            E [ (y - f̂(x))&sup2; ] = ( Bias[f̂(x)] )&sup2; + Var[f̂(x)] + &sigma;&sup2;
          </div>

          {/* Derivation toggle */}
          <div className="pt-2 border-t border-stone-800/80">
            <button
              onClick={() => setShowDerivation(!showDerivation)}
              className="text-xs font-mono text-amber-300 hover:text-amber-200 underline decoration-dotted flex items-center gap-1.5"
            >
              {showDerivation
                ? 'Hide Algebraic Proof'
                : 'Show Complete Step-by-Step Algebraic Proof'}
            </button>

            {showDerivation && (
              <div className="mt-4 p-4 rounded-xl border border-stone-800 bg-stone-950 space-y-3 text-xs text-stone-300 font-mono leading-relaxed">
                <p className="text-stone-400">
                  Step 1: Substitute y = f + &epsilon; into the expected error:
                </p>
                <div className="p-2 rounded bg-stone-900 text-stone-200">
                  E[(y - f̂)&sup2;] = E[((f - f̂) + &epsilon;)&sup2;] = E[(f - f̂)&sup2;] + 2 E[(f -
                  f̂)&epsilon;] + E[&epsilon;&sup2;]
                </div>
                <p className="text-stone-400">
                  Step 2: Because noise &epsilon; is independent of f̂ and has zero mean, E[(f -
                  f̂)&epsilon;] = 0 and E[&epsilon;&sup2;] = &sigma;&sup2;:
                </p>
                <div className="p-2 rounded bg-stone-900 text-stone-200">
                  E[(y - f̂)&sup2;] = E[(f - f̂)&sup2;] + &sigma;&sup2;
                </div>
                <p className="text-stone-400">
                  Step 3: Add and subtract E[f̂] inside the first term:
                </p>
                <div className="p-2 rounded bg-stone-900 text-stone-200">
                  E[(f - f̂)&sup2;] = E[ ((f - E[f̂]) - (f̂ - E[f̂]))&sup2; ]
                </div>
                <p className="text-stone-400">Step 4: Expand the square:</p>
                <div className="p-2 rounded bg-stone-900 text-emerald-300">
                  = (f - E[f̂])&sup2; + E[(f̂ - E[f̂])&sup2;] - 2(f - E[f̂]) E[f̂ - E[f̂]]
                </div>
                <p className="text-stone-400 font-sans text-xs">
                  Because E[f̂ - E[f̂]] = 0, the cross-term vanishes completely, leaving (Bias)&sup2;
                  + Variance + &sigma;&sup2;!
                </p>
              </div>
            )}
          </div>
        </Card>
      </section>

      {/* Section 4: Diagnostic Guide */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100">
          4. Engineering Diagnostic Guide: Underfitting vs Overfitting
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed text-sm text-stone-300">
          <div className="p-5 rounded-xl border border-stone-800 bg-stone-900/40 space-y-3">
            <Badge variant="outline" className="border-blue-400 text-blue-300 font-mono text-xs">
              High Bias (Underfitting)
            </Badge>
            <p>
              <strong>Symptoms:</strong> Poor performance on training data (high training error) AND
              poor performance on validation data (high validation error).
            </p>
            <ul className="text-xs space-y-1 text-stone-400 list-disc list-inside">
              <li>Add more polynomial or interaction features</li>
              <li>Increase model capacity (e.g. deeper tree or neural net)</li>
              <li>Decrease regularization parameter (&lambda;)</li>
            </ul>
          </div>

          <div className="p-5 rounded-xl border border-stone-800 bg-stone-900/40 space-y-3">
            <Badge variant="outline" className="border-rose-400 text-rose-300 font-mono text-xs">
              High Variance (Overfitting)
            </Badge>
            <p>
              <strong>Symptoms:</strong> Exceptional performance on training data (near zero train
              error), but significantly higher validation error (large generalization gap).
            </p>
            <ul className="text-xs space-y-1 text-stone-400 list-disc list-inside">
              <li>Acquire more training examples</li>
              <li>Prune or eliminate redundant features (PCA / feature selection)</li>
              <li>Increase regularization penalty (&lambda;)</li>
              <li>Apply ensemble bagging (Random Forests)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 5: Viva Voce Corner */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100 flex items-center gap-2">
          <HelpCircle className="size-5 text-amber-400" />
          5. Viva Voce Q&amp;A Corner
        </h2>
        <div className="space-y-3">
          <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/40 space-y-1.5">
            <h4 className="font-montserrat text-sm font-semibold text-stone-200">
              Q1: Can training error ever be used as a proxy for generalization error?
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              <strong>Answer:</strong> Never. An algorithm can achieve 0% training error simply by
              memorizing every data point (e.g., a 1-Nearest Neighbor classifier or an unpruned
              decision tree). Training error only measures memorization capacity; only out-of-sample
              test error measures generalization.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/40 space-y-1.5">
            <h4 className="font-montserrat text-sm font-semibold text-stone-200">
              Q2: How does L2 Ridge Regularization navigate the Bias-Variance tradeoff?
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              <strong>Answer:</strong> Ridge regression adds a shrinkage penalty &lambda; &sum;
              &theta;<sub>j</sub>&sup2; to the loss. By shrinking parameter weights toward zero, it
              deliberately introduces a small amount of bias in exchange for a massive reduction in
              model variance, achieving a lower total test error.
            </p>
          </div>
        </div>
      </section>

      {/* Section 6: Knowledge Check */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100">
          6. Knowledge Check
        </h2>
        <Quiz conceptId="u3-bias-variance-tradeoff" items={quizItems} unitAccent={3} />
      </section>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between border-t border-stone-800 pt-6">
        <Link
          to="/learn/unit-3/polynomial-regression"
          className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-stone-200 font-mono transition-colors"
        >
          <ArrowLeft className="size-4" />
          Previous: Polynomial Regression
        </Link>
        <Link
          to="/learn/unit-3/locally-weighted-regression"
          className="inline-flex items-center gap-2 text-sm bg-stone-100 text-stone-950 hover:bg-stone-200 font-semibold px-4 py-2 rounded-lg rounded-br-none transition-colors"
        >
          Next: Locally Weighted Regression (LWR)
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
          1. Geman, Stuart, Elie Bienenstock, and René Doursat. &quot;Neural Networks and the
          Bias/Variance Dilemma.&quot; <em>Neural Computation</em>, 1992.
        </p>
        <p>
          2. Hastie, Trevor, et al. <em>The Elements of Statistical Learning</em>. Springer, 2009.
          Chapter 7.
        </p>
      </div>
    </div>
  );
}
