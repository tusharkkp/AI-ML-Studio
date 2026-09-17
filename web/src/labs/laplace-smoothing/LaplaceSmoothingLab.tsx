import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Badge } from '@/components/ui/Badge';
import { ShieldAlert, Sparkles, RefreshCw, Info } from 'lucide-react';

export function LaplaceSmoothingLab() {
  const [alpha, setAlpha] = useState<number>(1.0);
  const [vocabSize, setVocabSize] = useState<number>(10);
  const [classTotalTokens, setClassTotalTokens] = useState<number>(40);

  // Sample words with their raw occurrences in the class
  const sampleWords = useMemo(
    () => [
      { word: 'free', count: 12, label: 'Frequent' },
      { word: 'win', count: 8, label: 'Moderate' },
      { word: 'claim', count: 3, label: 'Rare' },
      { word: 'cryptocurrency', count: 0, label: 'Unseen (Zero Trap!)' },
    ],
    []
  );

  // Compute probabilities with current alpha
  const calculatedWords = useMemo(() => {
    return sampleWords.map((item) => {
      const unsmoothed = classTotalTokens > 0 ? item.count / classTotalTokens : 0;
      const denominator = classTotalTokens + alpha * vocabSize;
      const smoothed = denominator > 0 ? (item.count + alpha) / denominator : 0;

      return {
        ...item,
        unsmoothed,
        smoothed,
      };
    });
  }, [sampleWords, alpha, vocabSize, classTotalTokens]);

  // Product calculation across the 4 words
  const unsmoothedProduct = useMemo(() => {
    return calculatedWords.reduce((acc, item) => acc * item.unsmoothed, 1);
  }, [calculatedWords]);

  const smoothedProduct = useMemo(() => {
    return calculatedWords.reduce((acc, item) => acc * item.smoothed, 1);
  }, [calculatedWords]);

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card className="bg-[#141210] border-[#292524]">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-white text-xl font-mono flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Laplace Smoothing (Additive Parameter α) Lab
              </CardTitle>
              <CardDescription className="text-stone-400">
                Witness how additive pseudo-counts rescue Naive Bayes from zero-probability
                catastrophic failure.
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAlpha(0.0)}
                className={`text-xs border-[#292524] ${alpha === 0.0 ? 'bg-rose-950/40 text-rose-300 border-rose-500/50' : 'hover:bg-[#1c1917]'}`}
              >
                α = 0.0 (Zero Trap)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAlpha(0.1)}
                className={`text-xs border-[#292524] ${alpha === 0.1 ? 'bg-amber-950/40 text-amber-300 border-amber-500/50' : 'hover:bg-[#1c1917]'}`}
              >
                α = 0.1 (Lidstone)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAlpha(1.0)}
                className={`text-xs border-[#292524] ${alpha === 1.0 ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/50' : 'hover:bg-[#1c1917]'}`}
              >
                α = 1.0 (Laplace)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setAlpha(1.0);
                  setVocabSize(10);
                  setClassTotalTokens(40);
                }}
                className="text-xs border-[#292524] hover:bg-[#1c1917]"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1" />
                Reset
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Smoothing Alpha Slider */}
            <div className="space-y-2">
              <Slider
                label="Smoothing Parameter (α)"
                value={alpha}
                min={0.0}
                max={5.0}
                step={0.05}
                onChange={(val) => setAlpha(val)}
                helperText={
                  alpha === 0
                    ? 'No smoothing: zero count zeroes the whole probability.'
                    : `Adds pseudo-count of ${alpha.toFixed(2)} to every vocabulary item.`
                }
              />
            </div>

            {/* Vocabulary Size Slider */}
            <div className="space-y-2">
              <Slider
                label="Vocabulary Size (|V|)"
                value={vocabSize}
                min={5}
                max={100}
                step={1}
                unit=" words"
                onChange={(val) => setVocabSize(val)}
                helperText="Total unique words known to the classifier."
              />
            </div>

            {/* Total Class Tokens Slider */}
            <div className="space-y-2">
              <Slider
                label="Class Token Count (N_c)"
                value={classTotalTokens}
                min={10}
                max={200}
                step={5}
                unit=" words"
                onChange={(val) => setClassTotalTokens(val)}
                helperText="Total words observed in this specific class during training."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Product Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card
          className={`p-4 border ${alpha === 0 ? 'border-rose-500/50 bg-rose-950/20' : 'border-[#292524] bg-[#141210]'}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-stone-400">
              Unsmoothed Joint Likelihood (α = 0)
            </span>
            <Badge variant="outline" className="border-rose-500/40 text-rose-300 text-xs">
              Zero Trap
            </Badge>
          </div>
          <span className="text-3xl font-extrabold font-mono text-rose-400">
            {unsmoothedProduct.toExponential(4)}
          </span>
          <span className="text-xs text-stone-400 block mt-2">
            Because "cryptocurrency" has count = 0, multiplying across all 4 words results in
            strictly <strong className="text-rose-300">0.0000</strong>.
          </span>
        </Card>

        <Card className="p-4 border border-emerald-500/50 bg-emerald-950/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-stone-400">
              Smoothed Joint Likelihood (α = {alpha.toFixed(2)})
            </span>
            <Badge variant="outline" className="border-emerald-500/40 text-emerald-300 text-xs">
              Rescued
            </Badge>
          </div>
          <span className="text-3xl font-extrabold font-mono text-emerald-400">
            {smoothedProduct.toExponential(4)}
          </span>
          <span className="text-xs text-stone-400 block mt-2">
            Every unseen word receives a calibrated non-zero probability floor of{' '}
            <strong className="text-emerald-300 font-mono">
              {alpha > 0
                ? ((alpha / (classTotalTokens + alpha * vocabSize)) * 100).toFixed(2)
                : '0'}
              %
            </strong>
            .
          </span>
        </Card>
      </div>

      {/* Word-by-Word Probability Matrix */}
      <Card className="bg-[#141210] border-[#292524]">
        <CardHeader>
          <CardTitle className="text-white text-base font-mono">
            Word-by-Word Probability Comparison
          </CardTitle>
          <CardDescription className="text-stone-400 text-xs">
            Denominator = N_c + α·|V| = {classTotalTokens} + {alpha.toFixed(2)} × {vocabSize} ={' '}
            {(classTotalTokens + alpha * vocabSize).toFixed(1)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left">
              <thead>
                <tr className="border-b border-[#292524] text-stone-400">
                  <th className="py-2.5 px-3">Word</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Count (N_ci)</th>
                  <th className="py-2.5 px-3">Unsmoothed P(w|C)</th>
                  <th className="py-2.5 px-3 text-amber-300">Smoothed P(w|C)</th>
                  <th className="py-2.5 px-3 text-right">Probability Shift</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#292524]">
                {calculatedWords.map((item) => {
                  const isUnseen = item.count === 0;
                  const shift = item.smoothed - item.unsmoothed;

                  return (
                    <tr key={item.word} className={isUnseen ? 'bg-rose-950/10' : ''}>
                      <td className="py-2.5 px-3 font-bold text-white flex items-center gap-2">
                        "{item.word}"
                        {isUnseen && <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />}
                      </td>
                      <td className="py-2.5 px-3 text-stone-400">{item.label}</td>
                      <td className="py-2.5 px-3 text-stone-200">{item.count}</td>
                      <td className="py-2.5 px-3 text-stone-400">
                        {item.unsmoothed > 0 ? (
                          (item.unsmoothed * 100).toFixed(2) + '%'
                        ) : (
                          <span className="text-rose-400 font-bold">0.00%</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-amber-300 font-bold">
                        {(item.smoothed * 100).toFixed(2)}%
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {shift > 0 ? (
                          <span className="text-emerald-400">+{(shift * 100).toFixed(2)}%</span>
                        ) : (
                          <span className="text-rose-400">{(shift * 100).toFixed(2)}%</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-3 bg-[#1c1917] border border-[#292524] rounded text-xs text-stone-300 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
            <p>
              <strong>The Conservation of Probability:</strong> Notice that smoothing does not
              invent new probability out of thin air. It shaves a small probability mass from the
              most frequent words (like "free" dropping slightly) and redistributes it across the
              unseen and rare words. As α approaches infinity, all word probabilities converge to a
              uniform prior of 1 / |V| = {((1 / vocabSize) * 100).toFixed(1)}%.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
