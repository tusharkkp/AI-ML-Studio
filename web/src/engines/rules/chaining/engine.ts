import type {
  HornRule,
  ChainingStep,
  ForwardChainingResult,
  BackwardChainingResult,
} from './types';

export function runForwardChaining(
  rules: HornRule[],
  initialFacts: string[],
  targetGoal?: string
): ForwardChainingResult {
  const steps: ChainingStep[] = [];
  const knownFacts = new Set<string>(initialFacts);
  const agenda: string[] = [...initialFacts];
  const rulesFired: string[] = [];

  // count[rule.id] tracks number of premises not yet verified
  const count: Record<string, number> = {};
  // map from premise to list of rules containing it
  const premiseToRules: Record<string, HornRule[]> = {};

  rules.forEach((rule) => {
    count[rule.id] = rule.premises.length;
    rule.premises.forEach((p) => {
      if (!premiseToRules[p]) {
        premiseToRules[p] = [];
      }
      premiseToRules[p]?.push(rule);
    });
  });

  let stepCounter = 0;
  steps.push({
    stepIndex: ++stepCounter,
    type: 'FORWARD',
    action: `Initial state loaded with ${initialFacts.length} fact(s): [${initialFacts.join(', ')}].`,
    activeItem: 'INIT',
    knownFacts: Array.from(knownFacts),
    agendaOrStack: [...agenda],
  });

  const processedFacts = new Set<string>();

  while (agenda.length > 0) {
    const fact = agenda.shift();
    if (!fact) break;
    if (processedFacts.has(fact)) continue;
    processedFacts.add(fact);

    steps.push({
      stepIndex: ++stepCounter,
      type: 'FORWARD',
      action: `Dequeued known fact '${fact}'. Checking pending rule premises.`,
      activeItem: fact,
      knownFacts: Array.from(knownFacts),
      agendaOrStack: [...agenda],
    });

    const candidateRules = premiseToRules[fact] ?? [];
    for (const rule of candidateRules) {
      const remaining = count[rule.id];
      if (remaining !== undefined && remaining > 0) {
        count[rule.id] = remaining - 1;

        steps.push({
          stepIndex: ++stepCounter,
          type: 'FORWARD',
          action: `Fact '${fact}' satisfies premise in Rule ${rule.id} (${rule.premises.join(' ∧ ')} → ${rule.conclusion}). Remaining premises: ${remaining - 1}.`,
          activeItem: rule.id,
          knownFacts: Array.from(knownFacts),
          agendaOrStack: [...agenda],
        });

        if (remaining - 1 === 0) {
          rulesFired.push(rule.id);
          const newFact = rule.conclusion;

          if (!knownFacts.has(newFact)) {
            knownFacts.add(newFact);
            agenda.push(newFact);

            steps.push({
              stepIndex: ++stepCounter,
              type: 'FORWARD',
              action: `🔥 Rule ${rule.id} fired! Derived new fact: '${newFact}'. Enqueued to agenda.`,
              activeItem: newFact,
              knownFacts: Array.from(knownFacts),
              agendaOrStack: [...agenda],
              firedRuleId: rule.id,
            });

            if (targetGoal && newFact === targetGoal) {
              steps.push({
                stepIndex: ++stepCounter,
                type: 'FORWARD',
                action: `Target goal '${targetGoal}' reached! Halting forward chaining.`,
                activeItem: targetGoal,
                knownFacts: Array.from(knownFacts),
                agendaOrStack: [...agenda],
                isSuccess: true,
              });
              return {
                derivedFacts: Array.from(knownFacts),
                goalReached: true,
                steps,
                rulesFired,
              };
            }
          }
        }
      }
    }
  }

  const goalReached = targetGoal ? knownFacts.has(targetGoal) : false;
  steps.push({
    stepIndex: ++stepCounter,
    type: 'FORWARD',
    action: `Agenda empty. Fixed point reached. Total facts established: ${knownFacts.size}.`,
    activeItem: 'HALT',
    knownFacts: Array.from(knownFacts),
    agendaOrStack: [],
    isSuccess: goalReached,
  });

  return {
    derivedFacts: Array.from(knownFacts),
    goalReached,
    steps,
    rulesFired,
  };
}

export function runBackwardChaining(
  rules: HornRule[],
  initialFacts: string[],
  targetGoal: string
): BackwardChainingResult {
  const steps: ChainingStep[] = [];
  const knownFacts = new Set<string>(initialFacts);
  const proofPath: string[] = [];
  let stepCounter = 0;

  function prove(goal: string, goalStack: string[]): boolean {
    steps.push({
      stepIndex: ++stepCounter,
      type: 'BACKWARD',
      action: `Investigating goal '${goal}'. Current goal stack: [${[...goalStack, goal].join(' → ')}].`,
      activeItem: goal,
      knownFacts: Array.from(knownFacts),
      agendaOrStack: [...goalStack, goal],
    });

    // Base case 1: Goal is already a known fact
    if (knownFacts.has(goal)) {
      steps.push({
        stepIndex: ++stepCounter,
        type: 'BACKWARD',
        action: `Goal '${goal}' is directly known as a true ground fact!`,
        activeItem: goal,
        knownFacts: Array.from(knownFacts),
        agendaOrStack: [...goalStack, goal],
        isSuccess: true,
      });
      proofPath.push(goal);
      return true;
    }

    // Base case 2: Cycle detection
    if (goalStack.includes(goal)) {
      steps.push({
        stepIndex: ++stepCounter,
        type: 'BACKWARD',
        action: `Loop detected! '${goal}' is already in the active stack. Backtracking to prevent infinite recursion.`,
        activeItem: goal,
        knownFacts: Array.from(knownFacts),
        agendaOrStack: [...goalStack, goal],
      });
      return false;
    }

    // Find rules that conclude this goal
    const candidateRules = rules.filter((r) => r.conclusion === goal);
    if (candidateRules.length === 0) {
      steps.push({
        stepIndex: ++stepCounter,
        type: 'BACKWARD',
        action: `No rules or facts support goal '${goal}'. Fails on this branch.`,
        activeItem: goal,
        knownFacts: Array.from(knownFacts),
        agendaOrStack: [...goalStack, goal],
      });
      return false;
    }

    for (const rule of candidateRules) {
      steps.push({
        stepIndex: ++stepCounter,
        type: 'BACKWARD',
        action: `Rule ${rule.id} (${rule.premises.join(' ∧ ')} → ${rule.conclusion}) supports goal '${goal}'. Attempting to prove all premises: [${rule.premises.join(', ')}].`,
        activeItem: rule.id,
        knownFacts: Array.from(knownFacts),
        agendaOrStack: [...goalStack, goal],
        firedRuleId: rule.id,
      });

      let allPremisesProven = true;
      for (const premise of rule.premises) {
        const proven = prove(premise, [...goalStack, goal]);
        if (!proven) {
          allPremisesProven = false;
          steps.push({
            stepIndex: ++stepCounter,
            type: 'BACKWARD',
            action: `Premise '${premise}' could not be proven for Rule ${rule.id}. Backtracking.`,
            activeItem: premise,
            knownFacts: Array.from(knownFacts),
            agendaOrStack: [...goalStack, goal],
          });
          break;
        }
      }

      if (allPremisesProven) {
        knownFacts.add(goal);
        proofPath.push(rule.id);
        steps.push({
          stepIndex: ++stepCounter,
          type: 'BACKWARD',
          action: `All premises for Rule ${rule.id} proven! Goal '${goal}' is proven true.`,
          activeItem: goal,
          knownFacts: Array.from(knownFacts),
          agendaOrStack: [...goalStack, goal],
          isSuccess: true,
        });
        return true;
      }
    }

    return false;
  }

  const goalProved = prove(targetGoal, []);
  return {
    goalProved,
    proofPath,
    steps,
  };
}
