export interface RuleDefinition {
  id: string;
  name: string;
  premises: string[];
  conclusion: string;
  certainty?: number; // Certainty Factor (0.0 to 1.0)
}

export type KnowledgeAnomalyType =
  'REDUNDANCY' | 'CONTRADICTION' | 'CIRCULARITY' | 'UNREACHABLE_PREMISE' | 'DEAD_END_CONCLUSION';

export interface KnowledgeAnomaly {
  type: KnowledgeAnomalyType;
  severity: 'error' | 'warning' | 'info';
  ruleIds: string[];
  message: string;
  suggestion: string;
}

export interface ValidationReport {
  isValid: boolean;
  ruleCount: number;
  anomalies: KnowledgeAnomaly[];
  derivedGraph: {
    nodes: string[];
    edges: { from: string; to: string; ruleId: string }[];
  };
}
