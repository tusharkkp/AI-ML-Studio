import type {
  DiagnosticRule,
  ConsultationState,
  WhyExplanation,
  HowExplanation,
  BloodGroup,
  TransfusionResult,
} from './types';

export const CLINICAL_RULES: DiagnosticRule[] = [
  {
    id: 'R1_DHF',
    conditionName: 'Dengue Hemorrhagic Fever',
    premises: [
      {
        symptomId: 'high_fever',
        prompt: 'Does the patient have acute high fever (> 38.5°C)?',
        expectedValue: true,
      },
      {
        symptomId: 'platelets_low',
        prompt: 'Is platelet count critically low (< 100,000 / μL)?',
        expectedValue: true,
      },
      {
        symptomId: 'petechial_rash',
        prompt: 'Are petechiae, purpura, or spontaneous mucosal bleeds observed?',
        expectedValue: true,
      },
    ],
    conclusion: 'Dengue Hemorrhagic Fever (DHF Grade II)',
    severity: 'critical',
    confidence: 0.95,
    treatment:
      'Immediate hospital admission, strict fluid resuscitation, and standby platelet transfusion.',
  },
  {
    id: 'R2_SEPSIS',
    conditionName: 'Acute Bacterial Sepsis',
    premises: [
      {
        symptomId: 'high_fever',
        prompt: 'Does the patient have acute high fever (> 38.5°C)?',
        expectedValue: true,
      },
      {
        symptomId: 'high_wbc',
        prompt: 'Is total leukocyte count abnormally elevated (> 12,000 / μL)?',
        expectedValue: true,
      },
      {
        symptomId: 'hypotension',
        prompt: 'Is systolic blood pressure < 90 mmHg (systemic hypotension)?',
        expectedValue: true,
      },
    ],
    conclusion: 'Bacterial Sepsis with Septic Shock Risk',
    severity: 'critical',
    confidence: 0.96,
    treatment:
      'Immediate blood cultures, empirical broad-spectrum IV antibiotics within 1 hour, crystalloid bolus.',
  },
  {
    id: 'R3_ANEMIA',
    conditionName: 'Severe Microcytic Anemia',
    premises: [
      {
        symptomId: 'hemoglobin_low',
        prompt: 'Is hemoglobin critically depressed (< 8.0 g/dL)?',
        expectedValue: true,
      },
      {
        symptomId: 'chronic_fatigue',
        prompt: 'Does patient report severe exertional fatigue & dyspnea?',
        expectedValue: true,
      },
      {
        symptomId: 'pale_conjunctiva',
        prompt: 'Is conjunctival / palmar pallor visibly prominent?',
        expectedValue: true,
      },
    ],
    conclusion: 'Severe Decompensated Anemia',
    severity: 'moderate',
    confidence: 0.91,
    treatment:
      'Packed red blood cell (PRBC) transfusion evaluation, IV iron sucrose, and serum ferritin workup.',
  },
  {
    id: 'R4_CLASSIC_DENGUE',
    conditionName: 'Classic Dengue Fever',
    premises: [
      {
        symptomId: 'high_fever',
        prompt: 'Does the patient have acute high fever (> 38.5°C)?',
        expectedValue: true,
      },
      {
        symptomId: 'joint_pain',
        prompt: 'Does patient experience severe retro-orbital headache & bone-break arthralgia?',
        expectedValue: true,
      },
      {
        symptomId: 'platelets_low',
        prompt: 'Is platelet count critically low (< 100,000 / μL)?',
        expectedValue: false,
      },
    ],
    conclusion: 'Uncomplicated Classical Dengue Fever',
    severity: 'moderate',
    confidence: 0.88,
    treatment:
      'Oral rehydration therapy, paracetamol (strict avoidance of NSAIDs/Aspirin), daily platelet monitoring.',
  },
  {
    id: 'R5_INFLUENZA',
    conditionName: 'Viral Influenza',
    premises: [
      {
        symptomId: 'high_fever',
        prompt: 'Does the patient have acute high fever (> 38.5°C)?',
        expectedValue: true,
      },
      {
        symptomId: 'cough',
        prompt: 'Is there persistent dry cough with pharyngeal erythema?',
        expectedValue: true,
      },
      {
        symptomId: 'platelets_low',
        prompt: 'Is platelet count critically low (< 100,000 / μL)?',
        expectedValue: false,
      },
    ],
    conclusion: 'Upper Respiratory Viral Influenza',
    severity: 'mild',
    confidence: 0.82,
    treatment:
      'Supportive antipyretics, adequate oral fluids, isolation, consider Oseltamivir if within 48h onset.',
  },
];

export function stepConsultation(
  answers: Record<string, boolean | string>,
  rules: DiagnosticRule[] = CLINICAL_RULES
): ConsultationState {
  // Check if any rule is already completely satisfied
  for (const rule of rules) {
    const isSatisfied = rule.premises.every((p) => {
      const ans = answers[p.symptomId];
      return ans !== undefined && ans === p.expectedValue;
    });

    if (isSatisfied) {
      const howExplanation: HowExplanation = {
        diagnosis: rule.conclusion,
        confidence: rule.confidence,
        firedRuleId: rule.id,
        justifications: rule.premises.map((p) => ({
          symptomPrompt: p.prompt,
          patientValue: String(answers[p.symptomId]),
        })),
      };

      return {
        answers,
        currentQuestion: null,
        activeHypothesis: rule.conditionName,
        whyExplanation: null,
        finalDiagnosis: {
          condition: rule.conclusion,
          severity: rule.severity,
          confidence: rule.confidence,
          treatment: rule.treatment,
          howExplanation,
        },
        completed: true,
      };
    }
  }

  // Find the first viable rule that is not yet refuted
  for (const rule of rules) {
    const isRefuted = rule.premises.some((p) => {
      const ans = answers[p.symptomId];
      return ans !== undefined && ans !== p.expectedValue;
    });

    if (!isRefuted) {
      // Find the first unasked premise in this viable rule
      const unasked = rule.premises.find((p) => answers[p.symptomId] === undefined);
      if (unasked) {
        const whyExplanation: WhyExplanation = {
          symptomId: unasked.symptomId,
          activeRuleId: rule.id,
          targetHypothesis: rule.conditionName,
          rationale: `I am currently testing hypothesis '${rule.conditionName}' using Rule ${rule.id}. Checking '${unasked.symptomId}' is required because if true, it supports ${rule.conclusion}.`,
        };

        return {
          answers,
          currentQuestion: {
            symptomId: unasked.symptomId,
            prompt: unasked.prompt,
            type: 'boolean',
          },
          activeHypothesis: rule.conditionName,
          whyExplanation,
          finalDiagnosis: null,
          completed: false,
        };
      }
    }
  }

  // All rules refuted or no more questions
  return {
    answers,
    currentQuestion: null,
    activeHypothesis: null,
    whyExplanation: null,
    finalDiagnosis: {
      condition: 'Non-Specific Febrile Presentation (No Rule Matched)',
      severity: 'mild',
      confidence: 0.5,
      treatment:
        'Order comprehensive metabolic panel, peripheral blood smear, and clinical reassessment in 24 hours.',
      howExplanation: {
        diagnosis: 'No clinical rule in the knowledge base was fully satisfied.',
        confidence: 0.5,
        firedRuleId: 'NONE',
        justifications: Object.entries(answers).map(([k, v]) => ({
          symptomPrompt: `Observed ${k}`,
          patientValue: String(v),
        })),
      },
    },
    completed: true,
  };
}

export function evaluateTransfusion(donor: BloodGroup, recipient: BloodGroup): TransfusionResult {
  // ABO Antigen breakdown
  const getAntigens = (g: BloodGroup) => {
    const base = g.slice(0, -1);
    const rh = g.endsWith('+');
    const antigens: string[] = [];
    if (base === 'A' || base === 'AB') antigens.push('A');
    if (base === 'B' || base === 'AB') antigens.push('B');
    if (rh) antigens.push('Rh(D)');
    return antigens;
  };

  const getRecipientAntibodies = (g: BloodGroup) => {
    const base = g.slice(0, -1);
    const rh = g.endsWith('+');
    const antibodies: string[] = [];
    if (base === 'O') antibodies.push('Anti-A', 'Anti-B');
    if (base === 'A') antibodies.push('Anti-B');
    if (base === 'B') antibodies.push('Anti-A');
    if (!rh) antibodies.push('Anti-Rh(D)'); // Rh- recipient antibodies attack Rh+ donor cells
    return antibodies;
  };

  const donorAntigens = getAntigens(donor);
  const recipientAntibodies = getRecipientAntibodies(recipient);

  // Incompatibility happens if donor red cells carry an antigen against which recipient has antibodies
  const clashed: string[] = [];
  if (donorAntigens.includes('A') && recipientAntibodies.includes('Anti-A'))
    clashed.push('Anti-A attacks A-antigen');
  if (donorAntigens.includes('B') && recipientAntibodies.includes('Anti-B'))
    clashed.push('Anti-B attacks B-antigen');
  if (donorAntigens.includes('Rh(D)') && recipientAntibodies.includes('Anti-Rh(D)'))
    clashed.push('Anti-D attacks Rh(D) positive cells');

  const isCompatible = clashed.length === 0;

  let explanation = '';
  if (isCompatible) {
    if (donor === 'O-') {
      explanation =
        'Transfusion safe. O- is the universal red blood cell donor because donor erythrocytes express neither A, B, nor Rh(D) surface antigens.';
    } else if (recipient === 'AB+') {
      explanation =
        'Transfusion safe. AB+ is the universal recipient because serum lacks Anti-A, Anti-B, and Anti-Rh antibodies.';
    } else {
      explanation = `Transfusion safe. Recipient antibodies (${recipientAntibodies.join(', ') || 'None'}) do not react against donor surface antigens (${donorAntigens.join(', ') || 'None'}).`;
    }
  } else {
    explanation = `FATAL INCOMPATIBILITY! Recipient antibodies will trigger acute intravascular hemolysis: ${clashed.join(', ')}.`;
  }

  return {
    donorGroup: donor,
    recipientGroup: recipient,
    isCompatible,
    explanation,
    antibodiesPresent: recipientAntibodies,
    antigensPresent: donorAntigens,
  };
}
