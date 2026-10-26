import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InvoiceSummaryDto, PagedResultDto } from '../../../../domain/dtos';
import { InvoicesApi } from '../../../../infrastructure/api';
import { AppHttpError } from '../../../../infrastructure/interceptors';
import { keepDigitsAndHyphen, keepLetters, onlyLetters } from '../../../../domain/validators';
import { CharFilterDirective } from '../../../directives/char-filter.directive';
import { PagerComponent } from '../../../components';
import { CurrencyFormatPipe, DateFormatPipe } from '../../../pipes';
import { es } from '../../../../i18n/es';

@Component({
  selector: 'app-invoice-search',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CharFilterDirective,
    PagerComponent,
    CurrencyFormatPipe,
    DateFormatPipe
  ],
  templateUrl: './invoice-search.component.html'
})
export class InvoiceSearchComponent implements OnInit, OnDestroy {
  private readonly invoicesApi = inject(InvoicesApi);

  public readonly invoiceNumber = signal<string>('');
  public readonly customerName = signal<string>('');
  public readonly page = signal<number>(1);
  public readonly pageSize = signal<number>(10);
  public readonly invoices = signal<PagedResultDto<InvoiceSummaryDto> | null>(null);
  public readonly isLoading = signal<boolean>(false);
  public readonly customerNameValidationError = signal<string | null>(null);
  public readonly errorMessage = signal<string | null>(null);
  public readonly fieldErrors = signal<Record<string, string>>({});

  public readonly es = es;

  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private searchVersion = 0;
  private lastSearchedInvoiceNumber = '';
  private lastSearchedCustomerName = '';

  public ngOnInit(): void {
    this.searchImmediate(1);
  }

  public onInvoiceNumberInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let filtered = keepDigitsAndHyphen(input.value);
    if (filtered.length > 17) {
      filtered = filtered.slice(0, 17);
    }

    if (this.invoiceNumber() === filtered) {
      return;
    }

    this.invoiceNumber.set(filtered);
    this.onFilterInput();
  }

  public onCustomerNameInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let filtered = keepLetters(input.value);
    if (filtered.length > 40) {
      filtered = filtered.slice(0, 40);
    }

    if (this.customerName() === filtered) {
      return;
    }

    this.customerName.set(filtered);
    this.validateCustomerName();
    this.onFilterInput();
  }

  public validateCustomerName(): boolean {
    const name = this.customerName();
    this.customerNameValidationError.set(null);

    if (name && !onlyLetters(name)) {
      this.customerNameValidationError.set(es.invoices.customerNameValidationError);
      return false;
    }
    return true;
  }

  private canDynamicSearch(): boolean {
    if (!this.validateCustomerName()) {
      return false;
    }

    if (this.customerName().length === 1) {
      return false;
    }

    if (this.invoiceNumber().length === 1) {
      return false;
    }

    if (
      this.invoiceNumber() === this.lastSearchedInvoiceNumber &&
      this.customerName() === this.lastSearchedCustomerName
    ) {
      return false;
    }

    return true;
  }

  private onFilterInput(): void {
    this.clearDebounceTimer();

    if (!this.canDynamicSearch()) {
      return;
    }

    this.debounceTimer = setTimeout(() => {
      this.searchImmediate(1);
    }, 400);
  }

  public onSearchSubmit(): void {
    this.clearDebounceTimer();
    if (this.validateCustomerName()) {
      this.searchImmediate(1);
    }
  }

  public onPageChanged(newPage: number): void {
    this.clearDebounceTimer();
    if (this.validateCustomerName()) {
      this.searchImmediate(newPage);
    }
  }

  private searchImmediate(targetPage: number): void {
    this.page.set(targetPage);
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.fieldErrors.set({});

    this.lastSearchedInvoiceNumber = this.invoiceNumber();
    this.lastSearchedCustomerName = this.customerName();

    const currentVersion = ++this.searchVersion;

    this.invoicesApi
      .search({
        invoiceNumber: this.invoiceNumber(),
        customerName: this.customerName(),
        page: targetPage,
        pageSize: this.pageSize()
      })
      .subscribe({
        next: result => {
          if (currentVersion === this.searchVersion) {
            this.invoices.set(result);
            this.isLoading.set(false);
          }
        },
        error: (err: unknown) => {
          if (currentVersion === this.searchVersion) {
            if (err instanceof AppHttpError) {
              this.errorMessage.set(err.message);
              this.fieldErrors.set(err.fieldErrors || {});
            } else if (err instanceof Error) {
              this.errorMessage.set(err.message);
            } else {
              this.errorMessage.set(es.errors.genericErrorMessage);
            }
            this.isLoading.set(false);
          }
        }
      });
  }

  private clearDebounceTimer(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
  }

  public ngOnDestroy(): void {
    this.clearDebounceTimer();
    this.searchVersion++;
  }
}
