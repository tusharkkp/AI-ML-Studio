import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  buildGraph,
  runDfs,
  runDls,
  runIddfs,
  runBidirectional,
} from '@/engines/search/uninformed/engine';
import type {
  GraphData,
  UninformedAlgorithm,
  UninformedSearchResult,
} from '@/engines/search/uninformed/types';

interface PresetMaze {
  id: string;
  name: string;
  description: string;
  startId: string;
  goalId: string;
  graph: GraphData;
}

// Preset 1: Binary Tree with deep left dead end and shallow right goal
const TREE_GRAPH = buildGraph(
  [
    { id: 'Root', label: 'Root', x: 250, y: 30 },
    { id: 'L1', label: 'L1', x: 120, y: 90 },
    { id: 'R1', label: 'R1', x: 380, y: 90 },
    { id: 'L2A', label: 'L2A', x: 60, y: 160 },
    { id: 'L2B', label: 'L2B', x: 170, y: 160 },
    { id: 'R2A', label: 'Goal', x: 330, y: 160 },
    { id: 'R2B', label: 'R2B', x: 440, y: 160 },
    { id: 'L3A', label: 'L3A', x: 30, y: 230 },
    { id: 'L3B', label: 'L3B', x: 90, y: 230 },
    { id: 'L4A', label: 'DeadEnd', x: 30, y: 300 },
  ],
  [
    { from: 'Root', to: 'L1', bidirectional: true },
    { from: 'Root', to: 'R1', bidirectional: true },
    { from: 'L1', to: 'L2A', bidirectional: true },
    { from: 'L1', to: 'L2B', bidirectional: true },
    { from: 'R1', to: 'R2A', bidirectional: true },
    { from: 'R1', to: 'R2B', bidirectional: true },
    { from: 'L2A', to: 'L3A', bidirectional: true },
    { from: 'L2A', to: 'L3B', bidirectional: true },
    { from: 'L3A', to: 'L4A', bidirectional: true },
  ]
);

// Preset 2: Cyclic Road Map with multiple alternate paths
const CYCLIC_GRAPH = buildGraph(
  [
    { id: 'A', label: 'Start (A)', x: 60, y: 150 },
    { id: 'B', label: 'B', x: 180, y: 70 },
    { id: 'C', label: 'C', x: 180, y: 230 },
    { id: 'D', label: 'D', x: 320, y: 70 },
    { id: 'E', label: 'E', x: 320, y: 230 },
    { id: 'G', label: 'Goal (G)', x: 440, y: 150 },
  ],
  [
    { from: 'A', to: 'B', bidirectional: true },
    { from: 'A', to: 'C', bidirectional: true },
    { from: 'B', to: 'C', bidirectional: true }, // creates triangle cycle
    { from: 'B', to: 'D', bidirectional: true },
    { from: 'C', to: 'E', bidirectional: true },
    { from: 'D', to: 'E', bidirectional: true }, // creates center cycle
    { from: 'D', to: 'G', bidirectional: true },
    { from: 'E', to: 'G', bidirectional: true },
  ]
);

const PRESET_MAZES: PresetMaze[] = [
  {
    id: 'tree-trap',
    name: '1. Deep Left Trap Tree',
    description:
      'DFS dives into the deep left dead end while IDDFS quickly discovers the shallow right goal.',
    startId: 'Root',
    goalId: 'R2A',
    graph: TREE_GRAPH,
  },
  {
    id: 'cyclic-network',
    name: '2. Cyclic Road Network',
    description:
      'Cyclic graph showing how cycle-checking prevents infinite loops and how bidirectional search meets in the center.',
    startId: 'A',
    goalId: 'G',
    graph: CYCLIC_GRAPH,
  },
];

export function UninformedSearchLab() {
  const [activePreset, setActivePreset] = useState<PresetMaze>(PRESET_MAZES[0]!);
  const [selectedAlgo, setSelectedAlgo] = useState<UninformedAlgorithm>('IDDFS');
  const [dlsLimit, setDlsLimit] = useState<number>(2);
  const [cycleCheck, setCycleCheck] = useState<boolean>(true);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  // Execute current algorithm
  const executeAlgorithm = (algo: UninformedAlgorithm): UninformedSearchResult => {
    switch (algo) {
      case 'DFS':
        return runDfs(activePreset.graph, activePreset.startId, activePreset.goalId, {
          cycleCheck,
        });
      case 'DLS':
        return runDls(activePreset.graph, activePreset.startId, activePreset.goalId, dlsLimit);
      case 'IDDFS':
        return runIddfs(activePreset.graph, activePreset.startId, activePreset.goalId, 8);
      case 'BIDIRECTIONAL':
        return runBidirectional(activePreset.graph, activePreset.startId, activePreset.goalId);
    }
  };

  const searchResult = executeAlgorithm(selectedAlgo);
  const currentStep = searchResult.steps[Math.min(currentStepIndex, searchResult.steps.length - 1)];

  // Benchmark stats across all 4 algorithms for comparative race card
  const dfsBenchmark = runDfs(activePreset.graph, activePreset.startId, activePreset.goalId, {
    cycleCheck: true,
  });
  const dlsBenchmark = runDls(
    activePreset.graph,
    activePreset.startId,
    activePreset.goalId,
    dlsLimit
  );
  const iddfsBenchmark = runIddfs(activePreset.graph, activePreset.startId, activePreset.goalId, 8);
  const bidiBenchmark = runBidirectional(
    activePreset.graph,
    activePreset.startId,
    activePreset.goalId
  );

  return (
    <Card className="p-6 my-6 border-card-edge bg-card-fill backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-card-edge pb-4">
        <div>
          <span className="text-xs font-mono text-neutral-500">Uninformed search laboratory</span>
          <h3 className="font-montserrat text-xl font-semibold text-foreground">
            DFS, DLS, IDDFS &amp; Bidirectional Comparative Race
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {PRESET_MAZES.map((preset) => (
            <Button
              key={preset.id}
              size="sm"
              variant={activePreset.id === preset.id ? 'primary' : 'outline'}
              onClick={() => {
                setActivePreset(preset);
                setCurrentStepIndex(0);
              }}
            >
              {preset.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Algorithm Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-3 rounded-xl border border-card-edge bg-neutral-900/40">
        <div className="flex flex-wrap gap-2">
          {(['DFS', 'DLS', 'IDDFS', 'BIDIRECTIONAL'] as UninformedAlgorithm[]).map((algo) => (
            <Button
              key={algo}
              size="sm"
              variant={selectedAlgo === algo ? 'primary' : 'outline'}
              onClick={() => {
                setSelectedAlgo(algo);
                setCurrentStepIndex(0);
              }}
            >
              {algo === 'BIDIRECTIONAL' ? 'Bidirectional' : algo}
            </Button>
          ))}
        </div>

        {selectedAlgo === 'DLS' && (
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-neutral-400">Depth Limit L = {dlsLimit}</span>
            <input
              type="range"
              min={1}
              max={6}
              value={dlsLimit}
              onChange={(e) => {
                setDlsLimit(Number(e.target.value));
                setCurrentStepIndex(0);
              }}
              className="w-24 accent-brand cursor-pointer"
            />
          </div>
        )}

        {selectedAlgo === 'DFS' && (
          <div className="flex items-center gap-2">
            <label className="text-xs font-mono text-neutral-400 flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={cycleCheck}
                onChange={(e) => {
                  setCycleCheck(e.target.checked);
                  setCurrentStepIndex(0);
                }}
                className="rounded border-card-edge text-brand focus:ring-brand"
              />
              Cycle Checking
            </label>
          </div>
        )}
      </div>

      {/* Interactive Visual Graph Canvas */}
      <div className="rounded-2xl border border-card-edge bg-[#080808] p-4 mb-6 relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-neutral-400">
            Active Search Graph: Start [{activePreset.startId}] &rarr; Goal [{activePreset.goalId}]
          </span>
          <span className="text-xs font-mono text-neutral-500">
            Step {currentStep?.stepIndex ?? 1} of {searchResult.steps.length}
          </span>
        </div>

        <svg viewBox="0 0 500 340" className="w-full h-auto max-h-[340px]">
          {/* Render Graph Edges */}
          {activePreset.graph.edges.map((e, idx) => {
            const u = activePreset.graph.nodes.find((n) => n.id === e.from);
            const v = activePreset.graph.nodes.find((n) => n.id === e.to);
            if (!u || !v || u.x === undefined || v.x === undefined) return null;

            const isPathEdge =
              searchResult.found &&
              searchResult.path.includes(e.from) &&
              searchResult.path.includes(e.to) &&
              Math.abs(searchResult.path.indexOf(e.from) - searchResult.path.indexOf(e.to)) === 1;

            return (
              <line
                key={idx}
                x1={u.x}
                y1={u.y}
                x2={v.x}
                y2={v.y}
                stroke={isPathEdge ? '#10b981' : '#262626'}
                strokeWidth={isPathEdge ? 3 : 1.5}
                strokeDasharray={isPathEdge ? 'none' : '4 2'}
              />
            );
          })}

          {/* Render Graph Nodes */}
          {activePreset.graph.nodes.map((node) => {
            if (node.x === undefined || node.y === undefined) return null;

            const isStart = node.id === activePreset.startId;
            const isGoal = node.id === activePreset.goalId;
            const isCurrent = currentStep?.currentNode === node.id;
            const isFrontier = currentStep?.frontier.includes(node.id);
            const isExplored = currentStep?.explored.includes(node.id);
            const isBackwardFrontier = currentStep?.backwardFrontier?.includes(node.id);
            const isBackwardExplored = currentStep?.backwardExplored?.includes(node.id);
            const isCollision = currentStep?.collisionNode === node.id;
            const isPath = searchResult.found && searchResult.path.includes(node.id);

            let fillColor = '#171717';
            let strokeColor = '#333333';
            let textColor = '#a3a3a3';

            if (isStart) {
              strokeColor = '#3b82f6';
            }
            if (isGoal) {
              strokeColor = '#10b981';
            }
            if (isExplored) {
              fillColor = '#1e293b';
              strokeColor = '#64748b';
              textColor = '#e2e8f0';
            }
            if (isBackwardExplored) {
              fillColor = '#311042';
              strokeColor = '#8b5cf6';
            }
            if (isFrontier) {
              fillColor = '#7c2d12';
              strokeColor = '#f97316';
              textColor = '#ffedd5';
            }
            if (isBackwardFrontier) {
              fillColor = '#4c1d95';
              strokeColor = '#a855f7';
              textColor = '#f3e8ff';
            }
            if (isCurrent) {
              fillColor = '#f97316';
              strokeColor = '#ffffff';
              textColor = '#ffffff';
            }
            if (isCollision) {
              fillColor = '#ec4899';
              strokeColor = '#f472b6';
              textColor = '#ffffff';
            }
            if (isPath) {
              strokeColor = '#10b981';
            }

            return (
              <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                <circle
                  r={18}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={isCurrent || isCollision || isPath ? 3 : 1.5}
                />
                <text
                  dy={4}
                  textAnchor="middle"
                  fill={textColor}
                  fontSize={10}
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Step Narration */}
        <div className="mt-3 p-3 rounded-lg border border-card-edge bg-card-fill text-xs font-mono text-neutral-300 flex items-center justify-between">
          <span>{currentStep?.actionDescription ?? 'Ready to run.'}</span>
          <div className="flex gap-1.5">
            <Button
              size="sm"
              variant="outline"
              disabled={currentStepIndex <= 0}
              onClick={() => setCurrentStepIndex((p) => Math.max(0, p - 1))}
            >
              Prev
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={currentStepIndex >= searchResult.steps.length - 1}
              onClick={() =>
                setCurrentStepIndex((p) => Math.min(searchResult.steps.length - 1, p + 1))
              }
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Comparative Race Benchmark Board */}
      <div className="space-y-3">
        <span className="text-xs font-mono text-neutral-400 block">
          Algorithm Race Metrics on Current Graph:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
          {/* DFS Card */}
          <div
            className={`p-4 rounded-xl border ${selectedAlgo === 'DFS' ? 'border-brand bg-brand/5' : 'border-card-edge bg-card-fill'}`}
          >
            <span className="text-foreground font-semibold block mb-1">DFS (Stack LIFO)</span>
            <div className="text-neutral-400 space-y-1">
              <div>Found: {dfsBenchmark.found ? '✓ Yes' : '✗ No'}</div>
              <div>Path Cost: {dfsBenchmark.pathCost}</div>
              <div>Explored: {dfsBenchmark.nodesExplored} nodes</div>
              <div>Max Frontier: {dfsBenchmark.maxFrontierSize}</div>
            </div>
          </div>

          {/* DLS Card */}
          <div
            className={`p-4 rounded-xl border ${selectedAlgo === 'DLS' ? 'border-brand bg-brand/5' : 'border-card-edge bg-card-fill'}`}
          >
            <span className="text-foreground font-semibold block mb-1">
              DLS (Limit L={dlsLimit})
            </span>
            <div className="text-neutral-400 space-y-1">
              <div>
                Found:{' '}
                {dlsBenchmark.found ? '✓ Yes' : dlsBenchmark.cutoffOccurred ? 'Cutoff' : '✗ No'}
              </div>
              <div>Path Cost: {dlsBenchmark.pathCost}</div>
              <div>Explored: {dlsBenchmark.nodesExplored} nodes</div>
              <div>Max Frontier: {dlsBenchmark.maxFrontierSize}</div>
            </div>
          </div>

          {/* IDDFS Card */}
          <div
            className={`p-4 rounded-xl border ${selectedAlgo === 'IDDFS' ? 'border-brand bg-brand/5' : 'border-card-edge bg-card-fill'}`}
          >
            <span className="text-foreground font-semibold block mb-1">IDDFS (Optimal Loop)</span>
            <div className="text-neutral-400 space-y-1">
              <div>Found: {iddfsBenchmark.found ? '✓ Yes' : '✗ No'}</div>
              <div>Path Cost: {iddfsBenchmark.pathCost} (Optimal)</div>
              <div>Explored: {iddfsBenchmark.nodesExplored} nodes</div>
              <div>Iterations: {iddfsBenchmark.iterations}</div>
            </div>
          </div>

          {/* Bidirectional Card */}
          <div
            className={`p-4 rounded-xl border ${selectedAlgo === 'BIDIRECTIONAL' ? 'border-brand bg-brand/5' : 'border-card-edge bg-card-fill'}`}
          >
            <span className="text-foreground font-semibold block mb-1">Bidirectional Search</span>
            <div className="text-neutral-400 space-y-1">
              <div>Found: {bidiBenchmark.found ? '✓ Yes' : '✗ No'}</div>
              <div>Path Cost: {bidiBenchmark.pathCost} (Optimal)</div>
              <div>Explored: {bidiBenchmark.nodesExplored} nodes</div>
              <div>Frontier Split: 2b^(d/2)</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
