import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Badge } from '@/components/ui/Badge';
import { SeededRNG } from '@/utils/rng';
import { Activity, HeartPulse, AlertTriangle, TrendingDown, RotateCcw } from 'lucide-react';

export interface Patient {
  id: number;
  pregnancies: number;
  glucose: number; // 0 indicates missing assay
  bloodPressure: number; // 0 indicates missing assay
  skinThickness: number; // 0 indicates missing assay
  insulin: number; // 0 indicates missing assay
  bmi: number; // 0 indicates missing assay
  dpf: number; // Diabetes Pedigree Function
  age: number;
  outcome: 0 | 1; // 0: Non-Diabetic, 1: Diabetic
}

// Generate realistic synthetic clinical cohort
function generatePimaCohort(seed: number = 768): Patient[] {
  const rng = new SeededRNG(seed);
  const cohort: Patient[] = [];
  const n = 160;

  for (let i = 0; i < n; i++) {
    const isDiabetic = rng.next() < 0.35 ? 1 : 0;
    const age = Math.round(21 + rng.next() * 50);
    const pregnancies = isDiabetic ? Math.floor(rng.next() * 8) : Math.floor(rng.next() * 5);
    const dpf = +(0.1 + rng.next() * 1.5 + (isDiabetic ? 0.3 : 0)).toFixed(3);

    // Biological features with realistic clinical correlation to diabetes
    let glucose = Math.round(
      isDiabetic
        ? 120 + rng.next() * 70 + (rng.next() - 0.5) * 20
        : 85 + rng.next() * 45 + (rng.next() - 0.5) * 15
    );
    let bmi = +(
      isDiabetic
        ? 28 + rng.next() * 18 + (rng.next() - 0.5) * 4
        : 21 + rng.next() * 12 + (rng.next() - 0.5) * 3
    ).toFixed(1);
    let bp = Math.round(60 + rng.next() * 35);
    let insulin = Math.round(isDiabetic ? 100 + rng.next() * 250 : 40 + rng.next() * 120);
    let skin = Math.round(15 + rng.next() * 30);

    // Realistic clinical missingness: in real Pima dataset, ~48% insulin and ~30% skin are recorded as 0
    if (rng.next() < 0.35) insulin = 0;
    if (rng.next() < 0.25) skin = 0;
    if (rng.next() < 0.05) bp = 0;
    if (rng.next() < 0.04) bmi = 0;
    if (rng.next() < 0.03) glucose = 0;

    cohort.push({
      id: i + 1,
      pregnancies,
      glucose,
      bloodPressure: bp,
      skinThickness: skin,
      insulin,
      bmi,
      dpf,
      age,
      outcome: isDiabetic,
    });
  }

  return cohort;
}

type ImputationMethod = 'raw' | 'mean' | 'class_median';
type ModelType = 'tree' | 'rf' | 'svm' | 'logistic';

export const DiabetesPredictionLab: React.FC = () => {
  const [seed, setSeed] = useState<number>(768);
  const [imputation, setImputation] = useState<ImputationMethod>('class_median');
  const [modelType, setModelType] = useState<ModelType>('rf');
  const [threshold, setThreshold] = useState<number>(0.35); // Clinical screening threshold
  const [treeDepth, setTreeDepth] = useState<number>(3);
  const costFN = 500; // Cost of missing sick patient
  const costFP = 50; // Cost of unnecessary test

  const rawCohort = useMemo(() => generatePimaCohort(seed), [seed]);

  // Impute dataset based on strategy
  const processedCohort = useMemo(() => {
    if (imputation === 'raw') {
      return rawCohort;
    }

    if (imputation === 'mean') {
      // Calculate global non-zero means
      const nonZero = (arr: number[]) => arr.filter((x) => x > 0);
      const mean = (arr: number[]) =>
        arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 1;

      const gMean = mean(nonZero(rawCohort.map((p) => p.glucose)));
      const bmiMean = mean(nonZero(rawCohort.map((p) => p.bmi)));
      const bpMean = mean(nonZero(rawCohort.map((p) => p.bloodPressure)));
      const insMean = mean(nonZero(rawCohort.map((p) => p.insulin)));
      const skinMean = mean(nonZero(rawCohort.map((p) => p.skinThickness)));

      return rawCohort.map((p) => ({
        ...p,
        glucose: p.glucose === 0 ? Math.round(gMean) : p.glucose,
        bmi: p.bmi === 0 ? +bmiMean.toFixed(1) : p.bmi,
        bloodPressure: p.bloodPressure === 0 ? Math.round(bpMean) : p.bloodPressure,
        insulin: p.insulin === 0 ? Math.round(insMean) : p.insulin,
        skinThickness: p.skinThickness === 0 ? Math.round(skinMean) : p.skinThickness,
      }));
    }

    // Class-aware median imputation
    const getMedian = (arr: number[]) => {
      const valid = arr.filter((x) => x > 0).sort((a, b) => a - b);
      if (valid.length === 0) return 1;
      const mid = Math.floor(valid.length / 2);
      return valid.length % 2 === 0 ? (valid[mid - 1]! + valid[mid]!) / 2 : valid[mid]!;
    };

    const d0 = rawCohort.filter((p) => p.outcome === 0);
    const d1 = rawCohort.filter((p) => p.outcome === 1);

    const med0 = {
      g: getMedian(d0.map((p) => p.glucose)),
      bmi: getMedian(d0.map((p) => p.bmi)),
      bp: getMedian(d0.map((p) => p.bloodPressure)),
      ins: getMedian(d0.map((p) => p.insulin)),
      skin: getMedian(d0.map((p) => p.skinThickness)),
    };
    const med1 = {
      g: getMedian(d1.map((p) => p.glucose)),
      bmi: getMedian(d1.map((p) => p.bmi)),
      bp: getMedian(d1.map((p) => p.bloodPressure)),
      ins: getMedian(d1.map((p) => p.insulin)),
      skin: getMedian(d1.map((p) => p.skinThickness)),
    };

    return rawCohort.map((p) => {
      const m = p.outcome === 1 ? med1 : med0;
      return {
        ...p,
        glucose: p.glucose === 0 ? Math.round(m.g) : p.glucose,
        bmi: p.bmi === 0 ? +m.bmi.toFixed(1) : p.bmi,
        bloodPressure: p.bloodPressure === 0 ? Math.round(m.bp) : p.bloodPressure,
        insulin: p.insulin === 0 ? Math.round(m.ins) : p.insulin,
        skinThickness: p.skinThickness === 0 ? Math.round(m.skin) : p.skinThickness,
      };
    });
  }, [rawCohort, imputation]);

  // Model evaluation & prediction computation
  const evaluation = useMemo(() => {
    // Standardize features for linear/SVM
    const gVals = processedCohort.map((p) => p.glucose);
    const bmiVals = processedCohort.map((p) => p.bmi);
    const ageVals = processedCohort.map((p) => p.age);
    const insVals = processedCohort.map((p) => p.insulin);

    const mean = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
    const std = (arr: number[], m: number) =>
      Math.sqrt(arr.reduce((a, b) => a + Math.pow(b - m, 2), 0) / arr.length) || 1;

    const gMean = mean(gVals);
    const gStd = std(gVals, gMean);
    const bmiMean = mean(bmiVals);
    const bmiStd = std(bmiVals, bmiMean);
    const ageMean = mean(ageVals);
    const ageStd = std(ageVals, ageMean);
    const insMean = mean(insVals);
    const insStd = std(insVals, insMean);

    const predictions: { actual: 0 | 1; prob: number; pred: 0 | 1; patient: Patient }[] = [];

    processedCohort.forEach((p) => {
      const gNorm = (p.glucose - gMean) / gStd;
      const bmiNorm = (p.bmi - bmiMean) / bmiStd;
      const ageNorm = (p.age - ageMean) / ageStd;
      const insNorm = (p.insulin - insMean) / insStd;

      let score = 0;

      if (modelType === 'logistic') {
        // Linear log-odds combination
        score = 0.95 * gNorm + 0.65 * bmiNorm + 0.4 * ageNorm + 0.25 * insNorm - 0.6;
      } else if (modelType === 'svm') {
        // Radial Basis Function approximation
        const centerDist = Math.sqrt(Math.pow(gNorm - 0.7, 2) + Math.pow(bmiNorm - 0.5, 2));
        const rbfResponse = Math.exp(-0.8 * centerDist * centerDist);
        score = 2.2 * rbfResponse + 0.5 * gNorm + 0.3 * bmiNorm - 1.1;
      } else if (modelType === 'tree') {
        // Orthogonal CART decision tree splits (depth dependent)
        if (treeDepth === 1) {
          score = p.glucose > 130 ? 1.5 : -1.5;
        } else if (treeDepth === 2) {
          score = p.glucose > 130 ? (p.bmi > 28 ? 2.2 : 0.1) : p.age > 40 ? 0.3 : -1.8;
        } else {
          // Depth 3+
          score =
            p.glucose > 125
              ? p.bmi > 29
                ? p.insulin > 120
                  ? 2.8
                  : 1.4
                : -0.2
              : p.age > 45
                ? p.bmi > 32
                  ? 1.2
                  : -0.8
                : -2.2;
        }
      } else {
        // Random Forest: Ensemble blend of 5 orthogonal trees with variance reduction
        const t1 = p.glucose > 125 ? 1.2 : -1.2;
        const t2 = p.bmi > 30 ? 1.0 : -0.8;
        const t3 = p.glucose > 135 && p.age > 35 ? 1.8 : -1.0;
        const t4 = p.insulin > 140 && p.bmi > 28 ? 1.4 : -0.6;
        const t5 = p.dpf > 0.6 && p.glucose > 115 ? 1.1 : -0.9;
        score = (t1 + t2 + t3 + t4 + t5) / 3.0;
      }

      // Sigmoid squash to probability [0, 1]
      const prob = 1 / (1 + Math.exp(-score));
      const pred = prob >= threshold ? 1 : 0;
      predictions.push({ actual: p.outcome, prob, pred, patient: p });
    });

    let tp = 0;
    let fp = 0;
    let fn = 0;
    let tn = 0;

    predictions.forEach((item) => {
      if (item.actual === 1 && item.pred === 1) tp++;
      else if (item.actual === 0 && item.pred === 1) fp++;
      else if (item.actual === 1 && item.pred === 0) fn++;
      else tn++;
    });

    const total = predictions.length;
    const accuracy = (tp + tn) / total;
    const sensitivity = tp + fn > 0 ? tp / (tp + fn) : 0; // Clinical Recall
    const specificity = tn + fp > 0 ? tn / (tn + fp) : 0;
    const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
    const f1 =
      precision + sensitivity > 0 ? (2 * precision * sensitivity) / (precision + sensitivity) : 0;
    const totalCost = fn * costFN + fp * costFP;
    const avgCostPerPatient = totalCost / total;

    // Theoretically optimal threshold under Bayes decision theory:
    // tau* = cost_FP / (cost_FP + cost_FN)
    const optimalTau = +(costFP / (costFP + costFN)).toFixed(3);

    return {
      predictions,
      tp,
      fp,
      fn,
      tn,
      total,
      accuracy,
      sensitivity,
      specificity,
      precision,
      f1,
      totalCost,
      avgCostPerPatient,
      optimalTau,
    };
  }, [processedCohort, modelType, treeDepth, threshold, costFN, costFP]);

  return (
    <div className="space-y-6">
      {/* Interactive Controls Bar */}
      <Card className="p-6 border-orange-50/15 bg-neutral-900/60 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-orange-50/10 pb-4">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-red-400" />
            <h3 className="font-semibold text-lg text-foreground font-manrope">
              Pima Indians diabetes diagnostic lab
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" size="sm">
              N = 160 Cohort
            </Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSeed((s) => s + 1)}
              className="flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Resample Cohort
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5">
          {/* 1. Missingness Imputation Strategy */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider font-mono">
              1. Missingness Imputation Strategy
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {[
                {
                  id: 'raw',
                  label: 'Raw (Zeros Kept)',
                  desc: 'Insulin/Skin = 0 treated as real 0',
                },
                {
                  id: 'mean',
                  label: 'Global Mean Imputation',
                  desc: 'Replaces 0 with cohort average',
                },
                {
                  id: 'class_median',
                  label: 'Class-Aware Median',
                  desc: 'Gold standard: separate medians per outcome',
                },
              ].map((strat) => (
                <button
                  key={strat.id}
                  onClick={() => setImputation(strat.id as ImputationMethod)}
                  className={`text-left p-2 rounded-lg text-xs transition-all border ${
                    imputation === strat.id
                      ? 'border-brand bg-brand/10 text-white font-medium'
                      : 'border-orange-50/10 bg-black/20 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <div className="font-semibold">{strat.label}</div>
                  <div className="text-[10px] text-neutral-500 font-sans">{strat.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Classifier Algorithm */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider font-mono">
              2. Classifier Architecture
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'tree', label: 'Decision Tree' },
                { id: 'rf', label: 'Random Forest' },
                { id: 'svm', label: 'SVM (RBF Kernel)' },
                { id: 'logistic', label: 'Logistic Reg.' },
              ].map((m) => (
                <Button
                  key={m.id}
                  size="sm"
                  variant={modelType === m.id ? 'primary' : 'outline'}
                  onClick={() => setModelType(m.id as ModelType)}
                  className="w-full text-xs"
                >
                  {m.label}
                </Button>
              ))}
            </div>

            {modelType === 'tree' && (
              <div className="pt-2">
                <Slider
                  label={`Max Tree Depth: ${treeDepth}`}
                  value={treeDepth}
                  min={1}
                  max={4}
                  step={1}
                  onChange={(val) => setTreeDepth(val)}
                />
              </div>
            )}
          </div>

          {/* 3. Clinical Decision Threshold */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider font-mono">
                3. Clinical Screening Cutoff (τ)
              </label>
              <Badge variant={threshold <= evaluation.optimalTau ? 'success' : 'warning'} size="sm">
                τ = {threshold.toFixed(2)}
              </Badge>
            </div>
            <Slider
              label="Decision Threshold"
              value={threshold}
              min={0.1}
              max={0.9}
              step={0.02}
              onChange={(val) => setThreshold(val)}
            />
            <div className="text-[11px] text-neutral-400 font-sans leading-relaxed">
              Bayes optimal threshold:{' '}
              <code className="text-cream font-mono">τ* = {evaluation.optimalTau}</code>. Lowering
              threshold catches pre-symptomatic diabetics at the expense of extra blood tests.
            </div>
          </div>
        </div>
      </Card>

      {/* Main Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Scatter Visualizer of Glucose vs BMI with Decision Halo */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5 border-orange-50/15 bg-neutral-900/60">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-semibold text-sm text-foreground font-manrope">
                  Clinical Biomarker Distribution: Fasting Glucose vs BMI
                </h4>
                <p className="text-xs text-neutral-400 font-montserrat">
                  Solid ring: Predicted Diabetic (P ≥ τ). Dot color: True Clinical Label.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-red-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                  Diabetic ({rawCohort.filter((p) => p.outcome === 1).length})
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                  Healthy ({rawCohort.filter((p) => p.outcome === 0).length})
                </span>
              </div>
            </div>

            {/* 2D SVG Plot */}
            <div className="relative w-full aspect-[16/9] bg-black/40 rounded-xl border border-orange-50/10 p-2 overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 600 340">
                {/* Grid Lines */}
                {[50, 100, 150, 200].map((g) => {
                  const x = ((g - 50) / 170) * 540 + 40;
                  return (
                    <g key={`x-${g}`}>
                      <line x1={x} y1={20} x2={x} y2={300} stroke="#292524" strokeDasharray="3 3" />
                      <text
                        x={x}
                        y={318}
                        fill="#78716c"
                        fontSize={10}
                        textAnchor="middle"
                        fontFamily="monospace"
                      >
                        {g}
                      </text>
                    </g>
                  );
                })}
                {[15, 25, 35, 45, 55].map((b) => {
                  const y = 300 - ((b - 15) / 45) * 280;
                  return (
                    <g key={`y-${b}`}>
                      <line x1={40} y1={y} x2={580} y2={y} stroke="#292524" strokeDasharray="3 3" />
                      <text
                        x={32}
                        y={y + 3}
                        fill="#78716c"
                        fontSize={10}
                        textAnchor="end"
                        fontFamily="monospace"
                      >
                        {b}
                      </text>
                    </g>
                  );
                })}

                {/* Axis Labels */}
                <text
                  x={310}
                  y={336}
                  fill="#a8a29e"
                  fontSize={11}
                  textAnchor="middle"
                  fontFamily="sans-serif"
                >
                  Fasting Blood Glucose (mg/dL)
                </text>
                <text
                  x={14}
                  y={160}
                  fill="#a8a29e"
                  fontSize={11}
                  textAnchor="middle"
                  transform="rotate(-90 14 160)"
                  fontFamily="sans-serif"
                >
                  Body Mass Index (BMI)
                </text>

                {/* Patient scatter points */}
                {evaluation.predictions.map((item) => {
                  const x = Math.max(
                    40,
                    Math.min(580, ((item.patient.glucose - 50) / 170) * 540 + 40)
                  );
                  const y = Math.max(20, Math.min(300, 300 - ((item.patient.bmi - 15) / 45) * 280));
                  const isPositiveActual = item.actual === 1;
                  const isPositivePred = item.pred === 1;
                  const isError = item.actual !== item.pred;

                  return (
                    <g key={item.patient.id} className="transition-all duration-300">
                      {/* Prediction Halo if classified as diabetic */}
                      {isPositivePred && (
                        <circle
                          cx={x}
                          cy={y}
                          r={7.5}
                          fill="none"
                          stroke={isPositiveActual ? '#ef4444' : '#eab308'}
                          strokeWidth={1.5}
                          strokeOpacity={0.8}
                        />
                      )}
                      {/* Center Node */}
                      <circle
                        cx={x}
                        cy={y}
                        r={3.8}
                        fill={isPositiveActual ? '#ef4444' : '#10b981'}
                        className="cursor-pointer hover:r-5 transition-all"
                      >
                        <title>
                          Patient #{item.patient.id}: Glucose={item.patient.glucose}, BMI=
                          {item.patient.bmi}, Prob={(item.prob * 100).toFixed(1)}%, Label=
                          {isPositiveActual ? 'Diabetic' : 'Healthy'}
                        </title>
                      </circle>
                      {/* Red cross for False Negatives (Missed Diabetics) */}
                      {isError && item.actual === 1 && (
                        <line
                          x1={x - 3}
                          y1={y - 3}
                          x2={x + 3}
                          y2={y + 3}
                          stroke="#ffffff"
                          strokeWidth={1.2}
                        />
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </Card>
        </div>

        {/* Right Col: Clinical Confusion Matrix & Economic Loss */}
        <div className="space-y-4">
          {/* Confusion Matrix Card */}
          <Card className="p-5 border-orange-50/15 bg-neutral-900/60 space-y-4">
            <h4 className="font-semibold text-sm text-foreground font-manrope flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand" />
              Clinical Confusion Matrix
            </h4>

            <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
              {/* True Positive */}
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30">
                <div className="text-[10px] text-emerald-400 uppercase font-semibold">
                  True Positive (TP)
                </div>
                <div className="text-2xl font-bold text-emerald-300 my-0.5">{evaluation.tp}</div>
                <div className="text-[10px] text-neutral-400">Detected Diabetic</div>
              </div>

              {/* False Positive */}
              <div className="p-3 rounded-lg bg-yellow-950/40 border border-yellow-500/30">
                <div className="text-[10px] text-yellow-400 uppercase font-semibold">
                  False Alarm (FP)
                </div>
                <div className="text-2xl font-bold text-yellow-300 my-0.5">{evaluation.fp}</div>
                <div className="text-[10px] text-neutral-400">Follow-up test (${costFP})</div>
              </div>

              {/* False Negative */}
              <div className="p-3 rounded-lg bg-red-950/50 border border-red-500/40">
                <div className="text-[10px] text-red-400 uppercase font-semibold flex items-center justify-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Missed Sick (FN)
                </div>
                <div className="text-2xl font-bold text-red-300 my-0.5">{evaluation.fn}</div>
                <div className="text-[10px] text-red-300 font-sans">Critical Risk (${costFN})</div>
              </div>

              {/* True Negative */}
              <div className="p-3 rounded-lg bg-neutral-900 border border-orange-50/10">
                <div className="text-[10px] text-neutral-400 uppercase font-semibold">
                  True Negative (TN)
                </div>
                <div className="text-2xl font-bold text-neutral-200 my-0.5">{evaluation.tn}</div>
                <div className="text-[10px] text-neutral-500">Correctly Cleared</div>
              </div>
            </div>

            {/* Diagnostic Metrics */}
            <div className="space-y-2 pt-2 border-t border-orange-50/10 text-xs font-sans">
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Clinical Sensitivity (Recall):</span>
                <span className="font-mono font-semibold text-cream">
                  {(evaluation.sensitivity * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Clinical Specificity:</span>
                <span className="font-mono font-semibold text-neutral-200">
                  {(evaluation.specificity * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">F1 Diagnostic Balance:</span>
                <span className="font-mono font-semibold text-neutral-200">
                  {evaluation.f1.toFixed(3)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Raw Accuracy:</span>
                <span className="font-mono font-semibold text-neutral-300">
                  {(evaluation.accuracy * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </Card>

          {/* Expected Clinical Loss Card */}
          <Card className="p-4 border-red-500/20 bg-red-950/20 space-y-2 text-xs">
            <div className="flex items-center justify-between text-red-300 font-semibold font-manrope">
              <span className="flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4" />
                Expected Healthcare Expense
              </span>
              <span className="text-sm font-mono font-bold text-red-200">
                ${evaluation.totalCost.toLocaleString()}
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 font-montserrat leading-relaxed">
              Calculated as{' '}
              <code className="text-cream font-mono">
                FN × ${costFN} + FP × ${costFP}
              </code>
              . Setting threshold <code className="text-cream font-mono">τ = 0.35</code> saves lives
              by penalizing False Negatives 10× heavier than harmless False Alarms.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
