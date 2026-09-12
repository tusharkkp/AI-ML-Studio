import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import {
  fitNormalEquation,
  computeMultipleMetrics,
  computeMultipleCost,
} from '@/engines/regression/multiple';
import type { MultipleRegressionPoint } from '@/engines/regression/multiple';
import { Sparkles, AlertTriangle, Box } from 'lucide-react';

// House Price Dataset: Area in 100 sq ft (x1), Bedrooms (x2) -> Price in Lakhs (y)
const HOUSING_DATA: MultipleRegressionPoint[] = [
  { x: [6.0, 2], y: 48.0 },
  { x: [7.5, 2], y: 55.0 },
  { x: [8.0, 3], y: 64.0 },
  { x: [9.2, 3], y: 72.0 },
  { x: [10.5, 3], y: 81.0 },
  { x: [11.0, 4], y: 92.0 },
  { x: [12.5, 3], y: 96.0 },
  { x: [13.0, 4], y: 105.0 },
  { x: [14.5, 4], y: 118.0 },
  { x: [16.0, 5], y: 135.0 },
  { x: [17.5, 4], y: 138.0 },
  { x: [19.0, 5], y: 155.0 },
];

export function MultipleLinearRegressionLab() {
  const [isCollinearFail, setIsCollinearFail] = useState<boolean>(false);
  const [rotAngle, setRotAngle] = useState<number>(35);

  // Active dataset
  const activePoints: MultipleRegressionPoint[] = useMemo(() => {
    if (!isCollinearFail) return HOUSING_DATA;
    // Perfect multicollinearity: x2 = 2 * x1
    return HOUSING_DATA.map((pt) => ({
      x: [pt.x[0]!, Number((pt.x[0]! * 2).toFixed(2))],
      y: pt.y,
    }));
  }, [isCollinearFail]);

  // Compute Normal Equation
  const normalModel = useMemo(() => fitNormalEquation(activePoints), [activePoints]);

  // Parameters
  const [theta0, setTheta0] = useState<number>(() => normalModel.theta[0] || 10.0);
  const [theta1, setTheta1] = useState<number>(() => normalModel.theta[1] || 7.0);
  const [theta2, setTheta2] = useState<number>(() => normalModel.theta[2] || 5.0);

  // Current parameter vector
  const currentTheta = useMemo(() => [theta0, theta1, theta2], [theta0, theta1, theta2]);

  // Live Metrics
  const metrics = useMemo(
    () => computeMultipleMetrics(activePoints, currentTheta),
    [activePoints, currentTheta]
  );
  const cost = useMemo(
    () => computeMultipleCost(activePoints, currentTheta),
    [activePoints, currentTheta]
  );

  // Adjusted R-squared: 1 - (1 - R^2) * (m - 1) / (m - d - 1)
  const adjR2 = useMemo(() => {
    const m = activePoints.length;
    const d = 2;
    if (m <= d + 1) return metrics.r2;
    const val = 1 - ((1 - metrics.r2) * (m - 1)) / (m - d - 1);
    return Number(val.toFixed(4));
  }, [activePoints.length, metrics.r2]);

  // Reset parameters to Normal Equation
  const handleSolveNormal = () => {
    if (!normalModel.isSingular && normalModel.theta.length >= 3) {
      setTheta0(normalModel.theta[0]!);
      setTheta1(normalModel.theta[1]!);
      setTheta2(normalModel.theta[2]!);
    }
  };

  // Toggle multicollinearity failure
  const handleToggleCollinear = () => {
    const next = !isCollinearFail;
    setIsCollinearFail(next);
    if (!next) {
      const model = fitNormalEquation(HOUSING_DATA);
      setTheta0(model.theta[0]!);
      setTheta1(model.theta[1]!);
      setTheta2(model.theta[2]!);
    }
  };

  // 3D Isometric projection math
  const svgWidth = 560;
  const svgHeight = 360;
  const rad = (rotAngle * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  const project3D = (x1: number, x2: number, y: number) => {
    // Normalization bounds: x1 in [5, 20], x2 in [1, 6], y in [30, 160]
    const normX1 = (x1 - 5) / 15 - 0.5; // [-0.5, 0.5]
    const normX2 = (x2 - 1) / 5 - 0.5; // [-0.5, 0.5]
    const normY = (y - 30) / 130 - 0.5; // [-0.5, 0.5]

    // Rotate around vertical Y axis
    const rotX = normX1 * cos - normX2 * sin;
    const rotZ = normX1 * sin + normX2 * cos;

    // Isometric projection to 2D screen
    const screenX = svgWidth / 2 + rotX * 320;
    const screenY = svgHeight / 2 - normY * 220 + rotZ * 90;

    return { x: screenX, y: screenY };
  };

  // 4 corners of regression plane in feature space
  const planeCorners = [
    { x1: 5.0, x2: 1.0 },
    { x1: 20.0, x2: 1.0 },
    { x1: 20.0, x2: 6.0 },
    { x1: 5.0, x2: 6.0 },
  ].map((c) => {
    const predY = theta0 + theta1 * c.x1 + theta2 * c.x2;
    return project3D(c.x1, c.x2, predY);
  });

  const planePolygonPoints = planeCorners.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <Card className="p-6 border-stone-800 bg-[#0c0a09] space-y-6 shadow-none">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <h3 className="font-montserrat text-lg font-bold text-stone-100">
              Multiple Linear Regression: 3D Hyperplane &amp; Normal Equation Lab
            </h3>
          </div>
          <p className="text-xs text-stone-400 mt-1 font-sans">
            Model house prices from multiple features (Area x<sub>1</sub> and Bedrooms x<sub>2</sub>
            ). Solve via exact matrix inversion (X<sup>T</sup>X)<sup>-1</sup>X<sup>T</sup>y or
            uncover singular multicollinearity.
          </p>
        </div>

        {/* View mode and failure buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            disabled={normalModel.isSingular}
            onClick={handleSolveNormal}
            className="text-xs h-7 gap-1.5 bg-stone-100 text-stone-950 hover:bg-stone-200 rounded-lg rounded-br-none font-semibold"
          >
            <Sparkles className="size-3 text-amber-500" />
            Solve Normal Equation
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleCollinear}
            className={`text-xs h-7 gap-1 rounded-lg rounded-br-none ${
              isCollinearFail
                ? 'border-rose-500 bg-rose-950/40 text-rose-300'
                : 'border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            <AlertTriangle className="size-3" />
            {isCollinearFail ? 'Fix Multicollinearity' : 'Fail: Singularity (x2 = 2*x1)'}
          </Button>
        </div>
      </div>

      {/* Multicollinearity Warning Banner */}
      {isCollinearFail && (
        <div className="p-4 rounded-xl border border-rose-500/50 bg-rose-950/30 space-y-1.5 text-xs text-rose-200">
          <div className="flex items-center gap-2 font-montserrat font-bold text-rose-300">
            <AlertTriangle className="size-4 shrink-0 text-rose-400" />
            Singular Matrix Exception: Det(X<sup>T</sup>X) = 0!
          </div>
          <p className="leading-relaxed">
            Because feature x<sub>2</sub> is an exact linear multiple of x<sub>1</sub> (x
            <sub>2</sub> = 2x<sub>1</sub>), the columns of design matrix X are linearly dependent.
            The Gram matrix X<sup>T</sup>X is not invertible. Ordinary Least Squares fails unless
            feature pruning or L2 Ridge regularization is applied!
          </p>
        </div>
      )}

      {/* Main Grid: 3D Visualization + Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: 3D Projected Arena (2 cols) */}
        <div className="lg:col-span-2 p-4 rounded-xl border border-stone-800 bg-stone-950/80 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="w-full flex items-center justify-between text-xs text-stone-400 pb-2 border-b border-stone-800/60 mb-2">
            <span className="font-montserrat font-semibold text-stone-200 flex items-center gap-1.5">
              <Box className="size-3.5 text-amber-400" />
              3D Regression Hyperplane Projection: ŷ = &theta;<sub>0</sub> + &theta;<sub>1</sub>x
              <sub>1</sub> + &theta;<sub>2</sub>x<sub>2</sub>
            </span>
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span>Rotate 3D:</span>
              <input
                type="range"
                min="0"
                max="90"
                value={rotAngle}
                onChange={(e) => setRotAngle(Number(e.target.value))}
                className="w-20 accent-amber-400 cursor-pointer"
              />
              <span>{rotAngle}&deg;</span>
            </div>
          </div>

          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto max-h-[380px] select-none"
          >
            {/* Ground grid / reference bounding box */}
            {(() => {
              const c1 = project3D(5, 1, 30);
              const c2 = project3D(20, 1, 30);
              const c3 = project3D(20, 6, 30);
              const c4 = project3D(5, 6, 30);
              return (
                <polygon
                  points={`${c1.x},${c1.y} ${c2.x},${c2.y} ${c3.x},${c3.y} ${c4.x},${c4.y}`}
                  fill="#1c1917"
                  stroke="#292524"
                  strokeWidth="1.2"
                />
              );
            })()}

            {/* Semi-transparent 3D Regression Fitted Hyperplane */}
            <polygon
              points={planePolygonPoints}
              fill="rgba(245, 158, 11, 0.18)"
              stroke="#f59e0b"
              strokeWidth="1.8"
            />

            {/* Vertical Residual Drop-Lines from Plane to Points */}
            {activePoints.map((pt, idx) => {
              const predY = theta0 + theta1 * pt.x[0]! + theta2 * pt.x[1]!;
              const ptProj = project3D(pt.x[0]!, pt.x[1]!, pt.y);
              const planeProj = project3D(pt.x[0]!, pt.x[1]!, predY);
              const isPositive = pt.y >= predY;

              return (
                <g key={`res-${idx}`}>
                  <line
                    x1={ptProj.x}
                    y1={ptProj.y}
                    x2={planeProj.x}
                    y2={planeProj.y}
                    stroke={isPositive ? '#38bdf8' : '#f43f5e'}
                    strokeWidth="1.2"
                    strokeDasharray="2 2"
                  />
                  <circle cx={planeProj.x} cy={planeProj.y} r="2" fill="#f59e0b" opacity={0.7} />
                </g>
              );
            })}

            {/* Scatter 3D Data Spheres */}
            {activePoints.map((pt, idx) => {
              const proj = project3D(pt.x[0]!, pt.x[1]!, pt.y);
              return (
                <g key={`sphere-${idx}`}>
                  <circle
                    cx={proj.x}
                    cy={proj.y}
                    r="5"
                    fill="#fafaf9"
                    stroke="#0c0a09"
                    strokeWidth="1.5"
                  />
                  <text
                    x={proj.x + 7}
                    y={proj.y + 3}
                    fill="#a8a29e"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {pt.y}L
                  </text>
                </g>
              );
            })}

            {/* Axis hints */}
            <text x={30} y={svgHeight - 15} fill="#78716c" fontSize="10" fontFamily="sans-serif">
              Axis X1: Carpet Area (100s sq ft)
            </text>
            <text
              x={svgWidth - 170}
              y={svgHeight - 15}
              fill="#78716c"
              fontSize="10"
              fontFamily="sans-serif"
            >
              Axis X2: Bedrooms
            </text>
            <text x={20} y={30} fill="#78716c" fontSize="10" fontFamily="sans-serif">
              Axis Y: Price (Lakhs)
            </text>
          </svg>
        </div>

        {/* Right: Parameter Sliders & Real-Time Metrics */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/40 space-y-4">
            <h4 className="font-montserrat text-xs font-bold text-stone-300 uppercase tracking-wider">
              Hyperplane Parameters
            </h4>

            {/* Intercept Theta0 */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-stone-300">
                  Base Intercept (&theta;<sub>0</sub>)
                </span>
                <span className="font-mono font-bold text-amber-300">{theta0.toFixed(2)}</span>
              </div>
              <Slider
                label="Base Intercept (\u03b80)"
                min={-30}
                max={60}
                step={0.5}
                value={theta0}
                onChange={setTheta0}
              />
            </div>

            {/* Weight 1 Theta1 */}
            <div className="space-y-1 pt-2 border-t border-stone-800/60">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-stone-300">
                  Area Weight (&theta;<sub>1</sub>)
                </span>
                <span className="font-mono font-bold text-amber-300">{theta1.toFixed(2)}</span>
              </div>
              <Slider
                label="Area Weight (\u03b81)"
                min={0}
                max={15}
                step={0.1}
                value={theta1}
                onChange={setTheta1}
              />
            </div>

            {/* Weight 2 Theta2 */}
            <div className="space-y-1 pt-2 border-t border-stone-800/60">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-stone-300">
                  Bedrooms Weight (&theta;<sub>2</sub>)
                </span>
                <span className="font-mono font-bold text-amber-300">{theta2.toFixed(2)}</span>
              </div>
              <Slider
                label="Bedrooms Weight (\u03b82)"
                min={-10}
                max={20}
                step={0.1}
                value={theta2}
                onChange={setTheta2}
              />
            </div>

            {/* Model Equation Readout */}
            <div className="p-2.5 rounded-lg bg-stone-950 border border-stone-800 font-mono text-[11px] text-amber-200/90 text-center">
              ŷ = {theta0.toFixed(1)} + ({theta1.toFixed(1)})x<sub>1</sub> + ({theta2.toFixed(1)})x
              <sub>2</sub>
            </div>
          </div>

          {/* Metrics Card */}
          <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/40 space-y-3">
            <h4 className="font-montserrat text-xs font-bold text-stone-300 uppercase tracking-wider">
              Goodness of Fit Metrics
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded bg-stone-950 border border-stone-800">
                <span className="text-[10px] font-mono text-stone-400 block">Cost J(&theta;)</span>
                <span className="font-mono font-bold text-stone-200">{cost.toFixed(2)}</span>
              </div>
              <div className="p-2 rounded bg-stone-950 border border-stone-800">
                <span className="text-[10px] font-mono text-stone-400 block">RMSE (Lakhs)</span>
                <span className="font-mono font-bold text-stone-200">
                  {metrics.rmse.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded bg-stone-950 border border-stone-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] font-mono text-stone-400 block">R&sup2; (Raw)</span>
                <span className="font-mono font-bold text-emerald-400">
                  {metrics.r2.toFixed(4)}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-stone-400 block">Adjusted R&sup2;</span>
                <span className="font-mono font-bold text-amber-300">{adjR2.toFixed(4)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
