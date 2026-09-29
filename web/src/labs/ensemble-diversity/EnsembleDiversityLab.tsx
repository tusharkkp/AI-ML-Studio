import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Badge } from '@/components/ui/Badge';
import { SeededRNG } from '@/utils/rng';
import { simulateCondorcetJury } from '@/engines/ensemble/forest/engine';
import { Users, AlertTriangle, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

export function EnsembleDiversityLab() {
  const [individualAccuracy, setIndividualAccuracy] = useState<number>(0.65);
  const [voterCount, setVoterCount] = useState<number>(15); // Odd number
  const [correlation, setCorrelation] = useState<number>(0.0);
  const [seed, setSeed] = useState<number>(42);

  // Run simulation whenever parameters change
  const simResult = useMemo(() => {
    return simulateCondorcetJury(individualAccuracy, voterCount, correlation, 600, seed);
  }, [individualAccuracy, voterCount, correlation, seed]);

  // Single sample trial breakdown to visualize individual voters
  const singleTrialVoters = useMemo(() => {
    const rng = new SeededRNG(seed + 999);
    const commonShockActive = rng.next() < correlation;
    const commonShockCorrect = rng.next() < individualAccuracy;
    const voters: { id: number; isCorrect: boolean }[] = [];

    for (let v = 0; v < voterCount; v++) {
      let isCorrect: boolean;
      if (commonShockActive) {
        isCorrect = commonShockCorrect;
      } else {
        isCorrect = rng.next() < individualAccuracy;
      }
      voters.push({ id: v + 1, isCorrect });
    }
    return voters;
  }, [individualAccuracy, voterCount, correlation, seed]);

  const correctCount = singleTrialVoters.filter((v) => v.isCorrect).length;
  const majorityThreshold = Math.floor(voterCount / 2) + 1;
  const majorityWon = correctCount >= majorityThreshold;

  // Theoretical Ambiguity decomposition
  // E_ens = E_bar - A_bar
  const indError = 1 - individualAccuracy;
  // Diversity term approx proportional to (1 - correlation) * indError * (1 - 1/M)
  const theoreticalDiversity = Math.max(
    0,
    (1 - correlation) * indError * individualAccuracy * (1 - 1 / Math.max(1, voterCount))
  );
  const simulatedEnsembleError = 1 - simResult.simulatedMajorityAccuracy;

  return (
    <Card className="p-6 border border-orange-50/15 bg-neutral-900/50 backdrop-blur-sm space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-orange-50/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded border border-orange-50/20 bg-black/40 text-[10px] font-mono font-bold text-orange-200">
              LAB
            </span>
            <h3 className="font-manrope text-lg font-semibold text-foreground dark:text-white">
              Condorcet jury theorem & ensemble diversity studio
            </h3>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5 font-montserrat">
            Inspect how independent error cancellation elevates weak learners into near-certain
            consensus.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant={
              simResult.simulatedMajorityAccuracy >= individualAccuracy ? 'success' : 'danger'
            }
          >
            {simResult.simulatedMajorityAccuracy >= individualAccuracy
              ? 'Ensemble Advantage'
              : 'Ensemble Failure'}
          </Badge>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSeed((prev) => prev + 1)}
            className="flex items-center gap-1.5 text-xs"
          >
            <RotateCcw className="size-3" />
            <span>Re-roll Seed</span>
          </Button>
        </div>
      </div>

      {/* Control Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Slider
          label="Base learner accuracy (p)"
          value={Math.round(individualAccuracy * 100)}
          min={30}
          max={95}
          step={1}
          unit="%"
          onChange={(val) => setIndividualAccuracy(val / 100)}
          helperText="Accuracy of each individual base model (e.g. 65%)"
        />

        <Slider
          label="Ensemble voter count (M)"
          value={voterCount}
          min={3}
          max={49}
          step={2}
          unit=" trees"
          onChange={(val) => setVoterCount(val % 2 === 0 ? val + 1 : val)}
          helperText="Odd number of committee voters for unambiguous tie-breaking"
        />

        <Slider
          label="Inter-model correlation (ρ)"
          value={Math.round(correlation * 100)}
          min={0}
          max={95}
          step={5}
          unit="%"
          onChange={(val) => setCorrelation(val / 100)}
          helperText="Shared failure modes (0% = independent, 90% = herd behavior)"
        />
      </div>

      {/* Primary Metrics Comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-black/40 border border-orange-50/10">
          <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
            Single model baseline
          </div>
          <div className="text-2xl font-bold font-manrope text-neutral-200 mt-1">
            {(individualAccuracy * 100).toFixed(1)}%
          </div>
          <div className="text-[11px] text-neutral-500 mt-0.5">
            Error rate: {(indError * 100).toFixed(1)}%
          </div>
        </div>

        <div className="p-4 rounded-lg bg-black/40 border border-orange-50/10">
          <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
            Theoretical independent jury
          </div>
          <div className="text-2xl font-bold font-manrope text-emerald-400 mt-1">
            {(simResult.theoreticalIndependentAccuracy * 100).toFixed(1)}%
          </div>
          <div className="text-[11px] text-neutral-500 mt-0.5">Binomial CDF with ρ = 0</div>
        </div>

        <div className="p-4 rounded-lg bg-black/40 border border-orange-50/10">
          <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
            Simulated ensemble (with ρ)
          </div>
          <div
            className={`text-2xl font-bold font-manrope mt-1 ${
              simResult.simulatedMajorityAccuracy >= individualAccuracy
                ? 'text-brand'
                : 'text-rose-400'
            }`}
          >
            {(simResult.simulatedMajorityAccuracy * 100).toFixed(1)}%
          </div>
          <div className="text-[11px] text-neutral-500 mt-0.5">
            Delta vs single:{' '}
            {((simResult.simulatedMajorityAccuracy - individualAccuracy) * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Single Trial Voters Matrix */}
      <div className="p-4 rounded-lg bg-black/30 border border-orange-50/10 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Users className="size-4 text-orange-200" />
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Live Trial Vote Breakdown ({voterCount} Voters)
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span>
              Majority threshold: {majorityThreshold} / {voterCount}
            </span>
            <span
              className={`px-2 py-0.5 rounded font-semibold ${
                majorityWon
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/40'
                  : 'bg-rose-950/80 text-rose-300 border border-rose-800/40'
              }`}
            >
              {majorityWon ? 'Ensemble Correct (Win)' : 'Ensemble Misclassified (Loss)'}
            </span>
          </div>
        </div>

        {/* Voter grid pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {singleTrialVoters.map((voter) => (
            <div
              key={voter.id}
              className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono border transition-all ${
                voter.isCorrect
                  ? 'bg-emerald-950/40 border-emerald-600/30 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-600/30 text-rose-300'
              }`}
            >
              {voter.isCorrect ? (
                <CheckCircle2 className="size-3 text-emerald-400" />
              ) : (
                <XCircle className="size-3 text-rose-400" />
              )}
              <span>T{voter.id}</span>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-neutral-400 font-montserrat">
          Individual votes: <strong className="text-emerald-400">{correctCount}</strong> correct,{' '}
          <strong className="text-rose-400">{voterCount - correctCount}</strong> incorrect.
          {majorityWon && correctCount < voterCount && (
            <span className="ml-1 text-orange-200">
              Notice: individual errors were overridden by the collective majority!
            </span>
          )}
        </p>
      </div>

      {/* Krogh-Vedelsby Ambiguity Decomposition Visualizer */}
      <div className="p-4 rounded-lg bg-black/40 border border-orange-50/10 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-neutral-300 font-manrope">
            Ambiguity Decomposition (Krogh & Vedelsby, 1995)
          </span>
          <span className="font-mono text-[11px] text-neutral-400">
            {'E_ens = E_bar - Diversity'}
          </span>
        </div>

        <div className="space-y-1.5 font-mono text-xs">
          <div className="flex items-center justify-between text-neutral-400">
            <span>Average Individual Error (E_bar):</span>
            <span className="text-neutral-200">{(indError * 100).toFixed(1)}%</span>
          </div>
          <div className="flex items-center justify-between text-emerald-400">
            <span>Ensemble Diversity Term (Subtracted Bonus):</span>
            <span>-{(theoreticalDiversity * 100).toFixed(1)}%</span>
          </div>
          <div className="flex items-center justify-between text-orange-200 border-t border-neutral-800 pt-1 font-bold">
            <span>Net Ensemble Error:</span>
            <span>{(simulatedEnsembleError * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Failure mode experiment callout */}
      {individualAccuracy < 0.5 && (
        <div className="p-3 rounded-lg border border-rose-500/30 bg-rose-950/20 flex items-start gap-2.5 text-xs text-rose-200">
          <AlertTriangle className="size-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <strong>Condorcet Inversion Warning:</strong> Because individual accuracy is below 50% (
            {'<'} random guessing), adding more committee voters actively guarantees a 100% wrong
            decision. The collective ensemble amplifies misinformation when each voter is biased
            toward error.
          </div>
        </div>
      )}

      {correlation >= 0.7 && (
        <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-950/20 flex items-start gap-2.5 text-xs text-amber-200">
          <AlertTriangle className="size-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong>Diversity Collapse Warning:</strong> With inter-model correlation at{' '}
            {Math.round(correlation * 100)}%, voters exhibit herd behavior. When one voter fails,
            the entire committee fails simultaneously, completely negating ensemble variance
            reduction.
          </div>
        </div>
      )}
    </Card>
  );
}
