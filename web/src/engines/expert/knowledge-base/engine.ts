import type { RuleDefinition, KnowledgeAnomaly, ValidationReport } from './types';

export function validateKnowledgeBase(
  rules: RuleDefinition[],
  knownTerminalGoals: string[] = [],
  observableFacts: string[] = []
): ValidationReport {
  const anomalies: KnowledgeAnomaly[] = [];
  const nodesSet = new Set<string>();
  const edges: { from: string; to: string; ruleId: string }[] = [];

  // Build graph and check basic structure
  rules.forEach((rule) => {
    rule.premises.forEach((p) => {
      nodesSet.add(p);
      edges.push({ from: p, to: rule.conclusion, ruleId: rule.id });
    });
    nodesSet.add(rule.conclusion);
  });

  // 1. Check for Identical Redundant Rules & Subsumption
  for (let i = 0; i < rules.length; i++) {
    for (let j = i + 1; j < rules.length; j++) {
      const r1 = rules[i];
      const r2 = rules[j];
      if (!r1 || !r2) continue;

      if (r1.conclusion === r2.conclusion) {
        const s1 = new Set(r1.premises);
        const s2 = new Set(r2.premises);

        // Exact match
        if (s1.size === s2.size && [...s1].every((p) => s2.has(p))) {
          anomalies.push({
            type: 'REDUNDANCY',
            severity: 'warning',
            ruleIds: [r1.id, r2.id],
            message: `Exact duplicate rules: Rule ${r1.id} and Rule ${r2.id} have identical premises and conclusion '${r1.conclusion}'.`,
            suggestion: `Remove one of the duplicate rules to avoid redundant evaluations.`,
          });
        }
        // Subsumption: r1 has a subset of premises of r2
        else if (s1.size < s2.size && [...s1].every((p) => s2.has(p))) {
          anomalies.push({
            type: 'REDUNDANCY',
            severity: 'info',
            ruleIds: [r1.id, r2.id],
            message: `Subsumption detected: Rule ${r2.id} is subsumed by more general Rule ${r1.id}.`,
            suggestion: `Whenever Rule ${r2.id} can fire, Rule ${r1.id} already fires. Consider eliminating the redundant specific rule.`,
          });
        }
      }

      // 2. Contradiction Check: Same premises, contradictory conclusions
      const isNegation =
        r1.conclusion === `~${r2.conclusion}` ||
        r2.conclusion === `~${r1.conclusion}` ||
        (r1.conclusion.startsWith('No') && r1.conclusion.slice(2) === r2.conclusion) ||
        (r2.conclusion.startsWith('No') && r2.conclusion.slice(2) === r1.conclusion);

      if (isNegation) {
        const s1 = new Set(r1.premises);
        const s2 = new Set(r2.premises);
        if (s1.size === s2.size && [...s1].every((p) => s2.has(p))) {
          anomalies.push({
            type: 'CONTRADICTION',
            severity: 'error',
            ruleIds: [r1.id, r2.id],
            message: `Direct contradiction: Rules ${r1.id} and ${r2.id} share identical premises but deduce mutually exclusive conclusions ('${r1.conclusion}' vs '${r2.conclusion}').`,
            suggestion: `Consult domain expert to resolve contradictory criteria.`,
          });
        }
      }
    }
  }

  // 3. Circular Dependency Check (Tarjan / DFS cycle check on rule conclusion graph)
  const adj = new Map<string, { to: string; ruleId: string }[]>();
  rules.forEach((r) => {
    r.premises.forEach((p) => {
      const list = adj.get(p) ?? [];
      list.push({ to: r.conclusion, ruleId: r.id });
      adj.set(p, list);
    });
  });

  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const path: string[] = [];

  function detectCycle(u: string): boolean {
    visited.add(u);
    recursionStack.add(u);
    path.push(u);

    const neighbors = adj.get(u) ?? [];
    for (const edge of neighbors) {
      if (!visited.has(edge.to)) {
        if (detectCycle(edge.to)) return true;
      } else if (recursionStack.has(edge.to)) {
        // Cycle detected
        const cycleStartIndex = path.indexOf(edge.to);
        const cycleNodes = path.slice(cycleStartIndex);
        cycleNodes.push(edge.to);
        anomalies.push({
          type: 'CIRCULARITY',
          severity: 'error',
          ruleIds: [edge.ruleId],
          message: `Circular dependency loop detected: ${cycleNodes.join(' → ')}.`,
          suggestion: `Break the circular link to prevent infinite loops during backward chaining.`,
        });
        return true;
      }
    }

    recursionStack.delete(u);
    path.pop();
    return false;
  }

  nodesSet.forEach((node) => {
    if (!visited.has(node)) {
      detectCycle(node);
    }
  });

  // 4. Unreachable Premises Check
  const concludedSet = new Set<string>(rules.map((r) => r.conclusion));
  const observableSet = new Set<string>(observableFacts);

  rules.forEach((r) => {
    r.premises.forEach((p) => {
      if (!concludedSet.has(p) && !observableSet.has(p) && observableFacts.length > 0) {
        anomalies.push({
          type: 'UNREACHABLE_PREMISE',
          severity: 'warning',
          ruleIds: [r.id],
          message: `Unreachable premise '${p}' in Rule ${r.id}: It is neither asserted as an observable fact nor derived by any rule.`,
          suggestion: `Add an elicitation rule to derive '${p}' or mark it as an observable input fact.`,
        });
      }
    });
  });

  // 5. Dead-End Conclusions Check
  const premisesSet = new Set<string>();
  rules.forEach((r) => r.premises.forEach((p) => premisesSet.add(p)));
  const goalSet = new Set<string>(knownTerminalGoals);

  rules.forEach((r) => {
    if (
      !premisesSet.has(r.conclusion) &&
      !goalSet.has(r.conclusion) &&
      knownTerminalGoals.length > 0
    ) {
      anomalies.push({
        type: 'DEAD_END_CONCLUSION',
        severity: 'info',
        ruleIds: [r.id],
        message: `Dead-end conclusion '${r.conclusion}' in Rule ${r.id}: It is not used as a premise in any downstream rule and is not in the declared terminal goal list.`,
        suggestion: `Declare '${r.conclusion}' as a terminal goal or connect it to downstream diagnostic rules.`,
      });
    }
  });

  const hasErrors = anomalies.some((a) => a.severity === 'error');

  return {
    isValid: !hasErrors,
    ruleCount: rules.length,
    anomalies,
    derivedGraph: {
      nodes: Array.from(nodesSet),
      edges,
    },
  };
}
