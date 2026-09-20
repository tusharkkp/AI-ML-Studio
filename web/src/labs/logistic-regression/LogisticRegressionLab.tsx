import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import {
  trainLogisticRegression,
  predictLogistic,
  computeDecisionBoundary,
  sigmoid,
} from '@/engines/classification/logistic';
import type { LogisticModel } from '@/engines/classification/logistic';
import { SeededRNG } from '@/utils/rng';
import { ZapOff, Zap, RefreshCw, Info } from 'lucide-react';

// ------- Dataset helpers --------------------------------------------------

interface Point {
  x: number;
  y: number;
  label: 0 | 1;
}

function makeSeparableDataset(): Point[] {
  const rng = new SeededRNG(42);
  const pts: Point[] = [];
  for (let i = 0; i < 8; i++) {
    pts.push({ x: rng.next() * 1.5 - 2.5, y: rng.next() * 1.5 - 2.5, label: 0 });
    pts.push({ x: rng.next() * 1.5 + 1.0, y: rng.next() * 1.5 + 1.0, label: 1 });
  }
  return pts;
}

function makeXorDataset(): Point[] {
  const rng = new SeededRNG(7);
  const pts: Point[] = [];
  const quadrants: [number, number, 0 | 1][] = [
    [-2.5, -2.5, 0],
    [1.0, 1.0, 0],
    [1.0, -2.5, 1],
    [-2.5, 1.0, 1],
  ];
  for (const [bx, by, label] of quadrants) {
    for (let i = 0; i < 4; i++) {
      pts.push({ x: bx + rng.next() * 1.2, y: by + rng.next() * 1.2, label });
    }
  }
  return pts;
}

// ------- Canvas dimensions -------------------------------------------------
const W = 480;
const H = 400;
const PAD = 32;
const DOMAIN: [number, number] = [-4, 4];

function worldToCanvas(wx: number, wy: number): [number, number] {
  const cx = PAD + ((wx - DOMAIN[0]) / (DOMAIN[1] - DOMAIN[0])) * (W - 2 * PAD);
  const cy = H - PAD - ((wy - DOMAIN[0]) / (DOMAIN[1] - DOMAIN[0])) * (H - 2 * PAD);
  return [cx, cy];
}

function canvasToWorld(cx: number, cy: number): [number, number] {
  const wx = DOMAIN[0] + ((cx - PAD) / (W - 2 * PAD)) * (DOMAIN[1] - DOMAIN[0]);
  const wy = DOMAIN[0] + ((H - PAD - cy) / (H - 2 * PAD)) * (DOMAIN[1] - DOMAIN[0]);
  return [wx, wy];
}

// ------- Lab component -----------------------------------------------------

export function LogisticRegressionLab() {
  const [points, setPoints] = useState<Point[]>(makeSeparableDataset);
  const [nextLabel, setNextLabel] = useState<0 | 1>(1);
  const [alpha, setAlpha] = useState<number>(0.3);
  const [maxIter, setMaxIter] = useState<number>(500);
  const [model, setModel] = useState<LogisticModel | null>(null);
  const [isXor, setIsXor] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [animating, setAnimating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);

  // Train (full batch, for display)
  const trainFull = useCallback(() => {
    if (points.length < 2) return;
    const X = points.map((p) => [p.x, p.y]);
    const y = points.map((p) => p.label);
    try {
      const m = trainLogisticRegression(X, y, { alpha, maxIter, recordEvery: 1 });
      setModel(m);
      setEpoch(maxIter);
    } catch {
      // not enough data
    }
  }, [points, alpha, maxIter]);

  // Animate training epoch by epoch
  const animateTrain = useCallback(() => {
    if (animating) return;
    setAnimating(true);
    setModel(null);
    setEpoch(0);

    let iter = 0;
    const X = points.map((p) => [p.x, p.y]);
    const y = points.map((p) => p.label);

    const step = () => {
      iter += 25;
      if (iter > maxIter) {
        iter = maxIter;
        setAnimating(false);
      }
      try {
        const m = trainLogisticRegression(X, y, { alpha, maxIter: iter, recordEvery: 1 });
        setModel(m);
        setEpoch(iter);
      } catch {
        setAnimating(false);
        return;
      }
      if (iter < maxIter) {
        animRef.current = requestAnimationFrame(step);
      }
    };
    animRef.current = requestAnimationFrame(step);
  }, [animating, points, alpha, maxIter]);

  useEffect(() => {
    return () => {
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
    };
  }, []);

  // Click on canvas to add point
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      // Scale from displayed rect to canvas coords
      const scaledCx = (cx / rect.width) * W;
      const scaledCy = (cy / rect.height) * H;
      const [wx, wy] = canvasToWorld(scaledCx, scaledCy);
      setPoints((prev) => [...prev, { x: wx, y: wy, label: nextLabel }]);
      setModel(null);
      setEpoch(0);
    },
    [nextLabel]
  );

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#0c0a09';
    ctx.fillRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = '#292524';
    ctx.lineWidth = 1;
    for (let v = -4; v <= 4; v += 2) {
      const [x0, y0] = worldToCanvas(v, DOMAIN[0]);
      const [x1, y1] = worldToCanvas(v, DOMAIN[1]);
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
      const [x2, y2] = worldToCanvas(DOMAIN[0], v);
      const [x3, y3] = worldToCanvas(DOMAIN[1], v);
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x3, y3);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#57534e';
    ctx.lineWidth = 1.5;
    const [ax0, ay0] = worldToCanvas(0, DOMAIN[0]);
    const [ax1, ay1] = worldToCanvas(0, DOMAIN[1]);
    ctx.beginPath();
    ctx.moveTo(ax0, ay0);
    ctx.lineTo(ax1, ay1);
    ctx.stroke();
    const [bx0, by0] = worldToCanvas(DOMAIN[0], 0);
    const [bx1, by1] = worldToCanvas(DOMAIN[1], 0);
    ctx.beginPath();
    ctx.moveTo(bx0, by0);
    ctx.lineTo(bx1, by1);
    ctx.stroke();

    // Decision boundary
    if (model) {
      try {
        const db = computeDecisionBoundary(model);
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        if (db.isVertical) {
          const [vx, vy0] = worldToCanvas(db.verticalX1, DOMAIN[0]);
          const [, vy1] = worldToCanvas(db.verticalX1, DOMAIN[1]);
          ctx.moveTo(vx, vy0);
          ctx.lineTo(vx, vy1);
        } else {
          const x1 = DOMAIN[0];
          const x2 = DOMAIN[1];
          const y1 = db.slope * x1 + db.intercept;
          const y2 = db.slope * x2 + db.intercept;
          const [cx1, cy1] = worldToCanvas(x1, y1);
          const [cx2, cy2] = worldToCanvas(x2, y2);
          ctx.moveTo(cx1, cy1);
          ctx.lineTo(cx2, cy2);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      } catch {
        /* boundary unavailable */
      }
    }

    // Points
    for (const pt of points) {
      const [cx, cy] = worldToCanvas(pt.x, pt.y);
      const prob = model ? predictLogistic(model, [pt.x, pt.y]).probability : 0.5;
      ctx.beginPath();
      ctx.arc(cx, cy, 7, 0, Math.PI * 2);
      ctx.fillStyle = pt.label === 1 ? '#22c55e' : '#ef4444';
      ctx.fill();
      ctx.strokeStyle = model
        ? prob >= 0.5 === (pt.label === 1)
          ? '#ffffff'
          : '#fbbf24'
        : '#78716c';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }, [points, model]);

  const handleReset = () => {
    setPoints(isXor ? makeXorDataset() : makeSeparableDataset());
    setModel(null);
    setEpoch(0);
    setAnimating(false);
    if (animRef.current !== null) cancelAnimationFrame(animRef.current);
  };

  const handleXor = () => {
    const next = !isXor;
    setIsXor(next);
    setPoints(next ? makeXorDataset() : makeSeparableDataset());
    setModel(null);
    setEpoch(0);
  };

  const currentLoss =
    model && model.lossHistory.length > 0 ? model.lossHistory[model.lossHistory.length - 1] : null;
  const theta = model?.theta ?? [];

  // Sigmoid curve data for mini chart (z from -6 to 6)
  const sigmoidPoints = useMemo(() => {
    return Array.from({ length: 61 }, (_, i) => {
      const z = -6 + i * 0.2;
      return { z, p: sigmoid(z) };
    });
  }, []);

  return (
    <div className="space-y-4">
      {/* Canvas + controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle>Decision boundary studio</CardTitle>
              <CardDescription>
                Click the canvas to add points. Toggle next class label, then train.
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setNextLabel(nextLabel === 1 ? 0 : 1)}
              >
                Next: class{' '}
                <span
                  className={`ml-1 font-bold ${nextLabel === 1 ? 'text-green-400' : 'text-red-400'}`}
                >
                  {nextLabel}
                </span>
              </Button>
              <Button size="sm" variant="outline" onClick={handleReset}>
                <RefreshCw className="mr-1 size-3" /> Reset
              </Button>
              <Button size="sm" variant="outline" onClick={handleXor}>
                <ZapOff className="mr-1 size-3" /> {isXor ? 'Separable' : 'XOR (make it fail)'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-[1fr_220px]">
            {/* Canvas */}
            <canvas
              ref={canvasRef}
              width={W}
              height={H}
              className="w-full cursor-crosshair rounded-lg border border-warm-border"
              onClick={handleCanvasClick}
            />
            {/* Right panel */}
            <div className="space-y-4">
              <Slider
                label="Learning rate α"
                value={alpha}
                min={0.01}
                max={1.0}
                step={0.01}
                onChange={setAlpha}
                helperText={alpha.toFixed(2)}
              />
              <Slider
                label="Max iterations"
                value={maxIter}
                min={50}
                max={2000}
                step={50}
                onChange={setMaxIter}
                helperText={`${maxIter} epochs`}
              />
              <div className="flex flex-col gap-2">
                <Button className="w-full" onClick={animateTrain} disabled={animating}>
                  <Zap className="mr-1 size-3" /> Animate train
                </Button>
                <Button variant="outline" className="w-full" onClick={trainFull}>
                  Instant train
                </Button>
              </div>

              {model && (
                <div className="rounded-lg border border-warm-border bg-surface p-3 font-mono text-xs space-y-1">
                  <div className="text-neutral-400">Epoch {epoch}</div>
                  <div>
                    θ<sub>0</sub> (bias) ={' '}
                    <span className="text-brand">{(theta[0] ?? 0).toFixed(3)}</span>
                  </div>
                  <div>
                    θ<sub>1</sub> = <span className="text-brand">{(theta[1] ?? 0).toFixed(3)}</span>
                  </div>
                  <div>
                    θ<sub>2</sub> = <span className="text-brand">{(theta[2] ?? 0).toFixed(3)}</span>
                  </div>
                  {typeof currentLoss === 'number' && (
                    <div className="pt-1 border-t border-warm-border">
                      Log-loss: <span className="text-orange-400">{currentLoss.toFixed(4)}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="rounded-lg border border-warm-border p-2">
                <p className="mb-1 text-xs text-neutral-500">Legend</p>
                <div className="flex gap-3 text-xs">
                  <span className="flex items-center gap-1">
                    <span className="inline-block size-3 rounded-full bg-green-500" /> Class 1
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block size-3 rounded-full bg-red-500" /> Class 0
                  </span>
                </div>
                <p className="mt-1 text-xs text-neutral-500">Gold ring = misclassified point.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* XOR explainer */}
      {isXor && (
        <Card className="border-orange-500/40 bg-orange-500/5">
          <CardContent className="pt-4">
            <div className="flex gap-2">
              <Info className="mt-0.5 size-4 shrink-0 text-orange-400" />
              <div className="text-sm">
                <p className="font-semibold text-orange-300">Why it fails on XOR</p>
                <p className="mt-1 text-neutral-400">
                  The XOR pattern has class 0 in top-right and bottom-left quadrants and class 1 in
                  the other two. No single{' '}
                  <span className="font-mono text-cream">straight line</span> can separate them --
                  logistic regression is a linear classifier. AUC stays near 0.5. You need a kernel
                  trick (SVM) or a neural network to solve XOR.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Log-loss chart */}
      {model && model.lossHistory.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Log-loss vs iteration</CardTitle>
            <CardDescription>
              Cross-entropy J(θ) falling toward zero as θ converges.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LossChart history={model.lossHistory} recordEvery={model.config.recordEvery ?? 10} />
          </CardContent>
        </Card>
      )}

      {/* Sigmoid curve */}
      <Card>
        <CardHeader>
          <CardTitle>Sigmoid activation σ(z)</CardTitle>
          <CardDescription>
            Maps the linear score z = θᵀx̃ to a probability in (0, 1). Decision boundary at σ(z) =
            0.5 ↔ z = 0.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SigmoidChart points={sigmoidPoints} currentZ={theta.length >= 2 ? null : null} />
        </CardContent>
      </Card>
    </div>
  );
}

// ------- Sub-charts -------------------------------------------------------

interface LossChartProps {
  history: number[];
  recordEvery: number;
}

function LossChart({ history, recordEvery }: LossChartProps) {
  if (history.length < 2) return null;
  const maxLoss = Math.max(...history);
  const minLoss = Math.min(...history);
  const range = maxLoss - minLoss || 1;
  const cw = 480,
    ch = 120;
  const pad = 8;

  const pts = history.map((loss, i) => {
    const x = pad + (i / (history.length - 1)) * (cw - 2 * pad);
    const y = ch - pad - ((loss - minLoss) / range) * (ch - 2 * pad);
    return `${x},${y}`;
  });

  return (
    <svg
      viewBox={`0 0 ${cw} ${ch}`}
      className="w-full rounded-lg border border-warm-border bg-surface"
    >
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke="#f97316"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <text x={pad + 2} y={pad + 10} fontSize="9" fill="#78716c">
        Loss: {maxLoss.toFixed(3)}
      </text>
      <text x={pad + 2} y={ch - pad - 2} fontSize="9" fill="#78716c">
        {minLoss.toFixed(4)}
      </text>
      <text x={cw - pad - 2} y={ch - pad - 2} fontSize="9" fill="#78716c" textAnchor="end">
        iter {(history.length - 1) * recordEvery}
      </text>
    </svg>
  );
}

interface SigmoidChartProps {
  points: { z: number; p: number }[];
  currentZ: number | null;
}

function SigmoidChart({ points, currentZ }: SigmoidChartProps) {
  const cw = 480,
    ch = 120,
    pad = 16;
  const toSvg = (z: number, p: number): [number, number] => {
    const x = pad + ((z + 6) / 12) * (cw - 2 * pad);
    const y = ch - pad - p * (ch - 2 * pad);
    return [x, y];
  };

  const pathPts = points.map(({ z, p }) => toSvg(z, p).join(','));
  const midX = pad + (6 / 12) * (cw - 2 * pad);

  return (
    <svg
      viewBox={`0 0 ${cw} ${ch}`}
      className="w-full rounded-lg border border-warm-border bg-surface"
    >
      {/* y=0.5 guideline */}
      <line
        x1={pad}
        y1={ch - pad - 0.5 * (ch - 2 * pad)}
        x2={cw - pad}
        y2={ch - pad - 0.5 * (ch - 2 * pad)}
        stroke="#292524"
        strokeWidth="1"
        strokeDasharray="4,3"
      />
      {/* z=0 guideline */}
      <line
        x1={midX}
        y1={pad}
        x2={midX}
        y2={ch - pad}
        stroke="#292524"
        strokeWidth="1"
        strokeDasharray="4,3"
      />
      {/* Curve */}
      <polyline
        points={pathPts.join(' ')}
        fill="none"
        stroke="#22c55e"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Decision point at z=0 */}
      <circle cx={midX} cy={ch - pad - 0.5 * (ch - 2 * pad)} r="4" fill="#f97316" />
      {currentZ !== null &&
        (() => {
          const [cx, cy] = toSvg(currentZ, sigmoid(currentZ));
          return <circle cx={cx} cy={cy} r="4" fill="#facc15" />;
        })()}
      <text x={pad + 2} y={ch - pad - 2} fontSize="9" fill="#78716c">
        z = -6
      </text>
      <text x={cw - pad - 2} y={ch - pad - 2} fontSize="9" fill="#78716c" textAnchor="end">
        z = +6
      </text>
      <text x={midX + 4} y={ch - pad - 0.5 * (ch - 2 * pad) - 4} fontSize="9" fill="#f97316">
        τ = 0.5
      </text>
    </svg>
  );
}
