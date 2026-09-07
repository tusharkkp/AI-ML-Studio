import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  solveCsp,
  createMapColoringProblem,
  createNQueensProblem,
} from '@/engines/csp/solver/engine';
import type { CspValue } from '@/engines/csp/solver/types';
import { Play, RotateCcw, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface AustraliaRegion {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const AUSTRALIA_REGIONS: AustraliaRegion[] = [
  { id: 'WA', name: 'Western Australia', x: 40, y: 80, width: 90, height: 130 },
  { id: 'NT', name: 'Northern Territory', x: 140, y: 70, width: 80, height: 70 },
  { id: 'SA', name: 'South Australia', x: 140, y: 150, width: 80, height: 70 },
  { id: 'Q', name: 'Queensland', x: 230, y: 70, width: 90, height: 80 },
  { id: 'NSW', name: 'New South Wales', x: 230, y: 160, width: 90, height: 50 },
  { id: 'V', name: 'Victoria', x: 220, y: 220, width: 80, height: 35 },
  { id: 'T', name: 'Tasmania', x: 240, y: 275, width: 45, height: 35 },
];

export function CspLab() {
  const [problemType, setProblemType] = useState<'map' | 'queens' | 'fail'>('map');
  const [useAc3, setUseAc3] = useState<boolean>(true);
  const [useMrv, setUseMrv] = useState<boolean>(true);
  const [useLcv, setUseLcv] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  const problem = useMemo(() => {
    if (problemType === 'map') {
      return createMapColoringProblem(['Red', 'Green', 'Blue']);
    } else if (problemType === 'queens') {
      return createNQueensProblem(4);
    } else {
      // Unsatisfiable complete graph K4 with 2 colors
      const variables = ['A', 'B', 'C', 'D'];
      const domains = {
        A: ['Red', 'Green'],
        B: ['Red', 'Green'],
        C: ['Red', 'Green'],
        D: ['Red', 'Green'],
      };
      const constraints = [
        { var1: 'A', var2: 'B', isValid: (x: CspValue, y: CspValue) => x !== y },
        { var1: 'A', var2: 'C', isValid: (x: CspValue, y: CspValue) => x !== y },
        { var1: 'A', var2: 'D', isValid: (x: CspValue, y: CspValue) => x !== y },
        { var1: 'B', var2: 'C', isValid: (x: CspValue, y: CspValue) => x !== y },
        { var1: 'B', var2: 'D', isValid: (x: CspValue, y: CspValue) => x !== y },
        { var1: 'C', var2: 'D', isValid: (x: CspValue, y: CspValue) => x !== y },
      ];
      return { variables, domains, constraints };
    }
  }, [problemType]);

  const solverResult = useMemo(() => {
    return solveCsp(problem, { useAc3, useMrv, useLcv, maxSteps: 150 });
  }, [problem, useAc3, useMrv, useLcv]);

  const totalSteps = solverResult.steps.length;
  const currentStep = solverResult.steps[Math.min(currentStepIndex, totalSteps - 1)];

  const getColorHex = (colorName?: CspValue) => {
    switch (colorName) {
      case 'Red':
        return '#ef4444';
      case 'Green':
        return '#10b981';
      case 'Blue':
        return '#3b82f6';
      default:
        return '#262626';
    }
  };

  return (
    <Card className="p-6 my-6 border-card-edge bg-card-fill backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-card-edge pb-4">
        <div>
          <span className="text-xs font-mono text-neutral-500">Constraint satisfaction arena</span>
          <h3 className="font-montserrat text-xl font-semibold text-foreground">
            CSP Backtracking & AC-3 Propagation Studio
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Visualize domain pruning, test MRV heuristic, and witness AC-3 domain wipeout on
            unsatisfiable graphs.
          </p>
        </div>

        {/* Problem Switcher */}
        <div className="flex rounded-lg border border-card-edge bg-neutral-900/60 p-0.5">
          <button
            onClick={() => {
              setProblemType('map');
              setCurrentStepIndex(0);
            }}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              problemType === 'map'
                ? 'bg-brand text-white font-semibold'
                : 'text-neutral-400 hover:text-foreground'
            }`}
          >
            Australia Map
          </button>
          <button
            onClick={() => {
              setProblemType('queens');
              setCurrentStepIndex(0);
            }}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              problemType === 'queens'
                ? 'bg-brand text-white font-semibold'
                : 'text-neutral-400 hover:text-foreground'
            }`}
          >
            4-Queens Puzzle
          </button>
          <button
            onClick={() => {
              setProblemType('fail');
              setCurrentStepIndex(0);
            }}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              problemType === 'fail'
                ? 'bg-rose-600 text-white font-semibold'
                : 'text-neutral-400 hover:text-rose-400'
            }`}
          >
            K₄ 2-Color (Break It!)
          </button>
        </div>
      </div>

      {/* Heuristic & Solver Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="space-y-2 p-3 rounded-xl border border-card-edge bg-neutral-900/50 text-xs">
          <span className="font-mono text-neutral-400 font-semibold block">Inference Options:</span>
          <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
            <input
              type="checkbox"
              checked={useAc3}
              onChange={(e) => {
                setUseAc3(e.target.checked);
                setCurrentStepIndex(0);
              }}
              className="rounded border-card-edge text-brand focus:ring-brand"
            />
            <span>AC-3 Arc Consistency Propagation</span>
          </label>
        </div>

        <div className="space-y-2 p-3 rounded-xl border border-card-edge bg-neutral-900/50 text-xs">
          <span className="font-mono text-neutral-400 font-semibold block">Variable Ordering:</span>
          <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
            <input
              type="checkbox"
              checked={useMrv}
              onChange={(e) => {
                setUseMrv(e.target.checked);
                setCurrentStepIndex(0);
              }}
              className="rounded border-card-edge text-brand focus:ring-brand"
            />
            <span>MRV Heuristic (Most Constrained)</span>
          </label>
        </div>

        <div className="space-y-2 p-3 rounded-xl border border-card-edge bg-neutral-900/50 text-xs">
          <span className="font-mono text-neutral-400 font-semibold block">Value Ordering:</span>
          <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
            <input
              type="checkbox"
              checked={useLcv}
              onChange={(e) => {
                setUseLcv(e.target.checked);
                setCurrentStepIndex(0);
              }}
              className="rounded border-card-edge text-brand focus:ring-brand"
            />
            <span>LCV Heuristic (Least Constraining)</span>
          </label>
        </div>
      </div>

      {/* Visual Canvas */}
      <div className="rounded-2xl border border-card-edge bg-[#080808] p-4 mb-4 relative overflow-hidden">
        <div className="flex items-center justify-between mb-3 text-xs font-mono text-neutral-400">
          <span>
            {problemType === 'map'
              ? 'Australia Map Coloring (WA, NT, SA, Q, NSW, V, T)'
              : problemType === 'queens'
                ? '4-Queens Chessboard'
                : 'Complete Graph K₄ (4 vertices, 6 pairwise inequality constraints)'}
          </span>
          <span>
            Step {currentStep ? currentStep.stepIndex : 0} of {totalSteps}
          </span>
        </div>

        {/* Australia Map SVG */}
        {problemType === 'map' && (
          <svg viewBox="0 0 350 320" className="w-full h-auto max-h-[320px]">
            {AUSTRALIA_REGIONS.map((reg) => {
              const assignedVal = currentStep?.assignment[reg.id];
              const remainingDomains = currentStep?.domains[reg.id] ?? ['Red', 'Green', 'Blue'];
              const isCurrent = currentStep?.variable === reg.id;
              const fillColor = assignedVal ? getColorHex(assignedVal) : '#141414';

              return (
                <g key={reg.id}>
                  <rect
                    x={reg.x}
                    y={reg.y}
                    width={reg.width}
                    height={reg.height}
                    rx="8"
                    fill={fillColor}
                    fillOpacity={assignedVal ? 0.35 : 0.8}
                    stroke={
                      isCurrent ? '#f59e0b' : assignedVal ? getColorHex(assignedVal) : '#333333'
                    }
                    strokeWidth={isCurrent ? 3 : 1.5}
                    className="transition-colors duration-200"
                  />
                  <text
                    x={reg.x + reg.width / 2}
                    y={reg.y + reg.height / 2 - 4}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="11"
                    fontFamily="sans-serif"
                    fontWeight="bold"
                  >
                    {reg.id}
                  </text>
                  {/* Domain badges */}
                  <text
                    x={reg.x + reg.width / 2}
                    y={reg.y + reg.height / 2 + 12}
                    textAnchor="middle"
                    fill="#a3a3a3"
                    fontSize="8"
                    fontFamily="monospace"
                  >
                    {assignedVal
                      ? assignedVal
                      : `{${remainingDomains.map((c) => String(c)[0]).join(',')}}`}
                  </text>
                </g>
              );
            })}
          </svg>
        )}

        {/* 4-Queens Chessboard */}
        {problemType === 'queens' && (
          <div className="max-w-[280px] mx-auto py-2">
            <div className="grid grid-cols-4 border border-card-edge rounded-xl overflow-hidden">
              {Array.from({ length: 4 }).map((_, r) =>
                Array.from({ length: 4 }).map((_, c) => {
                  const isBlackCell = (r + c) % 2 === 1;
                  const queenColVal = currentStep?.assignment[`Q${c}`];
                  const hasQueen = queenColVal !== undefined && Number(queenColVal) === r;

                  return (
                    <div
                      key={`${r}-${c}`}
                      className={`aspect-square flex items-center justify-center text-xl font-bold transition-all ${
                        isBlackCell ? 'bg-neutral-900/80' : 'bg-neutral-800/40'
                      }`}
                    >
                      {hasQueen ? (
                        <span className="text-amber-400 drop-shadow animate-bounce">♛</span>
                      ) : (
                        <span className="text-neutral-700 text-[10px] font-mono">
                          {c},{r}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* K4 Graph Canvas */}
        {problemType === 'fail' && (
          <div className="p-8 text-center space-y-3">
            <div className="inline-flex items-center gap-2 p-3 rounded-xl border border-rose-500/40 bg-rose-950/20 text-rose-300 text-xs">
              <ShieldAlert className="size-5 text-rose-400" />
              <span>
                K₄ complete graph has chromatic number χ = 4. Attempting to color with only 2 colors
                triggers rapid AC-3 domain wipeout!
              </span>
            </div>
            <div className="flex justify-center gap-6 font-mono text-xs">
              {['A', 'B', 'C', 'D'].map((v) => (
                <div
                  key={v}
                  className="p-3 rounded-xl border border-card-edge bg-neutral-900/60 w-24"
                >
                  <span className="font-bold text-foreground block mb-1">Vertex {v}</span>
                  <span className="text-[10px] text-neutral-400">
                    Domain: [{currentStep?.domains[v]?.join(', ') ?? 'Ø (WIPEOUT)'}]
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step Message */}
        <div className="mt-3 p-2.5 rounded-lg border border-card-edge bg-neutral-900/50 font-mono text-xs text-neutral-300 flex items-center justify-between">
          <span>{currentStep?.message ?? 'Ready to solve CSP.'}</span>
          <span className="text-[11px] text-neutral-400">
            Backtracks: {solverResult.backtracks} | Nodes: {solverResult.nodesExpanded}
          </span>
        </div>
      </div>

      {/* Step Controls & Telemetry */}
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
          <span className="text-xs text-neutral-400 font-mono">Status:</span>
          {solverResult.solved ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="size-3.5" />
              Solution Found (0 Violations)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2.5 py-1 rounded-full">
              <AlertTriangle className="size-3.5" />
              Unsatisfiable / Domain Wipeout
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
