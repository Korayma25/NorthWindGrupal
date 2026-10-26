import { Component, effect, inject, input, model, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, catchError, of } from 'rxjs';
import { PagedResultDto, ProductLookupDto } from '../../../domain/dtos';
import { ProductsApi } from '../../../infrastructure/api/products.api';
import { AppHttpError } from '../../../infrastructure/interceptors';
import { keepLetters } from '../../../domain/validators';
import { CharFilterDirective } from '../../directives/char-filter.directive';
import { SearchModalComponent } from '../search-modal/search-modal.component';
import { es } from '../../../i18n/es';

@Component({
  selector: 'app-product-search-popup',
  standalone: true,
  imports: [CommonModule, SearchModalComponent, CharFilterDirective],
  templateUrl: './product-search-popup.component.html'
})
export class ProductSearchPopupComponent {
  private readonly productsApi = inject(ProductsApi);

  public readonly visible = model<boolean>(false);
  public readonly selected = output<ProductLookupDto>();
  public readonly debounceMilliseconds = input<number>(400);
  public readonly minSearchLength = input<number>(2);

  public readonly filterName = signal<string>('');
  public readonly filterCode = signal<string>('');
  public readonly serverError = signal<string | null>(null);

  public readonly es = es;

  private lastSearchedName = '';
  private lastSearchedCode = '';
  private previousVisible = false;

  constructor() {
    effect(() => {
      const isVisible = this.visible();
      if (isVisible && !this.previousVisible) {
        this.filterName.set('');
        this.filterCode.set('');
        this.serverError.set(null);
        this.lastSearchedName = '';
        this.lastSearchedCode = '';
      }
      this.previousVisible = isVisible;
    });
  }

  public onNameInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const filtered = keepLetters(input.value).slice(0, 60);
    this.filterName.set(filtered);
  }

  public onCodeInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = (input.value || '').slice(0, 20);
    this.filterCode.set(value);
  }

  public canSearchProduct = (): boolean => {
    const name = this.filterName();
    const code = this.filterCode();

    if (name.length === 1 && code.length === 0) {
      return false;
    }

    if (name === this.lastSearchedName && code === this.lastSearchedCode) {
      return false;
    }

    return true;
  };

  public loadProducts = (
    page: number,
    pageSize: number
  ): Observable<PagedResultDto<ProductLookupDto>> => {
    this.serverError.set(null);
    this.lastSearchedName = this.filterName();
    this.lastSearchedCode = this.filterCode();

    return this.productsApi
      .search({
        name: this.filterName(),
        code: this.filterCode(),
        page,
        pageSize
      })
      .pipe(
        catchError(err => {
          if (err instanceof AppHttpError && err.status === 400) {
            this.serverError.set(err.message || es.errors.validationExceptionDetail);
          } else {
            this.serverError.set(
              err instanceof Error ? err.message : es.errors.genericErrorMessage
            );
          }
          return of({ items: [], page, pageSize, totalCount: 0, totalPages: 0 });
        })
      );
  };

  public onProductSelected(product: ProductLookupDto): void {
    this.selected.emit(product);
    this.visible.set(false);
  }

  public formatTaxRate(rate: number): string {
    const percent = rate * 100;
    return `${parseFloat(percent.toFixed(2))}%`;
  }
}
