import { Step, Engine } from '@/viz/player/types';
import { VacuumInput, VacuumSnapshot, AgentAction, TileState } from './types';

export const VACUUM_PSEUDOCODE = [
  'function VACUUM-AGENT(percept, architecture):',
  '  [location, status] = percept',
  '  if architecture == "simple-reflex":',
  '    if status == "dirty" return SUCK',
  '    if location == "A" return RIGHT else return LEFT',
  '  if architecture == "model-based":',
  '    UPDATE-STATE(internal_state, percept)',
  '    if status == "dirty" return SUCK',
  '    if ALL-KNOWN-ROOMS-CLEAN(internal_state) return NOOP',
  '    return ACTION-TOWARD-UNVISITED(internal_state)',
  '  if architecture == "utility-based":',
  '    if BATTERY-LOW() or UTILITY-NEGATIVE() return NOOP',
  '    return MAXIMIZE-EXPECTED-UTILITY(percept, state)',
];

export const vacuumEngine: Engine<VacuumInput, VacuumSnapshot> = {
  id: 'agent/vacuum',
  name: 'Vacuum Cleaner Agent Environment',
  description: 'Simulates rational agents in the classic Russell & Norvig vacuum cleaner world.',
  pseudocode: VACUUM_PSEUDOCODE,

  *run(input: VacuumInput, opts = {}): Generator<Step<VacuumSnapshot>, void, void> {
    const maxSteps = opts.maxSteps ?? 30;
    const cleanReward = input.utilityWeights?.cleanReward ?? 50;
    const moveCost = input.utilityWeights?.moveCost ?? 5;
    const suckCost = input.utilityWeights?.suckCost ?? 10;

    let agentLocation = input.initialLocation;
    const rooms: Record<string, TileState> = { ...input.rooms };
    let battery = input.battery ?? 100;
    let totalScore = 0;
    const internalMemory = {
      visitedRooms: [agentLocation],
      cleanedRooms: [] as string[],
    };

    let stepIndex = 0;

    const areAllClean = () => Object.values(rooms).every((s) => s === 'clean');

    // Yield initial state before first action
    yield {
      index: stepIndex++,
      description: `Initialized in Room ${agentLocation} (${rooms[agentLocation]}). Agent architecture: ${input.agentType}.`,
      highlights: [agentLocation],
      state: {
        agentLocation,
        rooms: { ...rooms },
        lastAction: 'noop',
        percept: { location: agentLocation, status: rooms[agentLocation]! },
        internalMemory: {
          visitedRooms: [...internalMemory.visitedRooms],
          cleanedRooms: [...internalMemory.cleanedRooms],
        },
        battery,
        totalScore,
        allClean: areAllClean(),
        halted: false,
      },
      metrics: {
        battery,
        score: totalScore,
        cleanRooms: Object.values(rooms).filter((s) => s === 'clean').length,
        totalRooms: Object.keys(rooms).length,
      },
      line: 1,
    };

    while (stepIndex < maxSteps) {
      const currentStatus = rooms[agentLocation]!;
      let action: AgentAction = 'noop';
      let decisionReason = '';
      let pseudocodeLine = 1;

      // 1. Simple Reflex Decision Logic
      if (input.agentType === 'simple-reflex') {
        if (currentStatus === 'dirty') {
          action = 'suck';
          decisionReason = `Condition-action rule triggered: tile is dirty -> SUCK.`;
          pseudocodeLine = 4;
        } else if (agentLocation === 'A') {
          action = 'right';
          decisionReason = `Condition-action rule: tile is clean and location is A -> move RIGHT.`;
          pseudocodeLine = 5;
        } else {
          action = 'left';
          decisionReason = `Condition-action rule: tile is clean and location is B/other -> move LEFT.`;
          pseudocodeLine = 5;
        }
      }

      // 2. Model-Based Reflex Decision Logic
      else if (input.agentType === 'model-based') {
        pseudocodeLine = 7;
        if (!internalMemory.visitedRooms.includes(agentLocation)) {
          internalMemory.visitedRooms.push(agentLocation);
        }

        if (currentStatus === 'dirty') {
          action = 'suck';
          decisionReason = `Internal state updated: Room ${agentLocation} is dirty -> SUCK.`;
          pseudocodeLine = 8;
        } else {
          // Check if all known rooms in the world are clean
          const allKnownClean = Object.keys(rooms).every(
            (r) =>
              internalMemory.cleanedRooms.includes(r) ||
              (internalMemory.visitedRooms.includes(r) && rooms[r] === 'clean')
          );

          if (allKnownClean) {
            action = 'noop';
            decisionReason = `Internal memory confirms all accessible rooms are clean! Halting to save power (NOOP).`;
            pseudocodeLine = 9;
          } else {
            // Find an unvisited room or a dirty room
            const unvisited = Object.keys(rooms).find(
              (r) => !internalMemory.visitedRooms.includes(r)
            );
            if (unvisited && unvisited > agentLocation) {
              action = 'right';
              decisionReason = `Internal state: Room ${unvisited} is unexplored -> moving RIGHT.`;
              pseudocodeLine = 10;
            } else if (unvisited && unvisited < agentLocation) {
              action = 'left';
              decisionReason = `Internal state: Room ${unvisited} is unexplored -> moving LEFT.`;
              pseudocodeLine = 10;
            } else {
              action = agentLocation === 'A' ? 'right' : 'left';
              decisionReason = `Patrolling remaining rooms based on internal map.`;
              pseudocodeLine = 10;
            }
          }
        }
      }

      // 3. Goal-Based Decision Logic
      else if (input.agentType === 'goal-based') {
        pseudocodeLine = 8;
        if (areAllClean()) {
          action = 'noop';
          decisionReason = `Goal achieved: Goal state 'ALL_ROOMS_CLEAN' satisfied. Agent halts (NOOP).`;
          pseudocodeLine = 9;
        } else if (currentStatus === 'dirty') {
          action = 'suck';
          decisionReason = `Goal-oriented action: Cleaning dirty tile directly reduces distance to goal.`;
          pseudocodeLine = 8;
        } else {
          // Move towards the nearest dirty room
          const dirtyRooms = Object.keys(rooms).filter((r) => rooms[r] === 'dirty');
          if (dirtyRooms.length > 0) {
            const target = dirtyRooms[0]!;
            action = target > agentLocation ? 'right' : 'left';
            decisionReason = `Planning action toward goal: Target dirty Room ${target} -> move ${action.toUpperCase()}.`;
            pseudocodeLine = 10;
          } else {
            action = 'noop';
            decisionReason = `All rooms clean; goal satisfied.`;
            pseudocodeLine = 9;
          }
        }
      }

      // 4. Utility-Based Decision Logic
      else if (input.agentType === 'utility-based') {
        pseudocodeLine = 11;
        if (battery < moveCost && currentStatus === 'clean') {
          action = 'noop';
          decisionReason = `Utility calculation: Battery (${battery}%) insufficient for further moves. Halting.`;
          pseudocodeLine = 12;
        } else if (currentStatus === 'dirty') {
          // Marginal utility of cleaning: +50 clean reward - 10 suck cost = +40 net utility
          action = 'suck';
          decisionReason = `Utility optimization: Sucking yields +${cleanReward - suckCost} net utility.`;
          pseudocodeLine = 13;
        } else if (areAllClean()) {
          action = 'noop';
          decisionReason = `Utility optimization: Maximum environment cleanliness achieved. Moving has negative marginal utility (-${moveCost}). Halting.`;
          pseudocodeLine = 12;
        } else {
          action = agentLocation === 'A' ? 'right' : 'left';
          decisionReason = `Utility optimization: Expected gain from seeking dirty rooms exceeds move cost (${moveCost}).`;
          pseudocodeLine = 13;
        }
      }

      // Execute Action
      if (action === 'suck') {
        rooms[agentLocation] = 'clean';
        battery = Math.max(0, battery - suckCost);
        totalScore += cleanReward - suckCost;
        if (!internalMemory.cleanedRooms.includes(agentLocation)) {
          internalMemory.cleanedRooms.push(agentLocation);
        }
      } else if (action === 'right') {
        battery = Math.max(0, battery - moveCost);
        totalScore -= moveCost;
        // Move to next room (e.g. A -> B -> C)
        const roomKeys = Object.keys(rooms).sort();
        const currIdx = roomKeys.indexOf(agentLocation);
        if (currIdx < roomKeys.length - 1) {
          agentLocation = roomKeys[currIdx + 1]!;
        }
        if (!internalMemory.visitedRooms.includes(agentLocation)) {
          internalMemory.visitedRooms.push(agentLocation);
        }
      } else if (action === 'left') {
        battery = Math.max(0, battery - moveCost);
        totalScore -= moveCost;
        const roomKeys = Object.keys(rooms).sort();
        const currIdx = roomKeys.indexOf(agentLocation);
        if (currIdx > 0) {
          agentLocation = roomKeys[currIdx - 1]!;
        }
        if (!internalMemory.visitedRooms.includes(agentLocation)) {
          internalMemory.visitedRooms.push(agentLocation);
        }
      }

      const allClean = areAllClean();
      const isHalted = action === 'noop';

      yield {
        index: stepIndex++,
        description: `Action: ${action.toUpperCase()} in Room ${agentLocation}. ${decisionReason}`,
        highlights: [agentLocation],
        state: {
          agentLocation,
          rooms: { ...rooms },
          lastAction: action,
          percept: { location: agentLocation, status: rooms[agentLocation]! },
          internalMemory: {
            visitedRooms: [...internalMemory.visitedRooms],
            cleanedRooms: [...internalMemory.cleanedRooms],
          },
          battery,
          totalScore,
          allClean,
          halted: isHalted,
        },
        metrics: {
          battery,
          score: totalScore,
          cleanRooms: Object.values(rooms).filter((s) => s === 'clean').length,
          totalRooms: Object.keys(rooms).length,
        },
        line: pseudocodeLine,
      };

      if (isHalted) {
        break;
      }
    }
  },
};
