import React, { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Toggle } from '@/components/ui/Toggle';
import {
  calculateEntropy,
  calculateGini,
  evaluateCandidateSplit,
} from '@/engines/tree/decision-tree/engine';
import {
  PLAY_TENNIS_DATA,
  TENNIS_FEATURES,
  TENNIS_TARGET,
  TennisRow,
} from '@/engines/tree/decision-tree/playTennisData';
import { ImpurityCriterion } from '@/engines/tree/decision-tree/types';

export const DecisionTreeSplitLab: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<string>('outlook');
  const [criterion, setCriterion] = useState<ImpurityCriterion>('entropy');
  const [includeIdTrap, setIncludeIdTrap] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'visualizer' | 'dataset'>('visualizer');

  // Compute dataset including ID trap if toggled
  const currentDataset = useMemo(() => {
    return PLAY_TENNIS_DATA.map((row) => ({
      ...row,
      sample_id: row.day,
    }));
  }, []);

  const availableFeatures = useMemo(() => {
    return includeIdTrap ? ['sample_id', ...TENNIS_FEATURES] : TENNIS_FEATURES;
  }, [includeIdTrap]);

  // Evaluate all candidates
  const candidateEvaluations = useMemo(() => {
    return availableFeatures.map((feat) => {
      return evaluateCandidateSplit(currentDataset, feat, TENNIS_TARGET, criterion);
    });
  }, [availableFeatures, currentDataset, criterion]);

  // Selected candidate details
  const selectedEvaluation = useMemo(() => {
    return (
      candidateEvaluations.find((c) => c.attribute === selectedFeature) ?? candidateEvaluations[0]!
    );
  }, [candidateEvaluations, selectedFeature]);

  // Root stats
  const rootLabels = useMemo(() => currentDataset.map((d) => d.play), [currentDataset]);
  const rootImpurity = useMemo(
    () => (criterion === 'entropy' ? calculateEntropy(rootLabels) : calculateGini(rootLabels)),
    [criterion, rootLabels]
  );

  return (
    <Card className="p-6 space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold text-foreground">
              Decision tree split builder & impurity lab
            </h3>
            <Badge variant="outline" size="sm">
              Play Tennis Dataset
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Compare candidate split attributes on the 14-sample Mitchell benchmark dataset: evaluate{' '}
            <span className="text-cream font-medium">Shannon Entropy vs Gini Impurity</span>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-muted/40 p-1 rounded-lg border border-border/50 text-xs">
            <button
              onClick={() => setCriterion('entropy')}
              className={`px-3 py-1 rounded transition-colors ${
                criterion === 'entropy'
                  ? 'bg-primary text-primary-foreground font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Entropy (ID3)
            </button>
            <button
              onClick={() => setCriterion('gini')}
              className={`px-3 py-1 rounded transition-colors ${
                criterion === 'gini'
                  ? 'bg-primary text-primary-foreground font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Gini Impurity (CART)
            </button>
          </div>

          <div className="flex bg-muted/40 p-1 rounded-lg border border-border/50 text-xs">
            <button
              onClick={() => setActiveTab('visualizer')}
              className={`px-3 py-1 rounded transition-colors ${
                activeTab === 'visualizer'
                  ? 'bg-primary text-primary-foreground font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Split Visualizer
            </button>
            <button
              onClick={() => setActiveTab('dataset')}
              className={`px-3 py-1 rounded transition-colors ${
                activeTab === 'dataset'
                  ? 'bg-primary text-primary-foreground font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Data Table (14 rows)
            </button>
          </div>
        </div>
      </div>

      {/* Feature Selector Strip */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
            Select candidate feature to split on:
          </label>
          <Toggle
            label="Make It Fail: Add Unique ID Feature"
            checked={includeIdTrap}
            onChange={(checked: boolean) => {
              setIncludeIdTrap(checked);
              if (checked) setSelectedFeature('sample_id');
              else if (selectedFeature === 'sample_id') setSelectedFeature('outlook');
            }}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {candidateEvaluations.map((cand) => {
            const isSelected = cand.attribute === selectedFeature;
            const isWinner =
              cand.attribute === 'outlook' || (includeIdTrap && cand.attribute === 'sample_id');
            return (
              <button
                key={cand.attribute}
                onClick={() => setSelectedFeature(cand.attribute)}
                className={`p-3 rounded-lg border text-left transition-all relative ${
                  isSelected
                    ? 'border-cream/80 bg-cream/10 text-foreground shadow-sm'
                    : 'border-border/60 bg-muted/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm capitalize font-medium">{cand.attribute}</span>
                  {isWinner && (
                    <Badge variant="success" size="sm">
                      {cand.attribute === 'sample_id' ? 'TRAP' : 'BEST'}
                    </Badge>
                  )}
                </div>
                <div className="mt-2 text-xs flex justify-between items-center text-muted-foreground">
                  <span>Gain:</span>
                  <span
                    className={`font-mono font-bold ${
                      isSelected ? 'text-cream' : 'text-foreground'
                    }`}
                  >
                    {cand.gain.toFixed(3)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {includeIdTrap && selectedFeature === 'sample_id' && (
        <div className="p-4 rounded-lg bg-danger/10 border border-danger/30 text-xs text-danger-foreground space-y-1">
          <div className="font-semibold text-sm flex items-center gap-1.5 text-rose-400">
            <span>Critical Failure Mode: The Unique ID Trap</span>
          </div>
          <p>
            When splitting on unique IDs, every partition has size 1 and is 100% pure (impurity =
            0). Raw Information Gain produces a deceivingly high score of{' '}
            <strong className="text-white">{selectedEvaluation.gain.toFixed(3)}</strong>, causing
            ID3 to select a completely useless attribute with zero predictive generalization.
          </p>
          <p className="text-muted-foreground">
            C4.5 fixes this by dividing Gain by Split Information (
            {selectedEvaluation.splitInfo?.toFixed(3)}), reducing Gain Ratio down to{' '}
            {selectedEvaluation.gainRatio?.toFixed(3)}.
          </p>
        </div>
      )}

      {/* Main Visualizer or Data Table */}
      {activeTab === 'visualizer' ? (
        <div className="space-y-6">
          {/* Split Architecture Diagram */}
          <div className="p-4 rounded-xl border border-border/60 bg-black/30 space-y-4">
            {/* Parent Node */}
            <div className="flex flex-col items-center">
              <div className="p-4 rounded-lg border border-border/80 bg-muted/30 text-center w-full max-w-sm">
                <span className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                  Parent Node (Full Dataset)
                </span>
                <div className="mt-1 flex items-center justify-center gap-4 text-sm">
                  <span>
                    Total: <strong className="text-foreground">14</strong>
                  </span>
                  <span className="text-emerald-400">9 Yes</span>
                  <span className="text-rose-400">5 No</span>
                </div>
                <div className="mt-2 text-xs font-mono text-muted-foreground border-t border-border/40 pt-1.5 flex justify-between">
                  <span>{criterion === 'entropy' ? 'H(S):' : 'Gini(S):'}</span>
                  <span className="text-cream font-bold">{rootImpurity.toFixed(3)}</span>
                </div>
              </div>

              {/* Connecting Split Stem */}
              <div className="w-0.5 h-6 bg-border/80 my-1"></div>
              <div className="px-3 py-1 rounded-full border border-cream/50 bg-black text-xs font-mono text-cream">
                Split by: <strong className="capitalize">{selectedFeature}</strong>
              </div>
              <div className="w-0.5 h-6 bg-border/80 my-1"></div>
            </div>

            {/* Child Partitions Branches */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {selectedEvaluation.subsets.map((subset) => {
                const yesCount = subset.distribution['Yes'] ?? 0;
                const noCount = subset.distribution['No'] ?? 0;
                const isPure = subset.impurity === 0;

                return (
                  <div
                    key={subset.value}
                    className={`p-3.5 rounded-lg border flex flex-col justify-between ${
                      isPure
                        ? 'border-emerald-500/40 bg-emerald-500/5'
                        : 'border-border/60 bg-muted/20'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-foreground capitalize">
                          {subset.value}
                        </span>
                        {isPure && (
                          <Badge variant="success" size="sm">
                            Pure Leaf
                          </Badge>
                        )}
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                        <span>Instances:</span>
                        <span className="font-mono font-medium text-foreground">
                          {subset.count} / 14 ({((subset.count / 14) * 100).toFixed(1)}%)
                        </span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-xs">
                        <span>Class breakdown:</span>
                        <span className="font-mono">
                          <span className="text-emerald-400 font-bold">{yesCount} Yes</span>
                          {' / '}
                          <span className="text-rose-400 font-bold">{noCount} No</span>
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-border/40 text-xs flex justify-between font-mono">
                      <span className="text-muted-foreground">
                        {criterion === 'entropy' ? 'Entropy:' : 'Gini:'}
                      </span>
                      <span className={isPure ? 'text-emerald-400 font-bold' : 'text-cream'}>
                        {subset.impurity.toFixed(3)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mathematical Decomposition Box */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-border/60 bg-muted/10 space-y-1">
              <span className="text-xs uppercase text-muted-foreground font-semibold">
                1. Prior Impurity
              </span>
              <div className="text-2xl font-bold font-mono text-foreground">
                {selectedEvaluation.impurityBefore.toFixed(3)}
              </div>
              <p className="text-xs text-muted-foreground">
                Initial uncertainty of the parent node before taking any partition.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-border/60 bg-muted/10 space-y-1">
              <span className="text-xs uppercase text-muted-foreground font-semibold">
                2. Weighted Child Impurity
              </span>
              <div className="text-2xl font-bold font-mono text-foreground">
                {selectedEvaluation.weightedImpurity.toFixed(3)}
              </div>
              <p className="text-xs text-muted-foreground">
                {'$\\sum \\frac{|S_v|}{|S|} I(S_v)$ across all resulting branches.'}
              </p>
            </div>

            <div className="p-4 rounded-lg border border-cream/40 bg-cream/5 space-y-1">
              <span className="text-xs uppercase text-cream font-semibold">
                3. Net Information Gain
              </span>
              <div className="text-2xl font-bold font-mono text-cream">
                {selectedEvaluation.gain.toFixed(3)}
              </div>
              <p className="text-xs text-muted-foreground">
                {'Reduction in impurity achieved: $I_{parent} - I_{weighted}$.'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Dataset Tab */
        <div className="overflow-x-auto border border-border/60 rounded-lg">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-muted/40 text-muted-foreground border-b border-border/40 uppercase">
              <tr>
                <th className="p-2.5">Day</th>
                <th className="p-2.5">Outlook</th>
                <th className="p-2.5">Temp</th>
                <th className="p-2.5">Humidity</th>
                <th className="p-2.5">Wind</th>
                <th className="p-2.5">Play (Target)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {PLAY_TENNIS_DATA.map((row: TennisRow) => {
                return (
                  <tr key={row.day} className="hover:bg-muted/20">
                    <td className="p-2.5 font-bold text-muted-foreground">{row.day}</td>
                    <td
                      className={`p-2.5 ${
                        selectedFeature === 'outlook' ? 'bg-cream/10 text-cream font-bold' : ''
                      }`}
                    >
                      {row.outlook}
                    </td>
                    <td
                      className={`p-2.5 ${
                        selectedFeature === 'temp' ? 'bg-cream/10 text-cream font-bold' : ''
                      }`}
                    >
                      {row.temp}
                    </td>
                    <td
                      className={`p-2.5 ${
                        selectedFeature === 'humidity' ? 'bg-cream/10 text-cream font-bold' : ''
                      }`}
                    >
                      {row.humidity}
                    </td>
                    <td
                      className={`p-2.5 ${
                        selectedFeature === 'wind' ? 'bg-cream/10 text-cream font-bold' : ''
                      }`}
                    >
                      {row.wind}
                    </td>
                    <td className="p-2.5">
                      <span
                        className={`px-2 py-0.5 rounded font-semibold ${
                          row.play === 'Yes'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {row.play}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer Insight */}
      <div className="p-3.5 rounded-lg bg-muted/30 border border-border/40 text-xs text-muted-foreground flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <span className="font-semibold text-foreground">Algorithmic Decision: </span>
          <span>
            {selectedEvaluation.attribute === 'outlook' ? (
              <strong className="text-emerald-400">
                Outlook provides the global maximum information gain (0.247) and is picked as the
                root.
              </strong>
            ) : selectedEvaluation.attribute === 'sample_id' ? (
              <strong className="text-rose-400">
                Unique ID produces artificial zero entropy, causing massive training overfitting.
              </strong>
            ) : (
              <span>
                {selectedEvaluation.attribute} offers gain of {selectedEvaluation.gain.toFixed(3)},
                which is lower than Outlook (0.247).
              </span>
            )}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSelectedFeature('outlook');
            setIncludeIdTrap(false);
            setCriterion('entropy');
          }}
        >
          Reset Benchmark
        </Button>
      </div>
    </Card>
  );
};
