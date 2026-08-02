export interface Step<S = unknown> {
  index: number;
  description: string;
  highlights: string[];
  state: S;
  metrics?: Record<string, number>;
  line?: number;
}

export interface Engine<In = unknown, S = unknown> {
  id: string;
  name: string;
  description: string;
  pseudocode?: string[];
  run(input: In, opts?: { maxSteps?: number; seed?: number }): Generator<Step<S>, void, void>;
}

export type PlaybackSpeed = 0.5 | 1 | 2 | 4;

export interface PlayerState {
  currentStepIndex: number;
  isPlaying: boolean;
  speed: PlaybackSpeed;
  seed: number;
}
