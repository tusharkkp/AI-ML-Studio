import type {
  WeatherCondition,
  SensorData,
  VehicleControl,
  SelfDrivingStep,
  SimulationResult,
} from './types';

export interface SimulationParams {
  initialSpeedKmh?: number;
  targetSpeedKmh?: number;
  initialObstacleDistanceMeters?: number;
  obstacleSpeedKmh?: number;
  weather?: WeatherCondition;
  trafficLight?: 'green' | 'yellow' | 'red';
  maxSteps?: number;
}

export function runSelfDrivingSimulation(params: SimulationParams = {}): SimulationResult {
  const initialSpeedKmh = params.initialSpeedKmh ?? 60;
  const targetSpeedKmh = params.targetSpeedKmh ?? 60;
  let obstacleDistanceMeters = params.initialObstacleDistanceMeters ?? 70;
  const obstacleSpeedKmh = params.obstacleSpeedKmh ?? 0;
  const weather = params.weather ?? 'clear';
  const trafficLight = params.trafficLight ?? 'green';
  const maxSteps = params.maxSteps ?? 50;

  let egoSpeedKmh = initialSpeedKmh;
  let egoPositionMeters = 0;
  const dt = 0.2; // 200ms tick
  const steps: SelfDrivingStep[] = [];

  let collided = false;
  let minDistance = obstacleDistanceMeters;

  // Sensor confidence parameters based on environmental conditions
  let camConf = 0.95;
  let lidarConf = 0.95;
  let radarConf = 0.9;

  if (weather === 'heavy_fog') {
    camConf = 0.3; // Visually blinded by fog
    lidarConf = 0.5; // Laser scattering
    radarConf = 0.92; // Millimeter waves penetrate fog cleanly!
  } else if (weather === 'heavy_rain') {
    camConf = 0.4;
    lidarConf = 0.6;
    radarConf = 0.88;
  } else if (weather === 'night') {
    camConf = 0.5;
    lidarConf = 0.95; // Active laser pulses work perfectly in the dark
    radarConf = 0.9;
  }

  for (let i = 0; i < maxSteps; i++) {
    const timeSec = Number((i * dt).toFixed(1));

    // Simulated sensor readings with weather-induced noise
    const sensors: SensorData = {
      cameraLaneDetected: camConf > 0.4,
      cameraTrafficLight: camConf > 0.4 ? trafficLight : 'unknown',
      cameraConfidence: camConf,
      lidarDistanceMeters: Math.max(0, obstacleDistanceMeters),
      lidarConfidence: lidarConf,
      radarRelativeSpeedKmh: obstacleSpeedKmh - egoSpeedKmh,
      radarDistanceMeters: Math.max(0, obstacleDistanceMeters),
      radarConfidence: radarConf,
    };

    // Sensor Fusion: Weighted fusion of distance estimates
    const fusedDistanceMeters =
      (sensors.lidarDistanceMeters * lidarConf + sensors.radarDistanceMeters * radarConf) /
      (lidarConf + radarConf);

    minDistance = Math.min(minDistance, fusedDistanceMeters);

    // Relative velocity in m/s
    const relativeSpeedMs = (egoSpeedKmh - obstacleSpeedKmh) / 3.6;
    const timeToCollisionSec = relativeSpeedMs > 0.5 ? fusedDistanceMeters / relativeSpeedMs : 99.9;

    // Rule Arbitration System
    const firedRules: string[] = [];
    let throttlePct = 0;
    let brakePct = 0;
    let emergencyBrakeActive = false;
    let narration = '';

    // Check collision condition first
    if (obstacleDistanceMeters <= 0.5) {
      collided = true;
      narration = `💥 COLLISION with obstacle at t=${timeSec}s!`;
      steps.push({
        stepIndex: i + 1,
        timeSec,
        egoSpeedKmh: Math.max(0, egoSpeedKmh),
        egoPositionMeters: Math.round(egoPositionMeters),
        obstacleDistanceMeters: 0,
        weather,
        sensors,
        fusedDistanceMeters: 0,
        timeToCollisionSec: 0,
        controls: {
          throttlePct: 0,
          brakePct: 100,
          steeringAngleDeg: 0,
          emergencyBrakeActive: true,
          firedRules: ['R_CRASH'],
        },
        narration,
      });
      break;
    }

    // Rule 1: Emergency Collision Avoidance (AEB)
    if (timeToCollisionSec < 2.0 || fusedDistanceMeters < 12) {
      emergencyBrakeActive = true;
      brakePct = 100;
      throttlePct = 0;
      firedRules.push('R1_EMERGENCY_AEB');
      narration = `🚨 R1 Emergency Autonomous Braking (AEB) Active! TTC = ${timeToCollisionSec.toFixed(1)}s < 2.0s. Max braking deceleration.`;
    }
    // Rule 2: Traffic Light Red
    else if (sensors.cameraTrafficLight === 'red') {
      brakePct = 50;
      throttlePct = 0;
      firedRules.push('R2_RED_LIGHT_STOP');
      narration = `🛑 R2 Red Light Detected via Camera (Confidence ${(camConf * 100).toFixed(0)}%). Decelerating to stop line.`;
    }
    // Rule 3: Cautionary Following Distance
    else if (timeToCollisionSec < 4.0 || fusedDistanceMeters < 25) {
      brakePct = 40;
      throttlePct = 0;
      firedRules.push('R3_DECELERATE_FOLLOWING');
      narration = `⚠️ R3 Preceding vehicle detected within 25m. Modulating speed to maintain safe 3-second buffer.`;
    }
    // Rule 4: Cruise Speed Regulation
    else {
      if (egoSpeedKmh < targetSpeedKmh - 10) {
        throttlePct = 80;
        brakePct = 0;
        firedRules.push('R4_ACCELERATE_CRUISE');
        narration = `🚗 R4 Open road. Accelerating decisively (+80% throttle) toward cruise target (${targetSpeedKmh} km/h).`;
      } else if (egoSpeedKmh < targetSpeedKmh - 2) {
        throttlePct = 40;
        brakePct = 0;
        firedRules.push('R4_ACCELERATE_CRUISE');
        narration = `🚗 R4 Approaching target speed. Modulating throttle (+40%).`;
      } else if (egoSpeedKmh > targetSpeedKmh + 2) {
        throttlePct = 0;
        brakePct = 20;
        firedRules.push('R5_BRAKE_SPEED_LIMIT');
        narration = `R5 Speed exceeded target. Light regenerative braking applied.`;
      } else {
        throttlePct = 15;
        brakePct = 0;
        firedRules.push('R6_MAINTAIN_CRUISE');
        narration = `Cruise speed maintained at ${Math.round(egoSpeedKmh)} km/h.`;
      }
    }

    const controls: VehicleControl = {
      throttlePct,
      brakePct,
      steeringAngleDeg: 0,
      emergencyBrakeActive,
      firedRules,
    };

    steps.push({
      stepIndex: i + 1,
      timeSec,
      egoSpeedKmh: Math.round(egoSpeedKmh * 10) / 10,
      egoPositionMeters: Math.round(egoPositionMeters * 10) / 10,
      obstacleDistanceMeters: Math.round(obstacleDistanceMeters * 10) / 10,
      weather,
      sensors,
      fusedDistanceMeters: Math.round(fusedDistanceMeters * 10) / 10,
      timeToCollisionSec: Math.round(timeToCollisionSec * 10) / 10,
      controls,
      narration,
    });

    // Check stop condition
    if (emergencyBrakeActive && egoSpeedKmh <= 0.5) {
      break;
    }

    // Apply vehicle dynamics
    // Acceleration: throttle gives up to 2.5 m/s^2, brake gives up to -8.0 m/s^2
    const accelMs2 = (throttlePct / 100) * 2.5 - (brakePct / 100) * 8.0;
    const egoSpeedMs = Math.max(0, egoSpeedKmh / 3.6 + accelMs2 * dt);
    egoSpeedKmh = egoSpeedMs * 3.6;

    egoPositionMeters += egoSpeedMs * dt;
    const obsSpeedMs = obstacleSpeedKmh / 3.6;
    obstacleDistanceMeters += (obsSpeedMs - egoSpeedMs) * dt;
  }

  const stoppedSafely = !collided && egoSpeedKmh <= 1.0;
  const lastStep = steps[steps.length - 1];

  return {
    steps,
    collided,
    stoppedSafely,
    totalTimeSec: lastStep ? lastStep.timeSec : 0,
    minDistanceToObstacleMeters: Math.round(minDistance * 10) / 10,
  };
}
