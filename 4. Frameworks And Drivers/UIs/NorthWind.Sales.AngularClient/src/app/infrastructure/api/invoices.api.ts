import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, from, throwError } from 'rxjs';
import {
  InvoiceDto,
  InvoiceSummaryDto,
  PagedResultDto,
  ProblemDetails,
  SearchInvoicesDto
} from '../../domain/dtos';
import { AppHttpError } from '../interceptors/app-http-error';
import { Endpoints } from './endpoints';
import { es } from '../../i18n/es';

@Injectable({
  providedIn: 'root'
})
export class InvoicesApi {
  private readonly http = inject(HttpClient);

  public search(
    criteria: Partial<SearchInvoicesDto> = {}
  ): Observable<PagedResultDto<InvoiceSummaryDto>> {
    const page = criteria.page ?? 1;
    const pageSize = criteria.pageSize ?? 10;
    const invoiceNumber = encodeURIComponent(criteria.invoiceNumber ?? '');
    const customerName = encodeURIComponent(criteria.customerName ?? '');

    const url = `${Endpoints.SearchInvoices}?invoiceNumber=${invoiceNumber}&customerName=${customerName}&page=${page}&pageSize=${pageSize}`;
    return this.http.get<PagedResultDto<InvoiceSummaryDto>>(url);
  }

  public get(id: number): Observable<InvoiceDto> {
    const url = `${Endpoints.GetInvoice}?id=${id}`;
    return this.http.get<InvoiceDto>(url);
  }

  public getPdf(id: number): Observable<Blob> {
    const url = `${Endpoints.GetInvoicePdf}?id=${id}`;
    return this.http.get(url, { responseType: 'blob' }).pipe(
      catchError((err: unknown) => {
        // If error response wraps a Blob body (e.g. 404 ProblemDetails when testing or bypassed)
        if (err instanceof HttpErrorResponse && err.error instanceof Blob) {
          return from(this.parseBlobProblemDetails(err));
        }
        return throwError(() => err);
      })
    );
  }

  private async parseBlobProblemDetails(err: HttpErrorResponse): Promise<never> {
    let problem: ProblemDetails | null = null;
    try {
      const text = await (err.error as Blob).text();
      problem = JSON.parse(text);
    } catch {
      // Body was not JSON
    }

    const message = problem?.detail || problem?.title || es.invoices.invoiceNotFound;
    throw new AppHttpError({
      message,
      status: err.status,
      title: problem?.title ?? (err.status === 404 ? es.errors.notFoundExceptionTitle : undefined),
      detail: problem?.detail,
      problemDetails: problem ?? undefined
    });
  }
}
