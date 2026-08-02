import { useState, useMemo, useEffect, useCallback } from 'react';
import { ShieldAlert, Sparkles } from 'lucide-react';
import { bfsEngine } from '@/engines/search/bfs/engine';
import { BFSInput, BFSSnapshot } from '@/engines/search/bfs/types';
import { Step } from '@/viz/player/types';
import { Player } from '@/viz/player/Player';
import { Button } from '@/components/ui/Button';
import { PRESETS } from './config';

export interface WarehouseBfsLabProps {
  initialPreset?: string;
  onGoalReached?: () => void;
  className?: string;
}

export function WarehouseBfsLab({
  initialPreset = 'simple',
  onGoalReached,
  className = '',
}: WarehouseBfsLabProps) {
  const [selectedPresetId, setSelectedPresetId] = useState(initialPreset);
  const activePreset = useMemo(() => {
    return PRESETS.find((p) => p.id === selectedPresetId) ?? PRESETS[0]!;
  }, [selectedPresetId]);

  const [gridInput, setGridInput] = useState<BFSInput>(activePreset.input);
  const [activeTool, setActiveTool] = useState<'obstacle' | 'start' | 'goal'>('obstacle');
  const [prediction, setPrediction] = useState<string | null>(null);

  // Update input when preset changes
  useEffect(() => {
    setGridInput(activePreset.input);
    setPrediction(null);
  }, [activePreset]);

  // Generate trace from pure engine
  const steps: Step<BFSSnapshot>[] = useMemo(() => {
    return Array.from(bfsEngine.run(gridInput));
  }, [gridInput]);

  const [currentStep, setCurrentStep] = useState<Step<BFSSnapshot>>(steps[0]!);

  useEffect(() => {
    setCurrentStep(steps[0]!);
  }, [steps]);

  // Click handler to edit grid
  const handleCellClick = useCallback(
    (r: number, c: number) => {
      setGridInput((prev) => {
        // Cannot overwrite start or goal when toggling obstacles
        if (activeTool === 'obstacle') {
          if (
            (r === prev.start.r && c === prev.start.c) ||
            (r === prev.goal.r && c === prev.goal.c)
          ) {
            return prev;
          }
          const exists = prev.obstacles.some((o) => o.r === r && o.c === c);
          const newObstacles = exists
            ? prev.obstacles.filter((o) => !(o.r === r && o.c === c))
            : [...prev.obstacles, { r, c }];
          return { ...prev, obstacles: newObstacles };
        } else if (activeTool === 'start') {
          if (r === prev.goal.r && c === prev.goal.c) return prev;
          const cleanObstacles = prev.obstacles.filter((o) => !(o.r === r && o.c === c));
          return { ...prev, start: { r, c }, obstacles: cleanObstacles };
        } else if (activeTool === 'goal') {
          if (r === prev.start.r && c === prev.start.c) return prev;
          const cleanObstacles = prev.obstacles.filter((o) => !(o.r === r && o.c === c));
          return { ...prev, goal: { r, c }, obstacles: cleanObstacles };
        }
        return prev;
      });
    },
    [activeTool]
  );

  const handleMakeItFail = () => {
    const trapped = PRESETS.find((p) => p.id === 'break-it');
    if (trapped) {
      setSelectedPresetId('break-it');
    }
  };

  // Convert current state sets for fast SVG lookup
  const snapshot = currentStep?.state;
  const visitedSet = useMemo(() => {
    return new Set(snapshot?.visited.map((coord) => `${coord.r},${coord.c}`));
  }, [snapshot]);

  const frontierSet = useMemo(() => {
    return new Set(snapshot?.queue.map((coord) => `${coord.r},${coord.c}`));
  }, [snapshot]);

  const pathSet = useMemo(() => {
    return new Set(snapshot?.path?.map((coord) => `${coord.r},${coord.c}`));
  }, [snapshot]);

  const obstacleSet = useMemo(() => {
    return new Set(gridInput.obstacles.map((coord) => `${coord.r},${coord.c}`));
  }, [gridInput.obstacles]);

  const cellSize = 44;
  const svgWidth = gridInput.cols * cellSize;
  const svgHeight = gridInput.rows * cellSize;

  return (
    <div
      className={`flex flex-col space-y-5 rounded-2xl border border-studio-200 bg-studio-50/70 p-5 shadow-studio dark:border-studio-800 dark:bg-studio-900/60 ${className}`}
    >
      {/* Header bar: Presets & Make it fail */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase tracking-wider text-studio-500">
            Preset:
          </span>
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPresetId(p.id)}
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                selectedPresetId === p.id
                  ? 'bg-unit-2 text-white shadow-subtle'
                  : 'bg-white text-studio-700 hover:bg-studio-100 dark:bg-studio-800 dark:text-studio-200 border border-studio-200 dark:border-studio-700'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleMakeItFail}
          className="text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-400 dark:hover:bg-rose-950/40"
        >
          <ShieldAlert className="h-4 w-4 mr-1.5" />
          Make It Fail
        </Button>
      </div>

      {/* Predict-then-reveal card */}
      {!prediction && (
        <div className="rounded-xl border border-unit-2/30 bg-unit-2/5 p-4 text-sm leading-relaxed dark:border-unit-2/20 dark:bg-unit-2/10">
          <p className="font-display font-bold text-unit-2 flex items-center gap-1.5 mb-1.5">
            <Sparkles className="h-4 w-4" />
            Predict Before You Play:
          </p>
          <p className="text-studio-700 dark:text-studio-300 mb-3">
            If there are multiple routes between the robot and docking bay, which path is BFS
            guaranteed to find first on this unweighted grid?
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPrediction('shortest')}
              className="bg-white dark:bg-studio-800 text-xs"
            >
              The path with the fewest steps (optimal)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPrediction('random')}
              className="bg-white dark:bg-studio-800 text-xs"
            >
              A random valid path depending on exploration order
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPrediction('deepest')}
              className="bg-white dark:bg-studio-800 text-xs"
            >
              The deepest path exploring straight aisles first
            </Button>
          </div>
        </div>
      )}

      {prediction && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-3 text-xs leading-relaxed text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200 flex items-center justify-between">
          <span>
            <strong>Prediction recorded!</strong> BFS explores in concentric rings of increasing
            depth, guaranteeing it finds the path with the <em>minimal number of steps</em>. Now hit
            Play below to watch the wavefront expand.
          </span>
          <button
            onClick={() => setPrediction(null)}
            className="text-[11px] underline opacity-75 hover:opacity-100 ml-3"
          >
            Reset
          </button>
        </div>
      )}

      {/* Interactive Tool selector */}
      <div className="flex items-center justify-between text-xs text-studio-600 dark:text-studio-400">
        <div className="flex items-center space-x-2">
          <span>Click grid to place:</span>
          {(['obstacle', 'start', 'goal'] as const).map((tool) => (
            <button
              key={tool}
              type="button"
              onClick={() => setActiveTool(tool)}
              className={`px-2.5 py-1 rounded font-medium capitalize border transition-colors ${
                activeTool === tool
                  ? 'bg-studio-900 text-white border-studio-900 dark:bg-white dark:text-studio-900 dark:border-white'
                  : 'bg-white text-studio-700 border-studio-200 hover:bg-studio-100 dark:bg-studio-800 dark:text-studio-300 dark:border-studio-700'
              }`}
            >
              {tool === 'obstacle'
                ? '🧱 Shelf Rack'
                : tool === 'start'
                  ? '🤖 Robot Start'
                  : '🏁 Docking Bay'}
            </button>
          ))}
        </div>
        <span className="hidden sm:inline">
          Grid: {gridInput.rows} × {gridInput.cols}
        </span>
      </div>

      {/* SVG Warehouse Grid Display */}
      <div className="flex items-center justify-center p-3 rounded-xl bg-white dark:bg-studio-950 border border-studio-200 dark:border-studio-800 overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="max-h-[380px] w-auto drop-shadow-sm select-none"
          role="img"
          aria-label={`Warehouse grid search visualization at step ${currentStep.index + 1}`}
        >
          {/* Render Cells */}
          {Array.from({ length: gridInput.rows }).map((_, r) =>
            Array.from({ length: gridInput.cols }).map((_, c) => {
              const key = `${r},${c}`;
              const isStart = r === gridInput.start.r && c === gridInput.start.c;
              const isGoal = r === gridInput.goal.r && c === gridInput.goal.c;
              const isObstacle = obstacleSet.has(key);
              const isFrontier = frontierSet.has(key);
              const isVisited = visitedSet.has(key);
              const isPath = pathSet.has(key);
              const isCurrent =
                snapshot?.current && snapshot.current.r === r && snapshot.current.c === c;

              let fill = '#F8FAFC'; // Default empty light
              let stroke = '#E2E8F0';

              if (isObstacle) {
                fill = '#334155'; // Dark slate for obstacle shelf
                stroke = '#1E293B';
              } else if (isPath) {
                fill = '#FDE047'; // Vivid yellow for final path
                stroke = '#EAB308';
              } else if (isCurrent) {
                fill = '#38BDF8'; // Bright cyan for currently expanding
                stroke = '#0284C7';
              } else if (isFrontier) {
                fill = '#BAE6FD'; // Soft sky blue for frontier queue
                stroke = '#7DD3FC';
              } else if (isVisited) {
                fill = '#E0F2FE'; // Very light sky for explored
                stroke = '#BAE6FD';
              }

              return (
                <g
                  key={key}
                  onClick={() => handleCellClick(r, c)}
                  className="cursor-pointer transition-colors duration-150"
                >
                  <rect
                    x={c * cellSize}
                    y={r * cellSize}
                    width={cellSize}
                    height={cellSize}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={1}
                    rx={4}
                  />

                  {/* Icon overlays */}
                  {isStart && (
                    <text
                      x={c * cellSize + cellSize / 2}
                      y={r * cellSize + cellSize / 2 + 5}
                      textAnchor="middle"
                      fontSize="20"
                      className="pointer-events-none"
                    >
                      🤖
                    </text>
                  )}

                  {isGoal && (
                    <text
                      x={c * cellSize + cellSize / 2}
                      y={r * cellSize + cellSize / 2 + 5}
                      textAnchor="middle"
                      fontSize="20"
                      className="pointer-events-none"
                    >
                      🏁
                    </text>
                  )}

                  {isObstacle && !isStart && !isGoal && (
                    <text
                      x={c * cellSize + cellSize / 2}
                      y={r * cellSize + cellSize / 2 + 4}
                      textAnchor="middle"
                      fontSize="14"
                      className="pointer-events-none opacity-60"
                    >
                      📦
                    </text>
                  )}
                </g>
              );
            })
          )}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-studio-600 dark:text-studio-400 pt-1">
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-sky-200 border border-sky-300"></span>
          <span>Frontier Queue</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-sky-100 border border-sky-200"></span>
          <span>Explored Wavefront</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-yellow-300 border border-yellow-500"></span>
          <span>Optimal Path</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-slate-700 border border-slate-900"></span>
          <span>Shelf Rack</span>
        </div>
      </div>

      {/* Player Framework Controls */}
      <Player
        steps={steps}
        pseudocode={bfsEngine.pseudocode}
        unitAccent={2}
        onStepChange={(step) => {
          setCurrentStep(step);
          if (step.state.foundGoal) {
            onGoalReached?.();
          }
        }}
      />
    </div>
  );
}
