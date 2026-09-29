import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { SeededRNG } from '@/utils/rng';
import {
  trainRandomForest,
  trainDecisionTree,
  predictTree,
  predictRandomForest,
  generateEnsembleBoundaryGrid,
} from '@/engines/ensemble/forest/engine';
import type { Point2D } from '@/engines/ensemble/forest/types';
import { RotateCcw, AlertCircle, Activity } from 'lucide-react';

export function RandomForestLab() {
  const [numTrees, setNumTrees] = useState<number>(12);
  const [maxDepth, setMaxDepth] = useState<number>(4);
  const [featureSubspaceSize, setFeatureSubspaceSize] = useState<number>(1); // 1 or 2
  const [noise, setNoise] = useState<number>(0.2);
  const [viewMode, setViewMode] = useState<'forest' | 'single'>('forest');
  const [seed, setSeed] = useState<number>(42);

  // Synthesize 2D dataset with SeededRNG
  const dataset = useMemo(() => {
    const rng = new SeededRNG(seed);
    const points: Point2D[] = [];
    const n = 50;

    // Cluster 1: Center around (-1, -0.5)
    for (let i = 0; i < n; i++) {
      const angle = rng.next() * Math.PI;
      const r = 1.2 + rng.nextFloat(-noise, noise);
      points.push({
        x: Math.cos(angle) * r - 0.5,
        y: Math.sin(angle) * r - 0.2,
        label: -1,
      });
    }

    // Cluster 2: Intertwined center around (0.5, 0.5)
    for (let i = 0; i < n; i++) {
      const angle = rng.next() * Math.PI + Math.PI;
      const r = 1.2 + rng.nextFloat(-noise, noise);
      points.push({
        x: Math.cos(angle) * r + 0.5,
        y: Math.sin(angle) * r + 0.5,
        label: 1,
      });
    }

    return points;
  }, [seed, noise]);

  // Train models
  const { forestModel, singleTree, boundaryGrid } = useMemo(() => {
    const forest = trainRandomForest(dataset, {
      numTrees,
      maxDepth,
      featureSubspaceSize,
      seed,
    });

    const rngSingle = new SeededRNG(seed + 10);
    const single = trainDecisionTree(dataset, maxDepth, 2, rngSingle);

    const grid = generateEnsembleBoundaryGrid(
      (pt) =>
        viewMode === 'forest'
          ? predictRandomForest(forest, pt)
          : { prediction: predictTree(single, pt) },
      -2.5,
      2.5,
      -2.5,
      2.5,
      28
    );

    return { forestModel: forest, singleTree: single, boundaryGrid: grid };
  }, [dataset, numTrees, maxDepth, featureSubspaceSize, seed, viewMode]);

  // Compute training accuracy
  const trainAcc = useMemo(() => {
    let correct = 0;
    for (const pt of dataset) {
      const pred =
        viewMode === 'forest'
          ? predictRandomForest(forestModel, [pt.x, pt.y]).prediction
          : predictTree(singleTree, [pt.x, pt.y]);
      if (pred === pt.label) correct++;
    }
    return correct / dataset.length;
  }, [dataset, forestModel, singleTree, viewMode]);

  // Canvas bounds
  const xMin = -2.5;
  const xMax = 2.5;
  const yMin = -2.5;
  const yMax = 2.5;
  const width = 360;
  const height = 300;

  const toPx = (x: number, y: number) => ({
    cx: ((x - xMin) / (xMax - xMin)) * width,
    cy: height - ((y - yMin) / (yMax - yMin)) * height,
  });

  return (
    <Card className="p-6 border border-orange-50/15 bg-neutral-900/50 backdrop-blur-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-orange-50/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded border border-orange-50/20 bg-black/40 text-[10px] font-mono font-bold text-orange-200">
              LAB
            </span>
            <h3 className="font-manrope text-lg font-semibold text-foreground dark:text-white">
              Random forest bagging & subspace explorer
            </h3>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5 font-montserrat">
            Watch random feature subspace sampling convert brittle staircases into smooth
            probability boundaries.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-0.5 rounded-lg border border-orange-50/15 bg-black/40 text-xs">
            <button
              onClick={() => setViewMode('forest')}
              className={`px-3 py-1 rounded-md transition-colors ${
                viewMode === 'forest'
                  ? 'bg-neutral-800 text-white font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Random Forest ({numTrees} Trees)
            </button>
            <button
              onClick={() => setViewMode('single')}
              className={`px-3 py-1 rounded-md transition-colors ${
                viewMode === 'single'
                  ? 'bg-neutral-800 text-white font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Single Deep Tree
            </button>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSeed((s) => s + 7)}
            className="flex items-center gap-1.5 text-xs"
          >
            <RotateCcw className="size-3" />
            <span>New Dataset</span>
          </Button>
        </div>
      </div>

      {/* Main Grid: Controls + Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Sliders */}
        <div className="lg:col-span-5 space-y-5">
          <Slider
            label="Forest Size (M Trees)"
            value={numTrees}
            min={1}
            max={30}
            step={1}
            unit=" trees"
            onChange={setNumTrees}
            helperText="Number of decorrelated bootstrap trees in ensemble"
          />

          <Slider
            label="Max Tree Depth"
            value={maxDepth}
            min={1}
            max={8}
            step={1}
            onChange={setMaxDepth}
            helperText="Individual tree capacity: 1 = stump, 8 = deep partition"
          />

          <Slider
            label="Random Feature Subspace (m)"
            value={featureSubspaceSize}
            min={1}
            max={2}
            step={1}
            unit=" features"
            onChange={setFeatureSubspaceSize}
            helperText="m = 1 forces random feature sampling (Breiman's Forest); m = 2 standard bagging"
          />

          <Slider
            label="Data Noise & Overlap"
            value={Math.round(noise * 100)}
            min={5}
            max={50}
            step={5}
            unit="%"
            onChange={(val) => setNoise(val / 100)}
            helperText="Level of class interpenetration & stochastic jitter"
          />

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded bg-black/40 border border-orange-50/10">
              <div className="text-[10px] font-mono text-neutral-400 uppercase">
                Training Accuracy
              </div>
              <div className="text-xl font-bold font-manrope text-neutral-200 mt-0.5">
                {(trainAcc * 100).toFixed(1)}%
              </div>
            </div>

            <div className="p-3 rounded bg-black/40 border border-orange-50/10">
              <div className="text-[10px] font-mono text-neutral-400 uppercase">
                {viewMode === 'forest' ? 'Out-Of-Bag (OOB) Error' : 'OOB Metric'}
              </div>
              <div className="text-xl font-bold font-manrope text-brand mt-0.5">
                {viewMode === 'forest'
                  ? `${(forestModel.finalOobError * 100).toFixed(1)}%`
                  : 'N/A (No Ensemble)'}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 2D Visualizer */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative border border-orange-50/15 rounded-lg overflow-hidden bg-black/70 shadow-none">
            {/* SVG Decision Region Heatmap & Points */}
            <svg width={width} height={height} className="block">
              {/* Render background grid rectangles */}
              {boundaryGrid.grid.map((row, r) => {
                const rectH = height / boundaryGrid.resolution;
                return row.map((val, c) => {
                  const rectW = width / boundaryGrid.resolution;
                  const prob = boundaryGrid.probabilities[r]![c]!;
                  // Color gradient from blue/slate (-1) to orange/amber (+1)
                  const fill =
                    val > 0
                      ? `rgba(249, 115, 22, ${Math.max(0.12, prob * 0.45)})`
                      : `rgba(59, 130, 246, ${Math.max(0.12, (1 - prob) * 0.45)})`;

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

              {/* Data points */}
              {dataset.map((pt, idx) => {
                const { cx, cy } = toPx(pt.x, pt.y);
                const isPos = pt.label > 0;
                return (
                  <circle
                    key={idx}
                    cx={cx}
                    cy={cy}
                    r={3.5}
                    fill={isPos ? '#f97316' : '#38bdf8'}
                    stroke="#000"
                    strokeWidth={1}
                  />
                );
              })}
            </svg>

            {/* Overlay mode badge */}
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 border border-orange-50/20 text-[10px] font-mono text-neutral-300">
              {viewMode === 'forest'
                ? `Random Forest (M = ${numTrees}, m = ${featureSubspaceSize})`
                : `Single Decision Tree (Depth = ${maxDepth})`}
            </div>
          </div>

          {/* OOB Error Convergence Curve (for Forest) */}
          {viewMode === 'forest' && (
            <div className="w-full mt-4 p-3 rounded-lg bg-black/40 border border-orange-50/10">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-mono text-neutral-400 flex items-center gap-1.5">
                  <Activity className="size-3 text-brand" />
                  <span>Out-of-Bag (OOB) error vs tree count (1 → {numTrees})</span>
                </span>
                <span className="font-mono text-neutral-300 text-[11px]">
                  Final: {(forestModel.finalOobError * 100).toFixed(1)}%
                </span>
              </div>

              {/* Sparkline */}
              <div className="flex items-end gap-1 h-8 pt-1">
                {forestModel.oobErrors.map((err, idx) => {
                  const barH = Math.max(3, Math.min(28, err * 60));
                  return (
                    <div
                      key={idx}
                      className="flex-1 bg-brand/50 hover:bg-brand transition-colors rounded-t"
                      style={{ height: `${barH}px` }}
                      title={`Tree ${idx + 1}: OOB Error ${(err * 100).toFixed(1)}%`}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Failure mode presets */}
      <div className="p-4 rounded-lg bg-black/30 border border-orange-50/10 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-neutral-400">
          <AlertCircle className="size-4 text-orange-200" />
          <span>Quick verification presets:</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setNumTrees(1);
              setMaxDepth(8);
              setViewMode('single');
            }}
            className="text-[11px] py-1"
          >
            Extreme Overfitting (1 Deep Tree)
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setNumTrees(25);
              setMaxDepth(5);
              setFeatureSubspaceSize(1);
              setViewMode('forest');
            }}
            className="text-[11px] py-1"
          >
            Robust Decorrelated Forest (25 Trees)
          </Button>
        </div>
      </div>
    </Card>
  );
}
