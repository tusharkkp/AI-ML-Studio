import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { validateKnowledgeBase } from '@/engines/expert/knowledge-base/engine';
import type { RuleDefinition } from '@/engines/expert/knowledge-base/types';

interface SystemBlock {
  id: string;
  name: string;
  role: string;
  dataFlow: string;
  whatIfMissing: string;
  color: string;
}

const SYSTEM_BLOCKS: SystemBlock[] = [
  {
    id: 'ui',
    name: 'User Interface',
    role: 'Presents questions to the user in natural language and captures symptoms, observations, or queries.',
    dataFlow: 'User ⇄ UI ⇄ Inference Engine / Working Memory',
    whatIfMissing: 'Users cannot interact with the system or provide case-specific input.',
    color: 'from-blue-500/20 to-blue-600/20 border-blue-500/40 text-blue-900 dark:text-blue-100',
  },
  {
    id: 'explanation',
    name: 'Explanation Facility',
    role: "Answers 'Why are you asking this?' (shows current goal rule) and 'How did you reach this diagnosis?' (shows derivation proof tree).",
    dataFlow: 'Inference Engine → Explanation Facility → UI',
    whatIfMissing:
      'System becomes an opaque black box. In high-stakes fields like medicine or avionics, experts refuse to trust unexplainable decisions.',
    color:
      'from-purple-500/20 to-purple-600/20 border-purple-500/40 text-purple-900 dark:text-purple-100',
  },
  {
    id: 'engine',
    name: 'Inference Engine',
    role: 'The processing brain. Executes forward or backward chaining to match rules in the KB against facts in Working Memory.',
    dataFlow: 'Knowledge Base + Working Memory ⇄ Inference Engine',
    whatIfMissing:
      'The system has static knowledge but zero ability to perform deduction or derive new truths.',
    color:
      'from-amber-500/20 to-amber-600/20 border-amber-500/40 text-amber-900 dark:text-amber-100',
  },
  {
    id: 'working-memory',
    name: 'Working Memory (Blackboard)',
    role: 'Dynamic storage for case-specific facts established during the current consultation session.',
    dataFlow: 'UI + Inference Engine ⇄ Working Memory',
    whatIfMissing:
      'The system has amnesia: it forgets answers immediately and cannot accumulate evidence across multi-step deductions.',
    color:
      'from-emerald-500/20 to-emerald-600/20 border-emerald-500/40 text-emerald-900 dark:text-emerald-100',
  },
  {
    id: 'knowledge-base',
    name: 'Knowledge Base (Rule Base)',
    role: 'Long-term repository of domain expertise represented as production rules (IF-THEN), frames, and semantic networks.',
    dataFlow: 'Knowledge Acquisition ⇄ Knowledge Base ⇄ Inference Engine',
    whatIfMissing:
      'The system has inference capability but no domain wisdom. Like a brilliant logician who knows zero medicine.',
    color: 'from-rose-500/20 to-rose-600/20 border-rose-500/40 text-rose-900 dark:text-rose-100',
  },
  {
    id: 'acquisition',
    name: 'Knowledge Acquisition Subsystem',
    role: 'Tools and elicitation protocols that allow Knowledge Engineers and Domain Experts to add, update, and validate rules.',
    dataFlow: 'Domain Expert + Knowledge Engineer → Acquisition Subsystem → Knowledge Base',
    whatIfMissing:
      'The Knowledge Acquisition Bottleneck: updating the system requires hardcoding changes directly into code, risking inconsistencies.',
    color:
      'from-indigo-500/20 to-indigo-600/20 border-indigo-500/40 text-indigo-900 dark:text-indigo-100',
  },
];

const PRESET_RULESETS: { id: string; name: string; rules: RuleDefinition[] }[] = [
  {
    id: 'clean-triage',
    name: 'Clean Clinical Rules (Valid)',
    rules: [
      {
        id: 'R1',
        name: 'Platelet Alert',
        premises: ['PlateletsLow', 'HighFever'],
        conclusion: 'DengueRisk',
      },
      {
        id: 'R2',
        name: 'Hematocrit Spike',
        premises: ['DengueRisk', 'HematocritHigh'],
        conclusion: 'SevereDengue',
      },
      { id: 'R3', name: 'Anemia Check', premises: ['HemoglobinLow'], conclusion: 'Anemia' },
    ],
  },
  {
    id: 'contradictory',
    name: 'Contradictory Rules (Knowledge Error)',
    rules: [
      {
        id: 'R1',
        name: 'Allow Transfusion',
        premises: ['TypeO_Donor', 'TypeA_Recipient'],
        conclusion: 'Compatible',
      },
      {
        id: 'R2',
        name: 'Deny Transfusion',
        premises: ['TypeO_Donor', 'TypeA_Recipient'],
        conclusion: '~Compatible',
      },
    ],
  },
  {
    id: 'circular',
    name: 'Circular Dependency (Loop Error)',
    rules: [
      { id: 'R1', name: 'Symptom A', premises: ['SyndromeX'], conclusion: 'SymptomY' },
      { id: 'R2', name: 'Symptom B', premises: ['SymptomY'], conclusion: 'SyndromeZ' },
      { id: 'R3', name: 'Symptom C', premises: ['SyndromeZ'], conclusion: 'SyndromeX' },
    ],
  },
];

export function ExpertSystemArchitectureLab() {
  const [selectedBlockId, setSelectedBlockId] = useState<string>('engine');
  const [activeRulesetId, setActiveRulesetId] = useState<string>('clean-triage');

  const activeRuleset =
    PRESET_RULESETS.find((r) => r.id === activeRulesetId) ?? PRESET_RULESETS[0]!;
  const selectedBlock = SYSTEM_BLOCKS.find((b) => b.id === selectedBlockId) ?? SYSTEM_BLOCKS[2]!;

  const validationReport = validateKnowledgeBase(activeRuleset.rules);

  return (
    <Card className="p-6 my-6 border-warm-200 dark:border-warm-800 bg-white dark:bg-warm-900/40">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-warm-200 dark:border-warm-800 pb-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-warm-500">
            Interactive Architecture & Knowledge Acquisition
          </span>
          <h3 className="text-xl font-bold text-warm-900 dark:text-warm-50">
            Anatomy of an Expert System
          </h3>
        </div>
        <Badge variant={validationReport.isValid ? 'success' : 'danger'}>
          {validationReport.isValid ? 'Knowledge Base Valid' : 'Knowledge Anomalies Detected'}
        </Badge>
      </div>

      {/* Subsystem Flow Grid */}
      <div className="mb-6">
        <label className="block text-xs font-semibold uppercase tracking-wider text-warm-500 mb-2">
          Click any component to inspect data flow &amp; failure modes:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SYSTEM_BLOCKS.map((block) => {
            const isSelected = selectedBlockId === block.id;
            return (
              <div
                key={block.id}
                onClick={() => setSelectedBlockId(block.id)}
                className={`p-4 rounded-xl border bg-gradient-to-br transition-all cursor-pointer ${
                  block.color
                } ${
                  isSelected
                    ? 'ring-2 ring-accent-primary ring-offset-2 dark:ring-offset-warm-950 scale-[1.02]'
                    : 'opacity-80 hover:opacity-100 hover:scale-[1.01]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm">{block.name}</span>
                  {isSelected && (
                    <Badge variant="unit" unit={1} size="sm">
                      Active
                    </Badge>
                  )}
                </div>
                <p className="text-xs line-clamp-2 opacity-90">{block.role}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Block Deep-Dive Card */}
      <Card className="p-4 mb-6 border-warm-200 dark:border-warm-800 bg-warm-50 dark:bg-warm-800/40">
        <div className="flex items-center justify-between border-b border-warm-200 dark:border-warm-700 pb-2 mb-3">
          <span className="font-bold text-sm text-warm-900 dark:text-warm-100">
            Component Deep-Dive: {selectedBlock.name}
          </span>
          <span className="text-xs font-mono text-warm-500">{selectedBlock.dataFlow}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <strong className="text-warm-700 dark:text-warm-300 block mb-1">
              Architectural Role:
            </strong>
            <p className="text-warm-600 dark:text-warm-400 leading-relaxed">{selectedBlock.role}</p>
          </div>
          <div>
            <strong className="text-rose-700 dark:text-rose-300 block mb-1">
              What Happens If Missing?
            </strong>
            <p className="text-warm-600 dark:text-warm-400 leading-relaxed">
              {selectedBlock.whatIfMissing}
            </p>
          </div>
        </div>
      </Card>

      {/* Knowledge Acquisition & Consistency Validator */}
      <div className="border-t border-warm-200 dark:border-warm-800 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <span className="text-xs uppercase font-bold text-warm-500">
              Knowledge Acquisition Subsystem
            </span>
            <h4 className="text-sm font-bold text-warm-900 dark:text-warm-100">
              Rule Base Consistency &amp; Anomaly Detection
            </h4>
          </div>
          <div className="flex gap-1.5">
            {PRESET_RULESETS.map((preset) => (
              <Button
                key={preset.id}
                size="sm"
                variant={activeRulesetId === preset.id ? 'primary' : 'outline'}
                onClick={() => setActiveRulesetId(preset.id)}
              >
                {preset.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Current Rules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-warm-500">Active Rule Definitions</span>
            {activeRuleset.rules.map((rule) => (
              <div
                key={rule.id}
                className="p-2 rounded border border-warm-200 dark:border-warm-800 bg-white dark:bg-warm-900 text-xs font-mono"
              >
                <strong>
                  {rule.id} ({rule.name}):
                </strong>{' '}
                IF {rule.premises.join(' ∧ ')} THEN {rule.conclusion}
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-warm-500">
              Elicitation Anomaly Report ({validationReport.anomalies.length} Found)
            </span>
            {validationReport.anomalies.length === 0 ? (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 rounded text-xs text-emerald-800 dark:text-emerald-200 font-medium">
                ✓ No contradictions, redundancies, or cycles detected. Knowledge base is consistent.
              </div>
            ) : (
              validationReport.anomalies.map((anom, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded border text-xs ${
                    anom.severity === 'error'
                      ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-100'
                      : anom.severity === 'warning'
                        ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-100'
                        : 'bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-100'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold mb-1">
                    <Badge variant={anom.severity === 'error' ? 'danger' : 'warning'} size="sm">
                      {anom.type}
                    </Badge>
                    <span>Rules: {anom.ruleIds.join(', ')}</span>
                  </div>
                  <p className="mb-1">{anom.message}</p>
                  <p className="text-[11px] opacity-80">
                    <strong>Suggestion:</strong> {anom.suggestion}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
