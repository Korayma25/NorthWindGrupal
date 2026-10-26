import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import {
  CreateOrderDetailDto,
  CreateOrderDto,
  CustomerLookupDto,
  ProductLookupDto
} from '../../domain/dtos';
import { OrdersApi } from '../../infrastructure/api/orders.api';
import { AppHttpError } from '../../infrastructure/interceptors';
import { roundAwayFromZero } from '../../domain/helpers/rounding.helper';
import { es } from '../../i18n/es';

export interface CreateOrderDetailItem {
  productId: number;
  productCode: string;
  productName: string;
  unitPrice: number;
  unitsInStock: number;
  taxRate: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CreateOrderStore {
  private readonly ordersApi = inject(OrdersApi);

  // Customer state
  public readonly customerId = signal<string>('');
  public readonly customerName = signal<string>('');
  public readonly customerIdentityCard = signal<string>('');
  public readonly shipAddress = signal<string>('');
  public readonly shipCity = signal<string>('');
  public readonly shipCountry = signal<string>('');
  public readonly shipPostalCode = signal<string>('');

  // Details state
  public readonly orderDetails = signal<CreateOrderDetailItem[]>([]);

  // Messages and errors
  public readonly informationMessage = signal<string>('');
  public readonly errorMessage = signal<string>('');
  public readonly createdOrderId = signal<number | null>(null);
  public readonly fieldErrors = signal<Record<string, string>>({});
  public readonly summaryErrors = signal<string[]>([]);
  public readonly isLoading = signal<boolean>(false);

  // Totals computed with MidpointRounding.AwayFromZero
  public readonly subtotal = computed(() => {
    const sum = this.orderDetails().reduce(
      (acc, d) => acc + d.unitPrice * d.quantity,
      0
    );
    return roundAwayFromZero(sum, 2);
  });

  public readonly discountAmount = computed(() => 0);

  public readonly taxAmount = computed(() => {
    const sub = this.subtotal();
    if (sub === 0) {
      return 0;
    }
    const discount = this.discountAmount();
    const discountFactor = 1 - discount / sub;
    const calculatedTax = this.orderDetails().reduce((acc, d) => {
      const lineSubtotal = d.unitPrice * d.quantity;
      return acc + lineSubtotal * discountFactor * d.taxRate;
    }, 0);
    return roundAwayFromZero(calculatedTax, 2);
  });

  public readonly total = computed(() => {
    const res = this.subtotal() - this.discountAmount() + this.taxAmount();
    return roundAwayFromZero(res, 2);
  });

  public selectCustomer(customer: CustomerLookupDto): void {
    this.customerId.set(customer.id);
    this.customerName.set(customer.name);
    this.customerIdentityCard.set(customer.identityCard);
    this.shipAddress.set(customer.address);
    this.shipCity.set(customer.city);
    this.shipCountry.set(customer.country);
    this.shipPostalCode.set(customer.postalCode);
    this.errorMessage.set('');

    this.clearFieldError('CustomerId');
    this.clearFieldError('ShipAddress');
    this.clearFieldError('ShipCity');
    this.clearFieldError('ShipCountry');
    this.clearFieldError('ShipPostalCode');
  }

  public addProduct(product: ProductLookupDto): boolean {
    this.errorMessage.set('');
    if (this.orderDetails().some(d => d.productId === product.id)) {
      this.errorMessage.set(es.createOrder.duplicateProductError);
      return false;
    }

    const newItem: CreateOrderDetailItem = {
      productId: product.id,
      productCode: product.code,
      productName: product.name,
      unitPrice: product.unitPrice,
      unitsInStock: product.unitsInStock,
      taxRate: product.taxRate,
      quantity: 1
    };

    this.orderDetails.update(list => [...list, newItem]);
    this.clearFieldError('OrderDetails');
    return true;
  }

  public removeDetail(item: CreateOrderDetailItem): void {
    this.orderDetails.update(list => list.filter(d => d !== item));
    this.rebuildDetailErrors();
  }

  public replaceProduct(
    item: CreateOrderDetailItem,
    product: ProductLookupDto
  ): boolean {
    this.errorMessage.set('');
    if (this.orderDetails().some(d => d !== item && d.productId === product.id)) {
      this.errorMessage.set(es.createOrder.duplicateProductError);
      return false;
    }

    item.productId = product.id;
    item.productCode = product.code;
    item.productName = product.name;
    item.unitPrice = product.unitPrice;
    item.unitsInStock = product.unitsInStock;
    item.taxRate = product.taxRate;

    let newQuantity = item.quantity;
    if (product.unitsInStock > 0 && newQuantity > product.unitsInStock) {
      newQuantity = product.unitsInStock;
    }
    if (newQuantity < 1) {
      newQuantity = 1;
    }
    item.quantity = newQuantity;

    this.orderDetails.update(list => [...list]);
    this.rebuildDetailErrors();
    return true;
  }

  public updateQuantity(item: CreateOrderDetailItem, newQuantity: number): void {
    const qty = Math.floor(newQuantity);
    item.quantity = qty;
    this.orderDetails.update(list => [...list]);

    const index = this.orderDetails().indexOf(item);
    const key = `OrderDetails[${index}].Quantity`;

    if (qty < 1) {
      this.setFieldError(key, es.createOrder.quantityMinimumError);
    } else if (item.unitsInStock > 0 && qty > item.unitsInStock) {
      this.setFieldError(key, es.createOrder.quantityExceedsStockError);
    } else {
      this.clearFieldError(key);
    }
  }

  public validate(): boolean {
    const errors: Record<string, string> = {};
    const summary: string[] = [];

    if (!this.customerId().trim()) {
      errors['CustomerId'] = es.createOrder.customerRequiredError;
      summary.push(es.createOrder.customerRequiredError);
    }

    const details = this.orderDetails();
    if (!details || details.length === 0) {
      errors['OrderDetails'] = es.createOrder.orderDetailsRequiredError;
      summary.push(es.createOrder.orderDetailsRequiredError);
    } else {
      const seenProductIds = new Set<number>();
      for (let i = 0; i < details.length; i++) {
        const item = details[i];

        if (seenProductIds.has(item.productId)) {
          const key = `OrderDetails[${i}].ProductId`;
          errors[key] = es.createOrder.duplicateProductError;
          summary.push(es.createOrder.duplicateProductError);
        }
        seenProductIds.add(item.productId);

        const qtyKey = `OrderDetails[${i}].Quantity`;
        if (item.quantity < 1) {
          errors[qtyKey] = es.createOrder.quantityMinimumError;
          summary.push(`${item.productName}: ${es.createOrder.quantityMinimumError}`);
        } else if (item.unitsInStock > 0 && item.quantity > item.unitsInStock) {
          errors[qtyKey] = es.createOrder.quantityExceedsStockError;
          summary.push(
            `${item.productName}: ${es.createOrder.quantityExceedsStockError}`
          );
        }
      }
    }

    this.fieldErrors.set(errors);
    this.summaryErrors.set(summary);
    return summary.length === 0;
  }

  public reset(): void {
    this.customerId.set('');
    this.customerName.set('');
    this.customerIdentityCard.set('');
    this.shipAddress.set('');
    this.shipCity.set('');
    this.shipCountry.set('');
    this.shipPostalCode.set('');
    this.orderDetails.set([]);
    this.errorMessage.set('');
    this.fieldErrors.set({});
    this.summaryErrors.set([]);
  }

  public send(): Observable<number> {
    this.informationMessage.set('');
    this.errorMessage.set('');
    this.createdOrderId.set(null);

    if (!this.validate()) {
      return throwError(() => new Error('Validation failed'));
    }

    this.isLoading.set(true);

    const dto: CreateOrderDto = {
      customerId: this.customerId(),
      shipAddress: this.shipAddress(),
      shipCity: this.shipCity(),
      shipCountry: this.shipCountry(),
      shipPostalCode: this.shipPostalCode(),
      orderDetails: this.orderDetails().map(d => ({
        productId: d.productId,
        unitPrice: d.unitPrice,
        quantity: d.quantity
      }))
    };

    return this.ordersApi.createOrder(dto).pipe(
      tap(orderId => {
        this.isLoading.set(false);
        this.createdOrderId.set(orderId);
        this.informationMessage.set(
          es.createOrder.createdOrderTemplate.replace('{0}', String(orderId))
        );
        this.reset();
      }),
      catchError(err => {
        this.isLoading.set(false);
        if (err instanceof AppHttpError && err.status === 400) {
          const currentFieldErrors = { ...this.fieldErrors() };
          const currentSummary: string[] = [];

          if (Object.keys(err.fieldErrors).length > 0) {
            for (const [key, msg] of Object.entries(err.fieldErrors)) {
              currentFieldErrors[key] = msg;
              currentSummary.push(msg);
            }
            this.fieldErrors.set(currentFieldErrors);
            this.summaryErrors.set(currentSummary);
          } else {
            this.errorMessage.set(
              err.message || es.errors.validationExceptionDetail
            );
          }
        } else {
          this.errorMessage.set(
            err instanceof Error ? err.message : es.errors.genericErrorMessage
          );
        }
        return throwError(() => err);
      })
    );
  }

  public getFieldError(fieldName: string): string | null {
    return this.fieldErrors()[fieldName] ?? null;
  }

  public getDetailQuantityError(index: number): string | null {
    return (
      this.fieldErrors()[`OrderDetails[${index}].Quantity`] ??
      this.fieldErrors()[`orderDetails[${index}].quantity`] ??
      null
    );
  }

  private setFieldError(key: string, message: string): void {
    this.fieldErrors.update(curr => ({ ...curr, [key]: message }));
  }

  private clearFieldError(key: string): void {
    this.fieldErrors.update(curr => {
      const copy = { ...curr };
      delete copy[key];
      return copy;
    });
  }

  private rebuildDetailErrors(): void {
    this.fieldErrors.update(curr => {
      const copy: Record<string, string> = {};
      for (const [k, v] of Object.entries(curr)) {
        if (!k.startsWith('OrderDetails[') && !k.startsWith('orderDetails[')) {
          copy[k] = v;
        }
      }
      return copy;
    });
  }
}
