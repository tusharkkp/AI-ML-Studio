import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Slider } from '@/components/ui/Slider';
import {
  fitPolynomialRegression,
  predictPolynomial,
  computePolynomialMetrics,
} from '@/engines/regression/polynomial';
import type { DataPoint1D } from '@/engines/regression/linear';
import { Sparkles, AlertTriangle, LineChart } from 'lucide-react';

// True underlying non-linear function: y = sin(x * 0.8) * 8 + 12 + noise
const TRAIN_POINTS: DataPoint1D[] = [
  { x: 1.0, y: 17.5 },
  { x: 2.2, y: 19.8 },
  { x: 3.5, y: 14.2 },
  { x: 4.8, y: 5.6 },
  { x: 5.9, y: 4.2 },
  { x: 7.1, y: 7.9 },
  { x: 8.4, y: 16.5 },
  { x: 9.6, y: 20.1 },
];

const TEST_POINTS: DataPoint1D[] = [
  { x: 1.5, y: 19.1 },
  { x: 2.8, y: 17.0 },
  { x: 4.1, y: 9.8 },
  { x: 5.4, y: 4.5 },
  { x: 6.5, y: 5.8 },
  { x: 7.8, y: 12.2 },
  { x: 9.0, y: 18.9 },
];

export function PolynomialRegressionLab() {
  const [degree, setDegree] = useState<number>(3);
  const showTestPoints = true;

  // Fit model on training points
  const model = useMemo(() => fitPolynomialRegression(TRAIN_POINTS, degree), [degree]);

  // Evaluate on test points
  const testMetrics = useMemo(
    () => computePolynomialMetrics(TEST_POINTS, model.coefficients),
    [model.coefficients]
  );

  // Compute error curves across degrees 1 to 7 for comparison graph
  const degreeCurves = useMemo(() => {
    const list: { deg: number; trainMse: number; testMse: number }[] = [];
    for (let d = 1; d <= 7; d++) {
      const m = fitPolynomialRegression(TRAIN_POINTS, d);
      const tm = computePolynomialMetrics(TEST_POINTS, m.coefficients);
      list.push({ deg: d, trainMse: m.mse, testMse: tm.mse });
    }
    return list;
  }, []);

  // SVG dimensions
  const svgWidth = 560;
  const svgHeight = 340;
  const padL = 45;
  const padR = 25;
  const padT = 25;
  const padB = 40;

  const xMin = 0.5;
  const xMax = 10.5;
  const yMin = 0;
  const yMax = 28;

  const toSvgX = (x: number) => padL + ((x - xMin) / (xMax - xMin)) * (svgWidth - padL - padR);
  const toSvgY = (y: number) => {
    const clampedY = Math.max(yMin - 5, Math.min(yMax + 10, y));
    return svgHeight - padB - ((clampedY - yMin) / (yMax - yMin)) * (svgHeight - padT - padB);
  };

  // Generate smooth polynomial curve points
  const curvePath = useMemo(() => {
    const segments = 100;
    const step = (xMax - xMin) / segments;
    const pts: { x: number; y: number }[] = [];

    for (let i = 0; i <= segments; i++) {
      const x = xMin + i * step;
      const y = predictPolynomial(model.coefficients, x);
      pts.push({ x: toSvgX(x), y: toSvgY(y) });
    }

    return pts.reduce(
      (acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)},${p.y.toFixed(1)}`,
      ''
    );
  }, [model.coefficients]);

  return (
    <Card className="p-6 border-stone-800 bg-[#0c0a09] space-y-6 shadow-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <h3 className="font-montserrat text-lg font-bold text-stone-100">
              Polynomial Degree Sweeper &amp; Overfitting Lab
            </h3>
          </div>
          <p className="text-xs text-stone-400 mt-1 font-sans">
            Sweep polynomial complexity d from 1 to 7. Watch the model transition from underfitting
            (high bias) to optimal fit, and into high-degree Runge oscillation (high variance).
          </p>
        </div>

        {/* Presets */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDegree(1)}
            className="text-xs h-7 border-stone-800 text-stone-400 hover:text-stone-200 rounded-lg rounded-br-none"
          >
            Underfitting (d=1)
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setDegree(3)}
            className="text-xs h-7 gap-1 bg-stone-100 text-stone-950 hover:bg-stone-200 rounded-lg rounded-br-none font-semibold"
          >
            <Sparkles className="size-3 text-amber-500" />
            Optimal (d=3)
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDegree(7)}
            className="text-xs h-7 gap-1 border-rose-800/60 bg-rose-950/20 text-rose-300 hover:bg-rose-900/40 rounded-lg rounded-br-none"
          >
            <AlertTriangle className="size-3" />
            Fail: Overfitting (d=7)
          </Button>
        </div>
      </div>

      {/* Main Grid: Visual Curve + Error Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: 2D Curve Fitting Arena (2 cols) */}
        <div className="lg:col-span-2 p-4 rounded-xl border border-stone-800 bg-stone-950/80 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="w-full flex items-center justify-between text-xs text-stone-400 pb-2 border-b border-stone-800/60 mb-2">
            <span className="font-montserrat font-semibold text-stone-200">
              Polynomial Hypothesis: ŷ = &theta;<sub>0</sub> + &theta;<sub>1</sub>x + ... + &theta;
              <sub>{degree}</sub>x<sup>{degree}</sup>
            </span>
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="flex items-center gap-1.5 text-stone-200">
                <span className="w-2.5 h-2.5 rounded-full bg-stone-100 inline-block" />
                Train Points (8)
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                Held-Out Test (7)
              </span>
            </div>
          </div>

          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto max-h-[380px] select-none"
          >
            {/* Grid Lines */}
            {[5, 10, 15, 20, 25].map((yVal) => (
              <g key={`ygrid-${yVal}`}>
                <line
                  x1={padL}
                  y1={toSvgY(yVal)}
                  x2={svgWidth - padR}
                  y2={toSvgY(yVal)}
                  stroke="#292524"
                  strokeDasharray="3 3"
                />
                <text
                  x={padL - 8}
                  y={toSvgY(yVal) + 3}
                  fill="#78716c"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="end"
                >
                  {yVal}
                </text>
              </g>
            ))}

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

            {/* Continuous Polynomial Curve */}
            <path
              d={curvePath}
              fill="none"
              stroke={degree >= 6 ? '#f43f5e' : '#f59e0b'}
              strokeWidth="2.5"
            />

            {/* Held-out Test Data Points */}
            {showTestPoints &&
              TEST_POINTS.map((pt, idx) => (
                <circle
                  key={`test-${idx}`}
                  cx={toSvgX(pt.x)}
                  cy={toSvgY(pt.y)}
                  r="4.5"
                  fill="#f59e0b"
                  stroke="#0c0a09"
                  strokeWidth="1.5"
                />
              ))}

            {/* Train Data Points */}
            {TRAIN_POINTS.map((pt, idx) => (
              <circle
                key={`train-${idx}`}
                cx={toSvgX(pt.x)}
                cy={toSvgY(pt.y)}
                r="5"
                fill="#fafaf9"
                stroke="#0c0a09"
                strokeWidth="1.5"
              />
            ))}

            <text
              x={svgWidth / 2}
              y={svgHeight - 10}
              fill="#a8a29e"
              fontSize="10"
              fontFamily="sans-serif"
              textAnchor="middle"
            >
              Input Feature X
            </text>
          </svg>

          {/* Overfitting alert overlay if degree >= 6 */}
          {degree >= 6 && (
            <div className="absolute top-12 left-6 right-6 p-2.5 rounded-lg border border-rose-500 bg-rose-950/90 text-rose-200 text-xs font-mono flex items-center gap-2">
              <AlertTriangle className="size-4 shrink-0 text-rose-400" />
              <span>
                <strong>Runge Phenomenon Overfitting:</strong> Degree {degree} fits training points
                flawlessly (Train MSE &approx; {model.mse.toFixed(2)}), but oscillates wildly
                between points, causing Test MSE to spike to {testMetrics.mse.toFixed(2)}!
              </span>
            </div>
          )}
        </div>

        {/* Right: Controls & Train vs Test Error Curve */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/40 space-y-4">
            <h4 className="font-montserrat text-xs font-bold text-stone-300 uppercase tracking-wider">
              Polynomial Degree Control
            </h4>

            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-stone-300">Degree (d)</span>
                <span className="font-mono font-bold text-amber-300">{degree}</span>
              </div>
              <Slider
                label="Polynomial Degree (d)"
                min={1}
                max={7}
                step={1}
                value={degree}
                onChange={setDegree}
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-800/60">
              <span className="font-mono text-stone-400">Diagnosis:</span>
              <Badge
                variant="outline"
                className={`font-mono text-[10px] ${
                  degree <= 1
                    ? 'border-blue-500 text-blue-300'
                    : degree <= 4
                      ? 'border-emerald-500 text-emerald-300'
                      : 'border-rose-500 text-rose-300'
                }`}
              >
                {degree <= 1
                  ? 'High Bias (Underfit)'
                  : degree <= 4
                    ? 'Good Balance'
                    : 'High Variance (Overfit)'}
              </Badge>
            </div>
          </div>

          {/* Train vs Test Metrics Comparison */}
          <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/40 space-y-3">
            <h4 className="font-montserrat text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center justify-between">
              <span>Generalization Metrics</span>
              <LineChart className="size-3.5 text-stone-400" />
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded bg-stone-950 border border-stone-800 space-y-0.5">
                <span className="text-[10px] font-mono text-stone-400 block">Train MSE</span>
                <span className="font-mono font-bold text-stone-200">{model.mse.toFixed(2)}</span>
                <span className="text-[10px] font-mono text-stone-500 block">
                  R&sup2;: {model.r2.toFixed(3)}
                </span>
              </div>

              <div className="p-2.5 rounded bg-stone-950 border border-stone-800 space-y-0.5">
                <span className="text-[10px] font-mono text-stone-400 block">Test MSE</span>
                <span
                  className={`font-mono font-bold ${
                    testMetrics.mse > model.mse * 3 ? 'text-rose-400' : 'text-amber-300'
                  }`}
                >
                  {testMetrics.mse.toFixed(2)}
                </span>
                <span className="text-[10px] font-mono text-stone-500 block">
                  R&sup2;: {testMetrics.r2.toFixed(3)}
                </span>
              </div>
            </div>

            {/* Error Spectrum mini table across degrees */}
            <div className="space-y-1 pt-1 border-t border-stone-800/60">
              <span className="text-[10px] font-mono text-stone-400 block mb-1">
                Train vs Test MSE across degrees:
              </span>
              <div className="grid grid-cols-7 gap-1 text-[10px] font-mono text-center">
                {degreeCurves.map((c) => (
                  <div
                    key={`bar-${c.deg}`}
                    onClick={() => setDegree(c.deg)}
                    className={`p-1 rounded cursor-pointer transition-all border ${
                      c.deg === degree
                        ? 'border-amber-400 bg-amber-950/40 font-bold text-stone-100'
                        : 'border-stone-800 bg-stone-950/50 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <div>d={c.deg}</div>
                    <div className="text-[9px] text-stone-500">{c.trainMse.toFixed(1)}</div>
                    <div
                      className={`text-[9px] ${c.testMse > 20 ? 'text-rose-400' : 'text-amber-300'}`}
                    >
                      {c.testMse.toFixed(1)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
