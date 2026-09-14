import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  standardScale,
  minMaxScale,
  robustScale,
  oneHotEncode,
  imputeMissing,
  detectOutliersIQR,
} from '@/engines/preprocessing/features';
import type { ImputationStrategy } from '@/engines/preprocessing/features';
import { AlertTriangle, ShieldCheck, Database } from 'lucide-react';

interface RawStudentRow {
  id: string;
  name: string;
  studyHours: number | null;
  attendance: number | null;
  city: string;
  incomeLakhs: number;
}

const RAW_DATASET: RawStudentRow[] = [
  {
    id: 'S1',
    name: 'Aarav Patil',
    studyHours: 5.5,
    attendance: 92,
    city: 'Pune',
    incomeLakhs: 8.5,
  },
  {
    id: 'S2',
    name: 'Diya Sharma',
    studyHours: null,
    attendance: 88,
    city: 'Mumbai',
    incomeLakhs: 12.0,
  },
  {
    id: 'S3',
    name: 'Rohan Kulkarni',
    studyHours: 7.2,
    attendance: null,
    city: 'Pune',
    incomeLakhs: 6.0,
  },
  {
    id: 'S4',
    name: 'Ananya Iyer',
    studyHours: 8.5,
    attendance: 96,
    city: 'Bangalore',
    incomeLakhs: 14.5,
  },
  {
    id: 'S5',
    name: 'Kabir Deshmukh',
    studyHours: 3.0,
    attendance: 70,
    city: 'Pune',
    incomeLakhs: 9.0,
  },
  {
    id: 'S6',
    name: 'Meera Nair',
    studyHours: 6.0,
    attendance: 85,
    city: 'Mumbai',
    incomeLakhs: 125.0,
  }, // Extreme Outlier!
  {
    id: 'S7',
    name: 'Aditya Joshi',
    studyHours: 4.2,
    attendance: null,
    city: 'Pune',
    incomeLakhs: 7.5,
  },
  {
    id: 'S8',
    name: 'Tanvi Rao',
    studyHours: 9.0,
    attendance: 98,
    city: 'Bangalore',
    incomeLakhs: 11.0,
  },
];

export function FeatureEngineeringLab() {
  const [imputeStrategy, setImputeStrategy] = useState<ImputationStrategy>('mean');
  const [scaleMode, setScaleMode] = useState<'raw' | 'standard' | 'minmax' | 'robust'>('raw');
  const [encodeCategoricals, setEncodeCategoricals] = useState<boolean>(false);
  const [capOutliers, setCapOutliers] = useState<boolean>(false);
  const [showLeakageWarning, setShowLeakageWarning] = useState<boolean>(false);

  // 1. Imputation step
  const rawHours = RAW_DATASET.map((r) => r.studyHours);
  const rawAttendance = RAW_DATASET.map((r) => r.attendance);
  const imputedHours = useMemo(
    () => imputeMissing(rawHours, imputeStrategy),
    [rawHours, imputeStrategy]
  );
  const imputedAttendance = useMemo(
    () => imputeMissing(rawAttendance, imputeStrategy),
    [rawAttendance, imputeStrategy]
  );

  // 2. Outlier detection on Income
  const rawIncomes = RAW_DATASET.map((r) => r.incomeLakhs);
  const iqrIncome = useMemo(() => detectOutliersIQR(rawIncomes), [rawIncomes]);

  const treatedIncomes = useMemo(() => {
    if (!capOutliers) return rawIncomes;
    return rawIncomes.map((inc) => {
      if (inc > iqrIncome.upperFence) return Number(iqrIncome.upperFence.toFixed(1));
      if (inc < iqrIncome.lowerFence) return Number(iqrIncome.lowerFence.toFixed(1));
      return inc;
    });
  }, [rawIncomes, capOutliers, iqrIncome]);

  // 3. Scaling step
  const scaledHours = useMemo(() => {
    if (scaleMode === 'standard') return standardScale(imputedHours).scaled;
    if (scaleMode === 'minmax') return minMaxScale(imputedHours, 0, 1).scaled;
    if (scaleMode === 'robust') return robustScale(imputedHours).scaled;
    return imputedHours;
  }, [imputedHours, scaleMode]);

  const scaledAttendance = useMemo(() => {
    if (scaleMode === 'standard') return standardScale(imputedAttendance).scaled;
    if (scaleMode === 'minmax') return minMaxScale(imputedAttendance, 0, 1).scaled;
    if (scaleMode === 'robust') return robustScale(imputedAttendance).scaled;
    return imputedAttendance;
  }, [imputedAttendance, scaleMode]);

  const scaledIncome = useMemo(() => {
    if (scaleMode === 'standard') return standardScale(treatedIncomes).scaled;
    if (scaleMode === 'minmax') return minMaxScale(treatedIncomes, 0, 1).scaled;
    if (scaleMode === 'robust') return robustScale(treatedIncomes).scaled;
    return treatedIncomes;
  }, [treatedIncomes, scaleMode]);

  // 4. One-Hot Encoding for City
  const rawCities = RAW_DATASET.map((r) => r.city);
  const oneHotResult = useMemo(() => oneHotEncode(rawCities), [rawCities]);

  return (
    <Card className="p-6 border-stone-800 bg-[#0c0a09] space-y-6 shadow-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <h3 className="font-montserrat text-lg font-bold text-stone-100">
              Interactive Feature Engineering &amp; Data Preprocessing Studio
            </h3>
          </div>
          <p className="text-xs text-stone-400 mt-1 font-sans">
            Transform a dirty real-world dataset: impute null values, standardize disparate scales,
            encode categorical strings, and handle extreme financial outliers.
          </p>
        </div>

        {/* Data Leakage Warning Trigger */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowLeakageWarning(!showLeakageWarning)}
          className={`text-xs h-7 gap-1.5 rounded-lg rounded-br-none ${
            showLeakageWarning
              ? 'border-rose-500 bg-rose-950/40 text-rose-300'
              : 'border-stone-800 text-stone-400 hover:text-stone-200'
          }`}
        >
          <AlertTriangle className="size-3" />
          {showLeakageWarning ? 'Hide Leakage Trap' : 'Trap: Data Leakage in Preprocessing'}
        </Button>
      </div>

      {/* Data Leakage Educational Callout */}
      {showLeakageWarning && (
        <div className="p-4 rounded-xl border border-rose-500/50 bg-rose-950/20 text-xs text-rose-200 space-y-1.5">
          <div className="flex items-center gap-2 font-montserrat font-bold text-rose-300">
            <AlertTriangle className="size-4 shrink-0 text-rose-400" />
            The Data Leakage Cardinal Sin: scaler.fit(X_all)
          </div>
          <p className="leading-relaxed">
            Never compute <span className="font-mono text-rose-100 font-bold">&mu;</span> or{' '}
            <span className="font-mono text-rose-100 font-bold">&sigma;</span> across the entire
            dataset before splitting into Train and Test sets! When you do, test set statistics leak
            into the training pipeline, leading to overly optimistic cross-validation scores that
            collapse in production. Always fit preprocessing transformers{' '}
            <strong className="underline">strictly on training data</strong>, then transform the
            test data.
          </p>
        </div>
      )}

      {/* Transformation Control Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl border border-stone-800 bg-stone-900/40">
        {/* 1. Missing Value Imputation */}
        <div className="space-y-1.5">
          <span className="text-xs font-mono text-stone-400 block uppercase tracking-wider">
            1. Missing Imputation:
          </span>
          <div className="flex items-center gap-1">
            {(['mean', 'median', 'mode'] as ImputationStrategy[]).map((st) => (
              <button
                key={st}
                onClick={() => setImputeStrategy(st)}
                className={`px-2.5 py-1 text-xs font-mono rounded capitalize transition-all ${
                  imputeStrategy === st
                    ? 'bg-stone-100 text-stone-950 font-semibold'
                    : 'text-stone-400 hover:text-stone-200 border border-stone-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Numerical Feature Scaling */}
        <div className="space-y-1.5">
          <span className="text-xs font-mono text-stone-400 block uppercase tracking-wider">
            2. Feature Scaling:
          </span>
          <div className="flex items-center gap-1 flex-wrap">
            {[
              { id: 'raw', label: 'Raw' },
              { id: 'standard', label: 'Z-Score' },
              { id: 'minmax', label: 'MinMax [0,1]' },
              { id: 'robust', label: 'Robust' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setScaleMode(s.id as 'raw' | 'standard' | 'minmax' | 'robust')}
                className={`px-2.5 py-1 text-xs font-mono rounded transition-all ${
                  scaleMode === s.id
                    ? 'bg-stone-100 text-stone-950 font-semibold'
                    : 'text-stone-400 hover:text-stone-200 border border-stone-800'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Categorical One-Hot Encoding */}
        <div className="space-y-1.5">
          <span className="text-xs font-mono text-stone-400 block uppercase tracking-wider">
            3. Categorical Encoding:
          </span>
          <button
            onClick={() => setEncodeCategoricals(!encodeCategoricals)}
            className={`px-3 py-1 text-xs font-mono rounded-lg border transition-all ${
              encodeCategoricals
                ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 font-semibold'
                : 'border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            {encodeCategoricals ? 'One-Hot [1, 0, 0]' : 'Raw Strings ("Pune")'}
          </button>
        </div>

        {/* 4. Outlier Handling */}
        <div className="space-y-1.5">
          <span className="text-xs font-mono text-stone-400 block uppercase tracking-wider">
            4. Outlier Treatment:
          </span>
          <button
            onClick={() => setCapOutliers(!capOutliers)}
            className={`px-3 py-1 text-xs font-mono rounded-lg border transition-all ${
              capOutliers
                ? 'border-amber-500 bg-amber-950/40 text-amber-300 font-semibold'
                : 'border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            {capOutliers ? 'Cap at IQR Fence (18.8L)' : 'Keep Raw (125L Outlier)'}
          </button>
        </div>
      </div>

      {/* Transformed Dataset Table */}
      <div className="overflow-x-auto border border-stone-800 rounded-xl">
        <table className="w-full text-left text-xs border-collapse font-mono">
          <thead>
            <tr className="border-b border-stone-800 bg-stone-900/70 text-stone-300">
              <th className="p-3">ID</th>
              <th className="p-3">Student Name</th>
              <th className="p-3 text-amber-300">
                Study Hours {scaleMode !== 'raw' && `(${scaleMode})`}
              </th>
              <th className="p-3 text-sky-300">
                Attendance % {scaleMode !== 'raw' && `(${scaleMode})`}
              </th>
              {encodeCategoricals ? (
                oneHotResult.categories.map((c) => (
                  <th key={`cat-${c}`} className="p-3 text-emerald-300">
                    is_{c}
                  </th>
                ))
              ) : (
                <th className="p-3 text-emerald-300">City</th>
              )}
              <th className="p-3 text-rose-300">Income Lakhs {capOutliers ? '(Capped)' : ''}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-800/60 text-stone-300">
            {RAW_DATASET.map((r, i) => {
              const isHoursImputed = r.studyHours === null;
              const isAttImputed = r.attendance === null;
              const isIncomeOutlier = iqrIncome.outlierIndices.includes(i);

              return (
                <tr key={r.id} className="hover:bg-stone-900/40 transition-colors">
                  <td className="p-3 text-stone-500">{r.id}</td>
                  <td className="p-3 font-sans text-stone-200 font-medium">{r.name}</td>

                  {/* Hours */}
                  <td className="p-3">
                    <span className={isHoursImputed ? 'text-amber-400 font-bold underline' : ''}>
                      {scaledHours[i]}
                    </span>
                    {isHoursImputed && (
                      <span className="ml-1 text-[9px] px-1 rounded bg-amber-950 text-amber-300 border border-amber-800">
                        {imputeStrategy}
                      </span>
                    )}
                  </td>

                  {/* Attendance */}
                  <td className="p-3">
                    <span className={isAttImputed ? 'text-sky-400 font-bold underline' : ''}>
                      {scaledAttendance[i]}
                    </span>
                    {isAttImputed && (
                      <span className="ml-1 text-[9px] px-1 rounded bg-sky-950 text-sky-300 border border-sky-800">
                        {imputeStrategy}
                      </span>
                    )}
                  </td>

                  {/* City or One-Hot */}
                  {encodeCategoricals ? (
                    oneHotResult.categories.map((c, cIdx) => (
                      <td key={`oh-${i}-${c}`} className="p-3 text-center">
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[10px] ${
                            oneHotResult.encodedMatrix[i]![cIdx] === 1
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold'
                              : 'text-stone-600'
                          }`}
                        >
                          {oneHotResult.encodedMatrix[i]![cIdx]}
                        </span>
                      </td>
                    ))
                  ) : (
                    <td className="p-3 text-stone-300">{r.city}</td>
                  )}

                  {/* Income */}
                  <td className="p-3">
                    <span className={isIncomeOutlier ? 'text-rose-400 font-bold' : ''}>
                      {scaledIncome[i]}
                    </span>
                    {isIncomeOutlier && !capOutliers && (
                      <span className="ml-1 text-[9px] px-1 rounded bg-rose-950 text-rose-300 border border-rose-800">
                        outlier!
                      </span>
                    )}
                    {isIncomeOutlier && capOutliers && (
                      <span className="ml-1 text-[9px] px-1 rounded bg-amber-950 text-amber-300 border border-amber-800">
                        capped
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="flex items-center justify-between text-xs text-stone-400 pt-2 border-t border-stone-800/80 font-mono">
        <div className="flex items-center gap-2">
          <Database className="size-3.5 text-stone-500" />
          <span>
            Rows: {RAW_DATASET.length} | Features:{' '}
            {encodeCategoricals ? 3 + oneHotResult.categories.length : 4}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-400">
          <ShieldCheck className="size-3.5" />
          <span>Zero Null Values | Ready for Scikit-Learn Model Fitting</span>
        </div>
      </div>
    </Card>
  );
}
