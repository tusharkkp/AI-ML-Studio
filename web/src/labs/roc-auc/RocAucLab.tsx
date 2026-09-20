import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Slider } from '@/components/ui/Slider';
import { Badge } from '@/components/ui/Badge';
import { computeRocCurve, computeAUC } from '@/engines/classification/metrics';
import { SeededRNG } from '@/utils/rng';

// ------- Gaussian PDF helper -----------------------------------------------

function gaussianPDF(x: number, mu: number, sigma: number): number {
  const z = (x - mu) / sigma;
  return Math.exp(-0.5 * z * z) / (sigma * Math.sqrt(2 * Math.PI));
}

// ------- Generate scores from two Gaussian distributions -------------------

function generateScores(mu0: number, mu1: number, sigma: number, n = 200) {
  const rng = new SeededRNG(99);
  const yt: number[] = [];
  const scores: number[] = [];

  for (let i = 0; i < n; i++) {
    // Box-Muller seeded
    const u1 = Math.max(1e-9, rng.next());
    const u2 = rng.next();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

    if (i < n / 2) {
      yt.push(0);
      // Normalize score: sigmoid-map to [0,1]
      const raw = mu0 + sigma * z;
      scores.push(1 / (1 + Math.exp(-raw)));
    } else {
      yt.push(1);
      const raw = mu1 + sigma * z;
      scores.push(1 / (1 + Math.exp(-raw)));
    }
  }

  return { yt, scores };
}

// ------- SVG helpers --------------------------------------------------------

const CW = 480;
const CH = 200;
const PAD_L = 40;
const PAD_R = 16;
const PAD_T = 16;
const PAD_B = 28;
const PW = CW - PAD_L - PAD_R;
const PH = CH - PAD_T - PAD_B;

// ------- Lab component ------------------------------------------------------

export function RocAucLab() {
  const [mu0, setMu0] = useState<number>(-1.5); // mean of class-0 logit distribution
  const [mu1, setMu1] = useState<number>(1.5); // mean of class-1 logit distribution
  const [sigma, setSigma] = useState<number>(1.5); // shared spread
  const [threshold, setThreshold] = useState<number>(0.5);

  // Generate scores once per distribution params
  const { yt, scores } = useMemo(() => generateScores(mu0, mu1, sigma), [mu0, mu1, sigma]);

  const roc = useMemo(() => computeRocCurve(yt, scores, 200), [yt, scores]);
  const auc = useMemo(() => computeAUC(roc), [roc]);

  // Operating point at current threshold
  const operatingPoint = useMemo(() => {
    // find closest threshold in roc
    let best = roc[0]!;
    let bestDiff = Infinity;
    for (const pt of roc) {
      const diff = Math.abs(pt.threshold - threshold);
      if (diff < bestDiff) {
        bestDiff = diff;
        best = pt;
      }
    }
    return best;
  }, [roc, threshold]);

  // Density curve x-axis: logit space -6 to 6 → sigmoid → probability
  const xVals = useMemo(() => Array.from({ length: 121 }, (_, i) => -6 + i * 0.1), []);

  // Compute density curves in probability space
  const densityPts = useMemo(() => {
    return xVals.map((z) => {
      const p = 1 / (1 + Math.exp(-z));
      const logitZ = z; // back-transform to logit space for PDF
      const d0 = gaussianPDF(logitZ, mu0, sigma);
      const d1 = gaussianPDF(logitZ, mu1, sigma);
      return { p, d0, d1 };
    });
  }, [xVals, mu0, mu1, sigma]);

  const maxDensity = Math.max(...densityPts.map((d) => Math.max(d.d0, d.d1)), 0.01);

  // SVG path from density
  const toSvgDensity = (p: number, density: number): string => {
    const x = PAD_L + p * PW;
    const y = PAD_T + PH - (density / maxDensity) * PH;
    return `${x},${y}`;
  };

  const path0 = densityPts.map(({ p, d0 }) => toSvgDensity(p, d0)).join(' ');
  const path1 = densityPts.map(({ p, d1 }) => toSvgDensity(p, d1)).join(' ');

  // ROC SVG path
  const rocPath = roc
    .map(({ fpr, tpr }) => {
      const x = PAD_L + fpr * PW;
      const y = PAD_T + PH - tpr * PH;
      return `${x},${y}`;
    })
    .join(' ');

  // Diagonal path
  const diag = `${PAD_L},${PAD_T + PH} ${PAD_L + PW},${PAD_T}`;

  // Threshold vertical line in density chart
  const threshX = PAD_L + threshold * PW;

  // Operating point in ROC chart
  const opX = PAD_L + operatingPoint.fpr * PW;
  const opY = PAD_T + PH - operatingPoint.tpr * PH;

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Distribution parameters</CardTitle>
          <CardDescription>
            Adjust class separation and spread to see how AUC changes.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <Slider
            label="Class 0 mean (logit)"
            value={mu0}
            min={-4}
            max={0}
            step={0.1}
            onChange={setMu0}
            helperText={mu0.toFixed(1)}
          />
          <Slider
            label="Class 1 mean (logit)"
            value={mu1}
            min={0}
            max={4}
            step={0.1}
            onChange={setMu1}
            helperText={mu1.toFixed(1)}
          />
          <Slider
            label="Spread σ (both classes)"
            value={sigma}
            min={0.3}
            max={4}
            step={0.1}
            onChange={setSigma}
            helperText={sigma.toFixed(1)}
          />
        </CardContent>
      </Card>

      {/* Density distributions */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>Probability density distributions</CardTitle>
              <CardDescription>
                Overlap between class 0 (red) and class 1 (green) drives classifier error. Threshold
                τ (orange line) controls the operating point.
              </CardDescription>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge variant={auc >= 0.85 ? 'success' : auc >= 0.7 ? 'warning' : 'outline'}>
                AUC = {auc.toFixed(3)}
              </Badge>
              <span className="text-xs text-neutral-500">
                TPR = {(operatingPoint.tpr * 100).toFixed(1)}% | FPR ={' '}
                {(operatingPoint.fpr * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <svg
            viewBox={`0 0 ${CW} ${CH}`}
            className="w-full rounded-lg border border-warm-border bg-surface"
          >
            {/* Axes */}
            <line
              x1={PAD_L}
              y1={PAD_T}
              x2={PAD_L}
              y2={PAD_T + PH}
              stroke="#57534e"
              strokeWidth="1"
            />
            <line
              x1={PAD_L}
              y1={PAD_T + PH}
              x2={PAD_L + PW}
              y2={PAD_T + PH}
              stroke="#57534e"
              strokeWidth="1"
            />
            {/* Axis labels */}
            <text x={PAD_L + PW / 2} y={CH - 4} fontSize="9" fill="#78716c" textAnchor="middle">
              P(score) →
            </text>
            {['0', '0.25', '0.5', '0.75', '1'].map((lbl, i) => {
              const x = PAD_L + (i / 4) * PW;
              return (
                <text
                  key={lbl}
                  x={x}
                  y={PAD_T + PH + 10}
                  fontSize="8"
                  fill="#57534e"
                  textAnchor="middle"
                >
                  {lbl}
                </text>
              );
            })}
            {/* Class 0 area */}
            <polyline
              points={`${PAD_L},${PAD_T + PH} ${path0} ${PAD_L + PW},${PAD_T + PH}`}
              fill="#ef4444"
              fillOpacity="0.2"
              stroke="#ef4444"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Class 1 area */}
            <polyline
              points={`${PAD_L},${PAD_T + PH} ${path1} ${PAD_L + PW},${PAD_T + PH}`}
              fill="#22c55e"
              fillOpacity="0.2"
              stroke="#22c55e"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Threshold line */}
            <line
              x1={threshX}
              y1={PAD_T}
              x2={threshX}
              y2={PAD_T + PH}
              stroke="#f97316"
              strokeWidth="2"
              strokeDasharray="5,3"
            />
            <text x={threshX + 3} y={PAD_T + 12} fontSize="9" fill="#f97316">
              τ={threshold.toFixed(2)}
            </text>
          </svg>

          <Slider
            label="Decision threshold τ"
            value={threshold}
            min={0.01}
            max={0.99}
            step={0.01}
            onChange={setThreshold}
            helperText={threshold.toFixed(2)}
          />
        </CardContent>
      </Card>

      {/* ROC curve */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>ROC curve</CardTitle>
              <CardDescription>
                Each point is a (FPR, TPR) pair for a given threshold. Orange dot = current τ
                operating point. Diagonal = random classifier (AUC = 0.5).
              </CardDescription>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge variant={auc >= 0.85 ? 'success' : auc >= 0.7 ? 'warning' : 'outline'}>
                AUC = {auc.toFixed(3)}
              </Badge>
              <span className="text-xs text-neutral-500">Perfect = 1.0 | Random = 0.5</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <svg
            viewBox={`0 0 ${CW} ${CH}`}
            className="w-full rounded-lg border border-warm-border bg-surface"
          >
            {/* Grid */}
            {[0.25, 0.5, 0.75].map((v) => {
              const gx = PAD_L + v * PW;
              const gy = PAD_T + (1 - v) * PH;
              return (
                <g key={v}>
                  <line
                    x1={gx}
                    y1={PAD_T}
                    x2={gx}
                    y2={PAD_T + PH}
                    stroke="#292524"
                    strokeWidth="1"
                  />
                  <line
                    x1={PAD_L}
                    y1={gy}
                    x2={PAD_L + PW}
                    y2={gy}
                    stroke="#292524"
                    strokeWidth="1"
                  />
                </g>
              );
            })}
            {/* Axes */}
            <line
              x1={PAD_L}
              y1={PAD_T}
              x2={PAD_L}
              y2={PAD_T + PH}
              stroke="#57534e"
              strokeWidth="1"
            />
            <line
              x1={PAD_L}
              y1={PAD_T + PH}
              x2={PAD_L + PW}
              y2={PAD_T + PH}
              stroke="#57534e"
              strokeWidth="1"
            />
            {/* Axis labels */}
            <text x={PAD_L + PW / 2} y={CH - 4} fontSize="9" fill="#78716c" textAnchor="middle">
              FPR (1 - Specificity) →
            </text>
            <text
              x={10}
              y={PAD_T + PH / 2}
              fontSize="9"
              fill="#78716c"
              textAnchor="middle"
              transform={`rotate(-90, 10, ${PAD_T + PH / 2})`}
            >
              TPR (Recall)
            </text>
            {/* Tick labels */}
            {['0', '0.25', '0.5', '0.75', '1'].map((lbl, i) => {
              const x = PAD_L + (i / 4) * PW;
              const y = PAD_T + (1 - i / 4) * PH;
              return (
                <g key={lbl}>
                  <text x={x} y={PAD_T + PH + 10} fontSize="8" fill="#57534e" textAnchor="middle">
                    {lbl}
                  </text>
                  <text x={PAD_L - 3} y={y + 3} fontSize="8" fill="#57534e" textAnchor="end">
                    {lbl}
                  </text>
                </g>
              );
            })}
            {/* Diagonal baseline */}
            <polyline
              points={diag}
              fill="none"
              stroke="#57534e"
              strokeWidth="1"
              strokeDasharray="4,3"
            />
            <text
              x={PAD_L + PW * 0.65}
              y={PAD_T + PH * 0.3}
              fontSize="8"
              fill="#57534e"
              transform={`rotate(-45, ${PAD_L + PW * 0.65}, ${PAD_T + PH * 0.3})`}
            >
              Random (AUC=0.5)
            </text>
            {/* Perfect classifier (corner) */}
            <polyline
              points={`${PAD_L},${PAD_T + PH} ${PAD_L},${PAD_T} ${PAD_L + PW},${PAD_T}`}
              fill="none"
              stroke="#22c55e"
              strokeWidth="1"
              strokeDasharray="3,4"
              strokeOpacity="0.4"
            />
            {/* ROC curve */}
            <polyline
              points={rocPath}
              fill="none"
              stroke="#818cf8"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* AUC fill */}
            <polyline
              points={`${PAD_L},${PAD_T + PH} ${rocPath} ${PAD_L + PW},${PAD_T + PH}`}
              fill="#818cf8"
              fillOpacity="0.15"
              stroke="none"
            />
            {/* Operating point */}
            <circle cx={opX} cy={opY} r="6" fill="#f97316" />
            <text x={opX + 8} y={opY - 4} fontSize="9" fill="#f97316">
              τ={threshold.toFixed(2)}
            </text>
          </svg>

          {/* Stats row */}
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-lg border border-warm-border bg-surface p-2">
              <div className="text-neutral-400">AUC</div>
              <div
                className={`mt-0.5 font-bold font-mono ${auc >= 0.85 ? 'text-green-400' : auc >= 0.7 ? 'text-yellow-400' : 'text-red-400'}`}
              >
                {auc.toFixed(3)}
              </div>
            </div>
            <div className="rounded-lg border border-warm-border bg-surface p-2">
              <div className="text-neutral-400">TPR @ τ</div>
              <div className="mt-0.5 font-bold font-mono text-green-400">
                {(operatingPoint.tpr * 100).toFixed(1)}%
              </div>
            </div>
            <div className="rounded-lg border border-warm-border bg-surface p-2">
              <div className="text-neutral-400">FPR @ τ</div>
              <div className="mt-0.5 font-bold font-mono text-red-400">
                {(operatingPoint.fpr * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interpretation callout */}
      <Card>
        <CardHeader>
          <CardTitle>Interpreting AUC</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 text-sm sm:grid-cols-3">
            {[
              {
                range: 'AUC = 1.0',
                color: 'text-green-400',
                desc: 'Perfect separation. Every positive outscores every negative.',
              },
              {
                range: 'AUC = 0.5',
                color: 'text-yellow-400',
                desc: 'Random classifier. Curve lies on the diagonal baseline.',
              },
              {
                range: 'AUC < 0.5',
                color: 'text-red-400',
                desc: 'Worse than random. Flip predictions to improve performance.',
              },
            ].map(({ range, color, desc }) => (
              <div key={range} className="rounded-lg border border-warm-border bg-surface p-3">
                <div className={`font-bold font-mono ${color}`}>{range}</div>
                <div className="mt-1 text-neutral-400 text-xs">{desc}</div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-neutral-500">
            Drag the "Spread σ" slider to maximum to create heavy overlap. Watch AUC approach 0.5 --
            the "make it fail" scenario.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
