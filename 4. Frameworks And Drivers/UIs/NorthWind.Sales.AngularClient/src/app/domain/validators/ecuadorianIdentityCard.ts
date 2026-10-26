export function isEcuadorianIdentityCardValid(id: string | null | undefined): boolean {
  if (!id || id.trim().length !== 10 || !/^\d{10}$/.test(id)) {
    return false;
  }

  const province = parseInt(id.substring(0, 2), 10);
  if (!((province >= 1 && province <= 24) || province === 30)) {
    return false;
  }

  const thirdDigit = parseInt(id.charAt(2), 10);
  if (thirdDigit > 5) {
    return false;
  }

  const coefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let product = parseInt(id.charAt(i), 10) * coefficients[i];
    if (product > 9) {
      product -= 9;
    }
    sum += product;
  }

  const verifier = (10 - (sum % 10)) % 10;
  return verifier === parseInt(id.charAt(9), 10);
}

export class EcuadorianIdentityCard {
  public static isValid(id: string | null | undefined): boolean {
    return isEcuadorianIdentityCardValid(id);
  }
}
