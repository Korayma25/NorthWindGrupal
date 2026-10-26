import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat',
  standalone: true
})
export class CurrencyFormatPipe implements PipeTransform {
  /**
   * Formats a number or string into a 2-decimal currency string (default '$#,##0.00').
   * @param value Numeric value to format
   * @param prefix Currency symbol (defaults to '$')
   */
  public transform(value: number | string | null | undefined, prefix = '$'): string {
    if (value === null || value === undefined || value === '') {
      return '';
    }

    const num = typeof value === 'number' ? value : Number(value);
    if (Number.isNaN(num)) {
      return '';
    }

    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Math.abs(num));

    const sign = num < 0 ? '-' : '';
    return `${sign}${prefix}${formatted}`;
  }
}
