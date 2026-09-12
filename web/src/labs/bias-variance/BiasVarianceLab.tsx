import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { SeededRNG } from '@/utils/rng';
import { fitPolynomialRegression, predictPolynomial } from '@/engines/regression/polynomial';
import type { DataPoint1D } from '@/engines/regression/linear';
import { Sparkles, AlertTriangle, Target, Layers } from 'lucide-react';

export function BiasVarianceLab() {
  const [complexity, setComplexity] = useState<number>(3); // Degree 1 to 6
  const numDatasets = 15;

  // Generate N independent simulated training sets from true curve: f(x) = sin(x) * 6 + 10 + N(0, 1.5)
  const trueFunction = (x: number) => Math.sin(x * 0.8) * 6 + 10;

  const simulatedModels = useMemo(() => {
    const rng = new SeededRNG(1337);
    const models: { coeffs: number[]; points: DataPoint1D[] }[] = [];
    const sampleSize = 10;
    const xMin = 1;
    const xMax = 9;

    for (let setIdx = 0; setIdx < numDatasets; setIdx++) {
      const points: DataPoint1D[] = [];
      for (let i = 0; i < sampleSize; i++) {
        const x = xMin + (i / (sampleSize - 1)) * (xMax - xMin);
        const noise = rng.nextFloat(-2.2, 2.2);
        const y = trueFunction(x) + noise;
        points.push({ x, y });
      }

      const m = fitPolynomialRegression(points, complexity);
      models.push({ coeffs: m.coefficients, points });
    }

    return models;
  }, [complexity, numDatasets]);

  // Compute Bias^2, Variance, and Total Error at test query grid
  const decomposition = useMemo(() => {
    const testPoints = [2.0, 3.5, 5.0, 6.5, 8.0];
    let totalBiasSq = 0;
    let totalVar = 0;
    const irreducibeError = 1.8; // sigma^2

    testPoints.forEach((x) => {
      const trueY = trueFunction(x);
      const preds = simulatedModels.map((m) => predictPolynomial(m.coeffs, x));
      const meanPred = preds.reduce((acc, p) => acc + p, 0) / preds.length;

      // Bias^2 = (E[f_hat] - f)^2
      const bias = meanPred - trueY;
      totalBiasSq += bias * bias;

      // Var = E[(f_hat - E[f_hat])^2]
      const variance = preds.reduce((acc, p) => acc + (p - meanPred) ** 2, 0) / preds.length;
      totalVar += variance;
    });

    const avgBiasSq = totalBiasSq / testPoints.length;
    const avgVar = totalVar / testPoints.length;
    const totalExpectedError = avgBiasSq + avgVar + irreducibeError;

    return {
      biasSq: Number(avgBiasSq.toFixed(2)),
      variance: Number(avgVar.toFixed(2)),
      irreducibeError,
      totalExpectedError: Number(totalExpectedError.toFixed(2)),
    };
  }, [simulatedModels]);

  // Theoretical U-curve precomputed points across degrees 1 to 6
  const uCurveData = [
    { deg: 1, biasSq: 14.2, variance: 0.8, total: 16.8 },
    { deg: 2, biasSq: 6.5, variance: 1.4, total: 9.7 },
    { deg: 3, biasSq: 1.2, variance: 2.1, total: 5.1 }, // Optimal sweet spot
    { deg: 4, biasSq: 0.8, variance: 4.8, total: 7.4 },
    { deg: 5, biasSq: 0.5, variance: 9.6, total: 11.9 },
    { deg: 6, biasSq: 0.3, variance: 18.2, total: 20.3 },
  ];

  // SVG dimensions
  const svgWidth = 540;
  const svgHeight = 320;
  const padL = 40;
  const padR = 20;
  const padT = 20;
  const padB = 35;

  const toSvgX = (x: number) => padL + ((x - 0.5) / 9.5) * (svgWidth - padL - padR);
  const toSvgY = (y: number) => svgHeight - padB - ((y - 0) / 22) * (svgHeight - padT - padB);

  // Generate paths for each of the N fitted models
  const modelPaths = useMemo(() => {
    const xMin = 1.0;
    const xMax = 9.0;
    const steps = 60;
    const stepSize = (xMax - xMin) / steps;

    return simulatedModels.map((m) => {
      let d = '';
      for (let i = 0; i <= steps; i++) {
        const x = xMin + i * stepSize;
        const y = predictPolynomial(m.coeffs, x);
        const px = toSvgX(x);
        const py = toSvgY(y);
        d += `${i === 0 ? 'M' : 'L'} ${px.toFixed(1)},${py.toFixed(1)} `;
      }
      return d;
    });
  }, [simulatedModels]);

  // Generate true curve path
  const trueCurvePath = useMemo(() => {
    let d = '';
    const steps = 80;
    for (let i = 0; i <= steps; i++) {
      const x = 1.0 + (i / steps) * 8.0;
      const y = trueFunction(x);
      d += `${i === 0 ? 'M' : 'L'} ${toSvgX(x).toFixed(1)},${toSvgY(y).toFixed(1)} `;
    }
    return d;
  }, []);

  return (
    <Card className="p-6 border-stone-800 bg-[#0c0a09] space-y-6 shadow-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <h3 className="font-montserrat text-lg font-bold text-stone-100">
              Bias-Variance Ensemble Decomposition Arena
            </h3>
          </div>
          <p className="text-xs text-stone-400 mt-1 font-sans">
            Observe {numDatasets} models trained on different draws of the same world. Witness how
            underfitting bundles tightly with high error, while overfitting splays in high variance.
          </p>
        </div>

        {/* Presets */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setComplexity(1)}
            className="text-xs h-7 border-stone-800 text-stone-400 hover:text-stone-200 rounded-lg rounded-br-none"
          >
            High Bias (d=1)
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setComplexity(3)}
            className="text-xs h-7 gap-1 bg-stone-100 text-stone-950 hover:bg-stone-200 rounded-lg rounded-br-none font-semibold"
          >
            <Sparkles className="size-3 text-amber-500" />
            Sweet Spot (d=3)
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setComplexity(6)}
            className="text-xs h-7 gap-1 border-rose-800/60 bg-rose-950/20 text-rose-300 hover:bg-rose-900/40 rounded-lg rounded-br-none"
          >
            <AlertTriangle className="size-3" />
            High Variance (d=6)
          </Button>
        </div>
      </div>

      {/* Main Grid: Ensemble Spaghetti Curves + U-Curve Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Ensemble Model Bundle (2 cols) */}
        <div className="lg:col-span-2 p-4 rounded-xl border border-stone-800 bg-stone-950/80 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="w-full flex items-center justify-between text-xs text-stone-400 pb-2 border-b border-stone-800/60 mb-2">
            <span className="font-montserrat font-semibold text-stone-200 flex items-center gap-1.5">
              <Layers className="size-3.5 text-amber-400" />
              {numDatasets} Fitted Models Across Independent Datasets
            </span>
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-0.5 bg-emerald-400 inline-block" />
                True Ground Truth f(x)
              </span>
              <span className="flex items-center gap-1.5 text-amber-300/60">
                <span className="w-2.5 h-0.5 bg-amber-300/60 inline-block" />
                Individual Fits f̂(x)
              </span>
            </div>
          </div>

          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto max-h-[380px] select-none"
          >
            {/* Ground Truth True Curve */}
            <path d={trueCurvePath} fill="none" stroke="#10b981" strokeWidth="3.5" />

            {/* Individual Model Curves */}
            {modelPaths.map((dStr, idx) => (
              <path
                key={`m-${idx}`}
                d={dStr}
                fill="none"
                stroke={complexity >= 5 ? '#f43f5e' : '#f59e0b'}
                strokeWidth="1.2"
                opacity={0.35}
              />
            ))}

            {/* Axis text */}
            <text
              x={svgWidth / 2}
              y={svgHeight - 10}
              fill="#a8a29e"
              fontSize="10"
              fontFamily="sans-serif"
              textAnchor="middle"
            >
              Feature X
            </text>
          </svg>
        </div>

        {/* Right: Interactive Sliders & Decomposition Readout */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/40 space-y-4">
            <h4 className="font-montserrat text-xs font-bold text-stone-300 uppercase tracking-wider">
              Model Complexity Control
            </h4>

            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-stone-300">Degree / Capacity</span>
                <span className="font-mono font-bold text-amber-300">{complexity}</span>
              </div>
              <Slider
                label="Model Degree / Capacity"
                min={1}
                max={6}
                step={1}
                value={complexity}
                onChange={setComplexity}
              />
            </div>
          </div>

          {/* Mathematical Decomposition Card */}
          <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/40 space-y-3">
            <h4 className="font-montserrat text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center justify-between">
              <span>Expected Error Decomposition</span>
              <Target className="size-3.5 text-stone-400" />
            </h4>

            <div className="space-y-2 text-xs">
              <div className="p-2 rounded bg-stone-950 border border-stone-800 flex items-center justify-between">
                <span className="font-mono text-stone-400">Bias&sup2; (Underfitting)</span>
                <span
                  className={`font-mono font-bold ${decomposition.biasSq > 5 ? 'text-rose-400' : 'text-stone-200'}`}
                >
                  {decomposition.biasSq}
                </span>
              </div>

              <div className="p-2 rounded bg-stone-950 border border-stone-800 flex items-center justify-between">
                <span className="font-mono text-stone-400">Variance (Overfitting)</span>
                <span
                  className={`font-mono font-bold ${decomposition.variance > 5 ? 'text-rose-400' : 'text-stone-200'}`}
                >
                  {decomposition.variance}
                </span>
              </div>

              <div className="p-2 rounded bg-stone-950 border border-stone-800 flex items-center justify-between">
                <span className="font-mono text-stone-400">Irreducible Noise &sigma;&sup2;</span>
                <span className="font-mono font-bold text-stone-400">
                  {decomposition.irreducibeError}
                </span>
              </div>

              <div className="p-2.5 rounded bg-stone-950 border border-amber-500/40 flex items-center justify-between font-mono">
                <span className="text-amber-300 font-semibold">Total Test Error</span>
                <span className="text-stone-100 font-bold">{decomposition.totalExpectedError}</span>
              </div>
            </div>

            {/* U-Curve Spectrum mini readout */}
            <div className="pt-2 border-t border-stone-800/60">
              <span className="text-[10px] font-mono text-stone-400 block mb-1">
                The Classic U-Shaped Error Curve:
              </span>
              <div className="grid grid-cols-6 gap-1 text-[9px] font-mono text-center">
                {uCurveData.map((d) => (
                  <div
                    key={`u-${d.deg}`}
                    onClick={() => setComplexity(d.deg)}
                    className={`p-1 rounded cursor-pointer border ${
                      d.deg === complexity
                        ? 'border-amber-400 bg-amber-950/40 font-bold text-stone-100'
                        : 'border-stone-800 bg-stone-950/40 text-stone-400'
                    }`}
                  >
                    <div>d={d.deg}</div>
                    <div className={d.deg === 3 ? 'text-emerald-400 font-bold' : ''}>{d.total}</div>
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
