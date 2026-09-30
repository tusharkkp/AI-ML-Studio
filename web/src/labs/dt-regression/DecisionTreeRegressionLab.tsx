import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Badge } from '@/components/ui/Badge';
import { SeededRNG } from '@/utils/rng';
import { TrendingUp, RotateCcw, AlertTriangle, GitBranch } from 'lucide-react';

export interface DataPoint1D {
  x: number;
  y: number;
}

interface RegressionNode {
  isLeaf: boolean;
  value: number; // Mean prediction
  splitVal?: number;
  mse?: number;
  left?: RegressionNode;
  right?: RegressionNode;
  xRange?: [number, number];
}

// Fit CART 1D Regression Tree via recursive variance reduction
function buildRegressionTree(
  data: DataPoint1D[],
  depth: number,
  maxDepth: number,
  xMin: number,
  xMax: number
): RegressionNode {
  const n = data.length;
  if (n === 0) {
    return { isLeaf: true, value: 0, xRange: [xMin, xMax] };
  }

  const mean = data.reduce((acc, d) => acc + d.y, 0) / n;
  const mse = data.reduce((acc, d) => acc + Math.pow(d.y - mean, 2), 0) / n;

  if (depth >= maxDepth || n <= 3 || mse < 1e-4) {
    return { isLeaf: true, value: mean, mse, xRange: [xMin, xMax] };
  }

  // Find best split point x* minimizing weighted child MSE
  let bestSplit = 0.5;
  let bestReduction = -1;
  let bestLeftData: DataPoint1D[] = [];
  let bestRightData: DataPoint1D[] = [];

  // Sort by x
  const sorted = [...data].sort((a, b) => a.x - b.x);

  for (let i = 1; i < n; i++) {
    const splitCand = (sorted[i - 1]!.x + sorted[i]!.x) / 2;
    const left = sorted.filter((d) => d.x <= splitCand);
    const right = sorted.filter((d) => d.x > splitCand);

    if (left.length === 0 || right.length === 0) continue;

    const leftMean = left.reduce((acc, d) => acc + d.y, 0) / left.length;
    const leftMse = left.reduce((acc, d) => acc + Math.pow(d.y - leftMean, 2), 0) / left.length;

    const rightMean = right.reduce((acc, d) => acc + d.y, 0) / right.length;
    const rightMse = right.reduce((acc, d) => acc + Math.pow(d.y - rightMean, 2), 0) / right.length;

    const weightedChildMse = (left.length / n) * leftMse + (right.length / n) * rightMse;
    const reduction = mse - weightedChildMse;

    if (reduction > bestReduction) {
      bestReduction = reduction;
      bestSplit = splitCand;
      bestLeftData = left;
      bestRightData = right;
    }
  }

  if (bestReduction <= 0) {
    return { isLeaf: true, value: mean, mse, xRange: [xMin, xMax] };
  }

  return {
    isLeaf: false,
    value: mean,
    splitVal: bestSplit,
    mse,
    xRange: [xMin, xMax],
    left: buildRegressionTree(bestLeftData, depth + 1, maxDepth, xMin, bestSplit),
    right: buildRegressionTree(bestRightData, depth + 1, maxDepth, bestSplit, xMax),
  };
}

// Predict continuous value from regression tree
function predictTree(node: RegressionNode, x: number): number {
  if (node.isLeaf || node.splitVal === undefined) {
    return node.value;
  }
  if (x <= node.splitVal) {
    return node.left ? predictTree(node.left, x) : node.value;
  }
  return node.right ? predictTree(node.right, x) : node.value;
}

export const DecisionTreeRegressionLab: React.FC = () => {
  const [seed, setSeed] = useState<number>(42);
  const [maxDepth, setMaxDepth] = useState<number>(3);
  const [showLinearBaseline, setShowLinearBaseline] = useState<boolean>(false);
  const [noiseLevel, setNoiseLevel] = useState<number>(0.15);

  // Generate 1D non-linear ground truth dataset: y = sin(2*pi*x) + 0.5*cos(4*pi*x) + noise
  const data: DataPoint1D[] = useMemo(() => {
    const rng = new SeededRNG(seed);
    const n = 50;
    const pts: DataPoint1D[] = [];

    for (let i = 0; i < n; i++) {
      const x = rng.next(); // [0, 1]
      const signal = Math.sin(2 * Math.PI * x) + 0.4 * Math.cos(4 * Math.PI * x);
      const noise = (rng.next() - 0.5) * 2 * noiseLevel;
      pts.push({ x: +x.toFixed(3), y: +(signal + noise).toFixed(3) });
    }

    return pts.sort((a, b) => a.x - b.x);
  }, [seed, noiseLevel]);

  // Train CART regression tree
  const treeRoot = useMemo(() => {
    return buildRegressionTree(data, 0, maxDepth, 0, 1);
  }, [data, maxDepth]);

  // Evaluate predictions & overall MSE
  const metrics = useMemo(() => {
    let sse = 0;
    data.forEach((d) => {
      const pred = predictTree(treeRoot, d.x);
      sse += Math.pow(d.y - pred, 2);
    });
    const mse = sse / data.length;
    const rmse = Math.sqrt(mse);

    // Count leaf nodes
    let leaves = 0;
    function countLeaves(node: RegressionNode) {
      if (node.isLeaf) leaves++;
      else {
        if (node.left) countLeaves(node.left);
        if (node.right) countLeaves(node.right);
      }
    }
    countLeaves(treeRoot);

    return { mse, rmse, leaves };
  }, [data, treeRoot]);

  // Generate dense curve sampling across [0, 1.25] to highlight extrapolation failure
  const plotCurve = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    const steps = 200;
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * 1.25; // Extrapolates beyond training set [0, 1]
      pts.push({ x, y: predictTree(treeRoot, x) });
    }
    return pts;
  }, [treeRoot]);

  // Linear regression baseline: y = mx + c
  const linearBaseline = useMemo(() => {
    const n = data.length;
    const sumX = data.reduce((a, b) => a + b.x, 0);
    const sumY = data.reduce((a, b) => a + b.y, 0);
    const sumXY = data.reduce((a, b) => a + b.x * b.y, 0);
    const sumXX = data.reduce((a, b) => a + b.x * b.x, 0);

    const m = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX || 1);
    const c = (sumY - m * sumX) / n;
    return { m, c };
  }, [data]);

  return (
    <div className="space-y-6">
      {/* Control Toolbar */}
      <Card className="p-6 border-orange-50/15 bg-neutral-900/60 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-orange-50/10 pb-4">
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-lg text-foreground font-manrope">
              CART regression tree variance-reduction studio
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={showLinearBaseline ? 'primary' : 'outline'}
              onClick={() => setShowLinearBaseline((v) => !v)}
              className="text-xs"
            >
              {showLinearBaseline ? 'Hide OLS Linear Line' : 'Show OLS Linear Baseline'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSeed((s) => s + 1)}
              className="flex items-center gap-1.5 text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reseed Data
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
          {/* Max Depth Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-neutral-300 font-semibold uppercase">
                Maximum Tree Depth: {maxDepth}
              </span>
              <Badge
                variant={maxDepth <= 2 ? 'warning' : maxDepth >= 5 ? 'danger' : 'success'}
                size="sm"
              >
                {maxDepth === 1
                  ? 'Underfitting (Stump)'
                  : maxDepth >= 5
                    ? 'Overfitting (Noisy)'
                    : 'Optimal Sweet Spot'}
              </Badge>
            </div>
            <Slider
              label="Tree Depth"
              value={maxDepth}
              min={1}
              max={6}
              step={1}
              onChange={(val) => setMaxDepth(val)}
            />
            <div className="text-[11px] text-neutral-400 font-sans leading-relaxed">
              Depth determines the number of step-wise horizontal partitions ({metrics.leaves}{' '}
              discrete piecewise constant segments).
            </div>
          </div>

          {/* Noise Level Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-neutral-300 font-semibold uppercase">
                Data Noise Level: {(noiseLevel * 100).toFixed(0)}%
              </span>
              <Badge variant="outline" size="sm">
                N = 50 Samples
              </Badge>
            </div>
            <Slider
              label="Noise Sigma"
              value={noiseLevel}
              min={0.05}
              max={0.4}
              step={0.05}
              onChange={(val) => setNoiseLevel(val)}
            />
            <div className="text-[11px] text-neutral-400 font-sans leading-relaxed">
              Observe how deep trees split noise spikes into isolated flat steps, driving training
              error to zero while escalating generalization error.
            </div>
          </div>
        </div>
      </Card>

      {/* Main Visualizer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: 1D Staircase Regression Plot */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5 border-orange-50/15 bg-neutral-900/60">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-semibold text-sm text-foreground font-manrope">
                  Piecewise Constant Step Predictions: f(x)
                </h4>
                <p className="text-xs text-neutral-400 font-montserrat">
                  Notice the step function nature: within each partition leaf, predictions are
                  constant means.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-3 h-0.5 bg-emerald-400 inline-block" />
                  CART Tree ({metrics.leaves} Leaves)
                </span>
                {showLinearBaseline && (
                  <span className="flex items-center gap-1.5 text-blue-400">
                    <span className="w-3 h-0.5 bg-blue-400 inline-block" />
                    OLS Linear
                  </span>
                )}
              </div>
            </div>

            {/* SVG Visualizer */}
            <div className="relative w-full aspect-[16/9] bg-black/40 rounded-xl border border-orange-50/10 p-2 overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 600 320">
                {/* Horizontal Zero Line */}
                <line x1={40} y1={160} x2={560} y2={160} stroke="#3f3f46" strokeWidth={1} />
                <text
                  x={32}
                  y={163}
                  fill="#71717a"
                  fontSize={10}
                  textAnchor="end"
                  fontFamily="monospace"
                >
                  0.0
                </text>

                {/* X Axis Ticks */}
                {[0.0, 0.25, 0.5, 0.75, 1.0, 1.25].map((xVal) => {
                  const sx = 40 + (xVal / 1.25) * 520;
                  return (
                    <g key={`x-${xVal}`}>
                      <line
                        x1={sx}
                        y1={20}
                        x2={sx}
                        y2={290}
                        stroke="#27272a"
                        strokeDasharray="2 2"
                      />
                      <text
                        x={sx}
                        y={305}
                        fill={xVal > 1.0 ? '#f59e0b' : '#71717a'}
                        fontSize={10}
                        textAnchor="middle"
                        fontFamily="monospace"
                        fontWeight={xVal > 1.0 ? 'bold' : 'normal'}
                      >
                        {xVal.toFixed(2)}
                      </text>
                    </g>
                  );
                })}

                {/* Extrapolation Hazard Zone Shade (x > 1.0) */}
                <rect
                  x={40 + (1.0 / 1.25) * 520}
                  y={20}
                  width={(0.25 / 1.25) * 520}
                  height={270}
                  fill="#f59e0b"
                  fillOpacity={0.06}
                />
                <text
                  x={40 + (1.12 / 1.25) * 520}
                  y={40}
                  fill="#f59e0b"
                  fontSize={10}
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  Extrapolation Flat Trap
                </text>

                {/* Data Points */}
                {data.map((d, idx) => {
                  const cx = 40 + (d.x / 1.25) * 520;
                  const cy = 160 - (d.y / 1.8) * 120;
                  return (
                    <circle
                      key={idx}
                      cx={cx}
                      cy={cy}
                      r={3.5}
                      fill="#3b82f6"
                      stroke="#93c5fd"
                      strokeWidth={1}
                      className="cursor-pointer hover:r-5 transition-all"
                    >
                      <title>
                        Sample #{idx + 1}: x={d.x}, y={d.y}
                      </title>
                    </circle>
                  );
                })}

                {/* OLS Linear Regression Baseline Line */}
                {showLinearBaseline && (
                  <line
                    x1={40}
                    y1={160 - (linearBaseline.c / 1.8) * 120}
                    x2={40 + 520}
                    y2={160 - ((linearBaseline.m * 1.25 + linearBaseline.c) / 1.8) * 120}
                    stroke="#60a5fa"
                    strokeWidth={2}
                    strokeDasharray="4 3"
                  />
                )}

                {/* Tree Staircase Path */}
                {plotCurve.length > 1 && (
                  <path
                    d={plotCurve
                      .map((p, idx) => {
                        const sx = 40 + (p.x / 1.25) * 520;
                        const sy = 160 - (p.y / 1.8) * 120;
                        return `${idx === 0 ? 'M' : 'L'} ${sx} ${sy}`;
                      })
                      .join(' ')}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth={2.8}
                  />
                )}
              </svg>
            </div>
          </Card>
        </div>

        {/* Right Col: Mathematical Variance Reduction & Extrapolation Trap */}
        <div className="space-y-4">
          {/* Tree Structure & Error Metrics */}
          <Card className="p-5 border-orange-50/15 bg-neutral-900/60 space-y-4">
            <h4 className="font-semibold text-sm text-foreground font-manrope flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              CART Regression Tree Metrics
            </h4>

            <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
              <div className="p-3 rounded-lg bg-black/30 border border-orange-50/10">
                <div className="text-[10px] text-neutral-400 uppercase font-semibold">
                  Mean Squared Error
                </div>
                <div className="text-xl font-bold text-cream my-0.5">{metrics.mse.toFixed(4)}</div>
                <div className="text-[10px] text-neutral-500">RMSE: {metrics.rmse.toFixed(3)}</div>
              </div>

              <div className="p-3 rounded-lg bg-black/30 border border-orange-50/10">
                <div className="text-[10px] text-neutral-400 uppercase font-semibold">
                  Terminal Leaves
                </div>
                <div className="text-xl font-bold text-emerald-300 my-0.5">{metrics.leaves}</div>
                <div className="text-[10px] text-neutral-500">Step Partitions</div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-orange-50/10 text-xs font-sans">
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Split Criterion:</span>
                <span className="font-mono font-semibold text-neutral-200">
                  Variance Reduction (MSE)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Leaf Estimator:</span>
                <span className="font-mono font-semibold text-cream">
                  Local Partition Mean (ȳ_m)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Continuity:</span>
                <span className="font-mono font-semibold text-yellow-400">
                  Discontinuous (C⁰ Non-smooth)
                </span>
              </div>
            </div>
          </Card>

          {/* Extrapolation Hazard Callout */}
          <Card className="p-4 border-amber-500/20 bg-amber-950/20 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 text-amber-300 font-semibold font-manrope">
              <AlertTriangle className="w-4 h-4" />
              The Decision Tree Extrapolation Trap
            </div>
            <p className="text-[11px] text-neutral-300 font-montserrat leading-relaxed">
              Observe the region where <code className="text-cream font-mono">x &gt; 1.0</code>:
              tree models cannot extrapolate trends. Any query beyond training range simply hits the
              outermost leaf's mean, outputting a completely flat horizontal line regardless of
              underlying exponential or linear growth!
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
