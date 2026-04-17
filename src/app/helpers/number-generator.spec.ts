import { generateRandomNumber } from './number-generator';

describe('NumberGenerator', () => {
  beforeEach(() => {
    // Mock window.crypto.getRandomValues if needed, 
    // but in modern browsers/environments it should be available.
  });

  it('should generate a number within the specified range [min, max]', () => {
    const min = 1;
    const max = 10;
    for (let i = 0; i < 100; i++) {
      const result = generateRandomNumber(min, max);
      expect(result).toBeGreaterThanOrEqual(min);
      expect(result).toBeLessThanOrEqual(max);
    }
  });

  it('should work with a single-value range (min === max)', () => {
    const min = 5;
    const max = 5;
    const result = generateRandomNumber(min, max);
    expect(result).toBe(5);
  });

  it('should handle large ranges correctly', () => {
    const min = 0;
    const max = 1000000;
    const result = generateRandomNumber(min, max);
    expect(result).toBeGreaterThanOrEqual(min);
    expect(result).toBeLessThanOrEqual(max);
  });

  it('should use crypto.getRandomValues to ensure randomness', () => {
    const spy = spyOn(window.crypto, 'getRandomValues').and.callThrough();
    generateRandomNumber(1, 10);
    expect(spy).toHaveBeenCalled();
  });
});
