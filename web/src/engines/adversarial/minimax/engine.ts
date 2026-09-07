import type { GameTreeNode, MinimaxConfig, MinimaxResult, MinimaxStep } from './types';

export const CLASSIC_RUSSELL_NORVIG_TREE: GameTreeNode = {
  id: 'A',
  name: 'Root (MAX)',
  children: [
    {
      id: 'B',
      name: 'B (MIN)',
      children: [
        { id: 'B1', name: 'B1', value: 3 },
        { id: 'B2', name: 'B2', value: 12 },
        { id: 'B3', name: 'B3', value: 8 },
      ],
    },
    {
      id: 'C',
      name: 'C (MIN)',
      children: [
        { id: 'C1', name: 'C1', value: 2 },
        { id: 'C2', name: 'C2', value: 4 },
        { id: 'C3', name: 'C3', value: 6 },
      ],
    },
    {
      id: 'D',
      name: 'D (MIN)',
      children: [
        { id: 'D1', name: 'D1', value: 14 },
        { id: 'D2', name: 'D2', value: 5 },
        { id: 'D3', name: 'D3', value: 2 },
      ],
    },
  ],
};

export function runMinimax(
  root: GameTreeNode,
  config: MinimaxConfig = { useAlphaBeta: true }
): MinimaxResult {
  const { useAlphaBeta, initialAlpha = -Infinity, initialBeta = Infinity } = config;
  const steps: MinimaxStep[] = [];
  const prunedNodeIds: string[] = [];
  let nodesEvaluated = 0;
  let nodesPruned = 0;
  let stepIndex = 1;

  function countSubtreeNodes(node: GameTreeNode): number {
    let count = 1;
    if (node.children) {
      for (const ch of node.children) {
        count += countSubtreeNodes(ch);
      }
    }
    return count;
  }

  function minimaxHelper(
    node: GameTreeNode,
    depth: number,
    isMax: boolean,
    alpha: number,
    beta: number
  ): { value: number; bestChildId?: string } {
    nodesEvaluated++;

    // Terminal leaf node
    if (node.value !== undefined || !node.children || node.children.length === 0) {
      const leafVal = node.value ?? 0;
      steps.push({
        stepIndex: stepIndex++,
        nodeId: node.id,
        nodeType: isMax ? 'MAX' : 'MIN',
        alpha,
        beta,
        computedValue: leafVal,
        message: `Evaluated leaf ${node.id} with utility value ${leafVal}.`,
      });
      return { value: leafVal };
    }

    steps.push({
      stepIndex: stepIndex++,
      nodeId: node.id,
      nodeType: isMax ? 'MAX' : 'MIN',
      alpha,
      beta,
      message: `Visiting ${isMax ? 'MAX' : 'MIN'} node ${node.id} with [α=${alpha === -Infinity ? '-∞' : alpha}, β=${beta === Infinity ? '∞' : beta}].`,
    });

    if (isMax) {
      let maxVal = -Infinity;
      let bestChild = node.children[0]?.id;

      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i]!;
        const childRes = minimaxHelper(child, depth + 1, false, alpha, beta);

        if (childRes.value > maxVal) {
          maxVal = childRes.value;
          bestChild = child.id;
        }

        alpha = Math.max(alpha, maxVal);

        // Alpha-Beta Pruning cutoff: β <= α
        if (useAlphaBeta && beta <= alpha) {
          const remainingChildren = node.children.slice(i + 1);
          const prunedIds: string[] = [];

          for (const rem of remainingChildren) {
            prunedIds.push(rem.id);
            prunedNodeIds.push(rem.id);
            nodesPruned += countSubtreeNodes(rem);
          }

          steps.push({
            stepIndex: stepIndex++,
            nodeId: node.id,
            nodeType: 'MAX',
            alpha,
            beta,
            computedValue: maxVal,
            prunedChildren: prunedIds,
            message: `Alpha cutoff at MAX node ${node.id}! β (${beta}) ≤ α (${alpha}). Pruned subtrees: [${prunedIds.join(', ')}].`,
          });
          break;
        }
      }

      steps.push({
        stepIndex: stepIndex++,
        nodeId: node.id,
        nodeType: 'MAX',
        alpha,
        beta,
        computedValue: maxVal,
        message: `MAX node ${node.id} finalized with value ${maxVal} (best move: ${bestChild}).`,
      });

      return { value: maxVal, bestChildId: bestChild };
    } else {
      // MIN player
      let minVal = Infinity;
      let bestChild = node.children[0]?.id;

      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i]!;
        const childRes = minimaxHelper(child, depth + 1, true, alpha, beta);

        if (childRes.value < minVal) {
          minVal = childRes.value;
          bestChild = child.id;
        }

        beta = Math.min(beta, minVal);

        // Alpha-Beta Pruning cutoff: β <= α
        if (useAlphaBeta && beta <= alpha) {
          const remainingChildren = node.children.slice(i + 1);
          const prunedIds: string[] = [];

          for (const rem of remainingChildren) {
            prunedIds.push(rem.id);
            prunedNodeIds.push(rem.id);
            nodesPruned += countSubtreeNodes(rem);
          }

          steps.push({
            stepIndex: stepIndex++,
            nodeId: node.id,
            nodeType: 'MIN',
            alpha,
            beta,
            computedValue: minVal,
            prunedChildren: prunedIds,
            message: `Beta cutoff at MIN node ${node.id}! β (${beta}) ≤ α (${alpha}). Pruned subtrees: [${prunedIds.join(', ')}].`,
          });
          break;
        }
      }

      steps.push({
        stepIndex: stepIndex++,
        nodeId: node.id,
        nodeType: 'MIN',
        alpha,
        beta,
        computedValue: minVal,
        message: `MIN node ${node.id} finalized with value ${minVal} (best move: ${bestChild}).`,
      });

      return { value: minVal, bestChildId: bestChild };
    }
  }

  const result = minimaxHelper(root, 0, true, initialAlpha, initialBeta);

  return {
    rootValue: result.value,
    bestChildId: result.bestChildId,
    nodesEvaluated,
    nodesPruned,
    prunedNodeIds,
    steps,
  };
}
