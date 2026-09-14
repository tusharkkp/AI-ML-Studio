import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Badge } from '@/components/ui/Badge';
import { SeededRNG } from '@/utils/rng';

interface Point2D {
  id: number;
  x: number;
  y: number;
  isOutlier: boolean;
}

// Approximate inverse normal cumulative distribution function (Acklam/Hastings)
function probit(p: number): number {
  if (p <= 0) return -3.5;
  if (p >= 1) return 3.5;

  const a = [
    -3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.38357751867269e2,
    -3.066479806614716e1, 2.506628277459239,
  ];
  const b = [
    -5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1,
    -1.328068155288572e1,
  ];
  const c = [
    -7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734,
    4.374664141464968, 2.938163982698783,
  ];
  const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];

  const q = p - 0.5;
  if (Math.abs(q) <= 0.42) {
    const r = q * q;
    return (
      (q * (((((a[0]! * r + a[1]!) * r + a[2]!) * r + a[3]!) * r + a[4]!) * r + a[5]!)) /
      (((((b[0]! * r + b[1]!) * r + b[2]!) * r + b[3]!) * r + b[4]!) * r + 1.0)
    );
  }

  const r = p < 0.5 ? p : 1.0 - p;
  const s = Math.sqrt(-Math.log(r));
  let x =
    (((((c[0]! * s + c[1]!) * s + c[2]!) * s + c[3]!) * s + c[4]!) * s + c[5]!) /
    ((((d[0]! * s + d[1]!) * s + d[2]!) * s + d[3]!) * s + 1.0);
  if (p < 0.5) x = -x;
  return Math.max(-3.5, Math.min(3.5, x));
}

export const RegressionMetricsLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'residuals' | 'qq'>('metrics');
  const [noiseLevel, setNoiseLevel] = useState<number>(8);
  const [outlierCount, setOutlierCount] = useState<number>(0);
  const [outlierMagnitude, setOutlierMagnitude] = useState<number>(4);
  const [modelType, setModelType] = useState<'ols' | 'baseline' | 'poor'>('ols');
  const [heteroscedastic, setHeteroscedastic] = useState<boolean>(false);
  const [randomSeed, setRandomSeed] = useState<number>(42);

  // Generate synthetic points
  const points = useMemo(() => {
    const rng = new SeededRNG(randomSeed);
    const n = 28;
    const pts: Point2D[] = [];

    for (let i = 0; i < n; i++) {
      const x = 5 + (i / (n - 1)) * 90; // x from 5 to 95
      // Base linear relationship: y = 15 + 0.85 * x + noise
      const varianceMultiplier = heteroscedastic ? 0.3 + (x / 95) * 1.8 : 1.0;
      const noise = (rng.next() - 0.5) * 2 * noiseLevel * varianceMultiplier;
      const y = Math.max(2, 15 + 0.85 * x + noise);
      pts.push({ id: i, x, y, isOutlier: false });
    }

    // Inject outliers if requested
    if (outlierCount > 0) {
      const outlierIndices = [7, 18, 24].slice(0, outlierCount);
      outlierIndices.forEach((idx, i) => {
        if (pts[idx]) {
          const sign = i % 2 === 0 ? 1 : -1;
          const shift = sign * outlierMagnitude * noiseLevel * 1.8;
          pts[idx] = {
            ...pts[idx],
            y: Math.max(5, pts[idx].y + shift),
            isOutlier: true,
          };
        }
      });
    }

    return pts;
  }, [randomSeed, noiseLevel, outlierCount, outlierMagnitude, heteroscedastic]);

  // Compute model parameters (slope and intercept)
  const { slope, intercept } = useMemo(() => {
    const n = points.length;
    if (n === 0) return { slope: 0, intercept: 0 };

    const meanY = points.reduce((acc, p) => acc + p.y, 0) / n;
    const meanX = points.reduce((acc, p) => acc + p.x, 0) / n;

    if (modelType === 'baseline') {
      // Horizontal baseline model: y_hat = y_bar
      return { slope: 0, intercept: meanY };
    }

    if (modelType === 'poor') {
      // Inverted slope fit to deliberately demonstrate negative R^2
      return { slope: -0.6, intercept: 85 };
    }

    // Standard OLS closed form fit
    let num = 0;
    let den = 0;
    for (const p of points) {
      num += (p.x - meanX) * (p.y - meanY);
      den += (p.x - meanX) * (p.x - meanX);
    }
    const sl = den === 0 ? 0 : num / den;
    const intc = meanY - sl * meanX;
    return { slope: sl, intercept: intc };
  }, [points, modelType]);

  // Compute metrics and residual array
  const {
    mse,
    rmse,
    mae,
    mape,
    r2,
    adjR2,
    maxError,
    residuals,
    fittedValues,
    standardizedResiduals,
  } = useMemo(() => {
    const n = points.length;
    if (n === 0) {
      return {
        mse: 0,
        rmse: 0,
        mae: 0,
        mape: 0,
        r2: 0,
        adjR2: 0,
        maxError: 0,
        residuals: [],
        fittedValues: [],
        standardizedResiduals: [],
      };
    }

    let sse = 0;
    let sae = 0;
    let sumPctErr = 0;
    let sumY = 0;
    let maxE = 0;
    const res: number[] = [];
    const fits: number[] = [];

    for (const p of points) {
      const yHat = intercept + slope * p.x;
      const e = p.y - yHat;
      const absE = Math.abs(e);

      fits.push(yHat);
      res.push(e);
      sse += e * e;
      sae += absE;
      if (p.y !== 0) {
        sumPctErr += (absE / Math.abs(p.y)) * 100;
      }
      sumY += p.y;
      if (absE > maxE) maxE = absE;
    }

    const meanY = sumY / n;
    let sst = 0;
    for (const p of points) {
      const diff = p.y - meanY;
      sst += diff * diff;
    }

    const calcMse = sse / n;
    const calcRmse = Math.sqrt(calcMse);
    const calcMae = sae / n;
    const calcMape = sumPctErr / n;
    const calcR2 = sst === 0 ? 1 : 1 - sse / sst;
    // Adjusted R^2 for p = 1 predictor: 1 - ((1 - R^2)(n - 1) / (n - 1 - 1))
    const pCount = 1;
    const calcAdjR2 = n > pCount + 1 ? 1 - ((1 - calcR2) * (n - 1)) / (n - pCount - 1) : calcR2;

    // Standardized residuals: e_std = (e - mean(e)) / std(e)
    const meanRes = res.reduce((a, b) => a + b, 0) / n;
    const varRes = res.reduce((a, b) => a + (b - meanRes) ** 2, 0) / (n - 1 || 1);
    const stdRes = Math.sqrt(varRes) || 1;
    const stdResiduals = res.map((e) => (e - meanRes) / stdRes);

    return {
      mse: calcMse,
      rmse: calcRmse,
      mae: calcMae,
      mape: calcMape,
      r2: calcR2,
      adjR2: calcAdjR2,
      maxError: maxE,
      residuals: res,
      fittedValues: fits,
      standardizedResiduals: stdResiduals,
    };
  }, [points, slope, intercept]);

  // Q-Q pairs (theoretical normal quantile vs sorted standardized residual)
  const qqPairs = useMemo(() => {
    const n = standardizedResiduals.length;
    if (n === 0) return [];

    const sortedStdRes = [...standardizedResiduals].sort((a, b) => a - b);
    return sortedStdRes.map((val, i) => {
      // Blom plotting position: (i + 1 - 0.375) / (n + 0.25)
      const p = (i + 1 - 0.375) / (n + 0.25);
      const theoretical = probit(p);
      return { theoretical, sample: val };
    });
  }, [standardizedResiduals]);

  // Chart dimension bounds
  const svgWidth = 560;
  const svgHeight = 280;
  const pad = { top: 20, right: 25, bottom: 35, left: 45 };
  const innerW = svgWidth - pad.left - pad.right;
  const innerH = svgHeight - pad.top - pad.bottom;

  return (
    <Card className="border-stone-800 bg-stone-950/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-lg font-semibold text-stone-100">
              Regression Evaluation & Residual Diagnostics Lab
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Compare quadratic vs linear penalties and diagnose model assumptions in real time
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRandomSeed((s) => s + 7)}
              className="text-xs border-stone-800"
            >
              Reseed Data
            </Button>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1.5 pt-2 border-b border-stone-800/80">
          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-3 py-1.5 text-xs font-mono transition-colors border-b-2 -mb-[1px] ${
              activeTab === 'metrics'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            1. Metric Scorecard & Fit
          </button>
          <button
            onClick={() => setActiveTab('residuals')}
            className={`px-3 py-1.5 text-xs font-mono transition-colors border-b-2 -mb-[1px] ${
              activeTab === 'residuals'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            2. Residuals vs Fitted
          </button>
          <button
            onClick={() => setActiveTab('qq')}
            className={`px-3 py-1.5 text-xs font-mono transition-colors border-b-2 -mb-[1px] ${
              activeTab === 'qq'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            3. Normal Q-Q Plot
          </button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-4">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <div className="p-3 rounded-lg border border-stone-800/80 bg-stone-900/60 flex flex-col justify-between">
            <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400">MSE</div>
            <div className="mt-1 font-mono text-base font-bold text-amber-400">
              {mse.toFixed(2)}
            </div>
            <div className="text-[10px] text-stone-500 font-mono">1/n Σ(y - ŷ)²</div>
          </div>

          <div className="p-3 rounded-lg border border-stone-800/80 bg-stone-900/60 flex flex-col justify-between">
            <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
              RMSE
            </div>
            <div className="mt-1 font-mono text-base font-bold text-amber-400">
              {rmse.toFixed(2)}
            </div>
            <div className="text-[10px] text-stone-500 font-mono">√MSE (units of y)</div>
          </div>

          <div className="p-3 rounded-lg border border-stone-800/80 bg-stone-900/60 flex flex-col justify-between">
            <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400">MAE</div>
            <div className="mt-1 font-mono text-base font-bold text-emerald-400">
              {mae.toFixed(2)}
            </div>
            <div className="text-[10px] text-stone-500 font-mono">1/n Σ|y - ŷ|</div>
          </div>

          <div className="p-3 rounded-lg border border-stone-800/80 bg-stone-900/60 flex flex-col justify-between">
            <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
              MAPE
            </div>
            <div className="mt-1 font-mono text-base font-bold text-blue-400">
              {mape.toFixed(1)}%
            </div>
            <div className="text-[10px] text-stone-500 font-mono">Mean % Error</div>
          </div>

          <div className="p-3 rounded-lg border border-stone-800/80 bg-stone-900/60 flex flex-col justify-between">
            <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
              R² Score
            </div>
            <div
              className={`mt-1 font-mono text-base font-bold ${
                r2 >= 0.7 ? 'text-emerald-400' : r2 >= 0.3 ? 'text-amber-400' : 'text-red-400'
              }`}
            >
              {r2.toFixed(3)}
            </div>
            <div className="text-[10px] text-stone-500 font-mono">1 - SSres/SStot</div>
          </div>

          <div className="p-3 rounded-lg border border-stone-800/80 bg-stone-900/60 flex flex-col justify-between">
            <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
              Adj. R²
            </div>
            <div
              className={`mt-1 font-mono text-base font-bold ${
                adjR2 >= 0.7 ? 'text-emerald-400' : adjR2 >= 0.3 ? 'text-amber-400' : 'text-red-400'
              }`}
            >
              {adjR2.toFixed(3)}
            </div>
            <div className="text-[10px] text-stone-500 font-mono">Penalized (p=1)</div>
          </div>
        </div>

        {/* Visualizer Area */}
        <div className="rounded-lg border border-stone-800/80 bg-stone-900/40 p-4">
          {activeTab === 'metrics' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-stone-300">
                  Data Points & Residual Drop Lines (e_i = y_i - ŷ_i)
                </span>
                <span className="text-xs font-mono text-stone-500">
                  y = {intercept.toFixed(1)} + {slope.toFixed(2)}x
                </span>
              </div>
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto">
                <rect width={svgWidth} height={svgHeight} fill="#0c0a09" rx={6} />
                {/* Grid lines */}
                {[0.25, 0.5, 0.75].map((ratio) => (
                  <g key={ratio}>
                    <line
                      x1={pad.left}
                      y1={pad.top + ratio * innerH}
                      x2={pad.left + innerW}
                      y2={pad.top + ratio * innerH}
                      stroke="#1c1917"
                      strokeDasharray="3 3"
                    />
                    <line
                      x1={pad.left + ratio * innerW}
                      y1={pad.top}
                      x2={pad.left + ratio * innerW}
                      y2={pad.top + innerH}
                      stroke="#1c1917"
                      strokeDasharray="3 3"
                    />
                  </g>
                ))}

                {/* Regression fit line */}
                {(() => {
                  const xMin = 0;
                  const xMax = 100;
                  const yMin = 0;
                  const yMax = 120;

                  const p1x = pad.left + ((5 - xMin) / (xMax - xMin)) * innerW;
                  const p1y =
                    pad.top + innerH - ((intercept + slope * 5 - yMin) / (yMax - yMin)) * innerH;
                  const p2x = pad.left + ((95 - xMin) / (xMax - xMin)) * innerW;
                  const p2y =
                    pad.top + innerH - ((intercept + slope * 95 - yMin) / (yMax - yMin)) * innerH;

                  return (
                    <line x1={p1x} y1={p1y} x2={p2x} y2={p2y} stroke="#f59e0b" strokeWidth={2} />
                  );
                })()}

                {/* Residual drop lines & points */}
                {points.map((p) => {
                  const xMin = 0;
                  const xMax = 100;
                  const yMin = 0;
                  const yMax = 120;

                  const cx = pad.left + ((p.x - xMin) / (xMax - xMin)) * innerW;
                  const cy = pad.top + innerH - ((p.y - yMin) / (yMax - yMin)) * innerH;
                  const yHat = intercept + slope * p.x;
                  const yHatSvg = pad.top + innerH - ((yHat - yMin) / (yMax - yMin)) * innerH;
                  const error = Math.abs(p.y - yHat);

                  return (
                    <g key={p.id}>
                      {/* Vertical residual line */}
                      <line
                        x1={cx}
                        y1={cy}
                        x2={cx}
                        y2={yHatSvg}
                        stroke={p.isOutlier ? '#ef4444' : error > 12 ? '#f97316' : '#10b981'}
                        strokeWidth={p.isOutlier ? 2 : 1}
                        strokeDasharray={p.isOutlier ? 'none' : '2 2'}
                        opacity={0.8}
                      />
                      {/* Data Point circle */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={p.isOutlier ? 5.5 : 3.5}
                        fill={p.isOutlier ? '#ef4444' : '#fafaf9'}
                        stroke={p.isOutlier ? '#b91c1c' : '#78716c'}
                        strokeWidth={1.5}
                      />
                    </g>
                  );
                })}

                {/* Axis Labels */}
                <text
                  x={pad.left}
                  y={pad.top + innerH + 22}
                  fill="#78716c"
                  fontSize={10}
                  fontFamily="monospace"
                >
                  Feature X (0 - 100)
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
                  Target Y
                </text>
              </svg>
            </div>
          )}

          {activeTab === 'residuals' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-stone-300">
                  Residuals vs Fitted Values (e_i on Y vs ŷ_i on X)
                </span>
                <span className="text-xs font-mono text-stone-500">
                  Diagnostic: Ideal = Unbiased horizontal band around e = 0
                </span>
              </div>
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto">
                <rect width={svgWidth} height={svgHeight} fill="#0c0a09" rx={6} />
                {/* Horizontal Zero Error Line */}
                <line
                  x1={pad.left}
                  y1={pad.top + innerH / 2}
                  x2={pad.left + innerW}
                  y2={pad.top + innerH / 2}
                  stroke="#ef4444"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                />
                <text
                  x={pad.left + innerW - 40}
                  y={pad.top + innerH / 2 - 6}
                  fill="#ef4444"
                  fontSize={10}
                  fontFamily="monospace"
                >
                  e = 0
                </text>

                {/* Plot points: x = fittedValues[i], y = residuals[i] */}
                {(() => {
                  const maxResAbs = Math.max(30, maxError * 1.15);
                  const minFit = 0;
                  const maxFit = 110;

                  return residuals.map((e, i) => {
                    const fit = fittedValues[i] ?? 50;
                    const isOutlier = points[i]?.isOutlier ?? false;
                    const cx = pad.left + ((fit - minFit) / (maxFit - minFit)) * innerW;
                    // Y: e goes from -maxResAbs to +maxResAbs
                    const cy = pad.top + innerH / 2 - (e / maxResAbs) * (innerH / 2);

                    return (
                      <circle
                        key={i}
                        cx={cx}
                        cy={cy}
                        r={isOutlier ? 5 : 3.5}
                        fill={isOutlier ? '#ef4444' : '#38bdf8'}
                        stroke={isOutlier ? '#fca5a5' : '#0284c7'}
                        strokeWidth={1.2}
                      />
                    );
                  });
                })()}

                <text
                  x={pad.left}
                  y={pad.top + innerH + 22}
                  fill="#78716c"
                  fontSize={10}
                  fontFamily="monospace"
                >
                  Fitted Values ŷ_i
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
                  Residual e_i
                </text>
              </svg>
            </div>
          )}

          {activeTab === 'qq' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-stone-300">
                  Normal Q-Q Plot (Standardized Residuals vs Standard Normal Quantiles)
                </span>
                <span className="text-xs font-mono text-stone-500">
                  Diagnostic: Points on 45° diagonal = Normally distributed errors
                </span>
              </div>
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto">
                <rect width={svgWidth} height={svgHeight} fill="#0c0a09" rx={6} />
                {/* 45 degree diagonal line from (-3, -3) to (3, 3) */}
                {(() => {
                  const p1x = pad.left;
                  const p1y = pad.top + innerH;
                  const p2x = pad.left + innerW;
                  const p2y = pad.top;

                  return (
                    <line
                      x1={p1x}
                      y1={p1y}
                      x2={p2x}
                      y2={p2y}
                      stroke="#ef4444"
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                    />
                  );
                })()}

                {/* Plot Q-Q points */}
                {(() => {
                  const zMin = -3.2;
                  const zMax = 3.2;
                  return qqPairs.map((pair, idx) => {
                    const cx = pad.left + ((pair.theoretical - zMin) / (zMax - zMin)) * innerW;
                    const cy = pad.top + innerH - ((pair.sample - zMin) / (zMax - zMin)) * innerH;
                    const isExtreme = Math.abs(pair.sample) > 2.2;

                    return (
                      <circle
                        key={idx}
                        cx={Math.max(pad.left, Math.min(pad.left + innerW, cx))}
                        cy={Math.max(pad.top, Math.min(pad.top + innerH, cy))}
                        r={isExtreme ? 5 : 3.5}
                        fill={isExtreme ? '#ef4444' : '#a855f7'}
                        stroke={isExtreme ? '#fca5a5' : '#7e22ce'}
                        strokeWidth={1.2}
                      />
                    );
                  });
                })()}

                <text
                  x={pad.left}
                  y={pad.top + innerH + 22}
                  fill="#78716c"
                  fontSize={10}
                  fontFamily="monospace"
                >
                  Theoretical Quantiles (Standard Normal Z)
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
                  Sample Residual Quantiles
                </text>
              </svg>
            </div>
          )}
        </div>

        {/* Interactive Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/30 p-4 rounded-lg border border-stone-800/80">
          <div className="space-y-3">
            <Slider
              label="Gaussian Noise Variance"
              min={2}
              max={20}
              step={1}
              value={noiseLevel}
              onChange={setNoiseLevel}
            />

            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-stone-300">Outlier Count:</span>
              <div className="flex gap-1.5">
                {[0, 1, 2, 3].map((cnt) => (
                  <Button
                    key={cnt}
                    variant={outlierCount === cnt ? 'primary' : 'outline'}
                    size="sm"
                    className="h-7 px-2.5 text-xs border-stone-800"
                    onClick={() => setOutlierCount(cnt)}
                  >
                    {cnt === 0 ? 'None' : `${cnt} Outlier${cnt > 1 ? 's' : ''}`}
                  </Button>
                ))}
              </div>
            </div>

            {outlierCount > 0 && (
              <Slider
                label="Outlier Shift Multiplier"
                min={2}
                max={8}
                step={1}
                value={outlierMagnitude}
                onChange={setOutlierMagnitude}
              />
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-stone-300">Model Hypothesis:</span>
              <div className="flex gap-1.5">
                <Button
                  variant={modelType === 'ols' ? 'primary' : 'outline'}
                  size="sm"
                  className="h-7 px-2 text-xs border-stone-800"
                  onClick={() => setModelType('ols')}
                >
                  OLS Fit
                </Button>
                <Button
                  variant={modelType === 'baseline' ? 'primary' : 'outline'}
                  size="sm"
                  className="h-7 px-2 text-xs border-stone-800"
                  onClick={() => setModelType('baseline')}
                >
                  Mean Line (R²=0)
                </Button>
                <Button
                  variant={modelType === 'poor' ? 'primary' : 'outline'}
                  size="sm"
                  className="h-7 px-2 text-xs border-stone-800"
                  onClick={() => setModelType('poor')}
                >
                  Bad Fit (R²&lt;0)
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <div className="text-xs font-medium text-stone-200">
                  Heteroscedasticity Simulation
                </div>
                <div className="text-[11px] text-stone-500">
                  Expand error variance as X increases (funnel shape)
                </div>
              </div>
              <Button
                variant={heteroscedastic ? 'primary' : 'outline'}
                size="sm"
                className="h-7 px-3 text-xs border-stone-800"
                onClick={() => setHeteroscedastic(!heteroscedastic)}
              >
                {heteroscedastic ? 'Active' : 'Off'}
              </Button>
            </div>
          </div>
        </div>

        {/* Diagnostic Takeaways Box */}
        <div className="p-3.5 rounded-lg border border-amber-500/20 bg-amber-500/5 text-xs space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] border-amber-500/40 text-amber-300">
              Diagnostic Insight
            </Badge>
            <span className="font-semibold text-stone-200">
              {outlierCount > 0
                ? 'Outlier Impact Observed'
                : heteroscedastic
                  ? 'Heteroscedasticity Detected'
                  : modelType === 'poor'
                    ? 'Negative R² Demonstrated'
                    : 'Homoscedastic Normal Regime'}
            </span>
          </div>
          <p className="text-stone-300 leading-relaxed">
            {outlierCount > 0 &&
              `Injecting ${outlierCount} outlier(s) causes MSE to skyrocket from squared penalty (e²), while MAE increases modestly. Notice how in the Q-Q plot, the extreme points bend sharply away from the 45° red line.`}
            {outlierCount === 0 &&
              heteroscedastic &&
              `In Tab 2 (Residuals vs Fitted), observe the unmistakable funnel shape: small errors at low fitted values widening into large errors at high fitted values. This violates the constant variance (homoscedasticity) assumption of Gauss-Markov OLS.`}
            {outlierCount === 0 &&
              !heteroscedastic &&
              modelType === 'poor' &&
              `R² = ${r2.toFixed(2)}. When a model performs worse than the simple sample mean predictor (y_bar), the sum of squared errors SS_res exceeds SS_tot, producing a strictly negative R² score.`}
            {outlierCount === 0 &&
              !heteroscedastic &&
              modelType === 'ols' &&
              `Under standard Gaussian noise, the residuals form an even horizontal band around 0 with no pattern, and the Q-Q plot closely follows the 45° theoretical normal line. MSE and MAE both reflect clean fit quality.`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
