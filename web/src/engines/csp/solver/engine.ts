import type {
  CspProblem,
  CspVariable,
  CspValue,
  CspStep,
  CspSolverConfig,
  CspResult,
} from './types';

export function runAc3(
  problem: CspProblem,
  currentDomains: Record<CspVariable, CspValue[]>,
  stepLog?: CspStep[]
): { consistent: boolean; domains: Record<CspVariable, CspValue[]> } {
  // Deep clone domains
  const domains: Record<CspVariable, CspValue[]> = {};
  for (const v of problem.variables) {
    domains[v] = [...(currentDomains[v] ?? [])];
  }

  // Build initial queue of all directed arcs (Xi, Xj)
  const queue: [CspVariable, CspVariable][] = [];
  for (const c of problem.constraints) {
    queue.push([c.var1, c.var2]);
    queue.push([c.var2, c.var1]);
  }

  while (queue.length > 0) {
    const [xi, xj] = queue.shift()!;
    const constraintsBetween = problem.constraints.filter(
      (c) => (c.var1 === xi && c.var2 === xj) || (c.var1 === xj && c.var2 === xi)
    );

    const xiDomain = domains[xi] ?? [];
    const xjDomain = domains[xj] ?? [];
    const initialSize = xiDomain.length;
    const pruned: CspValue[] = [];

    // Revise Xi with respect to Xj
    domains[xi] = xiDomain.filter((xVal) => {
      // Check if there exists ANY yVal in domain(Xj) satisfying all constraints
      const hasSupport = xjDomain.some((yVal) =>
        constraintsBetween.every((c) =>
          c.var1 === xi ? c.isValid(xVal, yVal) : c.isValid(yVal, xVal)
        )
      );
      if (!hasSupport) {
        pruned.push(xVal);
      }
      return hasSupport;
    });

    const updatedXiDomain = domains[xi] ?? [];

    if (updatedXiDomain.length < initialSize) {
      if (stepLog) {
        stepLog.push({
          stepIndex: stepLog.length + 1,
          variable: xi,
          domains: JSON.parse(JSON.stringify(domains)) as Record<CspVariable, CspValue[]>,
          assignment: {},
          arcRevised: [xi, xj],
          prunedValues: pruned,
          action: updatedXiDomain.length === 0 ? 'domain_wipeout' : 'ac3_revise',
          message:
            updatedXiDomain.length === 0
              ? `Domain wipeout on variable ${xi} during arc (${xi} &rarr; ${xj}) revision!`
              : `AC-3 pruned {${pruned.join(', ')}} from ${xi} domain against ${xj}.`,
        });
      }

      if (updatedXiDomain.length === 0) {
        return { consistent: false, domains };
      }

      // Add all neighbors Xk of Xi (k != j) back to queue
      for (const c of problem.constraints) {
        const neighbor = c.var1 === xi ? c.var2 : c.var2 === xi ? c.var1 : null;
        if (neighbor && neighbor !== xj) {
          queue.push([neighbor, xi]);
        }
      }
    }
  }

  return { consistent: true, domains };
}

export function solveCsp(problem: CspProblem, config: CspSolverConfig = {}): CspResult {
  const { useAc3 = true, useMrv = true, useLcv = false, maxSteps = 200 } = config;
  const steps: CspStep[] = [];
  let backtracks = 0;
  let nodesExpanded = 0;

  // Initial AC-3 preprocessing if enabled
  let initialDomains = problem.domains;
  if (useAc3) {
    const ac3Res = runAc3(problem, problem.domains, steps);
    if (!ac3Res.consistent) {
      return {
        solved: false,
        solution: null,
        steps,
        backtracks: 0,
        nodesExpanded: 0,
      };
    }
    initialDomains = ac3Res.domains;
  }

  function selectVariable(
    assignment: Record<CspVariable, CspValue>,
    domains: Record<CspVariable, CspValue[]>
  ): CspVariable | null {
    const unassigned = problem.variables.filter((v) => !(v in assignment));
    if (unassigned.length === 0) return null;

    if (!useMrv) {
      return unassigned[0]!;
    }

    // Minimum Remaining Values (MRV) heuristic with Degree heuristic tie-breaker
    let bestVar = unassigned[0]!;
    let minDomainSize = domains[bestVar]!.length;
    let maxDegree = -1;

    for (const v of unassigned) {
      const dSize = domains[v]!.length;
      const deg = problem.constraints.filter(
        (c) =>
          (c.var1 === v || c.var2 === v) &&
          !(c.var1 === v ? c.var2 in assignment : c.var1 in assignment)
      ).length;

      if (dSize < minDomainSize || (dSize === minDomainSize && deg > maxDegree)) {
        bestVar = v;
        minDomainSize = dSize;
        maxDegree = deg;
      }
    }

    return bestVar;
  }

  function orderDomainValues(
    variable: CspVariable,
    domains: Record<CspVariable, CspValue[]>,
    assignment: Record<CspVariable, CspValue>
  ): CspValue[] {
    const currentDomain = domains[variable] ?? [];
    if (!useLcv) {
      return currentDomain;
    }

    // LCV: Order values by how few choices they rule out for neighboring unassigned variables
    const scoredValues = currentDomain.map((val) => {
      let conflicts = 0;
      const neighbors = problem.constraints
        .filter((c) => c.var1 === variable || c.var2 === variable)
        .map((c) => (c.var1 === variable ? c.var2 : c.var1))
        .filter((nbr) => !(nbr in assignment));

      for (const nbr of neighbors) {
        for (const nbrVal of domains[nbr] ?? []) {
          const invalid = problem.constraints.some((c) => {
            if (c.var1 === variable && c.var2 === nbr) return !c.isValid(val, nbrVal);
            if (c.var1 === nbr && c.var2 === variable) return !c.isValid(nbrVal, val);
            return false;
          });
          if (invalid) conflicts++;
        }
      }
      return { val, conflicts };
    });

    scoredValues.sort((a, b) => a.conflicts - b.conflicts);
    return scoredValues.map((s) => s.val);
  }

  function backtrack(
    assignment: Record<CspVariable, CspValue>,
    currentDomains: Record<CspVariable, CspValue[]>
  ): Record<CspVariable, CspValue> | null {
    if (Object.keys(assignment).length === problem.variables.length) {
      steps.push({
        stepIndex: steps.length + 1,
        domains: currentDomains,
        assignment: { ...assignment },
        action: 'solution_found',
        message: 'Solution verified! All variables satisfy constraints.',
      });
      return assignment;
    }

    if (steps.length >= maxSteps) return null;

    const varToAssign = selectVariable(assignment, currentDomains);
    if (!varToAssign) return null;

    const orderedValues = orderDomainValues(varToAssign, currentDomains, assignment);

    for (const val of orderedValues) {
      nodesExpanded++;

      // Check immediate assignment consistency
      const isConsistentWithAssignment = problem.constraints.every((c) => {
        if (c.var1 === varToAssign && c.var2 in assignment) {
          return c.isValid(val, assignment[c.var2]!);
        }
        if (c.var2 === varToAssign && c.var1 in assignment) {
          return c.isValid(assignment[c.var1]!, val);
        }
        return true;
      });

      if (!isConsistentWithAssignment) continue;

      const newAssignment = { ...assignment, [varToAssign]: val };
      const newDomains = JSON.parse(JSON.stringify(currentDomains)) as Record<
        CspVariable,
        CspValue[]
      >;
      newDomains[varToAssign] = [val];

      steps.push({
        stepIndex: steps.length + 1,
        variable: varToAssign,
        assignedValue: val,
        domains: newDomains,
        assignment: newAssignment,
        action: 'assign',
        message: `Assigned ${varToAssign} = ${val}.`,
      });

      // Forward Checking / AC-3 inference
      let canProceed = true;
      if (useAc3) {
        const inference = runAc3(problem, newDomains, steps);
        if (!inference.consistent) {
          canProceed = false;
        } else {
          Object.assign(newDomains, inference.domains);
        }
      }

      if (canProceed) {
        const result = backtrack(newAssignment, newDomains);
        if (result) return result;
      }

      // Backtracking step
      backtracks++;
      steps.push({
        stepIndex: steps.length + 1,
        variable: varToAssign,
        domains: currentDomains,
        assignment: { ...assignment },
        action: 'backtrack',
        message: `Backtracked from ${varToAssign} = ${val}.`,
      });
    }

    return null;
  }

  const solution = backtrack({}, initialDomains);

  return {
    solved: solution !== null,
    solution,
    steps,
    backtracks,
    nodesExpanded,
  };
}

// Preset generator: Australia Map Coloring
export function createMapColoringProblem(colors: string[] = ['Red', 'Green', 'Blue']): CspProblem {
  const variables = ['WA', 'NT', 'SA', 'Q', 'NSW', 'V', 'T'];
  const domains: Record<CspVariable, CspValue[]> = {};
  for (const v of variables) {
    domains[v] = [...colors];
  }

  const notEqual = (a: CspValue, b: CspValue) => a !== b;
  const adjacencyPairs: [string, string][] = [
    ['WA', 'NT'],
    ['WA', 'SA'],
    ['NT', 'SA'],
    ['NT', 'Q'],
    ['SA', 'Q'],
    ['SA', 'NSW'],
    ['SA', 'V'],
    ['Q', 'NSW'],
    ['NSW', 'V'],
  ];

  const constraints = adjacencyPairs.map(([var1, var2]) => ({
    var1,
    var2,
    isValid: notEqual,
    name: `${var1} != ${var2}`,
  }));

  return { variables, domains, constraints };
}

// Preset generator: N-Queens Problem
export function createNQueensProblem(n: number = 4): CspProblem {
  const variables = Array.from({ length: n }, (_, i) => `Q${i}`);
  const rowValues = Array.from({ length: n }, (_, i) => i);
  const domains: Record<CspVariable, CspValue[]> = {};

  for (const v of variables) {
    domains[v] = [...rowValues];
  }

  const constraints = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const colDiff = j - i;
      constraints.push({
        var1: `Q${i}`,
        var2: `Q${j}`,
        isValid: (r1: CspValue, r2: CspValue) => {
          const row1 = Number(r1);
          const row2 = Number(r2);
          return row1 !== row2 && Math.abs(row1 - row2) !== colDiff;
        },
        name: `Q${i} attacks Q${j}`,
      });
    }
  }

  return { variables, domains, constraints };
}
