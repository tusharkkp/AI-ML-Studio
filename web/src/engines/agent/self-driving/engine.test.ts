import { describe, it, expect } from 'vitest';
import { runSelfDrivingSimulation } from './engine';

describe('Self-Driving Vehicle Perception & Control Engine', () => {
  it('safely stops vehicle before stationary obstacle using Autonomous Emergency Braking (AEB)', () => {
    const res = runSelfDrivingSimulation({
      initialSpeedKmh: 60,
      initialObstacleDistanceMeters: 30, // TTC = 30 / 16.67 = 1.8s -> Triggers R1 AEB immediately
      obstacleSpeedKmh: 0,
      weather: 'clear',
    });

    expect(res.collided).toBe(false);
    expect(res.stoppedSafely).toBe(true);
    expect(res.minDistanceToObstacleMeters).toBeGreaterThan(0);
    expect(res.steps.some((s) => s.controls.firedRules.includes('R1_EMERGENCY_AEB'))).toBe(true);
  });

  it('maintains safety in Heavy Fog through Sensor Fusion (Radar penetrating fog when camera is blinded)', () => {
    const res = runSelfDrivingSimulation({
      initialSpeedKmh: 45,
      initialObstacleDistanceMeters: 65,
      weather: 'heavy_fog',
    });

    expect(res.collided).toBe(false);
    expect(res.stoppedSafely).toBe(true);

    // Verify camera confidence was degraded (< 0.5) while radar was high (> 0.8)
    const firstStep = res.steps[0];
    expect(firstStep).toBeDefined();
    expect(firstStep?.sensors.cameraConfidence).toBeLessThan(0.5);
    expect(firstStep?.sensors.radarConfidence).toBeGreaterThan(0.8);
  });

  it('accelerates and regulates cruise speed on open road without obstacles', () => {
    const res = runSelfDrivingSimulation({
      initialSpeedKmh: 30,
      targetSpeedKmh: 60,
      initialObstacleDistanceMeters: 300,
      maxSteps: 25,
    });

    expect(res.collided).toBe(false);
    const lastStep = res.steps[res.steps.length - 1];
    expect(lastStep).toBeDefined();
    // Speed should have accelerated up toward 60 km/h
    expect(lastStep?.egoSpeedKmh).toBeGreaterThan(50);
  });

  it('detects Red Light and initiates controlled deceleration', () => {
    const res = runSelfDrivingSimulation({
      initialSpeedKmh: 40,
      initialObstacleDistanceMeters: 200,
      trafficLight: 'red',
      maxSteps: 15,
    });

    expect(res.steps.some((s) => s.controls.firedRules.includes('R2_RED_LIGHT_STOP'))).toBe(true);
  });

  it('verifies physics limits: unavoidable crash when obstacle appears at 5 meters at 100 km/h (Make It Fail)', () => {
    const res = runSelfDrivingSimulation({
      initialSpeedKmh: 100,
      initialObstacleDistanceMeters: 5,
    });

    expect(res.collided).toBe(true);
    expect(res.stoppedSafely).toBe(false);
  });
});
