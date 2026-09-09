export type CspVariable = string;
export type CspValue = string | number;

export interface CspConstraint {
  var1: CspVariable;
  var2: CspVariable;
  isValid: (val1: CspValue, val2: CspValue) => boolean;
  name?: string;
}

export interface CspProblem {
  variables: CspVariable[];
  domains: Record<CspVariable, CspValue[]>;
  constraints: CspConstraint[];
}

export interface CspStep {
  stepIndex: number;
  variable?: CspVariable;
  assignedValue?: CspValue;
  domains: Record<CspVariable, CspValue[]>;
  assignment: Record<CspVariable, CspValue>;
  arcRevised?: [CspVariable, CspVariable];
  prunedValues?: CspValue[];
  action: 'assign' | 'backtrack' | 'ac3_revise' | 'domain_wipeout' | 'solution_found';
  message: string;
}

export interface CspSolverConfig {
  useAc3?: boolean;
  useMrv?: boolean; // Minimum Remaining Values heuristic
  useLcv?: boolean; // Least Constraining Value heuristic
  maxSteps?: number;
}

export interface CspResult {
  solved: boolean;
  solution: Record<CspVariable, CspValue> | null;
  steps: CspStep[];
  backtracks: number;
  nodesExpanded: number;
}

