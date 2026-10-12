import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Slider } from '@/components/ui/Slider';
import { AlertTriangle, ArrowUpRight, ShieldCheck, Zap, Layers, Flame } from 'lucide-react';

interface FailureMode {
  id: string;
  title: string;
  unit: number;
  unitBadge: string;
  category: string;
  severity: 'Critical' | 'High' | 'Medium';
  trapDesc: string;
  rootCause: string;
  remedy: string;
  conceptHref: string;
  interactiveType:
    | 'bfs-memory'
    | 'astar-heuristic'
    | 'minimax-horizon'
    | 'linear-outlier'
    | 'gd-divergence'
    | 'accuracy-paradox'
    | 'naive-zero'
    | 'knn-curse'
    | 'tree-id'
    | 'svm-islands'
    | 'adaboost-outlier'
    | 'cart-flatline';
}

const FAILURE_MODES: FailureMode[] = [
  {
    id: 'f1',
    title: 'BFS exponential memory explosion trap',
    unit: 2,
    unitBadge: 'U2',
    category: 'Uninformed Search',
    severity: 'Critical',
    trapDesc:
      'Breadth-First Search stores every node on the current search frontier in a FIFO queue. In dense state-spaces with branching factor b, memory requirements scale as O(b^d).',
    rootCause:
      'At depth d=7 with branching factor b=10, the queue must retain 10,000,000 states simultaneously, causing out-of-memory crashes on consumer devices in seconds.',
    remedy:
      'Substitute with Iterative Deepening Search (IDDFS), which achieves identical optimality and completeness guarantees while cutting memory usage to linear O(b*d).',
    conceptHref: '/learn/unit-2/uninformed-search',
    interactiveType: 'bfs-memory',
  },
  {
    id: 'f2',
    title: 'A* inadmissible heuristic suboptimality trap',
    unit: 2,
    unitBadge: 'U2',
    category: 'Informed Search',
    severity: 'High',
    trapDesc:
      'A* is guaranteed to return the minimal-cost solution only if its heuristic h(n) is admissible (never overestimates the true remaining cost to the goal).',
    rootCause:
      'When h(n) > h*(n), an unpromising detour path appears deceptively cheaper than the true shortest path on the priority queue, causing premature termination on a suboptimal path.',
    remedy:
      'Derive heuristics by relaxing problem constraints (e.g. Manhattan distance on grid mazes ignoring walls) to guarantee h(n) <= h*(n) mathematically.',
    conceptHref: '/learn/unit-2/informed-search',
    interactiveType: 'astar-heuristic',
  },
  {
    id: 'f3',
    title: 'Minimax horizon effect blunder trap',
    unit: 2,
    unitBadge: 'U2',
    category: 'Adversarial Search',
    severity: 'High',
    trapDesc:
      'Fixed-depth minimax game-tree search evaluates leaf positions at a strict depth limit d, creating an artificial search horizon.',
    rootCause:
      'A catastrophic blunder or piece loss that is mathematically unavoidable can be pushed beyond the search horizon by making useless sacrificial moves that delay the inevitable.',
    remedy:
      'Implement Quiescence Search: continue expanding tactical non-quiet positions (captures, checks, pawn promotions) past depth d until a stable evaluation is reached.',
    conceptHref: '/case-studies/chess-game-engine',
    interactiveType: 'minimax-horizon',
  },
  {
    id: 'f4',
    title: 'Linear regression high-leverage outlier trap',
    unit: 3,
    unitBadge: 'U3',
    category: 'Regression Models',
    severity: 'Critical',
    trapDesc:
      'Ordinary Least Squares (OLS) minimizes the sum of squared residuals. Squaring errors causes distant anomalous points to exert overwhelming leverage on the parameter solution.',
    rootCause:
      'A single corrupted observation far from the mean feature vector can rotate the entire fitted line, destroying predictive accuracy for 99% of normal clean data points.',
    remedy:
      'Diagnose influence via Cook distance, or switch to robust estimators such as Huber Loss, RANSAC, or L1 regularized median regression.',
    conceptHref: '/learn/unit-3/simple-linear-regression',
    interactiveType: 'linear-outlier',
  },
  {
    id: 'f5',
    title: 'Gradient descent learning rate divergence trap',
    unit: 3,
    unitBadge: 'U3',
    category: 'Optimization Dynamics',
    severity: 'Critical',
    trapDesc:
      'Gradient descent steps in proportion to the learning rate parameter alpha. If alpha exceeds the stability threshold 2 / lambda_max, the optimizer oscillates out of control.',
    rootCause:
      'Rather than descending toward the convex bowl minimum, updates catapult across opposing canyon walls with exponentially increasing loss, quickly overflowing to infinity.',
    remedy:
      'Employ learning rate decay schedules, adaptive moment algorithms (Adam/RMSProp), or perform line searches to verify reduction before accepting updates.',
    conceptHref: '/learn/unit-3/gradient-descent',
    interactiveType: 'gd-divergence',
  },
  {
    id: 'f6',
    title: 'Classification accuracy paradox trap',
    unit: 4,
    unitBadge: 'U4',
    category: 'Evaluation Metrics',
    severity: 'Critical',
    trapDesc:
      'In severely imbalanced datasets (e.g. 1% cancer incidence or 0.1% transaction fraud), raw classification accuracy is a deceptive and dangerous metric.',
    rootCause:
      'A trivial dummy model that predicts the negative class for 100% of inputs achieves 99% accuracy while having a True Positive Rate of zero, failing every patient in need.',
    remedy:
      'Track Precision, Recall, F1 score, PR-AUC, and balanced accuracy. Use class-weighted loss functions or cost-sensitive threshold adjustments.',
    conceptHref: '/learn/unit-4/classification-metrics',
    interactiveType: 'accuracy-paradox',
  },
  {
    id: 'f7',
    title: 'Naive Bayes zero-frequency collapse trap',
    unit: 4,
    unitBadge: 'U4',
    category: 'Probabilistic ML',
    severity: 'High',
    trapDesc:
      'Naive Bayes multiplies conditional feature likelihoods together across all vocabulary tokens. If a token has zero training occurrences in a class, its probability is 0.',
    rootCause:
      'Multiplying by zero collapses the entire joint posterior probability P(C|X) to zero regardless of how overwhelming all other positive feature evidence may be.',
    remedy:
      'Apply Laplace (additive) smoothing by adding alpha > 0 to the numerator count and alpha * |V| to the denominator, ensuring strictly non-zero probabilities.',
    conceptHref: '/learn/unit-4/laplace-smoothing',
    interactiveType: 'naive-zero',
  },
  {
    id: 'f8',
    title: 'k-NN curse of dimensionality distance collapse trap',
    unit: 4,
    unitBadge: 'U4',
    category: 'Instance-Based ML',
    severity: 'High',
    trapDesc:
      'In high-dimensional feature spaces (d > 50), the volume of the enclosing hyperspace expands exponentially relative to sample points.',
    rootCause:
      'The difference between the distance to the nearest neighbor and the distance to the farthest neighbor approaches zero, making Euclidean proximity meaningless.',
    remedy:
      'Apply dimensionality reduction (PCA or t-SNE) and rigorous feature selection before applying distance-based algorithms.',
    conceptHref: '/learn/unit-4/knn',
    interactiveType: 'knn-curse',
  },
  {
    id: 'f9',
    title: 'Decision tree unique-ID memorization trap',
    unit: 5,
    unitBadge: 'U5',
    category: 'Decision Trees',
    severity: 'Critical',
    trapDesc:
      'When splitting using raw Information Gain, features with high cardinality and unique values (such as Student ID or Transaction Number) score maximal gain.',
    rootCause:
      'The algorithm isolates every training row into its own pure single-sample leaf, achieving 100% training accuracy while scoring 0% test accuracy on unseen IDs.',
    remedy:
      'Use C4.5 Gain Ratio normalization which penalizes broad split cardinality, prune aggressively, and remove unique identifiers during preprocessing.',
    conceptHref: '/learn/unit-5/impurity-split-criteria',
    interactiveType: 'tree-id',
  },
  {
    id: 'f10',
    title: 'SVM RBF extreme gamma island overfitting trap',
    unit: 5,
    unitBadge: 'U5',
    category: 'Support Vector Machines',
    severity: 'High',
    trapDesc:
      'In Gaussian RBF kernels, parameter gamma defines the curvature radius exp(-gamma * ||x-z||^2) around individual support vectors.',
    rootCause:
      'Setting gamma too high (e.g. gamma = 100) contracts the influence radius into microscopic islands around training points, creating zero generalization corridors between them.',
    remedy:
      'Tune gamma across logarithmic grid scales (0.001 to 10) in conjunction with soft-margin slack penalty C using cross-validation.',
    conceptHref: '/learn/unit-5/svm-kernels',
    interactiveType: 'svm-islands',
  },
  {
    id: 'f11',
    title: 'AdaBoost mislabeled outlier explosion trap',
    unit: 5,
    unitBadge: 'U5',
    category: 'Ensemble Learning',
    severity: 'High',
    trapDesc:
      'AdaBoost increases sample distribution weights exponentially for instances misclassified by earlier weak stumps: w_{t+1} = w_t * exp(alpha_t).',
    rootCause:
      'If training data contains noise or mislabeled points, AdaBoost rapidly concentrates over 70% of its total voting weight on fitting unlearnable noise outliers.',
    remedy:
      'Use Random Forests or Gradient Boosting with Huber loss which are robust to outliers, or prune label noise before boosting.',
    conceptHref: '/learn/unit-5/adaboost',
    interactiveType: 'adaboost-outlier',
  },
  {
    id: 'f12',
    title: 'CART regression tree flat extrapolation trap',
    unit: 5,
    unitBadge: 'U5',
    category: 'Tree-Based Regression',
    severity: 'Medium',
    trapDesc:
      'Decision tree regressors predict a piecewise constant output corresponding to the average target value of training samples falling into each leaf partition.',
    rootCause:
      'When asked to predict on feature values exceeding the training envelope, the tree can never extrapolate the upward trend, producing a flat horizontal ceiling.',
    remedy:
      'Use linear models, polynomial regressors, or hybrid tree algorithms (like XGBoost with gblinear or model trees like M5) for extrapolation tasks.',
    conceptHref: '/learn/unit-5/decision-tree-regression',
    interactiveType: 'cart-flatline',
  },
];

export function FailureGalleryPage() {
  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

  // Interactive Sandbox State
  const [bfsDepth, setBfsDepth] = useState<number>(5);
  const [bfsBranch, setBfsBranch] = useState<number>(6);

  const [astarFactor, setAstarFactor] = useState<number>(1.8);
  const [minimaxHorizon, setMinimaxHorizon] = useState<number>(2);

  const [outlierActive, setOutlierActive] = useState<boolean>(true);
  const [gdRate, setGdRate] = useState<number>(0.85);

  const [prevalence, setPrevalence] = useState<number>(1.0); // 1%
  const [laplaceAlpha, setLaplaceAlpha] = useState<number>(0); // 0 = broken, 1 = fixed

  const [knnDim, setKnnDim] = useState<number>(40);
  const [treeFeatureChoice, setTreeFeatureChoice] = useState<'id' | 'hours'>('id');

  const [svmGamma, setSvmGamma] = useState<number>(80);
  const [adaboostNoise, setAdaboostNoise] = useState<number>(12); // % noise
  const [cartQueryX, setCartQueryX] = useState<number>(16); // max train was 10

  // Filtered failure modes
  const filteredModes = useMemo(() => {
    return FAILURE_MODES.filter((m) => {
      if (selectedUnit !== 'all' && m.unit.toString() !== selectedUnit) return false;
      if (selectedSeverity !== 'all' && m.severity !== selectedSeverity) return false;
      return true;
    });
  }, [selectedUnit, selectedSeverity]);

  // Calculations for Sandbox Visuals
  // 1. BFS Memory
  const bfsFrontierNodes = useMemo(() => {
    return Math.pow(bfsBranch, bfsDepth);
  }, [bfsBranch, bfsDepth]);
  const bfsMemoryMb = useMemo(() => {
    // 256 bytes per state node
    return (bfsFrontierNodes * 256) / (1024 * 1024);
  }, [bfsFrontierNodes]);

  // 2. Linear Outlier
  const linearSlopeClean = 1.05;
  const linearSlopeOutlier = outlierActive ? -0.38 : 1.05;
  const linearMse = outlierActive ? 42.8 : 0.08;

  // 3. GD Divergence
  const gdStatus = useMemo(() => {
    if (gdRate <= 0.35)
      return { label: 'Converging Smoothly', loss: '0.002', color: 'text-emerald-400' };
    if (gdRate <= 0.7)
      return { label: 'Oscillating Slowly', loss: '0.140', color: 'text-amber-400' };
    if (gdRate <= 0.95)
      return { label: 'Severe Oscillation', loss: '4.850', color: 'text-orange-400' };
    return { label: 'Explosive Divergence (NaN)', loss: 'Infinity', color: 'text-red-400' };
  }, [gdRate]);

  // 4. Accuracy Paradox
  const accuracyParadoxDummy = useMemo(() => {
    const acc = 100 - prevalence;
    return {
      accuracy: acc.toFixed(1),
      recall: '0.0',
      f1: '0.000',
    };
  }, [prevalence]);

  // 5. Naive Bayes Zero
  const naiveBayesProb = useMemo(() => {
    if (laplaceAlpha === 0) return { prob: '0.000%', status: 'Zero-Frequency Trap Triggered' };
    return { prob: '78.420%', status: 'Normal Calibrated Posterior' };
  }, [laplaceAlpha]);

  // 6. KNN Curse Ratio
  const knnDistanceRatio = useMemo(() => {
    // (dmax - dmin)/dmin collapses as ~ 1/sqrt(dim)
    const ratio = Math.max(0.02, 1.2 / Math.sqrt(knnDim));
    return (ratio * 100).toFixed(1);
  }, [knnDim]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:px-12 space-y-10">
      {/* 1. Header Banner */}
      <div className="border-b border-orange-50/15 pb-6">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant="danger">Make It Fail Gallery</Badge>
          <Badge variant="outline">MIT AOE Course 2304322T</Badge>
          <Badge variant="outline">12 Core Failure Traps</Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-foreground font-manrope">
          Interactive failure laboratory
        </h1>
        <p className="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-300 font-montserrat leading-relaxed max-w-3xl">
          True mastery requires understanding how and why algorithms break. Explore, trigger, and
          dissect{' '}
          <span className="font-montserrat font-medium text-yellow-800 dark:text-orange-100">
            the 12 most famous failure modes across artificial intelligence and machine learning
          </span>{' '}
          with live interactive experiments.
        </p>
      </div>

      {/* 2. Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-orange-50/15 bg-neutral-900/40">
        {/* Unit Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-neutral-400 mr-1 flex items-center gap-1">
            <Layers className="size-3 text-brand" />
            <span>Unit:</span>
          </span>
          {['all', '2', '3', '4', '5'].map((u) => (
            <button
              key={u}
              onClick={() => setSelectedUnit(u)}
              className={`px-3 py-1 rounded-lg text-xs font-manrope font-semibold transition-all border ${
                selectedUnit === u
                  ? 'border-brand bg-brand text-white'
                  : 'border-orange-50/10 bg-black/20 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {u === 'all' ? 'All Units' : `Unit ${u}`}
            </button>
          ))}
        </div>

        {/* Severity Filters */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-neutral-400 mr-1 flex items-center gap-1">
            <Flame className="size-3 text-red-400" />
            <span>Severity:</span>
          </span>
          {['all', 'Critical', 'High', 'Medium'].map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSeverity(s)}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-all border ${
                selectedSeverity === s
                  ? 'border-neutral-200 bg-neutral-200 text-neutral-950 font-bold'
                  : 'border-orange-50/10 bg-black/20 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Failure Mode Cards */}
      <div className="space-y-8">
        {filteredModes.map((mode, idx) => {
          return (
            <Card
              key={mode.id}
              className="p-6 border-orange-50/15 bg-neutral-900/40 rounded-xl space-y-6 hover:border-orange-50/30 transition-all backdrop-blur-sm"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-orange-50/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0 font-mono font-bold text-xs">
                    0{idx + 1}
                  </div>
                  <div>
                    <h2 className="font-manrope text-lg font-bold text-foreground">{mode.title}</h2>
                    <div className="flex items-center gap-2 mt-0.5 text-xs font-mono text-neutral-400">
                      <span>{mode.unitBadge}</span>
                      <span>•</span>
                      <span>{mode.category}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <Badge
                    variant={
                      mode.severity === 'Critical'
                        ? 'danger'
                        : mode.severity === 'High'
                          ? 'warning'
                          : 'outline'
                    }
                    size="sm"
                  >
                    {mode.severity} Severity
                  </Badge>
                  <Link to={mode.conceptHref}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-brand hover:text-brand flex items-center gap-1 py-1 px-2.5"
                    >
                      <span>Study lab</span>
                      <ArrowUpRight className="size-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Trap & Diagnosis Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-lg bg-red-950/20 border border-red-500/20 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-red-400 font-mono font-semibold uppercase tracking-wider text-[10px]">
                    <AlertTriangle className="size-3" />
                    <span>The Failure Trap</span>
                  </div>
                  <p className="text-neutral-300 font-montserrat leading-relaxed">
                    {mode.trapDesc}
                  </p>
                  <p className="text-red-300/80 font-mono text-[11px] pt-1 border-t border-red-500/10">
                    Root cause: {mode.rootCause}
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-semibold uppercase tracking-wider text-[10px]">
                    <ShieldCheck className="size-3" />
                    <span>The Remedy &amp; Mitigation</span>
                  </div>
                  <p className="text-neutral-300 font-montserrat leading-relaxed">{mode.remedy}</p>
                </div>
              </div>

              {/* Interactive Failure Experiment Sandbox */}
              <div className="p-4 rounded-xl border border-orange-50/15 bg-neutral-950/70 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                    <Zap className="size-3.5 text-yellow-800 dark:text-orange-100" />
                    <span>Interactive Failure Sandbox</span>
                  </span>
                  <span className="text-[11px] font-mono text-neutral-500">
                    Adjust parameters to trigger failure
                  </span>
                </div>

                {/* 1. BFS Memory Simulation */}
                {mode.interactiveType === 'bfs-memory' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Slider
                          label="Branching Factor (b)"
                          min={2}
                          max={10}
                          step={1}
                          value={bfsBranch}
                          onChange={(v) => setBfsBranch(v)}
                        />
                      </div>
                      <div>
                        <Slider
                          label="Search Depth (d)"
                          min={1}
                          max={8}
                          step={1}
                          value={bfsDepth}
                          onChange={(v) => setBfsDepth(v)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 rounded-lg bg-black/40 border border-orange-50/10 font-mono text-xs">
                      <div>
                        <div className="text-[10px] text-neutral-500">Queue Leaf Nodes:</div>
                        <div className="text-foreground font-bold text-sm">
                          {bfsFrontierNodes.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-neutral-500">Estimated RAM:</div>
                        <div
                          className={`font-bold text-sm ${
                            bfsMemoryMb > 1024
                              ? 'text-red-400 animate-pulse'
                              : bfsMemoryMb > 100
                                ? 'text-amber-400'
                                : 'text-emerald-400'
                          }`}
                        >
                          {bfsMemoryMb >= 1024
                            ? `${(bfsMemoryMb / 1024).toFixed(2)} GB`
                            : `${bfsMemoryMb.toFixed(1)} MB`}
                        </div>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <div className="text-[10px] text-neutral-500">IDDFS Alternative:</div>
                        <div className="text-emerald-400 font-bold text-sm">
                          {((bfsBranch * bfsDepth * 256) / 1024).toFixed(1)} KB (Linear)
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Linear Outlier Simulation */}
                {mode.interactiveType === 'linear-outlier' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-neutral-300">
                        High-Leverage Outlier Point (x=15, y=-50):
                      </span>
                      <button
                        onClick={() => setOutlierActive(!outlierActive)}
                        className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                          outlierActive
                            ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        }`}
                      >
                        {outlierActive ? 'Outlier Injected' : 'Clean Data'}
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-black/40 border border-orange-50/10 font-mono text-xs">
                      <div>
                        <div className="text-[10px] text-neutral-500">Fitted Slope (w1):</div>
                        <div
                          className={`font-bold text-sm ${
                            outlierActive ? 'text-red-400' : 'text-emerald-400'
                          }`}
                        >
                          {linearSlopeOutlier.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-neutral-500">True Clean Slope:</div>
                        <div className="text-neutral-300 font-bold text-sm">
                          {linearSlopeClean.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-neutral-500">Mean Squared Error:</div>
                        <div
                          className={`font-bold text-sm ${
                            outlierActive ? 'text-red-400' : 'text-emerald-400'
                          }`}
                        >
                          {linearMse}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. GD Divergence Simulation */}
                {mode.interactiveType === 'gd-divergence' && (
                  <div className="space-y-3">
                    <div>
                      <Slider
                        label="Learning Rate (alpha)"
                        min={0.05}
                        max={1.15}
                        step={0.05}
                        value={gdRate}
                        onChange={(v) => setGdRate(v)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-black/40 border border-orange-50/10 font-mono text-xs">
                      <div>
                        <div className="text-[10px] text-neutral-500">Optimization Behavior:</div>
                        <div className={`font-bold text-sm ${gdStatus.color}`}>
                          {gdStatus.label}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-neutral-500">
                          Loss After 20 Iterations:
                        </div>
                        <div className={`font-bold text-sm ${gdStatus.color}`}>{gdStatus.loss}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Accuracy Paradox Simulation */}
                {mode.interactiveType === 'accuracy-paradox' && (
                  <div className="space-y-3">
                    <div>
                      <Slider
                        label="Positive Prevalence (Rare Disease / Fraud %)"
                        min={0.2}
                        max={10.0}
                        step={0.2}
                        value={prevalence}
                        onChange={(v) => setPrevalence(v)}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-black/40 border border-orange-50/10 font-mono text-xs">
                      <div>
                        <div className="text-[10px] text-neutral-500">Dumb Majority Accuracy:</div>
                        <div className="text-amber-400 font-bold text-sm">
                          {accuracyParadoxDummy.accuracy}%
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-neutral-500">True Positive Recall:</div>
                        <div className="text-red-400 font-bold text-sm">0.0% (Zero Detected)</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-neutral-500">True F1 Score:</div>
                        <div className="text-red-400 font-bold text-sm">0.000</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. Naive Bayes Zero Simulation */}
                {mode.interactiveType === 'naive-zero' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-neutral-300">
                        Laplace Smoothing Parameter (alpha):
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setLaplaceAlpha(0)}
                          className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                            laplaceAlpha === 0
                              ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                              : 'bg-black/20 text-neutral-400'
                          }`}
                        >
                          alpha = 0 (Unsmoothed Trap)
                        </button>
                        <button
                          onClick={() => setLaplaceAlpha(1)}
                          className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                            laplaceAlpha === 1
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-black/20 text-neutral-400'
                          }`}
                        >
                          alpha = 1 (Laplace Remedy)
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-black/40 border border-orange-50/10 font-mono text-xs">
                      <div>
                        <div className="text-[10px] text-neutral-500">Posterior Probability:</div>
                        <div
                          className={`font-bold text-sm ${
                            laplaceAlpha === 0 ? 'text-red-400' : 'text-emerald-400'
                          }`}
                        >
                          {naiveBayesProb.prob}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-neutral-500">Classifier State:</div>
                        <div
                          className={`font-bold text-xs ${
                            laplaceAlpha === 0 ? 'text-red-400' : 'text-emerald-400'
                          }`}
                        >
                          {naiveBayesProb.status}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. k-NN Curse Simulation */}
                {mode.interactiveType === 'knn-curse' && (
                  <div className="space-y-3">
                    <div>
                      <Slider
                        label="Feature Dimension Count (d)"
                        min={2}
                        max={100}
                        step={2}
                        value={knnDim}
                        onChange={(v) => setKnnDim(v)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-black/40 border border-orange-50/10 font-mono text-xs">
                      <div>
                        <div className="text-[10px] text-neutral-500">
                          Relative Distance Spread (d_max - d_min) / d_min:
                        </div>
                        <div
                          className={`font-bold text-sm ${
                            knnDim > 30 ? 'text-red-400' : 'text-emerald-400'
                          }`}
                        >
                          {knnDistanceRatio}%
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-neutral-500">Neighbor Meaningfulness:</div>
                        <div
                          className={`font-bold text-xs ${
                            knnDim > 30 ? 'text-red-400' : 'text-emerald-400'
                          }`}
                        >
                          {knnDim > 30
                            ? 'Collapsed (All points nearly equidistant)'
                            : 'Discriminative Metric Space'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. Decision Tree ID Simulation */}
                {mode.interactiveType === 'tree-id' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-neutral-300">
                        Root Split Attribute:
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setTreeFeatureChoice('id')}
                          className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                            treeFeatureChoice === 'id'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                              : 'bg-black/20 text-neutral-400'
                          }`}
                        >
                          Student Roll Number (Unique ID)
                        </button>
                        <button
                          onClick={() => setTreeFeatureChoice('hours')}
                          className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                            treeFeatureChoice === 'hours'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-black/20 text-neutral-400'
                          }`}
                        >
                          Weekly Study Hours (Continuous)
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-black/40 border border-orange-50/10 font-mono text-xs">
                      <div>
                        <div className="text-[10px] text-neutral-500">Information Gain:</div>
                        <div
                          className={`font-bold text-sm ${
                            treeFeatureChoice === 'id' ? 'text-red-400' : 'text-emerald-400'
                          }`}
                        >
                          {treeFeatureChoice === 'id' ? '0.992 (Maximal)' : '0.418'}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-neutral-500">Training Accuracy:</div>
                        <div className="text-emerald-400 font-bold text-sm">
                          {treeFeatureChoice === 'id' ? '100.0%' : '86.4%'}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-neutral-500">
                          Generalization Test Accuracy:
                        </div>
                        <div
                          className={`font-bold text-sm ${
                            treeFeatureChoice === 'id' ? 'text-red-400' : 'text-emerald-400'
                          }`}
                        >
                          {treeFeatureChoice === 'id' ? '0.0% (Zero Match)' : '84.2%'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 8. SVM Gamma Simulation */}
                {mode.interactiveType === 'svm-islands' && (
                  <div className="space-y-3">
                    <div>
                      <Slider
                        label="RBF Kernel Curvature (gamma)"
                        min={1}
                        max={100}
                        step={1}
                        value={svmGamma}
                        onChange={(v) => setSvmGamma(v)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-black/40 border border-orange-50/10 font-mono text-xs">
                      <div>
                        <div className="text-[10px] text-neutral-500">
                          Decision Surface Topography:
                        </div>
                        <div
                          className={`font-bold text-xs ${
                            svmGamma > 40 ? 'text-red-400' : 'text-emerald-400'
                          }`}
                        >
                          {svmGamma > 40
                            ? 'Isolated Micro-Islands (Zero Generalization)'
                            : 'Smooth Continuous Separating Corridor'}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-neutral-500">Support Vector Count:</div>
                        <div
                          className={`font-bold text-sm ${
                            svmGamma > 40 ? 'text-red-400' : 'text-emerald-400'
                          }`}
                        >
                          {svmGamma > 40 ? '98% of Training Set' : '14% of Training Set'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 9. AdaBoost Noise Simulation */}
                {mode.interactiveType === 'adaboost-outlier' && (
                  <div className="space-y-3">
                    <div>
                      <Slider
                        label="Label Noise Injection Rate"
                        min={0}
                        max={20}
                        step={1}
                        unit="%"
                        value={adaboostNoise}
                        onChange={(v) => setAdaboostNoise(v)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-black/40 border border-orange-50/10 font-mono text-xs">
                      <div>
                        <div className="text-[10px] text-neutral-500">
                          Weight Concentrated on Outliers:
                        </div>
                        <div
                          className={`font-bold text-sm ${
                            adaboostNoise > 5 ? 'text-red-400' : 'text-emerald-400'
                          }`}
                        >
                          {(adaboostNoise * 4.8).toFixed(1)}% of Total Weight Mass
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-neutral-500">Ensemble Impact:</div>
                        <div
                          className={`font-bold text-xs ${
                            adaboostNoise > 5 ? 'text-red-400' : 'text-emerald-400'
                          }`}
                        >
                          {adaboostNoise > 5
                            ? 'Stumps Sacrificing Good Data to Fit Noise'
                            : 'Stable Boosting Convergence'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 10. CART Flatline Simulation */}
                {mode.interactiveType === 'cart-flatline' && (
                  <div className="space-y-3">
                    <div>
                      <Slider
                        label="Query Input Feature X (Training Domain is [0, 10])"
                        min={5}
                        max={25}
                        step={1}
                        value={cartQueryX}
                        onChange={(v) => setCartQueryX(v)}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-black/40 border border-orange-50/10 font-mono text-xs">
                      <div>
                        <div className="text-[10px] text-neutral-500">True Underlying Trend:</div>
                        <div className="text-neutral-300 font-bold text-sm">
                          {(cartQueryX * 2.2).toFixed(1)}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-neutral-500">
                          Linear Regression Output:
                        </div>
                        <div className="text-emerald-400 font-bold text-sm">
                          {(cartQueryX * 2.18).toFixed(1)}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-neutral-500">CART Tree Output:</div>
                        <div
                          className={`font-bold text-sm ${
                            cartQueryX > 10 ? 'text-red-400' : 'text-emerald-400'
                          }`}
                        >
                          {cartQueryX > 10
                            ? '20.0 (Flatline Plateau)'
                            : (cartQueryX * 2.0).toFixed(1)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 11. A* Heuristic Overestimation */}
                {mode.interactiveType === 'astar-heuristic' && (
                  <div className="space-y-3">
                    <div>
                      <Slider
                        label="Heuristic Multiplier k (Admissible if k <= 1.0)"
                        min={0.5}
                        max={3.0}
                        step={0.1}
                        value={astarFactor}
                        onChange={(v) => setAstarFactor(v)}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-black/40 border border-orange-50/10 font-mono text-xs">
                      <div>
                        <div className="text-[10px] text-neutral-500">True Minimal Path Cost:</div>
                        <div className="text-emerald-400 font-bold text-sm">10.0</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-neutral-500">A* Discovered Path Cost:</div>
                        <div
                          className={`font-bold text-sm ${
                            astarFactor > 1.0 ? 'text-red-400' : 'text-emerald-400'
                          }`}
                        >
                          {astarFactor > 1.0 ? '14.5 (Suboptimal)' : '10.0 (Optimal)'}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-neutral-500">Optimality Status:</div>
                        <div
                          className={`font-bold text-xs ${
                            astarFactor > 1.0 ? 'text-red-400' : 'text-emerald-400'
                          }`}
                        >
                          {astarFactor > 1.0
                            ? 'Suboptimal Goal Popped Early'
                            : 'Optimal Path Guaranteed'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 12. Minimax Horizon Blunder */}
                {mode.interactiveType === 'minimax-horizon' && (
                  <div className="space-y-3">
                    <div>
                      <Slider
                        label="Fixed Search Depth Limit (Plies)"
                        min={1}
                        max={4}
                        step={1}
                        value={minimaxHorizon}
                        onChange={(v) => setMinimaxHorizon(v)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-black/40 border border-orange-50/10 font-mono text-xs">
                      <div>
                        <div className="text-[10px] text-neutral-500">
                          Evaluated Queen Loss Threat:
                        </div>
                        <div
                          className={`font-bold text-xs ${
                            minimaxHorizon < 3 ? 'text-red-400' : 'text-emerald-400'
                          }`}
                        >
                          {minimaxHorizon < 3
                            ? 'Masked (Catastrophic Loss Past Horizon)'
                            : 'Detected (Tactical Defense Found)'}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-neutral-500">Quiescence Search Need:</div>
                        <div
                          className={`font-bold text-xs ${
                            minimaxHorizon < 3 ? 'text-red-400' : 'text-neutral-400'
                          }`}
                        >
                          {minimaxHorizon < 3
                            ? 'Urgent to prevent horizon blunder'
                            : 'Quiet position'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
