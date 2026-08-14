export interface HornRule {
  id: string;
  premises: string[];
  conclusion: string;
  name?: string;
}

export interface ChainingStep {
  stepIndex: number;
  type: 'FORWARD' | 'BACKWARD';
  action: string;
  activeItem: string;
  knownFacts: string[];
  agendaOrStack: string[];
  firedRuleId?: string;
  isSuccess?: boolean;
}

export interface ForwardChainingResult {
  derivedFacts: string[];
  goalReached: boolean;
  steps: ChainingStep[];
  rulesFired: string[];
}

export interface BackwardChainingResult {
  goalProved: boolean;
  proofPath: string[];
  steps: ChainingStep[];
}
