import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { InvoiceDto } from '../../../../domain/dtos';
import { InvoicesApi } from '../../../../infrastructure/api';
import { AppHttpError } from '../../../../infrastructure/interceptors';
import { MessageAlertComponent, PdfViewerComponent } from '../../../components';
import { CurrencyFormatPipe, DateFormatPipe } from '../../../pipes';
import { es } from '../../../../i18n/es';

@Component({
  selector: 'app-invoice-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MessageAlertComponent,
    PdfViewerComponent,
    CurrencyFormatPipe,
    DateFormatPipe
  ],
  templateUrl: './invoice-detail.component.html'
})
export class InvoiceDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly invoicesApi = inject(InvoicesApi);

  public readonly invoiceId = signal<number | null>(null);
  public readonly invoice = signal<InvoiceDto | null>(null);
  public readonly isLoading = signal<boolean>(false);
  public readonly errorMessage = signal<string | null>(null);

  public readonly pdfBlob = signal<Blob | null>(null);
  public readonly showPdf = signal<boolean>(false);
  public readonly isLoadingPdf = signal<boolean>(false);
  public readonly pdfErrorMessage = signal<string | null>(null);

  public readonly es = es;

  public ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);

    if (!idParam || Number.isNaN(id) || id <= 0) {
      this.errorMessage.set(es.invoices.invoiceNotFound);
      return;
    }

    this.invoiceId.set(id);
    this.loadInvoice(id);
  }

  public loadInvoice(id: number): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.invoicesApi.get(id).subscribe({
      next: data => {
        if (!data) {
          this.errorMessage.set(es.invoices.invoiceNotFound);
        } else {
          this.invoice.set(data);
        }
        this.isLoading.set(false);
      },
      error: (err: unknown) => {
        if (err instanceof AppHttpError) {
          this.errorMessage.set(err.message || es.invoices.invoiceNotFound);
        } else if (err instanceof Error) {
          this.errorMessage.set(err.message);
        } else {
          this.errorMessage.set(es.invoices.invoiceNotFound);
        }
        this.isLoading.set(false);
      }
    });
  }

  public onLoadPdf(): void {
    const inv = this.invoice();
    if (!inv) {
      return;
    }

    if (this.pdfBlob()) {
      this.showPdf.set(true);
      return;
    }

    this.isLoadingPdf.set(true);
    this.pdfErrorMessage.set(null);

    this.invoicesApi.getPdf(inv.id).subscribe({
      next: blob => {
        this.pdfBlob.set(blob);
        this.showPdf.set(true);
        this.isLoadingPdf.set(false);
      },
      error: (err: unknown) => {
        if (err instanceof AppHttpError) {
          this.pdfErrorMessage.set(err.message);
        } else if (err instanceof Error) {
          this.pdfErrorMessage.set(err.message);
        } else {
          this.pdfErrorMessage.set(es.errors.genericErrorMessage);
        }
        this.isLoadingPdf.set(false);
      }
    });
  }

  public closePdf(): void {
    this.showPdf.set(false);
  }

  public formatTaxPercent(rate: number): string {
    const percent = rate * 100;
    return `${parseFloat(percent.toFixed(2))}%`;
  }
}
