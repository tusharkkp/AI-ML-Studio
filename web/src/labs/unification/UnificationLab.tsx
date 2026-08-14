import { useState, useId } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { runUnification } from '@/engines/logic/unify/engine';
import type { UnifyResult } from '@/engines/logic/unify/types';

interface Preset {
  id: string;
  name: string;
  term1: string;
  term2: string;
  description: string;
}

const PRESETS: Preset[] = [
  {
    id: 'family-tree',
    name: 'Prolog Family Tree (FamilyTree.pl)',
    term1: 'Parent(?x, Bob)',
    term2: 'Parent(Pam, ?y)',
    description: 'Binds ?x to Pam and ?y to Bob, yielding unified fact Parent(Pam, Bob).',
  },
  {
    id: 'nested-compound',
    name: 'Nested Functions & Arguments',
    term1: 'Knows(John, f(?x))',
    term2: 'Knows(?y, f(Mary))',
    description: 'Recursively unifies functor arguments across compound terms.',
  },
  {
    id: 'occurs-check-trap',
    name: 'Occurs-Check Trap (Make It Fail)',
    term1: '?x',
    term2: 'f(?x)',
    description: 'Fails because ?x occurs inside f(?x). Prevents infinite cyclic terms.',
  },
  {
    id: 'constant-clash',
    name: 'Constant Clash (Failure)',
    term1: 'Parent(John, Bob)',
    term2: 'Parent(Mary, Bob)',
    description: 'Fails because constant John cannot be unified with constant Mary.',
  },
  {
    id: 'shared-variable',
    name: 'Identical Subterm Constraint',
    term1: 'Likes(?x, ?x)',
    term2: 'Likes(?y, IceCream)',
    description: 'Requires ?x to equal both ?y and IceCream, resolving ?x to IceCream.',
  },
];

export function UnificationLab() {
  const [term1Input, setTerm1Input] = useState('Parent(?x, Bob)');
  const [term2Input, setTerm2Input] = useState('Parent(Pam, ?y)');
  const [currentStep, setCurrentStep] = useState<number | null>(null);

  const term1Id = useId();
  const term2Id = useId();

  let result: UnifyResult | null = null;
  let parseError: string | null = null;

  try {
    result = runUnification(term1Input, term2Input);
  } catch (err) {
    parseError = err instanceof Error ? err.message : String(err);
  }

  const applyPreset = (preset: Preset) => {
    setTerm1Input(preset.term1);
    setTerm2Input(preset.term2);
    setCurrentStep(null);
  };

  const steps = result?.steps ?? [];
  const activeStep = currentStep !== null && steps[currentStep] ? steps[currentStep] : null;

  return (
    <Card className="p-6 my-6 border-warm-200 dark:border-warm-800 bg-white dark:bg-warm-900/40 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-warm-200 dark:border-warm-800 pb-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-warm-500">
            First-Order Logic Engine
          </span>
          <h3 className="text-xl font-bold text-warm-900 dark:text-warm-50">
            Robinson Unification & Occurs-Check Workbench
          </h3>
        </div>
        <Badge variant={result?.success ? 'success' : result ? 'danger' : 'default'}>
          {result?.success ? 'Unified Successfully' : result ? 'Unification Failed' : 'Ready'}
        </Badge>
      </div>

      {/* Presets */}
      <div className="mb-6">
        <label className="block text-xs font-semibold uppercase tracking-wider text-warm-500 mb-2">
          Curriculum Presets & Edge Cases
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => applyPreset(p)}
              className="px-3 py-1.5 text-xs rounded-md border border-warm-200 dark:border-warm-800 hover:border-warm-400 dark:hover:border-warm-600 bg-warm-50 dark:bg-warm-800/40 text-warm-700 dark:text-warm-300 font-medium transition-colors text-left"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label
            htmlFor={term1Id}
            className="block text-sm font-semibold text-warm-700 dark:text-warm-300 mb-1"
          >
            Term 1{' '}
            <span className="text-xs text-warm-500 font-normal">(Variables prefix with ?)</span>
          </label>
          <input
            id={term1Id}
            type="text"
            value={term1Input}
            onChange={(e) => {
              setTerm1Input(e.target.value);
              setCurrentStep(null);
            }}
            className="w-full px-3 py-2 rounded-lg border border-warm-300 dark:border-warm-700 bg-white dark:bg-warm-900 text-warm-900 dark:text-warm-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary"
            placeholder="e.g. Parent(?x, Bob)"
          />
        </div>

        <div>
          <label
            htmlFor={term2Id}
            className="block text-sm font-semibold text-warm-700 dark:text-warm-300 mb-1"
          >
            Term 2{' '}
            <span className="text-xs text-warm-500 font-normal">(Variables prefix with ?)</span>
          </label>
          <input
            id={term2Id}
            type="text"
            value={term2Input}
            onChange={(e) => {
              setTerm2Input(e.target.value);
              setCurrentStep(null);
            }}
            className="w-full px-3 py-2 rounded-lg border border-warm-300 dark:border-warm-700 bg-white dark:bg-warm-900 text-warm-900 dark:text-warm-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary"
            placeholder="e.g. Parent(Pam, ?y)"
          />
        </div>
      </div>

      {parseError && (
        <div className="p-3 mb-6 bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
          <strong>Parse Error:</strong> {parseError}
        </div>
      )}

      {/* Outcome Banner */}
      {result && !parseError && (
        <div
          className={`p-4 mb-6 rounded-lg border ${
            result.success
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
              : 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-100'
          }`}
        >
          {result.success ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="success">Most General Unifier (MGU) Found</Badge>
                <span className="text-xs font-semibold">
                  Resolved in {result.steps.length} atomic step(s)
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span>
                  <strong>Substitution &theta;:</strong>{' '}
                  <code className="bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded text-xs font-mono">
                    {Object.keys(result.mguFormatted).length === 0
                      ? '{} (Identical)'
                      : Object.entries(result.mguFormatted)
                          .map(([v, val]) => `${v} ↦ ${val}`)
                          .join(', ')}
                  </code>
                </span>
                <span>&bull;</span>
                <span>
                  <strong>Unified Term:</strong>{' '}
                  <code className="bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded text-xs font-mono">
                    {result.unifiedTermFormatted}
                  </code>
                </span>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="danger">Unification Impossible</Badge>
              </div>
              <p className="text-sm font-medium">{result.failureReason}</p>
            </div>
          )}
        </div>
      )}

      {/* Step Stepper */}
      {steps.length > 0 && !parseError && (
        <div className="border border-warm-200 dark:border-warm-800 rounded-lg p-4 bg-warm-50 dark:bg-warm-800/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-warm-500">
              Unification Step Trace ({steps.length} Steps)
            </span>
            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                variant="outline"
                disabled={currentStep === null || currentStep === 0}
                onClick={() =>
                  setCurrentStep((prev) => (prev !== null ? Math.max(0, prev - 1) : 0))
                }
              >
                &larr; Prev
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={currentStep !== null && currentStep >= steps.length - 1}
                onClick={() =>
                  setCurrentStep((prev) =>
                    prev !== null ? Math.min(steps.length - 1, prev + 1) : 0
                  )
                }
              >
                Next &rarr;
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {steps.map((st, idx) => {
              const isSelected =
                (currentStep === null && idx === steps.length - 1) || currentStep === idx;
              return (
                <div
                  key={st.stepIndex}
                  onClick={() => setCurrentStep(idx)}
                  className={`p-3 rounded border text-xs cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-white dark:bg-warm-900 border-accent-primary ring-1 ring-accent-primary shadow-sm'
                      : 'bg-warm-100/50 dark:bg-warm-800/50 border-warm-200 dark:border-warm-700 hover:bg-white dark:hover:bg-warm-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-warm-800 dark:text-warm-200">
                      Step {st.stepIndex}: {st.term1} &harr; {st.term2}
                    </span>
                    {st.isFailure ? (
                      <Badge variant="danger" size="sm">
                        Failure
                      </Badge>
                    ) : (
                      <span className="font-mono text-[11px] text-warm-500">
                        &theta; = {JSON.stringify(st.substitutionAfter)}
                      </span>
                    )}
                  </div>
                  <p className="text-warm-600 dark:text-warm-400 font-sans">{st.action}</p>
                </div>
              );
            })}
          </div>

          {activeStep && (
            <div className="mt-4 p-3 bg-white dark:bg-warm-900 border border-warm-200 dark:border-warm-800 rounded text-xs font-mono">
              <div className="text-warm-500 uppercase text-[10px] font-bold mb-1">
                Active Step Detail
              </div>
              <div>
                <strong>Current Subterms:</strong> {activeStep.term1} vs {activeStep.term2}
              </div>
              <div className="mt-1">
                <strong>Current Substitution Accumulator:</strong>{' '}
                {Object.keys(activeStep.substitutionAfter).length === 0
                  ? 'Empty ∅'
                  : Object.entries(activeStep.substitutionAfter)
                      .map(([k, v]) => `${k} ↦ ${v}`)
                      .join(', ')}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
