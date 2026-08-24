import { useState, useId } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { runForwardChaining, runBackwardChaining } from '@/engines/rules/chaining/engine';
import type { HornRule, ChainingStep } from '@/engines/rules/chaining/types';

interface PresetKB {
  id: string;
  name: string;
  rules: HornRule[];
  availableFacts: string[];
  defaultInitialFacts: string[];
  defaultGoal: string;
  description: string;
}

const PRESET_KBS: PresetKB[] = [
  {
    id: 'animal-taxonomy',
    name: 'Animal Classification (Taxonomy)',
    rules: [
      { id: 'R1', premises: ['HasFeathers'], conclusion: 'Bird' },
      { id: 'R2', premises: ['Bird', 'CanFly'], conclusion: 'FlyingBird' },
      { id: 'R3', premises: ['FlyingBird', 'EatsFish'], conclusion: 'Pelican' },
      { id: 'R4', premises: ['FlyingBird', 'PreyHunter'], conclusion: 'Eagle' },
      { id: 'R5', premises: ['HasFur', 'GivesMilk'], conclusion: 'Mammal' },
      { id: 'R6', premises: ['Mammal', 'Carnivore', 'HasStripes'], conclusion: 'Tiger' },
    ],
    availableFacts: [
      'HasFeathers',
      'CanFly',
      'EatsFish',
      'PreyHunter',
      'HasFur',
      'GivesMilk',
      'Carnivore',
      'HasStripes',
    ],
    defaultInitialFacts: ['HasFeathers', 'CanFly', 'PreyHunter'],
    defaultGoal: 'Eagle',
    description:
      'Classifies species bottom-up from observations or proves a target hypothesis top-down.',
  },
  {
    id: 'medical-triage',
    name: 'Medical Diagnostic Triage',
    rules: [
      { id: 'R1', premises: ['HighFever', 'Cough'], conclusion: 'RespiratoryInfection' },
      {
        id: 'R2',
        premises: ['RespiratoryInfection', 'ShortnessOfBreath'],
        conclusion: 'PneumoniaRisk',
      },
      { id: 'R3', premises: ['RespiratoryInfection', 'Rash'], conclusion: 'MeaslesRisk' },
      { id: 'R4', premises: ['PneumoniaRisk', 'Elderly'], conclusion: 'EmergencyHospitalize' },
    ],
    availableFacts: ['HighFever', 'Cough', 'ShortnessOfBreath', 'Rash', 'Elderly'],
    defaultInitialFacts: ['HighFever', 'Cough', 'ShortnessOfBreath'],
    defaultGoal: 'PneumoniaRisk',
    description: 'Early expert system triage determining risk factors from reported symptoms.',
  },
  {
    id: 'fraud-detection',
    name: 'Banking Fraud Sentinel',
    rules: [
      { id: 'R1', premises: ['ForeignIP', 'HighAmount'], conclusion: 'SuspiciousTransaction' },
      { id: 'R2', premises: ['SuspiciousTransaction', 'NewDevice'], conclusion: 'RequiresOTP' },
      { id: 'R3', premises: ['RequiresOTP', 'OTPFailed3x'], conclusion: 'FreezeAccount' },
    ],
    availableFacts: ['ForeignIP', 'HighAmount', 'NewDevice', 'OTPFailed3x'],
    defaultInitialFacts: ['ForeignIP', 'HighAmount', 'NewDevice'],
    defaultGoal: 'RequiresOTP',
    description: 'Production financial rule engine evaluating transaction authorization.',
  },
];

export function ChainingLab() {
  const [activeKb, setActiveKb] = useState<PresetKB>(PRESET_KBS[0]!);
  const [mode, setMode] = useState<'FORWARD' | 'BACKWARD'>('FORWARD');
  const [selectedFacts, setSelectedFacts] = useState<string[]>(PRESET_KBS[0]!.defaultInitialFacts);
  const [targetGoal, setTargetGoal] = useState<string>(PRESET_KBS[0]!.defaultGoal);
  const [currentStep, setCurrentStep] = useState<number | null>(null);

  const goalId = useId();

  const handlePresetChange = (kb: PresetKB) => {
    setActiveKb(kb);
    setSelectedFacts(kb.defaultInitialFacts);
    setTargetGoal(kb.defaultGoal);
    setCurrentStep(null);
  };

  const toggleFact = (fact: string) => {
    setSelectedFacts((prev) =>
      prev.includes(fact) ? prev.filter((f) => f !== fact) : [...prev, fact]
    );
    setCurrentStep(null);
  };

  // Run the selected engine
  const fcResult =
    mode === 'FORWARD' ? runForwardChaining(activeKb.rules, selectedFacts, targetGoal) : null;
  const bcResult =
    mode === 'BACKWARD' ? runBackwardChaining(activeKb.rules, selectedFacts, targetGoal) : null;

  const steps: ChainingStep[] =
    mode === 'FORWARD' ? (fcResult?.steps ?? []) : (bcResult?.steps ?? []);
  const goalSuccess = mode === 'FORWARD' ? fcResult?.goalReached : bcResult?.goalProved;

  return (
    <Card className="p-6 my-6 border-warm-200 dark:border-warm-800 bg-white dark:bg-warm-900/40">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-warm-200 dark:border-warm-800 pb-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-warm-500">
            Inference Engine Simulation
          </span>
          <h3 className="text-xl font-bold text-warm-900 dark:text-warm-50">
            Forward vs Backward Chaining Workbench
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={mode === 'FORWARD' ? 'primary' : 'outline'}
            onClick={() => {
              setMode('FORWARD');
              setCurrentStep(null);
            }}
          >
            Forward Chaining (Data-Driven)
          </Button>
          <Button
            size="sm"
            variant={mode === 'BACKWARD' ? 'primary' : 'outline'}
            onClick={() => {
              setMode('BACKWARD');
              setCurrentStep(null);
            }}
          >
            Backward Chaining (Goal-Driven)
          </Button>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="mb-6">
        <label className="block text-xs font-semibold uppercase tracking-wider text-warm-500 mb-2">
          Knowledge Base Domain
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESET_KBS.map((kb) => (
            <button
              key={kb.id}
              onClick={() => handlePresetChange(kb)}
              className={`px-3 py-1.5 text-xs rounded-md border font-medium transition-colors text-left ${
                activeKb.id === kb.id
                  ? 'bg-accent-primary/10 border-accent-primary text-accent-primary dark:bg-accent-primary/20'
                  : 'bg-warm-50 dark:bg-warm-800/40 border-warm-200 dark:border-warm-800 text-warm-700 dark:text-warm-300'
              }`}
            >
              {kb.name}
            </button>
          ))}
        </div>
      </div>

      {/* Domain Rules & Fact Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
        {/* Rules */}
        <div className="md:col-span-6 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-warm-500">
            Horn Clause Knowledge Base ({activeKb.rules.length} Rules)
          </span>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {activeKb.rules.map((r) => (
              <div
                key={r.id}
                className="p-2 rounded border border-warm-200 dark:border-warm-800 bg-warm-50 dark:bg-warm-800/40 text-xs font-mono flex items-center justify-between"
              >
                <span>
                  <strong className="text-accent-primary">{r.id}:</strong> {r.premises.join(' ∧ ')}{' '}
                  &rarr; {r.conclusion}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Fact Toggles and Goal */}
        <div className="md:col-span-6 space-y-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-warm-500 block mb-2">
              Assert Ground Facts (Initial Data)
            </span>
            <div className="flex flex-wrap gap-1.5">
              {activeKb.availableFacts.map((fact) => {
                const isSelected = selectedFacts.includes(fact);
                return (
                  <button
                    key={fact}
                    onClick={() => toggleFact(fact)}
                    className={`px-2.5 py-1 rounded text-xs font-mono font-medium border transition-colors ${
                      isSelected
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-400 text-emerald-900 dark:text-emerald-200'
                        : 'bg-warm-100 dark:bg-warm-800 border-warm-300 dark:border-warm-700 text-warm-600 dark:text-warm-400'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {fact}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label
              htmlFor={goalId}
              className="block text-xs font-semibold uppercase tracking-wider text-warm-500 mb-1"
            >
              Query / Hypothesis Goal
            </label>
            <input
              id={goalId}
              type="text"
              value={targetGoal}
              onChange={(e) => {
                setTargetGoal(e.target.value);
                setCurrentStep(null);
              }}
              className="w-full px-3 py-1.5 rounded-lg border border-warm-300 dark:border-warm-700 bg-white dark:bg-warm-900 text-warm-900 dark:text-warm-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary"
              placeholder="e.g. Eagle"
            />
          </div>
        </div>
      </div>

      {/* Outcome Banner */}
      <div
        className={`p-4 mb-6 rounded-lg border flex items-center justify-between gap-3 ${
          goalSuccess
            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
            : 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-100'
        }`}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={goalSuccess ? 'success' : 'warning'}>
              {goalSuccess
                ? `Hypothesis '${targetGoal}' PROVED`
                : `Hypothesis '${targetGoal}' NOT Entailed`}
            </Badge>
            <span className="text-xs font-semibold">
              Mode: {mode === 'FORWARD' ? 'Data-Driven Forward' : 'Goal-Driven Backward'}
            </span>
          </div>
          <p className="text-xs">
            {mode === 'FORWARD'
              ? `Forward chaining derived ${fcResult?.derivedFacts.length} total facts and fired ${fcResult?.rulesFired.length} rules.`
              : goalSuccess
                ? `Backward chaining successfully found a closed proof tree back to ground facts.`
                : `Backward chaining exhausted all candidate rules without finding complete supporting facts.`}
          </p>
        </div>
      </div>

      {/* Trace Stepper */}
      <div className="border border-warm-200 dark:border-warm-800 rounded-lg p-4 bg-warm-50 dark:bg-warm-800/30">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-warm-500">
            Execution Trace ({steps.length} Steps)
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant="outline"
              disabled={currentStep === null || currentStep === 0}
              onClick={() => setCurrentStep((prev) => (prev !== null ? Math.max(0, prev - 1) : 0))}
            >
              &larr; Prev
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={currentStep !== null && currentStep >= steps.length - 1}
              onClick={() =>
                setCurrentStep((prev) => (prev !== null ? Math.min(steps.length - 1, prev + 1) : 0))
              }
            >
              Next &rarr;
            </Button>
          </div>
        </div>

        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {steps.map((st, idx) => {
            const isSelected =
              (currentStep === null && idx === steps.length - 1) || currentStep === idx;
            return (
              <div
                key={st.stepIndex}
                onClick={() => setCurrentStep(idx)}
                className={`p-2.5 rounded border text-xs cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-white dark:bg-warm-900 border-accent-primary ring-1 ring-accent-primary'
                    : 'bg-warm-100/50 dark:bg-warm-800/50 border-warm-200 dark:border-warm-700 hover:bg-white dark:hover:bg-warm-800'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-bold text-warm-800 dark:text-warm-200">
                    Step {st.stepIndex}: {st.activeItem}
                  </span>
                  {st.isSuccess && (
                    <Badge variant="success" size="sm">
                      Derived
                    </Badge>
                  )}
                </div>
                <p className="text-warm-600 dark:text-warm-400 font-sans">{st.action}</p>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-warm-500 font-mono">
                  <span>Known: [{st.knownFacts.join(', ')}]</span>
                  <span>&bull;</span>
                  <span>
                    {mode === 'FORWARD' ? 'Agenda' : 'Stack'}: [{st.agendaOrStack.join(', ')}]
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
