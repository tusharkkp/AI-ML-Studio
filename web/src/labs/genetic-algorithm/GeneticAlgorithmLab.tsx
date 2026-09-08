import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Slider } from '@/components/ui/Slider';
import { runGeneticAlgorithm } from '@/engines/genetic/optimizer/engine';
import type { SelectionMethod, CrossoverMethod } from '@/engines/genetic/optimizer/types';
import { RotateCcw, AlertTriangle, Dna, Activity } from 'lucide-react';

interface PresetTarget {
  id: string;
  name: string;
  target: string;
  description: string;
}

const PRESET_TARGETS: PresetTarget[] = [
  {
    id: 'onemax',
    name: '16-bit OneMax',
    target: '1111111111111111',
    description:
      'Canonical benchmark: evolve an unguided random bitstring into sixteen consecutive 1s.',
  },
  {
    id: 'phrase',
    name: 'Target Word: ARTIFICIAL',
    target: 'ARTIFICIAL',
    description:
      'Darwinian string synthesis: 27-character alphabet space search (27¹⁰ ≈ 2.05 × 10¹⁴ combinations).',
  },
  {
    id: 'checkerboard',
    name: 'Alternating Bits',
    target: '1010101010101010',
    description: 'Alternating bit pattern testing multi-schema building block convergence.',
  },
];

export function GeneticAlgorithmLab() {
  const [selectedTargetId, setSelectedTargetId] = useState<string>('onemax');
  const [populationSize, setPopulationSize] = useState<number>(30);
  const [mutationRate, setMutationRate] = useState<number>(0.02);
  const [crossoverRate, setCrossoverRate] = useState<number>(0.8);
  const [elitismCount, setElitismCount] = useState<number>(2);
  const [selectionMethod, setSelectionMethod] = useState<SelectionMethod>('tournament');
  const [crossoverMethod, setCrossoverMethod] = useState<CrossoverMethod>('single_point');
  const [currentGenIndex, setCurrentGenIndex] = useState<number>(0);
  const [seed, setSeed] = useState<number>(42);

  const activePreset = useMemo(
    () => PRESET_TARGETS.find((p) => p.id === selectedTargetId) ?? PRESET_TARGETS[0]!,
    [selectedTargetId]
  );

  const target = activePreset.target;
  const maxFitness = target.length;

  const gaResult = useMemo(() => {
    return runGeneticAlgorithm({
      target,
      populationSize,
      mutationRate,
      crossoverRate,
      elitismCount,
      selectionMethod,
      crossoverMethod,
      maxGenerations: 50,
      randomSeed: seed,
    });
  }, [
    target,
    populationSize,
    mutationRate,
    crossoverRate,
    elitismCount,
    selectionMethod,
    crossoverMethod,
    seed,
  ]);

  const totalGens = gaResult.steps.length;
  const currentStep =
    gaResult.steps[Math.min(currentGenIndex, totalGens - 1)] ?? gaResult.steps[0]!;

  const handleNextGen = () => {
    setCurrentGenIndex((prev) => Math.min(prev + 1, totalGens - 1));
  };

  const handlePrevGen = () => {
    setCurrentGenIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleReset = () => {
    setCurrentGenIndex(0);
    setSeed((s) => s + 1);
  };

  const handleJumpToEnd = () => {
    setCurrentGenIndex(totalGens - 1);
  };

  const handleTriggerStagnation = () => {
    setMutationRate(0);
    setElitismCount(0);
    setCurrentGenIndex(0);
    setSeed(101);
  };

  const handleTriggerHyperMutation = () => {
    setMutationRate(0.5);
    setCurrentGenIndex(0);
    setSeed(202);
  };

  // SVG Chart points calculation
  const chartWidth = 420;
  const chartHeight = 140;
  const padding = 20;

  const bestPoints = gaResult.steps
    .map((s, idx) => {
      const x = padding + (idx / Math.max(1, totalGens - 1)) * (chartWidth - 2 * padding);
      const y =
        chartHeight -
        padding -
        (s.bestIndividual.fitness / maxFitness) * (chartHeight - 2 * padding);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const avgPoints = gaResult.steps
    .map((s, idx) => {
      const x = padding + (idx / Math.max(1, totalGens - 1)) * (chartWidth - 2 * padding);
      const y =
        chartHeight - padding - (s.averageFitness / maxFitness) * (chartHeight - 2 * padding);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const currentMarkerX =
    padding + (currentStep.generation / Math.max(1, totalGens - 1)) * (chartWidth - 2 * padding);

  return (
    <Card className="p-6 bg-[#0c0a09] border-[#292524] text-stone-300">
      {/* Header and Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-[#292524]">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-heading font-semibold text-lg text-white">
              Genetic Algorithm Evolutionary Arena
            </span>
            <Badge variant="unit">Holland Schema Optimization</Badge>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Watch random bitstrings evolve through{' '}
            <span className="font-heading text-[#fef3c7] font-semibold">
              fitness selection, crossover, and mutation
            </span>
            .
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleTriggerStagnation}
            className="border-amber-600/60 text-amber-300 hover:bg-amber-950/40 text-xs"
          >
            <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-400" />
            Make it fail: Zero Mutation
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleTriggerHyperMutation}
            className="border-rose-600/60 text-rose-300 hover:bg-rose-950/40 text-xs"
          >
            <AlertTriangle className="w-3.5 h-3.5 mr-1 text-rose-400" />
            Make it fail: 50% Chaos
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset} className="text-xs">
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> Re-seed
          </Button>
        </div>
      </div>

      {/* Preset Target Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6">
        {PRESET_TARGETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => {
              setSelectedTargetId(p.id);
              setCurrentGenIndex(0);
            }}
            className={`p-3 text-left rounded-md border transition-all text-xs ${
              selectedTargetId === p.id
                ? 'bg-[#1c1917] border-stone-600 text-white font-medium'
                : 'bg-[#141210] border-[#292524] text-stone-400 hover:text-stone-200'
            }`}
          >
            <div className="font-semibold text-stone-200">{p.name}</div>
            <div className="font-mono text-[11px] text-amber-400/90 mt-0.5 truncate">
              Target: {p.target}
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Fitness Sparkline Chart & Population Inspector */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Fitness Evolution Curve */}
          <div className="bg-[#141210] border border-[#292524] p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold text-stone-200">
                  Fitness Convergence Curve
                </span>
              </div>
              <div className="flex items-center gap-4 text-[11px] font-mono">
                <span className="flex items-center gap-1.5 text-amber-300">
                  <span className="w-2.5 h-0.5 bg-amber-400 rounded-full inline-block" /> Best:{' '}
                  {currentStep.bestIndividual.fitness}/{maxFitness}
                </span>
                <span className="flex items-center gap-1.5 text-sky-400">
                  <span className="w-2.5 h-0.5 bg-sky-400 rounded-full inline-block" /> Avg:{' '}
                  {currentStep.averageFitness}
                </span>
              </div>
            </div>

            <div className="relative bg-[#0c0a09] border border-[#292524] rounded-md p-2 flex justify-center">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full max-w-[420px] h-32 overflow-visible"
              >
                {/* Horizontal reference gridlines */}
                <line
                  x1={padding}
                  y1={padding}
                  x2={chartWidth - padding}
                  y2={padding}
                  stroke="#292524"
                  strokeDasharray="3 3"
                />
                <line
                  x1={padding}
                  y1={chartHeight / 2}
                  x2={chartWidth - padding}
                  y2={chartHeight / 2}
                  stroke="#292524"
                  strokeDasharray="3 3"
                />
                <line
                  x1={padding}
                  y1={chartHeight - padding}
                  x2={chartWidth - padding}
                  y2={chartHeight - padding}
                  stroke="#292524"
                />

                {/* Target Max Fitness Line */}
                <line
                  x1={padding}
                  y1={padding}
                  x2={chartWidth - padding}
                  y2={padding}
                  stroke="#10b981"
                  strokeWidth="1"
                  strokeDasharray="4 2"
                />

                {/* Average Fitness Polyline */}
                <polyline fill="none" stroke="#38bdf8" strokeWidth="2" points={avgPoints} />

                {/* Best Fitness Polyline */}
                <polyline fill="none" stroke="#fef3c7" strokeWidth="2.5" points={bestPoints} />

                {/* Current Generation Vertical Scrub Line */}
                <line
                  x1={currentMarkerX}
                  y1={padding}
                  x2={currentMarkerX}
                  y2={chartHeight - padding}
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
            <div className="flex justify-between text-[10px] font-mono text-stone-500 mt-1 px-2">
              <span>Gen 0</span>
              <span>Gen {Math.floor(totalGens / 2)}</span>
              <span>Gen {totalGens - 1}</span>
            </div>
          </div>

          {/* Population Inspector */}
          <div className="bg-[#141210] border border-[#292524] p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Dna className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-stone-200">
                  Gen {currentStep.generation} Chromosome Sample
                </span>
              </div>
              <span className="text-[11px] font-mono text-stone-400">Matches / Length</span>
            </div>

            <div className="space-y-1.5 font-mono text-xs">
              {currentStep.populationSample.map((ind, idx) => {
                const isBest = idx === 0;
                return (
                  <div
                    key={`${ind.chromosome}-${idx}`}
                    className={`flex items-center justify-between p-2 rounded border ${
                      isBest
                        ? 'bg-amber-950/20 border-amber-800/60 text-white'
                        : 'bg-[#181513] border-[#292524] text-stone-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-stone-500 w-4">#{idx + 1}</span>
                      <div className="tracking-widest flex">
                        {ind.chromosome.split('').map((ch, chIdx) => {
                          const matches = ch === target[chIdx];
                          return (
                            <span
                              key={`${chIdx}-${ch}`}
                              className={matches ? 'text-emerald-400 font-bold' : 'text-stone-600'}
                            >
                              {ch}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold">
                        {ind.fitness}/{maxFitness}
                      </span>
                      <span className="text-[10px] text-stone-500">
                        ({Math.round((ind.fitness / maxFitness) * 100)}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Hyper-parameters & Step Scrubbing Controls */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Generation Scrubbing Controls */}
          <div className="bg-[#141210] border border-[#292524] p-4 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-200">Generation Timeline</span>
              <Badge variant="unit">
                Gen {currentStep.generation} of {totalGens - 1}
              </Badge>
            </div>

            <Slider
              label="Scrub Generation"
              value={currentGenIndex}
              min={0}
              max={totalGens - 1}
              step={1}
              onChange={(v) => setCurrentGenIndex(v)}
            />

            <div className="flex items-center justify-between gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevGen}
                disabled={currentGenIndex === 0}
                className="text-xs flex-1"
              >
                ← Prev Gen
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleNextGen}
                disabled={currentGenIndex >= totalGens - 1}
                className="text-xs flex-1"
              >
                Next Gen →
              </Button>
              <Button variant="outline" size="sm" onClick={handleJumpToEnd} className="text-xs">
                End
              </Button>
            </div>
          </div>

          {/* Genetic Operators & Hyperparameters */}
          <div className="bg-[#141210] border border-[#292524] p-4 rounded-lg space-y-4">
            <div className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
              Evolutionary Parameters
            </div>

            <Slider
              label="Population Size (N)"
              value={populationSize}
              min={10}
              max={80}
              step={10}
              unit="individuals"
              onChange={(v) => {
                setPopulationSize(v);
                setCurrentGenIndex(0);
              }}
            />

            <Slider
              label="Mutation Rate (p_m)"
              value={mutationRate}
              min={0}
              max={0.15}
              step={0.005}
              unit=""
              onChange={(v) => {
                setMutationRate(Number(v.toFixed(3)));
                setCurrentGenIndex(0);
              }}
              helperText="Typical range: 0.001 to 0.05. Zero causes stagnation; >0.1 causes random drift."
            />

            <Slider
              label="Crossover Rate (p_c)"
              value={crossoverRate}
              min={0.4}
              max={1.0}
              step={0.05}
              unit=""
              onChange={(v) => {
                setCrossoverRate(Number(v.toFixed(2)));
                setCurrentGenIndex(0);
              }}
            />

            <Slider
              label="Elitism Count (E)"
              value={elitismCount}
              min={0}
              max={5}
              step={1}
              unit="clones"
              onChange={(v) => {
                setElitismCount(v);
                setCurrentGenIndex(0);
              }}
              helperText="Copies top E chromosomes unchanged to guarantee monotonic fitness progress."
            />

            {/* Operator Selection */}
            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              <div>
                <label className="text-[11px] text-stone-400 font-semibold mb-1 block">
                  Selection
                </label>
                <select
                  value={selectionMethod}
                  onChange={(e) => {
                    setSelectionMethod(e.target.value as SelectionMethod);
                    setCurrentGenIndex(0);
                  }}
                  className="w-full bg-[#1e1b18] border border-[#292524] rounded p-1.5 text-stone-200"
                >
                  <option value="tournament">Tournament (k=3)</option>
                  <option value="roulette">Roulette Wheel</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-stone-400 font-semibold mb-1 block">
                  Crossover
                </label>
                <select
                  value={crossoverMethod}
                  onChange={(e) => {
                    setCrossoverMethod(e.target.value as CrossoverMethod);
                    setCurrentGenIndex(0);
                  }}
                  className="w-full bg-[#1e1b18] border border-[#292524] rounded p-1.5 text-stone-200"
                >
                  <option value="single_point">Single-Point</option>
                  <option value="two_point">Two-Point</option>
                  <option value="uniform">Uniform</option>
                </select>
              </div>
            </div>
          </div>

          {/* Stagnation Diagnostics Callout */}
          <div
            className={`p-3 rounded-lg border text-xs leading-relaxed ${
              mutationRate === 0
                ? 'bg-amber-950/30 border-amber-700/60 text-amber-200'
                : mutationRate >= 0.2
                  ? 'bg-rose-950/30 border-rose-700/60 text-rose-200'
                  : 'bg-[#171412] border-[#292524] text-stone-300'
            }`}
          >
            <div className="font-semibold mb-1 flex items-center gap-1.5">
              {mutationRate === 0 ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  Premature Convergence (Zero Mutation)
                </>
              ) : mutationRate >= 0.2 ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  Hyper-Mutation Disrupting Schemas
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                  Balanced Evolutionary Search
                </>
              )}
            </div>
            <p>
              {mutationRate === 0
                ? 'With mutation set to 0, if none of the initial chromosomes contain the correct allele at position i, crossover can NEVER discover it. The population converges prematurely on a local optimum.'
                : mutationRate >= 0.2
                  ? 'With high mutation rate (≥ 20%), beneficial building blocks (schemas) are broken apart faster than selection can reproduce them, deteriorating into undirected random search.'
                  : 'Selection concentrates copies of high-fitness schemas, crossover recombines complementary building blocks, and low mutation maintains genetic diversity.'}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
