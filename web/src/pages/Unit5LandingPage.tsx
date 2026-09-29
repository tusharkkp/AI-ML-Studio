import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock, Award } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useProgressStore } from '@/features/progress/useProgressStore';

export const Unit5LandingPage: React.FC = () => {
  const getConceptProgress = useProgressStore((state) => state.getConceptProgress);

  const topics = [
    {
      id: 'u5-decision-trees',
      title: 'Decision tree fundamentals & structure',
      path: '/learn/unit-5/decision-trees',
      duration: '45 mins',
      kind: 'Core Concept',
      desc: 'Tree anatomy, recursive partitioning, axis-aligned decision boundaries, and ID3 vs CART algorithms.',
    },
    {
      id: 'u5-impurity-split-criteria',
      title: 'Impurity measures: Entropy, information gain & Gini',
      path: '/learn/unit-5/impurity-split-criteria',
      duration: '50 mins',
      kind: 'Core Concept',
      desc: 'Quantifying uncertainty with Shannon entropy and Gini index, plus C4.5 Gain Ratio to counter multi-valued attribute traps.',
    },
    {
      id: 'u5-tree-pruning',
      title: 'Tree pruning & overfitting control',
      path: '/learn/unit-5/tree-pruning',
      duration: '40 mins',
      kind: 'Core Concept',
      desc: 'Pre-pruning stopping conditions vs post-pruning cost-complexity penalty to balance model complexity and generalization.',
    },
    {
      id: 'u5-svm-fundamentals',
      title: 'Support Vector Machines: Hyperplane, margin & support vectors',
      path: '/learn/unit-5/svm-fundamentals',
      duration: '55 mins',
      kind: 'Core Concept',
      desc: 'Maximal margin classifier, convex quadratic optimization, support vectors, and soft-margin slack variables.',
    },
    {
      id: 'u5-svm-kernels',
      title: 'SVM soft-margin & the kernel trick',
      path: '/learn/unit-5/svm-kernels',
      duration: '50 mins',
      kind: 'Core Concept',
      desc: 'Lifting non-separable 2D data into 3D Hilbert spaces with Polynomial and Radial Basis Function (RBF) kernels without explicit coordinate mapping.',
    },
    {
      id: 'u5-ensemble-significance',
      title: 'Ensemble learning significance (Bias vs Variance)',
      path: '/learn/unit-5/ensemble-significance',
      duration: '35 mins',
      kind: 'Core Concept',
      desc: 'Wisdom of crowds in machine learning: why combining diverse imperfect models dramatically reduces variance or bias.',
    },
    {
      id: 'u5-bagging-random-forests',
      title: 'Bagging (Bootstrap Aggregation) & Random Forests',
      path: '/learn/unit-5/bagging-random-forests',
      duration: '50 mins',
      kind: 'Core Concept',
      desc: 'Bootstrap sub-sampling, out-of-bag validation error, and random feature sub-space selection to decorrelate decision trees.',
    },
    {
      id: 'u5-boosting-stacking',
      title: 'Boosting concepts & stacking (Stacked Generalization)',
      path: '/learn/unit-5/boosting-stacking',
      duration: '45 mins',
      kind: 'Core Concept',
      desc: 'Sequential adaptive reweighting of hard samples vs meta-learner architectures combining heterogeneous classifiers.',
    },
    {
      id: 'u5-performance-evaluation',
      title: 'Systematic performance evaluation of ML models',
      path: '/learn/unit-5/performance-evaluation',
      duration: '35 mins',
      kind: 'Core Concept',
      desc: 'Comprehensive head-to-head benchmarking of Decision Trees, SVMs, and Random Forests under stratified cross-validation.',
    },
    {
      id: 'u5-case-diabetes',
      title: 'Case Study: Pima Indians diabetes prediction',
      path: '/case-studies/diabetes-prediction',
      duration: '30 mins',
      kind: 'Case Study',
      desc: 'End-to-end diagnostic pipeline handling zero-imputation in clinical bio-markers and comparing tree vs ensemble models.',
    },
    {
      id: 'u5-self-adaboost',
      title: 'Self-Study: AdaBoost algorithm mechanics',
      path: '/learn/unit-5/adaboost',
      duration: '30 mins',
      kind: 'Self-Study',
      desc: 'Step-by-step sample weight updates and alpha classifier voting weight derivation in Freund & Schapire AdaBoost.M1.',
    },
    {
      id: 'u5-further-dt-regression',
      title: 'Further Reading: Decision Tree for Regression',
      path: '/learn/unit-5/decision-tree-regression',
      duration: '25 mins',
      kind: 'Further Reading',
      desc: 'Continuous target recursive partitioning using variance reduction (MSE) to construct piecewise constant step functions.',
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-12 space-y-12">
      {/* Hero Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="unit">Unit 5</Badge>
          <Badge variant="outline">8 Hours Syllabus</Badge>
          <Badge variant="outline">CO2, CO3, CO4</Badge>
          <Badge variant="outline">MIT Academy of Engineering</Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-foreground font-manrope">
          Linear & decision models
        </h1>

        <p className="text-lg text-muted-foreground font-montserrat max-w-3xl leading-relaxed">
          Traverse the evolutionary leap from{' '}
          <span className="text-cream font-medium">axis-aligned decision trees</span> to
          maximum-margin support vector machines and high-accuracy ensemble committees.
        </p>
      </div>

      {/* Paradigm Comparator Matrix */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-medium text-foreground font-manrope">
          The three master modeling paradigms compared
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 space-y-4 border-orange-50/15 bg-black/10">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-lg text-foreground font-manrope">
                Decision Trees
              </span>
              <Badge variant="default">Interpretable</Badge>
            </div>
            <p className="text-sm text-muted-foreground font-montserrat">
              Recursive partitioning of feature space using{' '}
              <span className="text-cream font-medium">orthogonal splits</span>. Zero scaling
              assumptions and human-readable rules, but susceptible to high variance without
              regularization.
            </p>
            <div className="space-y-1 text-xs font-mono text-muted-foreground border-t border-border/40 pt-3">
              <div>Boundary: Axis-parallel hyperplanes</div>
              <div>Optimization: Greedy heuristic (Entropy / Gini)</div>
              <div>Key Parameter: Max Depth, Min Samples</div>
            </div>
          </Card>

          <Card className="p-6 space-y-4 border-orange-50/15 bg-black/10">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-lg text-foreground font-manrope">
                Support Vector Machines
              </span>
              <Badge variant="default">Maximum Margin</Badge>
            </div>
            <p className="text-sm text-muted-foreground font-montserrat">
              Finds the unique hyperplane that maximizes the{' '}
              <span className="text-cream font-medium">geometric separation margin</span>. Uses
              kernel functions to solve non-linear classification without expanding features
              explicitly.
            </p>
            <div className="space-y-1 text-xs font-mono text-muted-foreground border-t border-border/40 pt-3">
              <div>Boundary: Linear in kernel feature space</div>
              <div>Optimization: Global convex quadratic program</div>
              <div>Key Parameter: Regularization C, Kernel Gamma</div>
            </div>
          </Card>

          <Card className="p-6 space-y-4 border-orange-50/15 bg-black/10">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-lg text-foreground font-manrope">
                Ensemble Methods
              </span>
              <Badge variant="default">High Accuracy</Badge>
            </div>
            <p className="text-sm text-muted-foreground font-montserrat">
              Combines an array of base estimators to achieve{' '}
              <span className="text-cream font-medium">superior generalization</span>. Bagging cuts
              variance, Boosting drives down bias, and Stacking leverages diverse model
              architectures.
            </p>
            <div className="space-y-1 text-xs font-mono text-muted-foreground border-t border-border/40 pt-3">
              <div>Boundary: Smooth non-linear consensus voting</div>
              <div>Optimization: Bootstrap sampling or Gradient Descent</div>
              <div>Key Parameter: Number of Estimators, Learning Rate</div>
            </div>
          </Card>
        </div>
      </div>

      {/* Curriculum Roadmap Grid */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border/40 pb-3">
          <h2 className="text-xl sm:text-2xl font-medium text-foreground font-manrope">
            Unit 5 syllabus curriculum (12 Topics)
          </h2>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <Link to="/cheatsheets/unit-5" className="hover:text-brand transition-colors">
              Revision Cheat Sheet
            </Link>
            <span>•</span>
            <Link to="/learn/unit-5/exam" className="hover:text-brand transition-colors">
              20-Q Assessment Exam
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topics.map((t) => {
            const p = getConceptProgress(t.id);
            const isCompleted = p?.labCompleted || p?.read;
            return (
              <Link key={t.id} to={t.path} className="group">
                <Card className="p-5 h-full transition-all border-orange-50/15 bg-black/10 hover:border-orange-50/30 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <Badge variant="outline" size="sm">
                        {t.kind}
                      </Badge>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{t.duration}</span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-foreground group-hover:text-cream transition-colors text-base font-manrope">
                      {t.title}
                    </h3>
                    <p className="text-xs text-muted-foreground font-montserrat mt-1.5 leading-relaxed">
                      {t.desc}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/30 text-xs">
                    <span className="text-muted-foreground font-mono">
                      {isCompleted ? (
                        <span className="text-emerald-400 font-semibold">Completed</span>
                      ) : (
                        'Ready to explore'
                      )}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground group-hover:text-foreground font-medium">
                      Start{' '}
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Flagship Assessment Hub */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
        <Card className="p-6 border-orange-50/15 bg-black/10 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-cream" />
              <h3 className="font-semibold text-lg text-foreground font-manrope">
                Unit 5 timed exam
              </h3>
            </div>
            <p className="text-xs text-muted-foreground font-montserrat leading-relaxed">
              20 questions assessing split calculations, support vector margins, kernel mathematics,
              and ensemble diversity under a 25-minute exam countdown.
            </p>
          </div>
          <Link to="/learn/unit-5/exam">
            <Button variant="primary" className="w-full">
              Begin Unit 5 Exam
            </Button>
          </Link>
        </Card>

        <Card className="p-6 border-orange-50/15 bg-black/10 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cream" />
              <h3 className="font-semibold text-lg text-foreground font-manrope">
                Unit 5 revision cheat sheet
              </h3>
            </div>
            <p className="text-xs text-muted-foreground font-montserrat leading-relaxed">
              Printable high-density cheat sheet containing all formula cards (Entropy, Gini,
              Margin, Dual SVM, AdaBoost weights) and 8 interactive oral viva cards.
            </p>
          </div>
          <Link to="/cheatsheets/unit-5">
            <Button variant="outline" className="w-full">
              Open Revision Sheet
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};
