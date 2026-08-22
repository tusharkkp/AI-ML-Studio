export type WeatherCondition = 'clear' | 'heavy_fog' | 'heavy_rain' | 'night';

export interface SensorData {
  cameraLaneDetected: boolean;
  cameraTrafficLight: 'green' | 'yellow' | 'red' | 'unknown';
  cameraConfidence: number; // 0 to 1
  lidarDistanceMeters: number;
  lidarConfidence: number; // 0 to 1
  radarRelativeSpeedKmh: number;
  radarDistanceMeters: number;
  radarConfidence: number; // 0 to 1
}

export interface VehicleControl {
  throttlePct: number; // 0 to 100
  brakePct: number; // 0 to 100
  steeringAngleDeg: number; // -30 to +30
  emergencyBrakeActive: boolean;
  firedRules: string[];
}

export interface SelfDrivingStep {
  stepIndex: number;
  timeSec: number;
  egoSpeedKmh: number;
  egoPositionMeters: number;
  obstacleDistanceMeters: number;
  weather: WeatherCondition;
  sensors: SensorData;
  fusedDistanceMeters: number;
  timeToCollisionSec: number;
  controls: VehicleControl;
  narration: string;
}

export interface SimulationResult {
  steps: SelfDrivingStep[];
  collided: boolean;
  stoppedSafely: boolean;
  totalTimeSec: number;
  minDistanceToObstacleMeters: number;
}
