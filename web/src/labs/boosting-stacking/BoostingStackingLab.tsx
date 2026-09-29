import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Badge } from '@/components/ui/Badge';
import { SeededRNG } from '@/utils/rng';
import {
  trainAdaBoost,
  predictStump,
  predictAdaBoost,
  trainStackingBlender,
  generateEnsembleBoundaryGrid,
} from '@/engines/ensemble/forest/engine';
import type { Point2D } from '@/engines/ensemble/forest/types';
import { StepForward, Zap, GitMerge, Sliders } from 'lucide-react';

export function BoostingStackingLab() {
  const [activeTab, setActiveTab] = useState<'adaboost' | 'stacking'>('adaboost');
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [viewBoundary, setViewBoundary] = useState<'cumulative' | 'stump'>('cumulative');
  const seed = 42;

  // Stacking custom meta weights
  const [metaW1, setMetaW1] = useState<number>(35);
  const [metaW2, setMetaW2] = useState<number>(30);
  const [metaW3, setMetaW3] = useState<number>(35);

  // Synthesize non-linearly separable dataset
  const dataset = useMemo(() => {
    const rng = new SeededRNG(seed);
    const points: Point2D[] = [];
    const n = 24;

    // Positive points clustered near center
    for (let i = 0; i < n / 2; i++) {
      points.push({
        x: rng.nextFloat(-0.8, 0.8),
        y: rng.nextFloat(-0.8, 0.8),
        label: 1,
      });
    }

    // Negative points forming perimeter horseshoe
    for (let i = 0; i < n / 2; i++) {
      const angle = (i / (n / 2)) * Math.PI * 1.5;
      const r = 1.6 + rng.nextFloat(-0.2, 0.2);
      points.push({
        x: Math.cos(angle) * r,
        y: Math.sin(angle) * r,
        label: -1,
      });
    }

    return points;
  }, [seed]);

  // Train AdaBoost for 8 rounds
  const adaModel = useMemo(() => {
    return trainAdaBoost(dataset, 8);
  }, [dataset]);

  // Train Stacking model
  const stackingModel = useMemo(() => {
    return trainStackingBlender(dataset, seed);
  }, [dataset, seed]);

  // Active round data
  const safeRound = Math.min(currentRound, adaModel.rounds.length);
  const activeRoundData = adaModel.rounds[safeRound - 1];

  // Subset model for cumulative boundary up to safeRound
  const subsetModel = useMemo(() => {
    return {
      rounds: adaModel.rounds.slice(0, safeRound),
      stumps: adaModel.stumps.slice(0, safeRound),
      finalAccuracy: activeRoundData ? activeRoundData.trainingAccuracy : 1,
    };
  }, [adaModel, safeRound, activeRoundData]);

  // Generate 2D boundary grid
  const boundaryGrid = useMemo(() => {
    if (!activeRoundData) return null;
    return generateEnsembleBoundaryGrid(
      (pt) => {
        if (viewBoundary === 'stump') {
          return { prediction: predictStump(activeRoundData.stump, pt) };
        } else {
          return predictAdaBoost(subsetModel, pt);
        }
      },
      -2.2,
      2.2,
      -2.2,
      2.2,
      24
    );
  }, [activeRoundData, viewBoundary, subsetModel]);

  // Canvas bounds
  const width = 360;
  const height = 300;
  const xMin = -2.2;
  const xMax = 2.2;
  const yMin = -2.2;
  const yMax = 2.2;

  const toPx = (x: number, y: number) => ({
    cx: ((x - xMin) / (xMax - xMin)) * width,
    cy: height - ((y - yMin) / (yMax - yMin)) * height,
  });

  return (
    <Card className="p-6 border border-orange-50/15 bg-neutral-900/50 backdrop-blur-sm space-y-6">
      {/* Header bar & tab selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-orange-50/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded border border-orange-50/20 bg-black/40 text-[10px] font-mono font-bold text-orange-200">
              LAB
            </span>
            <h3 className="font-manrope text-lg font-semibold text-foreground dark:text-white">
              AdaBoost reweighting & stacking blender studio
            </h3>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5 font-montserrat">
            Step through sequential boosting error correction and explore cross-validated model
            stacking.
          </p>
        </div>

        {/* Tab pills */}
        <div className="flex items-center p-0.5 rounded-lg border border-orange-50/15 bg-black/40 text-xs">
          <button
            onClick={() => setActiveTab('adaboost')}
            className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'adaboost'
                ? 'bg-neutral-800 text-white font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Zap className="size-3 text-brand" />
            <span>AdaBoost Reweighting</span>
          </button>
          <button
            onClick={() => setActiveTab('stacking')}
            className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'stacking'
                ? 'bg-neutral-800 text-white font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <GitMerge className="size-3 text-orange-200" />
            <span>Stacking Blender</span>
          </button>
        </div>
      </div>

      {activeTab === 'adaboost' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-lg bg-black/40 border border-orange-50/10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-neutral-400">Round {safeRound} of 8:</span>
              <div className="flex items-center gap-1">
                {adaModel.rounds.map((r) => (
                  <button
                    key={r.roundIndex}
                    onClick={() => setCurrentRound(r.roundIndex)}
                    className={`size-6 rounded text-xs font-mono transition-colors ${
                      safeRound === r.roundIndex
                        ? 'bg-brand text-white font-bold'
                        : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {r.roundIndex}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentRound((prev) => (prev < 8 ? prev + 1 : 1))}
                className="flex items-center gap-1 text-xs"
              >
                <StepForward className="size-3" />
                <span>Next Round</span>
              </Button>

              <div className="flex items-center p-0.5 rounded border border-orange-50/10 bg-black/50 text-[11px]">
                <button
                  onClick={() => setViewBoundary('cumulative')}
                  className={`px-2 py-0.5 rounded ${
                    viewBoundary === 'cumulative'
                      ? 'bg-neutral-700 text-white'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  Cumulative Ensemble
                </button>
                <button
                  onClick={() => setViewBoundary('stump')}
                  className={`px-2 py-0.5 rounded ${
                    viewBoundary === 'stump'
                      ? 'bg-neutral-700 text-white'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  Single Round Stump
                </button>
              </div>
            </div>
          </div>

          {/* Canvas & Metrics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Visual Canvas */}
            <div className="lg:col-span-7 flex flex-col items-center">
              <div className="relative border border-orange-50/15 rounded-lg overflow-hidden bg-black/70">
                <svg width={width} height={height} className="block">
                  {/* Background grid */}
                  {boundaryGrid &&
                    boundaryGrid.grid.map((row, r) => {
                      const rectH = height / boundaryGrid.resolution;
                      return row.map((val, c) => {
                        const rectW = width / boundaryGrid.resolution;
                        const fill =
                          val > 0 ? 'rgba(249, 115, 22, 0.16)' : 'rgba(59, 130, 246, 0.16)';
                        return (
                          <rect
                            key={`${r}-${c}`}
                            x={c * rectW}
                            y={r * rectH}
                            width={rectW + 0.5}
                            height={rectH + 0.5}
                            fill={fill}
                          />
                        );
                      });
                    })}

                  {/* Decision Stump Boundary Line */}
                  {activeRoundData && (
                    <line
                      x1={
                        activeRoundData.stump.featureIndex === 0
                          ? toPx(activeRoundData.stump.threshold, 0).cx
                          : 0
                      }
                      y1={
                        activeRoundData.stump.featureIndex === 0
                          ? 0
                          : toPx(0, activeRoundData.stump.threshold).cy
                      }
                      x2={
                        activeRoundData.stump.featureIndex === 0
                          ? toPx(activeRoundData.stump.threshold, 0).cx
                          : width
                      }
                      y2={
                        activeRoundData.stump.featureIndex === 0
                          ? height
                          : toPx(0, activeRoundData.stump.threshold).cy
                      }
                      stroke="#f59e0b"
                      strokeWidth={2}
                      strokeDasharray="4 3"
                    />
                  )}

                  {/* Sample points scaled by weight w_i */}
                  {dataset.map((pt, idx) => {
                    const { cx, cy } = toPx(pt.x, pt.y);
                    const isPos = pt.label > 0;
                    const w = activeRoundData?.sampleWeights[idx] ?? 1 / dataset.length;
                    // Dynamic radius proportional to sample weight: base 3px + up to 10px boost
                    const radius = Math.max(3, Math.min(14, 3 + w * dataset.length * 4));

                    return (
                      <circle
                        key={idx}
                        cx={cx}
                        cy={cy}
                        r={radius}
                        fill={isPos ? '#f97316' : '#38bdf8'}
                        stroke="#000"
                        strokeWidth={1.5}
                        className="transition-all duration-300"
                      />
                    );
                  })}
                </svg>

                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 border border-orange-50/20 text-[10px] font-mono text-neutral-300">
                  Circle radius = Sample weight $w_i$ (Misclassified points swell)
                </div>
              </div>
            </div>

            {/* Metrics Panel */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-4 rounded-lg bg-black/40 border border-orange-50/10 space-y-3">
                <div className="text-xs font-semibold text-neutral-300 uppercase tracking-wider font-mono">
                  Round {safeRound} Parameters
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between text-neutral-400">
                    <span>Stump Split:</span>
                    <span className="text-neutral-200">
                      {activeRoundData?.stump.featureIndex === 0 ? 'X-axis' : 'Y-axis'} at{' '}
                      {activeRoundData?.stump.threshold.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-neutral-400">
                    <span>Weighted Error (ε_t):</span>
                    <span className="text-rose-400 font-bold">
                      {((activeRoundData?.roundError ?? 0) * 100).toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-neutral-400">
                    <span>Stump Weight (α_t):</span>
                    <span className="text-emerald-400 font-bold">
                      {activeRoundData?.alpha.toFixed(3)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-neutral-400 border-t border-neutral-800 pt-2">
                    <span>Cumulative Accuracy:</span>
                    <span className="text-brand font-bold text-sm">
                      {((activeRoundData?.trainingAccuracy ?? 0) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Theory Box */}
              <div className="p-3 rounded-lg bg-black/30 border border-orange-50/10 text-xs text-neutral-400 font-montserrat leading-relaxed">
                Notice how misclassified points swell in radius on the next round. Their increased
                weight forces the subsequent decision stump to focus almost entirely on rectifying
                earlier errors.
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'stacking' && (
        <div className="space-y-6">
          {/* Stacking Pipeline Diagram */}
          <div className="p-5 rounded-lg bg-black/40 border border-orange-50/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300 font-mono">
                Level-0 Base Models to Level-1 Meta Blender
              </span>
              <Badge variant="success">
                OOF Accuracy: {(stackingModel.oofAccuracy * 100).toFixed(1)}%
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-3 border border-orange-50/10 bg-neutral-900/40">
                <div className="text-[11px] font-mono text-neutral-400">Base Learner 1</div>
                <div className="text-xs font-semibold text-neutral-200 mt-0.5">Decision Stump</div>
                <div className="text-[11px] text-neutral-500 mt-1">Inductive Bias: Axis split</div>
                <div className="mt-3">
                  <Slider
                    label="Meta Weight"
                    value={metaW1}
                    min={0}
                    max={100}
                    step={5}
                    unit="%"
                    onChange={setMetaW1}
                  />
                </div>
              </Card>

              <Card className="p-3 border border-orange-50/10 bg-neutral-900/40">
                <div className="text-[11px] font-mono text-neutral-400">Base Learner 2</div>
                <div className="text-xs font-semibold text-neutral-200 mt-0.5">
                  Centroid Separator
                </div>
                <div className="text-[11px] text-neutral-500 mt-1">
                  Inductive Bias: Distance ratio
                </div>
                <div className="mt-3">
                  <Slider
                    label="Meta Weight"
                    value={metaW2}
                    min={0}
                    max={100}
                    step={5}
                    unit="%"
                    onChange={setMetaW2}
                  />
                </div>
              </Card>

              <Card className="p-3 border border-orange-50/10 bg-neutral-900/40">
                <div className="text-[11px] font-mono text-neutral-400">Base Learner 3</div>
                <div className="text-xs font-semibold text-neutral-200 mt-0.5">
                  3-NN Local Voting
                </div>
                <div className="text-[11px] text-neutral-500 mt-1">
                  Inductive Bias: Metric neighbors
                </div>
                <div className="mt-3">
                  <Slider
                    label="Meta Weight"
                    value={metaW3}
                    min={0}
                    max={100}
                    step={5}
                    unit="%"
                    onChange={setMetaW3}
                  />
                </div>
              </Card>
            </div>

            {/* Out-of-fold Leakage Warning */}
            <div className="p-3 rounded bg-black/60 border border-orange-50/10 text-xs text-neutral-300 font-montserrat flex items-start gap-2">
              <Sliders className="size-4 text-orange-200 shrink-0 mt-0.5" />
              <div>
                <strong>Wolpert Stacking Protocol:</strong> The Level-1 meta-features must be
                generated strictly via{' '}
                <span className="text-orange-200">K-Fold Out-of-Fold (OOF) cross-validation</span>.
                If base models predict on the same data they were trained on, the meta-model
                overfits to their training memorization rather than their generalization capacity.
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
