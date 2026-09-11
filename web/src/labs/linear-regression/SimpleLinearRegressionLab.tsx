import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Slider } from '@/components/ui/Slider';
import { Toggle } from '@/components/ui/Toggle';
import {
  SALARY_DATA,
  STUDY_HOURS_DATA,
  APARTMENT_PRICE_DATA,
  fitSimpleLinearRegression,
  computeMetrics,
  computeCost,
} from '@/engines/regression/linear';
import type { DataPoint1D } from '@/engines/regression/linear';
import { Sparkles, RotateCcw, AlertTriangle, Layers, Eye } from 'lucide-react';

export function SimpleLinearRegressionLab() {
  const [datasetChoice, setDatasetChoice] = useState<'salary' | 'study' | 'housing'>('salary');
  const [activeTab, setActiveTab] = useState<'fit' | 'contour'>('fit');
  const [showResiduals, setShowResiduals] = useState<boolean>(true);
  const [showErrorSquares, setShowErrorSquares] = useState<boolean>(false);

  // Active points
  const points: DataPoint1D[] = useMemo(() => {
    switch (datasetChoice) {
      case 'salary':
        return SALARY_DATA;
      case 'study':
        return STUDY_HOURS_DATA;
      case 'housing':
        return APARTMENT_PRICE_DATA;
    }
  }, [datasetChoice]);

  // Compute analytical OLS
  const olsModel = useMemo(() => fitSimpleLinearRegression(points), [points]);

  // User slider state initialized to OLS
  const [theta0, setTheta0] = useState<number>(() => olsModel.theta0);
  const [theta1, setTheta1] = useState<number>(() => olsModel.theta1);

  // Update parameters when dataset changes
  const handleDatasetChange = (choice: 'salary' | 'study' | 'housing') => {
    setDatasetChoice(choice);
    const pts =
      choice === 'salary'
        ? SALARY_DATA
        : choice === 'study'
          ? STUDY_HOURS_DATA
          : APARTMENT_PRICE_DATA;
    const model = fitSimpleLinearRegression(pts);
    setTheta0(model.theta0);
    setTheta1(model.theta1);
  };

  // Slider ranges dynamically computed from OLS
  const ranges = useMemo(() => {
    const t0Span = Math.max(20, Math.abs(olsModel.theta0) * 1.5);
    const t1Span = Math.max(10, Math.abs(olsModel.theta1) * 2.0);
    return {
      t0Min: Number((olsModel.theta0 - t0Span).toFixed(1)),
      t0Max: Number((olsModel.theta0 + t0Span).toFixed(1)),
      t1Min: Number((olsModel.theta1 - t1Span).toFixed(1)),
      t1Max: Number((olsModel.theta1 + t1Span).toFixed(1)),
    };
  }, [olsModel]);

  // Current metrics
  const metrics = useMemo(() => computeMetrics(points, theta0, theta1), [points, theta0, theta1]);
  const cost = useMemo(() => computeCost(points, theta0, theta1), [points, theta0, theta1]);

  // SVG coordinate transformation
  const bounds = useMemo(() => {
    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    const xMin = Math.min(0, ...xs);
    const xMax = Math.max(...xs) * 1.1;
    const yMin = Math.min(0, ...ys);
    const yMax = Math.max(...ys) * 1.15;
    return { xMin, xMax, yMin, yMax };
  }, [points]);

  const svgWidth = 600;
  const svgHeight = 360;
  const padL = 50;
  const padR = 25;
  const padT = 25;
  const padB = 40;

  const toSvgX = (x: number) =>
    padL + ((x - bounds.xMin) / (bounds.xMax - bounds.xMin)) * (svgWidth - padL - padR);
  const toSvgY = (y: number) =>
    svgHeight -
    padB -
    ((y - bounds.yMin) / (bounds.yMax - bounds.yMin)) * (svgHeight - padT - padB);

  // Line endpoints in SVG
  const lineX1 = bounds.xMin;
  const lineY1 = theta0 + theta1 * lineX1;
  const lineX2 = bounds.xMax;
  const lineY2 = theta0 + theta1 * lineX2;

  // Preset Handlers
  const handleResetToOls = () => {
    setTheta0(olsModel.theta0);
    setTheta1(olsModel.theta1);
  };

  const handleMakeItFailNegative = () => {
    setTheta0(olsModel.theta0 + olsModel.theta1 * 8);
    setTheta1(-Math.abs(olsModel.theta1) * 0.9);
  };

  const handleMakeItFailZeroSlope = () => {
    // Null model predicting sample mean y
    const sumY = points.reduce((acc, p) => acc + p.y, 0);
    const meanY = sumY / points.length;
    setTheta0(Number(meanY.toFixed(2)));
    setTheta1(0);
  };

  // Generate 2D loss contour grid
  const contourData = useMemo(() => {
    const steps = 11;
    const t0Values: number[] = [];
    const t1Values: number[] = [];

    const t0Span = Math.abs(olsModel.theta0) * 1.2 || 20;
    const t1Span = Math.abs(olsModel.theta1) * 1.5 || 10;
    const t0Start = olsModel.theta0 - t0Span;
    const t0End = olsModel.theta0 + t0Span;
    const t1Start = olsModel.theta1 - t1Span;
    const t1End = olsModel.theta1 + t1Span;

    for (let i = 0; i < steps; i++) {
      t0Values.push(t0Start + (i / (steps - 1)) * (t0End - t0Start));
      t1Values.push(t1Start + (i / (steps - 1)) * (t1End - t1Start));
    }

    const grid: { t0: number; t1: number; cost: number }[][] = [];
    let minCost = Infinity;
    let maxCost = -Infinity;

    for (let j = 0; j < steps; j++) {
      const row: { t0: number; t1: number; cost: number }[] = [];
      const currentT1 = t1Values[j]!;
      for (let i = 0; i < steps; i++) {
        const currentT0 = t0Values[i]!;
        const c = computeCost(points, currentT0, currentT1);
        minCost = Math.min(minCost, c);
        maxCost = Math.max(maxCost, c);
        row.push({ t0: currentT0, t1: currentT1, cost: c });
      }
      grid.push(row);
    }

    return { grid, t0Values, t1Values, minCost, maxCost };
  }, [points, olsModel]);

  return (
    <Card className="p-6 border-stone-800 bg-[#0c0a09] space-y-6 shadow-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <h3 className="font-montserrat text-lg font-bold text-stone-100">
              Interactive Simple Linear Regression &amp; Residual Arena
            </h3>
          </div>
          <p className="text-xs text-stone-400 mt-1 font-sans">
            Adjust intercept &theta;<sub>0</sub> and slope &theta;<sub>1</sub> to observe how
            residual errors compound into Mean Squared Error loss.
          </p>
        </div>

        {/* Dataset selector */}
        <div className="flex items-center gap-1.5 bg-stone-900/80 p-1 rounded-lg border border-stone-800">
          <button
            onClick={() => handleDatasetChange('salary')}
            className={`px-3 py-1 text-xs font-mono rounded-md transition-all ${
              datasetChoice === 'salary'
                ? 'bg-stone-100 text-stone-950 font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Salary vs Exp (30 pts)
          </button>
          <button
            onClick={() => handleDatasetChange('study')}
            className={`px-3 py-1 text-xs font-mono rounded-md transition-all ${
              datasetChoice === 'study'
                ? 'bg-stone-100 text-stone-950 font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Study vs Marks (14 pts)
          </button>
          <button
            onClick={() => handleDatasetChange('housing')}
            className={`px-3 py-1 text-xs font-mono rounded-md transition-all ${
              datasetChoice === 'housing'
                ? 'bg-stone-100 text-stone-950 font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Area vs Price (12 pts)
          </button>
        </div>
      </div>

      {/* View Switcher & Action Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-stone-900/70 p-1 rounded-lg border border-stone-800">
            <button
              onClick={() => setActiveTab('fit')}
              className={`px-3 py-1 text-xs font-mono rounded transition-all flex items-center gap-1.5 ${
                activeTab === 'fit'
                  ? 'bg-stone-100 text-stone-950 font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Eye className="size-3.5" />
              Scatter &amp; Residuals
            </button>
            <button
              onClick={() => setActiveTab('contour')}
              className={`px-3 py-1 text-xs font-mono rounded transition-all flex items-center gap-1.5 ${
                activeTab === 'contour'
                  ? 'bg-stone-100 text-stone-950 font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Layers className="size-3.5" />
              Loss Contour J(&theta;)
            </button>
          </div>

          {activeTab === 'fit' && (
            <div className="flex items-center gap-3 pl-2">
              <Toggle label="Residual Bars" checked={showResiduals} onChange={setShowResiduals} />
              <Toggle
                label="Error Squares"
                checked={showErrorSquares}
                onChange={setShowErrorSquares}
              />
            </div>
          )}
        </div>

        {/* Quick presets */}
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleResetToOls}
            className="text-xs h-7 gap-1.5 bg-stone-100 text-stone-950 hover:bg-stone-200 rounded-lg rounded-br-none font-semibold"
          >
            <Sparkles className="size-3 text-amber-500" />
            Fit OLS Minimum
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleMakeItFailNegative}
            className="text-xs h-7 gap-1 border-rose-800/60 bg-rose-950/20 text-rose-300 hover:bg-rose-900/40 rounded-lg rounded-br-none"
          >
            <AlertTriangle className="size-3" />
            Fail: Invert Slope
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleMakeItFailZeroSlope}
            className="text-xs h-7 gap-1 border-stone-800 text-stone-400 hover:text-stone-200 rounded-lg rounded-br-none"
          >
            <RotateCcw className="size-3" />
            Fail: Zero Slope
          </Button>
        </div>
      </div>

      {/* Main Visual Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Visual Canvas / SVG (2 cols) */}
        <div className="lg:col-span-2 p-4 rounded-xl border border-stone-800 bg-stone-950/80 flex flex-col items-center justify-center relative overflow-hidden">
          {activeTab === 'fit' ? (
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto max-h-[380px] select-none"
            >
              {/* Axes */}
              <line
                x1={padL}
                y1={svgHeight - padB}
                x2={svgWidth - padR}
                y2={svgHeight - padB}
                stroke="#44403c"
                strokeWidth="1.5"
              />
              <line
                x1={padL}
                y1={padT}
                x2={padL}
                y2={svgHeight - padB}
                stroke="#44403c"
                strokeWidth="1.5"
              />

              {/* Grid Lines */}
              {[0.25, 0.5, 0.75, 1.0].map((frac) => {
                const yVal = bounds.yMin + frac * (bounds.yMax - bounds.yMin);
                const py = toSvgY(yVal);
                return (
                  <g key={`ygrid-${frac}`}>
                    <line
                      x1={padL}
                      y1={py}
                      x2={svgWidth - padR}
                      y2={py}
                      stroke="#292524"
                      strokeDasharray="3 3"
                    />
                    <text
                      x={padL - 8}
                      y={py + 3}
                      fill="#78716c"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="end"
                    >
                      {yVal.toFixed(0)}
                    </text>
                  </g>
                );
              })}

              {[0.25, 0.5, 0.75, 1.0].map((frac) => {
                const xVal = bounds.xMin + frac * (bounds.xMax - bounds.xMin);
                const px = toSvgX(xVal);
                return (
                  <g key={`xgrid-${frac}`}>
                    <line
                      x1={px}
                      y1={padT}
                      x2={px}
                      y2={svgHeight - padB}
                      stroke="#292524"
                      strokeDasharray="3 3"
                    />
                    <text
                      x={px}
                      y={svgHeight - padB + 16}
                      fill="#78716c"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {xVal.toFixed(1)}
                    </text>
                  </g>
                );
              })}

              {/* Axis Labels */}
              <text
                x={svgWidth / 2}
                y={svgHeight - 8}
                fill="#a8a29e"
                fontSize="11"
                fontFamily="sans-serif"
                textAnchor="middle"
              >
                Feature X (
                {datasetChoice === 'salary'
                  ? 'Years of Experience'
                  : datasetChoice === 'study'
                    ? 'Study Hours'
                    : 'Area in 100 sq ft'}
                )
              </text>
              <text
                x={14}
                y={svgHeight / 2}
                fill="#a8a29e"
                fontSize="11"
                fontFamily="sans-serif"
                textAnchor="middle"
                transform={`rotate(-90, 14, ${svgHeight / 2})`}
              >
                Target y (
                {datasetChoice === 'salary'
                  ? 'Salary in $k'
                  : datasetChoice === 'study'
                    ? 'Score / 100'
                    : 'Price (Lakhs)'}
                )
              </text>

              {/* Squared Error Boxes if enabled */}
              {showErrorSquares &&
                points.map((pt, i) => {
                  const px = toSvgX(pt.x);
                  const py = toSvgY(pt.y);
                  const predY = theta0 + theta1 * pt.x;
                  const predPy = toSvgY(predY);
                  const edgeLen = Math.abs(predPy - py);
                  const top = Math.min(py, predPy);
                  return (
                    <rect
                      key={`sq-${i}`}
                      x={px}
                      y={top}
                      width={edgeLen}
                      height={edgeLen}
                      fill="rgba(244, 63, 94, 0.12)"
                      stroke="#f43f5e"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                  );
                })}

              {/* Residual Error Lines */}
              {showResiduals &&
                points.map((pt, i) => {
                  const px = toSvgX(pt.x);
                  const py = toSvgY(pt.y);
                  const predY = theta0 + theta1 * pt.x;
                  const predPy = toSvgY(predY);
                  const isPositive = pt.y >= predY;
                  return (
                    <line
                      key={`res-${i}`}
                      x1={px}
                      y1={py}
                      x2={px}
                      y2={predPy}
                      stroke={isPositive ? '#38bdf8' : '#f43f5e'}
                      strokeWidth="1.5"
                    />
                  );
                })}

              {/* Fitted Regression Hypothesis Line: y_hat = theta0 + theta1 * x */}
              <line
                x1={toSvgX(lineX1)}
                y1={toSvgY(lineY1)}
                x2={toSvgX(lineX2)}
                y2={toSvgY(lineY2)}
                stroke="#f59e0b"
                strokeWidth="2.5"
              />

              {/* Scatter Data Points */}
              {points.map((pt, i) => {
                const px = toSvgX(pt.x);
                const py = toSvgY(pt.y);
                return (
                  <circle
                    key={`pt-${i}`}
                    cx={px}
                    cy={py}
                    r="4.5"
                    fill="#fafaf9"
                    stroke="#0c0a09"
                    strokeWidth="1.5"
                  />
                );
              })}
            </svg>
          ) : (
            /* 2D Loss Contour Heatmap Representation */
            <div className="w-full flex flex-col items-center justify-center p-2 space-y-3">
              <div className="text-center space-y-1">
                <span className="font-montserrat text-xs font-semibold text-stone-200">
                  MSE Cost Surface Paraboloid J(&theta;<sub>0</sub>, &theta;<sub>1</sub>)
                </span>
                <p className="text-[11px] text-stone-400">
                  Convex parabolic bowl with unique global minimum (OLS solution).
                </p>
              </div>

              {/* Heatmap Grid */}
              <div className="relative border border-stone-800 rounded-lg p-2 bg-stone-900/40">
                <div
                  className="grid gap-0.5"
                  style={{
                    gridTemplateColumns: `repeat(${contourData.t0Values.length}, minmax(0, 1fr))`,
                  }}
                >
                  {contourData.grid.map((row, rIdx) =>
                    row.map((cell, cIdx) => {
                      // Normalize cost between 0 (min) and 1 (max)
                      const range = contourData.maxCost - contourData.minCost || 1;
                      const norm = Math.min(
                        1,
                        Math.max(0, (cell.cost - contourData.minCost) / range)
                      );
                      // Color mapping: dark purple (lowest) -> amber -> bright red (highest)
                      const bg =
                        norm < 0.1
                          ? '#10b981'
                          : norm < 0.3
                            ? '#0284c7'
                            : norm < 0.6
                              ? '#d97706'
                              : '#e11d48';

                      return (
                        <div
                          key={`c-${rIdx}-${cIdx}`}
                          className="w-6 h-6 sm:w-7 sm:h-7 rounded-[2px] transition-all hover:scale-110"
                          style={{ backgroundColor: bg, opacity: 0.85 }}
                          title={`theta0: ${cell.t0.toFixed(1)}, theta1: ${cell.t1.toFixed(1)}, cost: ${cell.cost.toFixed(1)}`}
                        />
                      );
                    })
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-stone-400">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                    Global Minima (OLS)
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" />
                    High Cost Ridge
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Sliders & Live Metrics */}
        <div className="space-y-4">
          {/* Parameter Sliders */}
          <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/40 space-y-4">
            <h4 className="font-montserrat text-xs font-bold text-stone-300 uppercase tracking-wider">
              Model Parameters
            </h4>

            {/* Intercept Theta0 */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-stone-300">
                  Intercept (&theta;<sub>0</sub>)
                </span>
                <span className="font-mono font-bold text-amber-300">{theta0.toFixed(2)}</span>
              </div>
              <Slider
                label="Intercept (\u03b80)"
                min={ranges.t0Min}
                max={ranges.t0Max}
                step={0.1}
                value={theta0}
                onChange={setTheta0}
              />
              <div className="flex justify-between text-[10px] font-mono text-stone-500">
                <span>{ranges.t0Min}</span>
                <span>OLS: {olsModel.theta0.toFixed(1)}</span>
                <span>{ranges.t0Max}</span>
              </div>
            </div>

            {/* Slope Theta1 */}
            <div className="space-y-1.5 pt-2 border-t border-stone-800/60">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-stone-300">
                  Slope (&theta;<sub>1</sub>)
                </span>
                <span className="font-mono font-bold text-amber-300">{theta1.toFixed(2)}</span>
              </div>
              <Slider
                label="Slope (\u03b81)"
                min={ranges.t1Min}
                max={ranges.t1Max}
                step={0.05}
                value={theta1}
                onChange={setTheta1}
              />
              <div className="flex justify-between text-[10px] font-mono text-stone-500">
                <span>{ranges.t1Min}</span>
                <span>OLS: {olsModel.theta1.toFixed(1)}</span>
                <span>{ranges.t1Max}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-stone-950 border border-stone-800 font-mono text-xs text-amber-200/90 text-center">
              h<sub>&theta;</sub>(x) = {theta0.toFixed(2)} + ({theta1.toFixed(2)}) &times; x
            </div>
          </div>

          {/* Real-Time Metrics Card */}
          <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/40 space-y-3">
            <h4 className="font-montserrat text-xs font-bold text-stone-300 uppercase tracking-wider">
              Regression Metrics
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-stone-950 border border-stone-800 space-y-0.5">
                <span className="text-[10px] font-mono text-stone-400">Cost J(&theta;)</span>
                <p className="font-mono font-bold text-stone-200">{cost.toFixed(2)}</p>
              </div>

              <div className="p-2 rounded-lg bg-stone-950 border border-stone-800 space-y-0.5">
                <span className="text-[10px] font-mono text-stone-400">MSE</span>
                <p className="font-mono font-bold text-stone-200">{metrics.mse.toFixed(2)}</p>
              </div>

              <div className="p-2 rounded-lg bg-stone-950 border border-stone-800 space-y-0.5">
                <span className="text-[10px] font-mono text-stone-400">RMSE</span>
                <p className="font-mono font-bold text-stone-200">{metrics.rmse.toFixed(2)}</p>
              </div>

              <div className="p-2 rounded-lg bg-stone-950 border border-stone-800 space-y-0.5">
                <span className="text-[10px] font-mono text-stone-400">MAE</span>
                <p className="font-mono font-bold text-stone-200">{metrics.mae.toFixed(2)}</p>
              </div>
            </div>

            {/* R-squared with status pill */}
            <div className="p-3 rounded-lg bg-stone-950 border border-stone-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-stone-400 block">
                  Goodness of Fit (R&sup2;)
                </span>
                <span
                  className={`font-mono text-base font-bold ${
                    metrics.r2 >= 0.8
                      ? 'text-emerald-400'
                      : metrics.r2 >= 0.5
                        ? 'text-amber-400'
                        : 'text-rose-400'
                  }`}
                >
                  {metrics.r2.toFixed(4)}
                </span>
              </div>
              <Badge
                variant="outline"
                className={`font-mono text-[10px] ${
                  metrics.r2 >= 0.8
                    ? 'border-emerald-500/50 text-emerald-400'
                    : metrics.r2 >= 0.5
                      ? 'border-amber-500/50 text-amber-400'
                      : 'border-rose-500/50 text-rose-400'
                }`}
              >
                {metrics.r2 >= 0.8
                  ? 'Excellent Fit'
                  : metrics.r2 >= 0.5
                    ? 'Moderate'
                    : 'Poor / Sub-Zero'}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
