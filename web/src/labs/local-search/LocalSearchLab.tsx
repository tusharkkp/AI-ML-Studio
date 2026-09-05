import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { runLocalSearch, DEFAULT_LANDSCAPE } from '@/engines/search/local/engine';
import type { LocalSearchAlgorithm } from '@/engines/search/local/types';
import { Play, RotateCcw, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';

export function LocalSearchLab() {
  const [algorithm, setAlgorithm] = useState<LocalSearchAlgorithm>('hill-climbing');
  const [startX, setStartX] = useState<number>(0);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [initialTemp, setInitialTemp] = useState<number>(100);
  const [coolingRate, setCoolingRate] = useState<number>(0.92);
  const [numRestarts, setNumRestarts] = useState<number>(5);
  const [seed, setSeed] = useState<number>(42);

  const searchResult = useMemo(() => {
    return runLocalSearch({
      algorithm,
      startX,
      landscape: DEFAULT_LANDSCAPE,
      initialTemperature: initialTemp,
      coolingRate,
      numRestarts,
      seed,
      maxSteps: 60,
    });
  }, [algorithm, startX, initialTemp, coolingRate, numRestarts, seed]);

  const totalSteps = searchResult.steps.length;
  const currentStep = searchResult.steps[Math.min(currentStepIndex, totalSteps - 1)];

  // SVG coordinate transformation
  const svgWidth = 600;
  const svgHeight = 220;
  const paddingX = 30;
  const paddingY = 30;
  const innerWidth = svgWidth - 2 * paddingX;
  const innerHeight = svgHeight - 2 * paddingY;
  const maxElevation = 105;

  const points = DEFAULT_LANDSCAPE.map((elev, idx) => {
    const x = paddingX + (idx / (DEFAULT_LANDSCAPE.length - 1)) * innerWidth;
    const y = svgHeight - paddingY - (elev / maxElevation) * innerHeight;
    return { x, y, elevation: elev, idx };
  });

  const pathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1]!.x} ${svgHeight - paddingY} L ${points[0]!.x} ${svgHeight - paddingY} Z`;

  const agentXIdx = currentStep ? currentStep.currentX : startX;
  const agentPoint = points[agentXIdx] ?? points[0]!;

  return (
    <Card className="p-6 my-6 border-card-edge bg-card-fill backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-card-edge pb-4">
        <div>
          <span className="text-xs font-mono text-neutral-500">Local search arena</span>
          <h3 className="font-montserrat text-xl font-semibold text-foreground">
            Hill Climbing & Simulated Annealing Simulator
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Watch greedy hill climbers freeze on local peaks, and tune cooling schedules to escape
            local traps.
          </p>
        </div>

        {/* Algorithm Switcher */}
        <div className="flex rounded-lg border border-card-edge bg-neutral-900/60 p-0.5">
          <button
            onClick={() => {
              setAlgorithm('hill-climbing');
              setCurrentStepIndex(0);
            }}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              algorithm === 'hill-climbing'
                ? 'bg-brand text-white font-semibold'
                : 'text-neutral-400 hover:text-foreground'
            }`}
          >
            Steepest-Ascent
          </button>
          <button
            onClick={() => {
              setAlgorithm('simulated-annealing');
              setCurrentStepIndex(0);
            }}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              algorithm === 'simulated-annealing'
                ? 'bg-brand text-white font-semibold'
                : 'text-neutral-400 hover:text-foreground'
            }`}
          >
            Simulated Annealing
          </button>
          <button
            onClick={() => {
              setAlgorithm('random-restart');
              setCurrentStepIndex(0);
            }}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              algorithm === 'random-restart'
                ? 'bg-brand text-white font-semibold'
                : 'text-neutral-400 hover:text-foreground'
            }`}
          >
            Random-Restart
          </button>
        </div>
      </div>

      {/* Control Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-xs font-mono text-neutral-400 block mb-1.5">
            Initial Position x: <span className="font-bold text-foreground">{startX}</span>
          </label>
          <input
            type="range"
            min={0}
            max={DEFAULT_LANDSCAPE.length - 1}
            value={startX}
            onChange={(e) => {
              setStartX(Number(e.target.value));
              setCurrentStepIndex(0);
            }}
            className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-brand"
          />
          <div className="flex justify-between text-[10px] font-mono text-neutral-500 mt-1">
            <span>x=0 (Base)</span>
            <span>x=12 (Mid)</span>
            <span>x=24 (Edge)</span>
          </div>
        </div>

        {algorithm === 'simulated-annealing' && (
          <>
            <div>
              <label className="text-xs font-mono text-neutral-400 block mb-1.5">
                Initial Temperature T₀:{' '}
                <span className="font-bold text-foreground">{initialTemp}</span>
              </label>
              <input
                type="range"
                min={1}
                max={200}
                value={initialTemp}
                onChange={(e) => {
                  setInitialTemp(Number(e.target.value));
                  setCurrentStepIndex(0);
                }}
                className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-brand"
              />
              <span className="text-[10px] text-neutral-500 block mt-1">
                Higher temperature allows bolder downhill moves
              </span>
            </div>

            <div>
              <label className="text-xs font-mono text-neutral-400 block mb-1.5">
                Cooling Rate α:{' '}
                <span className="font-bold text-foreground">{coolingRate.toFixed(2)}</span>
              </label>
              <input
                type="range"
                min={0.8}
                max={0.98}
                step={0.01}
                value={coolingRate}
                onChange={(e) => {
                  setCoolingRate(Number(e.target.value));
                  setCurrentStepIndex(0);
                }}
                className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-brand"
              />
              <span className="text-[10px] text-neutral-500 block mt-1">
                T_next = α × T (exponential cooling)
              </span>
            </div>
          </>
        )}

        {algorithm === 'random-restart' && (
          <>
            <div>
              <label className="text-xs font-mono text-neutral-400 block mb-1.5">
                Number of Restarts: <span className="font-bold text-foreground">{numRestarts}</span>
              </label>
              <input
                type="range"
                min={2}
                max={15}
                value={numRestarts}
                onChange={(e) => {
                  setNumRestarts(Number(e.target.value));
                  setCurrentStepIndex(0);
                }}
                className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-brand"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-neutral-400 block mb-1.5">
                PRNG Random Seed:
              </label>
              <Button
                size="sm"
                variant="outline"
                className="w-full text-xs"
                onClick={() => {
                  setSeed((prev) => prev + 17);
                  setCurrentStepIndex(0);
                }}
              >
                <RefreshCw className="size-3.5 mr-1.5" />
                Regenerate Random Starts
              </Button>
            </div>
          </>
        )}

        {algorithm === 'hill-climbing' && (
          <div className="col-span-2 flex items-center p-3 rounded-xl border border-card-edge bg-neutral-900/40 text-xs text-neutral-400">
            <span>
              Steepest-Ascent evaluates the immediate left and right neighbors and climbs whichever
              offers the highest positive gradient. When both neighbors are lower, it immediately
              halts.
            </span>
          </div>
        )}
      </div>

      {/* Rugged Landscape SVG Canvas */}
      <div className="rounded-2xl border border-card-edge bg-[#080808] p-4 mb-4 relative overflow-hidden">
        <div className="flex items-center justify-between mb-2 text-xs font-mono text-neutral-400">
          <span>Objective Function f(x) Terrain</span>
          <span>
            Position: x={agentXIdx} | Elevation: {DEFAULT_LANDSCAPE[agentXIdx]}
          </span>
        </div>

        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto">
          <defs>
            <linearGradient id="terrainGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Shaded Area under Terrain */}
          <path d={areaD} fill="url(#terrainGrad)" />

          {/* Base Floor Line */}
          <line
            x1={paddingX}
            y1={svgHeight - paddingY}
            x2={svgWidth - paddingX}
            y2={svgHeight - paddingY}
            stroke="#262626"
            strokeWidth="1"
          />

          {/* Terrain Line */}
          <path d={pathD} fill="none" stroke="#f97316" strokeWidth="2.5" />

          {/* Critical Topography Landmarks */}
          {/* Local Peak x=3 */}
          <circle cx={points[3]!.x} cy={points[3]!.y} r="3.5" fill="#f43f5e" />
          <text
            x={points[3]!.x}
            y={points[3]!.y - 10}
            textAnchor="middle"
            fill="#f43f5e"
            fontSize="9"
            fontFamily="monospace"
          >
            Local Peak (28)
          </text>

          {/* Plateau x=7 */}
          <rect
            x={points[6]!.x}
            y={points[7]!.y - 2}
            width={points[8]!.x - points[6]!.x}
            height="4"
            fill="#eab308"
            opacity="0.5"
          />
          <text
            x={points[7]!.x}
            y={points[7]!.y - 10}
            textAnchor="middle"
            fill="#eab308"
            fontSize="9"
            fontFamily="monospace"
          >
            Plateau (18)
          </text>

          {/* Secondary Peak x=12 */}
          <circle cx={points[12]!.x} cy={points[12]!.y} r="3.5" fill="#a855f7" />
          <text
            x={points[12]!.x}
            y={points[12]!.y - 10}
            textAnchor="middle"
            fill="#a855f7"
            fontSize="9"
            fontFamily="monospace"
          >
            Peak 2 (60)
          </text>

          {/* Global Peak x=21 */}
          <circle cx={points[21]!.x} cy={points[21]!.y} r="5" fill="#10b981" />
          <text
            x={points[21]!.x}
            y={points[21]!.y - 12}
            textAnchor="middle"
            fill="#10b981"
            fontSize="10"
            fontWeight="bold"
            fontFamily="monospace"
          >
            ★ Global Max (100)
          </text>

          {/* Agent Current Position Dot */}
          <circle
            cx={agentPoint.x}
            cy={agentPoint.y}
            r="7"
            fill="#ffffff"
            stroke="#f97316"
            strokeWidth="3"
            className="animate-pulse"
          />
        </svg>

        {/* Step Message Banner */}
        <div className="mt-3 p-2.5 rounded-lg border border-card-edge bg-neutral-900/50 font-mono text-xs text-neutral-300 flex items-center justify-between">
          <span>{currentStep?.message ?? 'Ready to search.'}</span>
          {currentStep?.temperature !== undefined && (
            <span className="text-[11px] text-amber-400">
              T={currentStep.temperature.toFixed(2)} | P=
              {currentStep.acceptanceProbability !== undefined
                ? `${(currentStep.acceptanceProbability * 100).toFixed(1)}%`
                : '100%'}
            </span>
          )}
        </div>
      </div>

      {/* Step Playback Controls & Status Badge */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="primary"
            onClick={() => {
              if (currentStepIndex < totalSteps - 1) {
                setCurrentStepIndex((prev) => prev + 1);
              } else {
                setCurrentStepIndex(0);
              }
            }}
          >
            <Play className="size-3.5 mr-1" />
            {currentStepIndex >= totalSteps - 1 ? 'Replay' : 'Step Forward'}
          </Button>

          <Button size="sm" variant="outline" onClick={() => setCurrentStepIndex(0)}>
            <RotateCcw className="size-3.5 mr-1" />
            Reset
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-400 font-mono">Result:</span>
          {searchResult.reachedGlobalPeak ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="size-3.5" />
              Global Peak Reached (100)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2.5 py-1 rounded-full">
              <AlertTriangle className="size-3.5" />
              Trapped in Local Optimum ({searchResult.finalElevation})
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
