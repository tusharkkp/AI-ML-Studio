import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Badge } from '@/components/ui/Badge';
import { SeededRNG } from '@/utils/rng';
import {
  fitRidge,
  fitLasso,
  fitElasticNet,
  computeRegularizationPath,
} from '@/engines/regression/regularization';

const FEATURE_NAMES = [
  'X1 (True Signal A)',
  'X2 (Collinear with X1)',
  'X3 (Moderate Signal B)',
  'X4 (Weak Signal C)',
  'X5 (Pure Noise)',
];

export const RegularizationLab: React.FC = () => {
  const [modelType, setModelType] = useState<'ridge' | 'lasso' | 'elasticnet'>('lasso');
  const [logAlpha, setLogAlpha] = useState<number>(0); // 10^0 = 1.0
  const [l1Ratio, setL1Ratio] = useState<number>(0.5);
  const [activeTab, setActiveTab] = useState<'trace' | 'geometry'>('trace');
  const [seed, setSeed] = useState<number>(101);

  const alpha = Math.pow(10, logAlpha);

  // Generate synthetic dataset with collinearity and noise
  const { X, y } = useMemo(() => {
    const rng = new SeededRNG(seed);
    const m = 35;
    const xMat: number[][] = [];
    const yVec: number[] = [];

    for (let i = 0; i < m; i++) {
      const x1 = (rng.next() - 0.5) * 4;
      // x2 is strongly collinear with x1 + small jitter
      const x2 = 0.92 * x1 + (rng.next() - 0.5) * 0.4;
      const x3 = (rng.next() - 0.5) * 4;
      const x4 = (rng.next() - 0.5) * 4;
      // x5 is pure Gaussian-like noise
      const x5 = (rng.next() - 0.5) * 4;

      // Ground truth target: y = 3.0*x1 + 0.0*x2 + 2.0*x3 - 0.8*x4 + 0.0*x5 + noise
      const noise = (rng.next() - 0.5) * 1.5;
      const target = 3.0 * x1 + 2.0 * x3 - 0.8 * x4 + noise;

      xMat.push([x1, x2, x3, x4, x5]);
      yVec.push(target);
    }

    return { X: xMat, y: yVec };
  }, [seed]);

  // Fit current model
  const fitResult = useMemo(() => {
    if (modelType === 'ridge') {
      return fitRidge(X, y, { alpha });
    } else if (modelType === 'lasso') {
      return fitLasso(X, y, { alpha, maxIterations: 500 });
    } else {
      return fitElasticNet(X, y, { alpha, l1Ratio, maxIterations: 500 });
    }
  }, [X, y, modelType, alpha, l1Ratio]);

  // Compute full shrinkage trace across 40 log-spaced alphas from 10^-3 to 10^2
  const tracePoints = useMemo(() => {
    const alphas: number[] = [];
    for (let exp = -3.0; exp <= 2.2; exp += 0.15) {
      alphas.push(Math.pow(10, exp));
    }
    return computeRegularizationPath(X, y, modelType, alphas, l1Ratio);
  }, [X, y, modelType, l1Ratio]);

  // Colors for each feature line
  const featureColors = ['#f59e0b', '#38bdf8', '#10b981', '#a855f7', '#ef4444'];

  // SVG dimensions for trace plot
  const svgWidth = 540;
  const svgHeight = 260;
  const pad = { top: 20, right: 30, bottom: 35, left: 45 };
  const innerW = svgWidth - pad.left - pad.right;
  const innerH = svgHeight - pad.top - pad.bottom;
  const minLogA = -3.0;
  const maxLogA = 2.2;
  const maxCoeffY = 4.0;
  const minCoeffY = -2.5;

  return (
    <Card className="border-stone-800 bg-stone-950/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-lg font-semibold text-stone-100">
              Regularization Studio: Ridge, Lasso & Elastic Net
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Explore parameter shrinkage paths, sparsity induction, and L1 vs L2 geometric
              constraint boundaries
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSeed((s) => s + 13)}
              className="text-xs border-stone-800"
            >
              Reseed Data
            </Button>
          </div>
        </div>

        {/* Top Controls & Model Selector */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-b border-stone-800/80">
          <div className="flex items-center gap-1.5">
            <Button
              variant={modelType === 'ridge' ? 'primary' : 'outline'}
              size="sm"
              className="h-7 px-3 text-xs border-stone-800"
              onClick={() => setModelType('ridge')}
            >
              Ridge (L2)
            </Button>
            <Button
              variant={modelType === 'lasso' ? 'primary' : 'outline'}
              size="sm"
              className="h-7 px-3 text-xs border-stone-800"
              onClick={() => setModelType('lasso')}
            >
              Lasso (L1)
            </Button>
            <Button
              variant={modelType === 'elasticnet' ? 'primary' : 'outline'}
              size="sm"
              className="h-7 px-3 text-xs border-stone-800"
              onClick={() => setModelType('elasticnet')}
            >
              Elastic Net (L1+L2)
            </Button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('trace')}
              className={`px-3 py-1 text-xs font-mono border-b-2 transition-colors ${
                activeTab === 'trace'
                  ? 'border-amber-400 text-amber-300 font-semibold'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              Shrinkage Trace Path
            </button>
            <button
              onClick={() => setActiveTab('geometry')}
              className={`px-3 py-1 text-xs font-mono border-b-2 transition-colors ${
                activeTab === 'geometry'
                  ? 'border-amber-400 text-amber-300 font-semibold'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              L1/L2 Constraint Geometry
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-3">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg border border-stone-800/80 bg-stone-900/60">
            <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
              Penalty Strength (α)
            </div>
            <div className="mt-1 font-mono text-base font-bold text-amber-400">
              {alpha < 0.01 ? alpha.toExponential(2) : alpha.toFixed(3)}
            </div>
            <div className="text-[10px] text-stone-500 font-mono">10^({logAlpha.toFixed(2)})</div>
          </div>

          <div className="p-3 rounded-lg border border-stone-800/80 bg-stone-900/60">
            <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
              Sparsity (Zero Weights)
            </div>
            <div className="mt-1 font-mono text-base font-bold text-emerald-400">
              {fitResult.numZeroCoefficients} of 5 Pruned
            </div>
            <div className="text-[10px] text-stone-500 font-mono">
              {5 - fitResult.numZeroCoefficients} Active Predictors
            </div>
          </div>

          <div className="p-3 rounded-lg border border-stone-800/80 bg-stone-900/60">
            <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
              Model Fit (R²)
            </div>
            <div
              className={`mt-1 font-mono text-base font-bold ${
                fitResult.r2 >= 0.8
                  ? 'text-emerald-400'
                  : fitResult.r2 >= 0.4
                    ? 'text-amber-400'
                    : 'text-red-400'
              }`}
            >
              {fitResult.r2.toFixed(3)}
            </div>
            <div className="text-[10px] text-stone-500 font-mono">Explained Variance</div>
          </div>

          <div className="p-3 rounded-lg border border-stone-800/80 bg-stone-900/60">
            <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
              Mean Squared Error
            </div>
            <div className="mt-1 font-mono text-base font-bold text-stone-200">
              {fitResult.mse.toFixed(3)}
            </div>
            <div className="text-[10px] text-stone-500 font-mono">
              Cost: {fitResult.penaltyCost.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Main Visualizer Area */}
        {activeTab === 'trace' ? (
          <div className="rounded-lg border border-stone-800/80 bg-stone-900/40 p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-mono text-stone-300">
                Regularization Trace Path: Parameter Weights θ_j vs log₁₀(α)
              </span>
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono">
                {FEATURE_NAMES.map((name, idx) => (
                  <span
                    key={idx}
                    className="flex items-center gap-1.5"
                    style={{ color: featureColors[idx] }}
                  >
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: featureColors[idx] }}
                    />
                    {name.split(' ')[0]}
                  </span>
                ))}
              </div>
            </div>

            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto">
              <rect width={svgWidth} height={svgHeight} fill="#0c0a09" rx={6} />
              {/* Horizontal zero line */}
              {(() => {
                const zeroY =
                  pad.top + innerH - ((0 - minCoeffY) / (maxCoeffY - minCoeffY)) * innerH;
                return (
                  <line
                    x1={pad.left}
                    y1={zeroY}
                    x2={pad.left + innerW}
                    y2={zeroY}
                    stroke="#57534e"
                    strokeWidth={1}
                    strokeDasharray="3 3"
                  />
                );
              })()}

              {/* Grid lines */}
              {[0.25, 0.5, 0.75].map((ratio) => (
                <line
                  key={ratio}
                  x1={pad.left + ratio * innerW}
                  y1={pad.top}
                  x2={pad.left + ratio * innerW}
                  y2={pad.top + innerH}
                  stroke="#1c1917"
                  strokeDasharray="2 2"
                />
              ))}

              {/* Trace Curves for each of the 5 features */}
              {[0, 1, 2, 3, 4].map((featureIdx) => {
                const pathD = tracePoints
                  .map((pt, i) => {
                    const logA = Math.log10(pt.alpha);
                    const cx = pad.left + ((logA - minLogA) / (maxLogA - minLogA)) * innerW;
                    const cVal = pt.coefficients[featureIdx] ?? 0;
                    const clampedVal = Math.max(minCoeffY, Math.min(maxCoeffY, cVal));
                    const cy =
                      pad.top +
                      innerH -
                      ((clampedVal - minCoeffY) / (maxCoeffY - minCoeffY)) * innerH;
                    return `${i === 0 ? 'M' : 'L'} ${cx} ${cy}`;
                  })
                  .join(' ');

                return (
                  <path
                    key={featureIdx}
                    d={pathD}
                    fill="none"
                    stroke={featureColors[featureIdx]}
                    strokeWidth={2}
                    opacity={0.88}
                  />
                );
              })}

              {/* Vertical cursor for current alpha */}
              {(() => {
                const curX = pad.left + ((logAlpha - minLogA) / (maxLogA - minLogA)) * innerW;
                return (
                  <g>
                    <line
                      x1={curX}
                      y1={pad.top}
                      x2={curX}
                      y2={pad.top + innerH}
                      stroke="#f59e0b"
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                    />
                    {fitResult.coefficients.map((c, idx) => {
                      const cy =
                        pad.top + innerH - ((c - minCoeffY) / (maxCoeffY - minCoeffY)) * innerH;
                      return (
                        <circle
                          key={idx}
                          cx={curX}
                          cy={cy}
                          r={4}
                          fill={featureColors[idx]}
                          stroke="#ffffff"
                          strokeWidth={1.5}
                        />
                      );
                    })}
                  </g>
                );
              })()}

              {/* Axes Labels */}
              <text
                x={pad.left}
                y={pad.top + innerH + 22}
                fill="#78716c"
                fontSize={10}
                fontFamily="monospace"
              >
                log₁₀(α): -3.0 (Weak) ⟶ +2.2 (Heavy Regularization)
              </text>
              <text
                x={-pad.top - innerH / 2}
                y={18}
                fill="#78716c"
                fontSize={10}
                fontFamily="monospace"
                transform="rotate(-90)"
                textAnchor="middle"
              >
                Weight θ_j
              </text>
            </svg>
          </div>
        ) : (
          <div className="rounded-lg border border-stone-800/80 bg-stone-900/40 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-stone-300">
                Geometric Constraint Geometry: Loss Contours & Penalty Ball
              </span>
              <span className="text-xs font-mono text-amber-400">
                {modelType === 'lasso'
                  ? 'L1 Diamond (Sharp Corners on Axes → Sparsity)'
                  : modelType === 'ridge'
                    ? 'L2 Sphere (Smooth Boundary → Dense Shrinkage)'
                    : 'Elastic Net Polytope (Rounded Diamond)'}
              </span>
            </div>

            <svg viewBox="0 0 540 260" className="w-full h-auto">
              <rect width="540" height="260" fill="#0c0a09" rx={6} />
              {/* Axes crossing at center (270, 130) */}
              <line x1="60" y1="130" x2="480" y2="130" stroke="#292524" strokeWidth="1.5" />
              <line x1="270" y1="20" x2="270" y2="240" stroke="#292524" strokeWidth="1.5" />
              <text x="470" y="145" fill="#78716c" fontSize="10" fontFamily="monospace">
                θ₁
              </text>
              <text x="280" y="32" fill="#78716c" fontSize="10" fontFamily="monospace">
                θ₂
              </text>

              {/* OLS Unconstrained Optimum point at (380, 60) */}
              <circle cx="380" cy="60" r="5" fill="#f59e0b" />
              <text x="390" y="64" fill="#f59e0b" fontSize="11" fontFamily="monospace">
                θ_OLS
              </text>

              {/* Elliptical Loss Contours centered at (380, 60) */}
              <ellipse
                cx="380"
                cy="60"
                rx="45"
                ry="25"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.6"
                transform="rotate(-25 380 60)"
              />
              <ellipse
                cx="380"
                cy="60"
                rx="90"
                ry="50"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.6"
                transform="rotate(-25 380 60)"
              />
              <ellipse
                cx="380"
                cy="60"
                rx="135"
                ry="75"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1.2"
                strokeDasharray="3 3"
                opacity="0.8"
                transform="rotate(-25 380 60)"
              />

              {/* Constraint boundary at center */}
              {modelType === 'lasso' && (
                <g>
                  {/* L1 Rhombus / Diamond centered at (270, 130) */}
                  <polygon
                    points="270,60 340,130 270,200 200,130"
                    fill="rgba(16, 185, 129, 0.12)"
                    stroke="#10b981"
                    strokeWidth="2"
                  />
                  {/* Contact point on the axis corner: (340, 130) => theta_2 = 0! */}
                  <circle cx="340" cy="130" r="6" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                  <text
                    x="345"
                    y="125"
                    fill="#10b981"
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    Touchpoint: θ₂ = 0 (Sparse)
                  </text>
                </g>
              )}

              {modelType === 'ridge' && (
                <g>
                  {/* L2 Circle centered at (270, 130) */}
                  <circle
                    cx="270"
                    cy="130"
                    r="70"
                    fill="rgba(56, 189, 248, 0.12)"
                    stroke="#38bdf8"
                    strokeWidth="2"
                  />
                  {/* Contact point on curved surface: (328, 88) => both non-zero */}
                  <circle cx="328" cy="88" r="6" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
                  <text
                    x="335"
                    y="85"
                    fill="#38bdf8"
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    Touchpoint: θ₁, θ₂ ≠ 0 (Dense)
                  </text>
                </g>
              )}

              {modelType === 'elasticnet' && (
                <g>
                  {/* Elastic Net rounded diamond */}
                  <path
                    d="M 270 65 C 310 90, 310 90, 335 130 C 310 170, 310 170, 270 195 C 230 170, 230 170, 205 130 C 230 90, 230 90, 270 65 Z"
                    fill="rgba(168, 85, 247, 0.12)"
                    stroke="#a855f7"
                    strokeWidth="2"
                  />
                  <circle cx="335" cy="130" r="6" fill="#a855f7" stroke="#ffffff" strokeWidth="2" />
                  <text
                    x="340"
                    y="125"
                    fill="#a855f7"
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    Balanced Sparsity & Grouping
                  </text>
                </g>
              )}
            </svg>
          </div>
        )}

        {/* Sliders & Parameter Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/30 p-4 rounded-lg border border-stone-800/80">
          <div className="space-y-3">
            <Slider
              label={`Regularization Penalty log₁₀(α): ${logAlpha.toFixed(2)} (α = ${alpha.toFixed(3)})`}
              min={-3.0}
              max={2.0}
              step={0.1}
              value={logAlpha}
              onChange={setLogAlpha}
            />

            {modelType === 'elasticnet' && (
              <Slider
                label={`Elastic Net L1 Ratio (ρ): ${l1Ratio.toFixed(2)} (${(l1Ratio * 100).toFixed(0)}% Lasso, ${((1 - l1Ratio) * 100).toFixed(0)}% Ridge)`}
                min={0.0}
                max={1.0}
                step={0.05}
                value={l1Ratio}
                onChange={setL1Ratio}
              />
            )}
          </div>

          {/* Current Parameter Weights Table */}
          <div className="space-y-1.5 font-mono text-xs">
            <div className="text-stone-400 flex justify-between border-b border-stone-800 pb-1">
              <span>Predictor Feature</span>
              <span>Coefficient θ_j</span>
            </div>
            {FEATURE_NAMES.map((name, i) => {
              const val = fitResult.coefficients[i] ?? 0;
              const isZero = Math.abs(val) < 1e-4;
              return (
                <div key={i} className="flex items-center justify-between py-0.5">
                  <span className="flex items-center gap-2">
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: featureColors[i] }}
                    />
                    <span className="text-stone-300">{name}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${isZero ? 'text-stone-600' : 'text-stone-100'}`}>
                      {val.toFixed(3)}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-[9px] px-1.5 py-0 ${
                        isZero
                          ? 'border-stone-800 text-stone-500'
                          : 'border-emerald-500/40 text-emerald-400'
                      }`}
                    >
                      {isZero ? 'Zeroed' : 'Active'}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Regularization Takeaways Callout */}
        <div className="p-3.5 rounded-lg border border-amber-500/20 bg-amber-500/5 text-xs text-stone-300 space-y-1.5">
          <div className="font-semibold text-stone-200 flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] border-amber-500/40 text-amber-300">
              Theoretical Insight
            </Badge>
            {modelType === 'ridge'
              ? 'Ridge (L2) Shrinkage Dynamics'
              : modelType === 'lasso'
                ? 'Lasso (L1) Sparsity & Feature Selection'
                : 'Elastic Net (L1+L2) Grouping Property'}
          </div>
          <p className="leading-relaxed">
            {modelType === 'ridge' &&
              'Ridge adds an L2 penalty ||θ||₂². Notice how as α increases, all 5 coefficients shrink smoothly towards 0, but none ever become strictly 0. Collinear features X1 and X2 share credit and shrink together.'}
            {modelType === 'lasso' &&
              'Lasso adds an L1 penalty ||θ||₁. Because the L1 constraint has sharp corners on the coordinate axes (see Geometry tab), elliptical loss contours intersect the axis first, driving noise feature X5 and collinear feature X2 to exactly 0.0.'}
            {modelType === 'elasticnet' &&
              'Elastic Net balances L1 sparsity with L2 grouping. When multiple features are strongly correlated (like X1 and X2), Lasso arbitrarily discards one; Elastic Net retains both with reduced coefficients while still zeroing out pure noise X5.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
