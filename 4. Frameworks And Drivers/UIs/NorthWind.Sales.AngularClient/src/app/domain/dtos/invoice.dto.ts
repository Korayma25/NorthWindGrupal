export interface SearchInvoicesDto {
  readonly invoiceNumber?: string | null;
  readonly customerName?: string | null;
  readonly page: number;
  readonly pageSize: number;
}

export interface InvoiceSummaryDto {
  readonly id: number;
  readonly invoiceNumber: string;
  readonly orderDate: string;
  readonly customerName: string;
  readonly customerIdentityCard: string;
  readonly total: number;
}

export interface InvoiceLineDto {
  readonly productId: number;
  readonly productCode: string;
  readonly productName: string;
  readonly unitPrice: number;
  readonly quantity: number;
  readonly taxRate: number;
  readonly lineSubtotal: number;
}

export interface InvoiceDto {
  readonly id: number;
  readonly invoiceNumber: string;
  readonly orderDate: string;
  readonly customerId: string;
  readonly customerName: string;
  readonly customerIdentityCard: string;
  readonly customerEmail: string;
  readonly customerAddress: string;
  readonly customerCity: string;
  readonly customerCountry: string;
  readonly customerPostalCode: string;
  readonly subtotal: number;
  readonly discountAmount: number;
  readonly taxAmount: number;
  readonly total: number;
  readonly lines: readonly InvoiceLineDto[];
}
