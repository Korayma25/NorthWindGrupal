import { describe, it, expect } from 'vitest';
import { EcuadorianIdentityCard } from './ecuadorian-identity-card.validator';
import { TextRules, keepDigits, keepDigitsAndHyphen, keepLetters, keepLoginCharacters, onlyDigits, onlyLetters } from './text-rules';

describe('Domain Validators and TextRules', () => {
  describe('EcuadorianIdentityCard', () => {
    it('should validate valid Ecuadorian natural person identity cards', () => {
      expect(EcuadorianIdentityCard.isValid('1710034065')).toBe(true);
      expect(EcuadorianIdentityCard.isValid('0926618422')).toBe(true);
    });

    it('should reject invalid check digit', () => {
      expect(EcuadorianIdentityCard.isValid('1710034066')).toBe(false);
      expect(EcuadorianIdentityCard.isValid('0926618423')).toBe(false);
    });

    it('should reject invalid province codes (00 or > 24)', () => {
      expect(EcuadorianIdentityCard.isValid('0010034065')).toBe(false);
      expect(EcuadorianIdentityCard.isValid('2510034065')).toBe(false);
      expect(EcuadorianIdentityCard.isValid('9910034065')).toBe(false);
    });

    it('should reject invalid third digit (must be 0-5 for natural persons)', () => {
      expect(EcuadorianIdentityCard.isValid('1760034065')).toBe(false);
      expect(EcuadorianIdentityCard.isValid('1790034065')).toBe(false);
    });

    it('should reject length different than 10 digits', () => {
      expect(EcuadorianIdentityCard.isValid('171003406')).toBe(false);
      expect(EcuadorianIdentityCard.isValid('17100340655')).toBe(false);
      expect(EcuadorianIdentityCard.isValid('123')).toBe(false);
    });

    it('should reject non-digit characters', () => {
      expect(EcuadorianIdentityCard.isValid('171003406a')).toBe(false);
      expect(EcuadorianIdentityCard.isValid('1710-34065')).toBe(false);
      expect(EcuadorianIdentityCard.isValid('1710 34065')).toBe(false);
    });

    it('should reject null, undefined, or empty string', () => {
      expect(EcuadorianIdentityCard.isValid('')).toBe(false);
      expect(EcuadorianIdentityCard.isValid('   ')).toBe(false);
      expect(EcuadorianIdentityCard.isValid(null)).toBe(false);
      expect(EcuadorianIdentityCard.isValid(undefined)).toBe(false);
    });
  });

  describe('TextRules', () => {
    describe('keepLetters and onlyLetters', () => {
      it('should keep letters, accented characters, and spaces while removing digits and symbols', () => {
        expect(TextRules.keepLetters('Juan 123 Pérez!')).toBe('Juan  Pérez');
        expect(keepLetters('Ángel Ramón Niño 456')).toBe('Ángel Ramón Niño ');
        expect(keepLetters('1234567890!@#$%^&*()')).toBe('');
      });

      it('should validate onlyLetters correctly', () => {
        expect(TextRules.onlyLetters('Juan Perez')).toBe(true);
        expect(onlyLetters('María José')).toBe(true);
        expect(onlyLetters('Juan 123')).toBe(false);
        expect(onlyLetters('Juan-Perez')).toBe(false);
        expect(onlyLetters('')).toBe(true);
      });
    });

    describe('keepDigits and onlyDigits', () => {
      it('should keep only digits', () => {
        expect(TextRules.keepDigits('abc123def456!@#')).toBe('123456');
        expect(keepDigits('No digits here')).toBe('');
        expect(keepDigits('0912345678')).toBe('0912345678');
      });

      it('should validate onlyDigits correctly', () => {
        expect(TextRules.onlyDigits('123456')).toBe(true);
        expect(onlyDigits('0912345678')).toBe(true);
        expect(onlyDigits('123a456')).toBe(false);
        expect(onlyDigits('123-456')).toBe(false);
        expect(onlyDigits('')).toBe(true);
      });
    });

    describe('keepDigitsAndHyphen', () => {
      it('should keep digits and hyphens while removing all other characters', () => {
        expect(TextRules.keepDigitsAndHyphen('001-001-000000001')).toBe('001-001-000000001');
        expect(keepDigitsAndHyphen('Inv# 001-001-000000001 (Paid)')).toBe('001-001-000000001');
        expect(keepDigitsAndHyphen('abc--123--def')).toBe('--123--');
        expect(keepDigitsAndHyphen('')).toBe('');
      });
    });

    describe('keepLoginCharacters', () => {
      it('should keep letters, digits, @, . while removing spaces, hyphens, underscores and other symbols', () => {
        expect(TextRules.keepLoginCharacters('user_name-123@domain.com')).toBe('username123@domain.com');
        expect(keepLoginCharacters('user 123 + special! #$%')).toBe('user123special');
        expect(keepLoginCharacters('admin.test@subdomain.com')).toBe('admin.test@subdomain.com');
      });
    });
  });
});
