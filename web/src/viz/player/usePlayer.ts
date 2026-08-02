import { useState, useEffect, useRef, useCallback } from 'react';
import { Step, PlaybackSpeed } from './types';

export interface UsePlayerOptions<S> {
  steps: Step<S>[];
  initialSpeed?: PlaybackSpeed;
  autoPlay?: boolean;
  onStepChange?: (step: Step<S>) => void;
  onComplete?: () => void;
}

export function usePlayer<S>({
  steps,
  initialSpeed = 1,
  autoPlay = false,
  onStepChange,
  onComplete,
}: UsePlayerOptions<S>) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [speed, setSpeed] = useState<PlaybackSpeed>(initialSpeed);
  const timerRef = useRef<number | null>(null);

  const totalSteps = steps.length;
  const currentStep = steps[currentStepIndex] ?? steps[0]!;
  const isAtStart = currentStepIndex === 0;
  const isAtEnd = currentStepIndex >= totalSteps - 1;

  // Clear timer helper
  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const goToStep = useCallback(
    (index: number) => {
      const target = Math.max(0, Math.min(index, totalSteps - 1));
      setCurrentStepIndex(target);
      if (steps[target]) {
        onStepChange?.(steps[target]);
      }
    },
    [totalSteps, steps, onStepChange]
  );

  const stepForward = useCallback(() => {
    if (currentStepIndex < totalSteps - 1) {
      goToStep(currentStepIndex + 1);
    } else {
      setIsPlaying(false);
      onComplete?.();
    }
  }, [currentStepIndex, totalSteps, goToStep, onComplete]);

  const stepBackward = useCallback(() => {
    if (currentStepIndex > 0) {
      goToStep(currentStepIndex - 1);
    }
  }, [currentStepIndex, goToStep]);

  const play = useCallback(() => {
    if (isAtEnd) {
      goToStep(0);
    }
    setIsPlaying(true);
  }, [isAtEnd, goToStep]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    clearTimer();
  }, [clearTimer]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  const reset = useCallback(() => {
    pause();
    goToStep(0);
  }, [pause, goToStep]);

  const jumpToEnd = useCallback(() => {
    pause();
    goToStep(totalSteps - 1);
  }, [pause, goToStep, totalSteps]);

  // Playback timer effect
  useEffect(() => {
    if (!isPlaying) {
      clearTimer();
      return;
    }

    const intervalMs = Math.round(1000 / speed);
    timerRef.current = window.setInterval(() => {
      stepForward();
    }, intervalMs);

    return () => clearTimer();
  }, [isPlaying, speed, stepForward, clearTimer]);

  // Keep within bounds when steps array length changes
  useEffect(() => {
    if (currentStepIndex >= totalSteps && totalSteps > 0) {
      setCurrentStepIndex(totalSteps - 1);
    }
  }, [totalSteps, currentStepIndex]);

  return {
    currentStepIndex,
    currentStep,
    totalSteps,
    isPlaying,
    speed,
    isAtStart,
    isAtEnd,
    play,
    pause,
    togglePlay,
    stepForward,
    stepBackward,
    goToStep,
    reset,
    jumpToEnd,
    setSpeed,
  };
}
