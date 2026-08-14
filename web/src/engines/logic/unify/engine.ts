import { parseTerm, formatTerm } from './parser';
import type { Term, Substitution, UnifyStep, UnifyResult } from './types';

export function applySubst(theta: Substitution, term: Term): Term {
  if (term.type === 'VARIABLE') {
    const bound = theta[term.name];
    if (bound) {
      // Transitively apply substitution in case bound term contains variables also in theta
      return applySubst(theta, bound);
    }
    return term;
  }
  if (term.type === 'CONSTANT') {
    return term;
  }
  return {
    type: 'COMPOUND',
    name: term.name,
    args: term.args.map((a) => applySubst(theta, a)),
  };
}

export function occurCheck(varName: string, term: Term, theta: Substitution): boolean {
  const resolved = applySubst(theta, term);

  function occurs(t: Term): boolean {
    if (t.type === 'VARIABLE') {
      return t.name === varName;
    }
    if (t.type === 'CONSTANT') {
      return false;
    }
    return t.args.some(occurs);
  }

  return occurs(resolved);
}

function formatSubstitution(theta: Substitution): Record<string, string> {
  const res: Record<string, string> = {};
  for (const [k, v] of Object.entries(theta)) {
    res[k] = formatTerm(v);
  }
  return res;
}

export function runUnification(raw1: string, raw2: string): UnifyResult {
  const t1 = parseTerm(raw1);
  const t2 = parseTerm(raw2);

  const steps: UnifyStep[] = [];
  let stepCounter = 0;
  let failureReason: string | undefined;

  function unifyInternal(x: Term, y: Term, theta: Substitution): Substitution | null {
    stepCounter++;
    const stepIdx = stepCounter;
    const xStr = formatTerm(x);
    const yStr = formatTerm(y);
    const thetaBefore = formatSubstitution(theta);

    // If identical terms
    if (x.type === y.type && x.name === y.name) {
      if (x.type !== 'COMPOUND') {
        steps.push({
          stepIndex: stepIdx,
          term1: xStr,
          term2: yStr,
          substitutionBefore: thetaBefore,
          substitutionAfter: thetaBefore,
          action: `Terms ${xStr} and ${yStr} are identical atoms. No substitution needed.`,
        });
        return theta;
      }
    }

    // If x is a variable
    if (x.type === 'VARIABLE') {
      return unifyVar(x.name, y, theta, stepIdx, xStr, yStr, thetaBefore);
    }

    // If y is a variable
    if (y.type === 'VARIABLE') {
      return unifyVar(y.name, x, theta, stepIdx, yStr, xStr, thetaBefore);
    }

    // If both are compounds
    if (x.type === 'COMPOUND' && y.type === 'COMPOUND') {
      if (x.name !== y.name) {
        failureReason = `Functor clash: '${x.name}' does not match '${y.name}'`;
        steps.push({
          stepIndex: stepIdx,
          term1: xStr,
          term2: yStr,
          substitutionBefore: thetaBefore,
          substitutionAfter: thetaBefore,
          action: `Failed: Functor mismatch (${x.name} ≠ ${y.name}).`,
          isFailure: true,
          failureReason,
        });
        return null;
      }

      if (x.args.length !== y.args.length) {
        failureReason = `Arity mismatch: '${x.name}' has ${x.args.length} arguments but '${y.name}' has ${y.args.length}`;
        steps.push({
          stepIndex: stepIdx,
          term1: xStr,
          term2: yStr,
          substitutionBefore: thetaBefore,
          substitutionAfter: thetaBefore,
          action: `Failed: Arity mismatch (${x.args.length} ≠ ${y.args.length}).`,
          isFailure: true,
          failureReason,
        });
        return null;
      }

      steps.push({
        stepIndex: stepIdx,
        term1: xStr,
        term2: yStr,
        substitutionBefore: thetaBefore,
        substitutionAfter: thetaBefore,
        action: `Functor '${x.name}' matches with arity ${x.args.length}. Recursively unifying arguments.`,
      });

      let currentTheta: Substitution = { ...theta };
      for (let i = 0; i < x.args.length; i++) {
        const arg1 = x.args[i];
        const arg2 = y.args[i];
        if (!arg1 || !arg2) continue;

        const subResult = unifyInternal(
          applySubst(currentTheta, arg1),
          applySubst(currentTheta, arg2),
          currentTheta
        );

        if (subResult === null) {
          return null;
        }
        currentTheta = subResult;
      }
      return currentTheta;
    }

    // Constant clash
    failureReason = `Constant symbol clash: '${xStr}' ≠ '${yStr}'`;
    steps.push({
      stepIndex: stepIdx,
      term1: xStr,
      term2: yStr,
      substitutionBefore: thetaBefore,
      substitutionAfter: thetaBefore,
      action: `Failed: Incompatible constants (${xStr} ≠ ${yStr}).`,
      isFailure: true,
      failureReason,
    });
    return null;
  }

  function unifyVar(
    varName: string,
    x: Term,
    theta: Substitution,
    stepIdx: number,
    varStr: string,
    targetStr: string,
    thetaBefore: Record<string, string>
  ): Substitution | null {
    if (theta[varName]) {
      const bound = theta[varName];
      if (bound) {
        return unifyInternal(bound, x, theta);
      }
    }

    if (x.type === 'VARIABLE' && theta[x.name]) {
      const bound = theta[x.name];
      if (bound) {
        return unifyInternal({ type: 'VARIABLE', name: varName }, bound, theta);
      }
    }

    // Occurs check: does varName occur inside x?
    if (occurCheck(varName, x, theta)) {
      failureReason = `Occurs-check failure: Variable '${varName}' occurs inside '${formatTerm(x)}'. Unification would produce an infinite cyclic structure.`;
      steps.push({
        stepIndex: stepIdx,
        term1: varStr,
        term2: targetStr,
        substitutionBefore: thetaBefore,
        substitutionAfter: thetaBefore,
        action: `Failed: Occurs-check violation (${varName} in ${targetStr}).`,
        isFailure: true,
        failureReason,
      });
      return null;
    }

    const newTheta: Substitution = { ...theta, [varName]: x };
    const thetaAfter = formatSubstitution(newTheta);

    steps.push({
      stepIndex: stepIdx,
      term1: varStr,
      term2: targetStr,
      substitutionBefore: thetaBefore,
      substitutionAfter: thetaAfter,
      action: `Bound variable ${varName} to ${formatTerm(x)}.`,
    });

    return newTheta;
  }

  const finalMgu = unifyInternal(t1, t2, {});
  const success = finalMgu !== null;

  let unifiedTermFormatted: string | null = null;
  if (success && finalMgu) {
    const unified = applySubst(finalMgu, t1);
    unifiedTermFormatted = formatTerm(unified);
  }

  return {
    term1Raw: raw1,
    term2Raw: raw2,
    term1Parsed: t1,
    term2Parsed: t2,
    success,
    mgu: finalMgu,
    mguFormatted: finalMgu ? formatSubstitution(finalMgu) : {},
    unifiedTermFormatted,
    steps,
    failureReason,
  };
}
