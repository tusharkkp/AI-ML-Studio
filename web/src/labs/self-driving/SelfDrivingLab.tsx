import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { runSelfDrivingSimulation } from '@/engines/agent/self-driving/engine';
import type { WeatherCondition, SimulationResult } from '@/engines/agent/self-driving/types';

interface ScenarioPreset {
  id: string;
  name: string;
  speedKmh: number;
  obstacleDistM: number;
  obstacleSpeedKmh: number;
  weather: WeatherCondition;
  trafficLight: 'green' | 'red';
  description: string;
}

const SCENARIOS: ScenarioPreset[] = [
  {
    id: 'clear-day-aeb',
    name: 'Clear Day Emergency Braking (AEB)',
    speedKmh: 60,
    obstacleDistM: 40,
    obstacleSpeedKmh: 0,
    weather: 'clear',
    trafficLight: 'green',
    description: 'Ego car at 60 km/h encounters stationary vehicle at 40m. Full sensors active.',
  },
  {
    id: 'heavy-fog-fusion',
    name: 'Heavy Fog: Radar Rescues Blinded Camera',
    speedKmh: 50,
    obstacleDistM: 45,
    obstacleSpeedKmh: 0,
    weather: 'heavy_fog',
    trafficLight: 'green',
    description: 'Camera visibility drops to 30%, but radar penetrates fog at 92% confidence.',
  },
  {
    id: 'red-light-intersection',
    name: 'Approaching Red Traffic Light',
    speedKmh: 50,
    obstacleDistM: 120,
    obstacleSpeedKmh: 0,
    weather: 'clear',
    trafficLight: 'red',
    description: 'Camera identifies red traffic signal and initiates progressive deceleration.',
  },
  {
    id: 'make-it-fail-crash',
    name: 'Make It Fail: Impossible Physics (Crash)',
    speedKmh: 100,
    obstacleDistM: 10,
    obstacleSpeedKmh: 0,
    weather: 'clear',
    trafficLight: 'green',
    description:
      '100 km/h with obstacle at 10m. Braking distance exceeds gap, proving physical limits.',
  },
];

export function SelfDrivingLab() {
  const [speed, setSpeed] = useState<number>(60);
  const [obstacleDistance, setObstacleDistance] = useState<number>(40);
  const [weather, setWeather] = useState<WeatherCondition>('clear');
  const [trafficLight, setTrafficLight] = useState<'green' | 'red'>('green');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  // Run simulation with current parameters
  const simResult: SimulationResult = runSelfDrivingSimulation({
    initialSpeedKmh: speed,
    initialObstacleDistanceMeters: obstacleDistance,
    weather,
    trafficLight,
    maxSteps: 40,
  });

  const steps = simResult.steps;
  const activeStep = steps[Math.min(currentStepIndex, steps.length - 1)] ?? steps[0]!;

  const applyScenario = (sc: ScenarioPreset) => {
    setSpeed(sc.speedKmh);
    setObstacleDistance(sc.obstacleDistM);
    setWeather(sc.weather);
    setTrafficLight(sc.trafficLight);
    setCurrentStepIndex(0);
  };

  return (
    <Card className="p-6 my-6 border-warm-200 dark:border-warm-800 bg-white dark:bg-warm-900/40 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-warm-200 dark:border-warm-800 pb-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-warm-500">
            Perception-Action Loop Simulator
          </span>
          <h3 className="text-xl font-bold text-warm-900 dark:text-warm-50">
            Self-Driving Vehicle Sensor Fusion &amp; Control Lab
          </h3>
        </div>

        <Badge
          variant={simResult.collided ? 'danger' : simResult.stoppedSafely ? 'success' : 'unit'}
          unit={1}
        >
          {simResult.collided
            ? '💥 Collision'
            : simResult.stoppedSafely
              ? '✓ Stopped Safely'
              : 'Cruising'}
        </Badge>
      </div>

      {/* Scenario Presets */}
      <div className="mb-6">
        <label className="block text-xs font-semibold uppercase tracking-wider text-warm-500 mb-2">
          Curriculum Scenarios &amp; Sensor Stress Tests:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {SCENARIOS.map((sc) => (
            <button
              key={sc.id}
              onClick={() => applyScenario(sc)}
              className="p-2.5 text-left rounded-lg border border-warm-200 dark:border-warm-800 hover:border-warm-400 dark:hover:border-warm-600 bg-warm-50 dark:bg-warm-800/40 transition-colors"
            >
              <div className="font-bold text-xs text-warm-900 dark:text-warm-100 mb-0.5">
                {sc.name}
              </div>
              <p className="text-[10px] text-warm-500 line-clamp-2">{sc.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Highway 2D Visualizer Canvas / SVG */}
      <div className="relative w-full h-44 rounded-xl bg-gradient-to-b from-stone-800 to-stone-900 border border-stone-700 overflow-hidden mb-6 flex items-center justify-center p-4">
        {/* Road Surface */}
        <div className="absolute inset-x-0 h-28 bg-stone-850 flex items-center border-y-2 border-stone-600">
          {/* Dashed Lane Divider */}
          <div className="w-full h-0 border-b-2 border-dashed border-amber-400/80" />
        </div>

        {/* Traffic Light Graphic */}
        <div className="absolute top-2 right-4 flex items-center gap-1.5 p-1.5 rounded-lg bg-black/80 border border-stone-600">
          <div
            className={`w-3.5 h-3.5 rounded-full ${
              activeStep.sensors.cameraTrafficLight === 'red'
                ? 'bg-rose-500 shadow-lg shadow-rose-500/50'
                : 'bg-rose-950'
            }`}
          />
          <div
            className={`w-3.5 h-3.5 rounded-full ${
              activeStep.sensors.cameraTrafficLight === 'green'
                ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50'
                : 'bg-emerald-950'
            }`}
          />
        </div>

        {/* Ego Vehicle */}
        <div
          className="absolute z-10 flex flex-col items-center transition-all duration-150"
          style={{
            left: '12%',
            top: '48%',
            transform: 'translateY(-50%)',
          }}
        >
          {/* Sensor Cones */}
          <div className="absolute -right-24 top-1/2 -translate-y-1/2 w-28 h-20 pointer-events-none opacity-40">
            {/* Camera Vision Cone (Cyan) */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-cyan-400/60 to-transparent clip-triangle"
              style={{
                opacity: activeStep.sensors.cameraConfidence,
                clipPath: 'polygon(0 40%, 100% 0, 100% 100%, 0 60%)',
              }}
            />
            {/* Radar Beam (Red/Amber) */}
            <div
              className="absolute inset-0 border-r-2 border-amber-400 border-dashed rounded-full"
              style={{
                opacity: activeStep.sensors.radarConfidence,
              }}
            />
          </div>

          <div
            className={`w-14 h-7 rounded-md border flex items-center justify-between px-1.5 text-[9px] font-bold text-white shadow-lg ${
              activeStep.controls.emergencyBrakeActive
                ? 'bg-rose-600 border-rose-400 ring-2 ring-rose-400'
                : 'bg-blue-600 border-blue-400'
            }`}
          >
            <span>EGO</span>
            <span className="text-[8px] font-mono">{activeStep.egoSpeedKmh}k</span>
          </div>
          {activeStep.controls.brakePct > 0 && (
            <span className="text-[9px] font-bold text-rose-400 mt-0.5">
              BRAKE {activeStep.controls.brakePct}%
            </span>
          )}
        </div>

        {/* Obstacle Vehicle */}
        {activeStep.obstacleDistanceMeters > 0 && (
          <div
            className="absolute z-10 flex flex-col items-center transition-all duration-150"
            style={{
              left: `${Math.min(85, Math.max(22, 12 + activeStep.obstacleDistanceMeters * 0.9))}%`,
              top: '48%',
              transform: 'translateY(-50%)',
            }}
          >
            <div className="w-14 h-7 rounded-md bg-stone-700 border border-stone-500 flex items-center justify-center text-[9px] font-bold text-stone-200 shadow-md">
              TARGET
            </div>
            <span className="text-[9px] font-mono text-stone-400 mt-0.5">
              {activeStep.obstacleDistanceMeters.toFixed(1)}m
            </span>
          </div>
        )}

        {/* Weather Overlay */}
        {weather === 'heavy_fog' && (
          <div className="absolute inset-0 bg-stone-300/30 backdrop-blur-[2px] pointer-events-none flex items-center justify-center text-xs font-bold text-stone-800 uppercase tracking-widest">
            Heavy Fog &bull; Low Camera Visibility
          </div>
        )}
      </div>

      {/* Telemetry Sensor Fusion HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Card className="p-3 border-warm-200 dark:border-warm-800">
          <span className="text-[10px] uppercase font-bold text-warm-500">Speed (Ego)</span>
          <div className="text-xl font-bold font-mono text-warm-900 dark:text-warm-100 mt-0.5">
            {activeStep.egoSpeedKmh} <span className="text-xs font-normal">km/h</span>
          </div>
        </Card>

        <Card className="p-3 border-warm-200 dark:border-warm-800">
          <span className="text-[10px] uppercase font-bold text-warm-500">Obstacle Distance</span>
          <div className="text-xl font-bold font-mono text-warm-900 dark:text-warm-100 mt-0.5">
            {activeStep.obstacleDistanceMeters.toFixed(1)}{' '}
            <span className="text-xs font-normal">m</span>
          </div>
        </Card>

        <Card className="p-3 border-warm-200 dark:border-warm-800">
          <span className="text-[10px] uppercase font-bold text-warm-500">
            Time-To-Collision (TTC)
          </span>
          <div
            className={`text-xl font-bold font-mono mt-0.5 ${
              activeStep.timeToCollisionSec < 2.0
                ? 'text-rose-600'
                : 'text-warm-900 dark:text-warm-100'
            }`}
          >
            {activeStep.timeToCollisionSec > 50
              ? 'Safe ∞'
              : `${activeStep.timeToCollisionSec.toFixed(1)}s`}
          </div>
        </Card>

        <Card className="p-3 border-warm-200 dark:border-warm-800">
          <span className="text-[10px] uppercase font-bold text-warm-500">Active Rule</span>
          <div className="text-xs font-bold font-mono text-accent-primary mt-1 truncate">
            {activeStep.controls.firedRules.join(', ') || 'None'}
          </div>
        </Card>
      </div>

      {/* Sensor Confidence Comparison */}
      <div className="mb-6 p-4 rounded-xl border border-warm-200 dark:border-warm-800 bg-warm-50 dark:bg-warm-800/30">
        <span className="text-xs font-bold uppercase tracking-wider text-warm-600 dark:text-warm-400 block mb-3">
          Multi-Sensor Fusion Health (Weather: {weather.toUpperCase()})
        </span>

        <div className="space-y-2 text-xs">
          <div>
            <div className="flex justify-between font-mono mb-1">
              <span>Camera Optical Stream</span>
              <span>{(activeStep.sensors.cameraConfidence * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-warm-200 dark:bg-warm-700 rounded-full h-1.5">
              <div
                className="bg-cyan-500 h-1.5 rounded-full transition-all"
                style={{ width: `${activeStep.sensors.cameraConfidence * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between font-mono mb-1">
              <span>LiDAR Time-of-Flight Laser</span>
              <span>{(activeStep.sensors.lidarConfidence * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-warm-200 dark:bg-warm-700 rounded-full h-1.5">
              <div
                className="bg-emerald-500 h-1.5 rounded-full transition-all"
                style={{ width: `${activeStep.sensors.lidarConfidence * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between font-mono mb-1">
              <span>Millimeter-Wave Radar</span>
              <span>{(activeStep.sensors.radarConfidence * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-warm-200 dark:bg-warm-700 rounded-full h-1.5">
              <div
                className="bg-amber-500 h-1.5 rounded-full transition-all"
                style={{ width: `${activeStep.sensors.radarConfidence * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Player Stepper Slider */}
      <div className="border border-warm-200 dark:border-warm-800 rounded-lg p-4 bg-warm-50 dark:bg-warm-800/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-warm-600 dark:text-warm-400">
            Playback Tick: {activeStep.stepIndex} / {steps.length} (t = {activeStep.timeSec}s)
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant="outline"
              disabled={currentStepIndex <= 0}
              onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
            >
              &larr;
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={currentStepIndex >= steps.length - 1}
              onClick={() => setCurrentStepIndex((prev) => Math.min(steps.length - 1, prev + 1))}
            >
              &rarr;
            </Button>
          </div>
        </div>

        <input
          type="range"
          min={0}
          max={steps.length - 1}
          value={currentStepIndex}
          onChange={(e) => setCurrentStepIndex(Number(e.target.value))}
          className="w-full accent-accent-primary"
        />

        <p className="mt-2 text-xs font-mono text-warm-700 dark:text-warm-300">
          <strong>Decision Log:</strong> {activeStep.narration}
        </p>
      </div>
    </Card>
  );
}
