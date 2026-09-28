import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Slider } from '@/components/ui/Slider';
import {
  trainSvm,
  computeSvmGrid2D,
  lift2Dto3D,
  type SvmKernelType,
} from '@/engines/classification/svm';
import { Layers, Eye, RotateCcw, Box } from 'lucide-react';

interface Point2D {
  x: number;
  y: number;
  label: -1 | 1;
}

function generateConcentricRings(): Point2D[] {
  const points: Point2D[] = [];
  // Inner circle: 12 points, radius 0.8
  for (let i = 0; i < 12; i++) {
    const theta = (i / 12) * 2 * Math.PI;
    const r = 0.7 + (i % 3) * 0.1;
    points.push({ x: r * Math.cos(theta), y: r * Math.sin(theta), label: -1 });
  }
  // Outer circle: 16 points, radius 2.3
  for (let i = 0; i < 16; i++) {
    const theta = (i / 16) * 2 * Math.PI + 0.1;
    const r = 2.2 + (i % 4) * 0.1;
    points.push({ x: r * Math.cos(theta), y: r * Math.sin(theta), label: 1 });
  }
  return points;
}

function generateXorDataset(): Point2D[] {
  return [
    { x: 1.5, y: 1.5, label: 1 },
    { x: 1.8, y: 1.2, label: 1 },
    { x: 1.2, y: 1.8, label: 1 },
    { x: -1.5, y: -1.5, label: 1 },
    { x: -1.8, y: -1.2, label: 1 },
    { x: -1.2, y: -1.8, label: 1 },
    { x: -1.5, y: 1.5, label: -1 },
    { x: -1.8, y: 1.2, label: -1 },
    { x: -1.2, y: 1.8, label: -1 },
    { x: 1.5, y: -1.5, label: -1 },
    { x: 1.8, y: -1.2, label: -1 },
    { x: 1.2, y: -1.8, label: -1 },
  ];
}

export function SvmKernelTrickLab() {
  const [datasetType, setDatasetType] = useState<'circles' | 'xor'>('circles');
  const [kernelType, setKernelType] = useState<SvmKernelType>('rbf');
  const [gamma, setGamma] = useState<number>(0.8);
  const [polyDegree, setPolyDegree] = useState<number>(2);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [cParam, setCParam] = useState<number>(10);

  const points = useMemo(() => {
    return datasetType === 'circles' ? generateConcentricRings() : generateXorDataset();
  }, [datasetType]);

  const X = useMemo(() => points.map((p) => [p.x, p.y]), [points]);
  const y = useMemo(() => points.map((p) => p.label), [points]);

  // Train kernel SVM
  const model = useMemo(() => {
    try {
      return trainSvm(X, y, {
        C: cParam,
        kernel: {
          type: kernelType,
          gamma,
          degree: polyDegree,
          coef0: 1,
        },
        maxIter: 150,
      });
    } catch {
      return null;
    }
  }, [X, y, kernelType, gamma, polyDegree, cParam]);

  // Compute 2D decision boundary grid
  const grid = useMemo(() => {
    if (!model) return null;
    return computeSvmGrid2D(model, X, y, [-3.2, 3.2], [-3.2, 3.2], 32);
  }, [model, X, y]);

  // Lifted 3D coordinates for the geometric demonstration
  const lifted3D = useMemo(() => {
    return lift2Dto3D(X, y);
  }, [X, y]);

  // SVG coordinate conversions
  const svgWidth = 400;
  const svgHeight = 320;
  const toSvgX = (x: number) => ((x + 3.2) / 6.4) * svgWidth;
  const toSvgY = (yCoord: number) => svgHeight - ((yCoord + 3.2) / 6.4) * svgHeight;

  // Simple 3D oblique perspective projection: (x, y, z) -> (screenX, screenY)
  // z varies from 0 to ~6
  const to3dScreen = (x: number, yCoord: number, z: number) => {
    const isoX = svgWidth / 2 + x * 45 - yCoord * 25;
    const isoY = svgHeight / 2 + x * 15 + yCoord * 15 - z * 28 + 40;
    return { isoX, isoY };
  };

  return (
    <Card className="p-5 sm:p-6 rounded-xl border border-orange-50/15 bg-black/10 backdrop-blur-sm shadow-none font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-manrope text-lg font-semibold text-foreground">
              Kernel trick & high-dimensional lift studio
            </h3>
            <Badge variant="unit">Non-Linear SVM</Badge>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Implicitly map non-separable 2D points into reproducing kernel Hilbert space.
          </p>
        </div>

        {/* View mode and presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Button
            size="sm"
            variant={viewMode === '2d' ? 'primary' : 'outline'}
            onClick={() => setViewMode('2d')}
          >
            <Eye className="size-3.5 mr-1" />
            2D contour
          </Button>
          <Button
            size="sm"
            variant={viewMode === '3d' ? 'primary' : 'outline'}
            onClick={() => setViewMode('3d')}
          >
            <Box className="size-3.5 mr-1" />
            3D lift demonstration
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setDatasetType('circles');
              setKernelType('rbf');
              setGamma(0.8);
              setCParam(10);
              setViewMode('2d');
            }}
            aria-label="Reset lab"
          >
            <RotateCcw className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
        {/* Visualizer Area */}
        <div className="lg:col-span-8 flex flex-col items-center">
          <div className="relative w-full overflow-hidden rounded-lg border border-border/60 bg-neutral-950 p-2">
            {viewMode === '2d' ? (
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto select-none">
                {/* 2D Contour Heatmap Tiles */}
                {grid &&
                  grid.grid.map((row, rIdx) =>
                    row.map((val, cIdx) => {
                      const x1 = toSvgX(grid.xCoords[cIdx]! - 0.1);
                      const y1 = toSvgY(grid.yCoords[rIdx]! + 0.1);
                      const tileW = svgWidth / grid.xCoords.length;
                      const tileH = svgHeight / grid.yCoords.length;

                      // Color by decision value
                      const isPos = val >= 0;
                      const intensity = Math.min(Math.abs(val), 2) / 2;
                      const fillColor = isPos
                        ? `rgba(16, 185, 129, ${0.1 + intensity * 0.25})`
                        : `rgba(249, 115, 22, ${0.1 + intensity * 0.25})`;

                      return (
                        <rect
                          key={`tile_${rIdx}_${cIdx}`}
                          x={x1}
                          y={y1}
                          width={tileW}
                          height={tileH}
                          fill={fillColor}
                        />
                      );
                    })
                  )}

                {/* Coordinate axes */}
                <line
                  x1={toSvgX(0)}
                  y1={0}
                  x2={toSvgX(0)}
                  y2={svgHeight}
                  stroke="#404040"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
                <line
                  x1={0}
                  y1={toSvgY(0)}
                  x2={svgWidth}
                  y2={toSvgY(0)}
                  stroke="#404040"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />

                {/* Data Points */}
                {points.map((pt, idx) => {
                  const cx = toSvgX(pt.x);
                  const cy = toSvgY(pt.y);
                  const isPos = pt.label === 1;

                  return (
                    <g key={`pt2d_${idx}`}>
                      {isPos ? (
                        <circle
                          cx={cx}
                          cy={cy}
                          r="6"
                          fill="#10b981"
                          stroke="#064e3b"
                          strokeWidth="1.5"
                        />
                      ) : (
                        <polygon
                          points={`${cx},${cy - 7} ${cx + 7},${cy} ${cx},${cy + 7} ${cx - 7},${cy}`}
                          fill="#f97316"
                          stroke="#7c2d12"
                          strokeWidth="1.5"
                        />
                      )}
                    </g>
                  );
                })}
              </svg>
            ) : (
              /* 3D Parabolic Lift View */
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto select-none">
                {/* 3D Coordinate Grid Plane at z = 0 */}
                <polygon
                  points={`${to3dScreen(-3, -3, 0).isoX},${to3dScreen(-3, -3, 0).isoY} ${to3dScreen(3, -3, 0).isoX},${to3dScreen(3, -3, 0).isoY} ${to3dScreen(3, 3, 0).isoX},${to3dScreen(3, 3, 0).isoY} ${to3dScreen(-3, 3, 0).isoX},${to3dScreen(-3, 3, 0).isoY}`}
                  fill="rgba(255, 255, 255, 0.02)"
                  stroke="#404040"
                  strokeWidth="1"
                />

                {/* Separating 3D Slicing Hyperplane at z = 2.0 */}
                <polygon
                  points={`${to3dScreen(-2.5, -2.5, 2.0).isoX},${to3dScreen(-2.5, -2.5, 2.0).isoY} ${to3dScreen(2.5, -2.5, 2.0).isoX},${to3dScreen(2.5, -2.5, 2.0).isoY} ${to3dScreen(2.5, 2.5, 2.0).isoX},${to3dScreen(2.5, 2.5, 2.0).isoY} ${to3dScreen(-2.5, 2.5, 2.0).isoX},${to3dScreen(-2.5, 2.5, 2.0).isoY}`}
                  fill="rgba(254, 243, 199, 0.12)"
                  stroke="#fef3c7"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />
                <text
                  x={to3dScreen(2.6, 0, 2.0).isoX}
                  y={to3dScreen(2.6, 0, 2.0).isoY}
                  fill="#fef3c7"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  Hyperplane z = 2.0
                </text>

                {/* 3D Lifted Points with vertical projection drop-lines */}
                {lifted3D.map((pt, idx) => {
                  const base = to3dScreen(pt.x, pt.y, 0);
                  const top = to3dScreen(pt.x, pt.y, pt.z);
                  const isPos = pt.label === 1;

                  return (
                    <g key={`lifted_${idx}`}>
                      {/* Vertical drop line showing height z = x^2 + y^2 */}
                      <line
                        x1={base.isoX}
                        y1={base.isoY}
                        x2={top.isoX}
                        y2={top.isoY}
                        stroke={isPos ? '#10b981' : '#f97316'}
                        strokeWidth="1"
                        strokeDasharray="2 2"
                        opacity="0.4"
                      />

                      {/* Elevated point glyph */}
                      {isPos ? (
                        <circle
                          cx={top.isoX}
                          cy={top.isoY}
                          r="5.5"
                          fill="#10b981"
                          stroke="#064e3b"
                          strokeWidth="1"
                        />
                      ) : (
                        <polygon
                          points={`${top.isoX},${top.isoY - 6} ${top.isoX + 6},${top.isoY} ${top.isoX},${top.isoY + 6} ${top.isoX - 6},${top.isoY}`}
                          fill="#f97316"
                          stroke="#7c2d12"
                          strokeWidth="1"
                        />
                      )}
                    </g>
                  );
                })}
              </svg>
            )}
          </div>

          <div className="flex items-center justify-between w-full mt-2 text-[11px] text-neutral-400">
            <span>
              {viewMode === '2d'
                ? 'Contour: green is class +1, orange is class -1'
                : '3D Parabolic lift: z = x₁² + x₂² separates circles horizontally'}
            </span>
            <span className="font-mono text-emerald-400">
              Accuracy: {model ? `${(model.trainingAccuracy * 100).toFixed(1)}%` : '0%'}
            </span>
          </div>
        </div>

        {/* Configuration Controls */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            {/* Dataset Selector */}
            <div>
              <label className="text-xs font-semibold text-neutral-400 block mb-1.5">
                Dataset geometry:
              </label>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={datasetType === 'circles' ? 'primary' : 'outline'}
                  className="flex-1 text-xs"
                  onClick={() => setDatasetType('circles')}
                >
                  Concentric circles
                </Button>
                <Button
                  size="sm"
                  variant={datasetType === 'xor' ? 'primary' : 'outline'}
                  className="flex-1 text-xs"
                  onClick={() => setDatasetType('xor')}
                >
                  XOR clusters
                </Button>
              </div>
            </div>

            {/* Kernel Selector */}
            <div>
              <label className="text-xs font-semibold text-neutral-400 block mb-1.5">
                Kernel function K(x, z):
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <Button
                  size="sm"
                  variant={kernelType === 'linear' ? 'primary' : 'outline'}
                  className="text-xs"
                  onClick={() => setKernelType('linear')}
                >
                  Linear
                </Button>
                <Button
                  size="sm"
                  variant={kernelType === 'poly' ? 'primary' : 'outline'}
                  className="text-xs"
                  onClick={() => setKernelType('poly')}
                >
                  Polynomial
                </Button>
                <Button
                  size="sm"
                  variant={kernelType === 'rbf' ? 'primary' : 'outline'}
                  className="text-xs"
                  onClick={() => setKernelType('rbf')}
                >
                  RBF
                </Button>
              </div>
            </div>

            {/* Kernel-Specific Sliders */}
            {kernelType === 'rbf' && (
              <div>
                <Slider
                  label={`RBF parameter γ (gamma): ${gamma.toFixed(2)}`}
                  value={gamma}
                  min={0.05}
                  max={4.0}
                  step={0.05}
                  onChange={(val) => setGamma(val)}
                />
                <p className="text-[11px] text-neutral-500 mt-1">
                  High γ creates tight island envelopes around individual points; low γ produces a
                  broad global envelope.
                </p>
              </div>
            )}

            {kernelType === 'poly' && (
              <div>
                <Slider
                  label={`Polynomial degree d: ${polyDegree}`}
                  value={polyDegree}
                  min={2}
                  max={4}
                  step={1}
                  onChange={(val) => setPolyDegree(val)}
                />
              </div>
            )}

            <div>
              <Slider
                label={`Penalty C: ${cParam}`}
                value={cParam}
                min={1}
                max={50}
                step={1}
                onChange={(val) => setCParam(val)}
              />
            </div>
          </div>

          {/* Educational Callout */}
          <div className="rounded-lg border border-amber-900/30 bg-amber-950/10 p-3 text-[11px] text-neutral-300">
            <div className="flex items-center gap-1.5 text-amber-300 font-semibold mb-1">
              <Layers className="size-3.5" />
              <span>Cover's theorem</span>
            </div>
            A complex pattern in low dimensions becomes linearly separable when cast into a
            higher-dimensional space via non-linear feature maps.
          </div>
        </div>
      </div>
    </Card>
  );
}
