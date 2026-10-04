import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Scale,
  Sparkles,
  GitCompare,
  ArrowRight,
  Sliders,
  CheckCircle2,
  XCircle,
  Search,
  ExternalLink,
} from 'lucide-react';

type ProblemDomain = 'all' | 'classification' | 'regression' | 'search';

interface AlgorithmProfile {
  id: string;
  name: string;
  domain: 'classification' | 'regression' | 'search';
  unit: number;
  unitBadge: string;
  learnPath: string;
  labPath: string;
  objective: string;
  timeComplexityTrain: string;
  timeComplexityPredict: string;
  spaceComplexity: string;
  interpretability: 'High' | 'Medium' | 'Low' | 'Black Box';
  nonLinearity: 'Native' | 'Via Kernels' | 'Via Basis Expansion' | 'None (Linear)';
  outlierSensitivity: 'Robust' | 'Moderate' | 'Severe';
  sampleEfficiency: 'Works on Small N' | 'Requires Moderate N' | 'Requires Large N';
  dimCurse: 'Robust' | 'Moderate' | 'Vulnerable';
  bestFor: string;
  fatalFlaw: string;
}

const ALGORITHMS: AlgorithmProfile[] = [
  // Classification
  {
    id: 'logistic',
    name: 'Logistic Regression',
    domain: 'classification',
    unit: 4,
    unitBadge: 'U4',
    learnPath: '/learn/unit-4/logistic-regression',
    labPath: '/learn/unit-4/logistic-regression',
    objective: 'Minimizes Binary Cross-Entropy loss via gradient descent',
    timeComplexityTrain: 'O(N · d)',
    timeComplexityPredict: 'O(d)',
    spaceComplexity: 'O(d)',
    interpretability: 'High',
    nonLinearity: 'Via Basis Expansion',
    outlierSensitivity: 'Moderate',
    sampleEfficiency: 'Works on Small N',
    dimCurse: 'Moderate',
    bestFor:
      'Calibrated baseline probabilities and medical/credit risk scoring with legal audit requirements.',
    fatalFlaw:
      'Cannot learn non-linear boundaries natively without manual polynomial feature crosses.',
  },
  {
    id: 'naive-bayes',
    name: 'Naive Bayes',
    domain: 'classification',
    unit: 4,
    unitBadge: 'U4',
    learnPath: '/learn/unit-4/naive-bayes',
    labPath: '/learn/unit-4/naive-bayes',
    objective: 'Maximizes posterior P(C|X) under class conditional independence',
    timeComplexityTrain: 'O(N · d)',
    timeComplexityPredict: 'O(C · d)',
    spaceComplexity: 'O(C · d)',
    interpretability: 'High',
    nonLinearity: 'None (Linear)',
    outlierSensitivity: 'Robust',
    sampleEfficiency: 'Works on Small N',
    dimCurse: 'Robust',
    bestFor:
      'High-dimensional text classification, spam filtering, and streaming document analysis.',
    fatalFlaw:
      'Severe probability distortion when strongly correlated features violate the independence assumption.',
  },
  {
    id: 'knn',
    name: 'k-Nearest Neighbors (k-NN)',
    domain: 'classification',
    unit: 4,
    unitBadge: 'U4',
    learnPath: '/learn/unit-4/knn',
    labPath: '/learn/unit-4/knn',
    objective: 'Non-parametric majority vote among k closest training instances',
    timeComplexityTrain: 'O(1) (Lazy)',
    timeComplexityPredict: 'O(N · d)',
    spaceComplexity: 'O(N · d)',
    interpretability: 'Medium',
    nonLinearity: 'Native',
    outlierSensitivity: 'Severe',
    sampleEfficiency: 'Works on Small N',
    dimCurse: 'Vulnerable',
    bestFor:
      'Low-dimensional irregular decision geometries and visual image recommendation baselines.',
    fatalFlaw:
      'Curse of Dimensionality collapses distance contrast in high dimensions; slow test-time query evaluation.',
  },
  {
    id: 'decision-tree-clf',
    name: 'Decision Tree (CART)',
    domain: 'classification',
    unit: 5,
    unitBadge: 'U5',
    learnPath: '/learn/unit-5/decision-trees',
    labPath: '/learn/unit-5/decision-trees',
    objective: 'Recursive greedy partitioning maximizing Gini or Information Gain',
    timeComplexityTrain: 'O(d · N log N)',
    timeComplexityPredict: 'O(Depth) ≤ O(log N)',
    spaceComplexity: 'O(Leaves)',
    interpretability: 'High',
    nonLinearity: 'Native',
    outlierSensitivity: 'Robust',
    sampleEfficiency: 'Requires Moderate N',
    dimCurse: 'Moderate',
    bestFor: 'Explainable rule-based clinical workflows and mixed categorical/numerical datasets.',
    fatalFlaw:
      'High variance and instability: small data perturbations completely restructure the tree.',
  },
  {
    id: 'svm-linear',
    name: 'Linear Support Vector Machine',
    domain: 'classification',
    unit: 5,
    unitBadge: 'U5',
    learnPath: '/learn/unit-5/svm-fundamentals',
    labPath: '/learn/unit-5/svm-fundamentals',
    objective: 'Maximizes geometric margin 2/||w|| with soft-margin slack penalty C',
    timeComplexityTrain: 'O(N · d)',
    timeComplexityPredict: 'O(d)',
    spaceComplexity: 'O(d)',
    interpretability: 'Medium',
    nonLinearity: 'None (Linear)',
    outlierSensitivity: 'Moderate',
    sampleEfficiency: 'Works on Small N',
    dimCurse: 'Robust',
    bestFor:
      'High-dimensional sparse text vectors and gene expression classification where d >> N.',
    fatalFlaw:
      'Incapable of separating concentric circular or spiral geometries without kernel lifting.',
  },
  {
    id: 'svm-rbf',
    name: 'Kernel SVM (Gaussian RBF)',
    domain: 'classification',
    unit: 5,
    unitBadge: 'U5',
    learnPath: '/learn/unit-5/svm-kernels',
    labPath: '/learn/unit-5/svm-kernels',
    objective: 'Maximizes margin in infinite-dimensional Reproducing Kernel Hilbert Space',
    timeComplexityTrain: 'O(N² ~ N³)',
    timeComplexityPredict: 'O(N_sv · d)',
    spaceComplexity: 'O(N_sv · d)',
    interpretability: 'Low',
    nonLinearity: 'Via Kernels',
    outlierSensitivity: 'Moderate',
    sampleEfficiency: 'Works on Small N',
    dimCurse: 'Robust',
    bestFor:
      'Complex non-linear classification on moderate-sized datasets with clean separation boundaries.',
    fatalFlaw: 'Quadratic training scaling prevents application to massive datasets (N > 50,000).',
  },
  {
    id: 'random-forest',
    name: 'Random Forest',
    domain: 'classification',
    unit: 5,
    unitBadge: 'U5',
    learnPath: '/learn/unit-5/bagging-random-forests',
    labPath: '/learn/unit-5/bagging-random-forests',
    objective:
      'Aggregates B decorrelated trees trained on bootstrap samples with random feature subspaces',
    timeComplexityTrain: 'O(B · m · N log N)',
    timeComplexityPredict: 'O(B · Depth)',
    spaceComplexity: 'O(B · Leaves)',
    interpretability: 'Medium',
    nonLinearity: 'Native',
    outlierSensitivity: 'Robust',
    sampleEfficiency: 'Requires Moderate N',
    dimCurse: 'Robust',
    bestFor:
      'Gold-standard competitive tabular classification benchmark with zero feature scaling required.',
    fatalFlaw:
      'Higher memory footprint and inference latency than single decision trees or linear models.',
  },
  {
    id: 'adaboost',
    name: 'AdaBoost.M1',
    domain: 'classification',
    unit: 5,
    unitBadge: 'U5',
    learnPath: '/learn/unit-5/adaboost',
    labPath: '/learn/unit-5/adaboost',
    objective: 'Sequential stage-wise additive minimization of exponential classification loss',
    timeComplexityTrain: 'O(T · d · N)',
    timeComplexityPredict: 'O(T · d)',
    spaceComplexity: 'O(T)',
    interpretability: 'Medium',
    nonLinearity: 'Native',
    outlierSensitivity: 'Severe',
    sampleEfficiency: 'Requires Moderate N',
    dimCurse: 'Moderate',
    bestFor:
      'Boosting weak stumps into sharp non-linear discriminators on clean low-noise datasets.',
    fatalFlaw:
      'Severe vulnerability to noisy label outliers due to exponential penalty weight expansion.',
  },

  // Regression
  {
    id: 'linear-regr',
    name: 'Multiple Linear Regression (OLS)',
    domain: 'regression',
    unit: 3,
    unitBadge: 'U3',
    learnPath: '/learn/unit-3/multiple-linear-regression',
    labPath: '/learn/unit-3/multiple-linear-regression',
    objective: 'Minimizes Mean Squared Error via Normal Equation or Batch Gradient Descent',
    timeComplexityTrain: 'O(d³ + d² N)',
    timeComplexityPredict: 'O(d)',
    spaceComplexity: 'O(d)',
    interpretability: 'High',
    nonLinearity: 'None (Linear)',
    outlierSensitivity: 'Severe',
    sampleEfficiency: 'Works on Small N',
    dimCurse: 'Vulnerable',
    bestFor:
      'Econometric forecasting, pricing baselines, and identifying direct feature contribution weights.',
    fatalFlaw:
      'High-leverage outliers severely distort slopes; multicollinearity makes matrix inversion unstable.',
  },
  {
    id: 'ridge-lasso',
    name: 'Ridge & Lasso Regularized Regression',
    domain: 'regression',
    unit: 3,
    unitBadge: 'U3',
    learnPath: '/learn/unit-3/regularization',
    labPath: '/learn/unit-3/regularization',
    objective: 'Minimizes MSE + L2 weight shrinkage (Ridge) or L1 sparsity penalty (Lasso)',
    timeComplexityTrain: 'O(d³ + d² N)',
    timeComplexityPredict: 'O(d)',
    spaceComplexity: 'O(d)',
    interpretability: 'High',
    nonLinearity: 'None (Linear)',
    outlierSensitivity: 'Moderate',
    sampleEfficiency: 'Works on Small N',
    dimCurse: 'Robust',
    bestFor:
      'High-dimensional regression with multicollinear predictors or automatic feature selection.',
    fatalFlaw: 'Requires continuous hyperparameter tuning of lambda via cross-validation.',
  },
  {
    id: 'poly-regr',
    name: 'Polynomial Regression',
    domain: 'regression',
    unit: 3,
    unitBadge: 'U3',
    learnPath: '/learn/unit-3/polynomial-regression',
    labPath: '/learn/unit-3/polynomial-regression',
    objective: 'Fits polynomial basis expansions using linear least-squares projection',
    timeComplexityTrain: 'O(p³ + p² N)',
    timeComplexityPredict: 'O(p)',
    spaceComplexity: 'O(p)',
    interpretability: 'Medium',
    nonLinearity: 'Via Basis Expansion',
    outlierSensitivity: 'Severe',
    sampleEfficiency: 'Requires Moderate N',
    dimCurse: 'Vulnerable',
    bestFor: 'Physical systems with smooth curvilinear dynamics (kinematics, growth curves).',
    fatalFlaw:
      'Runge’s phenomenon: catastrophic oscillatory explosions at domain boundaries with high degrees.',
  },
  {
    id: 'dt-regr',
    name: 'Decision Tree Regressor (CART)',
    domain: 'regression',
    unit: 5,
    unitBadge: 'U5',
    learnPath: '/learn/unit-5/decision-tree-regression',
    labPath: '/learn/unit-5/decision-tree-regression',
    objective: 'Recursively minimizes partition variance to output piecewise constant leaf means',
    timeComplexityTrain: 'O(d · N log N)',
    timeComplexityPredict: 'O(log N)',
    spaceComplexity: 'O(Leaves)',
    interpretability: 'High',
    nonLinearity: 'Native',
    outlierSensitivity: 'Robust',
    sampleEfficiency: 'Requires Moderate N',
    dimCurse: 'Moderate',
    bestFor: 'Tabular continuous target prediction with complex non-linear feature interactions.',
    fatalFlaw:
      'Cannot extrapolate trends outside the training domain; outputs flat horizontal lines.',
  },

  // Search & Problem Solving
  {
    id: 'bfs',
    name: 'Breadth-First Search (BFS)',
    domain: 'search',
    unit: 2,
    unitBadge: 'U2',
    learnPath: '/learn/unit-2/bfs',
    labPath: '/lab/warehouse-bfs',
    objective: 'FIFO queue expansion exploring search graph layer by layer',
    timeComplexityTrain: 'N/A',
    timeComplexityPredict: 'O(b^d)',
    spaceComplexity: 'O(b^d) (Exponential)',
    interpretability: 'High',
    nonLinearity: 'Native',
    outlierSensitivity: 'Robust',
    sampleEfficiency: 'Works on Small N',
    dimCurse: 'Vulnerable',
    bestFor: 'Finding the shortest path in unweighted graphs or uniform step-cost environments.',
    fatalFlaw:
      'Exponential memory consumption: stores the entire frontier in RAM, exhausting heap on deep trees.',
  },
  {
    id: 'astar',
    name: 'A* Heuristic Search',
    domain: 'search',
    unit: 2,
    unitBadge: 'U2',
    learnPath: '/learn/unit-2/informed-search',
    labPath: '/learn/unit-2/informed-search',
    objective: 'Priority queue expansion minimizing f(n) = g(n) + h(n)',
    timeComplexityTrain: 'N/A',
    timeComplexityPredict: 'O(b^d)',
    spaceComplexity: 'O(b^d)',
    interpretability: 'High',
    nonLinearity: 'Native',
    outlierSensitivity: 'Robust',
    sampleEfficiency: 'Works on Small N',
    dimCurse: 'Moderate',
    bestFor: 'Optimal pathfinding in navigation maps and robotics using admissible heuristics.',
    fatalFlaw:
      'Like BFS, keeps all generated nodes in memory; vulnerable to local concave dead-ends with bad heuristics.',
  },
  {
    id: 'minimax',
    name: 'Minimax with Alpha-Beta Pruning',
    domain: 'search',
    unit: 2,
    unitBadge: 'U2',
    learnPath: '/learn/unit-2/adversarial-search',
    labPath: '/learn/unit-2/adversarial-search',
    objective: 'Zero-sum two-player game tree evaluation with branch-and-bound pruning',
    timeComplexityTrain: 'N/A',
    timeComplexityPredict: 'O(b^(d/2)) (Optimal ordering)',
    spaceComplexity: 'O(b · d) (Linear in depth)',
    interpretability: 'High',
    nonLinearity: 'Native',
    outlierSensitivity: 'Robust',
    sampleEfficiency: 'Works on Small N',
    dimCurse: 'Vulnerable',
    bestFor: 'Deterministic perfect-information board games like Chess, Checkers, and Connect-4.',
    fatalFlaw:
      'Horizon Effect: tactical disasters pushed just beyond search depth remain invisible.',
  },
  {
    id: 'csp',
    name: 'Constraint Satisfaction (AC-3 + MRV)',
    domain: 'search',
    unit: 2,
    unitBadge: 'U2',
    learnPath: '/learn/unit-2/csp',
    labPath: '/learn/unit-2/csp',
    objective: 'Arc consistency constraint propagation with fail-first variable ordering',
    timeComplexityTrain: 'N/A',
    timeComplexityPredict: 'O(c · d³)',
    spaceComplexity: 'O(n · d)',
    interpretability: 'High',
    nonLinearity: 'Native',
    outlierSensitivity: 'Robust',
    sampleEfficiency: 'Works on Small N',
    dimCurse: 'Moderate',
    bestFor: 'Timetabling, course scheduling, map coloring, and circuit layout verification.',
    fatalFlaw:
      'Worst-case NP-complete exponential search space if constraints are loosely coupled.',
  },
];

export function ComparePage() {
  const [activeTab, setActiveTab] = useState<'chooser' | 'matrix' | 'duel'>('chooser');
  const [domainFilter, setDomainFilter] = useState<ProblemDomain>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Chooser Wizard State
  const [wizardGoal, setWizardGoal] = useState<'classification' | 'regression' | 'search'>(
    'classification'
  );
  const [wizardSize, setWizardSize] = useState<'small' | 'moderate' | 'large'>('moderate');
  const [wizardInterpretability, setWizardInterpretability] = useState<'must_have' | 'optional'>(
    'must_have'
  );
  const [wizardNonlinear, setWizardNonlinear] = useState<'linear' | 'complex'>('complex');
  const [wizardOutliers, setWizardOutliers] = useState<'noisy' | 'clean'>('clean');

  // Duel State
  const [duelAlgoA, setDuelAlgoA] = useState<string>('random-forest');
  const [duelAlgoB, setDuelAlgoB] = useState<string>('svm-rbf');

  // Filtered algorithms for Matrix Tab
  const filteredAlgorithms = useMemo(() => {
    return ALGORITHMS.filter((algo) => {
      const matchDomain = domainFilter === 'all' || algo.domain === domainFilter;
      const matchSearch =
        searchQuery === '' ||
        algo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        algo.objective.toLowerCase().includes(searchQuery.toLowerCase()) ||
        algo.bestFor.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDomain && matchSearch;
    });
  }, [domainFilter, searchQuery]);

  // Recommendation engine for Chooser Wizard
  const recommendation = useMemo(() => {
    const candidates = ALGORITHMS.filter((a) => a.domain === wizardGoal);

    // Score candidates based on requirements
    const scored = candidates.map((algo) => {
      let score = 50;

      // Interpretability
      if (wizardInterpretability === 'must_have') {
        if (algo.interpretability === 'High') score += 30;
        else if (algo.interpretability === 'Medium') score += 10;
        else score -= 25;
      }

      // Non-linearity
      if (wizardNonlinear === 'complex') {
        if (algo.nonLinearity === 'Native') score += 30;
        else if (algo.nonLinearity === 'Via Kernels') score += 20;
        else if (algo.nonLinearity === 'Via Basis Expansion') score += 10;
        else score -= 20;
      } else {
        if (algo.nonLinearity === 'None (Linear)') score += 30;
      }

      // Outlier Tolerance
      if (wizardOutliers === 'noisy') {
        if (algo.outlierSensitivity === 'Robust') score += 25;
        else if (algo.outlierSensitivity === 'Severe') score -= 35;
      }

      // Sample size
      if (wizardSize === 'small') {
        if (algo.sampleEfficiency === 'Works on Small N') score += 25;
      } else if (wizardSize === 'large') {
        if (algo.id === 'svm-rbf' || algo.id === 'knn') score -= 35; // O(N^2) or O(N) query
        if (algo.id === 'random-forest' || algo.id === 'logistic') score += 20;
      }

      return { algo, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored[0]?.algo || candidates[0]!;
  }, [wizardGoal, wizardSize, wizardInterpretability, wizardNonlinear, wizardOutliers]);

  const algoA = ALGORITHMS.find((a) => a.id === duelAlgoA) || ALGORITHMS[0]!;
  const algoB = ALGORITHMS.find((a) => a.id === duelAlgoB) || ALGORITHMS[1]!;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:px-12 space-y-10">
      {/* 1. Header Banner */}
      <div className="border-b border-orange-50/15 pb-6">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant="unit">Algorithm Chooser</Badge>
          <Badge variant="outline">Cross-Unit Benchmark</Badge>
          <Badge variant="outline">Course Code: 2304322T</Badge>
          <Badge variant="outline">MIT Academy of Engineering</Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-foreground font-manrope">
          Which algorithm should I use?
        </h1>
        <p className="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-300 font-montserrat leading-relaxed max-w-3xl">
          An interactive decision helper and comparative engineering workbench evaluating{' '}
          <span className="font-montserrat font-medium text-yellow-800 dark:text-orange-100">
            computational complexity, interpretability, and failure modes
          </span>{' '}
          across all units of the curriculum.
        </p>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 pt-6">
          {[
            { id: 'chooser', label: '1. Interactive Chooser Wizard', icon: Sparkles },
            { id: 'duel', label: '2. Head-to-Head Algorithm Duel', icon: GitCompare },
            { id: 'matrix', label: '3. Master Comparison Matrix', icon: Scale },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'chooser' | 'matrix' | 'duel')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-manrope font-semibold transition-all border ${
                  activeTab === tab.id
                    ? 'border-brand bg-brand text-white shadow-none'
                    : 'border-orange-50/10 bg-black/20 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Icon className="size-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: INTERACTIVE CHOOSER WIZARD */}
      {activeTab === 'chooser' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 7 Cols: Question Criteria Inputs */}
            <div className="lg:col-span-7 space-y-6">
              <Card className="p-6 border-orange-50/15 bg-neutral-900/50 space-y-5">
                <div className="flex items-center gap-2 border-b border-orange-50/10 pb-3">
                  <Sliders className="size-4 text-brand" />
                  <h3 className="font-manrope font-semibold text-base text-foreground">
                    Define Your Project Requirements
                  </h3>
                </div>

                {/* 1. Problem Domain */}
                <div className="space-y-2">
                  <label className="text-xs font-mono font-semibold uppercase text-neutral-300">
                    1. What task are you solving?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(
                      [
                        { id: 'classification', label: 'Classification', desc: 'Discrete labels' },
                        { id: 'regression', label: 'Regression', desc: 'Continuous scalar' },
                        { id: 'search', label: 'Search & Planning', desc: 'Pathfinding & games' },
                      ] as const
                    ).map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setWizardGoal(opt.id)}
                        className={`p-3 rounded-lg text-left border text-xs transition-all ${
                          wizardGoal === opt.id
                            ? 'border-brand bg-brand/10 text-white font-medium'
                            : 'border-orange-50/10 bg-black/20 text-neutral-400 hover:text-neutral-200'
                        }`}
                      >
                        <div className="font-semibold">{opt.label}</div>
                        <div className="text-[10px] text-neutral-500 font-sans">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Dataset Scale */}
                <div className="space-y-2">
                  <label className="text-xs font-mono font-semibold uppercase text-neutral-300">
                    2. Dataset Scale (Sample Size N)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(
                      [
                        { id: 'small', label: 'Small', desc: 'N < 500 samples' },
                        { id: 'moderate', label: 'Moderate', desc: '500 ≤ N ≤ 20,000' },
                        { id: 'large', label: 'Massive', desc: 'N > 20,000 samples' },
                      ] as const
                    ).map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setWizardSize(opt.id)}
                        className={`p-2.5 rounded-lg text-left border text-xs transition-all ${
                          wizardSize === opt.id
                            ? 'border-brand bg-brand/10 text-white font-medium'
                            : 'border-orange-50/10 bg-black/20 text-neutral-400 hover:text-neutral-200'
                        }`}
                      >
                        <div className="font-semibold">{opt.label}</div>
                        <div className="text-[10px] text-neutral-500 font-sans">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Interpretability Priority */}
                <div className="space-y-2">
                  <label className="text-xs font-mono font-semibold uppercase text-neutral-300">
                    3. Model Interpretability &amp; Auditability
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        {
                          id: 'must_have',
                          label: 'Strict White-Box Required',
                          desc: 'Must explain decisions to doctors or auditors',
                        },
                        {
                          id: 'optional',
                          label: 'Maximum Accuracy Priority',
                          desc: 'Black-box ensembles are acceptable',
                        },
                      ] as const
                    ).map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setWizardInterpretability(opt.id)}
                        className={`p-2.5 rounded-lg text-left border text-xs transition-all ${
                          wizardInterpretability === opt.id
                            ? 'border-brand bg-brand/10 text-white font-medium'
                            : 'border-orange-50/10 bg-black/20 text-neutral-400 hover:text-neutral-200'
                        }`}
                      >
                        <div className="font-semibold">{opt.label}</div>
                        <div className="text-[10px] text-neutral-500 font-sans">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Non-linearity & Outliers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-semibold uppercase text-neutral-300">
                      4. Geometric Separability
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => setWizardNonlinear('complex')}
                        className={`p-2 rounded-lg text-center border text-xs ${
                          wizardNonlinear === 'complex'
                            ? 'border-brand bg-brand/10 text-white font-semibold'
                            : 'border-orange-50/10 bg-black/20 text-neutral-400'
                        }`}
                      >
                        Complex / Curvilinear
                      </button>
                      <button
                        onClick={() => setWizardNonlinear('linear')}
                        className={`p-2 rounded-lg text-center border text-xs ${
                          wizardNonlinear === 'linear'
                            ? 'border-brand bg-brand/10 text-white font-semibold'
                            : 'border-orange-50/10 bg-black/20 text-neutral-400'
                        }`}
                      >
                        Strictly Linear
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-semibold uppercase text-neutral-300">
                      5. Noise &amp; Outliers
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => setWizardOutliers('noisy')}
                        className={`p-2 rounded-lg text-center border text-xs ${
                          wizardOutliers === 'noisy'
                            ? 'border-brand bg-brand/10 text-white font-semibold'
                            : 'border-orange-50/10 bg-black/20 text-neutral-400'
                        }`}
                      >
                        Noisy / Sensor Glitches
                      </button>
                      <button
                        onClick={() => setWizardOutliers('clean')}
                        className={`p-2 rounded-lg text-center border text-xs ${
                          wizardOutliers === 'clean'
                            ? 'border-brand bg-brand/10 text-white font-semibold'
                            : 'border-orange-50/10 bg-black/20 text-neutral-400'
                        }`}
                      >
                        Clean Curated
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right 5 Cols: Recommended Algorithm Card */}
            <div className="lg:col-span-5 space-y-4">
              <Card className="p-6 border-orange-50/20 bg-neutral-900/80 sticky top-20 space-y-5">
                <div className="flex items-center justify-between border-b border-orange-50/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-brand" />
                    <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                      Recommended Best Match
                    </span>
                  </div>
                  <Badge variant="success" size="sm">
                    {recommendation.unitBadge} Module
                  </Badge>
                </div>

                <div>
                  <h3 className="font-manrope text-2xl font-bold text-foreground">
                    {recommendation.name}
                  </h3>
                  <p className="text-xs text-neutral-400 font-montserrat mt-1 leading-relaxed">
                    {recommendation.objective}
                  </p>
                </div>

                <div className="space-y-3 pt-2 text-xs font-montserrat">
                  <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 space-y-1">
                    <span className="font-semibold text-emerald-400 flex items-center gap-1.5 font-manrope">
                      <CheckCircle2 className="size-3.5" />
                      Why It Fits Your Criteria:
                    </span>
                    <p className="text-neutral-300 leading-relaxed">{recommendation.bestFor}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-red-950/20 border border-red-500/20 space-y-1">
                    <span className="font-semibold text-red-400 flex items-center gap-1.5 font-manrope">
                      <XCircle className="size-3.5" />
                      Engineering Warning / Trap:
                    </span>
                    <p className="text-neutral-300 leading-relaxed">{recommendation.fatalFlaw}</p>
                  </div>
                </div>

                {/* Specs Pill Matrix */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1">
                  <div className="p-2 rounded bg-black/40 border border-orange-50/10">
                    <span className="text-neutral-500 block text-[10px]">Training Time:</span>
                    <span className="text-cream font-bold">
                      {recommendation.timeComplexityTrain}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-black/40 border border-orange-50/10">
                    <span className="text-neutral-500 block text-[10px]">Prediction Time:</span>
                    <span className="text-cream font-bold">
                      {recommendation.timeComplexityPredict}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-black/40 border border-orange-50/10">
                    <span className="text-neutral-500 block text-[10px]">Interpretability:</span>
                    <span className="text-neutral-200 font-bold">
                      {recommendation.interpretability}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-black/40 border border-orange-50/10">
                    <span className="text-neutral-500 block text-[10px]">Outlier Sensitivity:</span>
                    <span className="text-neutral-200 font-bold">
                      {recommendation.outlierSensitivity}
                    </span>
                  </div>
                </div>

                {/* Direct Launch Actions */}
                <div className="flex items-center gap-3 pt-2 border-t border-orange-50/10">
                  <Link to={recommendation.learnPath} className="flex-1">
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full text-xs flex items-center justify-center gap-1"
                    >
                      <span>Study Full Concept</span>
                      <ArrowRight className="size-3.5" />
                    </Button>
                  </Link>
                  <Link to={recommendation.labPath} className="flex-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs flex items-center justify-center gap-1"
                    >
                      <span>Launch Lab</span>
                      <ExternalLink className="size-3.5" />
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HEAD-TO-HEAD ALGORITHM DUEL */}
      {activeTab === 'duel' && (
        <div className="space-y-6">
          {/* Algorithm Pickers */}
          <Card className="p-6 border-orange-50/15 bg-neutral-900/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-2">
                <label className="text-xs font-mono font-semibold uppercase text-amber-400">
                  Select Contender A:
                </label>
                <select
                  value={duelAlgoA}
                  onChange={(e) => setDuelAlgoA(e.target.value)}
                  className="w-full bg-neutral-950 border border-orange-50/20 text-neutral-100 rounded-lg px-3 py-2 text-xs font-montserrat focus:outline-none focus:border-brand"
                >
                  {ALGORITHMS.map((algo) => (
                    <option key={algo.id} value={algo.id}>
                      [{algo.unitBadge}] {algo.name} ({algo.domain})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono font-semibold uppercase text-blue-400">
                  Select Contender B:
                </label>
                <select
                  value={duelAlgoB}
                  onChange={(e) => setDuelAlgoB(e.target.value)}
                  className="w-full bg-neutral-950 border border-orange-50/20 text-neutral-100 rounded-lg px-3 py-2 text-xs font-montserrat focus:outline-none focus:border-brand"
                >
                  {ALGORITHMS.map((algo) => (
                    <option key={algo.id} value={algo.id}>
                      [{algo.unitBadge}] {algo.name} ({algo.domain})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* Duel Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contender A Card */}
            <Card className="p-6 border-amber-500/30 bg-neutral-900/60 space-y-4">
              <div className="flex items-center justify-between border-b border-orange-50/10 pb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="warning">{algoA.unitBadge}</Badge>
                  <h3 className="font-manrope text-xl font-bold text-foreground">{algoA.name}</h3>
                </div>
                <Link to={algoA.learnPath}>
                  <Button variant="ghost" size="sm" className="text-xs p-1">
                    <ExternalLink className="size-3.5" />
                  </Button>
                </Link>
              </div>

              <div className="space-y-3 text-xs font-montserrat">
                <div>
                  <span className="text-neutral-500 font-mono uppercase text-[10px]">
                    Objective:
                  </span>
                  <p className="text-neutral-200 mt-0.5">{algoA.objective}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 font-mono text-[11px] pt-1">
                  <div className="p-2 rounded bg-black/40 border border-orange-50/10">
                    <span className="text-neutral-500 text-[10px] block">Train Time:</span>
                    <span className="text-cream">{algoA.timeComplexityTrain}</span>
                  </div>
                  <div className="p-2 rounded bg-black/40 border border-orange-50/10">
                    <span className="text-neutral-500 text-[10px] block">Query Time:</span>
                    <span className="text-cream">{algoA.timeComplexityPredict}</span>
                  </div>
                  <div className="p-2 rounded bg-black/40 border border-orange-50/10">
                    <span className="text-neutral-500 text-[10px] block">Interpretability:</span>
                    <span className="text-neutral-200">{algoA.interpretability}</span>
                  </div>
                  <div className="p-2 rounded bg-black/40 border border-orange-50/10">
                    <span className="text-neutral-500 text-[10px] block">Non-Linearity:</span>
                    <span className="text-neutral-200">{algoA.nonLinearity}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20">
                  <span className="font-semibold text-emerald-400 font-manrope">
                    Primary Advantage:
                  </span>
                  <p className="text-neutral-300 text-xs mt-1 leading-relaxed">{algoA.bestFor}</p>
                </div>

                <div className="p-3 rounded-lg bg-red-950/20 border border-red-500/20">
                  <span className="font-semibold text-red-400 font-manrope">
                    Critical Vulnerability:
                  </span>
                  <p className="text-neutral-300 text-xs mt-1 leading-relaxed">{algoA.fatalFlaw}</p>
                </div>
              </div>
            </Card>

            {/* Contender B Card */}
            <Card className="p-6 border-blue-500/30 bg-neutral-900/60 space-y-4">
              <div className="flex items-center justify-between border-b border-orange-50/10 pb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{algoB.unitBadge}</Badge>
                  <h3 className="font-manrope text-xl font-bold text-foreground">{algoB.name}</h3>
                </div>
                <Link to={algoB.learnPath}>
                  <Button variant="ghost" size="sm" className="text-xs p-1">
                    <ExternalLink className="size-3.5" />
                  </Button>
                </Link>
              </div>

              <div className="space-y-3 text-xs font-montserrat">
                <div>
                  <span className="text-neutral-500 font-mono uppercase text-[10px]">
                    Objective:
                  </span>
                  <p className="text-neutral-200 mt-0.5">{algoB.objective}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 font-mono text-[11px] pt-1">
                  <div className="p-2 rounded bg-black/40 border border-orange-50/10">
                    <span className="text-neutral-500 text-[10px] block">Train Time:</span>
                    <span className="text-cream">{algoB.timeComplexityTrain}</span>
                  </div>
                  <div className="p-2 rounded bg-black/40 border border-orange-50/10">
                    <span className="text-neutral-500 text-[10px] block">Query Time:</span>
                    <span className="text-cream">{algoB.timeComplexityPredict}</span>
                  </div>
                  <div className="p-2 rounded bg-black/40 border border-orange-50/10">
                    <span className="text-neutral-500 text-[10px] block">Interpretability:</span>
                    <span className="text-neutral-200">{algoB.interpretability}</span>
                  </div>
                  <div className="p-2 rounded bg-black/40 border border-orange-50/10">
                    <span className="text-neutral-500 text-[10px] block">Non-Linearity:</span>
                    <span className="text-neutral-200">{algoB.nonLinearity}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20">
                  <span className="font-semibold text-emerald-400 font-manrope">
                    Primary Advantage:
                  </span>
                  <p className="text-neutral-300 text-xs mt-1 leading-relaxed">{algoB.bestFor}</p>
                </div>

                <div className="p-3 rounded-lg bg-red-950/20 border border-red-500/20">
                  <span className="font-semibold text-red-400 font-manrope">
                    Critical Vulnerability:
                  </span>
                  <p className="text-neutral-300 text-xs mt-1 leading-relaxed">{algoB.fatalFlaw}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 3: MASTER COMPARISON MATRIX */}
      {activeTab === 'matrix' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-orange-50/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400 font-mono uppercase">Domain Filter:</span>
              {[
                { id: 'all', label: 'All Models' },
                { id: 'classification', label: 'Classification' },
                { id: 'regression', label: 'Regression' },
                { id: 'search', label: 'Search & Planning' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setDomainFilter(f.id as ProblemDomain)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                    domainFilter === f.id
                      ? 'border-brand bg-brand text-white font-bold'
                      : 'border-orange-50/10 bg-black/20 text-neutral-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-neutral-500" />
              <input
                type="text"
                placeholder="Search algorithms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-900 border border-orange-50/15 rounded-lg pl-9 pr-3 py-1.5 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-brand"
              />
            </div>
          </div>

          {/* Matrix Table */}
          <div className="overflow-x-auto rounded-xl border border-orange-50/15 bg-neutral-900/40">
            <table className="w-full text-xs text-left border-collapse font-montserrat">
              <thead>
                <tr className="bg-neutral-950/80 text-neutral-300 font-manrope font-semibold border-b border-orange-50/15">
                  <th className="p-3">Algorithm</th>
                  <th className="p-3">Domain</th>
                  <th className="p-3">Train Complexity</th>
                  <th className="p-3">Query Complexity</th>
                  <th className="p-3">Interpretability</th>
                  <th className="p-3">Non-Linearity</th>
                  <th className="p-3">Outlier Tolerance</th>
                  <th className="p-3">Primary Best Use Case</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-50/10 text-neutral-300 font-sans">
                {filteredAlgorithms.map((algo) => (
                  <tr key={algo.id} className="hover:bg-neutral-900/60 transition-colors">
                    <td className="p-3">
                      <Link
                        to={algo.learnPath}
                        className="font-bold font-manrope text-foreground hover:text-brand flex items-center gap-1.5 transition-colors"
                      >
                        <Badge variant="outline" size="sm">
                          {algo.unitBadge}
                        </Badge>
                        <span>{algo.name}</span>
                      </Link>
                    </td>
                    <td className="p-3 font-mono text-[11px] uppercase text-neutral-400">
                      {algo.domain}
                    </td>
                    <td className="p-3 font-mono text-cream text-[11px]">
                      {algo.timeComplexityTrain}
                    </td>
                    <td className="p-3 font-mono text-cream text-[11px]">
                      {algo.timeComplexityPredict}
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          algo.interpretability === 'High'
                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                            : algo.interpretability === 'Medium'
                              ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                              : 'bg-red-950/60 text-red-300 border border-red-500/30'
                        }`}
                      >
                        {algo.interpretability}
                      </span>
                    </td>
                    <td className="p-3 text-[11px] text-neutral-300">{algo.nonLinearity}</td>
                    <td className="p-3">
                      <span
                        className={`text-[11px] font-semibold ${
                          algo.outlierSensitivity === 'Robust'
                            ? 'text-emerald-400'
                            : algo.outlierSensitivity === 'Moderate'
                              ? 'text-amber-400'
                              : 'text-red-400'
                        }`}
                      >
                        {algo.outlierSensitivity}
                      </span>
                    </td>
                    <td className="p-3 text-[11px] text-neutral-400 max-w-xs leading-relaxed">
                      {algo.bestFor}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
