import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { stepConsultation, evaluateTransfusion } from '@/engines/expert/diagnosis/engine';
import type { BloodGroup, PatientProfile } from '@/engines/expert/diagnosis/types';

const PATIENT_PROFILES: PatientProfile[] = [
  {
    id: 'p101',
    name: 'Patient 101 (Acute Petechiae)',
    age: 28,
    gender: 'Female',
    observedSymptoms: { high_fever: true, platelets_low: true, petechial_rash: true },
    description:
      'Day 4 of acute 39.5°C fever with spontaneous gum bleeding and petechiae across lower limbs.',
  },
  {
    id: 'p102',
    name: 'Patient 102 (Septic Shock)',
    age: 62,
    gender: 'Male',
    observedSymptoms: { high_fever: true, high_wbc: true, hypotension: true },
    description:
      'Post-operative day 3, spiked 39.8°C fever, BP dropped to 82/50 mmHg, WBC 18,500 / μL.',
  },
  {
    id: 'p103',
    name: 'Patient 103 (Decompensated Anemia)',
    age: 34,
    gender: 'Female',
    observedSymptoms: { hemoglobin_low: true, chronic_fatigue: true, pale_conjunctiva: true },
    description:
      'Progressive exertional exhaustion over 3 months, severe palmar pallor, Hb 6.4 g/dL.',
  },
];

const BLOOD_GROUPS: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

export function MedicalDiagnosisLab() {
  const [activeTab, setActiveTab] = useState<'consultation' | 'transfusion'>('consultation');
  const [answers, setAnswers] = useState<Record<string, boolean | string>>({});
  const [showWhy, setShowWhy] = useState(false);
  const [showHow, setShowHow] = useState(false);

  // Transfusion state
  const [donor, setDonor] = useState<BloodGroup>('O-');
  const [recipient, setRecipient] = useState<BloodGroup>('A+');

  const consultation = stepConsultation(answers);
  const transfusionResult = evaluateTransfusion(donor, recipient);

  const loadPatientProfile = (profile: PatientProfile) => {
    setAnswers(profile.observedSymptoms);
    setShowWhy(false);
    setShowHow(true);
  };

  const resetConsultation = () => {
    setAnswers({});
    setShowWhy(false);
    setShowHow(false);
  };

  const handleAnswer = (val: boolean) => {
    if (!consultation.currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [consultation.currentQuestion!.symptomId]: val,
    }));
    setShowWhy(false);
  };

  return (
    <Card className="p-6 my-6 border-warm-200 dark:border-warm-800 bg-white dark:bg-warm-900/40 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-warm-200 dark:border-warm-800 pb-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-warm-500">
            Clinical Rule Engine &bull; Stanford MYCIN Inspired
          </span>
          <h3 className="text-xl font-bold text-warm-900 dark:text-warm-50">
            Medical Diagnostic Expert System
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={activeTab === 'consultation' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('consultation')}
          >
            Clinical Triage (Why / How)
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'transfusion' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('transfusion')}
          >
            Blood Transfusion Crossmatch
          </Button>
        </div>
      </div>

      {activeTab === 'consultation' ? (
        <div className="space-y-6">
          {/* Preset Patients */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-warm-500">
                Load Clinical Case Study:
              </label>
              <Button size="sm" variant="outline" onClick={resetConsultation}>
                Reset Consultation
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {PATIENT_PROFILES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => loadPatientProfile(p)}
                  className="p-3 text-left rounded-lg border border-warm-200 dark:border-warm-800 hover:border-warm-400 dark:hover:border-warm-600 bg-warm-50 dark:bg-warm-800/40 transition-colors"
                >
                  <div className="font-bold text-xs text-warm-900 dark:text-warm-100 mb-0.5">
                    {p.name}
                  </div>
                  <p className="text-[11px] text-warm-500 line-clamp-2">{p.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Consultation Dialog */}
          {!consultation.completed && consultation.currentQuestion && (
            <Card className="p-5 border-warm-300 dark:border-warm-700 bg-warm-50/70 dark:bg-warm-900/60">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-warm-500 uppercase tracking-wider">
                  Active Clinical Inquiry &bull; Investigating: {consultation.activeHypothesis}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowWhy(!showWhy)}
                  className="text-xs font-semibold text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700"
                >
                  {showWhy ? 'Hide Rationale' : '❓ Why are you asking this?'}
                </Button>
              </div>

              {/* "Why" Explanation Facility Card */}
              {showWhy && consultation.whyExplanation && (
                <div className="p-3 mb-4 rounded-lg bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs text-purple-900 dark:text-purple-200 leading-relaxed">
                  <div className="font-bold mb-1">
                    [Explanation Facility — &lsquo;Why&rsquo; Response]
                  </div>
                  {consultation.whyExplanation.rationale}
                </div>
              )}

              <h4 className="text-base font-bold text-warm-900 dark:text-warm-100 mb-4">
                {consultation.currentQuestion.prompt}
              </h4>

              <div className="flex items-center gap-3">
                <Button size="sm" variant="primary" onClick={() => handleAnswer(true)}>
                  Yes, Present
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleAnswer(false)}>
                  No, Absent
                </Button>
              </div>
            </Card>
          )}

          {/* Final Diagnosis Card */}
          {consultation.completed && consultation.finalDiagnosis && (
            <Card
              className={`p-5 border ${
                consultation.finalDiagnosis.severity === 'critical'
                  ? 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800'
                  : 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      consultation.finalDiagnosis.severity === 'critical' ? 'danger' : 'success'
                    }
                  >
                    {consultation.finalDiagnosis.severity.toUpperCase()}
                  </Badge>
                  <span className="text-xs font-semibold text-warm-600 dark:text-warm-400">
                    Confidence: {(consultation.finalDiagnosis.confidence * 100).toFixed(0)}%
                    Certainty Factor
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowHow(!showHow)}
                  className="text-xs font-semibold text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700"
                >
                  {showHow ? 'Hide Derivation' : '🔍 How did you diagnose this?'}
                </Button>
              </div>

              <h3 className="text-lg font-bold text-warm-950 dark:text-warm-50 mb-1">
                {consultation.finalDiagnosis.condition}
              </h3>
              <p className="text-xs text-warm-700 dark:text-warm-300 mb-3">
                <strong>Recommended Treatment:</strong> {consultation.finalDiagnosis.treatment}
              </p>

              {/* "How" Explanation Facility Proof Tree */}
              {showHow && (
                <div className="p-4 mt-3 bg-white dark:bg-warm-900 border border-warm-200 dark:border-warm-700 rounded-lg text-xs space-y-2">
                  <div className="font-bold text-blue-900 dark:text-blue-200">
                    [Explanation Facility — &lsquo;How&rsquo; Proof Tree]
                  </div>
                  <p className="text-warm-600 dark:text-warm-400">
                    Conclusion was derived via Rule{' '}
                    <strong>{consultation.finalDiagnosis.howExplanation.firedRuleId}</strong> after
                    satisfying all premises:
                  </p>
                  <ul className="space-y-1.5 pl-4 list-disc font-mono">
                    {consultation.finalDiagnosis.howExplanation.justifications.map((j, idx) => (
                      <li key={idx} className="text-warm-700 dark:text-warm-300">
                        {j.symptomPrompt} &rarr; <strong>{j.patientValue.toUpperCase()}</strong>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          )}

          {/* Current Working Memory Blackboard */}
          <div className="p-3 bg-warm-100/60 dark:bg-warm-800/40 rounded-lg border border-warm-200 dark:border-warm-800 text-xs">
            <span className="font-bold text-warm-700 dark:text-warm-300 block mb-1">
              Working Memory (Current Consultation State):
            </span>
            <div className="flex flex-wrap gap-2">
              {Object.keys(answers).length === 0 ? (
                <span className="text-warm-500 italic">No symptoms entered yet.</span>
              ) : (
                Object.entries(answers).map(([k, v]) => (
                  <Badge key={k} variant={v ? 'success' : 'default'} size="sm">
                    {k}: {String(v)}
                  </Badge>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Transfusion Crossmatch View */
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-warm-500 mb-2">
                Donor Red Blood Cell Group:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {BLOOD_GROUPS.map((bg) => (
                  <button
                    key={bg}
                    onClick={() => setDonor(bg)}
                    className={`py-2 px-3 rounded-lg border font-mono font-bold text-sm transition-colors ${
                      donor === bg
                        ? 'bg-rose-100 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-100 ring-2 ring-rose-500'
                        : 'bg-warm-50 dark:bg-warm-800 border-warm-200 dark:border-warm-700 text-warm-700 dark:text-warm-300'
                    }`}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-warm-500 mb-2">
                Recipient Patient Blood Group:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {BLOOD_GROUPS.map((bg) => (
                  <button
                    key={bg}
                    onClick={() => setRecipient(bg)}
                    className={`py-2 px-3 rounded-lg border font-mono font-bold text-sm transition-colors ${
                      recipient === bg
                        ? 'bg-blue-100 dark:bg-blue-950/60 border-blue-500 text-blue-900 dark:text-blue-100 ring-2 ring-blue-500'
                        : 'bg-warm-50 dark:bg-warm-800 border-warm-200 dark:border-warm-700 text-warm-700 dark:text-warm-300'
                    }`}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Crossmatch Compatibility Outcome */}
          <div
            className={`p-5 rounded-xl border ${
              transfusionResult.isCompatible
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-100'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={transfusionResult.isCompatible ? 'success' : 'danger'}>
                {transfusionResult.isCompatible ? 'CROSSMATCH COMPATIBLE' : 'FATAL INCOMPATIBILITY'}
              </Badge>
              <span className="text-xs font-bold font-mono">
                {donor} (Donor) &rarr; {recipient} (Recipient)
              </span>
            </div>
            <p className="text-sm font-medium mb-3">{transfusionResult.explanation}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs border-t border-warm-200/60 dark:border-warm-700/60 pt-3">
              <div>
                <strong>Donor Erythrocyte Antigens:</strong>{' '}
                {transfusionResult.antigensPresent.length > 0
                  ? transfusionResult.antigensPresent.join(', ')
                  : 'None (Universal Expression)'}
              </div>
              <div>
                <strong>Recipient Serum Antibodies:</strong>{' '}
                {transfusionResult.antibodiesPresent.length > 0
                  ? transfusionResult.antibodiesPresent.join(', ')
                  : 'None (Universal Recipient)'}
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
