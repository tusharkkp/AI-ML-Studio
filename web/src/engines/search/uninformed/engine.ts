import type {
  GraphData,
  GraphEdge,
  GraphNode,
  NodeId,
  UninformedSearchResult,
  UninformedSearchStep,
} from './types';

/**
 * Builds an adjacency-indexed graph from nodes and edges.
 */
export function buildGraph(
  nodes: GraphNode[],
  edges: (GraphEdge & { bidirectional?: boolean })[]
): GraphData {
  const adjacency: Record<NodeId, { target: NodeId; cost: number }[]> = {};

  for (const n of nodes) {
    adjacency[n.id] = [];
  }

  for (const edge of edges) {
    const cost = edge.cost ?? 1;
    if (adjacency[edge.from]) {
      adjacency[edge.from]!.push({ target: edge.to, cost });
    }
    if (edge.bidirectional && adjacency[edge.to]) {
      adjacency[edge.to]!.push({ target: edge.from, cost });
    }
  }

  return { nodes, edges, adjacency };
}

/**
 * Depth-First Search (DFS)
 * Uses a LIFO stack.
 */
export function runDfs(
  graph: GraphData,
  startId: string,
  goalId: string,
  options: { cycleCheck?: boolean; maxSteps?: number } = {}
): UninformedSearchResult {
  const cycleCheck = options.cycleCheck ?? true;
  const maxSteps = options.maxSteps ?? 500;

  const stack: { node: NodeId; path: NodeId[]; depth: number }[] = [
    { node: startId, path: [startId], depth: 0 },
  ];
  const explored = new Set<NodeId>();
  const steps: UninformedSearchStep[] = [];
  let maxFrontierSize = 1;

  while (stack.length > 0 && steps.length < maxSteps) {
    maxFrontierSize = Math.max(maxFrontierSize, stack.length);
    const current = stack.pop()!;

    if (cycleCheck && explored.has(current.node)) {
      continue;
    }

    if (cycleCheck) {
      explored.add(current.node);
    }

    const isGoal = current.node === goalId;

    steps.push({
      stepIndex: steps.length + 1,
      currentNode: current.node,
      frontier: stack.map((s) => s.node),
      explored: Array.from(explored),
      depth: current.depth,
      actionDescription: isGoal
        ? `Goal node ${current.node} reached at depth ${current.depth}!`
        : `Popped node ${current.node} from stack at depth ${current.depth}.`,
      isGoal,
    });

    if (isGoal) {
      return {
        algorithm: 'DFS',
        found: true,
        path: current.path,
        pathCost: current.path.length - 1,
        nodesExplored: explored.size,
        maxFrontierSize,
        steps,
      };
    }

    const neighbors = graph.adjacency[current.node] ?? [];
    // Push in reverse order so left-most child is popped first
    for (let i = neighbors.length - 1; i >= 0; i--) {
      const neighbor = neighbors[i]!;
      if (
        !cycleCheck ||
        (!explored.has(neighbor.target) && !current.path.includes(neighbor.target))
      ) {
        stack.push({
          node: neighbor.target,
          path: [...current.path, neighbor.target],
          depth: current.depth + 1,
        });
      }
    }
  }

  return {
    algorithm: 'DFS',
    found: false,
    path: [],
    pathCost: 0,
    nodesExplored: explored.size,
    maxFrontierSize,
    steps,
  };
}

/**
 * Depth-Limited Search (DLS)
 * Explores DFS up to a maximum depth limit.
 */
export function runDls(
  graph: GraphData,
  startId: string,
  goalId: string,
  limit: number,
  options: { maxSteps?: number } = {}
): UninformedSearchResult {
  const maxSteps = options.maxSteps ?? 500;
  const stack: { node: NodeId; path: NodeId[]; depth: number }[] = [
    { node: startId, path: [startId], depth: 0 },
  ];
  const explored = new Set<NodeId>();
  const steps: UninformedSearchStep[] = [];
  let maxFrontierSize = 1;
  let cutoffOccurred = false;

  while (stack.length > 0 && steps.length < maxSteps) {
    maxFrontierSize = Math.max(maxFrontierSize, stack.length);
    const current = stack.pop()!;

    explored.add(current.node);
    const isGoal = current.node === goalId;

    steps.push({
      stepIndex: steps.length + 1,
      currentNode: current.node,
      frontier: stack.map((s) => s.node),
      explored: Array.from(explored),
      depth: current.depth,
      actionDescription: isGoal
        ? `Goal node ${current.node} found at depth ${current.depth}!`
        : `Visiting ${current.node} (Depth: ${current.depth}/${limit}).`,
      isGoal,
    });

    if (isGoal) {
      return {
        algorithm: 'DLS',
        found: true,
        path: current.path,
        pathCost: current.path.length - 1,
        nodesExplored: explored.size,
        maxFrontierSize,
        steps,
        cutoffOccurred: false,
      };
    }

    if (current.depth < limit) {
      const neighbors = graph.adjacency[current.node] ?? [];
      for (let i = neighbors.length - 1; i >= 0; i--) {
        const neighbor = neighbors[i]!;
        if (!current.path.includes(neighbor.target)) {
          stack.push({
            node: neighbor.target,
            path: [...current.path, neighbor.target],
            depth: current.depth + 1,
          });
        }
      }
    } else {
      cutoffOccurred = true;
    }
  }

  return {
    algorithm: 'DLS',
    found: false,
    path: [],
    pathCost: 0,
    nodesExplored: explored.size,
    maxFrontierSize,
    steps,
    cutoffOccurred,
  };
}

/**
 * Iterative Deepening Search (IDDFS)
 * Incrementally increases depth limit from 0 up to maxDepth.
 */
export function runIddfs(
  graph: GraphData,
  startId: string,
  goalId: string,
  maxDepth: number = 20
): UninformedSearchResult {
  const aggregatedSteps: UninformedSearchStep[] = [];
  let totalNodesExplored = 0;
  let peakFrontier = 0;

  for (let depthLimit = 0; depthLimit <= maxDepth; depthLimit++) {
    const dlsResult = runDls(graph, startId, goalId, depthLimit);
    peakFrontier = Math.max(peakFrontier, dlsResult.maxFrontierSize);
    totalNodesExplored += dlsResult.nodesExplored;

    for (const step of dlsResult.steps) {
      aggregatedSteps.push({
        ...step,
        stepIndex: aggregatedSteps.length + 1,
        actionDescription: `[Limit ${depthLimit}] ${step.actionDescription}`,
      });
    }

    if (dlsResult.found) {
      return {
        algorithm: 'IDDFS',
        found: true,
        path: dlsResult.path,
        pathCost: dlsResult.pathCost,
        nodesExplored: totalNodesExplored,
        maxFrontierSize: peakFrontier,
        steps: aggregatedSteps,
        cutoffOccurred: false,
        iterations: depthLimit + 1,
      };
    }

    if (!dlsResult.cutoffOccurred) {
      // Entire state space exhausted without finding goal
      break;
    }
  }

  return {
    algorithm: 'IDDFS',
    found: false,
    path: [],
    pathCost: 0,
    nodesExplored: totalNodesExplored,
    maxFrontierSize: peakFrontier,
    steps: aggregatedSteps,
    cutoffOccurred: true,
  };
}

/**
 * Bidirectional Search
 * Simultaneously expands forward from start and backward from goal.
 */
export function runBidirectional(
  graph: GraphData,
  startId: string,
  goalId: string,
  options: { maxSteps?: number } = {}
): UninformedSearchResult {
  const maxSteps = options.maxSteps ?? 500;

  if (startId === goalId) {
    return {
      algorithm: 'BIDIRECTIONAL',
      found: true,
      path: [startId],
      pathCost: 0,
      nodesExplored: 1,
      maxFrontierSize: 1,
      steps: [
        {
          stepIndex: 1,
          currentNode: startId,
          frontier: [startId],
          explored: [startId],
          depth: 0,
          actionDescription: 'Start node is already the goal.',
          isGoal: true,
        },
      ],
    };
  }

  // Forward queue and backward queue
  const forwardQueue: NodeId[] = [startId];
  const backwardQueue: NodeId[] = [goalId];

  const forwardParent: Record<NodeId, NodeId | null> = { [startId]: null };
  const backwardParent: Record<NodeId, NodeId | null> = { [goalId]: null };

  const forwardExplored = new Set<NodeId>();
  const backwardExplored = new Set<NodeId>();

  const steps: UninformedSearchStep[] = [];
  let maxFrontierSize = 2;
  let collisionNode: NodeId | null = null;

  while (forwardQueue.length > 0 && backwardQueue.length > 0 && steps.length < maxSteps) {
    maxFrontierSize = Math.max(maxFrontierSize, forwardQueue.length + backwardQueue.length);

    // Expand Forward
    const currentF = forwardQueue.shift()!;
    forwardExplored.add(currentF);

    if (backwardExplored.has(currentF) || backwardQueue.includes(currentF)) {
      collisionNode = currentF;
    }

    steps.push({
      stepIndex: steps.length + 1,
      currentNode: currentF,
      frontier: [...forwardQueue],
      explored: Array.from(forwardExplored),
      backwardFrontier: [...backwardQueue],
      backwardExplored: Array.from(backwardExplored),
      depth: 0,
      actionDescription: collisionNode
        ? `Frontiers collided at node ${collisionNode}!`
        : `Forward frontier explored ${currentF}.`,
      collisionNode: collisionNode ?? undefined,
      isGoal: collisionNode !== null,
    });

    if (collisionNode) break;

    for (const edge of graph.adjacency[currentF] ?? []) {
      const neighbor = edge.target;
      if (!forwardExplored.has(neighbor) && !forwardQueue.includes(neighbor)) {
        forwardParent[neighbor] = currentF;
        forwardQueue.push(neighbor);
        if (backwardExplored.has(neighbor) || backwardQueue.includes(neighbor)) {
          collisionNode = neighbor;
          break;
        }
      }
    }

    if (collisionNode) {
      steps.push({
        stepIndex: steps.length + 1,
        currentNode: collisionNode,
        frontier: [...forwardQueue],
        explored: Array.from(forwardExplored),
        backwardFrontier: [...backwardQueue],
        backwardExplored: Array.from(backwardExplored),
        depth: 0,
        actionDescription: `Frontiers collided at node ${collisionNode}!`,
        collisionNode,
        isGoal: true,
      });
      break;
    }

    // Expand Backward
    const currentB = backwardQueue.shift()!;
    backwardExplored.add(currentB);

    if (forwardExplored.has(currentB) || forwardQueue.includes(currentB)) {
      collisionNode = currentB;
    }

    steps.push({
      stepIndex: steps.length + 1,
      currentNode: currentB,
      frontier: [...forwardQueue],
      explored: Array.from(forwardExplored),
      backwardFrontier: [...backwardQueue],
      backwardExplored: Array.from(backwardExplored),
      depth: 0,
      actionDescription: collisionNode
        ? `Frontiers collided at node ${collisionNode}!`
        : `Backward frontier explored ${currentB}.`,
      collisionNode: collisionNode ?? undefined,
      isGoal: collisionNode !== null,
    });

    if (collisionNode) break;

    // In reverse direction, search predecessors (incoming edges or bidirectional neighbors)
    const backwardNeighbors: NodeId[] = [];
    for (const [node, edges] of Object.entries(graph.adjacency)) {
      if (edges.some((e) => e.target === currentB)) {
        backwardNeighbors.push(node);
      }
    }

    for (const neighbor of backwardNeighbors) {
      if (!backwardExplored.has(neighbor) && !backwardQueue.includes(neighbor)) {
        backwardParent[neighbor] = currentB;
        backwardQueue.push(neighbor);
        if (forwardExplored.has(neighbor) || forwardQueue.includes(neighbor)) {
          collisionNode = neighbor;
          break;
        }
      }
    }

    if (collisionNode) {
      steps.push({
        stepIndex: steps.length + 1,
        currentNode: collisionNode,
        frontier: [...forwardQueue],
        explored: Array.from(forwardExplored),
        backwardFrontier: [...backwardQueue],
        backwardExplored: Array.from(backwardExplored),
        depth: 0,
        actionDescription: `Frontiers collided at node ${collisionNode}!`,
        collisionNode,
        isGoal: true,
      });
      break;
    }
  }

  if (collisionNode) {
    // Reconstruct path from start -> collisionNode -> goal
    const forwardPath: NodeId[] = [];
    let curr: NodeId | null = collisionNode;
    while (curr !== null) {
      forwardPath.unshift(curr);
      curr = forwardParent[curr] ?? null;
    }

    const backwardPath: NodeId[] = [];
    let bcurr: NodeId | null = backwardParent[collisionNode] ?? null;
    while (bcurr !== null) {
      backwardPath.push(bcurr);
      bcurr = backwardParent[bcurr] ?? null;
    }

    const fullPath = [...forwardPath, ...backwardPath];

    return {
      algorithm: 'BIDIRECTIONAL',
      found: true,
      path: fullPath,
      pathCost: fullPath.length - 1,
      nodesExplored: forwardExplored.size + backwardExplored.size,
      maxFrontierSize,
      steps,
    };
  }

  return {
    algorithm: 'BIDIRECTIONAL',
    found: false,
    path: [],
    pathCost: 0,
    nodesExplored: forwardExplored.size + backwardExplored.size,
    maxFrontierSize,
    steps,
  };
}
