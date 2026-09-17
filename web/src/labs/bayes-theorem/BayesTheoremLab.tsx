import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { calculateBayesPosterior } from '@/engines/probabilistic/naive-bayes';
import { ShieldAlert, RefreshCw, Info } from 'lucide-react';

export function BayesTheoremLab() {
  const [priorPercent, setPriorPercent] = useState<number>(1.0); // 1.0% prevalence
  const [sensitivityPercent, setSensitivityPercent] = useState<number>(95.0); // 95% TPR
  const [specificityPercent, setSpecificityPercent] = useState<number>(90.0); // 90% TNR

  const prior = priorPercent / 100;
  const sensitivity = sensitivityPercent / 100;
  const specificity = specificityPercent / 100;

  const result = useMemo(() => {
    return calculateBayesPosterior(prior, sensitivity, specificity, 1000);
  }, [prior, sensitivity, specificity]);

  const resetDefaults = () => {
    setPriorPercent(1.0);
    setSensitivityPercent(95.0);
    setSpecificityPercent(90.0);
  };

  const setRareScenario = () => {
    setPriorPercent(0.1);
    setSensitivityPercent(99.0);
    setSpecificityPercent(95.0);
  };

  const setHighRiskScenario = () => {
    setPriorPercent(20.0);
    setSensitivityPercent(90.0);
    setSpecificityPercent(90.0);
  };

  const {
    withCondition,
    withoutCondition,
    truePositives,
    falsePositives,
    trueNegatives,
    falseNegatives,
  } = result.naturalFrequencies;

  const totalPositiveTests = truePositives + falsePositives;
  const posteriorPercent = (result.posteriorPositive * 100).toFixed(1);

  // Generate 1000 grid items representation
  const gridItems = useMemo(() => {
    const items: Array<'TP' | 'FN' | 'FP' | 'TN'> = [];
    for (let i = 0; i < truePositives; i++) items.push('TP');
    for (let i = 0; i < falseNegatives; i++) items.push('FN');
    for (let i = 0; i < falsePositives; i++) items.push('FP');
    for (let i = 0; i < trueNegatives; i++) items.push('TN');
    return items;
  }, [truePositives, falseNegatives, falsePositives, trueNegatives]);

  return (
    <div className="space-y-6">
      {/* Controls Card */}
      <Card className="bg-[#141210] border-[#292524]">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-white text-xl font-mono">
                Bayes' Theorem & Medical Base-Rate Paradox Lab
              </CardTitle>
              <CardDescription className="text-stone-400">
                Explore why high sensitivity does not guarantee a high posterior probability when
                the disease prevalence is rare.
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={setRareScenario}
                className="text-xs border-[#292524] hover:bg-[#1c1917]"
              >
                Rare Disease (0.1%)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={setHighRiskScenario}
                className="text-xs border-[#292524] hover:bg-[#1c1917]"
              >
                High-Risk Clinic (20%)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetDefaults}
                className="text-xs border-[#292524] hover:bg-[#1c1917]"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1" />
                Reset (1%)
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Prior Slider */}
            <div className="space-y-2">
              <Slider
                label="Base Rate P(Condition)"
                value={priorPercent}
                min={0.1}
                max={25.0}
                step={0.1}
                unit="%"
                onChange={(val) => setPriorPercent(val)}
                helperText={`Prevalence in general population (${withCondition} in 1,000 individuals).`}
              />
            </div>

            {/* Sensitivity Slider */}
            <div className="space-y-2">
              <Slider
                label="Sensitivity P(+ | Condition)"
                value={sensitivityPercent}
                min={60.0}
                max={99.9}
                step={0.5}
                unit="%"
                onChange={(val) => setSensitivityPercent(val)}
                helperText="True Positive Rate: Probability of testing positive if sick."
              />
            </div>

            {/* Specificity Slider */}
            <div className="space-y-2">
              <Slider
                label="Specificity P(- | Healthy)"
                value={specificityPercent}
                min={60.0}
                max={99.9}
                step={0.5}
                unit="%"
                onChange={(val) => setSpecificityPercent(val)}
                helperText={`True Negative Rate: False positive rate is ${(100 - specificityPercent).toFixed(0)}%.`}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Metric Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[#141210] border-[#292524] p-4 text-center">
          <span className="text-xs text-stone-400 font-mono uppercase tracking-wider block mb-1">
            Prior P(Condition)
          </span>
          <span className="text-2xl font-bold font-mono text-amber-300">
            {priorPercent.toFixed(1)}%
          </span>
          <span className="text-xs text-stone-500 block mt-1">Pre-test expectation</span>
        </Card>

        <Card className="bg-[#141210] border-[#292524] p-4 text-center">
          <span className="text-xs text-stone-400 font-mono uppercase tracking-wider block mb-1">
            Marginal Evidence P(+)
          </span>
          <span className="text-2xl font-bold font-mono text-stone-200">
            {(result.evidencePositive * 100).toFixed(2)}%
          </span>
          <span className="text-xs text-stone-500 block mt-1">
            {totalPositiveTests} of 1,000 test positive
          </span>
        </Card>

        <Card className="bg-[#141210] border-amber-500/40 p-4 text-center bg-amber-950/10">
          <span className="text-xs text-amber-300 font-mono uppercase tracking-wider block mb-1">
            Posterior P(Condition | +)
          </span>
          <span className="text-3xl font-extrabold font-mono text-[#fef3c7]">
            {posteriorPercent}%
          </span>
          <span className="text-xs text-amber-400/80 block mt-1">
            Actual probability if positive
          </span>
        </Card>

        <Card className="bg-[#141210] border-[#292524] p-4 text-center">
          <span className="text-xs text-stone-400 font-mono uppercase tracking-wider block mb-1">
            False Positive Ratio
          </span>
          <span className="text-2xl font-bold font-mono text-rose-400">
            {totalPositiveTests > 0 ? ((falsePositives / totalPositiveTests) * 100).toFixed(1) : 0}%
          </span>
          <span className="text-xs text-stone-500 block mt-1">
            {falsePositives} false alarms vs {truePositives} real
          </span>
        </Card>
      </div>

      {/* Visual Cohort Matrix (1,000 Icons) */}
      <Card className="bg-[#141210] border-[#292524]">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-white text-base font-mono">
                Natural Frequency Grid (1,000 Individuals in Cohort)
              </CardTitle>
              <CardDescription className="text-stone-400 text-xs">
                Each dot represents one patient. Inspect the ratio of true positives to false alarms
                among all positive tests.
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-3 text-xs font-mono">
              <span className="inline-flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
                True Positives ({truePositives})
              </span>
              <span className="inline-flex items-center gap-1.5 text-rose-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block" />
                False Alarms ({falsePositives})
              </span>
              <span className="inline-flex items-center gap-1.5 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block" />
                Missed Sick ({falseNegatives})
              </span>
              <span className="inline-flex items-center gap-1.5 text-stone-500">
                <span className="w-2.5 h-2.5 rounded-sm bg-stone-800 inline-block" />
                Healthy Clear ({trueNegatives})
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-[#0c0a09] border border-[#292524] rounded-lg p-3">
            <div className="grid grid-cols-25 sm:grid-cols-50 gap-1 overflow-x-auto max-h-56 p-1">
              {gridItems.map((type, idx) => {
                let color = 'bg-stone-800';
                if (type === 'TP') color = 'bg-emerald-400';
                else if (type === 'FP') color = 'bg-rose-500';
                else if (type === 'FN') color = 'bg-amber-400';
                return (
                  <div
                    key={idx}
                    title={`Patient #${idx + 1}: ${type}`}
                    className={`w-2 h-2 rounded-[1px] ${color} transition-colors duration-150`}
                  />
                );
              })}
            </div>
          </div>

          <div className="mt-4 p-3 bg-[#1c1917] border border-[#292524] rounded-md text-xs text-stone-300 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
            <p>
              Out of 1,000 individuals,{' '}
              <strong className="text-white font-mono">{totalPositiveTests}</strong> test positive.
              However, only <strong className="text-emerald-300 font-mono">{truePositives}</strong>{' '}
              of them actually carry the condition, while{' '}
              <strong className="text-rose-300 font-mono">{falsePositives}</strong> are healthy
              individuals with false-alarm tests. Therefore, given a positive test, your actual
              probability of disease is{' '}
              <strong className="text-[#fef3c7] font-mono">
                {truePositives} / {totalPositiveTests} = {posteriorPercent}%
              </strong>
              .
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Decision Tree & Mathematical Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Probability Breakdown Tree */}
        <Card className="bg-[#141210] border-[#292524]">
          <CardHeader>
            <CardTitle className="text-white text-base font-mono">
              Bayesian Tree Decomposition
            </CardTitle>
            <CardDescription className="text-stone-400 text-xs">
              Tracing paths from 1,000 initial cohort members to diagnostic outcomes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 font-mono text-xs">
            <div className="p-3 bg-[#0c0a09] border border-[#292524] rounded space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-[#292524]">
                <span className="text-stone-400">Total Population</span>
                <span className="text-white font-bold">1,000 patients</span>
              </div>

              {/* Branch 1: Sick */}
              <div className="pl-3 border-l-2 border-amber-500/50 space-y-1.5">
                <div className="flex justify-between text-amber-300 font-semibold">
                  <span>Has Condition ({(prior * 100).toFixed(1)}%)</span>
                  <span>{withCondition} patients</span>
                </div>
                <div className="pl-3 flex justify-between text-emerald-400">
                  <span>↳ Test Positive (TPR {(sensitivity * 100).toFixed(0)}%)</span>
                  <span>{truePositives} patients</span>
                </div>
                <div className="pl-3 flex justify-between text-stone-500">
                  <span>↳ Test Negative (FNR {((1 - sensitivity) * 100).toFixed(0)}%)</span>
                  <span>{falseNegatives} patients</span>
                </div>
              </div>

              {/* Branch 2: Healthy */}
              <div className="pl-3 border-l-2 border-sky-500/50 space-y-1.5">
                <div className="flex justify-between text-sky-300 font-semibold">
                  <span>Healthy ({(result.complementPrior * 100).toFixed(1)}%)</span>
                  <span>{withoutCondition} patients</span>
                </div>
                <div className="pl-3 flex justify-between text-rose-400">
                  <span>↳ Test Positive (FPR {(result.falsePositiveRate * 100).toFixed(0)}%)</span>
                  <span>{falsePositives} patients</span>
                </div>
                <div className="pl-3 flex justify-between text-stone-500">
                  <span>↳ Test Negative (TNR {(specificity * 100).toFixed(0)}%)</span>
                  <span>{trueNegatives} patients</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formula Inspection */}
        <Card className="bg-[#141210] border-[#292524]">
          <CardHeader>
            <CardTitle className="text-white text-base font-mono">
              Bayes' Theorem Analytical Calculation
            </CardTitle>
            <CardDescription className="text-stone-400 text-xs">
              Formula terms evaluated with current parameters.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-[#0c0a09] border border-[#292524] rounded-md font-mono text-xs space-y-3">
              <div className="text-amber-200">P(D | +) = [ P(+ | D) · P(D) ] / P(+)</div>
              <div className="text-stone-400 space-y-1">
                <div>Numerator (True Positives):</div>
                <div className="pl-2 text-stone-200">
                  P(+ | D) · P(D) = {sensitivity.toFixed(3)} × {prior.toFixed(4)} ={' '}
                  {(sensitivity * prior).toFixed(5)}
                </div>
              </div>
              <div className="text-stone-400 space-y-1">
                <div>Denominator (Total Positive Evidence):</div>
                <div className="pl-2 text-stone-200">
                  P(+) = ({sensitivity.toFixed(3)} × {prior.toFixed(4)}) + (
                  {result.falsePositiveRate.toFixed(3)} × {result.complementPrior.toFixed(4)})
                </div>
                <div className="pl-2 text-stone-200">
                  P(+) = {(sensitivity * prior).toFixed(5)} +{' '}
                  {(result.falsePositiveRate * result.complementPrior).toFixed(5)} ={' '}
                  {result.evidencePositive.toFixed(5)}
                </div>
              </div>
              <div className="pt-2 border-t border-[#292524] text-sm text-[#fef3c7] font-bold">
                P(D | +) = {(sensitivity * prior).toFixed(5)} / {result.evidencePositive.toFixed(5)}{' '}
                = {posteriorPercent}%
              </div>
            </div>

            <div className="flex items-start gap-2 text-xs text-stone-400">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>
                <strong>Clinical Takeaway:</strong> In population screenings where disease incidence
                is rare, a positive test should prompt a secondary confirmatory assay, not immediate
                aggressive treatment.
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
