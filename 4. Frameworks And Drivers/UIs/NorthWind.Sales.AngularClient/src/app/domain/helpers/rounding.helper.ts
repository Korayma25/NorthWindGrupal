/**
 * Rounds a number to a specified number of decimal places using MidpointRounding.AwayFromZero
 * (the exact algorithm used by C# Math.Round(val, decimals, MidpointRounding.AwayFromZero) in OrderAggregate.CalculateTotals).
 */
export function roundAwayFromZero(value: number, decimals = 2): number {
  if (isNaN(value) || !isFinite(value)) {
    return 0;
  }
  const sign = value < 0 ? -1 : 1;
  const absValue = Math.abs(value);
  // Using exponential notation eliminates floating-point precision artifacts (e.g. 1.005)
  const shifted = Math.round(Number(absValue + 'e' + decimals));
  const result = Number(shifted + 'e-' + decimals);
  return sign * result;
}
