import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { runAStarSearch } from '@/engines/search/astar/engine';
import type { HeuristicType } from '@/engines/search/astar/types';
import { Play, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';

interface GridPoint {
  x: number;
  y: number;
}

interface PresetScenario {
  id: string;
  name: string;
  description: string;
  width: number;
  height: number;
  start: GridPoint;
  goal: GridPoint;
  obstacles: GridPoint[];
}

const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'concave-trap',
    name: 'Horseshoe Trap (Concave Barrier)',
    description:
      'A U-shaped barrier traps Greedy Best-First into a dead end, whereas A* safely navigates around.',
    width: 12,
    height: 8,
    start: { x: 1, y: 3 },
    goal: { x: 7, y: 3 },
    obstacles: [
      { x: 5, y: 1 },
      { x: 5, y: 2 },
      { x: 5, y: 3 },
      { x: 5, y: 4 },
      { x: 5, y: 5 },
      { x: 6, y: 1 },
      { x: 7, y: 1 },
      { x: 8, y: 1 },
      { x: 8, y: 2 },
      { x: 8, y: 3 },
      { x: 8, y: 4 },
      { x: 8, y: 5 },
    ],
  },
  {
    id: 'staggered-walls',
    name: 'Staggered Barrier Slits',
    description:
      'Alternating barriers test heuristic guidance through narrow navigation corridors.',
    width: 12,
    height: 8,
    start: { x: 0, y: 0 },
    goal: { x: 11, y: 7 },
    obstacles: [
      { x: 3, y: 0 },
      { x: 3, y: 1 },
      { x: 3, y: 2 },
      { x: 3, y: 3 },
      { x: 3, y: 4 },
      { x: 7, y: 3 },
      { x: 7, y: 4 },
      { x: 7, y: 5 },
      { x: 7, y: 6 },
      { x: 7, y: 7 },
    ],
  },
  {
    id: 'open-plains',
    name: 'Open Plains Expansion Race',
    description:
      'Compare frontier expansion shapes across Manhattan, Euclidean, and Zero heuristic (Dijkstra).',
    width: 12,
    height: 8,
    start: { x: 1, y: 1 },
    goal: { x: 10, y: 6 },
    obstacles: [],
  },
];

export function HeuristicSearchLab() {
  const [activeScenarioId, setActiveScenarioId] = useState<string>('concave-trap');
  const [algorithm, setAlgorithm] = useState<'astar' | 'greedy'>('astar');
  const [heuristic, setHeuristic] = useState<HeuristicType>('manhattan');
  const [allowDiagonals, setAllowDiagonals] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [hoveredCell, setHoveredCell] = useState<GridPoint | null>(null);

  const scenario = useMemo(() => {
    return PRESET_SCENARIOS.find((s) => s.id === activeScenarioId) ?? PRESET_SCENARIOS[0]!;
  }, [activeScenarioId]);

  const searchResult = useMemo(() => {
    return runAStarSearch({
      width: scenario.width,
      height: scenario.height,
      start: scenario.start,
      goal: scenario.goal,
      obstacles: scenario.obstacles,
      algorithm,
      heuristic,
      allowDiagonals,
    });
  }, [scenario, algorithm, heuristic, allowDiagonals]);

  const totalSteps = searchResult.steps.length;
  const currentStep = searchResult.steps[Math.min(currentStepIndex, totalSteps - 1)];

  const isCellObstacle = (x: number, y: number) => {
    return scenario.obstacles.some((o) => o.x === x && o.y === y);
  };

  const isCellStart = (x: number, y: number) => {
    return scenario.start.x === x && scenario.start.y === y;
  };

  const isCellGoal = (x: number, y: number) => {
    return scenario.goal.x === x && scenario.goal.y === y;
  };

  const isCellOnPath = (x: number, y: number) => {
    return searchResult.found && searchResult.path.some((p) => p.x === x && p.y === y);
  };

  return (
    <Card className="p-6 my-6 border-card-edge bg-card-fill backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-card-edge pb-4">
        <div>
          <span className="text-xs font-mono text-neutral-500">Heuristic search arena</span>
          <h3 className="font-montserrat text-xl font-semibold text-foreground">
            A* Search vs Greedy Best-First Simulator
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Evaluate admissible vs overestimating heuristics, witness concave traps, and inspect
            f(n) = g(n) + h(n).
          </p>
        </div>

        {/* Algorithm Selection Mode */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-card-edge bg-neutral-900/60 p-0.5">
            <button
              onClick={() => {
                setAlgorithm('astar');
                setCurrentStepIndex(0);
              }}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                algorithm === 'astar'
                  ? 'bg-brand text-white font-semibold'
                  : 'text-neutral-400 hover:text-foreground'
              }`}
            >
              A* Search (g + h)
            </button>
            <button
              onClick={() => {
                setAlgorithm('greedy');
                setCurrentStepIndex(0);
              }}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                algorithm === 'greedy'
                  ? 'bg-brand text-white font-semibold'
                  : 'text-neutral-400 hover:text-foreground'
              }`}
            >
              Greedy Best-First (h only)
            </button>
          </div>
        </div>
      </div>

      {/* Preset Scenarios & Heuristics Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-xs font-mono text-neutral-400 block mb-1.5">
            Preset Environment:
          </label>
          <div className="flex flex-col gap-1.5">
            {PRESET_SCENARIOS.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setActiveScenarioId(p.id);
                  setCurrentStepIndex(0);
                }}
                className={`text-left text-xs px-3 py-2 rounded-lg border transition-colors ${
                  activeScenarioId === p.id
                    ? 'border-brand/40 bg-brand/10 text-foreground font-semibold'
                    : 'border-card-edge bg-card-fill text-neutral-400 hover:text-foreground'
                }`}
              >
                <div>{p.name}</div>
                <div className="text-[10px] text-neutral-500 font-normal line-clamp-1">
                  {p.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-mono text-neutral-400 block mb-1.5">
            Heuristic Function h(n):
          </label>
          <div className="space-y-1.5">
            <button
              onClick={() => {
                setHeuristic('manhattan');
                setCurrentStepIndex(0);
              }}
              className={`w-full text-left text-xs px-3 py-2 rounded-lg border transition-colors ${
                heuristic === 'manhattan'
                  ? 'border-brand/40 bg-brand/10 text-foreground font-semibold'
                  : 'border-card-edge bg-card-fill text-neutral-400 hover:text-foreground'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>Manhattan Distance</span>
                <span className="text-[10px] font-mono text-emerald-400">Admissible</span>
              </div>
              <div className="text-[10px] text-neutral-500 font-normal">
                |dx| + |dy| (Grid-locked steps)
              </div>
            </button>

            <button
              onClick={() => {
                setHeuristic('euclidean');
                setCurrentStepIndex(0);
              }}
              className={`w-full text-left text-xs px-3 py-2 rounded-lg border transition-colors ${
                heuristic === 'euclidean'
                  ? 'border-brand/40 bg-brand/10 text-foreground font-semibold'
                  : 'border-card-edge bg-card-fill text-neutral-400 hover:text-foreground'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>Euclidean Distance</span>
                <span className="text-[10px] font-mono text-emerald-400">Admissible</span>
              </div>
              <div className="text-[10px] text-neutral-500 font-normal">
                Straight-line distance sqrt(dx² + dy²)
              </div>
            </button>

            <button
              onClick={() => {
                setHeuristic('overestimating');
                setCurrentStepIndex(0);
              }}
              className={`w-full text-left text-xs px-3 py-2 rounded-lg border transition-colors ${
                heuristic === 'overestimating'
                  ? 'border-rose-500/50 bg-rose-500/10 text-rose-300 font-semibold'
                  : 'border-card-edge bg-card-fill text-neutral-400 hover:text-rose-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>Overestimating (Make It Fail!)</span>
                <span className="text-[10px] font-mono text-rose-400 font-bold">
                  Non-Admissible
                </span>
              </div>
              <div className="text-[10px] text-neutral-500 font-normal">
                2.5 × Manhattan (Violates h ≤ h*)
              </div>
            </button>

            <button
              onClick={() => {
                setHeuristic('zero');
                setCurrentStepIndex(0);
              }}
              className={`w-full text-left text-xs px-3 py-2 rounded-lg border transition-colors ${
                heuristic === 'zero'
                  ? 'border-brand/40 bg-brand/10 text-foreground font-semibold'
                  : 'border-card-edge bg-card-fill text-neutral-400 hover:text-foreground'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>Zero Heuristic (Dijkstra)</span>
                <span className="text-[10px] font-mono text-neutral-400">h(n) = 0</span>
              </div>
              <div className="text-[10px] text-neutral-500 font-normal">
                Uniform Cost Search (Concentric expansion)
              </div>
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs font-mono text-neutral-400 block mb-1.5">
            Search Telemetry:
          </label>
          <div className="rounded-xl border border-card-edge bg-neutral-900/50 p-3 space-y-2.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Path Status:</span>
              <span
                className={`font-semibold ${
                  searchResult.found ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {searchResult.found ? 'Goal Reached' : 'Unreachable'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Total Path Cost:</span>
              <span className="font-mono text-foreground font-semibold">
                {searchResult.found ? searchResult.pathCost.toFixed(1) : 'None'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Nodes Explored:</span>
              <span className="font-mono text-foreground font-semibold">
                {searchResult.nodesExplored}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Optimality Guarantee:</span>
              <span
                className={`font-mono text-[11px] px-1.5 py-0.5 rounded ${
                  searchResult.isOptimal
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                {searchResult.isOptimal ? 'Optimal Path' : 'Suboptimal Path'}
              </span>
            </div>
            <div className="pt-2 border-t border-card-edge">
              <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                <input
                  type="checkbox"
                  checked={allowDiagonals}
                  onChange={(e) => {
                    setAllowDiagonals(e.target.checked);
                    setCurrentStepIndex(0);
                  }}
                  className="rounded border-card-edge text-brand focus:ring-brand"
                />
                <span className="text-xs">Allow 8-Way Diagonal Moves</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Grid Canvas */}
      <div className="rounded-2xl border border-card-edge bg-[#080808] p-4 mb-4">
        <div className="flex items-center justify-between mb-3 text-xs font-mono text-neutral-400">
          <span>
            Grid Map ({scenario.width} × {scenario.height}) | Start: ({scenario.start.x},
            {scenario.start.y}) &rarr; Goal: ({scenario.goal.x},{scenario.goal.y})
          </span>
          <span>
            {hoveredCell ? (
              <span className="text-brand">
                Hovered: ({hoveredCell.x}, {hoveredCell.y})
              </span>
            ) : (
              <span>
                Step {currentStep ? currentStep.stepIndex : 0} of {totalSteps}
              </span>
            )}
          </span>
        </div>

        {/* Grid Cells */}
        <div
          className="grid gap-1 select-none"
          style={{
            gridTemplateColumns: `repeat(${scenario.width}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: scenario.height }).map((_, r) =>
            Array.from({ length: scenario.width }).map((_, c) => {
              const key = `${c},${r}`;
              const isStart = isCellStart(c, r);
              const isGoal = isCellGoal(c, r);
              const isObstacle = isCellObstacle(c, r);
              const isPath = isCellOnPath(c, r);
              const isCurrent = currentStep?.currentNode === key;
              const isClosed = currentStep?.closedSet.includes(key);
              const isOpen = currentStep?.openSet.includes(key);

              let bgClass = 'bg-neutral-900/60 border-neutral-800';
              let textClass = 'text-neutral-600';

              if (isObstacle) {
                bgClass = 'bg-neutral-700/80 border-neutral-600';
              } else if (isStart) {
                bgClass = 'bg-blue-600/30 border-blue-500 font-bold';
                textClass = 'text-blue-300';
              } else if (isGoal) {
                bgClass = 'bg-emerald-600/30 border-emerald-500 font-bold';
                textClass = 'text-emerald-300';
              } else if (isCurrent) {
                bgClass = 'bg-amber-500/40 border-amber-400 animate-pulse font-bold';
                textClass = 'text-amber-200';
              } else if (isPath) {
                bgClass = 'bg-emerald-500/25 border-emerald-400 font-semibold';
                textClass = 'text-emerald-300';
              } else if (isOpen) {
                bgClass = 'bg-orange-500/20 border-orange-500/50';
                textClass = 'text-orange-300';
              } else if (isClosed) {
                bgClass = 'bg-slate-800/40 border-slate-700/50';
                textClass = 'text-slate-400';
              }

              return (
                <div
                  key={key}
                  onMouseEnter={() => setHoveredCell({ x: c, y: r })}
                  onMouseLeave={() => setHoveredCell(null)}
                  className={`aspect-square rounded-lg border flex flex-col items-center justify-center p-1 transition-all text-[10px] font-mono cursor-pointer ${bgClass}`}
                >
                  {isStart ? (
                    'S'
                  ) : isGoal ? (
                    'G'
                  ) : isObstacle ? (
                    '#'
                  ) : (
                    <span className={textClass}>
                      {c},{r}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Step Inspector Message */}
        <div className="mt-3 p-2.5 rounded-lg border border-card-edge bg-neutral-900/40 font-mono text-xs text-neutral-300 flex items-center justify-between">
          <span>{currentStep?.message ?? 'Click Run or Step to watch the search expand.'}</span>
          {currentStep && (
            <span className="text-[11px] text-neutral-500">
              g={currentStep.currentG.toFixed(1)} | h={currentStep.currentH.toFixed(1)} | f=
              {currentStep.currentF.toFixed(1)}
            </span>
          )}
        </div>
      </div>

      {/* Step Playback Controls */}
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

        <div className="flex-1 max-w-xs flex items-center gap-2">
          <span className="text-xs font-mono text-neutral-500">Step:</span>
          <input
            type="range"
            min={0}
            max={Math.max(0, totalSteps - 1)}
            value={currentStepIndex}
            onChange={(e) => setCurrentStepIndex(Number(e.target.value))}
            className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-brand"
          />
          <span className="text-xs font-mono text-neutral-400 w-12 text-right">
            {currentStepIndex}/{Math.max(0, totalSteps - 1)}
          </span>
        </div>
      </div>

      {/* Pedagogical Insight Callout */}
      <div className="mt-6 pt-4 border-t border-card-edge grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
        <div className="rounded-xl border border-card-edge bg-card-fill/60 p-3.5">
          <div className="flex items-center gap-2 text-foreground font-semibold font-montserrat mb-1">
            <ShieldCheck className="size-4 text-brand" />
            Why A* is Optimal under Admissibility
          </div>
          <p className="text-neutral-400">
            Because h(n) never overestimates the true remaining cost (h(n) ≤ h*(n)), A* will never
            expand a suboptimal goal node G₂ prior to the optimal goal G*, since f(G₂) = g(G₂) &gt;
            g(G*) = f(G*).
          </p>
        </div>

        <div className="rounded-xl border border-rose-500/20 bg-rose-950/10 p-3.5">
          <div className="flex items-center gap-2 text-rose-300 font-semibold font-montserrat mb-1">
            <AlertTriangle className="size-4 text-rose-400" />
            Why Greedy Best-First Fails in Concave Traps
          </div>
          <p className="text-neutral-400">
            Greedy Best-First considers only h(n), ignoring the path cost g(n) accumulated so far.
            In the horseshoe trap, cells deep inside the dead-end are geometrically closer to the
            goal, so Greedy blindly marches into the dead end!
          </p>
        </div>
      </div>
    </Card>
  );
}
