import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Play, RotateCcw } from 'lucide-react';

interface CityNode {
  id: string;
  name: string;
  x: number; // SVG canvas x
  y: number; // SVG canvas y
  lat: number;
  lng: number;
}

interface RoadEdge {
  from: string;
  to: string;
  distanceKm: number;
  type: 'expressway' | 'national_highway' | 'state_highway';
}

const CITIES: CityNode[] = [
  { id: 'mumbai', name: 'Mumbai', x: 80, y: 110, lat: 18.92, lng: 72.83 },
  { id: 'pune', name: 'Pune', x: 180, y: 170, lat: 18.52, lng: 73.85 },
  { id: 'nashik', name: 'Nashik', x: 160, y: 50, lat: 19.99, lng: 73.78 },
  { id: 'aurangabad', name: 'Chh. Sambhajinagar', x: 330, y: 70, lat: 19.87, lng: 75.34 },
  { id: 'ahmednagar', name: 'Ahmednagar', x: 260, y: 130, lat: 19.09, lng: 74.74 },
  { id: 'satara', name: 'Satara', x: 180, y: 250, lat: 17.68, lng: 73.99 },
  { id: 'solapur', name: 'Solapur', x: 380, y: 240, lat: 17.65, lng: 75.9 },
  { id: 'kolhapur', name: 'Kolhapur', x: 180, y: 320, lat: 16.7, lng: 74.24 },
  { id: 'nanded', name: 'Nanded', x: 470, y: 120, lat: 19.15, lng: 77.31 },
];

const ROADS: RoadEdge[] = [
  { from: 'mumbai', to: 'pune', distanceKm: 150, type: 'expressway' },
  { from: 'mumbai', to: 'nashik', distanceKm: 165, type: 'national_highway' },
  { from: 'pune', to: 'nashik', distanceKm: 210, type: 'national_highway' },
  { from: 'pune', to: 'ahmednagar', distanceKm: 120, type: 'state_highway' },
  { from: 'pune', to: 'satara', distanceKm: 110, type: 'national_highway' },
  { from: 'pune', to: 'solapur', distanceKm: 250, type: 'national_highway' },
  { from: 'nashik', to: 'aurangabad', distanceKm: 180, type: 'expressway' },
  { from: 'ahmednagar', to: 'aurangabad', distanceKm: 115, type: 'state_highway' },
  { from: 'ahmednagar', to: 'solapur', distanceKm: 220, type: 'state_highway' },
  { from: 'satara', to: 'kolhapur', distanceKm: 120, type: 'national_highway' },
  { from: 'kolhapur', to: 'solapur', distanceKm: 235, type: 'state_highway' },
  { from: 'aurangabad', to: 'nanded', distanceKm: 260, type: 'national_highway' },
  { from: 'solapur', to: 'nanded', distanceKm: 240, type: 'state_highway' },
];

export function GpsNavigationLab() {
  const [startCityId, setStartCityId] = useState<string>('mumbai');
  const [goalCityId, setGoalCityId] = useState<string>('nanded');
  const [algorithm, setAlgorithm] = useState<'astar' | 'dijkstra'>('astar');
  const [hasExpresswayCongestion, setHasExpresswayCongestion] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  // Euclidean straight-line distance heuristic in canvas pixels
  const getHeuristic = (c1Id: string, c2Id: string) => {
    const c1 = CITIES.find((c) => c.id === c1Id)!;
    const c2 = CITIES.find((c) => c.id === c2Id)!;
    const dx = c1.x - c2.x;
    const dy = c1.y - c2.y;
    // Scale pixel distance to km approximation (~0.85 km per pixel)
    return Math.sqrt(dx * dx + dy * dy) * 0.85;
  };

  // Run routing search
  const routeResult = useMemo(() => {
    // Build adjacency list
    const adj: Record<string, { to: string; cost: number; edge: RoadEdge }[]> = {};
    CITIES.forEach((c) => (adj[c.id] = []));

    ROADS.forEach((r) => {
      let cost = r.distanceKm;
      // Traffic incident on Mumbai-Pune expressway multiplier
      if (
        hasExpresswayCongestion &&
        ((r.from === 'mumbai' && r.to === 'pune') || (r.from === 'pune' && r.to === 'mumbai'))
      ) {
        cost *= 3.5; // 350% delay
      }
      adj[r.from]?.push({ to: r.to, cost, edge: r });
      adj[r.to]?.push({ to: r.from, cost, edge: r });
    });

    const gScores: Record<string, number> = { [startCityId]: 0 };
    const fScores: Record<string, number> = {
      [startCityId]: algorithm === 'astar' ? getHeuristic(startCityId, goalCityId) : 0,
    };
    const openSet = new Set<string>([startCityId]);
    const closedSet = new Set<string>();
    const parents: Record<string, string> = {};
    const steps: {
      stepIndex: number;
      currentCity: string;
      openSet: string[];
      closedSet: string[];
      gScore: number;
      fScore: number;
      message: string;
    }[] = [];

    let found = false;
    let stepCount = 1;

    while (openSet.size > 0) {
      let currentId = '';
      let minF = Infinity;

      for (const id of openSet) {
        const f = fScores[id] ?? Infinity;
        if (f < minF) {
          minF = f;
          currentId = id;
        }
      }

      if (!currentId) break;

      const currentCity = CITIES.find((c) => c.id === currentId)!;
      const curG = gScores[currentId] ?? 0;
      const curF = fScores[currentId] ?? 0;

      steps.push({
        stepIndex: stepCount++,
        currentCity: currentId,
        openSet: Array.from(openSet),
        closedSet: Array.from(closedSet),
        gScore: curG,
        fScore: curF,
        message:
          currentId === goalCityId
            ? `Arrived at destination ${currentCity.name}! Total travel cost: ${curG.toFixed(0)} km eq.`
            : `Evaluating junction ${currentCity.name}: g=${curG.toFixed(0)} km, f=${curF.toFixed(0)}.`,
      });

      if (currentId === goalCityId) {
        found = true;
        break;
      }

      openSet.delete(currentId);
      closedSet.add(currentId);

      for (const neighbor of adj[currentId] ?? []) {
        if (closedSet.has(neighbor.to)) continue;

        const tentativeG = curG + neighbor.cost;
        const existingG = gScores[neighbor.to];

        if (existingG === undefined || tentativeG < existingG) {
          parents[neighbor.to] = currentId;
          gScores[neighbor.to] = tentativeG;
          const hVal = algorithm === 'astar' ? getHeuristic(neighbor.to, goalCityId) : 0;
          fScores[neighbor.to] = tentativeG + hVal;
          openSet.add(neighbor.to);
        }
      }
    }

    const path: string[] = [];
    if (found) {
      let curr: string | undefined = goalCityId;
      while (curr) {
        path.unshift(curr);
        curr = parents[curr];
      }
    }

    return {
      found,
      path,
      steps,
      nodesExplored: closedSet.size + (found ? 1 : 0),
      totalDistance: gScores[goalCityId] ?? 0,
    };
  }, [startCityId, goalCityId, algorithm, hasExpresswayCongestion]);

  const totalSteps = routeResult.steps.length;
  const currentStep = routeResult.steps[Math.min(currentStepIndex, totalSteps - 1)];

  return (
    <Card className="p-6 my-6 border-card-edge bg-card-fill backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-card-edge pb-4">
        <div>
          <span className="text-xs font-mono text-neutral-500">Real-world routing engine</span>
          <h3 className="font-montserrat text-xl font-semibold text-foreground">
            Maharashtra Regional GPS Route Planner
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Compare A* vs Dijkstra across road networks and test real-time dynamic traffic
            rerouting.
          </p>
        </div>

        {/* Algorithm Switcher */}
        <div className="flex rounded-lg border border-card-edge bg-neutral-900/60 p-0.5">
          <button
            onClick={() => {
              setAlgorithm('astar');
              setCurrentStepIndex(0);
            }}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              algorithm === 'astar'
                ? 'bg-brand text-white font-semibold'
                : 'text-neutral-400 hover:text-foreground'
            }`}
          >
            A* (Heuristic Guided)
          </button>
          <button
            onClick={() => {
              setAlgorithm('dijkstra');
              setCurrentStepIndex(0);
            }}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              algorithm === 'dijkstra'
                ? 'bg-brand text-white font-semibold'
                : 'text-neutral-400 hover:text-foreground'
            }`}
          >
            Dijkstra (Uniform Cost)
          </button>
        </div>
      </div>

      {/* Control Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-xs font-mono text-neutral-400 block mb-1.5">Origin City:</label>
          <select
            value={startCityId}
            onChange={(e) => {
              setStartCityId(e.target.value);
              setCurrentStepIndex(0);
            }}
            className="w-full text-xs p-2 rounded-lg border border-card-edge bg-neutral-900/80 text-foreground"
          >
            {CITIES.map((c) => (
              <option key={c.id} value={c.id} disabled={c.id === goalCityId}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-mono text-neutral-400 block mb-1.5">
            Destination City:
          </label>
          <select
            value={goalCityId}
            onChange={(e) => {
              setGoalCityId(e.target.value);
              setCurrentStepIndex(0);
            }}
            className="w-full text-xs p-2 rounded-lg border border-card-edge bg-neutral-900/80 text-foreground"
          >
            {CITIES.map((c) => (
              <option key={c.id} value={c.id} disabled={c.id === startCityId}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-mono text-neutral-400 block mb-1.5">
            Live Traffic Injection:
          </label>
          <button
            onClick={() => {
              setHasExpresswayCongestion((prev) => !prev);
              setCurrentStepIndex(0);
            }}
            className={`w-full text-xs p-2 rounded-lg border text-left transition-colors flex items-center justify-between ${
              hasExpresswayCongestion
                ? 'border-rose-500/50 bg-rose-500/10 text-rose-300 font-semibold'
                : 'border-card-edge bg-card-fill text-neutral-400 hover:text-foreground'
            }`}
          >
            <span>Expressway Monsoon Landslide</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                hasExpresswayCongestion
                  ? 'bg-rose-500/30 text-rose-300'
                  : 'bg-neutral-800 text-neutral-400'
              }`}
            >
              {hasExpresswayCongestion ? 'ACTIVE (+350% Delay)' : 'Normal Flow'}
            </span>
          </button>
        </div>
      </div>

      {/* SVG Road Map Canvas */}
      <div className="rounded-2xl border border-card-edge bg-[#070707] p-4 mb-4 relative overflow-hidden">
        <div className="flex items-center justify-between mb-2 text-xs font-mono text-neutral-400">
          <span>Regional Road Network Graph</span>
          <span className="text-neutral-500">
            Path: {routeResult.path.map((id) => CITIES.find((c) => c.id === id)?.name).join(' → ')}
          </span>
        </div>

        <svg viewBox="0 0 540 360" className="w-full h-auto max-h-[360px]">
          {/* Render Roads */}
          {ROADS.map((road, idx) => {
            const u = CITIES.find((c) => c.id === road.from);
            const v = CITIES.find((c) => c.id === road.to);
            if (!u || !v) return null;

            const isMumbaiPune =
              (road.from === 'mumbai' && road.to === 'pune') ||
              (road.from === 'pune' && road.to === 'mumbai');
            const isCongested = isMumbaiPune && hasExpresswayCongestion;

            // Check if road is part of optimal route
            const isRouteRoad =
              routeResult.found &&
              routeResult.path.includes(road.from) &&
              routeResult.path.includes(road.to) &&
              Math.abs(routeResult.path.indexOf(road.from) - routeResult.path.indexOf(road.to)) ===
                1;

            let strokeColor = '#262626';
            let strokeWidth = 2;

            if (isCongested) {
              strokeColor = '#f43f5e';
            } else if (isRouteRoad) {
              strokeColor = '#10b981';
              strokeWidth = 3.5;
            } else if (road.type === 'expressway') {
              strokeColor = '#3b82f6';
            } else if (road.type === 'national_highway') {
              strokeColor = '#525252';
            }

            return (
              <g key={idx}>
                <line
                  x1={u.x}
                  y1={u.y}
                  x2={v.x}
                  y2={v.y}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={isCongested ? '4 3' : 'none'}
                />
                {/* Distance Label */}
                <text
                  x={(u.x + v.x) / 2}
                  y={(u.y + v.y) / 2 - 4}
                  textAnchor="middle"
                  fill="#737373"
                  fontSize="8"
                  fontFamily="monospace"
                >
                  {road.distanceKm} km
                </text>
              </g>
            );
          })}

          {/* Render City Nodes */}
          {CITIES.map((city) => {
            const isStart = city.id === startCityId;
            const isGoal = city.id === goalCityId;
            const isCurrent = currentStep?.currentCity === city.id;
            const isExplored = currentStep?.closedSet.includes(city.id);
            const isFrontier = currentStep?.openSet.includes(city.id);
            const isPath = routeResult.found && routeResult.path.includes(city.id);

            let fillColor = '#171717';
            let strokeColor = '#404040';

            if (isStart) {
              strokeColor = '#3b82f6';
              fillColor = '#1e3a8a';
            } else if (isGoal) {
              strokeColor = '#10b981';
              fillColor = '#064e3b';
            } else if (isCurrent) {
              strokeColor = '#f59e0b';
              fillColor = '#78350f';
            } else if (isPath) {
              strokeColor = '#10b981';
              fillColor = '#065f46';
            } else if (isExplored) {
              strokeColor = '#64748b';
              fillColor = '#1e293b';
            } else if (isFrontier) {
              strokeColor = '#f97316';
              fillColor = '#7c2d12';
            }

            return (
              <g key={city.id}>
                <circle
                  cx={city.x}
                  cy={city.y}
                  r={isStart || isGoal ? 8 : 6}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth="2"
                />
                <text
                  x={city.x}
                  y={city.y + 16}
                  textAnchor="middle"
                  fill={isStart || isGoal || isPath ? '#f5f5f5' : '#a3a3a3'}
                  fontSize="9"
                  fontFamily="sans-serif"
                  fontWeight={isStart || isGoal || isPath ? 'bold' : 'normal'}
                >
                  {city.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Step Message */}
        <div className="mt-3 p-2.5 rounded-lg border border-card-edge bg-neutral-900/50 font-mono text-xs text-neutral-300 flex items-center justify-between">
          <span>{currentStep?.message ?? 'Ready to navigate.'}</span>
          <span className="text-[11px] text-neutral-400">
            Junctions Explored: {routeResult.nodesExplored}/{CITIES.length} | Total Cost:{' '}
            {routeResult.totalDistance.toFixed(0)} km
          </span>
        </div>
      </div>

      {/* Step Controls & Telemetry */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="primary"
            onClick={() => {
              if (currentStepIndex < totalSteps - 1) {
                setCurrentStepIndex((prev) => prev + 1);
              } else {
                setCurrentStepIndex(0);
              }
            }}
          >
            <Play className="size-3.5 mr-1" />
            {currentStepIndex >= totalSteps - 1 ? 'Replay' : 'Step Forward'}
          </Button>

          <Button size="sm" variant="outline" onClick={() => setCurrentStepIndex(0)}>
            <RotateCcw className="size-3.5 mr-1" />
            Reset
          </Button>
        </div>

        <div className="text-xs text-neutral-400 font-mono">
          {algorithm === 'astar' ? (
            <span className="text-emerald-400">
              A* Guided: Explored {routeResult.nodesExplored} junctions directly along the
              geographic vector.
            </span>
          ) : (
            <span className="text-amber-400">
              Dijkstra Uniform: Explored {routeResult.nodesExplored} junctions uniformly across all
              directions.
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
