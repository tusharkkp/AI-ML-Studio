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
    <div className="min-h-screen bg-[#0c0a09] text-stone-300 font-sans">
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        {/* Header Section */}
        <div className="space-y-4 border-b border-[#292524] pb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-xs font-mono text-stone-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Home
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <Badge
              variant="outline"
              className="border-amber-500/40 text-amber-300 font-mono text-xs"
            >
              Unit 4: Instances & Probabilistic Models
            </Badge>
            <span className="flex items-center gap-1 text-xs text-stone-400 font-mono">
              <Clock className="w-3.5 h-3.5" />6 Syllabus Hours
            </span>
            <span className="flex items-center gap-1 text-xs text-emerald-400 font-mono">
              <Award className="w-3.5 h-3.5" />
              CO2, CO3, CO4 Mapped
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-mono">
            Instances & Probabilistic Models
          </h1>

          <p className="text-stone-400 text-base leading-relaxed max-w-3xl">
            Move beyond continuous regression into{' '}
            <span className="text-[#fef3c7] font-medium font-sans">
              probabilistic decision making, generative versus discriminative classification, and
              instance-based reasoning
            </span>
            . From Bayes' Theorem and Naive Bayes to Logistic Regression and k-NN, master the core
            algorithms that power diagnostic systems and risk analysis.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link to="/learn/unit-4/exam">
              <Button
                variant="outline"
                size="sm"
                className="border-amber-500/40 text-amber-300 hover:bg-amber-950/20 text-xs font-mono"
              >
                Unit 4 Exam (20 Questions)
              </Button>
            </Link>
            <Link to="/cheatsheets/unit-4">
              <Button
                variant="outline"
                size="sm"
                className="border-[#292524] text-stone-300 hover:bg-[#1c1917] text-xs font-mono"
              >
                Master Revision Cheat Sheet & Viva Voce
              </Button>
            </Link>
          </div>
        </div>

        {/* Interactive Classifier Taxonomy Sorter */}
        <Card className="bg-[#141210] border-[#292524]">
          <CardHeader>
            <CardTitle className="text-white text-lg font-mono flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-amber-400" />
              Classification Paradigms: Generative vs Discriminative vs Instance-Based
            </CardTitle>
            <CardDescription className="text-stone-400 text-xs">
              Select a paradigm below to compare mathematical formulations, fundamental questions,
              and trade-offs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedParadigm('generative')}
                className={`px-4 py-2 rounded-lg rounded-br-none text-xs font-mono font-bold transition-colors border ${
                  selectedParadigm === 'generative'
                    ? 'bg-amber-400 text-black border-amber-300'
                    : 'bg-[#1c1917] text-stone-300 border-[#292524] hover:border-stone-500'
                }`}
              >
                Generative Models (Naive Bayes)
              </button>
              <button
                onClick={() => setSelectedParadigm('discriminative')}
                className={`px-4 py-2 rounded-lg rounded-br-none text-xs font-mono font-bold transition-colors border ${
                  selectedParadigm === 'discriminative'
                    ? 'bg-sky-400 text-black border-sky-300'
                    : 'bg-[#1c1917] text-stone-300 border-[#292524] hover:border-stone-500'
                }`}
              >
                Discriminative Models (Logistic Regression)
              </button>
              <button
                onClick={() => setSelectedParadigm('instance')}
                className={`px-4 py-2 rounded-lg rounded-br-none text-xs font-mono font-bold transition-colors border ${
                  selectedParadigm === 'instance'
                    ? 'bg-emerald-400 text-black border-emerald-300'
                    : 'bg-[#1c1917] text-stone-300 border-[#292524] hover:border-stone-500'
                }`}
              >
                Instance-Based / Lazy (k-NN)
              </button>
            </div>

            <div className="p-4 bg-[#0c0a09] border border-[#292524] rounded-lg space-y-3 font-mono text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#292524] gap-2">
                <span className="text-white font-bold text-sm">
                  {paradigms[selectedParadigm].name}
                </span>
                <span className="text-amber-300 font-mono">
                  {paradigms[selectedParadigm].formula}
                </span>
              </div>

              <div className="text-stone-300">
                <strong className="text-stone-400 block mb-0.5">Core Question:</strong>"
                {paradigms[selectedParadigm].question}"
              </div>

              <div className="text-stone-300">
                <strong className="text-stone-400 block mb-0.5">Canonical Algorithms:</strong>
                {paradigms[selectedParadigm].examples}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-stone-300 font-sans">
                <div className="p-3 bg-[#141210] border border-[#292524] rounded">
                  <strong className="text-emerald-400 font-mono block mb-1">Strengths:</strong>
                  {paradigms[selectedParadigm].strengths}
                </div>
                <div className="p-3 bg-[#141210] border border-[#292524] rounded">
                  <strong className="text-rose-400 font-mono block mb-1">Limitations:</strong>
                  {paradigms[selectedParadigm].limitations}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Modules Grid */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <span className="text-amber-400 text-base">02.</span>
            Unit 4 Curriculum Road Map
          </h2>
          <p className="text-stone-400 text-sm">
            Select a module below to launch the interactive lab, derivation walk-through, and
            micro-quiz.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    className={`h-full bg-[#141210] border transition-colors ${
                      isFlagship
                        ? 'border-amber-500/30 group-hover:border-amber-400/60'
                        : isCaseStudy
                          ? 'border-sky-500/30 group-hover:border-sky-400/60'
                          : 'border-[#292524] group-hover:border-stone-500'
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-mono ${
                            isFlagship
                              ? 'border-amber-500/40 text-amber-300'
                              : isCaseStudy
                                ? 'border-sky-500/40 text-sky-300'
                                : 'border-[#292524] text-stone-400'
                          }`}
                        >
                          {m.kind.toUpperCase()}
                        </Badge>
                        <span className="text-[11px] font-mono text-stone-500">{m.hours}</span>
                      </div>
                      <CardTitle className="text-white text-base group-hover:text-amber-300 transition-colors font-mono">
                        {m.title}
                      </CardTitle>
                      <CardDescription className="text-stone-400 text-xs line-clamp-2">
                        {m.desc}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between pt-3 border-t border-[#292524] text-[11px] font-mono text-stone-500">
                        <span>Status</span>
                        {progress?.labCompleted || progress?.read ? (
                          <span className="text-emerald-400 flex items-center gap-1 font-bold">
                            <CheckCircle className="w-3 h-3" />
                            Completed
                          </span>
                        ) : (
                          <span className="text-amber-400/80">Available →</span>
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
