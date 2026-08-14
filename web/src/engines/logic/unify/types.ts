export type Term =
  | { type: 'VARIABLE'; name: string }
  | { type: 'CONSTANT'; name: string }
  | { type: 'COMPOUND'; name: string; args: Term[] };

export type Substitution = Record<string, Term>;

export interface UnifyStep {
  stepIndex: number;
  term1: string;
  term2: string;
  substitutionBefore: Record<string, string>;
  substitutionAfter: Record<string, string>;
  action: string;
  isFailure?: boolean;
  failureReason?: string;
}

export interface UnifyResult {
  term1Raw: string;
  term2Raw: string;
  term1Parsed: Term;
  term2Parsed: Term;
  success: boolean;
  mgu: Substitution | null;
  mguFormatted: Record<string, string>;
  unifiedTermFormatted: string | null;
  steps: UnifyStep[];
  failureReason?: string;
}
