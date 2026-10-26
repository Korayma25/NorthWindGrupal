export function onlyLetters(text: string | null | undefined): boolean {
  if (!text) {
    return true;
  }
  return /^[\p{L}\s]*$/u.test(text);
}

export function onlyDigits(text: string | null | undefined): boolean {
  if (!text) {
    return true;
  }
  return /^\d*$/.test(text);
}

export function keepLetters(text: string | null | undefined): string {
  if (!text) {
    return '';
  }
  return text.replace(/[^\p{L}\s]/gu, '');
}

export function keepDigits(text: string | null | undefined): string {
  if (!text) {
    return '';
  }
  return text.replace(/\D/g, '');
}

export function keepDigitsAndHyphen(text: string | null | undefined): string {
  if (!text) {
    return '';
  }
  return text.replace(/[^\d-]/g, '');
}

export function keepLoginCharacters(text: string | null | undefined): string {
  if (!text) {
    return '';
  }
  return text.replace(/[^\p{L}\d@.]/gu, '');
}

export class TextRules {
  public static readonly onlyLetters = onlyLetters;
  public static readonly onlyDigits = onlyDigits;
  public static readonly keepLetters = keepLetters;
  public static readonly keepDigits = keepDigits;
  public static readonly keepDigitsAndHyphen = keepDigitsAndHyphen;
  public static readonly keepLoginCharacters = keepLoginCharacters;
}
