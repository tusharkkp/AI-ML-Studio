import { useState, useMemo, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Slider } from '@/components/ui/Slider';
import { Toggle } from '@/components/ui/Toggle';
import {
  SALARY_DATA,
  runGradientDescent,
  fitSimpleLinearRegression,
  normalizeFeatures,
  computeCost,
} from '@/engines/regression/linear';
import type {
  DataPoint1D,
  GradientDescentVariant,
  GradientDescentResult,
} from '@/engines/regression/linear';
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  AlertTriangle,
  Sparkles,
  TrendingDown,
  Layers,
  Activity,
} from 'lucide-react';

export function GradientDescentLab() {
  const [useNormalization, setUseNormalization] = useState<boolean>(true);
  const [learningRate, setLearningRate] = useState<number>(0.15);
  const [variant, setVariant] = useState<GradientDescentVariant>('batch');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeedMs, setPlaySpeedMs] = useState<number>(150);
  const [activeTab, setActiveTab] = useState<'contour' | 'fit'>('contour');

  const timerRef = useRef<number | null>(null);

  // Active dataset (normalized vs raw)
  const normalizedData = useMemo(() => normalizeFeatures(SALARY_DATA), []);
  const activePoints: DataPoint1D[] = useMemo(() => {
    return useNormalization ? normalizedData.normalized : SALARY_DATA;
  }, [useNormalization, normalizedData]);

  // Compute analytical OLS on active points
  const olsModel = useMemo(() => fitSimpleLinearRegression(activePoints), [activePoints]);

  // Initial starting parameters
  const [initT0, setInitT0] = useState<number>(() => (useNormalization ? -2.0 : 0));
  const [initT1, setInitT1] = useState<number>(() => (useNormalization ? -2.0 : 0));

  // Run descent trajectory
  const gdResult: GradientDescentResult = useMemo(() => {
    return runGradientDescent(activePoints, {
      learningRate,
      maxIterations: 60,
      initialTheta0: initT0,
      initialTheta1: initT1,
      variant,
      batchSize: 4,
      tolerance: 1e-4,
    });
  }, [activePoints, learningRate, initT0, initT1, variant]);

  // Steps available
  const steps = gdResult.steps;
  const maxStepIdx = Math.max(0, steps.length - 1);

  // Current active step
  const activeStep = steps[Math.min(currentStepIndex, maxStepIdx)] || {
    iteration: 0,
    theta0: initT0,
    theta1: initT1,
    gradTheta0: 0,
    gradTheta1: 0,
    cost: computeCost(activePoints, initT0, initT1),
  };

  // Playback timer loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= maxStepIdx) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playSpeedMs);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, maxStepIdx, playSpeedMs]);

  // Reset steps on config changes
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [learningRate, variant, useNormalization, initT0, initT1]);

  // Presets
  const applyPreset = (type: 'slow' | 'optimal' | 'diverge' | 'oscillate') => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    if (useNormalization) {
      setInitT0(-2.0);
      setInitT1(-2.0);
      if (type === 'slow') setLearningRate(0.01);
      else if (type === 'optimal') setLearningRate(0.2);
      else if (type === 'oscillate') setLearningRate(0.95);
      else if (type === 'diverge') setLearningRate(2.3);
    } else {
      setInitT0(0);
      setInitT1(0);
      if (type === 'slow') setLearningRate(0.001);
      else if (type === 'optimal') setLearningRate(0.02);
      else if (type === 'oscillate') setLearningRate(0.045);
      else if (type === 'diverge') setLearningRate(0.08);
    }
  };

  // Calculate Gradient Magnitude: ||grad J|| = sqrt(g0^2 + g1^2)
  const gradNorm = Math.sqrt(
    activeStep.gradTheta0 * activeStep.gradTheta0 + activeStep.gradTheta1 * activeStep.gradTheta1
  );

  // SVG dimensions for contour visualization
  const svgWidth = 520;
  const svgHeight = 340;

  // Contour bounds centered around OLS
  const contourBounds = useMemo(() => {
    const t0Span = useNormalization ? 3.5 : 40;
    const t1Span = useNormalization ? 3.5 : 20;
    return {
      t0Min: olsModel.theta0 - t0Span,
      t0Max: olsModel.theta0 + t0Span,
      t1Min: olsModel.theta1 - t1Span,
      t1Max: olsModel.theta1 + t1Span,
    };
  }, [olsModel, useNormalization]);

  const toContourX = (t0: number) =>
    40 +
    ((t0 - contourBounds.t0Min) / (contourBounds.t0Max - contourBounds.t0Min)) * (svgWidth - 60);

  const toContourY = (t1: number) =>
    svgHeight -
    30 -
    ((t1 - contourBounds.t1Min) / (contourBounds.t1Max - contourBounds.t1Min)) * (svgHeight - 50);

  // Data fit SVG bounds
  const fitBounds = useMemo(() => {
    const xs = activePoints.map((p) => p.x);
    const ys = activePoints.map((p) => p.y);
    return {
      xMin: Math.min(...xs) - 0.5,
      xMax: Math.max(...xs) + 0.5,
      yMin: Math.min(...ys) - 0.5,
      yMax: Math.max(...ys) + 0.5,
    };
  }, [activePoints]);

  const toFitX = (x: number) =>
    45 + ((x - fitBounds.xMin) / (fitBounds.xMax - fitBounds.xMin)) * (svgWidth - 65);
  const toFitY = (y: number) =>
    svgHeight - 35 - ((y - fitBounds.yMin) / (fitBounds.yMax - fitBounds.yMin)) * (svgHeight - 55);

  return (
    <Card className="p-6 border-stone-800 bg-[#0c0a09] space-y-6 shadow-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <h3 className="font-montserrat text-lg font-bold text-stone-100">
              Interactive Gradient Descent Dynamics &amp; Loss Trajectory Lab
            </h3>
          </div>
          <p className="text-xs text-stone-400 mt-1 font-sans">
            Simulate parameter updates &theta; := &theta; - &alpha; &nabla;J on the cost surface.
            Experiment with learning rates and feature normalization.
          </p>
        </div>

        {/* Feature Normalization Toggle */}
        <div className="flex items-center gap-2 bg-stone-900/80 px-3 py-1.5 rounded-lg border border-stone-800">
          <Toggle
            label="Z-Score Normalization"
            checked={useNormalization}
            onChange={(val) => {
              setUseNormalization(val);
              setLearningRate(val ? 0.15 : 0.02);
              setInitT0(val ? -2.0 : 0);
              setInitT1(val ? -2.0 : 0);
            }}
          />
        </div>
      </div>

      {/* Preset Action Bar & Variant Selector */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          {/* Variant Selector */}
          <div className="flex items-center gap-1 bg-stone-900/70 p-1 rounded-lg border border-stone-800">
            {(['batch', 'mini-batch', 'stochastic'] as GradientDescentVariant[]).map((v) => (
              <button
                key={v}
                onClick={() => setVariant(v)}
                className={`px-3 py-1 text-xs font-mono rounded capitalize transition-all ${
                  variant === v
                    ? 'bg-stone-100 text-stone-950 font-semibold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {v === 'batch' ? 'Batch GD' : v === 'mini-batch' ? 'Mini-Batch (b=4)' : 'SGD (b=1)'}
              </button>
            ))}
          </div>

          {/* View Tab */}
          <div className="flex items-center gap-1 bg-stone-900/70 p-1 rounded-lg border border-stone-800">
            <button
              onClick={() => setActiveTab('contour')}
              className={`px-3 py-1 text-xs font-mono rounded transition-all flex items-center gap-1.5 ${
                activeTab === 'contour'
                  ? 'bg-stone-100 text-stone-950 font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Layers className="size-3.5" />
              Loss Contour &amp; Path
            </button>
            <button
              onClick={() => setActiveTab('fit')}
              className={`px-3 py-1 text-xs font-mono rounded transition-all flex items-center gap-1.5 ${
                activeTab === 'fit'
                  ? 'bg-stone-100 text-stone-950 font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Activity className="size-3.5" />
              Data Space Line Fit
            </button>
          </div>
        </div>

        {/* Learning Rate Dynamic Presets */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyPreset('slow')}
            className="text-xs h-7 border-stone-800 text-stone-400 hover:text-stone-200 rounded-lg rounded-br-none"
          >
            Too Slow (&alpha; tiny)
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => applyPreset('optimal')}
            className="text-xs h-7 gap-1 bg-stone-100 text-stone-950 hover:bg-stone-200 rounded-lg rounded-br-none font-semibold"
          >
            <Sparkles className="size-3 text-amber-500" />
            Optimal &alpha;
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyPreset('oscillate')}
            className="text-xs h-7 border-amber-800/60 bg-amber-950/20 text-amber-300 hover:bg-amber-900/40 rounded-lg rounded-br-none"
          >
            Oscillate
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyPreset('diverge')}
            className="text-xs h-7 gap-1 border-rose-800/60 bg-rose-950/20 text-rose-300 hover:bg-rose-900/40 rounded-lg rounded-br-none"
          >
            <AlertTriangle className="size-3" />
            Fail: Diverge!
          </Button>
        </div>
      </div>

      {/* Main Dual View Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Arena (2 cols) */}
        <div className="lg:col-span-2 p-4 rounded-xl border border-stone-800 bg-stone-950/80 flex flex-col items-center justify-center relative overflow-hidden">
          {activeTab === 'contour' ? (
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto max-h-[380px] select-none"
            >
              {/* Elliptical Loss Contours centered at OLS */}
              {[0.15, 0.35, 0.6, 0.9, 1.3, 1.8, 2.5].map((scale, idx) => {
                const rx = scale * (useNormalization ? 45 : 35);
                const ry = scale * (useNormalization ? 45 : 65); // Stretched when unnormalized
                return (
                  <ellipse
                    key={`ellipse-${idx}`}
                    cx={toContourX(olsModel.theta0)}
                    cy={toContourY(olsModel.theta1)}
                    rx={rx}
                    ry={ry}
                    fill="none"
                    stroke="#292524"
                    strokeWidth="1.2"
                    strokeDasharray={idx % 2 === 0 ? '4 3' : undefined}
                  />
                );
              })}

              {/* Center OLS Optimal Star */}
              <g
                transform={`translate(${toContourX(olsModel.theta0)}, ${toContourY(olsModel.theta1)})`}
              >
                <circle r="5" fill="#10b981" />
                <circle r="8" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" />
              </g>

              {/* Descent Trajectory Path */}
              {steps.slice(0, currentStepIndex + 1).map((st, i) => {
                if (i === 0) return null;
                const prev = steps[i - 1]!;
                const x1 = toContourX(prev.theta0);
                const y1 = toContourY(prev.theta1);
                const x2 = toContourX(st.theta0);
                const y2 = toContourY(st.theta1);

                return (
                  <g key={`traj-${i}`}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={variant === 'stochastic' ? '#38bdf8' : '#f59e0b'}
                      strokeWidth="2"
                    />
                    <circle cx={x2} cy={y2} r="2.5" fill="#f59e0b" />
                  </g>
                );
              })}

              {/* Active Pulsing Marker */}
              <g
                transform={`translate(${toContourX(activeStep.theta0)}, ${toContourY(activeStep.theta1)})`}
              >
                <circle r="7" fill="#f43f5e" />
                <circle
                  r="12"
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="1.5"
                  className="animate-ping"
                />
              </g>

              {/* Axis text */}
              <text
                x={svgWidth / 2}
                y={svgHeight - 8}
                fill="#a8a29e"
                fontSize="11"
                fontFamily="sans-serif"
                textAnchor="middle"
              >
                Parameter &theta;<sub>0</sub> (Intercept)
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
                Parameter &theta;<sub>1</sub> (Slope)
              </text>
            </svg>
          ) : (
            /* Data Space Line Fit */
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto max-h-[380px] select-none"
            >
              {/* Axes */}
              <line
                x1={45}
                y1={svgHeight - 35}
                x2={svgWidth - 20}
                y2={svgHeight - 35}
                stroke="#44403c"
                strokeWidth="1.5"
              />
              <line
                x1={45}
                y1={20}
                x2={45}
                y2={svgHeight - 35}
                stroke="#44403c"
                strokeWidth="1.5"
              />

              {/* Scatter Points */}
              {activePoints.map((p, i) => (
                <circle
                  key={`pt-${i}`}
                  cx={toFitX(p.x)}
                  cy={toFitY(p.y)}
                  r="4"
                  fill="#fafaf9"
                  stroke="#0c0a09"
                  strokeWidth="1"
                />
              ))}

              {/* Regression line at current step */}
              {(() => {
                const x1 = fitBounds.xMin;
                const y1 = activeStep.theta0 + activeStep.theta1 * x1;
                const x2 = fitBounds.xMax;
                const y2 = activeStep.theta0 + activeStep.theta1 * x2;
                return (
                  <line
                    x1={toFitX(x1)}
                    y1={toFitY(y1)}
                    x2={toFitX(x2)}
                    y2={toFitY(y2)}
                    stroke="#f59e0b"
                    strokeWidth="2.5"
                  />
                );
              })()}

              <text
                x={svgWidth / 2}
                y={svgHeight - 8}
                fill="#a8a29e"
                fontSize="11"
                fontFamily="sans-serif"
                textAnchor="middle"
              >
                Feature X {useNormalization ? '(Z-Score Normalized)' : '(Years Experience)'}
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
                Target y {useNormalization ? '(Z-Score Normalized)' : '(Salary $k)'}
              </text>
            </svg>
          )}

          {/* Diverged or Converged Overlay Banner */}
          {gdResult.diverged && currentStepIndex >= gdResult.iterationsCompleted && (
            <div className="absolute top-4 left-4 right-4 p-3 rounded-lg border border-rose-500 bg-rose-950/90 text-rose-200 text-xs font-mono flex items-center gap-2">
              <AlertTriangle className="size-4 shrink-0 text-rose-400" />
              <span>
                <strong>Divergence Triggered!</strong> Learning rate &alpha; = {learningRate} caused
                steps to overshoot the paraboloid valley. Cost J(&theta;) escalated exponentially.
              </span>
            </div>
          )}

          {gdResult.converged && currentStepIndex >= gdResult.iterationsCompleted && (
            <div className="absolute top-4 left-4 right-4 p-3 rounded-lg border border-emerald-500 bg-emerald-950/90 text-emerald-200 text-xs font-mono flex items-center gap-2">
              <Sparkles className="size-4 shrink-0 text-emerald-400" />
              <span>
                <strong>Convergence Reached!</strong> Gradient magnitude ||&nabla;J|| &lt; 0.0001.
                The parameters settled smoothly at the global minimum.
              </span>
            </div>
          )}
        </div>

        {/* Right Column: Playback Controls & Telemetry Readout */}
        <div className="space-y-4">
          {/* Playback Controls Card */}
          <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/40 space-y-4">
            <h4 className="font-montserrat text-xs font-bold text-stone-300 uppercase tracking-wider">
              Descent Execution Controls
            </h4>

            {/* Step & Play buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant={isPlaying ? 'outline' : 'primary'}
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
                className={`text-xs h-8 flex-1 gap-1.5 rounded-lg rounded-br-none font-semibold ${
                  isPlaying
                    ? 'border-amber-500 text-amber-300'
                    : 'bg-stone-100 text-stone-950 hover:bg-stone-200'
                }`}
              >
                {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
                {isPlaying ? 'Pause' : 'Play Descent'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={isPlaying || currentStepIndex >= maxStepIdx}
                onClick={() => setCurrentStepIndex((prev) => Math.min(maxStepIdx, prev + 1))}
                className="text-xs h-8 px-3 border-stone-800 text-stone-300 hover:text-stone-100 rounded-lg rounded-br-none"
              >
                <SkipForward className="size-3.5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStepIndex(0);
                }}
                className="text-xs h-8 px-3 border-stone-800 text-stone-400 hover:text-stone-200 rounded-lg rounded-br-none"
              >
                <RotateCcw className="size-3.5" />
              </Button>
            </div>

            {/* Timeline Progress Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-stone-400">Step (Iteration)</span>
                <span className="font-mono font-bold text-amber-300">
                  {currentStepIndex} / {maxStepIdx}
                </span>
              </div>
              <Slider
                label="Iteration Step"
                min={0}
                max={maxStepIdx}
                step={1}
                value={currentStepIndex}
                onChange={(val) => {
                  setIsPlaying(false);
                  setCurrentStepIndex(val);
                }}
              />
            </div>

            {/* Learning Rate Slider */}
            <div className="space-y-1.5 pt-2 border-t border-stone-800/60">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-stone-300">Learning Rate (&alpha;)</span>
                <span className="font-mono font-bold text-amber-300">
                  {learningRate.toFixed(4)}
                </span>
              </div>
              <Slider
                label="Learning Rate (&alpha;)"
                min={useNormalization ? 0.005 : 0.0005}
                max={useNormalization ? 2.5 : 0.1}
                step={useNormalization ? 0.01 : 0.001}
                value={learningRate}
                onChange={setLearningRate}
              />
            </div>

            {/* Animation Speed */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-800/60">
              <span className="font-mono text-stone-400">Speed</span>
              <div className="flex items-center gap-1 font-mono">
                {[
                  { label: '1x', ms: 300 },
                  { label: '2x', ms: 150 },
                  { label: '5x', ms: 50 },
                ].map((s) => (
                  <button
                    key={s.label}
                    onClick={() => setPlaySpeedMs(s.ms)}
                    className={`px-2 py-0.5 rounded text-[11px] ${
                      playSpeedMs === s.ms
                        ? 'bg-stone-200 text-stone-950 font-semibold'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Real-Time Telemetry Readout */}
          <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/40 space-y-3">
            <h4 className="font-montserrat text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center justify-between">
              <span>Optimization Telemetry</span>
              <Badge variant="outline" className="text-[10px] border-stone-700 font-mono">
                Step #{activeStep.iteration}
              </Badge>
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-stone-950 border border-stone-800 space-y-0.5">
                <span className="text-[10px] font-mono text-stone-400 flex items-center gap-1">
                  <TrendingDown className="size-3 text-amber-400" />
                  Cost J(&theta;)
                </span>
                <p className="font-mono font-bold text-stone-200">
                  {Number.isFinite(activeStep.cost)
                    ? activeStep.cost.toFixed(3)
                    : 'DIVERGED (&infin;)'}
                </p>
              </div>

              <div className="p-2 rounded-lg bg-stone-950 border border-stone-800 space-y-0.5">
                <span className="text-[10px] font-mono text-stone-400">
                  ||&nabla;J(&theta;)|| Norm
                </span>
                <p className="font-mono font-bold text-stone-200">
                  {Number.isFinite(gradNorm) ? gradNorm.toFixed(4) : '&infin;'}
                </p>
              </div>

              <div className="p-2 rounded-lg bg-stone-950 border border-stone-800 space-y-0.5">
                <span className="text-[10px] font-mono text-stone-400">
                  &theta;<sub>0</sub> (Intercept)
                </span>
                <p className="font-mono font-bold text-amber-300">{activeStep.theta0.toFixed(3)}</p>
              </div>

              <div className="p-2 rounded-lg bg-stone-950 border border-stone-800 space-y-0.5">
                <span className="text-[10px] font-mono text-stone-400">
                  &theta;<sub>1</sub> (Slope)
                </span>
                <p className="font-mono font-bold text-amber-300">{activeStep.theta1.toFixed(3)}</p>
              </div>
            </div>

            {/* Gradient Vector display */}
            <div className="p-2 rounded-lg bg-stone-950 border border-stone-800 font-mono text-[11px] text-stone-400">
              <span className="text-stone-500 block text-[10px]">Current Gradients:</span>
              &part;J/&part;&theta;<sub>0</sub> = {activeStep.gradTheta0.toFixed(3)},
              &part;J/&part;&theta;<sub>1</sub> = {activeStep.gradTheta1.toFixed(3)}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
