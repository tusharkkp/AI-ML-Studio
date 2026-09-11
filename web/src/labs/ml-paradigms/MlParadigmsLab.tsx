import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle2, XCircle, RotateCcw, Sparkles, BookOpen } from 'lucide-react';

export type ParadigmType = 'supervised' | 'unsupervised' | 'reinforcement' | 'semi-supervised';

interface Scenario {
  id: string;
  title: string;
  description: string;
  correctParadigm: ParadigmType;
  inputX: string;
  targetY: string;
  explanation: string;
  commonAlgorithms: string[];
}

const SCENARIOS: Scenario[] = [
  {
    id: 'sc-1',
    title: 'Credit Card Fraud Detection',
    description:
      'Predicting whether an incoming transaction is fraudulent or legitimate using millions of historical transactions with known verified fraud outcomes.',
    correctParadigm: 'supervised',
    inputX: 'Transaction amount, merchant category, time, geolocation, cardholder velocity',
    targetY: 'Binary label: y in {0: Legitimate, 1: Fraudulent}',
    explanation:
      'Because the historical dataset provides ground truth labels for each transaction, the model learns a decision boundary mapping features X to known discrete labels y.',
    commonAlgorithms: ['Logistic Regression', 'Random Forest', 'XGBoost'],
  },
  {
    id: 'sc-2',
    title: 'E-Commerce Customer Segmentation',
    description:
      'Grouping 500,000 retail customers into distinct purchasing personas based on browsing history, average order value, and return rates without predefined groups.',
    correctParadigm: 'unsupervised',
    inputX: 'Browsing session duration, order frequency, basket size, category preferences',
    targetY: 'None (no ground truth label exists)',
    explanation:
      'There are no pre-labeled customer tiers. The algorithm must discover geometric cluster centroids or density groupings inherent in the input distribution.',
    commonAlgorithms: ['K-Means Clustering', 'DBSCAN', 'Gaussian Mixture Models'],
  },
  {
    id: 'sc-3',
    title: 'Autonomous Drone Obstacle Avoidance',
    description:
      'A drone learns to navigate through a dense forest by taking pitch/yaw actions, receiving a +10 reward for forward progress and a -100 penalty for collisions.',
    correctParadigm: 'reinforcement',
    inputX: 'State: LiDAR point cloud, current velocity, IMU orientation',
    targetY: 'Scalar reward signal r_t after executing action a_t',
    explanation:
      'No human teacher labels the optimal steering angle at every millisecond. Instead, an agent interacts with a dynamic environment via trial and error to maximize cumulative return.',
    commonAlgorithms: ['Deep Q-Networks (DQN)', 'PPO', 'SAC'],
  },
  {
    id: 'sc-4',
    title: 'Medical Image Tumor Area Segmentation',
    description:
      'Classifying each individual pixel of an MRI scan as healthy brain tissue or malignant glioma, using scans annotated by certified radiologists.',
    correctParadigm: 'supervised',
    inputX: 'Multi-modal MRI voxel intensities (T1, T2, FLAIR)',
    targetY: 'Pixel-level segmentation mask: y_ij in {0: Background, 1: Tumor}',
    explanation:
      'Radiologist annotations serve as supervisory ground truth masks. The loss function compares pixel-wise predictions against doctor labels.',
    commonAlgorithms: ['U-Net', 'Fully Convolutional Networks (FCN)', 'Mask R-CNN'],
  },
  {
    id: 'sc-5',
    title: 'Gene Expression Dimensionality Reduction',
    description:
      'Compressing expression measurements across 20,000 human genes into 2 latent dimensions so oncologists can visualize high-dimensional cell clustering.',
    correctParadigm: 'unsupervised',
    inputX: 'High-dimensional gene expression vectors (R^20000)',
    targetY: 'None (unlabeled continuous coordinates)',
    explanation:
      'The objective is finding orthogonal projection axes that preserve maximal variance or local topological neighborhood geometry without target labels.',
    commonAlgorithms: ['PCA', 't-SNE', 'UMAP'],
  },
  {
    id: 'sc-6',
    title: 'Web Content Classification with Scarce Labels',
    description:
      'Categorizing 10,000,000 raw crawled web pages when budget only allowed professional labeling for 1,000 documents.',
    correctParadigm: 'semi-supervised',
    inputX: 'Document token frequency vectors',
    targetY: 'Small subset labeled (1,000 docs); 9,999,000 documents unlabeled',
    explanation:
      'Semi-supervised algorithms leverage the massive unlabeled manifold distribution to propagate label beliefs from the small labeled anchor set.',
    commonAlgorithms: ['Label Propagation', 'Self-Training / Pseudo-Labeling', 'Co-Training'],
  },
  {
    id: 'sc-7',
    title: 'Real Estate Price Estimation',
    description:
      'Predicting the continuous market closing price in lakhs for residential apartments based on carpet area, floor level, and distance to metro.',
    correctParadigm: 'supervised',
    inputX: 'Area in sq ft, number of bedrooms, floor, distance to transit in km',
    targetY: 'Continuous numerical value: y in R+ (Price in lakhs)',
    explanation:
      'The model predicts a continuous target from historical home transaction records with verified closing prices.',
    commonAlgorithms: ['Linear Regression', 'Ridge/Lasso', 'Gradient Boosting Regressor'],
  },
  {
    id: 'sc-8',
    title: 'AlphaZero Chess Self-Play',
    description:
      'A neural network master playing millions of games against itself from scratch, receiving +1 for checkmate victory, -1 for loss, and 0 for draw.',
    correctParadigm: 'reinforcement',
    inputX: 'Current board configuration state (8x8x12 tensor representation)',
    targetY: 'Terminal reward: +1, -1, 0 at game conclusion',
    explanation:
      'No grandmaster games or opening books are provided. Through Monte Carlo Tree Search and policy iteration, the agent learns optimal move probabilities.',
    commonAlgorithms: ['AlphaZero MCTS', 'Policy Iteration', 'Actor-Critic'],
  },
];

interface MitchellExample {
  domain: string;
  taskT: string;
  performanceP: string;
  experienceE: string;
}

const MITCHELL_EXAMPLES: MitchellExample[] = [
  {
    domain: 'Autonomous Vehicle Highway Driving',
    taskT: 'Steering, braking, and lane-keeping on public four-lane highways.',
    performanceP: 'Average distance traveled in kilometers before requiring human disengagement.',
    experienceE: 'Database of 5,000 hours of human driving logs with camera and LiDAR telemetry.',
  },
  {
    domain: 'Handwritten Zip Code Recognition (MNIST / USPS)',
    taskT: 'Recognizing and segmenting handwritten 5-digit postal zip codes.',
    performanceP: 'Percentage of digits correctly classified on an unseen test parcel stream.',
    experienceE: 'A training dataset of 60,000 scanned envelope digits with human postal labels.',
  },
  {
    domain: 'Checkers Board Game Player (Arthur Samuel / Tom Mitchell)',
    taskT: 'Selecting optimal legal board moves during competitive checkers games.',
    performanceP: 'Percentage of tournament games won against intermediate human opponents.',
    experienceE:
      'Playing 100,000 games of checkers against copies of itself with reward evaluation.',
  },
  {
    domain: 'Hospital Sepsis Early Warning System',
    taskT: 'Predicting impending septic shock 6 hours prior to clinical symptom onset.',
    performanceP: 'Area Under the ROC Curve (AUROC) and sensitivity at 90% specificity.',
    experienceE: 'Electronic health records (vital signs, lab assays) from 40,000 ICU admissions.',
  },
];

export function MlParadigmsLab() {
  const [activeTab, setActiveTab] = useState<'sorter' | 'mitchell' | 'matrix'>('sorter');
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number>(0);
  const [userSelections, setUserSelections] = useState<Record<string, ParadigmType>>({});
  const [activeMitchellIndex, setActiveMitchellIndex] = useState<number>(0);

  const currentScenario = SCENARIOS[selectedScenarioIndex]!;
  const currentSelection = userSelections[currentScenario.id];
  const isAnswered = currentSelection !== undefined;
  const isCorrect = currentSelection === currentScenario.correctParadigm;

  const totalAnswered = Object.keys(userSelections).length;
  const correctCount = Object.entries(userSelections).filter(
    ([id, chosen]) => SCENARIOS.find((s) => s.id === id)?.correctParadigm === chosen
  ).length;

  const handleSelectParadigm = (paradigm: ParadigmType) => {
    setUserSelections((prev) => ({
      ...prev,
      [currentScenario.id]: paradigm,
    }));
  };

  const handleReset = () => {
    setUserSelections({});
    setSelectedScenarioIndex(0);
  };

  const paradigms: { key: ParadigmType; label: string; badge: string; color: string }[] = [
    {
      key: 'supervised',
      label: 'Supervised Learning',
      badge: 'Labeled (X, y)',
      color: 'border-emerald-500/40 text-emerald-400',
    },
    {
      key: 'unsupervised',
      label: 'Unsupervised Learning',
      badge: 'Unlabeled X only',
      color: 'border-cyan-500/40 text-cyan-400',
    },
    {
      key: 'reinforcement',
      label: 'Reinforcement Learning',
      badge: 'State, Action, Reward',
      color: 'border-amber-500/40 text-amber-400',
    },
    {
      key: 'semi-supervised',
      label: 'Semi-Supervised Learning',
      badge: 'Small labeled + Massive unlabeled',
      color: 'border-purple-500/40 text-purple-400',
    },
  ];

  return (
    <Card className="p-6 border-stone-800 bg-[#0c0a09] space-y-6 shadow-none">
      {/* Top Header & Tab Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <h3 className="font-montserrat text-lg font-bold text-stone-100">
              Interactive ML Paradigm Classifier &amp; Mitchell Formalizer
            </h3>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Test your classification instincts on real-world industry tasks and formalize them into
            (Task, Performance, Experience) tuples.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-stone-900/80 p-1 rounded-lg border border-stone-800">
          <button
            onClick={() => setActiveTab('sorter')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'sorter'
                ? 'bg-stone-100 text-stone-950 shadow-none font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Paradigm Sorter ({correctCount}/{SCENARIOS.length})
          </button>
          <button
            onClick={() => setActiveTab('mitchell')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'mitchell'
                ? 'bg-stone-100 text-stone-950 shadow-none font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Mitchell (T, P, E)
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'matrix'
                ? 'bg-stone-100 text-stone-950 shadow-none font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Taxonomy Matrix
          </button>
        </div>
      </div>

      {/* Tab 1: Interactive Paradigm Sorter */}
      {activeTab === 'sorter' && (
        <div className="space-y-6">
          {/* Progress & Scenario Carousel Indicators */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {SCENARIOS.map((sc, idx) => {
                const sel = userSelections[sc.id];
                const answered = sel !== undefined;
                const correct = sel === sc.correctParadigm;
                const isCurrent = idx === selectedScenarioIndex;

                let pillStyle = 'border-stone-800 bg-stone-900/60 text-stone-400';
                if (answered) {
                  pillStyle = correct
                    ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-400'
                    : 'border-rose-500/50 bg-rose-950/40 text-rose-400';
                }
                if (isCurrent) {
                  pillStyle += ' ring-2 ring-amber-400/70 text-stone-100';
                }

                return (
                  <button
                    key={sc.id}
                    onClick={() => setSelectedScenarioIndex(idx)}
                    className={`h-7 px-2.5 rounded text-xs font-mono border transition-all ${pillStyle}`}
                  >
                    #{idx + 1}
                  </button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="text-xs h-7 gap-1 border-stone-800 text-stone-400 hover:text-stone-200 rounded-lg rounded-br-none"
            >
              <RotateCcw className="size-3" />
              Reset All
            </Button>
          </div>

          {/* Active Scenario Card */}
          <div className="p-5 rounded-xl border border-stone-800 bg-stone-900/40 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <Badge
                variant="outline"
                className="font-mono text-xs text-amber-300/90 border-amber-500/30"
              >
                Case #{selectedScenarioIndex + 1} of {SCENARIOS.length}
              </Badge>
              <span className="text-xs font-mono text-stone-500">
                Score: {correctCount}/{totalAnswered} Answered
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="font-montserrat text-lg font-bold text-stone-100">
                {currentScenario.title}
              </h4>
              <p className="text-sm text-stone-300 leading-relaxed font-sans">
                {currentScenario.description}
              </p>
            </div>

            {/* Paradigm Selection Buttons */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-mono text-stone-400 uppercase tracking-wider block">
                Select the applicable learning paradigm:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {paradigms.map((p) => {
                  const isSelected = currentSelection === p.key;
                  let btnClass =
                    'border-stone-800 bg-stone-900/70 hover:bg-stone-800/80 text-stone-300';
                  if (isSelected) {
                    if (isCorrect) {
                      btnClass =
                        'border-emerald-500 bg-emerald-950/50 text-emerald-300 font-semibold';
                    } else {
                      btnClass = 'border-rose-500 bg-rose-950/50 text-rose-300 font-semibold';
                    }
                  } else if (isAnswered && p.key === currentScenario.correctParadigm) {
                    btnClass = 'border-emerald-500/70 bg-emerald-950/30 text-emerald-400/90';
                  }

                  return (
                    <button
                      key={p.key}
                      onClick={() => handleSelectParadigm(p.key)}
                      className={`p-3 rounded-lg rounded-br-none border text-left transition-all flex flex-col justify-between gap-1.5 ${btnClass}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-montserrat text-sm font-medium">{p.label}</span>
                        {isSelected &&
                          (isCorrect ? (
                            <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                          ) : (
                            <XCircle className="size-4 text-rose-400 shrink-0" />
                          ))}
                      </div>
                      <span className="text-[11px] font-mono text-stone-400">{p.badge}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Feedback & Detailed Explanation */}
            {isAnswered && (
              <div
                className={`p-4 rounded-lg border space-y-3 mt-4 ${
                  isCorrect
                    ? 'border-emerald-500/40 bg-emerald-950/20'
                    : 'border-rose-500/40 bg-rose-950/20'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <CheckCircle2 className="size-4 text-emerald-400" />
                  ) : (
                    <XCircle className="size-4 text-rose-400" />
                  )}
                  <span
                    className={`font-montserrat text-sm font-semibold ${
                      isCorrect ? 'text-emerald-300' : 'text-rose-300'
                    }`}
                  >
                    {isCorrect
                      ? 'Correct! Paradigm successfully identified.'
                      : `Not quite. Correct paradigm: ${
                          paradigms.find((p) => p.key === currentScenario.correctParadigm)?.label
                        }`}
                  </span>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed font-sans">
                  {currentScenario.explanation}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-stone-800/60 text-xs">
                  <div>
                    <span className="font-mono text-stone-400 block mb-0.5">
                      Input Features (X):
                    </span>
                    <span className="font-mono text-stone-200">{currentScenario.inputX}</span>
                  </div>
                  <div>
                    <span className="font-mono text-stone-400 block mb-0.5">
                      Target / Feedback (y / r):
                    </span>
                    <span className="font-mono text-amber-200/90">{currentScenario.targetY}</span>
                  </div>
                </div>

                <div className="pt-1">
                  <span className="text-[11px] font-mono text-stone-400 block mb-1">
                    Canonical Baseline Algorithms:
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {currentScenario.commonAlgorithms.map((algo) => (
                      <Badge
                        key={algo}
                        variant="outline"
                        className="text-[10px] py-0 px-2 border-stone-700 bg-stone-900/60 text-stone-300 font-mono"
                      >
                        {algo}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Next / Previous Controls */}
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                disabled={selectedScenarioIndex === 0}
                onClick={() => setSelectedScenarioIndex((prev) => Math.max(0, prev - 1))}
                className="text-xs rounded-lg rounded-br-none border-stone-800 text-stone-400 hover:text-stone-200"
              >
                Previous Case
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={selectedScenarioIndex === SCENARIOS.length - 1}
                onClick={() =>
                  setSelectedScenarioIndex((prev) => Math.min(SCENARIOS.length - 1, prev + 1))
                }
                className="text-xs bg-stone-100 text-stone-950 hover:bg-stone-200 rounded-lg rounded-br-none font-semibold"
              >
                Next Case
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Tom Mitchell (T, P, E) Formalization */}
      {activeTab === 'mitchell' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-montserrat text-sm font-semibold">
              <BookOpen className="size-4" />
              Tom M. Mitchell (1997) Operational Definition of Machine Learning
            </div>
            <blockquote className="text-xs text-stone-300 italic leading-relaxed border-l-2 border-amber-400/60 pl-3 py-1">
              &quot;A computer program is said to learn from{' '}
              <strong className="text-amber-200 font-semibold not-italic">experience E</strong> with
              respect to some class of{' '}
              <strong className="text-amber-200 font-semibold not-italic">tasks T</strong> and{' '}
              <strong className="text-amber-200 font-semibold not-italic">
                performance measure P
              </strong>
              , if its performance at tasks in T, as measured by P, improves with experience
              E.&quot;
            </blockquote>
          </div>

          {/* Preset Selector */}
          <div className="space-y-3">
            <span className="text-xs font-mono text-stone-400 uppercase tracking-wider block">
              Select an engineering domain to inspect its (T, P, E) formalization:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
              {MITCHELL_EXAMPLES.map((ex, idx) => (
                <button
                  key={ex.domain}
                  onClick={() => setActiveMitchellIndex(idx)}
                  className={`p-3 rounded-lg rounded-br-none border text-left text-xs transition-all ${
                    idx === activeMitchellIndex
                      ? 'border-amber-400 bg-stone-900 text-stone-100 font-semibold'
                      : 'border-stone-800 bg-stone-900/50 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {ex.domain}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Tuple Cards */}
          {(() => {
            const ex = MITCHELL_EXAMPLES[activeMitchellIndex]!;
            return (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-blue-500/40 bg-blue-950/20 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-blue-400 text-blue-300 font-mono text-xs"
                    >
                      Task (T)
                    </Badge>
                  </div>
                  <h5 className="font-montserrat text-sm font-bold text-stone-100">
                    What does the program do?
                  </h5>
                  <p className="text-xs text-stone-300 leading-relaxed font-sans">{ex.taskT}</p>
                </div>

                <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/20 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-emerald-400 text-emerald-300 font-mono text-xs"
                    >
                      Performance (P)
                    </Badge>
                  </div>
                  <h5 className="font-montserrat text-sm font-bold text-stone-100">
                    How is success quantified?
                  </h5>
                  <p className="text-xs text-stone-300 leading-relaxed font-sans">
                    {ex.performanceP}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-purple-500/40 bg-purple-950/20 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-purple-400 text-purple-300 font-mono text-xs"
                    >
                      Experience (E)
                    </Badge>
                  </div>
                  <h5 className="font-montserrat text-sm font-bold text-stone-100">
                    What data or signal guides learning?
                  </h5>
                  <p className="text-xs text-stone-300 leading-relaxed font-sans">
                    {ex.experienceE}
                  </p>
                </div>
              </div>
            );
          })()}

          {/* Exam Viva Hint */}
          <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/30 text-xs text-stone-300 space-y-1.5">
            <span className="font-montserrat font-bold text-stone-100 flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-amber-400" />
              MIT AOE Examination Secret:
            </span>
            <p className="leading-relaxed">
              When an exam question asks:{' '}
              <span className="text-amber-100 font-medium">
                &quot;State whether a system is a learning machine&quot;
              </span>
              , never give a vague English response. Always state: <em>1) Explicitly define T</em>,{' '}
              <em>2) State the mathematical formula for P</em> (e.g. Accuracy, MSE, AUROC), and{' '}
              <em>3) Describe E</em> (samples, games, sensor traces). If performance P monotonically
              increases as |E| expands, the system qualifies as a machine learning system under
              Mitchell formulation.
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Detailed Comparison Matrix */}
      {activeTab === 'matrix' && (
        <div className="space-y-4 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-800 bg-stone-900/70 text-stone-300 font-mono">
                <th className="p-3">Attribute</th>
                <th className="p-3 text-emerald-400">Supervised</th>
                <th className="p-3 text-cyan-400">Unsupervised</th>
                <th className="p-3 text-amber-400">Reinforcement</th>
                <th className="p-3 text-purple-400">Semi-Supervised</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 text-stone-300 font-sans">
              <tr>
                <td className="p-3 font-mono text-stone-400">Training Data</td>
                <td className="p-3">Labeled pairs (x_i, y_i)</td>
                <td className="p-3">Unlabeled instances x_i only</td>
                <td className="p-3">Environment states and actions</td>
                <td className="p-3">Few (x, y) + massive {`{x}`}</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-stone-400">Feedback Signal</td>
                <td className="p-3">Direct error: (y - y_hat)</td>
                <td className="p-3">None (density or geometry)</td>
                <td className="p-3">Delayed scalar reward r_t</td>
                <td className="p-3">Manifold consistency</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-stone-400">Primary Objective</td>
                <td className="p-3">Minimize empirical risk / loss</td>
                <td className="p-3">Discover hidden cluster structures</td>
                <td className="p-3">Maximize expected cumulative return</td>
                <td className="p-3">Propagate labels smoothly</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-stone-400">Core Sub-Types</td>
                <td className="p-3">Regression (continuous), Classification (discrete)</td>
                <td className="p-3">Clustering, Dimensionality Reduction, Association</td>
                <td className="p-3">Model-Free (Q-learning), Model-Based (Dyna-Q)</td>
                <td className="p-3">Transductive vs Inductive learning</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-stone-400">Primary Failure Mode</td>
                <td className="p-3 text-rose-300">Overfitting &amp; data leakage</td>
                <td className="p-3 text-rose-300">Spurious patterns &amp; noise fit</td>
                <td className="p-3 text-rose-300">Reward hacking &amp; exploration death</td>
                <td className="p-3 text-rose-300">Error propagation from dirty labels</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
