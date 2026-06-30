import { describe, expect, it } from 'vitest';
import { calculateGiftMachineCount } from './giftRules';

describe('calculateGiftMachineCount', () => {
  it('returns 0 when total oil liters are below 3L', () => {
    expect(calculateGiftMachineCount(2.9, 3)).toBe(0);
  });

  it('returns 1 when total oil liters reach 3L', () => {
    expect(calculateGiftMachineCount(3, 3)).toBe(1);
  });

  it('returns one gift machine for every full 3L', () => {
    expect(calculateGiftMachineCount(6, 3)).toBe(2);
    expect(calculateGiftMachineCount(9.5, 3)).toBe(3);
  });

  it('returns 0 when the configured gift step is invalid', () => {
    expect(calculateGiftMachineCount(6, 0)).toBe(0);
  });
});
