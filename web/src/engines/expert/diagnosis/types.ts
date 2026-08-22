export interface DiagnosticRule {
  id: string;
  conditionName: string;
  premises: { symptomId: string; prompt: string; expectedValue: boolean | string }[];
  conclusion: string;
  severity: 'mild' | 'moderate' | 'critical';
  confidence: number; // 0.0 to 1.0 Certainty Factor
  treatment: string;
}

export interface PatientProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  observedSymptoms: Record<string, boolean | string>;
  description: string;
}

export interface WhyExplanation {
  symptomId: string;
  activeRuleId: string;
  targetHypothesis: string;
  rationale: string;
}

export interface HowExplanation {
  diagnosis: string;
  confidence: number;
  firedRuleId: string;
  justifications: { symptomPrompt: string; patientValue: string }[];
}

export interface ConsultationState {
  answers: Record<string, boolean | string>;
  currentQuestion: {
    symptomId: string;
    prompt: string;
    type: 'boolean' | 'choice';
    options?: string[];
  } | null;
  activeHypothesis: string | null;
  whyExplanation: WhyExplanation | null;
  finalDiagnosis: {
    condition: string;
    severity: 'mild' | 'moderate' | 'critical';
    confidence: number;
    treatment: string;
    howExplanation: HowExplanation;
  } | null;
  completed: boolean;
}

export type BloodGroup = 'O-' | 'O+' | 'A-' | 'A+' | 'B-' | 'B+' | 'AB-' | 'AB+';

export interface TransfusionResult {
  donorGroup: BloodGroup;
  recipientGroup: BloodGroup;
  isCompatible: boolean;
  explanation: string;
  antibodiesPresent: string[];
  antigensPresent: string[];
}
