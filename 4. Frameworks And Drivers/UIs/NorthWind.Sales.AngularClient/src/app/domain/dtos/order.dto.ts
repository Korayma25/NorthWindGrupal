export interface CreateOrderDetailDto {
  readonly productId: number;
  readonly unitPrice: number;
  readonly quantity: number;
}

export interface CreateOrderDto {
  readonly customerId: string;
  readonly shipAddress: string;
  readonly shipCity: string;
  readonly shipCountry: string;
  readonly shipPostalCode: string;
  readonly orderDetails: readonly CreateOrderDetailDto[];
}
