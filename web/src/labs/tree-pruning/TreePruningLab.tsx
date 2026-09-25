import React, { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Slider } from '@/components/ui/Slider';
import { Toggle } from '@/components/ui/Toggle';
import {
  buildDecisionTree,
  countLeaves,
  getTreeDepth,
  predictTree,
  pruneTreeCostComplexity,
} from '@/engines/tree/decision-tree/engine';
import {
  PLAY_TENNIS_DATA,
  TENNIS_FEATURES,
  TENNIS_TARGET,
  TennisRow,
} from '@/engines/tree/decision-tree/playTennisData';
import { TreeNode } from '@/engines/tree/decision-tree/types';

// Synthetic noisy holdout set for testing overfitting
const HOLDOUT_TENNIS_TEST: TennisRow[] = [
  { day: 'T1', outlook: 'Sunny', temp: 'Cool', humidity: 'High', wind: 'Weak', play: 'No' },
  { day: 'T2', outlook: 'Sunny', temp: 'Mild', humidity: 'Normal', wind: 'Strong', play: 'Yes' },
  { day: 'T3', outlook: 'Overcast', temp: 'Hot', humidity: 'Normal', wind: 'Weak', play: 'Yes' },
  { day: 'T4', outlook: 'Rain', temp: 'Mild', humidity: 'High', wind: 'Weak', play: 'Yes' },
  { day: 'T5', outlook: 'Rain', temp: 'Cool', humidity: 'High', wind: 'Strong', play: 'No' },
  { day: 'T6', outlook: 'Sunny', temp: 'Hot', humidity: 'High', wind: 'Strong', play: 'No' },
];

export const TreePruningLab: React.FC = () => {
  const [maxDepth, setMaxDepth] = useState<number>(3);
  const [minSamplesSplit, setMinSamplesSplit] = useState<number>(2);
  const [alpha, setAlpha] = useState<number>(0.0);
  const [pruningMode, setPruningMode] = useState<'pre' | 'post'>('pre');
  const [injectNoise, setInjectNoise] = useState<boolean>(false);

  // Training dataset, optionally polluted with noise to demonstrate severe overfitting
  const trainData = useMemo(() => {
    if (!injectNoise) return PLAY_TENNIS_DATA;
    // Inject contradictory noisy points
    return [
      ...PLAY_TENNIS_DATA,
      {
        day: 'N1',
        outlook: 'Overcast',
        temp: 'Hot',
        humidity: 'High',
        wind: 'Weak',
        play: 'No' as const,
      },
      {
        day: 'N2',
        outlook: 'Sunny',
        temp: 'Cool',
        humidity: 'Normal',
        wind: 'Weak',
        play: 'No' as const,
      },
      {
        day: 'N3',
        outlook: 'Rain',
        temp: 'Cool',
        humidity: 'Normal',
        wind: 'Strong',
        play: 'Yes' as const,
      },
    ];
  }, [injectNoise]);

  // Build unpruned tree
  const unprunedTree = useMemo(() => {
    return buildDecisionTree(trainData, TENNIS_FEATURES, TENNIS_TARGET, {
      criterion: 'entropy',
      maxDepth: pruningMode === 'pre' ? maxDepth : 10,
      minSamplesSplit: pruningMode === 'pre' ? minSamplesSplit : 2,
    });
  }, [trainData, pruningMode, maxDepth, minSamplesSplit]);

  // Apply post-pruning if in post mode
  const activeTree = useMemo(() => {
    if (pruningMode === 'pre') return unprunedTree;
    return pruneTreeCostComplexity(unprunedTree, alpha);
  }, [unprunedTree, pruningMode, alpha]);

  // Evaluate performance
  const metrics = useMemo(() => {
    let trainCorrect = 0;
    for (const row of trainData) {
      if (predictTree(activeTree, row) === row.play) trainCorrect++;
    }
    const trainAcc = (trainCorrect / trainData.length) * 100;

    let testCorrect = 0;
    for (const row of HOLDOUT_TENNIS_TEST) {
      if (predictTree(activeTree, row) === row.play) testCorrect++;
    }
    const testAcc = (testCorrect / HOLDOUT_TENNIS_TEST.length) * 100;

    const depth = getTreeDepth(activeTree);
    const leaves = countLeaves(activeTree);
    const misclassTrain = trainData.length - trainCorrect;
    const costComplexity = misclassTrain + alpha * leaves * 2;

    return {
      trainAcc,
      testAcc,
      depth,
      leaves,
      misclassTrain,
      costComplexity,
    };
  }, [activeTree, trainData, alpha]);

  return (
    <Card className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold text-foreground">
              Decision tree pruning & overfitting explorer
            </h3>
            <Badge variant="outline" size="sm">
              Pre vs Post Pruning
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Observe the tradeoff between tree complexity and generalization: mitigate{' '}
            <span className="text-cream font-medium">variance & overfitting</span>.
          </p>
        </div>

        <div className="flex bg-muted/40 p-1 rounded-lg border border-border/50 text-xs">
          <button
            onClick={() => setPruningMode('pre')}
            className={`px-3 py-1 rounded transition-colors ${
              pruningMode === 'pre'
                ? 'bg-primary text-primary-foreground font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Pre-Pruning (Early Stopping)
          </button>
          <button
            onClick={() => setPruningMode('post')}
            className={`px-3 py-1 rounded transition-colors ${
              pruningMode === 'post'
                ? 'bg-primary text-primary-foreground font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Post-Pruning (Cost-Complexity)
          </button>
        </div>
      </div>

      {/* Control Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4 rounded-xl border border-border/60 bg-black/20">
        {pruningMode === 'pre' ? (
          <>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground font-medium">Max Depth Limit:</span>
                <span className="font-mono text-cream font-bold">{maxDepth}</span>
              </div>
              <Slider
                label="Maximum Tree Depth"
                min={1}
                max={5}
                step={1}
                value={maxDepth}
                onChange={setMaxDepth}
              />
              <span className="text-[11px] text-muted-foreground">
                Halts tree recursion once path length reaches this depth.
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground font-medium">Min Samples to Split:</span>
                <span className="font-mono text-cream font-bold">{minSamplesSplit}</span>
              </div>
              <Slider
                label="Minimum Samples Required to Split"
                min={2}
                max={8}
                step={1}
                value={minSamplesSplit}
                onChange={setMinSamplesSplit}
              />
              <span className="text-[11px] text-muted-foreground">
                Prevents splitting nodes containing fewer instances than threshold.
              </span>
            </div>
          </>
        ) : (
          <div className="space-y-2 sm:col-span-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground font-medium">
                Cost-Complexity Penalty ($\alpha$):
              </span>
              <span className="font-mono text-cream font-bold">{alpha.toFixed(2)}</span>
            </div>
            <Slider
              label="Cost-Complexity Penalty Alpha"
              min={0.0}
              max={1.0}
              step={0.05}
              value={alpha}
              onChange={setAlpha}
            />
            <span className="text-[11px] text-muted-foreground">
              Penalizes large leaf counts: $R_\alpha(T) = R(T) + \alpha |T|$. Larger $\alpha$ prunes
              deeper subtrees.
            </span>
          </div>
        )}

        <div className="flex flex-col justify-center space-y-2 border-t sm:border-t-0 sm:border-l border-border/40 pt-4 sm:pt-0 sm:pl-6">
          <Toggle
            label="Make It Fail: Inject Noisy Outliers"
            checked={injectNoise}
            onChange={setInjectNoise}
          />
          <span className="text-[11px] text-muted-foreground">
            Adds contradictory observations to simulate real-world sensor noise.
          </span>
        </div>
      </div>

      {/* Live Metrics Gauge Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-lg border border-border/60 bg-muted/20">
          <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
            Tree Depth / Leaves
          </span>
          <div className="mt-1 font-mono text-lg font-bold text-foreground">
            Depth: {metrics.depth}{' '}
            <span className="text-muted-foreground text-sm">/ {metrics.leaves} leaves</span>
          </div>
        </div>

        <div className="p-3.5 rounded-lg border border-border/60 bg-muted/20">
          <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
            Training Accuracy
          </span>
          <div className="mt-1 font-mono text-lg font-bold text-emerald-400">
            {metrics.trainAcc.toFixed(1)}%
          </div>
        </div>

        <div className="p-3.5 rounded-lg border border-border/60 bg-muted/20">
          <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
            Validation Accuracy
          </span>
          <div
            className={`mt-1 font-mono text-lg font-bold ${
              metrics.testAcc >= 80 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {metrics.testAcc.toFixed(1)}%
          </div>
        </div>

        <div className="p-3.5 rounded-lg border border-cream/30 bg-cream/5">
          <span className="text-xs text-cream uppercase tracking-wide font-semibold">
            Overfitting Gap
          </span>
          <div className="mt-1 font-mono text-lg font-bold text-cream">
            {Math.max(0, metrics.trainAcc - metrics.testAcc).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Tree Visualization Hierarchy Render */}
      <div className="p-5 rounded-xl border border-border/60 bg-black/40 space-y-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border/40 pb-2">
          <span className="font-semibold text-foreground">Current Fitted Decision Tree</span>
          <span>
            {pruningMode === 'pre'
              ? `Constrained by Depth <= ${maxDepth}`
              : `Post-pruned with alpha = ${alpha.toFixed(2)}`}
          </span>
        </div>

        <div className="overflow-x-auto py-2">
          <TreeNodeRenderer node={activeTree} isRoot={true} />
        </div>
      </div>

      {/* Explanatory Takeaway */}
      <div className="p-4 rounded-lg bg-muted/30 border border-border/40 text-xs text-muted-foreground flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="font-semibold text-foreground">Pruning Insight: </span>
          {injectNoise ? (
            <span>
              Outlier noise forces an unpruned tree to create tiny, idiosyncratic leaves. Notice how
              restricting depth (or increasing $\alpha$) improves holdout validation accuracy even
              if training accuracy drops slightly.
            </span>
          ) : (
            <span>
              Pre-pruning halts growth early but risks the "horizon effect" (stopping before
              discovering a synergistic combination of features). Post-pruning lets the tree grow
              fully, then safely cuts branches with low statistical significance.
            </span>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setMaxDepth(3);
            setMinSamplesSplit(2);
            setAlpha(0.0);
            setInjectNoise(false);
          }}
        >
          Reset Pruning
        </Button>
      </div>
    </Card>
  );
};

// Recursive Tree Node Visualizer Component
const TreeNodeRenderer: React.FC<{
  node: TreeNode;
  branchLabel?: string;
  isRoot?: boolean;
}> = ({ node, branchLabel, isRoot }) => {
  const isLeaf = node.isLeaf;

  return (
    <div className="flex flex-col items-center">
      {/* Branch incoming label */}
      {branchLabel && (
        <div className="flex flex-col items-center">
          <div className="w-0.5 h-3 bg-border/80"></div>
          <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-muted/50 border border-border/40 text-cream">
            {branchLabel}
          </span>
          <div className="w-0.5 h-3 bg-border/80"></div>
        </div>
      )}

      {/* Node Box */}
      <div
        className={`px-3 py-2 rounded-lg border text-center min-w-[120px] transition-all ${
          isLeaf
            ? node.prediction === 'Yes'
              ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-300'
              : 'border-rose-500/60 bg-rose-500/10 text-rose-300'
            : isRoot
              ? 'border-cream/80 bg-cream/10 text-cream font-bold'
              : 'border-border/80 bg-muted/30 text-foreground'
        }`}
      >
        {isLeaf ? (
          <div>
            <div className="text-xs uppercase font-bold tracking-wider">
              Play: {node.prediction}
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5 font-mono">
              Samples: {node.samples} (H: {node.impurity.toFixed(2)})
            </div>
          </div>
        ) : (
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider">
              {node.attribute} = ?
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5 font-mono">
              Samples: {node.samples} (H: {node.impurity.toFixed(2)})
            </div>
          </div>
        )}
      </div>

      {/* Render Children */}
      {node.children && Object.keys(node.children).length > 0 && (
        <div className="flex items-start justify-center gap-4 mt-1 border-t border-border/30 pt-1">
          {Object.entries(node.children).map(([value, child]) => (
            <TreeNodeRenderer key={value} node={child} branchLabel={value} />
          ))}
        </div>
      )}
    </div>
  );
};
