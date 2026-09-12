import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Slider } from '@/components/ui/Slider';
import {
  predictLWR,
  predictLWRTrace,
  computeGaussianWeights,
} from '@/engines/regression/locally-weighted';
import type { DataPoint1D } from '@/engines/regression/linear';
import { Sparkles, AlertTriangle, Crosshair, Waves } from 'lucide-react';

// Non-linear trajectory dataset
const SAMPLE_POINTS: DataPoint1D[] = [
  { x: 1.0, y: 14.5 },
  { x: 1.6, y: 18.2 },
  { x: 2.3, y: 20.8 },
  { x: 3.0, y: 17.5 },
  { x: 3.8, y: 11.2 },
  { x: 4.5, y: 5.8 },
  { x: 5.2, y: 4.1 },
  { x: 6.0, y: 6.5 },
  { x: 6.8, y: 11.8 },
  { x: 7.5, y: 17.2 },
  { x: 8.2, y: 20.4 },
  { x: 9.0, y: 18.1 },
  { x: 9.8, y: 13.5 },
];

export function LocallyWeightedLab() {
  const [tau, setTau] = useState<number>(0.65);
  const [queryX, setQueryX] = useState<number>(4.5);

  // Predict at active query point x_0
  const lwrResult = useMemo(() => predictLWR(SAMPLE_POINTS, queryX, tau), [queryX, tau]);

  // Compute Gaussian weights for each point
  const pointWeights = useMemo(
    () => computeGaussianWeights(SAMPLE_POINTS, queryX, tau),
    [queryX, tau]
  );

  // Compute smooth trace curve across 80 points
  const trace = useMemo(() => {
    const grid: number[] = [];
    const steps = 80;
    for (let i = 0; i <= steps; i++) {
      grid.push(1.0 + (i / steps) * 8.8);
    }
    return predictLWRTrace(SAMPLE_POINTS, grid, tau);
  }, [tau]);

  // SVG coordinate projection
  const svgWidth = 560;
  const svgHeight = 340;
  const padL = 40;
  const padR = 25;
  const padT = 25;
  const padB = 40;

  const toSvgX = (x: number) => padL + ((x - 0.5) / 10.0) * (svgWidth - padL - padR);
  const toSvgY = (y: number) => svgHeight - padB - ((y - 0) / 25) * (svgHeight - padT - padB);

  // Generate trace path
  const tracePath = useMemo(() => {
    return trace.reduce(
      (acc, p, i) =>
        `${acc} ${i === 0 ? 'M' : 'L'} ${toSvgX(p.x).toFixed(1)},${toSvgY(p.y).toFixed(1)}`,
      ''
    );
  }, [trace]);

  // Gaussian Bell Curve overlay path centered at queryX
  const bellCurvePath = useMemo(() => {
    let d = '';
    const steps = 60;
    const span = Math.min(4.5, tau * 3.5);
    const startX = Math.max(0.5, queryX - span);
    const endX = Math.min(10.5, queryX + span);
    const stepSize = (endX - startX) / steps;

    for (let i = 0; i <= steps; i++) {
      const x = startX + i * stepSize;
      const diff = x - queryX;
      const weight = Math.exp(-(diff * diff) / (2 * tau * tau));
      // Map weight [0, 1] to height [0, 80px] above ground
      const screenX = toSvgX(x);
      const screenY = svgHeight - padB - weight * 60;
      d += `${i === 0 ? 'M' : 'L'} ${screenX.toFixed(1)},${screenY.toFixed(1)} `;
    }
    return d;
  }, [queryX, tau]);

  // Local tangent line at queryX
  const tangentLine = useMemo(() => {
    const halfSpan = 1.0;
    const x1 = Math.max(0.8, queryX - halfSpan);
    const y1 = lwrResult.theta0 + lwrResult.theta1 * x1;
    const x2 = Math.min(10.2, queryX + halfSpan);
    const y2 = lwrResult.theta0 + lwrResult.theta1 * x2;
    return {
      x1: toSvgX(x1),
      y1: toSvgY(y1),
      x2: toSvgX(x2),
      y2: toSvgY(y2),
    };
  }, [queryX, lwrResult]);

  // Effective neighbor count (w > 0.1)
  const activeNeighborCount = pointWeights.filter((w) => w >= 0.1).length;

  return (
    <Card className="p-6 border-stone-800 bg-[#0c0a09] space-y-6 shadow-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <h3 className="font-montserrat text-lg font-bold text-stone-100">
              Locally Weighted Linear Regression (LWR) Kernel Lab
            </h3>
          </div>
          <p className="text-xs text-stone-400 mt-1 font-sans">
            A non-parametric algorithm that fits a custom weighted tangent at query x<sub>0</sub>{' '}
            using a Gaussian bell kernel w<sub>i</sub> = exp(-(x<sub>i</sub> - x<sub>0</sub>)&sup2;
            / 2&tau;&sup2;).
          </p>
        </div>

        {/* Presets */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTau(4.0)}
            className="text-xs h-7 border-stone-800 text-stone-400 hover:text-stone-200 rounded-lg rounded-br-none"
          >
            Underfitting (&tau;=4.0)
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setTau(0.65)}
            className="text-xs h-7 gap-1 bg-stone-100 text-stone-950 hover:bg-stone-200 rounded-lg rounded-br-none font-semibold"
          >
            <Sparkles className="size-3 text-amber-500" />
            Optimal (&tau;=0.65)
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTau(0.12)}
            className="text-xs h-7 gap-1 border-rose-800/60 bg-rose-950/20 text-rose-300 hover:bg-rose-900/40 rounded-lg rounded-br-none"
          >
            <AlertTriangle className="size-3" />
            Fail: Jagged (&tau;=0.12)
          </Button>
        </div>
      </div>

      {/* Main Grid: Visual Arena + Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: SVG Canvas (2 cols) */}
        <div className="lg:col-span-2 p-4 rounded-xl border border-stone-800 bg-stone-950/80 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="w-full flex items-center justify-between text-xs text-stone-400 pb-2 border-b border-stone-800/60 mb-2">
            <span className="font-montserrat font-semibold text-stone-200 flex items-center gap-1.5">
              <Waves className="size-3.5 text-amber-400" />
              Non-Parametric LWR Trace &amp; Gaussian Kernel Envelope
            </span>
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="text-amber-400">Bell Envelope (w)</span>
              <span className="text-emerald-400">Local Tangent Line</span>
            </div>
          </div>

          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto max-h-[380px] select-none"
          >
            {/* Grid Lines */}
            {[5, 10, 15, 20].map((yVal) => (
              <line
                key={`ygrid-${yVal}`}
                x1={padL}
                y1={toSvgY(yVal)}
                x2={svgWidth - padR}
                y2={toSvgY(yVal)}
                stroke="#292524"
                strokeDasharray="3 3"
              />
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

            {/* Gaussian Weighting Bell Curve Fill */}
            <path
              d={bellCurvePath}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="1.8"
              strokeDasharray="4 3"
            />

            {/* Non-parametric Fitted LWR Curve */}
            <path
              d={tracePath}
              fill="none"
              stroke={tau <= 0.15 ? '#f43f5e' : '#f59e0b'}
              strokeWidth="2.5"
            />

            {/* Local Tangent Line at query point */}
            <line
              x1={tangentLine.x1}
              y1={tangentLine.y1}
              x2={tangentLine.x2}
              y2={tangentLine.y2}
              stroke="#10b981"
              strokeWidth="3"
            />

            {/* Query Vertical Crosshair line */}
            <line
              x1={toSvgX(queryX)}
              y1={padT}
              x2={toSvgX(queryX)}
              y2={svgHeight - padB}
              stroke="#38bdf8"
              strokeWidth="1"
              strokeDasharray="2 2"
            />

            {/* Query Point Prediction Marker */}
            <circle
              cx={toSvgX(queryX)}
              cy={toSvgY(lwrResult.predictedY)}
              r="6"
              fill="#38bdf8"
              stroke="#0c0a09"
              strokeWidth="1.5"
            />

            {/* Training Points with Opacity Scaled to Gaussian Weight */}
            {SAMPLE_POINTS.map((pt, idx) => {
              const weight = pointWeights[idx] || 0.05;
              const opacity = Math.max(0.15, weight);
              return (
                <g key={`pt-${idx}`}>
                  <circle
                    cx={toSvgX(pt.x)}
                    cy={toSvgY(pt.y)}
                    r={5 + weight * 3}
                    fill="#fafaf9"
                    opacity={opacity}
                    stroke="#0c0a09"
                    strokeWidth="1.5"
                  />
                  {weight > 0.25 && (
                    <text
                      x={toSvgX(pt.x)}
                      y={toSvgY(pt.y) - 9}
                      fill="#f59e0b"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {weight.toFixed(2)}
                    </text>
                  )}
                </g>
              );
            })}

            <text
              x={svgWidth / 2}
              y={svgHeight - 10}
              fill="#a8a29e"
              fontSize="10"
              fontFamily="sans-serif"
              textAnchor="middle"
            >
              Query Domain X
            </text>
          </svg>
        </div>

        {/* Right: Sliders & Telemetry Readout */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/40 space-y-4">
            <h4 className="font-montserrat text-xs font-bold text-stone-300 uppercase tracking-wider">
              Hyperparameter &amp; Probe Controls
            </h4>

            {/* Bandwidth Tau */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-stone-300">Bandwidth (&tau;)</span>
                <span className="font-mono font-bold text-amber-300">{tau.toFixed(2)}</span>
              </div>
              <Slider
                label="Bandwidth parameter (\u03c4)"
                min={0.1}
                max={3.0}
                step={0.05}
                value={tau}
                onChange={setTau}
              />
            </div>

            {/* Query Point Coordinate X_0 */}
            <div className="space-y-1 pt-2 border-t border-stone-800/60">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-stone-300">
                  Probe Location (x<sub>0</sub>)
                </span>
                <span className="font-mono font-bold text-sky-400">{queryX.toFixed(2)}</span>
              </div>
              <Slider
                label="Query coordinate (x0)"
                min={1.2}
                max={9.5}
                step={0.1}
                value={queryX}
                onChange={setQueryX}
              />
            </div>
          </div>

          {/* Local Telemetry Card */}
          <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/40 space-y-3">
            <h4 className="font-montserrat text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center justify-between">
              <span>Local Probe Telemetry</span>
              <Crosshair className="size-3.5 text-stone-400" />
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded bg-stone-950 border border-stone-800 space-y-0.5">
                <span className="text-[10px] font-mono text-stone-400 block">
                  Predicted ŷ(x<sub>0</sub>)
                </span>
                <span className="font-mono font-bold text-sky-400">{lwrResult.predictedY}</span>
              </div>

              <div className="p-2 rounded bg-stone-950 border border-stone-800 space-y-0.5">
                <span className="text-[10px] font-mono text-stone-400 block">
                  Local Slope (&theta;<sub>1</sub>)
                </span>
                <span className="font-mono font-bold text-emerald-400">{lwrResult.theta1}</span>
              </div>
            </div>

            <div className="p-2.5 rounded bg-stone-950 border border-stone-800 flex items-center justify-between text-xs">
              <span className="font-mono text-stone-400">Active Neighbors (w &gt; 0.1):</span>
              <Badge
                variant="outline"
                className="font-mono border-amber-500/50 text-amber-300 text-[10px]"
              >
                {activeNeighborCount} of {SAMPLE_POINTS.length} points
              </Badge>
            </div>

            <div className="p-3 rounded-lg border border-stone-800 bg-stone-950/60 text-xs text-stone-400 space-y-1">
              <span className="font-semibold text-stone-200 block">Non-Parametric Reality:</span>
              <p className="text-[11px] leading-relaxed">
                Notice that LWR does not yield a single compact equation &theta;. To make a
                prediction for any new x<sub>0</sub>, you must recompute weights against the entire
                training dataset.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
