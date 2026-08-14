import { useState, useId } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { generateTruthTable, checkEntailment } from '@/engines/logic/truth-table/engine';
import type { TruthTableResult, EntailmentResult } from '@/engines/logic/truth-table/types';

interface Preset {
  id: string;
  name: string;
  mode: 'table' | 'entailment';
  formula?: string;
  premises?: string[];
  conclusion?: string;
  description: string;
}

const PRESETS: Preset[] = [
  {
    id: 'modus-ponens',
    name: 'Modus Ponens (Valid)',
    mode: 'entailment',
    premises: ['P', 'P -> Q'],
    conclusion: 'Q',
    description:
      'If P is true and P implies Q, then Q MUST be true. Fundamental rule of inference.',
  },
  {
    id: 'affirming-consequent',
    name: 'Affirming the Consequent (Fallacy)',
    mode: 'entailment',
    premises: ['Q', 'P -> Q'],
    conclusion: 'P',
    description: 'Fallacy: knowing the conclusion Q does NOT prove the premise P was the cause.',
  },
  {
    id: 'wumpus-pit',
    name: 'Wumpus World (AI Deduction)',
    mode: 'entailment',
    premises: ['B11 <-> (P12 | P21)', '~B11'],
    conclusion: '~P12',
    description:
      'If Breeze in (1,1) iff Pit in (1,2) or (2,1), and no Breeze, then (1,2) has no Pit.',
  },
  {
    id: 'de-morgan',
    name: "De Morgan's Equivalence",
    mode: 'table',
    formula: '~(P & Q) <-> (~P | ~Q)',
    description: 'Tautology: negation of conjunction equals disjunction of negations.',
  },
  {
    id: 'excluded-middle',
    name: 'Law of Excluded Middle',
    mode: 'table',
    formula: 'P | ~P',
    description: 'Tautology: any proposition is either true or false.',
  },
  {
    id: 'contradiction',
    name: 'Contradiction Example',
    mode: 'table',
    formula: 'P & ~P',
    description:
      'Unsatisfiable formula: impossible for any world to make both true simultaneously.',
  },
];

export function TruthTableLab() {
  const [mode, setMode] = useState<'table' | 'entailment'>('entailment');
  const [formulaInput, setFormulaInput] = useState('P -> (Q | R)');
  const [premisesInput, setPremisesInput] = useState('P, P -> Q');
  const [conclusionInput, setConclusionInput] = useState('Q');
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  const formulaId = useId();
  const premisesId = useId();
  const conclusionId = useId();

  // Compute table or entailment
  let tableResult: TruthTableResult | null = null;
  let entailmentResult: EntailmentResult | null = null;
  let parseError: string | null = null;

  try {
    if (mode === 'table') {
      tableResult = generateTruthTable(formulaInput);
    } else {
      const premises = premisesInput
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      entailmentResult = checkEntailment(premises, conclusionInput.trim());
    }
  } catch (err) {
    parseError = err instanceof Error ? err.message : String(err);
  }

  const applyPreset = (preset: Preset) => {
    setMode(preset.mode);
    if (preset.mode === 'table' && preset.formula) {
      setFormulaInput(preset.formula);
    } else if (preset.premises && preset.conclusion) {
      setPremisesInput(preset.premises.join(', '));
      setConclusionInput(preset.conclusion);
    }
    setSelectedRow(null);
  };

  const insertSymbol = (sym: string, target: 'formula' | 'premises' | 'conclusion') => {
    if (target === 'formula') setFormulaInput((prev) => prev + sym);
    else if (target === 'premises') setPremisesInput((prev) => prev + sym);
    else setConclusionInput((prev) => prev + sym);
  };

  return (
    <Card className="p-6 my-6 border-warm-200 dark:border-warm-800 bg-white dark:bg-warm-900/40 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-warm-200 dark:border-warm-800 pb-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-warm-500">
            Interactive Logic Engine
          </span>
          <h3 className="text-xl font-bold text-warm-900 dark:text-warm-50">
            Propositional Reasoning & Entailment Workbench
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={mode === 'entailment' ? 'primary' : 'outline'}
            onClick={() => setMode('entailment')}
          >
            Entailment (KB ⊨ α)
          </Button>
          <Button
            size="sm"
            variant={mode === 'table' ? 'primary' : 'outline'}
            onClick={() => setMode('table')}
          >
            Formula Truth Table
          </Button>
        </div>
      </div>

      {/* Presets */}
      <div className="mb-6">
        <label className="block text-xs font-semibold uppercase tracking-wider text-warm-500 mb-2">
          Curriculum Presets & Fallacy Tests
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
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
        {mode === 'table' ? (
          <div className="md:col-span-12">
            <label
              htmlFor={formulaId}
              className="block text-sm font-semibold text-warm-700 dark:text-warm-300 mb-1"
            >
              Propositional Formula
            </label>
            <div className="flex gap-2">
              <input
                id={formulaId}
                type="text"
                value={formulaInput}
                onChange={(e) => setFormulaInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-warm-300 dark:border-warm-700 bg-white dark:bg-warm-900 text-warm-900 dark:text-warm-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary"
                placeholder="e.g. ~(P & Q) <-> (~P | ~Q)"
              />
              <div className="flex gap-1">
                {['~', '&', '|', '->', '<->', '(', ')'].map((sym) => (
                  <button
                    key={sym}
                    onClick={() => insertSymbol(sym, 'formula')}
                    className="px-2 py-1 bg-warm-100 dark:bg-warm-800 hover:bg-warm-200 dark:hover:bg-warm-700 text-warm-800 dark:text-warm-200 rounded text-xs font-mono font-bold"
                  >
                    {sym}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="md:col-span-8">
              <label
                htmlFor={premisesId}
                className="block text-sm font-semibold text-warm-700 dark:text-warm-300 mb-1"
              >
                Knowledge Base Premises (comma-separated)
              </label>
              <div className="flex gap-2">
                <input
                  id={premisesId}
                  type="text"
                  value={premisesInput}
                  onChange={(e) => setPremisesInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-warm-300 dark:border-warm-700 bg-white dark:bg-warm-900 text-warm-900 dark:text-warm-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  placeholder="e.g. P, P -> Q"
                />
                <div className="flex gap-1">
                  {['~', '&', '|', '->', '<->'].map((sym) => (
                    <button
                      key={sym}
                      onClick={() => insertSymbol(sym, 'premises')}
                      className="px-2 py-1 bg-warm-100 dark:bg-warm-800 hover:bg-warm-200 dark:hover:bg-warm-700 text-warm-800 dark:text-warm-200 rounded text-xs font-mono font-bold"
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-4">
              <label
                htmlFor={conclusionId}
                className="block text-sm font-semibold text-warm-700 dark:text-warm-300 mb-1"
              >
                Candidate Query α
              </label>
              <div className="flex gap-2">
                <input
                  id={conclusionId}
                  type="text"
                  value={conclusionInput}
                  onChange={(e) => setConclusionInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-warm-300 dark:border-warm-700 bg-white dark:bg-warm-900 text-warm-900 dark:text-warm-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  placeholder="e.g. Q"
                />
              </div>
            </div>
          </>
        )}
      </div>

      {parseError && (
        <div className="p-3 mb-6 bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
          <strong>Syntax Error:</strong> {parseError}
        </div>
      )}

      {/* Outcome Banner */}
      {entailmentResult && !parseError && (
        <div
          className={`p-4 mb-6 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            entailmentResult.isEntailed
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
              : 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-100'
          }`}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={entailmentResult.isEntailed ? 'success' : 'danger'}>
                {entailmentResult.isEntailed
                  ? 'KB ⊨ α Valid Entailment'
                  : 'KB ⊭ α Entailment Fails'}
              </Badge>
              <span className="text-xs font-semibold text-warm-600 dark:text-warm-400">
                KB Models: {entailmentResult.kbModelsCount} / {entailmentResult.rows.length} worlds
              </span>
            </div>
            <p className="text-sm">{entailmentResult.explanation}</p>
          </div>
          {entailmentResult.counterExamples.length > 0 && (
            <Badge variant="warning" className="shrink-0 self-start sm:self-auto">
              {entailmentResult.counterExamples.length} Countermodel(s)
            </Badge>
          )}
        </div>
      )}

      {tableResult && !parseError && (
        <div className="p-4 mb-6 rounded-lg border border-warm-200 dark:border-warm-800 bg-warm-50 dark:bg-warm-800/30 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase text-warm-500">Classification</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-lg font-bold capitalize text-warm-900 dark:text-warm-100">
                {tableResult.classification}
              </span>
              <Badge
                variant={
                  tableResult.classification === 'tautology'
                    ? 'success'
                    : tableResult.classification === 'contradiction'
                      ? 'danger'
                      : 'default'
                }
              >
                {tableResult.satisfyingCount} of {tableResult.totalRows} models true
              </Badge>
            </div>
          </div>
          <span className="text-xs font-mono text-warm-600 dark:text-warm-400">
            Normalized: {tableResult.normalizedFormula}
          </span>
        </div>
      )}

      {/* Truth Table Display */}
      {((tableResult && tableResult.rows.length > 0) ||
        (entailmentResult && entailmentResult.rows.length > 0)) && (
        <div className="overflow-x-auto border border-warm-200 dark:border-warm-800 rounded-lg">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-warm-100 dark:bg-warm-800 text-warm-700 dark:text-warm-300 border-b border-warm-200 dark:border-warm-700">
              <tr>
                <th className="py-2.5 px-3 w-12 text-center">Row</th>
                {mode === 'table' &&
                  tableResult?.variables.map((v) => (
                    <th
                      key={v}
                      className="py-2.5 px-3 text-center border-l border-warm-200 dark:border-warm-700"
                    >
                      {v}
                    </th>
                  ))}
                {mode === 'entailment' &&
                  entailmentResult?.variables.map((v) => (
                    <th
                      key={v}
                      className="py-2.5 px-3 text-center border-l border-warm-200 dark:border-warm-700"
                    >
                      {v}
                    </th>
                  ))}

                {mode === 'table' &&
                  tableResult?.subExpressions.map((sub) => (
                    <th
                      key={sub}
                      className="py-2.5 px-3 text-center border-l border-warm-200 dark:border-warm-700"
                    >
                      {sub}
                    </th>
                  ))}

                {mode === 'entailment' &&
                  entailmentResult?.subExpressions.map((sub, idx) => (
                    <th
                      key={sub}
                      className={`py-2.5 px-3 text-center border-l border-warm-200 dark:border-warm-700 ${
                        idx === (entailmentResult?.subExpressions.length ?? 0) - 1
                          ? 'bg-warm-200/60 dark:bg-warm-700/60 font-bold'
                          : ''
                      }`}
                    >
                      {sub}
                    </th>
                  ))}

                {mode === 'entailment' && (
                  <th className="py-2.5 px-3 text-center border-l border-warm-200 dark:border-warm-700">
                    Status
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-200 dark:divide-warm-800">
              {(mode === 'table' ? tableResult?.rows : entailmentResult?.rows)?.map((row) => {
                const isSelected = selectedRow === row.index;
                const isCounter = row.isCounterExample;
                const isKBModel = row.isModelOfKB;

                let rowBg = 'hover:bg-warm-50 dark:hover:bg-warm-800/40';
                if (isCounter) {
                  rowBg = 'bg-rose-50/80 dark:bg-rose-950/40 hover:bg-rose-100/80';
                } else if (isKBModel) {
                  rowBg = 'bg-emerald-50/60 dark:bg-emerald-950/30 hover:bg-emerald-100/60';
                }

                return (
                  <tr
                    key={row.index}
                    onClick={() => setSelectedRow(isSelected ? null : row.index)}
                    className={`cursor-pointer transition-colors ${rowBg} ${
                      isSelected ? 'ring-2 ring-accent-primary ring-inset' : ''
                    }`}
                  >
                    <td className="py-2 px-3 text-center text-warm-400 font-sans">
                      m<sub>{row.index}</sub>
                    </td>
                    {Object.entries(row.assignment).map(([k, val]) => (
                      <td
                        key={k}
                        className="py-2 px-3 text-center border-l border-warm-200 dark:border-warm-800"
                      >
                        <span
                          className={`inline-block w-5 h-5 leading-5 rounded text-[11px] font-bold ${
                            val
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300'
                          }`}
                        >
                          {val ? 'T' : 'F'}
                        </span>
                      </td>
                    ))}

                    {Object.entries(row.subExpressionValues).map(([subKey, val], idx, arr) => (
                      <td
                        key={subKey}
                        className={`py-2 px-3 text-center border-l border-warm-200 dark:border-warm-800 ${
                          idx === arr.length - 1 ? 'font-bold' : ''
                        }`}
                      >
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-bold ${
                            val
                              ? 'text-emerald-700 dark:text-emerald-300'
                              : 'text-rose-700 dark:text-rose-300'
                          }`}
                        >
                          {val ? 'T' : 'F'}
                        </span>
                      </td>
                    ))}

                    {mode === 'entailment' && (
                      <td className="py-2 px-3 text-center border-l border-warm-200 dark:border-warm-800">
                        {isCounter ? (
                          <Badge variant="danger" size="sm">
                            Countermodel!
                          </Badge>
                        ) : isKBModel ? (
                          <Badge variant="success" size="sm">
                            KB Model
                          </Badge>
                        ) : (
                          <span className="text-warm-400 text-[11px]">KB False</span>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-warm-500 gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" /> KB Model (Premises
            True)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-rose-500 inline-block" /> Countermodel (KB True,
            α False)
          </span>
        </div>
        <span>Click any row to inspect variable truth assignment</span>
      </div>
    </Card>
  );
}
