import { parseFormula } from './parser';
import { evaluate, extractVariables, extractSubExpressions, formatFormula } from './evaluator';
import type {
  Assignment,
  TableRow,
  TruthTableResult,
  EntailmentResult,
  LogicalClassification,
} from './types';

/**
 * Generate all 2^n truth assignments for a list of variables in standard order (True first).
 */
export function generateAssignments(variables: string[]): Assignment[] {
  const n = variables.length;
  const count = 1 << n;
  const results: Assignment[] = [];

  for (let i = 0; i < count; i++) {
    const assignment: Assignment = {};
    for (let j = 0; j < n; j++) {
      const varName = variables[j];
      if (varName === undefined) continue;
      // In standard logic tables, the most significant variable toggles slowest, True first
      const bit = (i >> (n - 1 - j)) & 1;
      assignment[varName] = bit === 0;
    }
    results.push(assignment);
  }

  return results;
}

export function generateTruthTable(formulaStr: string): TruthTableResult {
  const ast = parseFormula(formulaStr);
  const normalized = formatFormula(ast);
  const variables = extractVariables(ast);
  const subAsts = extractSubExpressions(ast);
  const subExpressions = subAsts.map(formatFormula);

  const assignments = generateAssignments(variables);
  const rows: TableRow[] = [];
  let satisfyingCount = 0;

  assignments.forEach((assignment, index) => {
    const subExpressionValues: Record<string, boolean> = {};
    for (let k = 0; k < subAsts.length; k++) {
      const sub = subAsts[k];
      const header = subExpressions[k];
      if (sub && header) {
        subExpressionValues[header] = evaluate(sub, assignment);
      }
    }

    const value = evaluate(ast, assignment);
    if (value) satisfyingCount++;

    rows.push({
      index,
      assignment,
      subExpressionValues,
      value,
    });
  });

  const totalRows = rows.length;
  let classification: LogicalClassification = 'contingent';
  if (satisfyingCount === totalRows) {
    classification = 'tautology';
  } else if (satisfyingCount === 0) {
    classification = 'contradiction';
  }

  return {
    rawFormula: formulaStr,
    normalizedFormula: normalized,
    variables,
    subExpressions,
    rows,
    classification,
    satisfyingCount,
    totalRows,
  };
}

export function checkEntailment(premises: string[], conclusion: string): EntailmentResult {
  const parsedPremises = premises.map((p) => ({
    raw: p,
    ast: parseFormula(p),
  }));
  const parsedConclusion = {
    raw: conclusion,
    ast: parseFormula(conclusion),
  };

  const varSet = new Set<string>();
  parsedPremises.forEach((p) => {
    extractVariables(p.ast).forEach((v) => varSet.add(v));
  });
  extractVariables(parsedConclusion.ast).forEach((v) => varSet.add(v));
  const variables = Array.from(varSet).sort();

  const subExprList: string[] = [];
  parsedPremises.forEach((p) => {
    subExprList.push(formatFormula(p.ast));
  });
  const conclusionStr = formatFormula(parsedConclusion.ast);
  subExprList.push(conclusionStr);

  const assignments = generateAssignments(variables);
  const rows: TableRow[] = [];
  const counterExamples: TableRow[] = [];
  let kbModelsCount = 0;

  assignments.forEach((assignment, index) => {
    const subExpressionValues: Record<string, boolean> = {};
    let isModelOfKB = true;

    for (const p of parsedPremises) {
      const val = evaluate(p.ast, assignment);
      subExpressionValues[formatFormula(p.ast)] = val;
      if (!val) isModelOfKB = false;
    }

    const concVal = evaluate(parsedConclusion.ast, assignment);
    subExpressionValues[conclusionStr] = concVal;

    if (isModelOfKB) {
      kbModelsCount++;
    }

    const isCounterExample = isModelOfKB && !concVal;

    const row: TableRow = {
      index,
      assignment,
      subExpressionValues,
      value: concVal,
      isModelOfKB,
      isCounterExample,
    };

    if (isCounterExample) {
      counterExamples.push(row);
    }
    rows.push(row);
  });

  const isEntailed = counterExamples.length === 0;

  let explanation = '';
  if (isEntailed) {
    explanation = `Entailment holds (KB ⊨ α). In all ${kbModelsCount} world(s) where all premises are TRUE, the conclusion is also TRUE. No countermodels exist.`;
  } else {
    explanation = `Entailment fails (KB ⊭ α). Found ${counterExamples.length} countermodel(s) where all premises are TRUE but the conclusion is FALSE!`;
  }

  return {
    premises,
    conclusion,
    variables,
    subExpressions: subExprList,
    rows,
    isEntailed,
    kbModelsCount,
    counterExamples,
    explanation,
  };
}
