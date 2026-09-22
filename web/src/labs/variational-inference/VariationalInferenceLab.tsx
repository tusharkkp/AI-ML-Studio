import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Sparkles, AlertTriangle } from 'lucide-react';

function gaussianPdf(z: number, mu: number, sigma: number): number {
  const norm = 1 / (sigma * Math.sqrt(2 * Math.PI));
  const diff = (z - mu) / sigma;
  return norm * Math.exp(-0.5 * diff * diff);
}

function truePosteriorPdf(z: number): number {
  // Bimodal Gaussian mixture: 40% Mode 1 (-2.0, std 0.7), 60% Mode 2 (+2.0, std 0.9)
  return 0.4 * gaussianPdf(z, -2.0, 0.7) + 0.6 * gaussianPdf(z, 2.0, 0.9);
}

const W = 480;
const H = 280;
const PAD = 32;
const Z_DOMAIN: [number, number] = [-5, 5];
const Y_MAX = 0.5;

function toCanvas(z: number, y: number): [number, number] {
  const cx = PAD + ((z - Z_DOMAIN[0]) / (Z_DOMAIN[1] - Z_DOMAIN[0])) * (W - 2 * PAD);
  const cy = H - PAD - (y / Y_MAX) * (H - 2 * PAD);
  return [cx, cy];
}

export function VariationalInferenceLab() {
  const [mu, setMu] = useState<number>(0.0);
  const [sigma, setSigma] = useState<number>(1.8);
  const [optimizing, setOptimizing] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);

  // Discrete numerical integration across z in [-5, 5]
  const metrics = useMemo(() => {
    const steps = 250;
    const dz = (Z_DOMAIN[1] - Z_DOMAIN[0]) / steps;
    let kl = 0;

    for (let i = 0; i <= steps; i++) {
      const z = Z_DOMAIN[0] + i * dz;
      const qVal = gaussianPdf(z, mu, sigma);
      const pVal = truePosteriorPdf(z);

      if (qVal > 1e-9) {
        const ratio = Math.max(1e-12, qVal) / Math.max(1e-12, pVal);
        kl += qVal * Math.log(ratio) * dz;
      }
    }

    kl = Math.max(0, kl); // KL is strictly non-negative
    const logEvidence = -1.85; // Fixed true log p(x)
    const elbo = logEvidence - kl;

    return {
      kl,
      logEvidence,
      elbo,
    };
  }, [mu, sigma]);

  // Canvas drawing
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, W, H);

    // 1. Grid & axes
    ctx.strokeStyle = '#292524';
    ctx.lineWidth = 1;

    // Baseline
    const [, baseY] = toCanvas(0, 0);
    ctx.beginPath();
    ctx.moveTo(PAD, baseY);
    ctx.lineTo(W - PAD, baseY);
    ctx.stroke();

    // Center vertical axis
    const [origX] = toCanvas(0, 0);
    ctx.beginPath();
    ctx.moveTo(origX, PAD);
    ctx.lineTo(origX, H - PAD);
    ctx.stroke();

    // 2. Draw true posterior p(z|x) (slate dashed curve with subtle fill)
    ctx.beginPath();
    const steps = 180;
    const dz = (Z_DOMAIN[1] - Z_DOMAIN[0]) / steps;

    for (let i = 0; i <= steps; i++) {
      const z = Z_DOMAIN[0] + i * dz;
      const y = truePosteriorPdf(z);
      const [cx, cy] = toCanvas(z, y);
      if (i === 0) ctx.moveTo(cx, cy);
      else ctx.lineTo(cx, cy);
    }

    // Stroke true posterior
    ctx.strokeStyle = '#78716c'; // stone-500
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 3]);
    ctx.stroke();
    ctx.setLineDash([]);

    // 3. Draw variational approximation q_phi(z) (solid cream / amber curve with fill)
    ctx.beginPath();
    let firstX = PAD;
    let lastX = W - PAD;

    for (let i = 0; i <= steps; i++) {
      const z = Z_DOMAIN[0] + i * dz;
      const y = gaussianPdf(z, mu, sigma);
      const [cx, cy] = toCanvas(z, y);
      if (i === 0) {
        firstX = cx;
        ctx.moveTo(cx, cy);
      } else {
        ctx.lineTo(cx, cy);
      }
      if (i === steps) lastX = cx;
    }

    // Fill underneath q
    ctx.lineTo(lastX, baseY);
    ctx.lineTo(firstX, baseY);
    ctx.closePath();
    ctx.fillStyle = 'rgba(254, 243, 199, 0.08)'; // pale cream wash
    ctx.fill();

    // Stroke q curve
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const z = Z_DOMAIN[0] + i * dz;
      const y = gaussianPdf(z, mu, sigma);
      const [cx, cy] = toCanvas(z, y);
      if (i === 0) ctx.moveTo(cx, cy);
      else ctx.lineTo(cx, cy);
    }
    ctx.strokeStyle = '#fef3c7'; // pale cream
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Labels
    ctx.font = '11px monospace';
    ctx.fillStyle = '#78716c';
    ctx.fillText('True p(z|x) (Bimodal)', PAD + 10, PAD + 15);

    ctx.fillStyle = '#fef3c7';
    ctx.fillText(
      `Variational q(z) [μ=${mu.toFixed(2)}, σ=${sigma.toFixed(2)}]`,
      PAD + 10,
      PAD + 32
    );
  }, [mu, sigma]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Coordinate ascent animation to capture right mode
  const runOptimization = () => {
    if (optimizing) return;
    setOptimizing(true);

    const targetMu = 2.0;
    const targetSigma = 0.9;
    const startMu = mu;
    const startSigma = sigma;
    let progress = 0;

    const step = () => {
      progress += 0.035;
      if (progress >= 1.0) {
        setMu(targetMu);
        setSigma(targetSigma);
        setOptimizing(false);
      } else {
        // Ease-out transition
        const t = 1 - Math.pow(1 - progress, 3);
        setMu(startMu + (targetMu - startMu) * t);
        setSigma(startSigma + (targetSigma - startSigma) * t);
        animRef.current = requestAnimationFrame(step);
      }
    };

    animRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <Card className="rounded-xl border border-orange-50/15 bg-black/20 backdrop-blur-sm shadow-none">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-xl font-medium text-stone-200">
              Variational inference &amp; ELBO optimizer
            </CardTitle>
            <CardDescription className="text-stone-400">
              Transform intractable Bayesian integration into deterministic numerical optimization
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={runOptimization}
              disabled={optimizing}
              className="text-xs rounded-lg rounded-br-none border-amber-600/50 text-amber-300 hover:bg-amber-950/40"
            >
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              {optimizing ? 'Optimizing ELBO...' : 'Coordinate ascent (Optimize ELBO)'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Visual Density Plot Area */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="relative rounded-lg border border-[#292524] bg-[#0c0a09] p-1 w-full max-w-[500px]">
              <canvas
                ref={canvasRef}
                width={W}
                height={H}
                className="w-full h-auto block rounded"
              />
            </div>

            {/* Presets Toolbar */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-stone-500 font-mono">Mode Presets:</span>
              <button
                type="button"
                onClick={() => {
                  setMu(-2.0);
                  setSigma(0.7);
                }}
                className="px-2.5 py-1 rounded bg-[#1c1917] hover:bg-[#292524] text-stone-300 border border-[#292524] transition-colors"
              >
                Fit Left Mode (μ=-2.0)
              </button>
              <button
                type="button"
                onClick={() => {
                  setMu(2.0);
                  setSigma(0.9);
                }}
                className="px-2.5 py-1 rounded bg-[#1c1917] hover:bg-[#292524] text-amber-300 border border-amber-900/40 transition-colors"
              >
                Fit Right Mode (μ=+2.0, Optimal)
              </button>
              <button
                type="button"
                onClick={() => {
                  setMu(0.0);
                  setSigma(2.2);
                }}
                className="px-2.5 py-1 rounded bg-[#1c1917] hover:bg-[#292524] text-red-300 border border-red-900/30 transition-colors"
              >
                Middle Averaging Trap (μ=0, High KL)
              </button>
            </div>
          </div>

          {/* Controls & Mathematical Decomposition */}
          <div className="lg:col-span-5 space-y-4">
            {/* Live ELBO Equation Decomposition */}
            <div className="rounded-xl border border-[#292524] bg-[#0c0a09] p-4 space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-stone-400 block border-b border-[#292524] pb-2">
                Evidence lower bound (ELBO) decomposition
              </span>

              <div className="space-y-2 text-xs">
                {/* Log Evidence Ceiling */}
                <div className="flex items-center justify-between rounded bg-[#1c1917] p-2.5 border border-[#292524]">
                  <div>
                    <span className="text-stone-400 font-medium">True log evidence ln p(x):</span>
                    <span className="block text-[10px] text-stone-500">Fixed constant ceiling</span>
                  </div>
                  <span className="font-mono text-stone-200 text-sm">
                    {metrics.logEvidence.toFixed(2)}
                  </span>
                </div>

                {/* KL Divergence */}
                <div className="flex items-center justify-between rounded bg-[#1c1917] p-2.5 border border-[#292524]">
                  <div>
                    <span className="text-amber-300 font-medium">KL Divergence KL(q || p):</span>
                    <span className="block text-[10px] text-stone-500">
                      Strictly non-negative penalty
                    </span>
                  </div>
                  <span className="font-mono text-amber-300 text-sm font-bold">
                    {metrics.kl.toFixed(2)}
                  </span>
                </div>

                {/* Resulting ELBO */}
                <div className="flex items-center justify-between rounded border border-emerald-800/40 bg-emerald-950/20 p-2.5">
                  <div>
                    <span className="text-emerald-300 font-medium">ELBO(φ) = ln p(x) - KL:</span>
                    <span className="block text-[10px] text-stone-400">
                      Objective maximized by optimizer
                    </span>
                  </div>
                  <span className="font-mono text-emerald-400 text-base font-bold">
                    {metrics.elbo.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Progress bar toward evidence ceiling */}
              <div className="pt-1 space-y-1">
                <div className="flex justify-between text-[11px] text-stone-500 font-mono">
                  <span>ELBO Tightness</span>
                  <span>Gap (KL): {metrics.kl.toFixed(2)}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-stone-900 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-150"
                    style={{
                      width: `${Math.max(5, Math.min(100, 100 - metrics.kl * 30))}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Parameter Sliders */}
            <div className="rounded-xl border border-[#292524] bg-[#0c0a09] p-4 space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-stone-300">
                  <span>Variational mean (μ):</span>
                  <span className="font-mono text-amber-300">{mu.toFixed(2)}</span>
                </div>
                <Slider
                  label="Variational mean (mu)"
                  value={mu}
                  min={-3.5}
                  max={3.5}
                  step={0.05}
                  onChange={(val) => setMu(Math.round(val * 100) / 100)}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-stone-300">
                  <span>Variational std (σ):</span>
                  <span className="font-mono text-amber-300">{sigma.toFixed(2)}</span>
                </div>
                <Slider
                  label="Variational std (sigma)"
                  value={sigma}
                  min={0.3}
                  max={2.5}
                  step={0.05}
                  onChange={(val) => setSigma(Math.round(val * 100) / 100)}
                />
              </div>
            </div>

            {/* Intuition Callout */}
            <div className="rounded-lg border border-amber-900/30 bg-amber-950/10 p-3 space-y-1 text-xs">
              <div className="flex items-center gap-1.5 font-medium text-amber-300">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                Mode-seeking behavior (Reverse KL)
              </div>
              <p className="text-stone-300 leading-relaxed text-[11px]">
                Notice how q_phi(z) cannot cover both peaks simultaneously! Because VI minimizes
                reverse KL(q || p) = E_q[ln(q / p)], placing probability mass where p(z|x) is near
                zero incurs an infinite penalty. Therefore, the single Gaussian collapses onto one
                mode, underestimating total variance.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
