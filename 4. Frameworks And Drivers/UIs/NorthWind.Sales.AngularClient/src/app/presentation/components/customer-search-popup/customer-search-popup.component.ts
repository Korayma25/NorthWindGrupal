import { Component, effect, inject, input, model, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, catchError, of } from 'rxjs';
import { CustomerLookupDto, PagedResultDto } from '../../../domain/dtos';
import { CustomersApi } from '../../../infrastructure/api/customers.api';
import { AppHttpError } from '../../../infrastructure/interceptors';
import {
  isEcuadorianIdentityCardValid,
  keepDigits,
  keepLetters,
  onlyDigits,
  onlyLetters
} from '../../../domain/validators';
import { CharFilterDirective } from '../../directives/char-filter.directive';
import { SearchModalComponent } from '../search-modal/search-modal.component';
import { es } from '../../../i18n/es';

@Component({
  selector: 'app-customer-search-popup',
  standalone: true,
  imports: [CommonModule, SearchModalComponent, CharFilterDirective],
  templateUrl: './customer-search-popup.component.html'
})
export class CustomerSearchPopupComponent {
  private readonly customersApi = inject(CustomersApi);

  public readonly visible = model<boolean>(false);
  public readonly selected = output<CustomerLookupDto>();
  public readonly debounceMilliseconds = input<number>(400);
  public readonly minSearchLength = input<number>(2);

  public readonly filterName = signal<string>('');
  public readonly filterIdentityCard = signal<string>('');
  public readonly nameValidationError = signal<string | null>(null);
  public readonly identityCardValidationError = signal<string | null>(null);
  public readonly serverError = signal<string | null>(null);

  public readonly es = es;

  private lastSearchedName = '';
  private lastSearchedIdentityCard = '';
  private previousVisible = false;

  constructor() {
    effect(() => {
      const isVisible = this.visible();
      if (isVisible && !this.previousVisible) {
        this.filterName.set('');
        this.filterIdentityCard.set('');
        this.nameValidationError.set(null);
        this.identityCardValidationError.set(null);
        this.serverError.set(null);
        this.lastSearchedName = '';
        this.lastSearchedIdentityCard = '';
      }
      this.previousVisible = isVisible;
    });
  }

  public onNameInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const filtered = keepLetters(input.value).slice(0, 40);
    this.filterName.set(filtered);
    this.validateName();
  }

  public onIdentityCardInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const filtered = keepDigits(input.value).slice(0, 10);
    this.filterIdentityCard.set(filtered);
    this.validateIdentityCard();
  }

  public validateName(): boolean {
    this.nameValidationError.set(null);
    const name = this.filterName();
    if (name && !onlyLetters(name)) {
      this.nameValidationError.set(es.search.customerNameOnlyLetters);
      return false;
    }
    return true;
  }

  public validateIdentityCard(): boolean {
    this.identityCardValidationError.set(null);
    const id = this.filterIdentityCard();
    if (id) {
      if (!onlyDigits(id)) {
        this.identityCardValidationError.set(es.search.identityCardOnlyDigits);
        return false;
      }
      if (id.length > 10) {
        this.identityCardValidationError.set(es.search.identityCardMaximumLength);
        return false;
      }
      if (id.length === 10 && !isEcuadorianIdentityCardValid(id)) {
        this.identityCardValidationError.set(es.search.identityCardInvalid);
        return false;
      }
    }
    return true;
  }

  public canSearchCustomer = (): boolean => {
    const isNameValid = this.validateName();
    const isCardValid = this.validateIdentityCard();

    if (!isNameValid || !isCardValid) {
      return false;
    }

    const name = this.filterName();
    const card = this.filterIdentityCard();

    if (name.length === 1 && card.length === 0) {
      return false;
    }

    if (name === this.lastSearchedName && card === this.lastSearchedIdentityCard) {
      return false;
    }

    return true;
  };

  public loadCustomers = (
    page: number,
    pageSize: number
  ): Observable<PagedResultDto<CustomerLookupDto>> => {
    this.serverError.set(null);
    const isNameValid = this.validateName();
    const isCardValid = this.validateIdentityCard();

    if (!isNameValid || !isCardValid) {
      return of({ items: [], page, pageSize, totalCount: 0, totalPages: 0 });
    }

    this.lastSearchedName = this.filterName();
    this.lastSearchedIdentityCard = this.filterIdentityCard();

    return this.customersApi
      .search({
        name: this.filterName(),
        identityCard: this.filterIdentityCard(),
        page,
        pageSize
      })
      .pipe(
        catchError(err => {
          if (err instanceof AppHttpError && err.status === 400) {
            let matched = false;
            for (const [key, msg] of Object.entries(err.fieldErrors)) {
              const lower = key.toLowerCase();
              if (lower.includes('name')) {
                this.nameValidationError.set(msg);
                matched = true;
              } else if (lower.includes('identitycard')) {
                this.identityCardValidationError.set(msg);
                matched = true;
              } else {
                this.serverError.set(msg);
                matched = true;
              }
            }
            if (!matched) {
              this.serverError.set(err.message || es.errors.validationExceptionDetail);
            }
          } else {
            this.serverError.set(
              err instanceof Error ? err.message : es.errors.genericErrorMessage
            );
          }
          return of({ items: [], page, pageSize, totalCount: 0, totalPages: 0 });
        })
      );
  };

  public onCustomerSelected(customer: CustomerLookupDto): void {
    this.selected.emit(customer);
    this.visible.set(false);
  }
}
