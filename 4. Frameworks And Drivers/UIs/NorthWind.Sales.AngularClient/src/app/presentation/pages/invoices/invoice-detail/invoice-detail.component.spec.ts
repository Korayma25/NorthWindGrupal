import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { InvoiceDetailComponent } from './invoice-detail.component';
import { InvoicesApi } from '../../../../infrastructure/api';
import { AppHttpError } from '../../../../infrastructure/interceptors';
import { InvoiceDto } from '../../../../domain/dtos';

describe('InvoiceDetailComponent', () => {
  let component: InvoiceDetailComponent;
  let fixture: ComponentFixture<InvoiceDetailComponent>;
  let invoicesApiMock: {
    get: any;
    getPdf: any;
  };

  const sampleInvoice: InvoiceDto = {
    id: 15,
    invoiceNumber: '001-001-000000015',
    orderDate: '2026-10-26T14:30:00',
    customerId: 'CUST123',
    customerName: 'Ana Gomez',
    customerIdentityCard: '0987654321',
    customerEmail: 'ana@example.com',
    customerAddress: 'Calle 10 y Av 4',
    customerCity: 'Quito',
    customerCountry: 'Ecuador',
    customerPostalCode: '170101',
    subtotal: 100.0,
    discountAmount: 10.0,
    taxAmount: 10.8,
    total: 100.8,
    lines: [
      {
        productId: 1,
        productCode: 'PROD-01',
        productName: 'Camiseta de Algodón',
        unitPrice: 20.0,
        quantity: 5,
        taxRate: 0.12,
        lineSubtotal: 100.0
      }
    ]
  };

  beforeEach(async () => {
    invoicesApiMock = {
      get: vi.fn().mockReturnValue(of(sampleInvoice)),
      getPdf: vi.fn().mockReturnValue(of(new Blob(['%PDF-1.4'], { type: 'application/pdf' })))
    };

    await TestBed.configureTestingModule({
      imports: [InvoiceDetailComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'id' ? '15' : null)
              }
            }
          }
        },
        { provide: InvoicesApi, useValue: invoicesApiMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InvoiceDetailComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should load and render invoice details including header, customer, lines and totals', () => {
    fixture.detectChanges();

    expect(invoicesApiMock.get).toHaveBeenCalledWith(15);
    expect(component.invoice()).toEqual(sampleInvoice);

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#invoice-number-val')?.textContent).toContain('001-001-000000015');
    expect(compiled.querySelector('#invoice-id-badge')?.textContent).toContain('#15');
    expect(compiled.querySelector('#customer-name-val')?.textContent).toContain('Ana Gomez');
    expect(compiled.querySelector('#customer-card-val')?.textContent).toContain('0987654321');

    // Line items
    expect(compiled.textContent).toContain('PROD-01');
    expect(compiled.textContent).toContain('Camiseta de Algodón');
    expect(compiled.textContent).toContain('$20.00');
    expect(compiled.textContent).toContain('12%');

    // Totals
    expect(compiled.querySelector('#invoice-subtotal-val')?.textContent).toContain('$100.00');
    expect(compiled.querySelector('#invoice-discount-val')?.textContent).toContain('-$10.00');
    expect(compiled.querySelector('#invoice-tax-val')?.textContent).toContain('$10.80');
    expect(compiled.querySelector('#invoice-total-val')?.textContent).toContain('$100.80');
  });

  it('should display danger alert when invoice is not found (404)', () => {
    invoicesApiMock.get.mockReturnValue(
      throwError(
        () =>
          new AppHttpError({
            message: 'La factura solicitada no existe o no fue encontrada.',
            status: 404
          })
      )
    );

    fixture.detectChanges();

    expect(component.errorMessage()).toBe('La factura solicitada no existe o no fue encontrada.');
    const compiled = fixture.nativeElement as HTMLElement;
    const alert = compiled.querySelector('#invoice-error-alert');
    expect(alert).not.toBeNull();
    expect(alert?.textContent).toContain('La factura solicitada no existe o no fue encontrada.');
    expect(compiled.querySelector('#invoice-number-val')).toBeNull();
  });

  it('should load PDF when "Ver Factura (PDF)" is clicked and render pdf viewer section', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#pdf-viewer-section')).toBeNull();

    const pdfBtn = compiled.querySelector('#load-pdf-btn') as HTMLButtonElement;
    pdfBtn.click();
    fixture.detectChanges();

    expect(invoicesApiMock.getPdf).toHaveBeenCalledWith(15);
    expect(component.showPdf()).toBe(true);
    expect(component.pdfBlob()).toBeTruthy();
    expect(compiled.querySelector('#pdf-viewer-section')).not.toBeNull();

    // Close PDF
    const closeBtn = compiled.querySelector('#close-pdf-btn') as HTMLButtonElement;
    closeBtn.click();
    fixture.detectChanges();

    expect(component.showPdf()).toBe(false);
    expect(compiled.querySelector('#pdf-viewer-section')).toBeNull();
  });
});
