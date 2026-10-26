import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { InvoicesApi } from './invoices.api';
import { AppHttpError } from '../interceptors/app-http-error';
import { InvoiceDto, InvoiceSummaryDto, PagedResultDto } from '../../domain/dtos';

describe('InvoicesApi', () => {
  let api: InvoicesApi;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        InvoicesApi
      ]
    });

    api = TestBed.inject(InvoicesApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('search() should call /SearchInvoices with query parameters', () => {
    const mockResult: PagedResultDto<InvoiceSummaryDto> = {
      items: [
        {
          id: 1,
          invoiceNumber: '001-001-000000001',
          orderDate: '2026-10-26T10:00:00',
          customerName: 'Juan Perez',
          customerIdentityCard: '0912345678',
          total: 150.5
        }
      ],
      page: 1,
      pageSize: 10,
      totalCount: 1,
      totalPages: 1
    };

    api
      .search({
        invoiceNumber: '001-001',
        customerName: 'Juan',
        page: 1,
        pageSize: 10
      })
      .subscribe(res => {
        expect(res).toEqual(mockResult);
        expect(res.items.length).toBe(1);
      });

    const req = httpMock.expectOne(
      '/SearchInvoices?invoiceNumber=001-001&customerName=Juan&page=1&pageSize=10'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResult);
  });

  it('get() should call /GetInvoice with id in query string', () => {
    const mockInvoice: InvoiceDto = {
      id: 5,
      invoiceNumber: '001-001-000000005',
      orderDate: '2026-10-26T12:00:00',
      customerId: 'CUST1',
      customerName: 'Maria Lopez',
      customerIdentityCard: '0923456789',
      customerEmail: 'maria@test.com',
      customerAddress: 'Av Principal 123',
      customerCity: 'Guayaquil',
      customerCountry: 'Ecuador',
      customerPostalCode: '090101',
      subtotal: 100,
      discountAmount: 10,
      taxAmount: 10.8,
      total: 100.8,
      lines: []
    };

    api.get(5).subscribe(res => {
      expect(res.id).toBe(5);
      expect(res.invoiceNumber).toBe('001-001-000000005');
    });

    const req = httpMock.expectOne('/GetInvoice?id=5');
    expect(req.request.method).toBe('GET');
    req.flush(mockInvoice);
  });

  it('getPdf() should request blob and return Blob on success', () => {
    const fakeBlob = new Blob(['%PDF-1.4 test content'], { type: 'application/pdf' });

    api.getPdf(5).subscribe(blob => {
      expect(blob).toBeTruthy();
      expect(blob.type).toBe('application/pdf');
    });

    const req = httpMock.expectOne('/GetInvoicePdf?id=5');
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('blob');
    req.flush(fakeBlob);
  });

  it('getPdf() should parse Blob containing ProblemDetails on 404 and throw AppHttpError', async () => {
    const problemDetails = {
      type: 'https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.4',
      title: 'Recurso no encontrado.',
      status: 404,
      detail: 'Factura con id 999 no encontrada.',
      instance: 'ProblemDetails/NotFoundException'
    };

    const problemJsonString = JSON.stringify(problemDetails);
    const errorBlob = new Blob([problemJsonString], { type: 'application/problem+json' });

    let caughtError: AppHttpError | null = null;
    api.getPdf(999).subscribe({
      next: () => {
        throw new Error('Should not succeed');
      },
      error: (err: unknown) => {
        caughtError = err as AppHttpError;
      }
    });

    const req = httpMock.expectOne('/GetInvoicePdf?id=999');
    req.flush(errorBlob, { status: 404, statusText: 'Not Found' });

    // Allow promise resolution inside catchError
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(caughtError).toBeTruthy();
    expect(caughtError!.status).toBe(404);
    expect(caughtError!.message).toBe('Factura con id 999 no encontrada.');
    expect(caughtError!.detail).toBe('Factura con id 999 no encontrada.');
  });
});
