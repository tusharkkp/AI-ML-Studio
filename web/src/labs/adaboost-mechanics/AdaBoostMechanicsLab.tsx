import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Badge } from '@/components/ui/Badge';
import { SeededRNG } from '@/utils/rng';
import { Zap, RotateCcw, TrendingUp } from 'lucide-react';

export interface DataPoint {
  id: number;
  x: number;
  y: number;
  label: 1 | -1;
  isNoise?: boolean;
}

export interface StumpRecord {
  feature: 'x' | 'y';
  threshold: number;
  polarity: 1 | -1;
  error: number;
  alpha: number;
  zNorm: number;
  weightsBefore: number[];
  weightsAfter: number[];
  misclassifiedIndices: number[];
}

export const AdaBoostMechanicsLab: React.FC = () => {
  const [seed, setSeed] = useState<number>(42);
  const [addOutlierNoise, setAddOutlierNoise] = useState<boolean>(false);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [customError, setCustomError] = useState<number>(0.2); // For interactive alpha exploration

  // Generate 2D binary dataset
  const points: DataPoint[] = useMemo(() => {
    const rng = new SeededRNG(seed);
    const j = () => (rng.next() - 0.5) * 0.04;
    const dataset: DataPoint[] = [
      // Cluster +1 (Upper right quadrant)
      { id: 1, x: +(0.65 + j()).toFixed(3), y: +(0.75 + j()).toFixed(3), label: 1 },
      { id: 2, x: +(0.8 + j()).toFixed(3), y: +(0.6 + j()).toFixed(3), label: 1 },
      { id: 3, x: +(0.7 + j()).toFixed(3), y: +(0.85 + j()).toFixed(3), label: 1 },
      { id: 4, x: +(0.55 + j()).toFixed(3), y: +(0.65 + j()).toFixed(3), label: 1 },
      { id: 5, x: +(0.85 + j()).toFixed(3), y: +(0.8 + j()).toFixed(3), label: 1 },
      // Cluster -1 (Lower left quadrant)
      { id: 6, x: +(0.2 + j()).toFixed(3), y: +(0.3 + j()).toFixed(3), label: -1 },
      { id: 7, x: +(0.35 + j()).toFixed(3), y: +(0.15 + j()).toFixed(3), label: -1 },
      { id: 8, x: +(0.15 + j()).toFixed(3), y: +(0.45 + j()).toFixed(3), label: -1 },
      { id: 9, x: +(0.4 + j()).toFixed(3), y: +(0.35 + j()).toFixed(3), label: -1 },
      { id: 10, x: +(0.25 + j()).toFixed(3), y: +(0.25 + j()).toFixed(3), label: -1 },
      // Boundary ambiguous points
      { id: 11, x: +(0.48 + j()).toFixed(3), y: +(0.52 + j()).toFixed(3), label: 1 },
      { id: 12, x: +(0.52 + j()).toFixed(3), y: +(0.45 + j()).toFixed(3), label: -1 },
    ];

    if (addOutlierNoise) {
      // Add a pathological outlier: deep in negative territory with positive label
      dataset.push({
        id: 13,
        x: 0.18,
        y: 0.2,
        label: 1,
        isNoise: true,
      });
      dataset.push({
        id: 14,
        x: 0.82,
        y: 0.88,
        label: -1,
        isNoise: true,
      });
    }

    return dataset;
  }, [seed, addOutlierNoise]);

  // Execute Freund & Schapire AdaBoost.M1 sequentially
  const roundsHistory = useMemo(() => {
    const n = points.length;
    let currentWeights = new Array<number>(n).fill(1 / n);
    const history: StumpRecord[] = [];
    const maxRounds = 6;

    for (let r = 0; r < maxRounds; r++) {
      const weightsBefore = [...currentWeights];

      // Find optimal axis-aligned decision stump minimizing weighted error
      let bestFeature: 'x' | 'y' = 'x';
      let bestThresh = 0.5;
      let bestPolarity: 1 | -1 = 1;
      let minError = 1.0;
      let bestMisclassified: number[] = [];

      const candidateFeatures: ('x' | 'y')[] = ['x', 'y'];
      for (const feat of candidateFeatures) {
        // Test 20 candidate split thresholds
        for (let s = 1; s <= 20; s++) {
          const thresh = s / 21;
          for (const pol of [1, -1] as const) {
            let weightedErr = 0;
            const mis: number[] = [];

            for (let i = 0; i < n; i++) {
              const val = feat === 'x' ? points[i]!.x : points[i]!.y;
              const pred: 1 | -1 = val >= thresh ? pol : (-pol as unknown as 1 | -1);
              if (pred !== points[i]!.label) {
                weightedErr += weightsBefore[i]!;
                mis.push(i);
              }
            }

            if (weightedErr < minError) {
              minError = weightedErr;
              bestFeature = feat;
              bestThresh = thresh;
              bestPolarity = pol;
              bestMisclassified = mis;
            }
          }
        }
      }

      // Safeguard error to avoid div by zero or negative alpha
      const eps = Math.max(1e-6, Math.min(0.4999, minError));
      const alpha = 0.5 * Math.log((1 - eps) / eps);

      // Compute weight updates and normalization constant Z
      let zSum = 0;
      const unnormWeights: number[] = [];
      for (let i = 0; i < n; i++) {
        const val = bestFeature === 'x' ? points[i]!.x : points[i]!.y;
        const pred: 1 | -1 =
          val >= bestThresh ? bestPolarity : (-bestPolarity as unknown as 1 | -1);
        const factor = Math.exp(-alpha * points[i]!.label * pred);
        const nw = weightsBefore[i]! * factor;
        unnormWeights.push(nw);
        zSum += nw;
      }

      // Normalized weights for next round
      const weightsAfter = unnormWeights.map((w) => w / (zSum || 1));
      currentWeights = weightsAfter;

      history.push({
        feature: bestFeature,
        threshold: bestThresh,
        polarity: bestPolarity,
        error: eps,
        alpha,
        zNorm: zSum,
        weightsBefore,
        weightsAfter,
        misclassifiedIndices: bestMisclassified,
      });
    }

    return history;
  }, [points]);

  const activeStump = roundsHistory[Math.min(currentRound - 1, roundsHistory.length - 1)]!;
  const currentPointWeights = activeStump.weightsBefore;

  // Custom alpha curve calculator
  const computedAlpha = useMemo(() => {
    if (customError <= 0 || customError >= 1) return 0;
    return 0.5 * Math.log((1 - customError) / customError);
  }, [customError]);

  return (
    <div className="space-y-6">
      {/* Control Toolbar */}
      <Card className="p-6 border-orange-50/15 bg-neutral-900/60 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-orange-50/10 pb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold text-lg text-foreground font-manrope">
              Freund & Schapire AdaBoost.M1 engine
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={addOutlierNoise ? 'danger' : 'outline'}
              onClick={() => setAddOutlierNoise((v) => !v)}
              className="text-xs"
            >
              {addOutlierNoise ? 'Remove Outlier Noise' : 'Inject Pathological Outliers'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSeed((s) => s + 1)}
              className="flex items-center gap-1.5 text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reseed
            </Button>
          </div>
        </div>

        {/* Round Scrubber Controls */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 font-mono uppercase tracking-wider">
              Scrub Round:
            </span>
            {[1, 2, 3, 4, 5, 6].map((r) => (
              <button
                key={r}
                onClick={() => setCurrentRound(r)}
                className={`w-8 h-8 rounded-lg text-xs font-mono font-bold transition-all border ${
                  currentRound === r
                    ? 'border-brand bg-brand text-white shadow-none'
                    : 'border-orange-50/10 bg-black/20 text-neutral-400 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <Badge variant="outline">Round {currentRound} of 6</Badge>
            <span className="text-neutral-400">
              Split:{' '}
              <code className="text-cream">
                {activeStump.feature} = {activeStump.threshold.toFixed(2)}
              </code>
            </span>
            <span className="text-amber-400 font-bold">
              α_{currentRound} = {activeStump.alpha.toFixed(3)}
            </span>
          </div>
        </div>
      </Card>

      {/* Main Visualizer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: 2D Plane with Dynamic Weight Circles */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5 border-orange-50/15 bg-neutral-900/60">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-semibold text-sm text-foreground font-manrope">
                  Sample Weight Expansion (w_i^{currentRound}) & Weak Classifier Split
                </h4>
                <p className="text-xs text-neutral-400 font-montserrat">
                  Circle radius is proportional to sample weight. Misclassified points inflate
                  exponentially for Round {currentRound + 1}.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-blue-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                  Class +1
                </span>
                <span className="flex items-center gap-1.5 text-red-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                  Class -1
                </span>
              </div>
            </div>

            {/* SVG Visualizer */}
            <div className="relative w-full aspect-square max-h-[460px] bg-black/40 rounded-xl border border-orange-50/10 p-2 overflow-hidden mx-auto">
              <svg className="w-full h-full" viewBox="0 0 500 500">
                {/* Coordinate Grid */}
                {[0.2, 0.4, 0.6, 0.8].map((g) => {
                  const pos = g * 440 + 30;
                  return (
                    <g key={`grid-${g}`}>
                      <line
                        x1={pos}
                        y1={30}
                        x2={pos}
                        y2={470}
                        stroke="#292524"
                        strokeDasharray="2 2"
                      />
                      <line
                        x1={30}
                        y1={pos}
                        x2={470}
                        y2={pos}
                        stroke="#292524"
                        strokeDasharray="2 2"
                      />
                    </g>
                  );
                })}

                {/* Decision Stump Boundary Line */}
                {activeStump.feature === 'x' ? (
                  <g>
                    <line
                      x1={activeStump.threshold * 440 + 30}
                      y1={30}
                      x2={activeStump.threshold * 440 + 30}
                      y2={470}
                      stroke="#f59e0b"
                      strokeWidth={2.5}
                      strokeDasharray="6 4"
                    />
                    <text
                      x={activeStump.threshold * 440 + 35}
                      y={45}
                      fill="#f59e0b"
                      fontSize={11}
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      h_{currentRound}(x) : x = {activeStump.threshold.toFixed(2)}
                    </text>
                  </g>
                ) : (
                  <g>
                    <line
                      x1={30}
                      y1={470 - activeStump.threshold * 440}
                      x2={470}
                      y2={470 - activeStump.threshold * 440}
                      stroke="#f59e0b"
                      strokeWidth={2.5}
                      strokeDasharray="6 4"
                    />
                    <text
                      x={35}
                      y={465 - activeStump.threshold * 440}
                      fill="#f59e0b"
                      fontSize={11}
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      h_{currentRound}(y) : y = {activeStump.threshold.toFixed(2)}
                    </text>
                  </g>
                )}

                {/* Data Points with Weighted Radii */}
                {points.map((p, idx) => {
                  const cx = p.x * 440 + 30;
                  const cy = 470 - p.y * 440;
                  const weight = currentPointWeights[idx] || 1 / points.length;
                  // Base radius 6px, scaled up by weight ratio
                  const r = Math.max(6, Math.min(28, Math.sqrt(weight * points.length) * 8));
                  const isMisclassified = activeStump.misclassifiedIndices.includes(idx);
                  const isPositive = p.label === 1;

                  return (
                    <g key={p.id} className="transition-all duration-300">
                      {/* Misclassified pulsing alert halo */}
                      {isMisclassified && (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={r + 5}
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth={2}
                          strokeDasharray="3 2"
                        />
                      )}

                      {/* Weight Bubble */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={r}
                        fill={isPositive ? '#3b82f6' : '#ef4444'}
                        fillOpacity={0.65}
                        stroke={isMisclassified ? '#ffffff' : isPositive ? '#60a5fa' : '#f87171'}
                        strokeWidth={isMisclassified ? 2 : 1}
                        className="cursor-pointer hover:fill-opacity-90"
                      >
                        <title>
                          Sample #{p.id}: Label={p.label}, Weight={(weight * 100).toFixed(2)}%{' '}
                          {isMisclassified
                            ? '(MISCLASSIFIED - WEIGHT INCREASES NEXT ROUND)'
                            : '(CORRECT)'}
                        </title>
                      </circle>

                      {/* Label Text */}
                      <text
                        x={cx}
                        y={cy + 3.5}
                        fill="#ffffff"
                        fontSize={10}
                        fontWeight="bold"
                        textAnchor="middle"
                        fontFamily="monospace"
                      >
                        {isPositive ? '+' : '-'}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </Card>
        </div>

        {/* Right Col: Mathematical Breakdown & Interactive Alpha Explorer */}
        <div className="space-y-4">
          {/* Round Metrics Card */}
          <Card className="p-5 border-orange-50/15 bg-neutral-900/60 space-y-4">
            <h4 className="font-semibold text-sm text-foreground font-manrope flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand" />
              Round {currentRound} Mathematical Ledger
            </h4>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-black/30 border border-orange-50/10 space-y-1">
                <div className="text-neutral-400 text-[10px] uppercase">
                  Weighted Training Error (ε_{currentRound})
                </div>
                <div className="text-xl font-bold text-amber-300">
                  {(activeStump.error * 100).toFixed(2)}%
                </div>
                <div className="text-[10px] text-neutral-500 font-sans">
                  Sum of weights for misclassified samples
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-black/30 border border-orange-50/10 space-y-1">
                <div className="text-neutral-400 text-[10px] uppercase">
                  Classifier Voting Weight (α_{currentRound})
                </div>
                <div className="text-xl font-bold text-emerald-300">
                  {activeStump.alpha.toFixed(4)}
                </div>
                <div className="text-[10px] text-neutral-500 font-sans">
                  α_t = 0.5 · ln((1 - ε_t) / ε_t)
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-black/30 border border-orange-50/10 space-y-1">
                <div className="text-neutral-400 text-[10px] uppercase">
                  Normalization Factor (Z_{currentRound})
                </div>
                <div className="text-lg font-bold text-neutral-200">
                  {activeStump.zNorm.toFixed(4)}
                </div>
                <div className="text-[10px] text-neutral-500 font-sans">
                  Guarantees ∑ w_i = 1 for Round {currentRound + 1}
                </div>
              </div>
            </div>
          </Card>

          {/* Alpha Sensitivity Explorer */}
          <Card className="p-5 border-orange-50/15 bg-neutral-900/60 space-y-3">
            <h4 className="font-semibold text-sm text-foreground font-manrope">
              Interactive Alpha Curve: α(ε)
            </h4>
            <p className="text-xs text-neutral-400 font-montserrat leading-relaxed">
              Drag test error <code className="text-cream">ε</code> to observe how AdaBoost rewards
              near-perfect stumps and disables random guessing:
            </p>

            <Slider
              label={`Test Error ε: ${(customError * 100).toFixed(1)}%`}
              value={customError}
              min={0.01}
              max={0.5}
              step={0.01}
              onChange={(val) => setCustomError(val)}
            />

            <div className="p-3 rounded-lg bg-black/40 border border-orange-50/10 flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-400">Resulting Weight α:</span>
              <span className="font-bold text-amber-300 text-sm">{computedAlpha.toFixed(4)}</span>
            </div>

            <div className="text-[11px] text-neutral-400 font-sans leading-relaxed">
              {customError >= 0.48 ? (
                <span className="text-yellow-400">
                  At ε ≈ 0.50 (random coin flip), α → 0: the stump receives zero voting authority in
                  the final ensemble.
                </span>
              ) : customError <= 0.05 ? (
                <span className="text-emerald-400">
                  As ε → 0 (flawless classifier), α → ∞: this stump dominates the entire ensemble
                  decision.
                </span>
              ) : (
                <span>
                  Normal operational zone: weak learner error ε &lt; 0.5 yields positive weight α
                  &gt; 0.
                </span>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
