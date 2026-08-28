import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RotateCcw, AlertTriangle, CheckCircle2, Play, Waves } from 'lucide-react';

interface RiverState {
  ml: number; // Missionaries on Left bank (0..3)
  cl: number; // Cannibals on Left bank (0..3)
  boat: 'L' | 'R'; // Boat location
}

interface MoveAction {
  m: number; // Missionaries in boat (0..2)
  c: number; // Cannibals in boat (0..2)
  label: string;
}

const POSSIBLE_MOVES: MoveAction[] = [
  { m: 1, c: 0, label: '1 Missionary (1M)' },
  { m: 2, c: 0, label: '2 Missionaries (2M)' },
  { m: 0, c: 1, label: '1 Cannibal (1C)' },
  { m: 0, c: 2, label: '2 Cannibals (2C)' },
  { m: 1, c: 1, label: '1 Missionary + 1 Cannibal (1M 1C)' },
];

// Optimal 11-step solution path
const OPTIMAL_SOLUTION_PATH: { state: RiverState; move: string }[] = [
  { state: { ml: 3, cl: 3, boat: 'L' }, move: 'Start: 3M, 3C on left bank' },
  { state: { ml: 3, cl: 1, boat: 'R' }, move: 'Send 2 Cannibals across (2C →)' },
  { state: { ml: 3, cl: 2, boat: 'L' }, move: 'Return 1 Cannibal (← 1C)' },
  { state: { ml: 3, cl: 0, boat: 'R' }, move: 'Send 2 Cannibals across (2C →)' },
  { state: { ml: 3, cl: 1, boat: 'L' }, move: 'Return 1 Cannibal (← 1C)' },
  { state: { ml: 1, cl: 1, boat: 'R' }, move: 'Send 2 Missionaries across (2M →)' },
  { state: { ml: 2, cl: 2, boat: 'L' }, move: 'Return 1 Missionary + 1 Cannibal (← 1M 1C)' },
  { state: { ml: 0, cl: 2, boat: 'R' }, move: 'Send 2 Missionaries across (2M →)' },
  { state: { ml: 0, cl: 3, boat: 'L' }, move: 'Return 1 Cannibal (← 1C)' },
  { state: { ml: 0, cl: 1, boat: 'R' }, move: 'Send 2 Cannibals across (2C →)' },
  { state: { ml: 0, cl: 2, boat: 'L' }, move: 'Return 1 Cannibal (← 1C)' },
  { state: { ml: 0, cl: 0, boat: 'R' }, move: 'Send 2 Cannibals across (2C →) Goal reached!' },
];

export function StateSpaceLab() {
  const [currentState, setCurrentState] = useState<RiverState>({ ml: 3, cl: 3, boat: 'L' });
  const [history, setHistory] = useState<RiverState[]>([{ ml: 3, cl: 3, boat: 'L' }]);
  const [solutionStepIndex, setSolutionStepIndex] = useState<number>(0);

  // Derived state for Right bank
  const mr = 3 - currentState.ml;
  const cr = 3 - currentState.cl;

  // Validity check: on either bank, if M > 0, M >= C
  const isLeftBankViolated = currentState.ml > 0 && currentState.ml < currentState.cl;
  const isRightBankViolated = mr > 0 && mr < cr;
  const isFailed = isLeftBankViolated || isRightBankViolated;
  const isGoal = currentState.ml === 0 && currentState.cl === 0 && currentState.boat === 'R';

  // Apply move action
  const applyMove = (action: MoveAction) => {
    if (isFailed || isGoal) return;

    const boatSide = currentState.boat;
    let nextMl = currentState.ml;
    let nextCl = currentState.cl;

    if (boatSide === 'L') {
      if (action.m > nextMl || action.c > nextCl) return; // not enough people on left
      nextMl -= action.m;
      nextCl -= action.c;
    } else {
      if (action.m > mr || action.c > cr) return; // not enough people on right
      nextMl += action.m;
      nextCl += action.c;
    }

    const nextState: RiverState = {
      ml: nextMl,
      cl: nextCl,
      boat: boatSide === 'L' ? 'R' : 'L',
    };

    setCurrentState(nextState);
    setHistory((prev) => [...prev, nextState]);
  };

  const resetSimulation = () => {
    setCurrentState({ ml: 3, cl: 3, boat: 'L' });
    setHistory([{ ml: 3, cl: 3, boat: 'L' }]);
    setSolutionStepIndex(0);
  };

  const stepOptimalSolution = () => {
    if (solutionStepIndex < OPTIMAL_SOLUTION_PATH.length - 1) {
      const nextIndex = solutionStepIndex + 1;
      setSolutionStepIndex(nextIndex);
      const nextStep = OPTIMAL_SOLUTION_PATH[nextIndex]!;
      setCurrentState(nextStep.state);
      setHistory((prev) => [...prev, nextStep.state]);
    }
  };

  return (
    <Card className="p-6 my-6 border-card-edge bg-card-fill backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-card-edge pb-4">
        <div>
          <span className="text-xs font-mono text-neutral-500">Problem formulation lab</span>
          <h3 className="font-montserrat text-xl font-semibold text-foreground">
            Missionaries and Cannibals River Crossing
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={resetSimulation}
            className="flex items-center gap-1.5"
          >
            <RotateCcw className="size-3.5" />
            Reset
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={stepOptimalSolution}
            disabled={solutionStepIndex >= OPTIMAL_SOLUTION_PATH.length - 1}
            className="flex items-center gap-1.5"
          >
            <Play className="size-3.5" />
            Step Optimal Path ({solutionStepIndex}/11)
          </Button>
        </div>
      </div>

      {/* River Graphics Arena */}
      <div className="relative rounded-2xl border border-card-edge bg-[#080808] p-6 mb-6 overflow-hidden">
        {/* River Water Middle */}
        <div className="absolute inset-y-0 left-1/3 right-1/3 bg-blue-950/30 border-x border-blue-500/20 flex flex-col items-center justify-center pointer-events-none">
          <Waves className="size-8 text-blue-500/20 animate-pulse" />
          <span className="text-[10px] font-mono text-blue-400/40 uppercase tracking-widest mt-1">
            River Barrier
          </span>
        </div>

        <div className="grid grid-cols-12 gap-4 relative z-10 min-h-[220px]">
          {/* Left Bank */}
          <div className="col-span-4 rounded-xl border border-card-edge bg-card-fill/60 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-card-edge pb-2">
                <span className="font-montserrat font-semibold text-sm text-foreground">
                  Left Bank (Initial)
                </span>
                <span className="font-mono text-xs text-neutral-400">
                  ({currentState.ml}M, {currentState.cl}C)
                </span>
              </div>

              {/* Passenger Avatars */}
              <div className="space-y-2">
                <div>
                  <span className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                    Missionaries:
                  </span>
                  <div className="flex gap-1.5">
                    {Array.from({ length: currentState.ml }).map((_, i) => (
                      <span
                        key={i}
                        className="size-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-xs"
                      >
                        M
                      </span>
                    ))}
                    {currentState.ml === 0 && (
                      <span className="text-xs text-neutral-600 italic">None</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                    Cannibals:
                  </span>
                  <div className="flex gap-1.5">
                    {Array.from({ length: currentState.cl }).map((_, i) => (
                      <span
                        key={i}
                        className="size-7 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center font-bold text-xs"
                      >
                        C
                      </span>
                    ))}
                    {currentState.cl === 0 && (
                      <span className="text-xs text-neutral-600 italic">None</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Boat at Left */}
            <div className="mt-4 pt-2 border-t border-card-edge text-center">
              {currentState.boat === 'L' ? (
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-semibold">
                  ⛵ Boat is docked on Left
                </div>
              ) : (
                <span className="text-xs text-neutral-600">Boat away</span>
              )}
            </div>
          </div>

          {/* Center River Crossing Dynamics */}
          <div className="col-span-4 flex flex-col items-center justify-center p-2 text-center">
            {isFailed ? (
              <div className="p-4 rounded-xl border border-rose-500/40 bg-rose-950/40 text-rose-300 space-y-2">
                <AlertTriangle className="size-7 text-rose-400 mx-auto" />
                <h4 className="font-montserrat font-semibold text-sm">Constraint Violated!</h4>
                <p className="text-xs text-rose-300/80 leading-relaxed">
                  Cannibals outnumbered Missionaries on the {isLeftBankViolated ? 'Left' : 'Right'}{' '}
                  bank! The missionaries were eaten.
                </p>
                <Button size="sm" variant="danger" onClick={resetSimulation} className="mt-2">
                  Try Again
                </Button>
              </div>
            ) : isGoal ? (
              <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/40 text-emerald-300 space-y-2">
                <CheckCircle2 className="size-7 text-emerald-400 mx-auto" />
                <h4 className="font-montserrat font-semibold text-sm">Goal Reached!</h4>
                <p className="text-xs text-emerald-300/80 leading-relaxed">
                  All 3 Missionaries and 3 Cannibals safely crossed in {history.length - 1} boat
                  transfers!
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="font-mono text-xs text-neutral-400">
                  Current State tuple:
                  <span className="block text-foreground font-bold mt-0.5">
                    ({currentState.ml}, {currentState.cl}, '{currentState.boat}')
                  </span>
                </div>
                <div className="text-[11px] text-neutral-500">
                  Total moves made: {history.length - 1}
                </div>
              </div>
            )}
          </div>

          {/* Right Bank */}
          <div className="col-span-4 rounded-xl border border-card-edge bg-card-fill/60 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-card-edge pb-2">
                <span className="font-montserrat font-semibold text-sm text-foreground">
                  Right Bank (Goal)
                </span>
                <span className="font-mono text-xs text-neutral-400">
                  ({mr}M, {cr}C)
                </span>
              </div>

              {/* Passenger Avatars */}
              <div className="space-y-2">
                <div>
                  <span className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                    Missionaries:
                  </span>
                  <div className="flex gap-1.5">
                    {Array.from({ length: mr }).map((_, i) => (
                      <span
                        key={i}
                        className="size-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-xs"
                      >
                        M
                      </span>
                    ))}
                    {mr === 0 && <span className="text-xs text-neutral-600 italic">None</span>}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                    Cannibals:
                  </span>
                  <div className="flex gap-1.5">
                    {Array.from({ length: cr }).map((_, i) => (
                      <span
                        key={i}
                        className="size-7 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center font-bold text-xs"
                      >
                        C
                      </span>
                    ))}
                    {cr === 0 && <span className="text-xs text-neutral-600 italic">None</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Boat at Right */}
            <div className="mt-4 pt-2 border-t border-card-edge text-center">
              {currentState.boat === 'R' ? (
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-semibold">
                  ⛵ Boat is docked on Right
                </div>
              ) : (
                <span className="text-xs text-neutral-600">Boat away</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Controls: Board Boat & Sail */}
      {!isFailed && !isGoal && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-neutral-400">
              Select passenger manifest to cross from{' '}
              {currentState.boat === 'L' ? 'Left to Right' : 'Right to Left'}:
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {POSSIBLE_MOVES.map((action, idx) => {
              const currentAvailableM = currentState.boat === 'L' ? currentState.ml : mr;
              const currentAvailableC = currentState.boat === 'L' ? currentState.cl : cr;
              const canAfford = action.m <= currentAvailableM && action.c <= currentAvailableC;

              return (
                <Button
                  key={idx}
                  size="sm"
                  variant="outline"
                  disabled={!canAfford}
                  onClick={() => applyMove(action)}
                  className="w-full text-xs py-2 h-auto text-center"
                >
                  {action.label}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* State-Space Formalism Panel */}
      <div className="mt-6 pt-4 border-t border-card-edge grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs font-mono">
        <div className="p-3 rounded-lg border border-card-edge bg-card-fill">
          <span className="text-neutral-500 block mb-1">Initial State S₀</span>
          <span className="text-foreground font-semibold">(3, 3, 'L')</span>
        </div>
        <div className="p-3 rounded-lg border border-card-edge bg-card-fill">
          <span className="text-neutral-500 block mb-1">Actions(s)</span>
          <span className="text-foreground font-semibold">1M, 2M, 1C, 2C, 1M1C</span>
        </div>
        <div className="p-3 rounded-lg border border-card-edge bg-card-fill">
          <span className="text-neutral-500 block mb-1">Goal Test</span>
          <span className="text-foreground font-semibold">s == (0, 0, 'R')</span>
        </div>
        <div className="p-3 rounded-lg border border-card-edge bg-card-fill">
          <span className="text-neutral-500 block mb-1">Step Cost</span>
          <span className="text-foreground font-semibold">c(s, a, s') = 1</span>
        </div>
        <div className="p-3 rounded-lg border border-card-edge bg-card-fill">
          <span className="text-neutral-500 block mb-1">Optimal Path Cost</span>
          <span className="text-foreground font-semibold">11 Transfers</span>
        </div>
      </div>
    </Card>
  );
}
