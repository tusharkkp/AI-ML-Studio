import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Slider } from '@/components/ui/Slider';
import { trainSvm } from '@/engines/classification/svm';
import { RotateCcw, AlertTriangle, Plus, ShieldCheck } from 'lucide-react';

interface Point2D {
  id: string;
  x: number;
  y: number;
  label: -1 | 1;
}

const PRESET_SEPARABLE: Point2D[] = [
  { id: 'p1', x: 1.0, y: 2.2, label: 1 },
  { id: 'p2', x: 2.2, y: 3.0, label: 1 },
  { id: 'p3', x: 2.5, y: 1.2, label: 1 },
  { id: 'p4', x: 3.2, y: 2.5, label: 1 },
  { id: 'n1', x: -1.0, y: -1.2, label: -1 },
  { id: 'n2', x: -2.2, y: -1.0, label: -1 },
  { id: 'n3', x: -1.2, y: -2.5, label: -1 },
  { id: 'n4', x: -2.8, y: -2.2, label: -1 },
];

const PRESET_OUTLIER: Point2D[] = [
  { id: 'p1', x: 1.0, y: 2.2, label: 1 },
  { id: 'p2', x: 2.2, y: 3.0, label: 1 },
  { id: 'p3', x: 2.5, y: 1.2, label: 1 },
  { id: 'p4', x: 3.2, y: 2.5, label: 1 },
  { id: 'n1', x: -1.0, y: -1.2, label: -1 },
  { id: 'n2', x: -2.2, y: -1.0, label: -1 },
  { id: 'n3', x: -1.2, y: -2.5, label: -1 },
  { id: 'n4', x: 0.8, y: 1.5, label: -1 }, // Outlier deep in class +1 territory
];

const PRESET_XOR: Point2D[] = [
  { id: 'x1', x: 1.8, y: 1.8, label: 1 },
  { id: 'x2', x: -1.8, y: -1.8, label: 1 },
  { id: 'x3', x: -1.8, y: 1.8, label: -1 },
  { id: 'x4', x: 1.8, y: -1.8, label: -1 },
];

export function SvmMarginLab() {
  const [points, setPoints] = useState<Point2D[]>(PRESET_SEPARABLE);
  const [logC, setLogC] = useState<number>(0); // 10^0 = 1.0
  const [selectedLabel, setSelectedLabel] = useState<-1 | 1>(1);
  const [activePreset, setActivePreset] = useState<'separable' | 'outlier' | 'xor'>('separable');

  const C = useMemo(() => Math.pow(10, logC), [logC]);

  // Train linear SVM on current points
  const model = useMemo(() => {
    if (points.length < 2) return null;
    const X = points.map((p) => [p.x, p.y]);
    const y = points.map((p) => p.label);
    try {
      return trainSvm(X, y, {
        C,
        kernel: { type: 'linear' },
        maxIter: 200,
      });
    } catch {
      return null;
    }
  }, [points, C]);

  // Canvas coordinate helpers (-4 to +4 space to 400x340 SVG viewport)
  const width = 420;
  const height = 340;
  const scaleX = (x: number) => ((x + 4) / 8) * width;
  const scaleY = (y: number) => height - ((y + 4) / 8) * height;
  const invScaleX = (px: number) => (px / width) * 8 - 4;
  const invScaleY = (py: number) => (1 - py / height) * 8 - 4;

  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const x = parseFloat(invScaleX(px).toFixed(2));
    const y = parseFloat(invScaleY(py).toFixed(2));
    const newPoint: Point2D = {
      id: `pt_${Date.now()}`,
      x,
      y,
      label: selectedLabel,
    };
    setPoints((prev) => [...prev, newPoint]);
  };

  // Compute hyperplane lines: w0*x + w1*y + b = target (0, +1, -1)
  const getLineCoords = (target: number) => {
    if (!model || !model.weights || model.weights.length < 2) return null;
    const w0 = model.weights[0] ?? 0;
    const w1 = model.weights[1] ?? 0;
    const b = model.bias;

    // y = (target - b - w0*x) / w1
    if (Math.abs(w1) < 1e-4) {
      // Near-vertical line: x = (target - b) / w0
      if (Math.abs(w0) < 1e-4) return null;
      const xConst = (target - b) / w0;
      return {
        x1: scaleX(xConst),
        y1: 0,
        x2: scaleX(xConst),
        y2: height,
      };
    }

    const xLeft = -4;
    const yLeft = (target - b - w0 * xLeft) / w1;
    const xRight = 4;
    const yRight = (target - b - w0 * xRight) / w1;

    return {
      x1: scaleX(xLeft),
      y1: scaleY(yLeft),
      x2: scaleX(xRight),
      y2: scaleY(yRight),
    };
  };

  const centerLine = getLineCoords(0);
  const posGutter = getLineCoords(1);
  const negGutter = getLineCoords(-1);

  // Set of support vector IDs for visual glow
  const svIndices = useMemo(() => {
    if (!model) return new Set<number>();
    return new Set(model.supportVectors.map((sv) => sv.index));
  }, [model]);

  const totalSlack = useMemo(() => {
    if (!model) return 0;
    return model.supportVectors.reduce((acc, sv) => acc + sv.slack, 0);
  }, [model]);

  return (
    <Card className="p-5 sm:p-6 rounded-xl border border-orange-50/15 bg-black/10 backdrop-blur-sm shadow-none font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-manrope text-lg font-semibold text-foreground">
              Maximum margin & support vector studio
            </h3>
            <Badge variant="unit">Linear SVM</Badge>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Watch the optimal separating hyperplane balance street width and slack penalties.
          </p>
        </div>

        {/* Preset selectors */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Button
            size="sm"
            variant={activePreset === 'separable' ? 'primary' : 'outline'}
            onClick={() => {
              setPoints(PRESET_SEPARABLE);
              setActivePreset('separable');
            }}
          >
            Separable
          </Button>
          <Button
            size="sm"
            variant={activePreset === 'outlier' ? 'primary' : 'outline'}
            onClick={() => {
              setPoints(PRESET_OUTLIER);
              setActivePreset('outlier');
            }}
          >
            Outlier noise
          </Button>
          <Button
            size="sm"
            variant={activePreset === 'xor' ? 'danger' : 'outline'}
            onClick={() => {
              setPoints(PRESET_XOR);
              setActivePreset('xor');
            }}
          >
            <AlertTriangle className="size-3.5 mr-1" />
            Make it fail (XOR)
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setPoints(PRESET_SEPARABLE);
              setLogC(0);
              setActivePreset('separable');
            }}
            aria-label="Reset lab"
          >
            <RotateCcw className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Main interactive area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
        {/* SVG Canvas */}
        <div className="lg:col-span-8 flex flex-col items-center">
          <div className="relative w-full overflow-hidden rounded-lg border border-border/60 bg-neutral-900/60 p-2">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-auto cursor-crosshair select-none"
              onClick={handleCanvasClick}
            >
              {/* Coordinate Grid lines */}
              <line
                x1={scaleX(0)}
                y1={0}
                x2={scaleX(0)}
                y2={height}
                stroke="#525252"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <line
                x1={0}
                y1={scaleY(0)}
                x2={width}
                y2={scaleY(0)}
                stroke="#525252"
                strokeWidth="1"
                strokeDasharray="3 3"
              />

              {/* Shaded margin corridor */}
              {posGutter && negGutter && (
                <polygon
                  points={`${posGutter.x1},${posGutter.y1} ${posGutter.x2},${posGutter.y2} ${negGutter.x2},${negGutter.y2} ${negGutter.x1},${negGutter.y1}`}
                  fill="rgba(245, 158, 11, 0.08)"
                />
              )}

              {/* Hyperplane Gutters (w^T x + b = +-1) */}
              {posGutter && (
                <line
                  x1={posGutter.x1}
                  y1={posGutter.y1}
                  x2={posGutter.x2}
                  y2={posGutter.y2}
                  stroke="#10b981"
                  strokeWidth="1.5"
                  strokeDasharray="5 5"
                />
              )}
              {negGutter && (
                <line
                  x1={negGutter.x1}
                  y1={negGutter.y1}
                  x2={negGutter.x2}
                  y2={negGutter.y2}
                  stroke="#f97316"
                  strokeWidth="1.5"
                  strokeDasharray="5 5"
                />
              )}

              {/* Optimal Decision Boundary Hyperplane (w^T x + b = 0) */}
              {centerLine && (
                <line
                  x1={centerLine.x1}
                  y1={centerLine.y1}
                  x2={centerLine.x2}
                  y2={centerLine.y2}
                  stroke="#fef3c7"
                  strokeWidth="2.5"
                />
              )}

              {/* Render data points */}
              {points.map((pt, idx) => {
                const cx = scaleX(pt.x);
                const cy = scaleY(pt.y);
                const isSV = svIndices.has(idx);
                const isPositive = pt.label === 1;

                return (
                  <g key={pt.id} className="transition-transform duration-150">
                    {/* Glowing ring for active support vectors */}
                    {isSV && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r="14"
                        fill="none"
                        stroke="#fef3c7"
                        strokeWidth="1.5"
                        strokeDasharray="3 2"
                        className="animate-spin-slow opacity-80"
                      />
                    )}

                    {/* Main point glyph */}
                    {isPositive ? (
                      <circle
                        cx={cx}
                        cy={cy}
                        r="7"
                        fill="#10b981"
                        stroke="#064e3b"
                        strokeWidth="1.5"
                      />
                    ) : (
                      <polygon
                        points={`${cx},${cy - 8} ${cx + 8},${cy} ${cx},${cy + 8} ${cx - 8},${cy}`}
                        fill="#f97316"
                        stroke="#7c2d12"
                        strokeWidth="1.5"
                      />
                    )}

                    {/* Point label text */}
                    <text x={cx + 10} y={cy + 4} fill="#d4d4d4" fontSize="9" fontFamily="monospace">
                      {pt.label === 1 ? '+1' : '-1'}
                      {isSV ? ' (SV)' : ''}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex items-center justify-between w-full mt-2 text-[11px] text-neutral-400">
            <span>Click canvas to place sample</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="inline-block size-2 rounded-full bg-[#10b981]" /> Class +1
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block size-2 rotate-45 bg-[#f97316]" /> Class -1
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block size-2 rounded-full border border-amber-300" />{' '}
                Support vector
              </span>
            </div>
          </div>
        </div>

        {/* Controls and telemetry */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            {/* Click Mode Selector */}
            <div>
              <label className="text-xs font-semibold text-neutral-400 block mb-1.5">
                Place new point as:
              </label>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={selectedLabel === 1 ? 'primary' : 'outline'}
                  className="flex-1 text-xs"
                  onClick={() => setSelectedLabel(1)}
                >
                  <Plus className="size-3 mr-1" /> Class +1
                </Button>
                <Button
                  size="sm"
                  variant={selectedLabel === -1 ? 'primary' : 'outline'}
                  className="flex-1 text-xs"
                  onClick={() => setSelectedLabel(-1)}
                >
                  <Plus className="size-3 mr-1" /> Class -1
                </Button>
              </div>
            </div>

            {/* Regularization C Slider */}
            <div>
              <Slider
                label={`Penalty parameter C: ${C < 1 ? C.toFixed(2) : C.toFixed(0)} (${
                  C >= 10 ? 'Hard margin' : C <= 0.1 ? 'Soft margin' : 'Balanced'
                })`}
                value={logC}
                min={-2}
                max={2}
                step={0.2}
                onChange={(val) => setLogC(val)}
              />
              <p className="text-[11px] text-neutral-500 mt-1">
                Low C widens the corridor by forgiving misclassifications; high C insists on zero
                training errors.
              </p>
            </div>

            {/* Live Model Telemetry Card */}
            <div className="rounded-lg border border-border/50 bg-neutral-900/40 p-3 space-y-2 text-xs">
              <div className="flex items-center justify-between text-neutral-300">
                <span className="text-neutral-400">Margin width (2 / ||w||):</span>
                <span className="font-mono font-bold text-amber-200">
                  {model?.marginWidth ? model.marginWidth.toFixed(3) : 'Undefined'}
                </span>
              </div>
              <div className="flex items-center justify-between text-neutral-300">
                <span className="text-neutral-400">Support vectors:</span>
                <span className="font-mono font-bold text-foreground">
                  {model?.supportVectors.length ?? 0} / {points.length}
                </span>
              </div>
              <div className="flex items-center justify-between text-neutral-300">
                <span className="text-neutral-400">Training accuracy:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {model ? `${(model.trainingAccuracy * 100).toFixed(1)}%` : '0%'}
                </span>
              </div>
              <div className="flex items-center justify-between text-neutral-300">
                <span className="text-neutral-400">Total slack penalty (Σ ξ):</span>
                <span className="font-mono font-bold text-orange-300">{totalSlack.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Key insight note */}
          <div className="rounded-lg border border-amber-900/30 bg-amber-950/10 p-3 text-[11px] text-neutral-300">
            <div className="flex items-center gap-1.5 text-amber-300 font-semibold mb-1">
              <ShieldCheck className="size-3.5" />
              <span>Sparsity of solution</span>
            </div>
            Only the circled support vectors determine the separating hyperplane. All non-support
            vectors can be moved or deleted without moving the line by even a millimeter.
          </div>
        </div>
      </div>
    </Card>
  );
}
