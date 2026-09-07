import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { runMinimax, CLASSIC_RUSSELL_NORVIG_TREE } from '@/engines/adversarial/minimax/engine';
import { Play, RotateCcw } from 'lucide-react';

interface TreeNodeCoord {
  id: string;
  name: string;
  type: 'MAX' | 'MIN' | 'LEAF';
  x: number;
  y: number;
  value?: number;
  parentId?: string;
}

// Tree Coordinates for SVG Visualization
const TREE_COORDS: TreeNodeCoord[] = [
  // Depth 0: Root MAX
  { id: 'A', name: 'Root (MAX)', type: 'MAX', x: 270, y: 35 },
  // Depth 1: MIN Nodes
  { id: 'B', name: 'B (MIN)', type: 'MIN', x: 90, y: 110, parentId: 'A' },
  { id: 'C', name: 'C (MIN)', type: 'MIN', x: 270, y: 110, parentId: 'A' },
  { id: 'D', name: 'D (MIN)', type: 'MIN', x: 450, y: 110, parentId: 'A' },
  // Depth 2: Leaves under B
  { id: 'B1', name: 'B1', type: 'LEAF', x: 40, y: 190, value: 3, parentId: 'B' },
  { id: 'B2', name: 'B2', type: 'LEAF', x: 90, y: 190, value: 12, parentId: 'B' },
  { id: 'B3', name: 'B3', type: 'LEAF', x: 140, y: 190, value: 8, parentId: 'B' },
  // Depth 2: Leaves under C
  { id: 'C1', name: 'C1', type: 'LEAF', x: 220, y: 190, value: 2, parentId: 'C' },
  { id: 'C2', name: 'C2', type: 'LEAF', x: 270, y: 190, value: 4, parentId: 'C' },
  { id: 'C3', name: 'C3', type: 'LEAF', x: 320, y: 190, value: 6, parentId: 'C' },
  // Depth 2: Leaves under D
  { id: 'D1', name: 'D1', type: 'LEAF', x: 400, y: 190, value: 14, parentId: 'D' },
  { id: 'D2', name: 'D2', type: 'LEAF', x: 450, y: 190, value: 5, parentId: 'D' },
  { id: 'D3', name: 'D3', type: 'LEAF', x: 500, y: 190, value: 2, parentId: 'D' },
];

export function AdversarialSearchLab() {
  const [useAlphaBeta, setUseAlphaBeta] = useState<boolean>(true);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  const searchResult = useMemo(() => {
    return runMinimax(CLASSIC_RUSSELL_NORVIG_TREE, { useAlphaBeta });
  }, [useAlphaBeta]);

  const totalSteps = searchResult.steps.length;
  const currentStep = searchResult.steps[Math.min(currentStepIndex, totalSteps - 1)];

  return (
    <Card className="p-6 my-6 border-card-edge bg-card-fill backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-card-edge pb-4">
        <div>
          <span className="text-xs font-mono text-neutral-500">Adversarial game tree arena</span>
          <h3 className="font-montserrat text-xl font-semibold text-foreground">
            Minimax & Alpha-Beta Pruning Studio
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Watch α and β window bounds propagate, and see branch pruning cut off irrelevant
            subtrees.
          </p>
        </div>

        {/* Algorithm Switcher */}
        <div className="flex rounded-lg border border-card-edge bg-neutral-900/60 p-0.5">
          <button
            onClick={() => {
              setUseAlphaBeta(true);
              setCurrentStepIndex(0);
            }}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              useAlphaBeta
                ? 'bg-brand text-white font-semibold'
                : 'text-neutral-400 hover:text-foreground'
            }`}
          >
            Alpha-Beta Pruning (α-β)
          </button>
          <button
            onClick={() => {
              setUseAlphaBeta(false);
              setCurrentStepIndex(0);
            }}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              !useAlphaBeta
                ? 'bg-brand text-white font-semibold'
                : 'text-neutral-400 hover:text-foreground'
            }`}
          >
            Standard Minimax (Full Tree)
          </button>
        </div>
      </div>

      {/* Interactive Game Tree Canvas */}
      <div className="rounded-2xl border border-card-edge bg-[#070707] p-4 mb-4 relative overflow-hidden">
        <div className="flex items-center justify-between mb-2 text-xs font-mono text-neutral-400">
          <span>Game Tree (Russell & Norvig Figure 5.5)</span>
          <span>
            Step {currentStep ? currentStep.stepIndex : 0} of {totalSteps}
          </span>
        </div>

        <svg viewBox="0 0 540 240" className="w-full h-auto max-h-[300px]">
          {/* Render Tree Branches */}
          {TREE_COORDS.filter((n) => n.parentId).map((node) => {
            const parent = TREE_COORDS.find((p) => p.id === node.parentId)!;
            const isPruned = searchResult.prunedNodeIds.includes(node.id);

            return (
              <g key={`edge-${node.id}`}>
                <line
                  x1={parent.x}
                  y1={parent.y + 12}
                  x2={node.x}
                  y2={node.y - 12}
                  stroke={isPruned ? '#450a0a' : '#262626'}
                  strokeWidth={isPruned ? 1.5 : 2}
                  strokeDasharray={isPruned ? '3 3' : 'none'}
                />
              </g>
            );
          })}

          {/* Render Nodes */}
          {TREE_COORDS.map((node) => {
            const isCurrent = currentStep?.nodeId === node.id;
            const isPruned = searchResult.prunedNodeIds.includes(node.id);
            const isBestChild = node.id === searchResult.bestChildId;

            let fillColor = '#171717';
            let strokeColor = '#383838';
            let textColor = '#d4d4d4';

            if (isPruned) {
              fillColor = '#1a0505';
              strokeColor = '#f43f5e';
              textColor = '#7f1d1d';
            } else if (isCurrent) {
              fillColor = '#78350f';
              strokeColor = '#f59e0b';
              textColor = '#fef3c7';
            } else if (isBestChild) {
              strokeColor = '#10b981';
            }

            return (
              <g key={node.id}>
                {node.type === 'MAX' ? (
                  // Upward pointing triangle for MAX
                  <polygon
                    points={`${node.x},${node.y - 12} ${node.x - 14},${node.y + 12} ${node.x + 14},${node.y + 12}`}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth="2"
                  />
                ) : node.type === 'MIN' ? (
                  // Downward pointing triangle for MIN
                  <polygon
                    points={`${node.x - 14},${node.y - 12} ${node.x + 14},${node.y - 12} ${node.x},${node.y + 12}`}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth="2"
                  />
                ) : (
                  // Circle for Leaf
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="12"
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth="1.5"
                  />
                )}

                {/* Node Label / Value */}
                <text
                  x={node.x}
                  y={node.y + (node.type === 'MIN' ? -2 : 3)}
                  textAnchor="middle"
                  fill={textColor}
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {node.value !== undefined ? node.value : node.id}
                </text>

                {/* Pruned Scissors Indicator */}
                {isPruned && (
                  <text
                    x={node.x}
                    y={node.y + 24}
                    textAnchor="middle"
                    fill="#f43f5e"
                    fontSize="8"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    ✂ PRUNED
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Step Message */}
        <div className="mt-3 p-2.5 rounded-lg border border-card-edge bg-neutral-900/50 font-mono text-xs text-neutral-300 flex items-center justify-between">
          <span>{currentStep?.message ?? 'Ready to traverse game tree.'}</span>
          <span className="text-[11px] text-amber-400">
            [α={currentStep?.alpha === -Infinity ? '-∞' : currentStep?.alpha}, β=
            {currentStep?.beta === Infinity ? '∞' : currentStep?.beta}]
          </span>
        </div>
      </div>

      {/* Step Controls & Telemetry Dashboard */}
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

        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-400">
          <div>
            Root Minimax Value:{' '}
            <span className="text-emerald-400 font-bold">{searchResult.rootValue}</span>
          </div>
          <div>
            Evaluated:{' '}
            <span className="text-foreground font-semibold">{searchResult.nodesEvaluated}</span>
          </div>
          <div>
            Pruned:{' '}
            <span className="text-rose-400 font-semibold">{searchResult.nodesPruned} nodes</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
