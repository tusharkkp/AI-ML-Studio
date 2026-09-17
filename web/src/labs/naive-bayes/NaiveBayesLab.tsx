import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Toggle } from '@/components/ui/Toggle';
import {
  trainCategoricalNaiveBayes,
  predictCategoricalNaiveBayes,
} from '@/engines/probabilistic/naive-bayes';
import { AlertTriangle, RefreshCw, Mail, Sparkles } from 'lucide-react';

const SPAM_TRAINING_DATA = [
  { word1: 'lottery', word2: 'crypto', word3: 'urgent', target: 'Spam' },
  { word1: 'lottery', word2: 'prize', word3: 'claim', target: 'Spam' },
  { word1: 'crypto', word2: 'free', word3: 'urgent', target: 'Spam' },
  { word1: 'prize', word2: 'claim', word3: 'cash', target: 'Spam' },
  { word1: 'meeting', word2: 'project', word3: 'review', target: 'Ham' },
  { word1: 'meeting', word2: 'deadline', word3: 'report', target: 'Ham' },
  { word1: 'project', word2: 'schedule', word3: 'review', target: 'Ham' },
  { word1: 'invoice', word2: 'attached', word3: 'report', target: 'Ham' },
  { word1: 'lunch', word2: 'meeting', word3: 'schedule', target: 'Ham' },
  { word1: 'urgent', word2: 'project', word3: 'deadline', target: 'Ham' },
];

const AVAILABLE_TOKENS = [
  'lottery',
  'crypto',
  'prize',
  'urgent',
  'meeting',
  'project',
  'review',
  'deadline',
  'invoice',
  'claim',
];

export function NaiveBayesLab() {
  const [selectedTokens, setSelectedTokens] = useState<string[]>(['urgent', 'meeting']);
  const [correlatedDuplicate, setCorrelatedDuplicate] = useState<boolean>(false);
  const alpha = 1.0;

  // Train model on 3-token samples
  const model = useMemo(() => {
    return trainCategoricalNaiveBayes(
      SPAM_TRAINING_DATA,
      ['word1', 'word2', 'word3'],
      'target',
      alpha
    );
  }, [alpha]);

  const toggleToken = (token: string) => {
    setSelectedTokens((prev) => {
      if (prev.includes(token)) {
        return prev.filter((t) => t !== token);
      }
      if (prev.length >= 4) {
        return [...prev.slice(1), token];
      }
      return [...prev, token];
    });
  };

  // Build query features
  const effectiveTokens = useMemo(() => {
    if (correlatedDuplicate && selectedTokens.includes('crypto')) {
      return [...selectedTokens, 'crypto', 'crypto'];
    }
    return selectedTokens;
  }, [selectedTokens, correlatedDuplicate]);

  // Compute prediction by mapping tokens to word positions
  const prediction = useMemo(() => {
    const query: Record<string, string> = {};
    if (effectiveTokens[0]) query['word1'] = effectiveTokens[0];
    if (effectiveTokens[1]) query['word2'] = effectiveTokens[1];
    if (effectiveTokens[2]) query['word3'] = effectiveTokens[2];

    return predictCategoricalNaiveBayes(model, query);
  }, [model, effectiveTokens]);

  const spamProb = (prediction.classProbabilities['Spam'] ?? 0) * 100;
  const hamProb = (prediction.classProbabilities['Ham'] ?? 0) * 100;

  return (
    <div className="space-y-6">
      {/* Configuration Card */}
      <Card className="bg-[#141210] border-[#292524]">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-white text-xl font-mono flex items-center gap-2">
                <Mail className="w-5 h-5 text-amber-400" />
                Naive Bayes Spam Classification Studio
              </CardTitle>
              <CardDescription className="text-stone-400">
                Inspect how conditional probability terms multiply in log-space and observe the
                effect of the independence assumption.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedTokens(['lottery', 'crypto']);
                  setCorrelatedDuplicate(false);
                }}
                className="text-xs border-[#292524] hover:bg-[#1c1917]"
              >
                Clear Spam
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedTokens(['meeting', 'project']);
                  setCorrelatedDuplicate(false);
                }}
                className="text-xs border-[#292524] hover:bg-[#1c1917]"
              >
                Clear Ham
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedTokens(['urgent', 'meeting']);
                  setCorrelatedDuplicate(false);
                }}
                className="text-xs border-[#292524] hover:bg-[#1c1917]"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1" />
                Ambiguous
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Token Selection Palette */}
          <div>
            <span className="text-xs font-mono text-stone-400 block mb-2">
              Select incoming email tokens (choose up to 3):
            </span>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_TOKENS.map((token) => {
                const isSelected = selectedTokens.includes(token);
                return (
                  <button
                    key={token}
                    onClick={() => toggleToken(token)}
                    className={`px-3 py-1.5 rounded-md font-mono text-xs transition-colors border ${
                      isSelected
                        ? 'bg-amber-400 text-black border-amber-300 font-bold'
                        : 'bg-[#1c1917] text-stone-300 border-[#292524] hover:border-stone-500'
                    }`}
                  >
                    "{token}"
                  </button>
                );
              })}
            </div>
          </div>

          {/* Independence Violation Toggle */}
          <div className="p-3 bg-[#0c0a09] border border-[#292524] rounded-lg">
            <Toggle
              label="Simulate Feature Correlation Violation"
              description="Duplicates the token 'crypto' multiple times to demonstrate overconfident posterior probability shifts."
              checked={correlatedDuplicate}
              onChange={() => setCorrelatedDuplicate((prev) => !prev)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Prediction Output Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          className={`p-4 border ${prediction.predictedClass === 'Spam' ? 'border-rose-500/50 bg-rose-950/20' : 'border-emerald-500/50 bg-emerald-950/20'}`}
        >
          <span className="text-xs font-mono uppercase tracking-wider block mb-1 text-stone-400">
            Model Decision
          </span>
          <div className="flex items-center gap-2">
            <span
              className={`text-2xl font-bold font-mono ${prediction.predictedClass === 'Spam' ? 'text-rose-400' : 'text-emerald-400'}`}
            >
              {prediction.predictedClass}
            </span>
            <Badge variant="outline" className="text-xs font-mono">
              MAP Decision
            </Badge>
          </div>
          <span className="text-xs text-stone-400 block mt-2">argmax_c P(c) · ∏ P(x_i | c)</span>
        </Card>

        <Card className="bg-[#141210] border-[#292524] p-4 text-center">
          <span className="text-xs text-stone-400 font-mono uppercase tracking-wider block mb-1">
            P(Spam | Message)
          </span>
          <span className="text-3xl font-extrabold font-mono text-rose-400">
            {spamProb.toFixed(1)}%
          </span>
          <div className="w-full bg-[#1c1917] h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-rose-500 h-full transition-all duration-300"
              style={{ width: `${spamProb}%` }}
            />
          </div>
        </Card>

        <Card className="bg-[#141210] border-[#292524] p-4 text-center">
          <span className="text-xs text-stone-400 font-mono uppercase tracking-wider block mb-1">
            P(Ham | Message)
          </span>
          <span className="text-3xl font-extrabold font-mono text-emerald-400">
            {hamProb.toFixed(1)}%
          </span>
          <div className="w-full bg-[#1c1917] h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${hamProb}%` }}
            />
          </div>
        </Card>
      </div>

      {/* Step-by-Step Likelihood Multiplication Matrix */}
      <Card className="bg-[#141210] border-[#292524]">
        <CardHeader>
          <CardTitle className="text-white text-base font-mono">
            Log-Likelihood Decomposition Table
          </CardTitle>
          <CardDescription className="text-stone-400 text-xs">
            Notice how individual conditional terms are added in log-domain to prevent
            floating-point underflow.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left">
              <thead>
                <tr className="border-b border-[#292524] text-stone-400">
                  <th className="py-2 px-3">Class</th>
                  <th className="py-2 px-3">Prior P(C)</th>
                  {effectiveTokens.map((t, idx) => (
                    <th key={idx} className="py-2 px-3 text-amber-300">
                      P("{t}" | C)
                    </th>
                  ))}
                  <th className="py-2 px-3">Log-Posterior Score</th>
                  <th className="py-2 px-3 text-right">Normalized Posterior</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#292524]">
                {model.classes.map((c) => {
                  const prior = model.classPriors[c] ?? 0;
                  const logPrior = model.logClassPriors[c] ?? 0;
                  const score = prediction.logPosteriors[c];
                  const prob = (prediction.classProbabilities[c] ?? 0) * 100;
                  const isWinner = prediction.predictedClass === c;

                  return (
                    <tr key={c} className={isWinner ? 'bg-amber-950/10' : ''}>
                      <td className="py-2.5 px-3 font-bold text-white flex items-center gap-1.5">
                        {c}
                        {isWinner && <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                      </td>
                      <td className="py-2.5 px-3 text-stone-300">
                        {prior.toFixed(2)}{' '}
                        <span className="text-stone-500">({logPrior.toFixed(2)})</span>
                      </td>
                      {effectiveTokens.map((t, idx) => {
                        const featureKey = `word${(idx % 3) + 1}`;
                        const likelihood = model.featureLikelihoods[c]?.[featureKey]?.[t] ?? 0.05;
                        return (
                          <td key={idx} className="py-2.5 px-3 text-stone-200">
                            {likelihood.toFixed(3)}
                          </td>
                        );
                      })}
                      <td className="py-2.5 px-3 text-stone-300 font-bold">
                        {score !== undefined ? score.toFixed(3) : 'N/A'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-[#fef3c7]">
                        {prob.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {correlatedDuplicate && (
            <div className="mt-4 p-3 bg-amber-950/20 border border-amber-500/30 rounded text-xs text-amber-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>
                <strong>Independence Trap:</strong> Notice how duplicating the word "crypto"
                artificially multiplies its likelihood term twice, overweighting its evidence and
                creating severe probability overconfidence. Naive Bayes assumes all features are
                conditionally independent given the class, which real natural language almost never
                satisfies!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
