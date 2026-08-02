import { describe, it, expect } from 'vitest';
import { SeededRNG } from './rng';

describe('SeededRNG', () => {
  it('produces identical sequences for identical seeds', () => {
    const rng1 = new SeededRNG(1337);
    const rng2 = new SeededRNG(1337);

    const seq1 = Array.from({ length: 10 }, () => rng1.next());
    const seq2 = Array.from({ length: 10 }, () => rng2.next());

    expect(seq1).toEqual(seq2);
  });

  it('produces different sequences for different seeds', () => {
    const rng1 = new SeededRNG(1337);
    const rng2 = new SeededRNG(9999);

    const seq1 = Array.from({ length: 10 }, () => rng1.next());
    const seq2 = Array.from({ length: 10 }, () => rng2.next());

    expect(seq1).not.toEqual(seq2);
  });

  it('generates integers within specified bounds', () => {
    const rng = new SeededRNG(42);
    for (let i = 0; i < 100; i++) {
      const val = rng.nextInt(5, 12);
      expect(val).toBeGreaterThanOrEqual(5);
      expect(val).toBeLessThanOrEqual(12);
      expect(Number.isInteger(val)).toBe(true);
    }
  });

  it('shuffles arrays deterministically', () => {
    const rng1 = new SeededRNG(777);
    const rng2 = new SeededRNG(777);

    const arr1 = [1, 2, 3, 4, 5, 6, 7, 8];
    const arr2 = [1, 2, 3, 4, 5, 6, 7, 8];

    rng1.shuffle(arr1);
    rng2.shuffle(arr2);

    expect(arr1).toEqual(arr2);
    expect(arr1.sort()).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });
});
