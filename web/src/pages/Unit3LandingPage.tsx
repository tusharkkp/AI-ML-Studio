import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Award, CheckCircle, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useProgressStore } from '@/features/progress/useProgressStore';

export function Unit3LandingPage() {
  const getProgress = useProgressStore((state) => state.getConceptProgress);

  const modules = [
    {
      id: 'u3-ml-paradigms',
      title: 'ML Paradigms: Supervised, Unsupervised & RL',
      hours: '0.8 hrs',
      desc: 'Arthur Samuel and Tom Mitchell definitions, task-experience-performance framework, and interactive paradigm classifier.',
      href: '/learn/unit-3/ml-paradigms',
      kind: 'core',
    },
    {
      id: 'u3-simple-linear-regression',
      title: 'Simple Linear Regression & Cost Function (MSE)',
      hours: '1.0 hrs',
      desc: 'Hypothesis line, Squared Error derivation, 3D convex loss bowl visualization, and authentic Salary dataset fitting.',
      href: '/learn/unit-3/simple-linear-regression',
      kind: 'flagship',
    },
    {
      id: 'u3-gradient-descent',
      title: 'Gradient Descent Optimization & Learning Dynamics',
      hours: '1.0 hrs',
      desc: 'Simultaneous weight updates, learning rate alpha tuning, convergence paths on 2D contour bowls, and divergence traps.',
      href: '/learn/unit-3/gradient-descent',
      kind: 'flagship',
    },
    {
      id: 'u3-multiple-linear-regression',
      title: 'Multiple Linear Regression & Normal Equation',
      hours: '0.8 hrs',
      desc: 'Matrix vectorization, closed-form OLS solution theta = (X^T X)^-1 X^T y, invertibility, and O(n^3) computational limits.',
      href: '/learn/unit-3/multiple-linear-regression',
      kind: 'core',
    },
    {
      id: 'u3-polynomial-regression',
      title: 'Polynomial Regression & Non-Linear Modeling',
      hours: '0.8 hrs',
      desc: 'Vandermonde power expansion, degree sweeper, non-linear curve fitting, and Runge boundary oscillations.',
      href: '/learn/unit-3/polynomial-regression',
      kind: 'flagship',
    },
    {
      id: 'u3-bias-variance-tradeoff',
      title: 'Bias-Variance Tradeoff & Model Complexity',
      hours: '0.8 hrs',
      desc: 'Expected error decomposition, underfitting vs overfitting sweet spot, and irreducible noise floor sigma^2.',
      href: '/learn/unit-3/bias-variance-tradeoff',
      kind: 'core',
    },
    {
      id: 'u3-locally-weighted-regression',
      title: 'Locally Weighted Linear Regression (LWR)',
      hours: '0.6 hrs',
      desc: 'Non-parametric lazy learning, Gaussian kernel weighting, and bandwidth tau hyperparameter tuning.',
      href: '/learn/unit-3/locally-weighted-regression',
      kind: 'core',
    },
    {
      id: 'u3-feature-engineering',
      title: 'Feature Engineering: Scaling, Encoding & Imputation',
      hours: '0.6 hrs',
      desc: 'StandardScaler vs MinMaxScaler, dummy variable trap in One-Hot encoding, and spherical loss contour acceleration.',
      href: '/learn/unit-3/feature-engineering',
      kind: 'core',
    },
    {
      id: 'u3-regression-metrics',
      title: 'Regression Evaluation Metrics & Residual Analysis',
      hours: '0.6 hrs',
      desc: 'MSE, RMSE, MAE, R^2 variance explained, and residual scatter plots diagnosing heteroscedasticity.',
      href: '/learn/unit-3/regression-metrics',
      kind: 'core',
    },
    {
      id: 'u3-case-real-estate',
      title: 'Case Study 1: Real-Estate Price Prediction',
      hours: '0.5 hrs',
      desc: 'Multi-feature valuation engine on King County housing data with correlation heatmaps and residual histograms.',
      href: '/case-studies/real-estate-pricing',
      kind: 'case-study',
    },
    {
      id: 'u3-case-healthcare',
      title: 'Case Study 2: Healthcare Cost Regression',
      hours: '0.5 hrs',
      desc: 'Medical charges prediction from physiological biomarkers with non-linear interaction terms and ethical fairness.',
      href: '/case-studies/healthcare-regression',
      kind: 'case-study',
    },
    {
      id: 'u3-self-regularization',
      title: 'Self-Study: Ridge, Lasso & Elastic Net Regularization',
      hours: '0.5 hrs',
      desc: 'L1 diamond ball sparsity vs L2 spherical shrinkage, coordinate descent, and Elastic Net mixing ratio rho.',
      href: '/learn/unit-3/regularization',
      kind: 'self-study',
    },
    {
      id: 'u3-further-kfold-cv',
      title: 'Further Reading: K-Fold Cross-Validation Case Study',
      hours: '0.3 hrs',
      desc: 'Train-validation-test split hygiene, data leakage prevention, and out-of-fold metric confidence intervals.',
      href: '/learn/unit-3/kfold-cross-validation',
      kind: 'further-reading',
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:px-12 space-y-10 bg-[#0c0a09] text-stone-300 font-sans">
      {/* Header */}
      <div className="border-b border-[#292524] pb-8">
        <Link
          to="/"
          className="inline-flex items-center text-xs font-mono text-stone-500 hover:text-[#fef3c7] mb-4 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Back to Course Overview
        </Link>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="outline" size="sm">
            Unit 3 of 6
          </Badge>
          <span className="flex items-center text-xs text-stone-500 ml-auto font-mono">
            <Clock className="w-3.5 h-3.5 mr-1 text-amber-400" /> 7 Syllabus Hours
          </span>
        </div>

        <h1 className="font-heading text-3xl font-semibold tracking-tight text-white sm:text-5xl">
          Unit 3: ML Fundamentals
        </h1>
        <p className="mt-4 text-base sm:text-lg text-stone-400 max-w-3xl leading-relaxed">
          From discrete search to statistical optimization: master supervised learning paradigms,{' '}
          <span className="font-heading text-[#fef3c7] font-semibold">convex loss surfaces</span>,
          gradient descent dynamics, the bias-variance tradeoff, and regularized regression.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#292524]">
          <div className="flex flex-wrap items-center gap-6 text-xs text-stone-400">
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>
                <strong>CO2:</strong> Apply Statistical Regression to Real Problems (L3)
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-sky-400" />
              <span>
                <strong>CO3:</strong> Systematic Hyperparameter Optimization (L4)
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>
                <strong>CO4:</strong> Analyze Model Strengths &amp; Failure Modes (L4)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/cheatsheets/unit-3">
              <Button variant="secondary" size="sm" className="text-xs">
                Revision Cheat Sheet
              </Button>
            </Link>
            <Link to="/learn/unit-3/exam">
              <Button variant="primary" size="sm" className="text-xs">
                Take Unit 3 Exam
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Grid of Concept Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((m) => {
          const progress = getProgress(m.id);
          const isDone = Boolean(progress?.quizPassed || (progress?.read && progress?.labCompleted));

          return (
            <Card
              key={m.id}
              className="group relative flex flex-col justify-between border-[#292524] bg-[#141210] p-5 transition-all duration-200 hover:border-stone-700 hover:bg-[#1a1715]"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-stone-500">
                      {m.hours}
                    </span>
                    {m.kind === 'flagship' && (
                      <Badge
                        variant="default"
                        className="text-[10px] text-amber-300 border-amber-800 bg-amber-950/40"
                      >
                        Flagship Lab
                      </Badge>
                    )}
                    {m.kind === 'case-study' && (
                      <Badge
                        variant="default"
                        className="text-[10px] text-sky-300 border-sky-800 bg-sky-950/40"
                      >
                        Case Study
                      </Badge>
                    )}
                    {m.kind === 'self-study' && (
                      <Badge
                        variant="default"
                        className="text-[10px] text-purple-300 border-purple-800 bg-purple-950/40"
                      >
                        Self-Study
                      </Badge>
                    )}
                  </div>
                  {isDone && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
                </div>

                <CardHeader className="p-0 mb-3">
                  <CardTitle className="text-base font-semibold text-stone-100 group-hover:text-[#fef3c7] transition-colors leading-snug">
                    {m.title}
                  </CardTitle>
                  <CardDescription className="text-xs text-stone-400 mt-1.5 leading-relaxed">
                    {m.desc}
                  </CardDescription>
                </CardHeader>
              </div>

              <CardContent className="p-0 pt-4 mt-auto border-t border-[#292524]/60">
                <Link to={m.href} className="block">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs justify-between group-hover:border-stone-600 group-hover:text-white"
                  >
                    <span>{isDone ? 'Review Module' : 'Explore Concept'}</span>
                    <span className="font-mono text-stone-500">&rarr;</span>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
