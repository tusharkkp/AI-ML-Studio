import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Award, CheckCircle, BrainCircuit } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useProgressStore } from '@/features/progress/useProgressStore';

export function Unit4LandingPage() {
  const getProgress = useProgressStore((state) => state.getConceptProgress);

  const modules = [
    {
      id: 'u4-bayes-theorem',
      title: "Bayes' Theorem & Probabilistic Foundations",
      hours: '1.0 hrs',
      desc: 'Prior, Likelihood, Posterior, Evidence, Law of Total Probability, and the medical base-rate paradox visualizer.',
      href: '/learn/unit-4/bayes-theorem',
      kind: 'flagship',
    },
    {
      id: 'u4-naive-bayes',
      title: 'Naive Bayes & Conditional Independence',
      hours: '1.2 hrs',
      desc: 'Class-conditional independence assumption, log-domain computation, and the spam filtering studio.',
      href: '/learn/unit-4/naive-bayes',
      kind: 'flagship',
    },
    {
      id: 'u4-laplace-smoothing',
      title: 'Laplace / Additive Smoothing',
      hours: '0.6 hrs',
      desc: 'Zero-frequency problem, additive pseudo-counts alpha, and vocabulary-normalized probability floors.',
      href: '/learn/unit-4/laplace-smoothing',
      kind: 'core',
    },
    {
      id: 'u4-logistic-regression',
      title: 'Logistic Regression for Classification',
      hours: '1.4 hrs',
      desc: 'Odds ratio, logit, Sigmoid activation, Binary Cross-Entropy loss, and 2D decision boundary studio.',
      href: '/learn/unit-4/logistic-regression',
      kind: 'flagship',
    },
    {
      id: 'u4-classification-metrics',
      title: 'Classification Metrics & Confusion Matrix',
      hours: '0.9 hrs',
      desc: '2x2 grid (TP, FP, TN, FN), Accuracy paradox, Precision, Recall, Specificity, and F1-score optimization.',
      href: '/learn/unit-4/classification-metrics',
      kind: 'core',
    },
    {
      id: 'u4-roc-auc',
      title: 'ROC Curve & Area Under Curve (ROC-AUC)',
      hours: '0.9 hrs',
      desc: 'Sweeping discrimination threshold tau, TPR vs FPR trade-off curve, and trapezoidal AUC integration.',
      href: '/learn/unit-4/roc-auc',
      kind: 'core',
    },
    {
      id: 'u4-case-churn',
      title: 'Case Study: Customer Churn Prediction',
      hours: '0.5 hrs',
      desc: 'Telecom churn pipeline, class imbalance weighting, and cost-sensitive threshold selection.',
      href: '/case-studies/customer-churn',
      kind: 'case-study',
    },
    {
      id: 'u4-self-knn',
      title: 'Self-Study: k-Nearest Neighbors (k-NN)',
      hours: '0.8 hrs',
      desc: 'Instance-based lazy learning, distance metrics (L1, L2, Lp), Voronoi cells, and choice of neighborhood k.',
      href: '/learn/unit-4/knn',
      kind: 'self-study',
    },
    {
      id: 'u4-further-variational-inference',
      title: 'Further Reading: Variational Inference',
      hours: '0.3 hrs',
      desc: 'Intractable Bayesian posteriors, KL divergence minimization, and intuitive ELBO coordinate ascent visualizer.',
      href: '/learn/unit-4/variational-inference',
      kind: 'further-reading',
    },
  ];

  // Interactive Paradigm Sorter
  const [selectedParadigm, setSelectedParadigm] = useState<
    'generative' | 'discriminative' | 'instance'
  >('generative');

  const paradigms = {
    generative: {
      name: 'Generative Models',
      formula: 'P(X, Y) = P(X | Y) · P(Y)',
      question: 'How did the data get generated?',
      examples:
        'Naive Bayes, Gaussian Mixture Models (GMM), Hidden Markov Models (HMM), Variational Autoencoders',
      strengths:
        'Naturally handles missing data; excels on small sample sizes; can generate synthetic samples.',
      limitations:
        'Assumes specific data distributions; often achieves lower asymptotic accuracy when data is plentiful.',
    },
    discriminative: {
      name: 'Discriminative Models',
      formula: 'Directly models P(Y | X) or f(X) → Y',
      question: 'Where is the optimal decision boundary between classes?',
      examples:
        'Logistic Regression, Support Vector Machines (SVM), Perceptrons, Deep Neural Networks',
      strengths:
        'Generally superior classification accuracy with large datasets; does not waste capacity modeling inputs.',
      limitations:
        'Prone to overfitting on tiny datasets; cannot generate new samples; sensitive to outliers without regularization.',
    },
    instance: {
      name: 'Instance-Based (Lazy) Models',
      formula: 'ŷ = vote(k-nearest neighbors of x)',
      question: 'Which stored training memories are closest to this query?',
      examples:
        'k-Nearest Neighbors (k-NN), Locally Weighted Regression (LWR), Case-Based Reasoning',
      strengths:
        'Zero training time (O(1) fit); easily adapts to new data; creates complex non-linear boundaries.',
      limitations:
        'O(N · d) query prediction latency; high memory footprint; suffers from the curse of dimensionality.',
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:px-12 space-y-10">
      <div className="space-y-10">
        {/* Header Section */}
        <div className="space-y-4 border-b border-border pb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-xs font-mono text-muted-foreground hover:text-brand transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Course Overview
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" size="sm">
              Unit 4 of 6
            </Badge>
            <span className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
              <Clock className="w-3.5 h-3.5 text-amber-500" />6 Syllabus Hours
            </span>
            <span className="flex items-center gap-1 text-xs text-emerald-500 font-mono">
              <Award className="w-3.5 h-3.5" />
              CO2, CO3, CO4 Mapped
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight font-heading">
            Unit 4: Instances &amp; Probabilistic Models
          </h1>

          <p className="text-muted-foreground text-base leading-relaxed max-w-3xl">
            Move beyond continuous regression into{' '}
            <span className="text-brand font-medium">
              probabilistic decision making, generative versus discriminative classification, and
              instance-based reasoning
            </span>
            . From Bayes' Theorem and Naive Bayes to Logistic Regression and k-NN, master the core
            algorithms that power diagnostic systems and risk analysis.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link to="/cheatsheets/unit-4">
              <Button variant="secondary" size="sm" className="text-xs">
                Revision Cheat Sheet &amp; Viva Voce
              </Button>
            </Link>
            <Link to="/learn/unit-4/exam">
              <Button variant="primary" size="sm" className="text-xs">
                Take Unit 4 Exam
              </Button>
            </Link>
          </div>
        </div>

        {/* Interactive Classifier Taxonomy Sorter */}
        <Card className="p-6 space-y-6">
          <CardHeader className="p-0">
            <CardTitle className="text-foreground text-lg font-heading flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-brand" />
              Classification Paradigms: Generative vs Discriminative vs Instance-Based
            </CardTitle>
            <CardDescription className="text-muted-foreground text-xs">
              Select a paradigm below to compare mathematical formulations, fundamental questions,
              and trade-offs.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedParadigm('generative')}
                className={`px-4 py-2 rounded-lg text-xs font-mono font-medium transition-colors border ${
                  selectedParadigm === 'generative'
                    ? 'bg-amber-500 text-white border-amber-600 dark:bg-amber-400 dark:text-black shadow-subtle'
                    : 'bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground'
                }`}
              >
                Generative Models (Naive Bayes)
              </button>
              <button
                onClick={() => setSelectedParadigm('discriminative')}
                className={`px-4 py-2 rounded-lg text-xs font-mono font-medium transition-colors border ${
                  selectedParadigm === 'discriminative'
                    ? 'bg-sky-500 text-white border-sky-600 dark:bg-sky-400 dark:text-black shadow-subtle'
                    : 'bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground'
                }`}
              >
                Discriminative Models (Logistic Regression)
              </button>
              <button
                onClick={() => setSelectedParadigm('instance')}
                className={`px-4 py-2 rounded-lg text-xs font-mono font-medium transition-colors border ${
                  selectedParadigm === 'instance'
                    ? 'bg-emerald-500 text-white border-emerald-600 dark:bg-emerald-400 dark:text-black shadow-subtle'
                    : 'bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground'
                }`}
              >
                Instance-Based / Lazy (k-NN)
              </button>
            </div>

            <div className="p-4 bg-muted/40 border border-border rounded-lg space-y-3 font-mono text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-border gap-2">
                <span className="text-foreground font-bold text-sm">
                  {paradigms[selectedParadigm].name}
                </span>
                <span className="text-brand font-mono">
                  {paradigms[selectedParadigm].formula}
                </span>
              </div>

              <div className="text-foreground/90">
                <strong className="text-muted-foreground block mb-0.5">Core Question:</strong>"
                {paradigms[selectedParadigm].question}"
              </div>

              <div className="text-foreground/90">
                <strong className="text-muted-foreground block mb-0.5">Canonical Algorithms:</strong>
                {paradigms[selectedParadigm].examples}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-foreground font-sans">
                <div className="p-3 bg-card border border-border rounded">
                  <strong className="text-emerald-600 dark:text-emerald-400 font-mono block mb-1">Strengths:</strong>
                  {paradigms[selectedParadigm].strengths}
                </div>
                <div className="p-3 bg-card border border-border rounded">
                  <strong className="text-rose-600 dark:text-rose-400 font-mono block mb-1">Limitations:</strong>
                  {paradigms[selectedParadigm].limitations}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Modules Grid */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground font-heading flex items-center gap-2">
            <span className="text-brand text-base">02.</span>
            Unit 4 Curriculum Road Map
          </h2>
          <p className="text-muted-foreground text-sm">
            Select a module below to launch the interactive lab, derivation walk-through, and
            micro-quiz.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {modules.map((m) => {
              const progress = getProgress(m.id);
              const isFlagship = m.kind === 'flagship';
              const isCaseStudy = m.kind === 'case-study';

              return (
                <Link
                  key={m.id}
                  to={m.href}
                  className="group block transition-transform duration-150 hover:-translate-y-0.5"
                >
                  <Card
                    className={`h-full flex flex-col justify-between transition-colors ${
                      isFlagship
                        ? 'border-amber-500/30 group-hover:border-amber-500'
                        : isCaseStudy
                          ? 'border-sky-500/30 group-hover:border-sky-500'
                          : 'border-border group-hover:border-brand/40'
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <Badge
                          variant="outline"
                          size="sm"
                          className="text-[10px] font-mono"
                        >
                          {m.kind.toUpperCase()}
                        </Badge>
                        <span className="text-[11px] font-mono text-muted-foreground">{m.hours}</span>
                      </div>
                      <CardTitle className="text-foreground text-base group-hover:text-brand transition-colors font-heading leading-snug">
                        {m.title}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground text-xs line-clamp-2">
                        {m.desc}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0 mt-auto">
                      <div className="flex items-center justify-between pt-3 border-t border-card-edge text-[11px] font-mono text-muted-foreground">
                        <span>Status</span>
                        {progress?.labCompleted || progress?.read ? (
                          <span className="text-emerald-500 flex items-center gap-1 font-bold">
                            <CheckCircle className="w-3 h-3" />
                            Completed
                          </span>
                        ) : (
                          <span className="text-brand font-medium">Available →</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
