import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AlertTriangle } from 'lucide-react';

interface ModelBenchmark {
  name: string;
  accuracy: number;
  balancedAcc: number;
  precision: number;
  recall: number;
  specificity: number;
  f1: number;
  rocAuc: number;
  brierScore: number;
  foldAccuracies: number[];
}

export function ModelEvaluationLab() {
  const [scenario, setScenario] = useState<'balanced' | 'imbalanced' | 'noisy'>('imbalanced');
  const [activeTab, setActiveTab] = useState<'metrics' | 'curves' | 'calibration' | 'cv'>(
    'metrics'
  );

  // Compute benchmarks deterministically based on scenario
  const benchmarks: ModelBenchmark[] = useMemo(() => {
    if (scenario === 'imbalanced') {
      // 95% Negative, 5% Positive scenario
      return [
        {
          name: 'Single Decision Tree',
          accuracy: 0.942,
          balancedAcc: 0.615,
          precision: 0.38,
          recall: 0.28,
          specificity: 0.978,
          f1: 0.323,
          rocAuc: 0.635,
          brierScore: 0.054,
          foldAccuracies: [0.935, 0.945, 0.94, 0.95, 0.94],
        },
        {
          name: 'Breiman Random Forest',
          accuracy: 0.968,
          balancedAcc: 0.825,
          precision: 0.72,
          recall: 0.68,
          specificity: 0.985,
          f1: 0.699,
          rocAuc: 0.924,
          brierScore: 0.031,
          foldAccuracies: [0.965, 0.97, 0.965, 0.975, 0.965],
        },
        {
          name: 'AdaBoost (15 Stumps)',
          accuracy: 0.954,
          balancedAcc: 0.76,
          precision: 0.58,
          recall: 0.54,
          specificity: 0.976,
          f1: 0.559,
          rocAuc: 0.885,
          brierScore: 0.042,
          foldAccuracies: [0.95, 0.955, 0.955, 0.96, 0.95],
        },
        {
          name: 'Logistic / SVM Baseline',
          accuracy: 0.95,
          balancedAcc: 0.5,
          precision: 0.0,
          recall: 0.0,
          specificity: 1.0,
          f1: 0.0,
          rocAuc: 0.58,
          brierScore: 0.048,
          foldAccuracies: [0.95, 0.95, 0.95, 0.95, 0.95],
        },
      ];
    } else if (scenario === 'balanced') {
      return [
        {
          name: 'Single Decision Tree',
          accuracy: 0.835,
          balancedAcc: 0.835,
          precision: 0.84,
          recall: 0.828,
          specificity: 0.842,
          f1: 0.834,
          rocAuc: 0.835,
          brierScore: 0.142,
          foldAccuracies: [0.82, 0.84, 0.83, 0.85, 0.835],
        },
        {
          name: 'Breiman Random Forest',
          accuracy: 0.925,
          balancedAcc: 0.925,
          precision: 0.93,
          recall: 0.92,
          specificity: 0.93,
          f1: 0.925,
          rocAuc: 0.978,
          brierScore: 0.065,
          foldAccuracies: [0.915, 0.93, 0.925, 0.935, 0.92],
        },
        {
          name: 'AdaBoost (15 Stumps)',
          accuracy: 0.908,
          balancedAcc: 0.908,
          precision: 0.91,
          recall: 0.905,
          specificity: 0.91,
          f1: 0.907,
          rocAuc: 0.962,
          brierScore: 0.082,
          foldAccuracies: [0.9, 0.91, 0.915, 0.905, 0.91],
        },
        {
          name: 'Logistic / SVM Baseline',
          accuracy: 0.745,
          balancedAcc: 0.745,
          precision: 0.75,
          recall: 0.735,
          specificity: 0.755,
          f1: 0.742,
          rocAuc: 0.812,
          brierScore: 0.185,
          foldAccuracies: [0.73, 0.75, 0.745, 0.76, 0.74],
        },
      ];
    } else {
      // Noisy Moons
      return [
        {
          name: 'Single Decision Tree',
          accuracy: 0.785,
          balancedAcc: 0.785,
          precision: 0.79,
          recall: 0.778,
          specificity: 0.792,
          f1: 0.784,
          rocAuc: 0.785,
          brierScore: 0.175,
          foldAccuracies: [0.76, 0.8, 0.77, 0.81, 0.78],
        },
        {
          name: 'Breiman Random Forest',
          accuracy: 0.875,
          balancedAcc: 0.875,
          precision: 0.88,
          recall: 0.87,
          specificity: 0.88,
          f1: 0.875,
          rocAuc: 0.945,
          brierScore: 0.098,
          foldAccuracies: [0.86, 0.88, 0.875, 0.89, 0.87],
        },
        {
          name: 'AdaBoost (15 Stumps)',
          accuracy: 0.82,
          balancedAcc: 0.82,
          precision: 0.825,
          recall: 0.815,
          specificity: 0.825,
          f1: 0.82,
          rocAuc: 0.895,
          brierScore: 0.145,
          foldAccuracies: [0.8, 0.83, 0.815, 0.84, 0.815],
        },
        {
          name: 'Logistic / SVM Baseline',
          accuracy: 0.79,
          balancedAcc: 0.79,
          precision: 0.795,
          recall: 0.782,
          specificity: 0.798,
          f1: 0.788,
          rocAuc: 0.86,
          brierScore: 0.155,
          foldAccuracies: [0.78, 0.795, 0.785, 0.8, 0.79],
        },
      ];
    }
  }, [scenario]);

  return (
    <Card className="p-6 border border-orange-50/15 bg-neutral-900/50 backdrop-blur-sm space-y-6">
      {/* Top Header & Scenario Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-orange-50/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded border border-orange-50/20 bg-black/40 text-[10px] font-mono font-bold text-orange-200">
              LAB
            </span>
            <h3 className="font-manrope text-lg font-semibold text-foreground dark:text-white">
              Systematic model evaluation & benchmarking studio
            </h3>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5 font-montserrat">
            Compare model performance across metrics, calibration quality, and cross-validation
            variance.
          </p>
        </div>

        {/* Scenario Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-0.5 rounded-lg border border-orange-50/15 bg-black/40 text-xs">
            <button
              onClick={() => setScenario('imbalanced')}
              className={`px-3 py-1 rounded-md transition-colors ${
                scenario === 'imbalanced'
                  ? 'bg-brand text-white font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              95:5 Imbalanced
            </button>
            <button
              onClick={() => setScenario('balanced')}
              className={`px-3 py-1 rounded-md transition-colors ${
                scenario === 'balanced'
                  ? 'bg-neutral-800 text-white font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Balanced Rings
            </button>
            <button
              onClick={() => setScenario('noisy')}
              className={`px-3 py-1 rounded-md transition-colors ${
                scenario === 'noisy'
                  ? 'bg-neutral-800 text-white font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              15% Noisy Moons
            </button>
          </div>
        </div>
      </div>

      {/* Sub-view navigation tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-orange-50/10 pb-3 text-xs font-sans">
        {(
          [
            { id: 'metrics', label: '1. Metrics Matrix' },
            { id: 'curves', label: '2. ROC vs Precision-Recall Curves' },
            { id: 'calibration', label: '3. Probability Calibration (Brier)' },
            { id: 'cv', label: '4. 5-Fold Cross-Validation Variance' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-neutral-800 text-white font-semibold border border-orange-50/20'
                : 'text-neutral-400 hover:text-neutral-200 bg-black/20'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Comprehensive Metrics Matrix Table */}
      {activeTab === 'metrics' && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-lg border border-orange-50/10 bg-black/40">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-black/60 text-neutral-400 uppercase tracking-wider text-[10px] border-b border-orange-50/10">
                <tr>
                  <th className="py-2.5 px-3">Model Architecture</th>
                  <th className="py-2.5 px-3">Accuracy</th>
                  <th className="py-2.5 px-3">Balanced Acc</th>
                  <th className="py-2.5 px-3">Precision</th>
                  <th className="py-2.5 px-3">Recall</th>
                  <th className="py-2.5 px-3">F1-Score</th>
                  <th className="py-2.5 px-3 text-emerald-400">ROC-AUC</th>
                  <th className="py-2.5 px-3">Brier Score ↓</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {benchmarks.map((m, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-neutral-200 font-manrope">
                      {m.name}
                    </td>
                    <td className="py-2.5 px-3 text-neutral-300">
                      {(m.accuracy * 100).toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-3 text-neutral-300">
                      {(m.balancedAcc * 100).toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-3 text-neutral-300">
                      {(m.precision * 100).toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-3 text-neutral-300">{(m.recall * 100).toFixed(1)}%</td>
                    <td className="py-2.5 px-3 font-bold text-amber-300">{m.f1.toFixed(3)}</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-400">
                      {m.rocAuc.toFixed(3)}
                    </td>
                    <td className="py-2.5 px-3 text-neutral-400">{m.brierScore.toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {scenario === 'imbalanced' && (
            <div className="p-3.5 rounded-lg border border-amber-500/30 bg-amber-950/20 text-xs text-amber-200 flex items-start gap-2.5 font-montserrat">
              <AlertTriangle className="size-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong>The Accuracy Paradox in Action:</strong> Notice how the simple Logistic
                baseline achieves <span className="font-bold text-white">95.0% Accuracy</span>{' '}
                simply by predicting the majority class for every sample! Yet its Recall is 0.0% and
                F1-Score is 0.000. In severe class imbalance, raw accuracy is completely
                meaningless.
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: ROC vs PR Curves */}
      {activeTab === 'curves' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-4 border border-orange-50/10 bg-black/40 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-neutral-200 font-manrope">
                Receiver Operating Characteristic (ROC)
              </span>
              <span className="font-mono text-[10px] text-neutral-400">TPR vs FPR</span>
            </div>
            <div className="h-44 border border-neutral-800 rounded bg-black/60 relative flex items-center justify-center p-4">
              <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                {/* Diagonal random chance line */}
                <line
                  x1="0"
                  y1="100"
                  x2="100"
                  y2="0"
                  stroke="#525252"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                {/* Random Forest curve */}
                <path d="M 0 100 Q 10 10 100 0" fill="none" stroke="#f97316" strokeWidth="2.5" />
                {/* Decision Tree curve */}
                <path d="M 0 100 L 25 35 L 100 0" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
              </svg>
              <div className="absolute bottom-2 right-2 text-[10px] font-mono text-neutral-400">
                FPR (0 → 1)
              </div>
              <div className="absolute top-2 left-2 text-[10px] font-mono text-neutral-400">
                TPR (0 → 1)
              </div>
            </div>
            <p className="text-[11px] text-neutral-400 font-montserrat">
              ROC measures the trade-off across all operating thresholds. Unaffected by class ratio
              shifts.
            </p>
          </Card>

          <Card className="p-4 border border-orange-50/10 bg-black/40 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-neutral-200 font-manrope">
                Precision-Recall (PR) Curve
              </span>
              <span className="font-mono text-[10px] text-brand">Critical for Imbalance</span>
            </div>
            <div className="h-44 border border-neutral-800 rounded bg-black/60 relative flex items-center justify-center p-4">
              <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                {/* Baseline horizontal line at prevalence */}
                <line
                  x1="0"
                  y1={scenario === 'imbalanced' ? '95' : '50'}
                  x2="100"
                  y2={scenario === 'imbalanced' ? '95' : '50'}
                  stroke="#525252"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                {/* Random Forest PR curve */}
                <path d="M 0 10 Q 50 15 100 95" fill="none" stroke="#f97316" strokeWidth="2.5" />
                {/* Decision Tree PR curve */}
                <path d="M 0 35 L 45 45 L 100 95" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
              </svg>
              <div className="absolute bottom-2 right-2 text-[10px] font-mono text-neutral-400">
                Recall (0 → 1)
              </div>
              <div className="absolute top-2 left-2 text-[10px] font-mono text-neutral-400">
                Precision (0 → 1)
              </div>
            </div>
            <p className="text-[11px] text-neutral-400 font-montserrat">
              PR curves directly expose high false-positive rates that ROC curves mask in sparse
              classes.
            </p>
          </Card>
        </div>
      )}

      {/* Tab 3: Calibration & Brier Score */}
      {activeTab === 'calibration' && (
        <div className="space-y-4">
          <Card className="p-5 border border-orange-50/10 bg-black/40 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-manrope text-sm font-semibold text-neutral-200">
                Reliability Diagram (Probability Calibration)
              </h4>
              <Badge variant="outline">Brier Score: Lower = Better</Badge>
            </div>
            <p className="text-xs text-neutral-400 font-montserrat">
              Does a model output of 0.80 mean that 80% of those samples are truly positive?
              Well-calibrated models adhere to the 45° diagonal line.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {benchmarks.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded bg-black/60 border border-neutral-800 text-xs font-mono"
                >
                  <div className="text-neutral-400 text-[10px] truncate">{m.name}</div>
                  <div className="text-sm font-bold text-neutral-200 mt-1">
                    Brier: {m.brierScore.toFixed(3)}
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-0.5">
                    {m.brierScore < 0.08 ? 'Well Calibrated' : 'Under/Over-Confident'}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Tab 4: 5-Fold Cross-Validation Variance */}
      {activeTab === 'cv' && (
        <div className="space-y-4">
          <Card className="p-5 border border-orange-50/10 bg-black/40 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-manrope text-sm font-semibold text-neutral-200">
                5-Fold Cross-Validation Fold Distribution
              </h4>
              <span className="text-xs font-mono text-neutral-400">
                Variance across test partitions
              </span>
            </div>

            <div className="space-y-3 pt-2">
              {benchmarks.map((m, idx) => {
                const minAcc = Math.min(...m.foldAccuracies);
                const maxAcc = Math.max(...m.foldAccuracies);
                const spread = (maxAcc - minAcc) * 100;

                return (
                  <div
                    key={idx}
                    className="p-3 rounded bg-black/60 border border-neutral-800 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between font-mono">
                      <span className="font-semibold text-neutral-200">{m.name}</span>
                      <span className="text-neutral-400">
                        Spread: ±{(spread / 2).toFixed(2)}% (Fold range: {(minAcc * 100).toFixed(1)}
                        % → {(maxAcc * 100).toFixed(1)}%)
                      </span>
                    </div>

                    {/* Fold dots */}
                    <div className="flex items-center gap-2 pt-1">
                      {m.foldAccuracies.map((acc, fIdx) => (
                        <div
                          key={fIdx}
                          className="flex-1 text-center py-1 rounded bg-neutral-900 border border-neutral-800 font-mono text-[11px] text-neutral-300"
                        >
                          F{fIdx + 1}: {(acc * 100).toFixed(1)}%
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}
    </Card>
  );
}
