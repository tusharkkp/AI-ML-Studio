import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Badge } from '@/components/ui/Badge';

interface PatientRecord {
  id: string;
  age: number;
  bmi: number;
  smoker: boolean;
  dependents: number;
  actualChargesUSD: number;
}

// 20 representative clinical insurance observations
const HISTORICAL_PATIENTS: PatientRecord[] = [
  { id: 'PT-01', age: 19, bmi: 27.9, smoker: true, dependents: 0, actualChargesUSD: 16884 },
  { id: 'PT-02', age: 18, bmi: 33.7, smoker: false, dependents: 1, actualChargesUSD: 1725 },
  { id: 'PT-03', age: 28, bmi: 33.0, smoker: false, dependents: 3, actualChargesUSD: 4449 },
  { id: 'PT-04', age: 33, bmi: 22.7, smoker: false, dependents: 0, actualChargesUSD: 21984 },
  { id: 'PT-05', age: 32, bmi: 28.8, smoker: false, dependents: 0, actualChargesUSD: 3866 },
  { id: 'PT-06', age: 31, bmi: 25.7, smoker: false, dependents: 0, actualChargesUSD: 3756 },
  { id: 'PT-07', age: 46, bmi: 33.4, smoker: false, dependents: 1, actualChargesUSD: 8240 },
  { id: 'PT-08', age: 37, bmi: 27.7, smoker: false, dependents: 3, actualChargesUSD: 7281 },
  { id: 'PT-09', age: 37, bmi: 29.8, smoker: false, dependents: 2, actualChargesUSD: 6406 },
  { id: 'PT-10', age: 60, bmi: 25.8, smoker: false, dependents: 0, actualChargesUSD: 28923 },

  { id: 'PT-11', age: 25, bmi: 26.2, smoker: false, dependents: 0, actualChargesUSD: 2721 },
  { id: 'PT-12', age: 62, bmi: 26.2, smoker: true, dependents: 0, actualChargesUSD: 27808 },
  { id: 'PT-13', age: 23, bmi: 34.4, smoker: false, dependents: 0, actualChargesUSD: 1826 },
  { id: 'PT-14', age: 56, bmi: 39.8, smoker: false, dependents: 0, actualChargesUSD: 11090 },
  { id: 'PT-15', age: 27, bmi: 42.1, smoker: true, dependents: 0, actualChargesUSD: 39611 },
  { id: 'PT-16', age: 19, bmi: 24.6, smoker: false, dependents: 1, actualChargesUSD: 1837 },
  { id: 'PT-17', age: 52, bmi: 30.7, smoker: false, dependents: 1, actualChargesUSD: 10797 },
  { id: 'PT-18', age: 23, bmi: 23.8, smoker: false, dependents: 0, actualChargesUSD: 2395 },
  { id: 'PT-19', age: 56, bmi: 40.3, smoker: false, dependents: 0, actualChargesUSD: 10602 },
  { id: 'PT-20', age: 30, bmi: 35.3, smoker: true, dependents: 0, actualChargesUSD: 36837 },
];

export const HealthcareRegressionLab: React.FC = () => {
  // Input patient features
  const [age, setAge] = useState<number>(35);
  const [bmi, setBmi] = useState<number>(28.5);
  const [isSmoker, setIsSmoker] = useState<boolean>(false);
  const [dependents, setDependents] = useState<number>(1);
  const [modelType, setModelType] = useState<'additive' | 'interaction'>('interaction');

  // Compute predicted annual insurance charges
  const {
    predictedCharges,
    baseCost,
    ageCost,
    bmiCost,
    smokerCost,
    interactionCost,
    dependentsCost,
    riskCategory,
  } = useMemo(() => {
    let charges = 0;
    const bCost = 2500;
    const aCost = 250 * age;
    let bContr = 0;
    let sContr = 0;
    let intContr = 0;
    const depContr = 450 * dependents;

    if (modelType === 'additive') {
      // Additive model: BMI and Smoker are strictly additive independent terms
      bContr = 320 * (bmi - 20);
      sContr = isSmoker ? 14000 : 0;
      intContr = 0;
      charges = bCost + aCost + bContr + sContr + depContr;
    } else {
      // Interaction model:
      // BMI effect on non-smokers is modest ($120/unit above 20).
      // But if smoker AND BMI >= 30, the non-linear interaction explodes!
      const isObese = bmi >= 30;
      bContr = 140 * Math.max(0, bmi - 18.5);
      sContr = isSmoker ? 12000 : 0;
      intContr = isSmoker && isObese ? 18500 + 400 * (bmi - 30) : isSmoker ? 4000 : 0;
      charges = bCost + aCost + bContr + sContr + intContr + depContr;
    }

    const total = Math.max(1200, charges);

    let cat = 'Standard Risk';
    if (total < 5000) cat = 'Preferred Tier (Low Risk)';
    else if (total > 25000) cat = 'Sub-Standard Tier (High Clinical Risk)';
    else if (total > 12000) cat = 'Moderate Risk';

    return {
      predictedCharges: total,
      baseCost: bCost,
      ageCost: aCost,
      bmiCost: bContr,
      smokerCost: sContr,
      interactionCost: intContr,
      dependentsCost: depContr,
      riskCategory: cat,
    };
  }, [age, bmi, isSmoker, dependents, modelType]);

  // Model validation stats on 20 patients
  const { mse, mae, r2 } = useMemo(() => {
    let sse = 0;
    let sae = 0;
    let sumY = 0;

    const list = HISTORICAL_PATIENTS.map((p) => {
      let pred = 0;
      const bCost = 2500;
      const aCost = 250 * p.age;
      const depContr = 450 * p.dependents;

      if (modelType === 'additive') {
        const bContr = 320 * (p.bmi - 20);
        const sContr = p.smoker ? 14000 : 0;
        pred = bCost + aCost + bContr + sContr + depContr;
      } else {
        const isObese = p.bmi >= 30;
        const bContr = 140 * Math.max(0, p.bmi - 18.5);
        const sContr = p.smoker ? 12000 : 0;
        const intContr = p.smoker && isObese ? 18500 + 400 * (p.bmi - 30) : p.smoker ? 4000 : 0;
        pred = bCost + aCost + bContr + sContr + intContr + depContr;
      }

      const err = p.actualChargesUSD - pred;
      sse += err * err;
      sae += Math.abs(err);
      sumY += p.actualChargesUSD;

      return {
        ...p,
        predictedCharges: pred,
        residual: err,
        percentError: (Math.abs(err) / p.actualChargesUSD) * 100,
      };
    });

    const n = list.length;
    const meanY = sumY / n;
    let sst = 0;
    for (const p of HISTORICAL_PATIENTS) {
      sst += (p.actualChargesUSD - meanY) ** 2;
    }

    return {
      evaluatedList: list,
      mse: sse / n,
      mae: sae / n,
      r2: sst === 0 ? 1 : 1 - sse / sst,
    };
  }, [modelType]);

  // Curve points for BMI vs Charges plot
  const bmiCurveSmoker = useMemo(() => {
    const pts: { bmi: number; charges: number }[] = [];
    for (let b = 16; b <= 46; b += 2) {
      const isObese = b >= 30;
      let c = 0;
      if (modelType === 'additive') {
        c = 2500 + 250 * 35 + 320 * (b - 20) + 14000 + 450 * 1;
      } else {
        const intC = isObese ? 18500 + 400 * (b - 30) : 4000;
        c = 2500 + 250 * 35 + 140 * Math.max(0, b - 18.5) + 12000 + intC + 450 * 1;
      }
      pts.push({ bmi: b, charges: c });
    }
    return pts;
  }, [modelType]);

  const bmiCurveNonSmoker = useMemo(() => {
    const pts: { bmi: number; charges: number }[] = [];
    for (let b = 16; b <= 46; b += 2) {
      let c = 0;
      if (modelType === 'additive') {
        c = 2500 + 250 * 35 + 320 * (b - 20) + 0 + 450 * 1;
      } else {
        c = 2500 + 250 * 35 + 140 * Math.max(0, b - 18.5) + 0 + 0 + 450 * 1;
      }
      pts.push({ bmi: b, charges: c });
    }
    return pts;
  }, [modelType]);

  // SVG chart boundaries
  const svgWidth = 520;
  const svgHeight = 260;
  const pad = { top: 20, right: 25, bottom: 35, left: 55 };
  const innerW = svgWidth - pad.left - pad.right;
  const innerH = svgHeight - pad.top - pad.bottom;
  const maxCharge = 50000;

  return (
    <Card className="border-stone-800 bg-stone-950/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-lg font-semibold text-stone-100">
              Healthcare Insurance Cost & Clinical Risk Studio
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Analyze non-linear interaction terms (BMI × Smoking status) and actuarial underwriting
              risk
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-stone-900 p-1 rounded-lg border border-stone-800">
            <Button
              variant={modelType === 'additive' ? 'primary' : 'outline'}
              size="sm"
              className="h-7 px-2.5 text-xs border-stone-800"
              onClick={() => setModelType('additive')}
            >
              Additive Linear
            </Button>
            <Button
              variant={modelType === 'interaction' ? 'primary' : 'outline'}
              size="sm"
              className="h-7 px-2.5 text-xs border-stone-800"
              onClick={() => setModelType('interaction')}
            >
              BMI × Smoker Interaction
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-2">
        {/* Top Prediction & Clinical Tier Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border border-amber-500/20 bg-amber-500/5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400">
                Annual Medical Premium
              </span>
              <div className="mt-2 text-3xl font-display font-bold text-stone-100">
                ${predictedCharges.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </div>
              <div className="mt-1 flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={`text-[10px] ${
                    isSmoker && bmi >= 30
                      ? 'border-red-500 text-red-400'
                      : isSmoker
                        ? 'border-amber-500 text-amber-300'
                        : 'border-emerald-500 text-emerald-400'
                  }`}
                >
                  {riskCategory}
                </Badge>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-amber-500/20 grid grid-cols-3 gap-2 text-center font-mono text-xs">
              <div>
                <div className="text-[10px] text-stone-500">Model R²</div>
                <div className="font-bold text-emerald-400">{r2.toFixed(3)}</div>
              </div>
              <div>
                <div className="text-[10px] text-stone-500">Test MAE</div>
                <div className="font-bold text-stone-200">
                  ${mae.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-stone-500">Test RMSE</div>
                <div className="font-bold text-stone-200">
                  ${Math.sqrt(mse).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </div>
              </div>
            </div>
          </div>

          {/* Actuarial Feature Risk Breakdown */}
          <div className="lg:col-span-2 p-4 rounded-lg border border-stone-800/80 bg-stone-900/40 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-stone-300">Actuarial Cost Decomposition</span>
              <span className="text-stone-500 font-mono text-[11px]">Sum = Annual Premium</span>
            </div>
            <div className="space-y-1.5 text-xs font-mono pt-1">
              <div className="flex items-center justify-between">
                <span className="text-stone-400">Baseline Actuarial Pool Reserve</span>
                <span className="text-stone-200">+${baseCost}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-400">Age Risk Surcharge ({age} yrs × $250)</span>
                <span className="text-stone-200">+${ageCost}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-400">BMI Morbidity Surcharge ({bmi.toFixed(1)})</span>
                <span className="text-emerald-400">+${bmiCost.toFixed(0)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-400">
                  Tobacco Consumption Surcharge ({isSmoker ? 'Smoker' : 'Non-Smoker'})
                </span>
                <span className={isSmoker ? 'text-amber-400' : 'text-stone-500'}>
                  +${smokerCost}
                </span>
              </div>
              {modelType === 'interaction' && (
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">
                    Synergistic Interaction (BMI ≥ 30 × Tobacco)
                  </span>
                  <span
                    className={interactionCost > 0 ? 'text-red-400 font-bold' : 'text-stone-500'}
                  >
                    +${interactionCost}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-stone-400">Dependents Coverage ({dependents})</span>
                <span className="text-stone-200">+${dependentsCost}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Input Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-stone-900/30 p-4 rounded-lg border border-stone-800/80">
          <Slider
            label={`Age: ${age} Years`}
            min={18}
            max={65}
            step={1}
            value={age}
            onChange={setAge}
          />
          <Slider
            label={`BMI: ${bmi.toFixed(1)} kg/m² (${bmi >= 30 ? 'Obese' : bmi >= 25 ? 'Overweight' : 'Normal'})`}
            min={16.0}
            max={45.0}
            step={0.5}
            value={bmi}
            onChange={setBmi}
          />
          <Slider
            label={`Dependents: ${dependents}`}
            min={0}
            max={5}
            step={1}
            value={dependents}
            onChange={setDependents}
          />
          <div className="space-y-1.5 flex flex-col justify-end">
            <span className="text-xs font-mono text-stone-300">Tobacco Smoking Status:</span>
            <Button
              variant={isSmoker ? 'primary' : 'outline'}
              size="sm"
              className={`text-xs border-stone-800 ${isSmoker ? 'bg-red-500 text-white' : ''}`}
              onClick={() => setIsSmoker(!isSmoker)}
            >
              {isSmoker ? 'Smoker (Tobacco Active)' : 'Non-Smoker'}
            </Button>
          </div>
        </div>

        {/* Non-linear Response Curves: BMI vs Medical Charges */}
        <div className="rounded-lg border border-stone-800/80 bg-stone-900/40 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-stone-300">
              Response Curves: BMI vs Medical Charges (Age 35 Baseline)
            </span>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-red-400">
                <span className="size-2 rounded-full bg-red-400" /> Smoker
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="size-2 rounded-full bg-emerald-400" /> Non-Smoker
              </span>
            </div>
          </div>

          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto">
            <rect width={svgWidth} height={svgHeight} fill="#0c0a09" rx={6} />
            {/* Clinical Obesity Threshold line at BMI = 30 */}
            {(() => {
              const x30 = pad.left + ((30 - 15) / (45 - 15)) * innerW;
              return (
                <g>
                  <line
                    x1={x30}
                    y1={pad.top}
                    x2={x30}
                    y2={pad.top + innerH}
                    stroke="#eab308"
                    strokeWidth={1.2}
                    strokeDasharray="3 3"
                  />
                  <text
                    x={x30 + 4}
                    y={pad.top + 15}
                    fill="#eab308"
                    fontSize={9}
                    fontFamily="monospace"
                  >
                    Clinical Obesity (BMI ≥ 30)
                  </text>
                </g>
              );
            })()}

            {/* Smoker Curve */}
            {(() => {
              const pathD = bmiCurveSmoker
                .map((pt, i) => {
                  const cx = pad.left + ((pt.bmi - 15) / (45 - 15)) * innerW;
                  const cy = pad.top + innerH - (pt.charges / maxCharge) * innerH;
                  return `${i === 0 ? 'M' : 'L'} ${cx} ${cy}`;
                })
                .join(' ');

              return <path d={pathD} fill="none" stroke="#ef4444" strokeWidth={2.2} />;
            })()}

            {/* Non-Smoker Curve */}
            {(() => {
              const pathD = bmiCurveNonSmoker
                .map((pt, i) => {
                  const cx = pad.left + ((pt.bmi - 15) / (45 - 15)) * innerW;
                  const cy = pad.top + innerH - (pt.charges / maxCharge) * innerH;
                  return `${i === 0 ? 'M' : 'L'} ${cx} ${cy}`;
                })
                .join(' ');

              return <path d={pathD} fill="none" stroke="#10b981" strokeWidth={2.2} />;
            })()}

            {/* Current Selected Patient Marker */}
            {(() => {
              const cx = pad.left + ((bmi - 15) / (45 - 15)) * innerW;
              const cy = pad.top + innerH - (predictedCharges / maxCharge) * innerH;
              return (
                <circle cx={cx} cy={cy} r={6} fill="#f59e0b" stroke="#ffffff" strokeWidth={2} />
              );
            })()}

            {/* Axes */}
            <text
              x={pad.left}
              y={pad.top + innerH + 22}
              fill="#78716c"
              fontSize={10}
              fontFamily="monospace"
            >
              Body Mass Index (BMI: 15 - 45 kg/m²)
            </text>
            <text
              x={-pad.top - innerH / 2}
              y={20}
              fill="#78716c"
              fontSize={10}
              fontFamily="monospace"
              transform="rotate(-90)"
              textAnchor="middle"
            >
              Annual Charges ($ USD)
            </text>
          </svg>
        </div>

        {/* Clinical Interaction Explainer Box */}
        <div className="p-3.5 rounded-lg border border-amber-500/20 bg-amber-500/5 text-xs text-stone-300 space-y-1.5">
          <div className="font-semibold text-stone-200 flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] border-amber-500/40 text-amber-300">
              Epidemiological Finding
            </Badge>
            Why Simple Additive Models Fail in Healthcare
          </div>
          <p className="leading-relaxed">
            In medical claims data, smoking alone adds approximately $12,000 to annual healthcare
            costs. Obesity (BMI &gt; 30) for non-smokers adds modest outpatient costs. However, when
            a patient is{' '}
            <span className="font-medium text-stone-200">both a smoker and obese (BMI ≥ 30)</span>,
            cardiovascular and metabolic hospitalization risks multiply exponentially. The additive
            model yields R² ≈ 0.75 and severely underestimates high-risk patients by over $10,000;
            the interaction model captures the hockey-stick inflection, pushing R² to &gt; 0.88.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
