import { useState, useMemo, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Badge } from '@/components/ui/Badge';
import { Toggle } from '@/components/ui/Toggle';
import { generateChurnDataset, standardizeFeatures } from './churnData';
import type { CustomerRecord } from './churnData';
import { trainLogisticRegression, predictLogistic } from '@/engines/classification/logistic';
import { predictKnn } from '@/engines/instance/knn';
import { DollarSign, TrendingUp, Users } from 'lucide-react';

export function CustomerChurnLab() {
  const [data] = useState<CustomerRecord[]>(() => generateChurnDataset(42));
  const [useScaling, setUseScaling] = useState<boolean>(true);
  const [useClassWeights, setUseClassWeights] = useState<boolean>(true);
  const [modelType, setModelType] = useState<'logistic' | 'knn'>('logistic');
  const [threshold, setThreshold] = useState<number>(0.25);

  // Business financial parameters
  const cac = 500; // Customer acquisition cost ($500)
  const retentionCost = 50; // Special retention discount offer ($50)

  // Feature matrix X and labels y
  const { rawX, y } = useMemo(() => {
    const rawX = data.map((d) => [
      d.tenureMonths,
      d.monthlyCharges,
      d.contractType,
      d.techSupportCalls,
    ]);
    const y = data.map((d) => d.churn);
    return { rawX, y };
  }, [data]);

  // Scaled X
  const { scaledX } = useMemo(() => standardizeFeatures(rawX), [rawX]);
  const activeX = useScaling ? scaledX : rawX;

  // Compute model predictions and probabilities
  const probabilities = useMemo(() => {
    if (modelType === 'logistic') {
      // Re-weighting for class imbalance: duplicate positive samples if class weights active
      let trainX = activeX;
      let trainY = y;
      if (useClassWeights) {
        const positiveIndices: number[] = [];
        y.forEach((val, idx) => {
          if (val === 1) positiveIndices.push(idx);
        });
        // 3x replication for ~1:4 balance
        const extraX: number[][] = [];
        const extraY: (0 | 1)[] = [];
        positiveIndices.forEach((idx) => {
          const row = activeX[idx];
          if (row) {
            extraX.push([...row], [...row], [...row]);
            extraY.push(1, 1, 1);
          }
        });
        trainX = [...activeX, ...extraX];
        trainY = [...y, ...extraY];
      }

      const model = trainLogisticRegression(trainX, trainY, { alpha: 0.1, maxIter: 500 });
      return activeX.map((row) => predictLogistic(model, row).probability);
    } else {
      // k-NN baseline (k=5)
      return activeX.map((row, idx) => {
        // Leave-one-out query
        const otherX = activeX.filter((_, i) => i !== idx);
        const otherY = y.filter((_, i) => i !== idx);
        const pred = predictKnn(otherX, otherY, row, {
          k: 5,
          metric: 'euclidean',
          weightByDistance: true,
        });
        return pred.probabilities[1] ?? 0;
      });
    }
  }, [activeX, y, modelType, useClassWeights]);

  // Evaluate confusion matrix and costs at any threshold
  const evaluateMetricsAtThreshold = useCallback(
    (tau: number) => {
      let tp = 0;
      let fp = 0;
      let tn = 0;
      let fn = 0;

      probabilities.forEach((p, i) => {
        const pred = p >= tau ? 1 : 0;
        const actual = y[i];
        if (actual === 1 && pred === 1) tp++;
        else if (actual === 0 && pred === 1) fp++;
        else if (actual === 0 && pred === 0) tn++;
        else if (actual === 1 && pred === 0) fn++;
      });

      const total = tp + fp + tn + fn;
      const accuracy = total > 0 ? (tp + tn) / total : 0;
      const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
      const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
      const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

      // Financial calculation
      // Without ML: All actual churners (tp + fn) leave, costing (tp + fn) * cac
      const unmitigatedLoss = (tp + fn) * cac;

      // With ML at threshold tau:
      // Retained churners (tp): saved cac ($500), but paid retentionCost ($50) -> net gain = $450 * tp
      // False alarms (fp): unnecessarily spent retentionCost ($50) -> net loss = -$50 * fp
      // Missed churners (fn): lost customer -> net loss = -$500 * fn
      const netSavings = tp * (cac - retentionCost) - fp * retentionCost;

      return {
        tp,
        fp,
        tn,
        fn,
        accuracy,
        precision,
        recall,
        f1,
        unmitigatedLoss,
        netSavings,
      };
    },
    [probabilities, y, cac, retentionCost]
  );

  const currentMetrics = useMemo(
    () => evaluateMetricsAtThreshold(threshold),
    [threshold, evaluateMetricsAtThreshold]
  );
  const defaultMetrics = useMemo(
    () => evaluateMetricsAtThreshold(0.5),
    [evaluateMetricsAtThreshold]
  );

  // Find optimal profit-maximizing threshold tau*
  const optimalResult = useMemo(() => {
    let bestTau = 0.5;
    let maxSavings = -Infinity;

    for (let t = 0.05; t <= 0.85; t += 0.02) {
      const metrics = evaluateMetricsAtThreshold(t);
      if (metrics.netSavings > maxSavings) {
        maxSavings = metrics.netSavings;
        bestTau = Math.round(t * 100) / 100;
      }
    }

    return {
      bestTau,
      maxSavings,
    };
  }, [evaluateMetricsAtThreshold]);

  return (
    <Card className="rounded-xl border border-orange-50/15 bg-black/20 backdrop-blur-sm shadow-none">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-xl font-medium text-stone-200">
              Telecom customer churn prediction &amp; ROI pipeline
            </CardTitle>
            <CardDescription className="text-stone-400">
              End-to-end pipeline: feature scaling, class reweighting, and profit-maximizing
              threshold tuning
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="font-mono text-xs border-amber-600/40 text-amber-300"
            >
              100 Customer Cohort (24% Churn)
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Pipeline Control Toolbar */}
        <div className="grid gap-4 md:grid-cols-3 rounded-xl border border-[#292524] bg-[#0c0a09] p-4 text-xs">
          {/* Model Architecture */}
          <div className="space-y-1.5">
            <span className="font-medium text-stone-300">Classification model:</span>
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setModelType('logistic')}
                className={`py-1.5 rounded border transition-colors ${
                  modelType === 'logistic'
                    ? 'bg-amber-950/40 text-amber-200 border-amber-600/50 font-medium'
                    : 'bg-[#1c1917] text-stone-400 border-[#292524] hover:bg-[#292524]'
                }`}
              >
                Logistic regression
              </button>
              <button
                type="button"
                onClick={() => setModelType('knn')}
                className={`py-1.5 rounded border transition-colors ${
                  modelType === 'knn'
                    ? 'bg-amber-950/40 text-amber-200 border-amber-600/50 font-medium'
                    : 'bg-[#1c1917] text-stone-400 border-[#292524] hover:bg-[#292524]'
                }`}
              >
                k-NN baseline (k=5)
              </button>
            </div>
          </div>

          {/* Feature Scaling Toggle */}
          <div className="space-y-1.5">
            <span className="font-medium text-stone-300">Feature engineering:</span>
            <div className="pt-2">
              <Toggle
                checked={useScaling}
                onChange={(checked) => setUseScaling(checked)}
                label="StandardScaler (Z-score scaling)"
              />
            </div>
          </div>

          {/* Class Imbalance Toggle */}
          <div className="space-y-1.5">
            <span className="font-medium text-stone-300">Class imbalance compensation:</span>
            <div className="pt-2">
              <Toggle
                checked={useClassWeights}
                onChange={(checked) => setUseClassWeights(checked)}
                label="Class weights (1:4 ratio)"
              />
            </div>
          </div>
        </div>

        {/* Cost-Sensitive Threshold Tuning Slider */}
        <div className="rounded-xl border border-[#292524] bg-[#0c0a09] p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-sm font-medium text-stone-200">
                Decision threshold (τ):{' '}
                <span className="font-mono text-amber-300 text-base">{threshold.toFixed(2)}</span>
              </span>
              <p className="text-xs text-stone-500 mt-0.5">
                Customers with predicted churn probability &ge; τ receive the $50 retention discount
                offer
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setThreshold(0.5)}
                className="text-xs rounded border-[#292524]"
              >
                Default (τ = 0.50)
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setThreshold(optimalResult.bestTau)}
                className="text-xs rounded-lg rounded-br-none bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                Set optimal (τ* = {optimalResult.bestTau.toFixed(2)})
              </Button>
            </div>
          </div>

          <Slider
            label="Decision threshold (tau)"
            value={threshold}
            min={0.05}
            max={0.9}
            step={0.01}
            onChange={(val) => setThreshold(Math.round(val * 100) / 100)}
          />

          <div className="flex justify-between text-xs text-stone-500 font-mono">
            <span>τ = 0.05 (High Recall, Many Discounts)</span>
            <span className="text-emerald-400 font-semibold">
              Peak Profit τ* ≈ {optimalResult.bestTau.toFixed(2)}
            </span>
            <span>τ = 0.90 (High Precision, Many Missed Churners)</span>
          </div>
        </div>

        {/* Confusion Matrix & Business ROI Dashboard */}
        <div className="grid gap-6 md:grid-cols-12">
          {/* Confusion Matrix (5 cols) */}
          <div className="md:col-span-5 rounded-xl border border-[#292524] bg-[#0c0a09] p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#292524] pb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-stone-400">
                2x2 Confusion matrix
              </span>
              <span className="text-xs text-stone-500">N = 100</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              {/* TP */}
              <div className="rounded-lg border border-emerald-800/40 bg-emerald-950/20 p-3 space-y-1">
                <div className="text-emerald-400 font-medium">True positive (TP)</div>
                <div className="text-2xl font-bold font-mono text-emerald-300">
                  {currentMetrics.tp}
                </div>
                <div className="text-[10px] text-stone-400">
                  Churners caught &amp; saved (+${currentMetrics.tp * (cac - retentionCost)})
                </div>
              </div>

              {/* FP */}
              <div className="rounded-lg border border-amber-800/40 bg-amber-950/20 p-3 space-y-1">
                <div className="text-amber-400 font-medium">False positive (FP)</div>
                <div className="text-2xl font-bold font-mono text-amber-300">
                  {currentMetrics.fp}
                </div>
                <div className="text-[10px] text-stone-400">
                  Wasted discounts (-${currentMetrics.fp * retentionCost})
                </div>
              </div>

              {/* FN */}
              <div className="rounded-lg border border-red-800/40 bg-red-950/20 p-3 space-y-1">
                <div className="text-red-400 font-medium">False negative (FN)</div>
                <div className="text-2xl font-bold font-mono text-red-300">{currentMetrics.fn}</div>
                <div className="text-[10px] text-stone-400">
                  Churners lost (-${currentMetrics.fn * cac})
                </div>
              </div>

              {/* TN */}
              <div className="rounded-lg border border-[#292524] bg-[#1c1917] p-3 space-y-1">
                <div className="text-stone-300 font-medium">True negative (TN)</div>
                <div className="text-2xl font-bold font-mono text-stone-200">
                  {currentMetrics.tn}
                </div>
                <div className="text-[10px] text-stone-400">Loyal users left alone ($0)</div>
              </div>
            </div>

            {/* Core Classification Metrics */}
            <div className="grid grid-cols-4 gap-1.5 pt-2 text-center text-xs font-mono">
              <div className="rounded bg-[#1c1917] p-1.5">
                <div className="text-stone-500 text-[10px]">Accuracy</div>
                <div className="text-stone-200">{(currentMetrics.accuracy * 100).toFixed(0)}%</div>
              </div>
              <div className="rounded bg-[#1c1917] p-1.5">
                <div className="text-stone-500 text-[10px]">Precision</div>
                <div className="text-amber-300">{(currentMetrics.precision * 100).toFixed(0)}%</div>
              </div>
              <div className="rounded bg-[#1c1917] p-1.5">
                <div className="text-stone-500 text-[10px]">Recall</div>
                <div className="text-emerald-300">{(currentMetrics.recall * 100).toFixed(0)}%</div>
              </div>
              <div className="rounded bg-[#1c1917] p-1.5">
                <div className="text-stone-500 text-[10px]">F1-score</div>
                <div className="text-stone-200">{(currentMetrics.f1 * 100).toFixed(0)}%</div>
              </div>
            </div>
          </div>

          {/* Business ROI & Financial Calculator (7 cols) */}
          <div className="md:col-span-7 rounded-xl border border-[#292524] bg-[#0c0a09] p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-[#292524] pb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                Executive ROI impact calculator
              </span>
              <span className="text-xs text-stone-500">CAC = $500 | Discount = $50</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {/* Current Threshold Net Balance */}
              <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/15 p-4 space-y-2">
                <span className="text-xs text-stone-400">
                  Net savings at current τ = {threshold.toFixed(2)}
                </span>
                <div className="text-3xl font-bold font-mono text-emerald-400">
                  ${currentMetrics.netSavings.toLocaleString()}
                </div>
                <p className="text-[11px] text-stone-400">
                  Saved {currentMetrics.tp} customers from leaving, spent $
                  {currentMetrics.fp * retentionCost} on false alarms.
                </p>
              </div>

              {/* Default Threshold (0.50) Comparison */}
              <div className="rounded-xl border border-[#292524] bg-[#1c1917] p-4 space-y-2">
                <span className="text-xs text-stone-400">Standard textbook τ = 0.50</span>
                <div className="text-2xl font-bold font-mono text-stone-300">
                  ${defaultMetrics.netSavings.toLocaleString()}
                </div>
                <p className="text-[11px] text-stone-400">
                  Missed {defaultMetrics.fn} churners due to high 0.5 threshold barrier.
                </p>
              </div>
            </div>

            {/* Financial Advantage Callout */}
            <div className="rounded-lg border border-amber-900/30 bg-amber-950/10 p-3 space-y-1 text-xs">
              <div className="flex items-center gap-1.5 font-medium text-amber-300">
                <TrendingUp className="w-4 h-4" />
                Why cost-sensitive threshold tuning beats textbook τ = 0.50
              </div>
              <p className="text-stone-300 leading-relaxed text-[11px]">
                In customer churn, a False Negative costs 10x more than a False Positive ($500 vs
                $50). Setting threshold τ to {optimalResult.bestTau.toFixed(2)} captures{' '}
                <span className="text-cream font-semibold font-mono">
                  +${(optimalResult.maxSavings - defaultMetrics.netSavings).toLocaleString()}
                </span>{' '}
                in additional net profit over the naive 0.5 threshold, despite lowering raw
                accuracy!
              </p>
            </div>

            {/* Unmitigated Baseline */}
            <div className="flex items-center justify-between text-xs text-stone-500 pt-1 font-mono">
              <span>Unmitigated churn cost (No ML):</span>
              <span className="text-red-400 font-semibold">
                -${currentMetrics.unmitigatedLoss.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Customer Cohort Sample Inspector */}
        <div className="rounded-xl border border-[#292524] bg-[#0c0a09] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-stone-400" />
              Customer cohort inspector (First 6 accounts)
            </span>
            <span className="text-[11px] text-stone-500">
              Live scoring at τ = {threshold.toFixed(2)}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#1c1917] text-stone-400 border-b border-[#292524]">
                <tr>
                  <th className="p-2">Customer ID</th>
                  <th className="p-2">Tenure</th>
                  <th className="p-2">Monthly Fee</th>
                  <th className="p-2">Contract</th>
                  <th className="p-2">Support Calls</th>
                  <th className="p-2">Predicted Risk</th>
                  <th className="p-2">Actual Status</th>
                  <th className="p-2">Action Taken</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#292524] text-stone-300 text-[11px]">
                {data.slice(0, 6).map((c, i) => {
                  const prob = probabilities[i] ?? 0;
                  const flagged = prob >= threshold;
                  return (
                    <tr key={c.id}>
                      <td className="p-2 font-medium text-stone-300">{c.id}</td>
                      <td className="p-2">{c.tenureMonths} mo</td>
                      <td className="p-2">${c.monthlyCharges.toFixed(2)}</td>
                      <td className="p-2">
                        {c.contractType === 0
                          ? 'Month-to-month'
                          : c.contractType === 1
                            ? 'One year'
                            : 'Two year'}
                      </td>
                      <td className="p-2">{c.techSupportCalls}</td>
                      <td className="p-2 font-semibold text-amber-300">
                        {(prob * 100).toFixed(1)}%
                      </td>
                      <td className="p-2">
                        {c.churn === 1 ? (
                          <span className="text-red-400 font-bold">Churned</span>
                        ) : (
                          <span className="text-stone-400">Retained</span>
                        )}
                      </td>
                      <td className="p-2">
                        {flagged ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                            Offer $50 discount
                          </span>
                        ) : (
                          <span className="text-stone-500">No intervention</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
