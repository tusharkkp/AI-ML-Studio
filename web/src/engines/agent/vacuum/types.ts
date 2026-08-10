export type TileState = 'clean' | 'dirty';

export type AgentAction = 'suck' | 'left' | 'right' | 'up' | 'down' | 'noop';

export type AgentArchitecture = 'simple-reflex' | 'model-based' | 'goal-based' | 'utility-based';

export interface VacuumInput {
  rooms: Record<string, TileState>; // e.g. { 'A': 'dirty', 'B': 'dirty' } or { 'A': 'dirty', 'B': 'dirty', 'C': 'dirty' }
  layout?: 'two-room' | 'three-room-line' | 'grid-2x2';
  initialLocation: string;
  agentType: AgentArchitecture;
  battery?: number; // default 100
  utilityWeights?: {
    cleanReward: number; // e.g. 50
    moveCost: number; // e.g. 5
    suckCost: number; // e.g. 10
  };
}

export interface VacuumSnapshot {
  agentLocation: string;
  rooms: Record<string, TileState>;
  lastAction: AgentAction;
  percept: {
    location: string;
    status: TileState;
  };
  internalMemory: {
    visitedRooms: string[];
    cleanedRooms: string[];
  };
  battery: number;
  totalScore: number;
  allClean: boolean;
  halted: boolean;
}
