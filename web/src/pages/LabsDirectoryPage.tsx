import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { FlaskConical, Search, ArrowRight, Compass } from 'lucide-react';

interface LabItem {
  id: string;
  title: string;
  unit: number;
  unitBadge: string;
  category: 'search' | 'logic' | 'regression' | 'probabilistic' | 'decision-svm' | 'ensembles';
  tag: string;
  description: string;
  href: string;
  interactiveFeatures: string[];
}

const LABS: LabItem[] = [
  {
    id: 'warehouse-bfs',
    title: 'Warehouse Robot Pathfinding',
    unit: 2,
    unitBadge: 'U2',
    category: 'search',
    tag: 'Flagship Simulator',
    description:
      'Interactive 2D grid world where students place obstacles, define start/goal coordinates, and step through BFS FIFO queue frontier expansions in real time.',
    href: '/lab/warehouse-bfs',
    interactiveFeatures: ['2D Interactive Grid', 'Obstacle Drawing', 'Step-by-Step Playback'],
  },
  {
    id: 'vacuum-agent',
    title: 'Vacuum World Reactive Agent',
    unit: 1,
    unitBadge: 'U1',
    category: 'logic',
    tag: 'PEAS Environment',
    description:
      'Two-location dirty floor simulation demonstrating Simple Reflex lookup table rules vs stateful agent memory under stochastic dirt dirt generation.',
    href: '/learn/unit-1/intelligent-agents',
    interactiveFeatures: ['Agent Memory Toggle', 'Actuator Animations', 'Cleanliness Score'],
  },
  {
    id: 'astar-admissibility',
    title: 'A* Heuristic Admissibility Explorer',
    unit: 2,
    unitBadge: 'U2',
    category: 'search',
    tag: 'Optimal Graph Search',
    description:
      'Visualize Euclidean vs Manhattan vs Overestimating heuristics. Watch how an inadmissible heuristic breaks optimal path guarantees.',
    href: '/learn/unit-2/informed-search',
    interactiveFeatures: [
      'Heuristic Admissibility Slider',
      'Open/Closed List Inspection',
      'Node Expansion Heatmap',
    ],
  },
  {
    id: 'adversarial-minimax',
    title: 'Adversarial Minimax & Alpha-Beta Pruning',
    unit: 2,
    unitBadge: 'U2',
    category: 'search',
    tag: 'Game Tree Search',
    description:
      'Interactive game tree with editable leaf node utilities. Step through minimax backtracking and watch alpha-beta branches get pruned in green/red.',
    href: '/learn/unit-2/adversarial-search',
    interactiveFeatures: [
      'Pruned Subtree Masking',
      'Search Depth Slider',
      'Live Alpha/Beta Bounds',
    ],
  },
  {
    id: 'gradient-descent',
    title: 'Gradient Descent Dynamics Studio',
    unit: 3,
    unitBadge: 'U3',
    category: 'regression',
    tag: 'Optimization Surface',
    description:
      'Live 2D contour and 3D wireframe loss bowl. Adjust learning rate η to watch smooth convergence, sluggish crawl, or explosive numerical divergence.',
    href: '/learn/unit-3/gradient-descent',
    interactiveFeatures: [
      'Learning Rate η Slider',
      'Momentum Toggle',
      '2D Loss Contour & 3D Surface',
    ],
  },
  {
    id: 'polynomial-regression',
    title: 'Polynomial Curve Fitting & Overfitting',
    unit: 3,
    unitBadge: 'U3',
    category: 'regression',
    tag: 'Bias-Variance Studio',
    description:
      'Fit polynomials from degree 1 to 10 on noisy data. Observe underfitting (high bias), sweet spot balance, and Runge oscillations (extreme variance).',
    href: '/learn/unit-3/polynomial-regression',
    interactiveFeatures: [
      'Polynomial Degree Slider',
      'Train/Test Split Evaluator',
      'Variance Oscillations',
    ],
  },
  {
    id: 'naive-bayes-spam',
    title: 'Naive Bayes Spam Token Probability Lab',
    unit: 4,
    unitBadge: 'U4',
    category: 'probabilistic',
    tag: 'Bayesian Text Classifier',
    description:
      'Interactive email token analyzer with Laplace additive smoothing. Test unseen vocabulary tokens to avoid zero-frequency numerical collapse.',
    href: '/learn/unit-4/naive-bayes',
    interactiveFeatures: [
      'Token Log-Odds Meter',
      'Laplace α Smoothing Slider',
      'Spam Probability Bar',
    ],
  },
  {
    id: 'logistic-regression',
    title: 'Logistic Decision Boundary Studio',
    unit: 4,
    unitBadge: 'U4',
    category: 'probabilistic',
    tag: 'Classification Boundary',
    description:
      '2D scatter plot with draggable data clusters. Watch the separating hyperplane and sigmoid probability heat gradient rotate and adapt during training.',
    href: '/learn/unit-4/logistic-regression',
    interactiveFeatures: [
      'XOR Non-Linear Failure Mode',
      'Decision Threshold Slider',
      'Probability Colormap',
    ],
  },
  {
    id: 'roc-auc',
    title: 'ROC Curve & Sweeping Threshold Explorer',
    unit: 4,
    unitBadge: 'U4',
    category: 'probabilistic',
    tag: 'Model Diagnostic',
    description:
      'Dual Gaussian probability densities for Negative and Positive classes. Drag the decision threshold τ and trace the parametric ROC curve with live AUC integration.',
    href: '/learn/unit-4/roc-auc',
    interactiveFeatures: [
      "Dual Gaussian Separation (d') Slider",
      'Sweeping Decision Cutoff τ',
      'AUC Trapezoid Integration',
    ],
  },
  {
    id: 'knn-metric',
    title: 'k-NN Metric & Voronoi Region Explorer',
    unit: 4,
    unitBadge: 'U4',
    category: 'probabilistic',
    tag: 'Instance-Based Learning',
    description:
      '2D plane with draggable query point and nearest-neighbor vector connections. Compare Euclidean (L2), Manhattan (L1), and Chebyshev distance metrics.',
    href: '/learn/unit-4/knn',
    interactiveFeatures: [
      'k Neighbors Slider (1-15)',
      'Distance Metric Selector',
      'Voronoi Tessellation Overlay',
    ],
  },
  {
    id: 'decision-trees',
    title: 'Decision Tree Split Builder & Boundary',
    unit: 5,
    unitBadge: 'U5',
    category: 'decision-svm',
    tag: 'Orthogonal Partitions',
    description:
      'Drag orthogonal decision boundaries on a 2D plane and watch the hierarchical binary tree structure and terminal leaf class counts update dynamically.',
    href: '/learn/unit-5/decision-trees',
    interactiveFeatures: [
      '2D Decision Box Plot',
      'Interactive Split Thresholds',
      'Information Gain Metrics',
    ],
  },
  {
    id: 'svm-fundamentals',
    title: 'SVM Maximum Margin Hyperplane Studio',
    unit: 5,
    unitBadge: 'U5',
    category: 'decision-svm',
    tag: 'Convex Quadratic Program',
    description:
      'Interactive 2D canvas with draggable support vectors. Visualize the canonical separating hyperplane, margin gutters, and soft-margin slack penalty C.',
    href: '/learn/unit-5/svm-fundamentals',
    interactiveFeatures: ['Draggable Data Points', 'Soft-Margin C Slider', 'Support Vector Halos'],
  },
  {
    id: 'svm-kernels',
    title: 'SVM Kernel Trick 3D Parabolic Lift',
    unit: 5,
    unitBadge: 'U5',
    category: 'decision-svm',
    tag: 'Reproducing Kernel Hilbert Space',
    description:
      'Dual-view interactive visualizer demonstrating how concentric circular data inseparable in 2D becomes linearly separable when lifted to 3D parabolic space.',
    href: '/learn/unit-5/svm-kernels',
    interactiveFeatures: [
      '2D Non-Linear Contour',
      '3D Perspective Rotation',
      'Linear / Poly / RBF Kernels',
    ],
  },
  {
    id: 'ensemble-diversity',
    title: 'Condorcet Jury Theorem & Diversity Studio',
    unit: 5,
    unitBadge: 'U5',
    category: 'ensembles',
    tag: 'Ensemble Theory',
    description:
      'Simulate Condorcet majority voting across independent vs correlated voters. Watch asymptotic ensemble error collapse as independent classifiers are added.',
    href: '/learn/unit-5/ensemble-significance',
    interactiveFeatures: [
      'Individual Accuracy p Slider',
      'Ensemble Size M Slider',
      'Correlation ρ Parameter',
    ],
  },
  {
    id: 'random-forest',
    title: 'Random Forest Subspace & OOB Simulator',
    unit: 5,
    unitBadge: 'U5',
    category: 'ensembles',
    tag: 'Bagging & Subspace',
    description:
      'Explore bootstrap aggregation and random feature subspace sampling. Compare single jagged tree decision boundaries with smooth forest ensembles.',
    href: '/learn/unit-5/bagging-random-forests',
    interactiveFeatures: [
      'Forest Size M Slider',
      'Feature Subsample Ratio',
      'Live Out-of-Bag (OOB) Curve',
    ],
  },
  {
    id: 'boosting-stacking',
    title: 'AdaBoost Reweighting & Stacking Pipeline',
    unit: 5,
    unitBadge: 'U5',
    category: 'ensembles',
    tag: 'Sequential Boosting',
    description:
      'Step through sequential boosting rounds where misclassified sample points swell in weight. Compare against a two-level heterogeneous Stacking blender.',
    href: '/learn/unit-5/boosting-stacking',
    interactiveFeatures: [
      'Round-by-Round Stump Playback',
      'Dynamic Sample Weight Radii',
      'Level-1 Meta Blender',
    ],
  },
  {
    id: 'model-evaluation',
    title: 'Systematic Model Evaluation Workbench',
    unit: 5,
    unitBadge: 'U5',
    category: 'ensembles',
    tag: 'Benchmarking Suite',
    description:
      'Benchmarking studio comparing Single Trees, Random Forests, AdaBoost, and SVM across accuracy, F1, calibration Brier scores, and cross-validation folds.',
    href: '/learn/unit-5/performance-evaluation',
    interactiveFeatures: [
      'Multi-Model Comparison Table',
      'ROC vs PR Curve Toggle',
      'K-Fold Boxplot Distribution',
    ],
  },
  {
    id: 'pima-diabetes',
    title: 'Pima Indians Diabetes Clinical Diagnostic Pipeline',
    unit: 5,
    unitBadge: 'U5',
    category: 'ensembles',
    tag: 'Clinical Tabular Lab',
    description:
      'Impute biologically impossible zeroes with class-aware medians, train Random Forests vs SVM, and tune cost-sensitive screening thresholds to minimize patient risk.',
    href: '/case-studies/diabetes-prediction',
    interactiveFeatures: [
      'Missing Value Imputation Strategy',
      'Clinical Screening Cutoff tau',
      'Biomarker Scatter Visualizer',
    ],
  },
  {
    id: 'adaboost-mechanics',
    title: 'AdaBoost Sequential Reweighting Engine',
    unit: 5,
    unitBadge: 'U5',
    category: 'ensembles',
    tag: 'Freund & Schapire Algorithm',
    description:
      'Scrub through sequential boosting iterations, watch misclassified point weights swell exponentially, and explore the alpha voting curve across error rates.',
    href: '/learn/unit-5/adaboost',
    interactiveFeatures: [
      'Sequential Round Scrubber',
      'Point Weight Bubble Radii',
      'Interactive Alpha Curve',
    ],
  },
  {
    id: 'dt-regression',
    title: 'CART Continuous Regression Tree Studio',
    unit: 5,
    unitBadge: 'U5',
    category: 'decision-svm',
    tag: 'Variance Reduction',
    description:
      'Explore recursive variance reduction creating piecewise constant step functions, and observe the severe flat extrapolation trap on queries outside training range.',
    href: '/learn/unit-5/decision-tree-regression',
    interactiveFeatures: [
      'Staircase Step Approximator',
      'Max Depth 1-6 Slider',
      'Extrapolation Flat Trap Demo',
    ],
  },
];

type CategoryFilter =
  'all' | 'search' | 'logic' | 'regression' | 'probabilistic' | 'decision-svm' | 'ensembles';

export function LabsDirectoryPage() {
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLabs = LABS.filter((lab) => {
    const matchesCategory = filter === 'all' || lab.category === filter;
    const matchesQuery =
      searchQuery.trim() === '' ||
      lab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:px-12 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-orange-50/15 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-2">
            <Link to="/" className="hover:text-brand transition-colors">
              AIML Studio
            </Link>
            <span>/</span>
            <span className="text-foreground dark:text-neutral-200">Interactive Laboratories</span>
          </div>
          <h1 className="font-manrope text-3xl font-semibold tracking-tight text-foreground sm:text-4xl flex items-center gap-3">
            <FlaskConical className="size-8 text-brand" />
            <span>Interactive lab sandbox directory</span>
          </h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl font-montserrat">
            Hands-on zero-cost simulations across all 5 curriculum units. Experiment with
            parameters, break assumptions, and inspect mathematical state machines in real time with{' '}
            <span className="font-montserrat font-medium text-yellow-800 dark:text-orange-100">
              zero installation required
            </span>
            .
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/lab/warehouse-bfs">
            <Button size="sm" variant="outline" className="flex items-center gap-2 text-xs">
              <Compass className="size-3.5 text-brand" />
              <span>Flagship BFS Lab</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 font-sans">
          {[
            { id: 'all', label: 'All Labs', count: LABS.length },
            {
              id: 'search',
              label: 'Search & Agents',
              count: LABS.filter((l) => l.category === 'search' || l.category === 'logic').length,
            },
            {
              id: 'regression',
              label: 'Regression',
              count: LABS.filter((l) => l.category === 'regression').length,
            },
            {
              id: 'probabilistic',
              label: 'Bayes & Logistic',
              count: LABS.filter((l) => l.category === 'probabilistic').length,
            },
            {
              id: 'decision-svm',
              label: 'Trees & SVM',
              count: LABS.filter((l) => l.category === 'decision-svm').length,
            },
            {
              id: 'ensembles',
              label: 'Ensembles & Eval',
              count: LABS.filter((l) => l.category === 'ensembles').length,
            },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id as CategoryFilter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === cat.id
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-black font-semibold'
                  : 'bg-neutral-800/40 text-neutral-400 hover:text-foreground hover:bg-neutral-800/80 border border-orange-50/10'
              }`}
            >
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search labs, algorithms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-900/50 border border-orange-50/15 rounded-lg pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-neutral-500 focus:outline-none focus:border-brand transition-colors"
          />
        </div>
      </div>

      {/* Labs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredLabs.map((lab) => (
          <Card
            key={lab.id}
            className="p-5 border border-orange-50/15 bg-neutral-900/40 backdrop-blur-sm flex flex-col justify-between hover:border-orange-50/30 transition-colors group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded border border-orange-50/20 bg-black/40 text-[10px] font-mono font-bold text-orange-200">
                    {lab.unitBadge}
                  </span>
                  <Badge variant="outline" size="sm" className="text-[10px]">
                    {lab.tag}
                  </Badge>
                </div>
              </div>

              <h2 className="font-manrope text-base font-semibold text-foreground dark:text-white group-hover:text-brand transition-colors">
                {lab.title}
              </h2>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed font-montserrat">
                {lab.description}
              </p>

              {/* Feature Chips */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {lab.interactiveFeatures.map((feat, idx) => (
                  <span
                    key={idx}
                    className="inline-block text-[10px] font-mono bg-black/30 border border-orange-50/10 rounded px-2 py-0.5 text-neutral-300"
                  >
                    {feat}
                  </span>
                ))}
              </div>
            </div>

            {/* Launch CTA */}
            <div className="pt-4 mt-4 border-t border-orange-50/10 flex items-center justify-between">
              <span className="text-[11px] font-mono text-neutral-500">
                Unit {lab.unit} Interactive
              </span>
              <Link to={lab.href}>
                <Button
                  size="sm"
                  variant="primary"
                  className="text-xs flex items-center gap-1.5 px-3 py-1.5"
                >
                  <span>Launch Lab</span>
                  <ArrowRight className="size-3" />
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {filteredLabs.length === 0 && (
        <div className="text-center py-16 border border-dashed border-orange-50/20 rounded-xl bg-neutral-900/20">
          <p className="text-sm text-neutral-400 font-montserrat">
            No interactive labs match your query &quot;{searchQuery}&quot;.
          </p>
          <button
            onClick={() => {
              setFilter('all');
              setSearchQuery('');
            }}
            className="mt-3 text-xs text-brand hover:underline"
          >
            Reset all filters
          </button>
        </div>
      )}
    </div>
  );
}
