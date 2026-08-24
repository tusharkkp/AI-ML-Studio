import { useState, useMemo, useEffect } from 'react';
import { Bot, Battery, AlertTriangle, ShieldCheck } from 'lucide-react';
import { vacuumEngine } from '@/engines/agent/vacuum/engine';
import {
  VacuumInput,
  VacuumSnapshot,
  AgentArchitecture,
  TileState,
} from '@/engines/agent/vacuum/types';
import { Step } from '@/viz/player/types';
import { Player } from '@/viz/player/Player';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export function VacuumWorldLab({ onCleanAll }: { onCleanAll?: () => void }) {
  const [roomCount, setRoomCount] = useState<2 | 3>(2);
  const [agentType, setAgentType] = useState<AgentArchitecture>('simple-reflex');
  const [rooms, setRooms] = useState<Record<string, TileState>>({
    A: 'dirty',
    B: 'dirty',
  });
  const [initialLocation, setInitialLocation] = useState('A');
  const [activeTab, setActiveTab] = useState<'simulator' | 'peas'>('simulator');

  // Handle room count switch
  useEffect(() => {
    if (roomCount === 2) {
      setRooms({ A: 'dirty', B: 'dirty' });
      setInitialLocation((loc) => (loc === 'C' ? 'A' : loc));
    } else {
      setRooms({ A: 'clean', B: 'clean', C: 'dirty' });
    }
  }, [roomCount]);

  const toggleTile = (room: string) => {
    setRooms((prev) => ({
      ...prev,
      [room]: prev[room] === 'dirty' ? 'clean' : 'dirty',
    }));
  };

  const input: VacuumInput = useMemo(
    () => ({
      rooms,
      initialLocation,
      agentType,
      battery: 100,
    }),
    [rooms, initialLocation, agentType]
  );

  const steps: Step<VacuumSnapshot>[] = useMemo(() => {
    return Array.from(vacuumEngine.run(input, { maxSteps: 15 }));
  }, [input]);

  const [currentStep, setCurrentStep] = useState<Step<VacuumSnapshot>>(steps[0]!);

  useEffect(() => {
    setCurrentStep(steps[0]!);
  }, [steps]);

  const currentSnapshot = currentStep?.state;

  return (
    <div className="rounded-2xl border border-card-edge bg-card-fill backdrop-blur-sm p-5 my-6">
      {/* Top tabs: Simulator vs PEAS Builder */}
      <div className="flex items-center justify-between border-b border-card-edge pb-3 mb-5">
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setActiveTab('simulator')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'simulator'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-black'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300'
            }`}
          >
            Agent Simulator
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('peas')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'peas'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-black'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300'
            }`}
          >
            PEAS Framework Builder
          </button>
        </div>

        <Badge variant="unit" unit={1}>
          Unit 1 · Intelligent Agents
        </Badge>
      </div>

      {activeTab === 'simulator' ? (
        <div className="space-y-5">
          {/* Architecture Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-studio-950 p-3 rounded-xl border border-studio-200 dark:border-studio-800">
            <span className="text-xs font-bold text-studio-600 dark:text-studio-400 uppercase tracking-wider">
              Agent Architecture:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  { id: 'simple-reflex', label: 'Simple Reflex' },
                  { id: 'model-based', label: 'Model-Based Reflex' },
                  { id: 'goal-based', label: 'Goal-Based' },
                  { id: 'utility-based', label: 'Utility-Based' },
                ] as const
              ).map((arch) => (
                <button
                  key={arch.id}
                  type="button"
                  onClick={() => setAgentType(arch.id)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
                    agentType === arch.id
                      ? 'bg-studio-900 text-white border-studio-900 dark:bg-studio-100 dark:text-studio-900'
                      : 'bg-studio-50 text-studio-700 border-studio-200 hover:bg-studio-100 dark:bg-studio-900 dark:text-studio-300 dark:border-studio-800'
                  }`}
                >
                  {arch.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-studio-500">Presets:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setRoomCount(2);
                setRooms({ A: 'dirty', B: 'dirty' });
                setInitialLocation('A');
                setAgentType('simple-reflex');
              }}
            >
              Standard 2-Room Dirty
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setRoomCount(2);
                setRooms({ A: 'clean', B: 'clean' });
                setInitialLocation('A');
                setAgentType('simple-reflex');
              }}
              className="text-amber-700 dark:text-amber-400 border-amber-300"
            >
              <AlertTriangle className="h-3.5 w-3.5 mr-1" />
              Oscillation Trap (Make it fail)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setRoomCount(3);
                setRooms({ A: 'clean', B: 'clean', C: 'dirty' });
                setInitialLocation('A');
                setAgentType('model-based');
              }}
              className="text-emerald-700 dark:text-emerald-400 border-emerald-300"
            >
              <ShieldCheck className="h-3.5 w-3.5 mr-1" />
              3-Room Memory Solution
            </Button>
          </div>

          {/* Visual Environment Canvas */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 rounded-xl bg-white dark:bg-studio-950 border border-studio-200 dark:border-studio-800">
            {Object.keys(rooms)
              .sort()
              .map((room) => {
                const isAgentHere = currentSnapshot?.agentLocation === room;
                const isDirty = currentSnapshot?.rooms[room] === 'dirty';
                const isVisited = currentSnapshot?.internalMemory.visitedRooms.includes(room);

                return (
                  <div
                    key={room}
                    onClick={() => toggleTile(room)}
                    className={`relative flex flex-col items-center justify-between p-5 rounded-xl border-2 cursor-pointer transition-all ${
                      isAgentHere
                        ? 'border-unit-1 bg-unit-1/5'
                        : isDirty
                          ? 'border-amber-300 bg-amber-50/60 dark:border-amber-900 dark:bg-amber-950/20'
                          : 'border-studio-200 bg-studio-50/50 dark:border-studio-800 dark:bg-studio-900/30'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-display font-bold text-sm text-studio-900 dark:text-studio-100">
                        Room {room}
                      </span>
                      {isVisited && (
                        <span className="text-[10px] bg-studio-200 dark:bg-studio-800 px-1.5 py-0.5 rounded text-studio-600 dark:text-studio-300">
                          Visited
                        </span>
                      )}
                    </div>

                    <div className="my-4 flex flex-col items-center gap-2">
                      {isAgentHere ? (
                        <div className="flex flex-col items-center animate-bounce duration-500">
                          <Bot className="h-10 w-10 text-unit-1" />
                          <span className="text-[11px] font-bold text-unit-1 mt-1">Agent Here</span>
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-full border border-dashed border-studio-300 dark:border-studio-700 flex items-center justify-center text-xs text-studio-400">
                          Empty
                        </div>
                      )}

                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 ${
                          isDirty
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200'
                        }`}
                      >
                        {isDirty ? '🍂 Dirty (Click to clean)' : '✨ Clean (Click to soil)'}
                      </span>
                    </div>

                    <p className="text-[10px] text-studio-400">Click to toggle dirt state</p>
                  </div>
                );
              })}
          </div>

          {/* Internal Memory & Status Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-studio-100 dark:bg-studio-800/60 p-3 rounded-lg border border-studio-200 dark:border-studio-700">
            <div className="flex items-center gap-2">
              <Battery className="h-4 w-4 text-studio-500" />
              <span className="font-semibold text-studio-600 dark:text-studio-300">
                Battery: {currentSnapshot?.battery}%
              </span>
            </div>
            <div>
              <span className="text-studio-500 mr-1.5">Internal Memory:</span>
              <span className="font-mono font-bold text-studio-800 dark:text-studio-200">
                Visited: [{currentSnapshot?.internalMemory.visitedRooms.join(', ')}] | Cleaned: [
                {currentSnapshot?.internalMemory.cleanedRooms.join(', ') || 'none'}]
              </span>
            </div>
            <div>
              <span className="text-studio-500 mr-1.5">Utility Score:</span>
              <span className="font-mono font-bold text-unit-1 text-sm">
                {currentSnapshot?.totalScore}
              </span>
            </div>
          </div>

          {/* Player Controller */}
          <Player
            steps={steps}
            pseudocode={vacuumEngine.pseudocode}
            unitAccent={1}
            onStepChange={(step) => {
              setCurrentStep(step);
              if (step.state.allClean) {
                onCleanAll?.();
              }
            }}
          />
        </div>
      ) : (
        /* PEAS Framework Interactive Builder */
        <div className="space-y-4">
          <p className="text-sm text-studio-600 dark:text-studio-300 leading-relaxed">
            The <strong>PEAS Framework</strong> formalizes the task environment of an intelligent
            agent. Inspect the 4 components for the autonomous vacuum agent:
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                P: Performance measure
              </span>
              <p className="text-sm font-semibold text-foreground mt-1 mb-2">
                What constitutes success?
              </p>
              <ul className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1 list-disc pl-4">
                <li>+50 points per clean room over time.</li>
                <li>-10 penalty per suck operation.</li>
                <li>-5 penalty per move (energy conservation).</li>
                <li>-100 penalty for colliding with walls.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-sky-500/20 bg-sky-500/5">
              <span className="text-xs font-semibold text-sky-600 dark:text-sky-400">
                E: Environment
              </span>
              <p className="text-sm font-semibold text-foreground mt-1 mb-2">
                Where does the agent operate?
              </p>
              <ul className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1 list-disc pl-4">
                <li>Rooms A, B (or grid tiles).</li>
                <li>Partially Observable vs Fully Observable.</li>
                <li>Deterministic vs Stochastic dirt accumulation.</li>
                <li>Static vs Dynamic obstacles.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                A: Actuators
              </span>
              <p className="text-sm font-semibold text-foreground mt-1 mb-2">
                How does the agent affect the world?
              </p>
              <ul className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1 list-disc pl-4">
                <li>Drive wheels (Left, Right, Forward, Backward).</li>
                <li>Suction motor (Suck).</li>
                <li>Brush roller rotation.</li>
                <li>Idle / Sleep state (NOOP).</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-violet-500/20 bg-violet-500/5">
              <span className="text-xs font-semibold text-violet-600 dark:text-violet-400">
                S: Sensors
              </span>
              <p className="text-sm font-semibold text-foreground mt-1 mb-2">
                How does the agent perceive the world?
              </p>
              <ul className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1 list-disc pl-4">
                <li>Location sensor (Wheel odometry / RFID tag).</li>
                <li>Optical dirt detector sensor (Clean / Dirty).</li>
                <li>Bump sensor / Infrared cliff sensor.</li>
                <li>Battery voltage monitor.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
