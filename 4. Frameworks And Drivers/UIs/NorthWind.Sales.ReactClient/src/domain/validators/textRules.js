/**
 * Text validation and filtering rules for NorthWind Sales.
 */

export function onlyLetters(text) {
  if (!text) {
    return true;
  }
  return /^[\p{L}\s]*$/u.test(text);
}

export function onlyDigits(text) {
  if (!text) {
    return true;
  }
  return /^\d*$/.test(text);
}

export function keepLetters(text) {
  if (!text) {
    return '';
  }
  return text.replace(/[^\p{L}\s]/gu, '');
}

export function keepDigits(text) {
  if (!text) {
    return '';
  }
  return text.replace(/\D/g, '');
}

export function keepDigitsAndHyphen(text) {
  if (!text) {
    return '';
  }
  return text.replace(/[^\d-]/g, '');
}

export function keepLoginCharacters(text) {
  if (!text) {
    return '';
  }
  return text.replace(/[^\p{L}\d@.]/gu, '');
}

export class TextRules {
  static onlyLetters = onlyLetters;
  static onlyDigits = onlyDigits;
  static keepLetters = keepLetters;
  static keepDigits = keepDigits;
  static keepDigitsAndHyphen = keepDigitsAndHyphen;
  static keepLoginCharacters = keepLoginCharacters;
}

export default TextRules;
