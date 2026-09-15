import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Badge } from '@/components/ui/Badge';

export const CrossValidationLab: React.FC = () => {
  const [kFolds, setKFolds] = useState<number>(5);
  const [strategy, setStrategy] = useState<'standard' | 'stratified' | 'timeseries'>('standard');
  const [activeFold, setActiveFold] = useState<number>(0);
  const [dataPointsCount, setDataPointsCount] = useState<number>(30);

  // Generate synthetic observations
  const dataset = useMemo(() => {
    return Array.from({ length: dataPointsCount }, (_, i) => ({
      id: i,
      x: i * 2.5 + 5,
      y: 12 + 1.4 * i + Math.sin(i * 0.8) * 6,
      category: i % 3 === 0 ? 'High' : i % 3 === 1 ? 'Med' : 'Low',
    }));
  }, [dataPointsCount]);

  // Compute simulated validation metrics across all folds
  const foldMetrics = useMemo(() => {
    const metrics: {
      fold: number;
      trainSize: number;
      valSize: number;
      valMse: number;
      valR2: number;
    }[] = [];

    for (let f = 0; f < kFolds; f++) {
      let vSize = 0;
      let tSize = 0;

      if (strategy === 'timeseries') {
        const step = Math.floor(dataPointsCount / (kFolds + 1));
        tSize = (f + 1) * step;
        vSize = Math.min(dataPointsCount - tSize, step);
      } else {
        const fSize = Math.floor(dataPointsCount / kFolds);
        vSize = f === kFolds - 1 ? dataPointsCount - fSize * (kFolds - 1) : fSize;
        tSize = dataPointsCount - vSize;
      }

      // Simulated realistic variation around MSE 4.5
      const pseudoNoise = Math.sin(f * 2.3 + 1.1) * 1.2;
      const fMse = Math.max(1.8, 4.2 + pseudoNoise);
      const fR2 = Math.max(0.65, 0.91 - pseudoNoise * 0.08);

      metrics.push({
        fold: f,
        trainSize: tSize,
        valSize: vSize,
        valMse: fMse,
        valR2: fR2,
      });
    }

    const avgMse = metrics.reduce((acc, m) => acc + m.valMse, 0) / kFolds;
    const avgR2 = metrics.reduce((acc, m) => acc + m.valR2, 0) / kFolds;
    const stdErrMse =
      Math.sqrt(metrics.reduce((acc, m) => acc + (m.valMse - avgMse) ** 2, 0) / (kFolds - 1 || 1)) /
      Math.sqrt(kFolds);

    return { folds: metrics, avgMse, avgR2, stdErrMse };
  }, [kFolds, dataPointsCount, strategy]);

  return (
    <Card className="border-stone-800 bg-stone-950/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-lg font-semibold text-stone-100">
              K-Fold Cross-Validation & Resampling Studio
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Visualize fold partition schemes, validation rotation, and cross-fold variance
              estimators
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-stone-900 p-1 rounded-lg border border-stone-800">
            <Button
              variant={strategy === 'standard' ? 'primary' : 'outline'}
              size="sm"
              className="h-7 px-2.5 text-xs border-stone-800"
              onClick={() => setStrategy('standard')}
            >
              Standard K-Fold
            </Button>
            <Button
              variant={strategy === 'stratified' ? 'primary' : 'outline'}
              size="sm"
              className="h-7 px-2.5 text-xs border-stone-800"
              onClick={() => setStrategy('stratified')}
            >
              Stratified
            </Button>
            <Button
              variant={strategy === 'timeseries' ? 'primary' : 'outline'}
              size="sm"
              className="h-7 px-2.5 text-xs border-stone-800"
              onClick={() => setStrategy('timeseries')}
            >
              Time-Series Forward
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-2">
        {/* Metrics Scorecard */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg border border-stone-800/80 bg-stone-900/60">
            <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
              Mean CV Score (MSE)
            </div>
            <div className="mt-1 font-mono text-base font-bold text-amber-400">
              {foldMetrics.avgMse.toFixed(2)} ± {foldMetrics.stdErrMse.toFixed(2)}
            </div>
            <div className="text-[10px] text-stone-500 font-mono">1/K Σ MSE_k</div>
          </div>

          <div className="p-3 rounded-lg border border-stone-800/80 bg-stone-900/60">
            <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
              Mean CV R² Score
            </div>
            <div className="mt-1 font-mono text-base font-bold text-emerald-400">
              {foldMetrics.avgR2.toFixed(3)}
            </div>
            <div className="text-[10px] text-stone-500 font-mono">Generalization Bound</div>
          </div>

          <div className="p-3 rounded-lg border border-stone-800/80 bg-stone-900/60">
            <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
              Active Fold Status
            </div>
            <div className="mt-1 font-mono text-base font-bold text-sky-400">
              Fold {activeFold + 1} of {kFolds}
            </div>
            <div className="text-[10px] text-stone-500 font-mono">
              {foldMetrics.folds[activeFold]?.valSize ?? 0} Holdout Samples
            </div>
          </div>

          <div className="p-3 rounded-lg border border-stone-800/80 bg-stone-900/60">
            <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
              Training Set Utilization
            </div>
            <div className="mt-1 font-mono text-base font-bold text-stone-200">
              {strategy === 'timeseries'
                ? `${Math.round(((activeFold + 1) / (kFolds + 1)) * 100)}% Used`
                : `${Math.round(((kFolds - 1) / kFolds) * 100)}% per Fold`}
            </div>
            <div className="text-[10px] text-stone-500 font-mono">(K - 1) / K fraction</div>
          </div>
        </div>

        {/* Interactive Partition Matrix Grid */}
        <div className="rounded-lg border border-stone-800/80 bg-stone-900/40 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-stone-300">
              Dataset Partition Matrix ({dataPointsCount} Observations across {kFolds} Folds)
            </span>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="size-2.5 rounded bg-amber-400" /> Validation Fold (Holdout)
              </span>
              <span className="flex items-center gap-1.5 text-stone-400">
                <span className="size-2.5 rounded bg-stone-700" /> Training Partitions
              </span>
              {strategy === 'timeseries' && (
                <span className="flex items-center gap-1.5 text-stone-600">
                  <span className="size-2.5 rounded bg-stone-900 border border-stone-800" /> Unused
                  Future
                </span>
              )}
            </div>
          </div>

          {/* Matrix of rows: each row is a Fold trial */}
          <div className="space-y-2 pt-1">
            {Array.from({ length: kFolds }, (_, fIdx) => (
              <div
                key={fIdx}
                onClick={() => setActiveFold(fIdx)}
                className={`p-2 rounded border cursor-pointer transition-all flex items-center gap-3 ${
                  activeFold === fIdx
                    ? 'border-amber-500/60 bg-amber-500/5'
                    : 'border-stone-800/60 bg-stone-950/40 hover:border-stone-700'
                }`}
              >
                <div className="w-16 font-mono text-xs font-semibold text-stone-300">
                  Fold {fIdx + 1}:
                </div>

                {/* Blocks for each data point */}
                <div className="flex-1 flex gap-1 overflow-x-auto py-0.5">
                  {dataset.map((pt) => {
                    let isVal = false;
                    let isUnused = false;

                    if (strategy === 'timeseries') {
                      const step = Math.floor(dataPointsCount / (kFolds + 1));
                      const trainEnd = (fIdx + 1) * step;
                      const valEnd = Math.min(dataPointsCount, trainEnd + step);
                      isVal = pt.id >= trainEnd && pt.id < valEnd;
                      isUnused = pt.id >= valEnd;
                    } else {
                      const foldSize = Math.floor(dataPointsCount / kFolds);
                      let f = Math.floor(pt.id / foldSize);
                      if (f >= kFolds) f = kFolds - 1;
                      isVal = f === fIdx;
                    }

                    return (
                      <div
                        key={pt.id}
                        title={`Sample #${pt.id}: ${isVal ? 'Validation' : isUnused ? 'Future' : 'Train'}`}
                        className={`h-5 min-w-[8px] flex-1 rounded-sm transition-colors ${
                          isVal
                            ? 'bg-amber-400'
                            : isUnused
                              ? 'bg-stone-900 border border-stone-800'
                              : 'bg-stone-700'
                        }`}
                      />
                    );
                  })}
                </div>

                <div className="w-24 text-right font-mono text-xs text-stone-400">
                  MSE: {foldMetrics.folds[fIdx]?.valMse.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/30 p-4 rounded-lg border border-stone-800/80">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-stone-300">Number of Folds (K):</span>
              <div className="flex gap-1.5">
                {[3, 5, 10].map((kVal) => (
                  <Button
                    key={kVal}
                    variant={kFolds === kVal ? 'primary' : 'outline'}
                    size="sm"
                    className="h-7 px-2.5 text-xs border-stone-800"
                    onClick={() => {
                      setKFolds(kVal);
                      if (activeFold >= kVal) setActiveFold(0);
                    }}
                  >
                    K = {kVal}
                  </Button>
                ))}
              </div>
            </div>

            <Slider
              label={`Dataset Size: ${dataPointsCount} observations`}
              min={20}
              max={60}
              step={5}
              value={dataPointsCount}
              onChange={setDataPointsCount}
            />
          </div>

          {/* Fold Selector Buttons */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-stone-300">Select Active Holdout Fold:</span>
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: kFolds }, (_, i) => (
                <Button
                  key={i}
                  variant={activeFold === i ? 'primary' : 'outline'}
                  size="sm"
                  className="h-7 px-2.5 text-xs border-stone-800"
                  onClick={() => setActiveFold(i)}
                >
                  Fold {i + 1}
                </Button>
              ))}
            </div>
            <p className="text-[11px] text-stone-500 pt-1">
              Click any fold row or button to inspect its holdout validation partition.
            </p>
          </div>
        </div>

        {/* Takeaway Insight Box */}
        <div className="p-3.5 rounded-lg border border-amber-500/20 bg-amber-500/5 text-xs text-stone-300 space-y-1">
          <div className="font-semibold text-stone-200 flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] border-amber-500/40 text-amber-300">
              Cross-Validation Insight
            </Badge>
            {strategy === 'standard'
              ? 'Standard K-Fold Bias-Variance Tradeoff'
              : strategy === 'stratified'
                ? 'Stratified K-Fold Class Balancing'
                : 'Time-Series Walk-Forward Split (No Future Leakage)'}
          </div>
          <p className="leading-relaxed">
            {strategy === 'standard' &&
              `With K = ${kFolds}, each fold trains on ${Math.round(((kFolds - 1) / kFolds) * 100)}% of the data and evaluates on the remaining ${Math.round((1 / kFolds) * 100)}%. Averaging test errors across all ${kFolds} non-overlapping partitions yields an unbiased estimator of true generalization risk with low variance.`}
            {strategy === 'stratified' &&
              'Stratified K-Fold ensures that every fold maintains identical label or target quantiles as the master dataset. Crucial for imbalanced targets to prevent a validation fold containing zero instances of rare classes.'}
            {strategy === 'timeseries' &&
              'Time-series data has temporal dependencies. Standard random K-Fold would train on future data to predict past data (lookahead bias). Walk-forward splitting enforces strict chronological order: fold k only trains on time steps before the validation window.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
