import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock canvas-confetti to prevent jsdom canvas warnings
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));
