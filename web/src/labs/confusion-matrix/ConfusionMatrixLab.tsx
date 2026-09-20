import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Slider } from '@/components/ui/Slider';
import { Badge } from '@/components/ui/Badge';
import { computeClassificationMetrics } from '@/engines/classification/metrics';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const METRIC_CONFIG: {
  key: keyof ReturnType<typeof computeClassificationMetrics>;
  label: string;
  desc: string;
}[] = [
  { key: 'accuracy', label: 'Accuracy', desc: '(TP+TN) / total' },
  { key: 'precision', label: 'Precision', desc: 'TP / (TP+FP)' },
  { key: 'recall', label: 'Recall (Sensitivity)', desc: 'TP / (TP+FN)' },
  { key: 'specificity', label: 'Specificity', desc: 'TN / (TN+FP)' },
  { key: 'f1', label: 'F1 Score', desc: '2·P·R / (P+R)' },
  { key: 'mcc', label: 'MCC', desc: '(TP·TN − FP·FN) / √…' },
  { key: 'balancedAccuracy', label: 'Balanced Accuracy', desc: '(Recall + Specificity) / 2' },
];

function metricColor(val: number, key: string): string {
  if (isNaN(val)) return 'text-neutral-500';
  const v = key === 'mcc' ? (val + 1) / 2 : val; // MCC in [-1,1] → [0,1]
  if (v >= 0.75) return 'text-green-400';
  if (v >= 0.5) return 'text-yellow-400';
  return 'text-red-400';
}

function metricBg(val: number, key: string): string {
  if (isNaN(val)) return 'bg-neutral-800';
  const v = key === 'mcc' ? (val + 1) / 2 : val;
  if (v >= 0.75) return 'bg-green-500';
  if (v >= 0.5) return 'bg-yellow-500';
  return 'bg-red-500';
}

export function ConfusionMatrixLab() {
  // Direct cell sliders
  const [TP, setTP] = useState(40);
  const [FP, setFP] = useState(10);
  const [TN, setTN] = useState(80);
  const [FN, setFN] = useState(20);
  const [imbalancedMode, setImbalancedMode] = useState(false);
  const [prevalence, setPrevalence] = useState(1); // % of positives

  // When imbalanced mode, derive counts from prevalence
  const effectiveCM = useMemo(() => {
    if (!imbalancedMode) return { TP, FP, TN, FN };
    // Total = 1000. Positives = prevalence%, sensitivity=80%, specificity=90%
    const total = 1000;
    const pos = Math.round((prevalence / 100) * total);
    const neg = total - pos;
    const tp = Math.round(0.8 * pos);
    const fn = pos - tp;
    const tn = Math.round(0.9 * neg);
    const fp = neg - tn;
    return { TP: tp, FP: fp, TN: tn, FN: fn };
  }, [imbalancedMode, prevalence, TP, FP, TN, FN]);

  const metrics = useMemo(() => computeClassificationMetrics(effectiveCM), [effectiveCM]);
  const total = effectiveCM.TP + effectiveCM.FP + effectiveCM.TN + effectiveCM.FN;

  const cells = [
    {
      label: 'True Positive (TP)',
      value: effectiveCM.TP,
      bg: 'bg-green-900/40',
      border: 'border-green-700/50',
      hint: 'Correctly predicted positive',
    },
    {
      label: 'False Positive (FP)',
      value: effectiveCM.FP,
      bg: 'bg-red-900/30',
      border: 'border-red-700/40',
      hint: 'Type I Error — predicted positive, was negative',
    },
    {
      label: 'False Negative (FN)',
      value: effectiveCM.FN,
      bg: 'bg-orange-900/30',
      border: 'border-orange-700/40',
      hint: 'Type II Error — predicted negative, was positive',
    },
    {
      label: 'True Negative (TN)',
      value: effectiveCM.TN,
      bg: 'bg-blue-900/30',
      border: 'border-blue-700/40',
      hint: 'Correctly predicted negative',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Mode toggle */}
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant={imbalancedMode ? 'default' : 'outline'}>
          {imbalancedMode ? 'Imbalanced class mode' : 'Manual matrix mode'}
        </Badge>
        <button
          onClick={() => setImbalancedMode(!imbalancedMode)}
          className="rounded-lg rounded-br-none bg-neutral-800 px-3 py-1.5 text-xs font-medium text-neutral-200 hover:bg-neutral-700 transition-colors"
        >
          {imbalancedMode ? 'Switch to manual' : 'Explore accuracy paradox'}
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Confusion matrix grid */}
        <Card>
          <CardHeader>
            <CardTitle>Confusion matrix</CardTitle>
            <CardDescription>2x2 grid of prediction vs actual outcomes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* 2x2 grid */}
            <div className="grid grid-cols-2 gap-2">
              {cells.map((cell) => (
                <div key={cell.label} className={`rounded-lg border p-3 ${cell.bg} ${cell.border}`}>
                  <div className="text-xs text-neutral-400">{cell.label}</div>
                  <div className="mt-1 text-2xl font-bold font-mono text-foreground">
                    {cell.value}
                  </div>
                  <div className="mt-0.5 text-[10px] text-neutral-500">{cell.hint}</div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="text-xs text-neutral-500 text-right">
              Total samples: <span className="text-neutral-300 font-mono">{total}</span>
            </div>

            {/* Manual sliders */}
            {!imbalancedMode && (
              <div className="space-y-2 pt-2">
                <Slider
                  label="TP"
                  value={TP}
                  min={0}
                  max={200}
                  step={1}
                  onChange={setTP}
                  helperText={`${TP}`}
                />
                <Slider
                  label="FP"
                  value={FP}
                  min={0}
                  max={200}
                  step={1}
                  onChange={setFP}
                  helperText={`${FP}`}
                />
                <Slider
                  label="FN"
                  value={FN}
                  min={0}
                  max={200}
                  step={1}
                  onChange={setFN}
                  helperText={`${FN}`}
                />
                <Slider
                  label="TN"
                  value={TN}
                  min={0}
                  max={200}
                  step={1}
                  onChange={setTN}
                  helperText={`${TN}`}
                />
              </div>
            )}

            {/* Imbalanced slider */}
            {imbalancedMode && (
              <div className="space-y-2 pt-2">
                <Slider
                  label="Disease prevalence"
                  value={prevalence}
                  min={1}
                  max={50}
                  step={1}
                  onChange={setPrevalence}
                  helperText={`${prevalence}% positive class`}
                />
                <p className="text-xs text-neutral-500">
                  Sensitivity = 80%, Specificity = 90%, Total = 1000 samples.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Metrics panel */}
        <Card>
          <CardHeader>
            <CardTitle>Classification metrics</CardTitle>
            <CardDescription>Derived from the confusion matrix in real time.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {METRIC_CONFIG.map(({ key, label, desc }) => {
              const raw = metrics[key];
              const val = typeof raw === 'number' ? raw : NaN;
              const display = isNaN(val) ? 'N/A' : val.toFixed(3);
              const barWidth = isNaN(val)
                ? 0
                : Math.max(0, Math.min(100, key === 'mcc' ? ((val + 1) / 2) * 100 : val * 100));
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <span className="text-sm font-medium text-foreground">{label}</span>
                      <span className="ml-2 text-xs text-neutral-500 font-mono">{desc}</span>
                    </div>
                    <span className={`text-sm font-bold font-mono ${metricColor(val, key)}`}>
                      {display}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-neutral-800">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${metricBg(val, key)}`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Accuracy paradox callout */}
      {imbalancedMode && prevalence <= 5 && (
        <Card className="border-orange-500/40 bg-orange-500/5">
          <CardContent className="pt-4">
            <div className="flex gap-2">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-orange-400" />
              <div className="text-sm">
                <p className="font-semibold text-orange-300">Accuracy paradox detected</p>
                <p className="mt-1 text-neutral-400">
                  With only {prevalence}% positive class, a naive "always predict negative"
                  classifier would achieve{' '}
                  <span className="font-mono text-cream">{(100 - prevalence).toFixed(0)}%</span>{' '}
                  accuracy -- yet it has Recall = 0 and is clinically useless. Always prefer
                  Balanced Accuracy, F1, or MCC for imbalanced datasets.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Perfect classifier callout */}
      {!imbalancedMode && effectiveCM.FP === 0 && effectiveCM.FN === 0 && effectiveCM.TP > 0 && (
        <Card className="border-green-500/40 bg-green-500/5">
          <CardContent className="pt-4">
            <div className="flex gap-2">
              <CheckCircle className="mt-0.5 size-4 shrink-0 text-green-400" />
              <div className="text-sm">
                <p className="font-semibold text-green-300">Perfect classifier</p>
                <p className="mt-1 text-neutral-400">
                  All metrics equal 1.0. MCC = 1.0 confirms no correlation artefacts. This state
                  rarely occurs in real problems.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formula reference */}
      <Card>
        <CardHeader>
          <CardTitle>Formula quick reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-x-6 gap-y-2 text-xs sm:grid-cols-2">
            {[
              ['Accuracy', '(TP + TN) / (TP + FP + TN + FN)'],
              ['Precision (PPV)', 'TP / (TP + FP)'],
              ['Recall (Sensitivity / TPR)', 'TP / (TP + FN)'],
              ['Specificity (TNR)', 'TN / (TN + FP)'],
              ['F1 Score', '2 * Precision * Recall / (Precision + Recall)'],
              ['False Positive Rate (FPR)', 'FP / (FP + TN) = 1 - Specificity'],
              ['MCC', '(TP·TN - FP·FN) / sqrt((TP+FP)(TP+FN)(TN+FP)(TN+FN))'],
            ].map(([name, formula]) => (
              <div
                key={name}
                className="flex gap-2 border-b border-warm-border py-1.5 last:border-0"
              >
                <span className="w-40 shrink-0 font-medium text-neutral-300">{name}</span>
                <span className="font-mono text-neutral-500">{formula}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
