export type Operator = 'NOT' | 'AND' | 'OR' | 'IMPLIES' | 'IFF';

export type ASTNode =
  | { type: 'VARIABLE'; name: string }
  | { type: 'NOT'; operand: ASTNode }
  | { type: 'BINARY'; operator: 'AND' | 'OR' | 'IMPLIES' | 'IFF'; left: ASTNode; right: ASTNode };

export type Assignment = Record<string, boolean>;

export interface TableRow {
  index: number;
  assignment: Assignment;
  subExpressionValues: Record<string, boolean>;
  value: boolean;
  isModelOfKB?: boolean;
  isCounterExample?: boolean;
}

export type LogicalClassification = 'tautology' | 'contingent' | 'contradiction';

export interface TruthTableResult {
  rawFormula: string;
  normalizedFormula: string;
  variables: string[];
  subExpressions: string[];
  rows: TableRow[];
  classification: LogicalClassification;
  satisfyingCount: number;
  totalRows: number;
}

export interface EntailmentResult {
  premises: string[];
  conclusion: string;
  variables: string[];
  subExpressions: string[];
  rows: TableRow[];
  isEntailed: boolean;
  kbModelsCount: number;
  counterExamples: TableRow[];
  explanation: string;
}
