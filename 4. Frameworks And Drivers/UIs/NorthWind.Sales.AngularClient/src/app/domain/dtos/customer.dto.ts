export interface SearchCustomersDto {
  readonly name?: string | null;
  readonly identityCard?: string | null;
  readonly page: number;
  readonly pageSize: number;
}

export interface CustomerLookupDto {
  readonly id: string;
  readonly name: string;
  readonly identityCard: string;
  readonly email: string;
  readonly address: string;
  readonly city: string;
  readonly country: string;
  readonly postalCode: string;
  readonly currentBalance: number;
}
