import { useEffect, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, FastForward } from 'lucide-react';
import { Step, PlaybackSpeed } from './types';
import { usePlayer } from './usePlayer';
import { Button } from '@/components/ui/Button';

export interface PlayerProps<S> {
  steps: Step<S>[];
  pseudocode?: string[];
  unitAccent?: 1 | 2 | 3 | 4 | 5 | 6;
  onStepChange?: (step: Step<S>) => void;
  className?: string;
  enableKeyboardShortcuts?: boolean;
}

export function Player<S>({
  steps,
  pseudocode,
  unitAccent = 2,
  onStepChange,
  className = '',
  enableKeyboardShortcuts = true,
}: PlayerProps<S>) {
  const {
    currentStepIndex,
    currentStep,
    totalSteps,
    isPlaying,
    speed,
    isAtStart,
    isAtEnd,
    togglePlay,
    stepForward,
    stepBackward,
    goToStep,
    reset,
    jumpToEnd,
    setSpeed,
  } = usePlayer({
    steps,
    onStepChange,
  });

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enableKeyboardShortcuts) return;

      // Ignore when focused in text inputs or textareas
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        stepForward();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        stepBackward();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        reset();
      }
    },
    [enableKeyboardShortcuts, togglePlay, stepForward, stepBackward, reset]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const speeds: PlaybackSpeed[] = [0.5, 1, 2, 4];

  return (
    <div
      className={`flex flex-col space-y-3 rounded-xl border border-studio-200 bg-white p-4 shadow-subtle dark:border-studio-800 dark:bg-studio-900 ${className}`}
    >
      {/* Metrics strip */}
      {currentStep?.metrics && Object.keys(currentStep.metrics).length > 0 && (
        <div className="flex flex-wrap items-center gap-3 border-b border-studio-100 pb-3 dark:border-studio-800">
          {Object.entries(currentStep.metrics).map(([key, val]) => (
            <div key={key} className="flex items-center space-x-1.5 text-xs">
              <span className="font-medium text-studio-500 dark:text-studio-400 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}:
              </span>
              <span className="font-mono font-bold text-studio-900 dark:text-studio-100 bg-studio-100 dark:bg-studio-800 px-1.5 py-0.5 rounded">
                {typeof val === 'number' && !Number.isInteger(val) ? val.toFixed(3) : val}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Narrative Step Description with ARIA Live for accessibility */}
      <div
        className="min-h-[48px] rounded-lg bg-studio-50 p-3 text-sm leading-relaxed text-studio-800 dark:bg-studio-800/50 dark:text-studio-200 border border-studio-200/60 dark:border-studio-700/60 flex items-center justify-between gap-4"
        aria-live="polite"
        role="status"
      >
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-unit-2 text-white text-xs font-mono font-bold">
            {currentStepIndex + 1}
          </span>
          <p className="font-medium">{currentStep?.description || 'Ready to run.'}</p>
        </div>
        <span className="font-mono text-xs text-studio-400 flex-shrink-0">
          Step {currentStepIndex + 1} / {totalSteps}
        </span>
      </div>

      {/* Scrub Slider */}
      <div className="flex items-center space-x-2 pt-1">
        <label htmlFor="player-scrub" className="sr-only">
          Algorithm Step Scrub
        </label>
        <input
          id="player-scrub"
          type="range"
          min={0}
          max={Math.max(0, totalSteps - 1)}
          value={currentStepIndex}
          onChange={(e) => goToStep(parseInt(e.target.value, 10))}
          className="w-full h-1.5 bg-studio-200 dark:bg-studio-700 rounded-lg appearance-none cursor-pointer accent-unit-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-unit-2"
          aria-valuemin={0}
          aria-valuemax={Math.max(0, totalSteps - 1)}
          aria-valuenow={currentStepIndex}
          aria-valuetext={`Step ${currentStepIndex + 1} of ${totalSteps}`}
        />
      </div>

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        {/* Playback action buttons */}
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={reset}
            disabled={isAtStart}
            title="Reset to start (R)"
            aria-label="Reset to start"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={stepBackward}
            disabled={isAtStart}
            title="Step Back (Left Arrow)"
            aria-label="Step Back"
          >
            <SkipBack className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>

          <Button
            variant={isPlaying ? 'secondary' : 'primary'}
            size="md"
            onClick={togglePlay}
            unitAccent={unitAccent}
            title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            aria-label={isPlaying ? 'Pause algorithm' : 'Play algorithm'}
          >
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-current" />
                <span>Play</span>
              </>
            )}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={stepForward}
            disabled={isAtEnd}
            title="Step Forward (Right Arrow)"
            aria-label="Step Forward"
          >
            <span className="hidden sm:inline">Step</span>
            <SkipForward className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={jumpToEnd}
            disabled={isAtEnd}
            title="Jump to end"
            aria-label="Jump to end"
          >
            <FastForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Speed selector */}
        <div className="flex items-center space-x-1 text-xs">
          <span className="text-studio-500 font-medium mr-1 hidden sm:inline">Speed:</span>
          {speeds.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSpeed(s)}
              className={`px-2 py-1 rounded font-mono font-bold transition-colors ${
                speed === s
                  ? 'bg-studio-900 text-white dark:bg-studio-100 dark:text-studio-900'
                  : 'bg-studio-100 text-studio-600 hover:bg-studio-200 dark:bg-studio-800 dark:text-studio-400 dark:hover:bg-studio-700'
              }`}
              aria-label={`Set speed to ${s}x`}
              aria-pressed={speed === s}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Optional Pseudocode view with highlighted line */}
      {pseudocode && pseudocode.length > 0 && (
        <div className="mt-3 rounded-lg bg-studio-950 p-3 text-xs font-mono text-studio-300 overflow-x-auto border border-studio-800">
          <p className="text-[10px] uppercase font-bold tracking-wider text-studio-500 mb-2">
            Algorithm Pseudocode
          </p>
          <div className="space-y-0.5">
            {pseudocode.map((line, idx) => {
              const lineNum = idx + 1;
              const isActive = currentStep?.line === lineNum;
              return (
                <div
                  key={idx}
                  className={`flex items-start px-2 py-0.5 rounded transition-colors ${
                    isActive
                      ? 'bg-unit-2/20 text-white font-bold border-l-2 border-unit-2'
                      : 'text-studio-400'
                  }`}
                >
                  <span className="w-6 text-studio-600 select-none">{lineNum}</span>
                  <pre className="font-mono whitespace-pre-wrap">{line}</pre>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
