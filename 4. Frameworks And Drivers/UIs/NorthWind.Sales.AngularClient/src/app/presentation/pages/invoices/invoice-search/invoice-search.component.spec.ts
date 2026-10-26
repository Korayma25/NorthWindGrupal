import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { InvoiceSearchComponent } from './invoice-search.component';
import { InvoicesApi } from '../../../../infrastructure/api';
import { AppHttpError } from '../../../../infrastructure/interceptors';
import { InvoiceSummaryDto, PagedResultDto } from '../../../../domain/dtos';

describe('InvoiceSearchComponent', () => {
  let component: InvoiceSearchComponent;
  let fixture: ComponentFixture<InvoiceSearchComponent>;
  let invoicesApiMock: {
    search: any;
  };

  const sampleResult: PagedResultDto<InvoiceSummaryDto> = {
    items: [
      {
        id: 10,
        invoiceNumber: '001-001-000000010',
        orderDate: '2026-10-26T09:00:00',
        customerName: 'Carlos Benitez',
        customerIdentityCard: '0912345678',
        total: 250.75
      }
    ],
    page: 1,
    pageSize: 10,
    totalCount: 1,
    totalPages: 1
  };

  beforeEach(async () => {
    vi.useFakeTimers();

    invoicesApiMock = {
      search: vi.fn().mockReturnValue(of(sampleResult))
    };

    await TestBed.configureTestingModule({
      imports: [InvoiceSearchComponent],
      providers: [
        provideRouter([]),
        { provide: InvoicesApi, useValue: invoicesApiMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InvoiceSearchComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should initialize and perform initial search on page 1', () => {
    fixture.detectChanges();

    expect(invoicesApiMock.search).toHaveBeenCalledWith({
      invoiceNumber: '',
      customerName: '',
      page: 1,
      pageSize: 10
    });

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Carlos Benitez');
    expect(compiled.textContent).toContain('001-001-000000010');
    expect(compiled.textContent).toContain('$250.75');
    expect(compiled.textContent).toContain('26/10/2026');

    const viewLink = compiled.querySelector('#view-invoice-10') as HTMLAnchorElement;
    expect(viewLink).not.toBeNull();
    expect(viewLink.getAttribute('href')).toBe('/invoices/10');
  });

  it('should show "Sin resultados" message when items list is empty', () => {
    invoicesApiMock.search.mockReturnValue(
      of({ items: [], page: 1, pageSize: 10, totalCount: 0, totalPages: 0 })
    );

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const noResultsAlert = compiled.querySelector('#no-invoices-alert');
    expect(noResultsAlert).not.toBeNull();
    expect(noResultsAlert?.textContent).toContain('Sin resultados');
  });

  it('should debounce input changes by 400ms and search', () => {
    fixture.detectChanges();
    invoicesApiMock.search.mockClear();

    const input = fixture.nativeElement.querySelector('#filter-customer-name') as HTMLInputElement;
    input.value = 'Carlos';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.customerName()).toBe('Carlos');
    expect(invoicesApiMock.search).not.toHaveBeenCalled();

    vi.advanceTimersByTime(399);
    expect(invoicesApiMock.search).not.toHaveBeenCalled();

    vi.advanceTimersByTime(2);
    expect(invoicesApiMock.search).toHaveBeenCalledWith({
      invoiceNumber: '',
      customerName: 'Carlos',
      page: 1,
      pageSize: 10
    });
  });

  it('should not search dynamically when customer length is 1', () => {
    fixture.detectChanges();
    invoicesApiMock.search.mockClear();

    const input = fixture.nativeElement.querySelector('#filter-customer-name') as HTMLInputElement;
    input.value = 'C';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    vi.advanceTimersByTime(500);
    expect(invoicesApiMock.search).not.toHaveBeenCalled();
  });

  it('should trigger immediate search on submit without waiting for debounce', () => {
    fixture.detectChanges();
    invoicesApiMock.search.mockClear();

    component.customerName.set('Carlos');
    component.onSearchSubmit();

    expect(invoicesApiMock.search).toHaveBeenCalledWith({
      invoiceNumber: '',
      customerName: 'Carlos',
      page: 1,
      pageSize: 10
    });
  });

  it('should trigger search with new page when page changes', () => {
    fixture.detectChanges();
    invoicesApiMock.search.mockClear();

    component.onPageChanged(2);

    expect(component.page()).toBe(2);
    expect(invoicesApiMock.search).toHaveBeenCalledWith({
      invoiceNumber: '',
      customerName: '',
      page: 2,
      pageSize: 10
    });
  });

  it('should display error message on server error', () => {
    invoicesApiMock.search.mockReturnValue(
      throwError(() => new AppHttpError({ message: 'Error al buscar facturas', status: 500 }))
    );

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Error al buscar facturas');
  });
});
