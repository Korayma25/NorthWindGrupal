import { roundAwayFromZero } from './rounding.helper';

describe('roundAwayFromZero', () => {
  it('should round 1.005 away from zero to 1.01 with 2 decimals', () => {
    expect(roundAwayFromZero(1.005, 2)).toBe(1.01);
  });

  it('should round 1.004 to 1.00 with 2 decimals', () => {
    expect(roundAwayFromZero(1.004, 2)).toBe(1.0);
  });

  it('should round -1.005 away from zero to -1.01 with 2 decimals', () => {
    expect(roundAwayFromZero(-1.005, 2)).toBe(-1.01);
  });

  it('should round 10.555 to 10.56 with 2 decimals', () => {
    expect(roundAwayFromZero(10.555, 2)).toBe(10.56);
  });

  it('should handle 0 and non-finite inputs cleanly', () => {
    expect(roundAwayFromZero(0)).toBe(0);
    expect(roundAwayFromZero(NaN)).toBe(0);
    expect(roundAwayFromZero(Infinity)).toBe(0);
  });
});
