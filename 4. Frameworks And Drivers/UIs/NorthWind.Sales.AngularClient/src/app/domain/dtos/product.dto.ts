export interface SearchProductsDto {
  readonly name?: string | null;
  readonly code?: string | null;
  readonly page: number;
  readonly pageSize: number;
}

export interface ProductLookupDto {
  readonly id: number;
  readonly code: string;
  readonly name: string;
  readonly unitPrice: number;
  readonly unitsInStock: number;
  readonly taxRate: number;
}
