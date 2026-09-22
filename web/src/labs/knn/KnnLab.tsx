import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Toggle } from '@/components/ui/Toggle';
import { Badge } from '@/components/ui/Badge';
import {
  predictKnn,
  computeDistance,
  computeDecisionGrid,
  simulateCurseOfDimensionality,
} from '@/engines/instance/knn';
import type { DistanceMetric, CurseOfDimensionalityResult } from '@/engines/instance/knn';
import { SeededRNG } from '@/utils/rng';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Point2D {
  x: number;
  y: number;
  label: 0 | 1;
}

// Canvas bounds
const W = 460;
const H = 380;
const PAD = 28;
const DOMAIN: [number, number] = [-4, 4];

function toCanvas(wx: number, wy: number): [number, number] {
  const cx = PAD + ((wx - DOMAIN[0]) / (DOMAIN[1] - DOMAIN[0])) * (W - 2 * PAD);
  const cy = H - PAD - ((wy - DOMAIN[0]) / (DOMAIN[1] - DOMAIN[0])) * (H - 2 * PAD);
  return [cx, cy];
}

function toWorld(cx: number, cy: number): [number, number] {
  const wx = DOMAIN[0] + ((cx - PAD) / (W - 2 * PAD)) * (DOMAIN[1] - DOMAIN[0]);
  const wy = DOMAIN[0] + ((H - PAD - cy) / (H - 2 * PAD)) * (DOMAIN[1] - DOMAIN[0]);
  return [wx, wy];
}

// Preset datasets
function makeBlobsDataset(): Point2D[] {
  const rng = new SeededRNG(101);
  const pts: Point2D[] = [];
  for (let i = 0; i < 9; i++) {
    pts.push({ x: rng.nextFloat(-2.8, -0.6), y: rng.nextFloat(-2.5, -0.5), label: 0 });
    pts.push({ x: rng.nextFloat(0.6, 2.8), y: rng.nextFloat(0.5, 2.8), label: 1 });
  }
  return pts;
}

function makeConcentricRings(): Point2D[] {
  const rng = new SeededRNG(202);
  const pts: Point2D[] = [];
  // Inner cluster (Class 1)
  for (let i = 0; i < 10; i++) {
    const r = rng.nextFloat(0.2, 1.2);
    const theta = rng.nextFloat(0, 2 * Math.PI);
    pts.push({ x: r * Math.cos(theta), y: r * Math.sin(theta), label: 1 });
  }
  // Outer ring (Class 0)
  for (let i = 0; i < 16; i++) {
    const r = rng.nextFloat(2.2, 3.4);
    const theta = rng.nextFloat(0, 2 * Math.PI);
    pts.push({ x: r * Math.cos(theta), y: r * Math.sin(theta), label: 0 });
  }
  return pts;
}

function makeOutlierTrap(): Point2D[] {
  const pts = makeBlobsDataset();
  // Plant a malicious Class 1 outlier right in the heart of Class 0 cluster
  pts.push({ x: -1.7, y: -1.5, label: 1 });
  return pts;
}

export function KnnLab() {
  const [activeTab, setActiveTab] = useState<'decision' | 'curse'>('decision');
  const [points, setPoints] = useState<Point2D[]>(makeBlobsDataset);
  const [queryPoint, setQueryPoint] = useState<[number, number]>([0.0, 0.0]);
  const [k, setK] = useState<number>(3);
  const [metric, setMetric] = useState<DistanceMetric>('euclidean');
  const [weighted, setWeighted] = useState<boolean>(false);
  const [showRegions, setShowRegions] = useState<boolean>(true);
  const [addLabel, setAddLabel] = useState<0 | 1>(1);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDraggingRef = useRef<boolean>(false);

  // Train arrays
  const trainPoints = useMemo(() => points.map((p) => [p.x, p.y]), [points]);
  const trainLabels = useMemo(() => points.map((p) => p.label), [points]);

  // Current query prediction
  const prediction = useMemo(() => {
    if (points.length === 0) return null;
    return predictKnn(trainPoints, trainLabels, queryPoint, {
      k,
      metric,
      weightByDistance: weighted,
    });
  }, [trainPoints, trainLabels, queryPoint, k, metric, weighted, points.length]);

  // Decision boundary background grid
  const decisionGrid = useMemo(() => {
    if (!showRegions || points.length === 0) return null;
    return computeDecisionGrid(
      trainPoints,
      trainLabels,
      { xMin: DOMAIN[0], xMax: DOMAIN[1], yMin: DOMAIN[0], yMax: DOMAIN[1] },
      32, // resolution
      { k, metric, weightByDistance: weighted }
    );
  }, [showRegions, trainPoints, trainLabels, k, metric, weighted, points.length]);

  // Render canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, W, H);

    // 1. Background grid regions
    if (decisionGrid && showRegions) {
      const res = decisionGrid.grid.length - 1;
      const cellW = (W - 2 * PAD) / res;
      const cellH = (H - 2 * PAD) / res;

      for (let j = 0; j < res; j++) {
        for (let i = 0; i < res; i++) {
          const val = decisionGrid.grid[j]?.[i];
          const px = PAD + i * cellW;
          const py = H - PAD - (j + 1) * cellH;

          ctx.fillStyle =
            val === 1
              ? 'rgba(16, 185, 129, 0.12)' // emerald-500 tint
              : 'rgba(239, 68, 68, 0.12)'; // red-500 tint
          ctx.fillRect(px, py, cellW + 0.5, cellH + 0.5);
        }
      }
    }

    // 2. Axes & Crosshair
    ctx.strokeStyle = '#292524';
    ctx.lineWidth = 1;
    const [origX, origY] = toCanvas(0, 0);
    ctx.beginPath();
    ctx.moveTo(PAD, origY);
    ctx.lineTo(W - PAD, origY);
    ctx.moveTo(origX, PAD);
    ctx.lineTo(origX, H - PAD);
    ctx.stroke();

    // 3. Vectors from query point to k nearest neighbors
    if (prediction) {
      const [qx, qy] = toCanvas(queryPoint[0], queryPoint[1]);
      for (const n of prediction.neighbors) {
        const [nx, ny] = toCanvas(n.point[0] ?? 0, n.point[1] ?? 0);

        ctx.strokeStyle = 'rgba(254, 243, 199, 0.45)'; // pale cream dashed vector
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(qx, qy);
        ctx.lineTo(nx, ny);
        ctx.stroke();
        ctx.setLineDash([]);

        // Glow ring around neighbor
        ctx.strokeStyle = n.label === 1 ? '#10b981' : '#ef4444';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(nx, ny, 11, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }

    // 4. Data points
    for (const p of points) {
      const [cx, cy] = toCanvas(p.x, p.y);
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, 2 * Math.PI);
      ctx.fillStyle = p.label === 1 ? '#10b981' : '#ef4444';
      ctx.fill();
      ctx.strokeStyle = '#0c0a09';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // 5. Query point (glow indicator)
    const [qx, qy] = toCanvas(queryPoint[0], queryPoint[1]);
    const predClass = prediction?.predictedClass ?? 0;

    // Outer glow
    ctx.beginPath();
    ctx.arc(qx, qy, 14, 0, 2 * Math.PI);
    ctx.fillStyle = predClass === 1 ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)';
    ctx.fill();

    // Inner circle
    ctx.beginPath();
    ctx.arc(qx, qy, 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#fef3c7'; // cream
    ctx.fill();
    ctx.strokeStyle = predClass === 1 ? '#10b981' : '#ef4444';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Center dot
    ctx.beginPath();
    ctx.arc(qx, qy, 2.5, 0, 2 * Math.PI);
    ctx.fillStyle = '#0c0a09';
    ctx.fill();
  }, [decisionGrid, showRegions, prediction, points, queryPoint]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Mouse handlers for dragging query point or clicking to add sample
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const [wx, wy] = toWorld(cx, cy);

    // If click is close to current query point, begin drag
    const dist = computeDistance([wx, wy], queryPoint, 'euclidean');
    if (dist < 0.6) {
      isDraggingRef.current = true;
    } else {
      // Set query point to click location
      setQueryPoint([
        Math.max(DOMAIN[0], Math.min(DOMAIN[1], wx)),
        Math.max(DOMAIN[0], Math.min(DOMAIN[1], wy)),
      ]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const [wx, wy] = toWorld(cx, cy);

    setQueryPoint([
      Math.max(DOMAIN[0], Math.min(DOMAIN[1], wx)),
      Math.max(DOMAIN[0], Math.min(DOMAIN[1], wy)),
    ]);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleDoubleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const [wx, wy] = toWorld(cx, cy);

    setPoints((prev) => [
      ...prev,
      {
        x: Math.max(DOMAIN[0], Math.min(DOMAIN[1], wx)),
        y: Math.max(DOMAIN[0], Math.min(DOMAIN[1], wy)),
        label: addLabel,
      },
    ]);
  };

  // Curse of dimensionality data
  const curseData: CurseOfDimensionalityResult[] = useMemo(() => {
    return simulateCurseOfDimensionality(150, [1, 2, 5, 10, 25, 50, 100], 42);
  }, []);

  return (
    <Card className="rounded-xl border border-orange-50/15 bg-black/20 backdrop-blur-sm shadow-none">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-xl font-medium text-stone-200">
              k-Nearest neighbors studio & metric lab
            </CardTitle>
            <CardDescription className="text-stone-400">
              Explore instance-based voting, distance metrics, and the curse of dimensionality
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'decision' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('decision')}
              className="rounded-lg rounded-br-none"
            >
              2D Decision regions
            </Button>
            <Button
              variant={activeTab === 'curse' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('curse')}
              className="rounded-lg rounded-br-none"
            >
              <AlertTriangle className="mr-1 h-3.5 w-3.5 text-amber-400" />
              Make it fail (Curse of dimensionality)
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {activeTab === 'decision' ? (
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Visual Canvas Area */}
            <div className="lg:col-span-7 flex flex-col items-center">
              <div className="relative rounded-lg border border-[#292524] bg-[#0c0a09] p-1">
                <canvas
                  ref={canvasRef}
                  width={W}
                  height={H}
                  className="cursor-crosshair rounded block"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onDoubleClick={handleDoubleClick}
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none">
                  <Badge variant="outline" className="bg-[#0c0a09]/80 border-[#292524] text-xs">
                    Drag query point or click
                  </Badge>
                  <Badge variant="outline" className="bg-[#0c0a09]/80 border-[#292524] text-xs">
                    Double-click to plant Class {addLabel}
                  </Badge>
                </div>
              </div>

              {/* Presets Bar */}
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
                <span className="text-stone-500 font-mono">Presets:</span>
                <button
                  type="button"
                  onClick={() => {
                    setPoints(makeBlobsDataset());
                    setK(3);
                  }}
                  className="px-2.5 py-1 rounded bg-[#1c1917] hover:bg-[#292524] text-stone-300 border border-[#292524] transition-colors"
                >
                  Two blobs
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPoints(makeConcentricRings());
                    setK(5);
                  }}
                  className="px-2.5 py-1 rounded bg-[#1c1917] hover:bg-[#292524] text-stone-300 border border-[#292524] transition-colors"
                >
                  Concentric rings
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPoints(makeOutlierTrap());
                    setK(1);
                  }}
                  className="px-2.5 py-1 rounded bg-[#1c1917] hover:bg-[#292524] text-amber-300 border border-amber-900/30 transition-colors"
                >
                  Outlier trap (k=1 island)
                </button>
                <button
                  type="button"
                  onClick={() => setPoints([])}
                  className="px-2 py-1 rounded hover:bg-red-950/40 text-red-400 border border-red-900/30 transition-colors"
                  title="Clear all points"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Controls & Diagnostics Panel */}
            <div className="lg:col-span-5 space-y-4">
              {/* Query Live Diagnosis */}
              <div className="rounded-xl border border-[#292524] bg-[#0c0a09] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-stone-400">
                    Query point classification
                  </span>
                  <Badge
                    variant={prediction?.predictedClass === 1 ? 'success' : 'danger'}
                    className="text-xs font-mono"
                  >
                    Class {prediction?.predictedClass ?? '-'}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded bg-[#1c1917] p-2 border border-[#292524]">
                    <div className="text-stone-500">Query (x, y)</div>
                    <div className="font-mono text-stone-200 mt-0.5">
                      [{queryPoint[0].toFixed(2)}, {queryPoint[1].toFixed(2)}]
                    </div>
                  </div>
                  <div className="rounded bg-[#1c1917] p-2 border border-[#292524]">
                    <div className="text-stone-500">Confidence</div>
                    <div className="font-mono text-stone-200 mt-0.5">
                      {prediction
                        ? `${(
                            (prediction.probabilities[prediction.predictedClass] ?? 0) * 100
                          ).toFixed(1)}%`
                        : '-'}
                    </div>
                  </div>
                </div>

                {/* Vote Distribution */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs text-stone-400">
                    <span>
                      Class 0 (Red): {((prediction?.probabilities[0] ?? 0) * 100).toFixed(0)}%
                    </span>
                    <span>
                      Class 1 (Green): {((prediction?.probabilities[1] ?? 0) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-red-950/50 overflow-hidden flex">
                    <div
                      className="h-full bg-red-500 transition-all duration-200"
                      style={{ width: `${(prediction?.probabilities[0] ?? 0) * 100}%` }}
                    />
                    <div
                      className="h-full bg-emerald-500 transition-all duration-200"
                      style={{ width: `${(prediction?.probabilities[1] ?? 0) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Hyperparameter Controls */}
              <div className="rounded-xl border border-[#292524] bg-[#0c0a09] p-4 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium text-stone-300">
                    <span>Neighborhood size (k):</span>
                    <span className="font-mono text-amber-300">{k}</span>
                  </div>
                  <Slider
                    label="Neighborhood size (k)"
                    value={k}
                    min={1}
                    max={Math.min(15, Math.max(1, points.length))}
                    step={1}
                    onChange={(val) => setK(val)}
                  />
                  <div className="flex justify-between text-[10px] text-stone-500">
                    <span>k=1 (Overfitting / Jagged)</span>
                    <span>k=15 (Smooth / High Bias)</span>
                  </div>
                </div>

                {/* Distance Metric Picker */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-stone-300 block">
                    Distance metric:
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['euclidean', 'manhattan', 'chebyshev'] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMetric(m)}
                        className={`py-1.5 text-xs capitalize rounded border transition-colors ${
                          metric === m
                            ? 'bg-amber-950/40 text-amber-200 border-amber-600/50 font-medium'
                            : 'bg-[#1c1917] text-stone-400 border-[#292524] hover:bg-[#292524]'
                        }`}
                      >
                        {m === 'euclidean'
                          ? 'L2 Euclidean'
                          : m === 'manhattan'
                            ? 'L1 Manhattan'
                            : 'L∞ Chebyshev'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Toggles */}
                <div className="pt-2 border-t border-[#292524] space-y-2">
                  <Toggle
                    checked={weighted}
                    onChange={(checked) => setWeighted(checked)}
                    label="Distance-weighted voting (1/d)"
                  />
                  <Toggle
                    checked={showRegions}
                    onChange={(checked) => setShowRegions(checked)}
                    label="Show decision region background"
                  />
                  <div className="flex items-center justify-between text-xs pt-1 text-stone-400">
                    <span>Double-click plant class:</span>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => setAddLabel(0)}
                        className={`px-2 py-0.5 rounded text-xs border ${
                          addLabel === 0
                            ? 'bg-red-950/60 text-red-300 border-red-700'
                            : 'bg-[#1c1917] text-stone-500 border-[#292524]'
                        }`}
                      >
                        Class 0
                      </button>
                      <button
                        type="button"
                        onClick={() => setAddLabel(1)}
                        className={`px-2 py-0.5 rounded text-xs border ${
                          addLabel === 1
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700'
                            : 'bg-[#1c1917] text-stone-500 border-[#292524]'
                        }`}
                      >
                        Class 1
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Neighbors list */}
              {prediction && (
                <div className="rounded-xl border border-[#292524] bg-[#0c0a09] p-3 text-xs">
                  <div className="font-mono text-stone-400 mb-2 flex items-center justify-between">
                    <span>k={prediction.neighbors.length} Nearest neighbors</span>
                    <span className="text-[10px] text-stone-500">Sorted by distance</span>
                  </div>
                  <div className="max-h-28 overflow-y-auto space-y-1 pr-1 font-mono text-[11px]">
                    {prediction.neighbors.map((n, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-0.5 px-1.5 rounded bg-[#1c1917]"
                      >
                        <span className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              n.label === 1 ? 'bg-emerald-500' : 'bg-red-500'
                            }`}
                          />
                          <span className="text-stone-300">
                            [{n.point[0]?.toFixed(1)}, {n.point[1]?.toFixed(1)}]
                          </span>
                        </span>
                        <span className="text-stone-400">
                          d = {n.distance.toFixed(2)}
                          {weighted && (
                            <span className="text-amber-300 ml-2">w = {n.weight.toFixed(1)}</span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Curse of Dimensionality Failure Mode View */
          <div className="space-y-6">
            <div className="rounded-xl border border-amber-900/30 bg-amber-950/10 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-sm">
                  <p className="font-medium text-amber-200">
                    Why k-NN breaks down in high dimensions:
                  </p>
                  <p className="text-stone-300 text-xs leading-relaxed">
                    As feature dimension d increases, the volume of feature space grows
                    exponentially. Random points become isolated in the outer corners of the
                    hypercube. Consequently, the distance to the nearest neighbor approaches the
                    distance to the farthest neighbor, making the concept of proximity meaningless.
                  </p>
                </div>
              </div>
            </div>

            {/* Dimensionality stats table */}
            <div className="overflow-x-auto rounded-xl border border-[#292524] bg-[#0c0a09]">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#1c1917] text-stone-400 border-b border-[#292524]">
                  <tr>
                    <th className="p-3">Dimension (d)</th>
                    <th className="p-3">Min Distance (d_min)</th>
                    <th className="p-3">Max Distance (d_max)</th>
                    <th className="p-3">Relative Contrast (d_max - d_min) / d_min</th>
                    <th className="p-3">Neighborhood Viability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#292524] text-stone-300">
                  {curseData.map((row) => (
                    <tr key={row.dimension} className={row.dimension >= 50 ? 'bg-red-950/20' : ''}>
                      <td className="p-3 text-amber-300 font-semibold">{row.dimension}D</td>
                      <td className="p-3">{row.minDistance.toFixed(3)}</td>
                      <td className="p-3">{row.maxDistance.toFixed(3)}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded ${
                            row.ratio > 2.0
                              ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/40'
                              : row.ratio > 0.8
                                ? 'bg-amber-950/50 text-amber-300 border border-amber-800/40'
                                : 'bg-red-950/50 text-red-300 border border-red-800/40 font-bold'
                          }`}
                        >
                          {row.ratio.toFixed(2)}x
                        </span>
                      </td>
                      <td className="p-3 text-xs">
                        {row.ratio > 2.0 ? (
                          <span className="text-emerald-400">Excellent discrimination</span>
                        ) : row.ratio > 0.8 ? (
                          <span className="text-amber-400">Degrading contrast</span>
                        ) : (
                          <span className="text-red-400">Collapsed: all points equidistant</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-xs text-stone-400">
              <div className="rounded-lg border border-[#292524] bg-[#0c0a09] p-3 space-y-1">
                <span className="font-semibold text-stone-200">The Geometric Reason:</span>
                <p>
                  In high dimensions, almost all the volume of a hypercube is concentrated in the
                  thin outer shell. Samples do not clump; they scatter onto the boundary, rendering
                  Euclidean distance uninformative.
                </p>
              </div>
              <div className="rounded-lg border border-[#292524] bg-[#0c0a09] p-3 space-y-1">
                <span className="font-semibold text-stone-200">The Practical Remedy:</span>
                <p>
                  Always apply dimensionality reduction (PCA, t-SNE, Autoencoders) or feature
                  selection before applying k-NN when feature count exceeds 15-20 attributes.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
