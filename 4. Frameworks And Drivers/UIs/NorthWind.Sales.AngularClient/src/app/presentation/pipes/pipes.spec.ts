import { describe, it, expect } from 'vitest';
import { CurrencyFormatPipe } from './currency-format.pipe';
import { DateFormatPipe } from './date-format.pipe';

describe('Pipes', () => {
  describe('CurrencyFormatPipe', () => {
    const pipe = new CurrencyFormatPipe();

    it('should format positive number as currency with default $', () => {
      expect(pipe.transform(1234.5)).toBe('$1,234.50');
      expect(pipe.transform(0)).toBe('$0.00');
      expect(pipe.transform(100)).toBe('$100.00');
    });

    it('should format negative number with minus sign before prefix', () => {
      expect(pipe.transform(-10)).toBe('-$10.00');
    });

    it('should allow custom prefix or empty prefix', () => {
      expect(pipe.transform(45.67, '')).toBe('45.67');
      expect(pipe.transform(45.67, 'USD ')).toBe('USD 45.67');
    });

    it('should handle null, undefined, empty string or NaN gracefully', () => {
      expect(pipe.transform(null)).toBe('');
      expect(pipe.transform(undefined)).toBe('');
      expect(pipe.transform('')).toBe('');
      expect(pipe.transform('invalid')).toBe('');
    });
  });

  describe('DateFormatPipe', () => {
    const pipe = new DateFormatPipe();
    const testDate = new Date(2026, 9, 26, 14, 30); // 26 Oct 2026 14:30

    it('should format short date as dd/MM/yyyy', () => {
      expect(pipe.transform(testDate, 'shortDate')).toBe('26/10/2026');
      expect(pipe.transform(testDate, 'short')).toBe('26/10/2026');
      expect(pipe.transform(testDate)).toBe('26/10/2026');
    });

    it('should format date time as dd/MM/yyyy HH:mm', () => {
      expect(pipe.transform(testDate, 'dateTime')).toBe('26/10/2026 14:30');
      expect(pipe.transform(testDate, 'full')).toBe('26/10/2026 14:30');
    });

    it('should handle date string inputs', () => {
      const iso = '2026-10-26T14:30:00';
      const formatted = pipe.transform(iso, 'shortDate');
      expect(formatted).toBe('26/10/2026');
    });

    it('should return empty string for null, undefined or invalid dates', () => {
      expect(pipe.transform(null)).toBe('');
      expect(pipe.transform(undefined)).toBe('');
      expect(pipe.transform('invalid-date')).toBe('');
    });
  });
});
