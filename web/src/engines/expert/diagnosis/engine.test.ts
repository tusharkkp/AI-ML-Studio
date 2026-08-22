import { describe, it, expect } from 'vitest';
import { stepConsultation, evaluateTransfusion } from './engine';

describe('Clinical Diagnosis Expert System Engine', () => {
  it('diagnoses Dengue Hemorrhagic Fever and generates "How" explanation', () => {
    let state = stepConsultation({});
    expect(state.completed).toBe(false);
    expect(state.currentQuestion?.symptomId).toBe('high_fever');

    // Answer high fever = true
    state = stepConsultation({ high_fever: true });
    expect(state.completed).toBe(false);
    expect(state.currentQuestion?.symptomId).toBe('platelets_low');

    // Answer platelets_low = true
    state = stepConsultation({ high_fever: true, platelets_low: true });
    expect(state.completed).toBe(false);
    expect(state.currentQuestion?.symptomId).toBe('petechial_rash');

    // Answer petechial_rash = true -> concludes DHF
    state = stepConsultation({ high_fever: true, platelets_low: true, petechial_rash: true });
    expect(state.completed).toBe(true);
    expect(state.finalDiagnosis?.condition).toContain('Dengue Hemorrhagic Fever');
    expect(state.finalDiagnosis?.howExplanation.firedRuleId).toBe('R1_DHF');
    expect(state.finalDiagnosis?.howExplanation.justifications).toHaveLength(3);
  });

  it('generates transparent "Why" explanations during intermediate questions', () => {
    const state = stepConsultation({ high_fever: true });
    expect(state.whyExplanation).not.toBeNull();
    expect(state.whyExplanation?.symptomId).toBe('platelets_low');
    expect(state.whyExplanation?.rationale).toContain('testing hypothesis');
    expect(state.whyExplanation?.activeRuleId).toBe('R1_DHF');
  });

  it('correctly branches to Sepsis when Dengue criteria fail', () => {
    // High fever true, but platelets normal (false)
    const state = stepConsultation({ high_fever: true, platelets_low: false });
    // Should test other viable rules
    expect(state.completed).toBe(false);
    expect(state.currentQuestion).not.toBeNull();
  });
});

describe('Blood Transfusion Compatibility Crossmatch (trans.pl)', () => {
  it('verifies O- is compatible as Universal Red Blood Cell Donor', () => {
    const resA = evaluateTransfusion('O-', 'A+');
    expect(resA.isCompatible).toBe(true);

    const resB = evaluateTransfusion('O-', 'B-');
    expect(resB.isCompatible).toBe(true);

    const resAB = evaluateTransfusion('O-', 'AB+');
    expect(resAB.isCompatible).toBe(true);
  });

  it('verifies AB+ is Universal Recipient', () => {
    const resA = evaluateTransfusion('A+', 'AB+');
    expect(resA.isCompatible).toBe(true);

    const resB = evaluateTransfusion('B+', 'AB+');
    expect(resB.isCompatible).toBe(true);
  });

  it('strictly detects ABO antigen incompatibility (e.g. A+ to B+)', () => {
    const res = evaluateTransfusion('A+', 'B+');
    expect(res.isCompatible).toBe(false);
    expect(res.explanation).toContain('FATAL INCOMPATIBILITY');
    expect(res.explanation).toContain('Anti-A');
  });

  it('strictly prevents Rh+ donor blood to Rh- recipient', () => {
    const res = evaluateTransfusion('O+', 'O-');
    expect(res.isCompatible).toBe(false);
    expect(res.explanation).toContain('Anti-D');
  });
});
