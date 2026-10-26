import { TestBed } from '@angular/core/testing';
import { CreateOrderStore, CreateOrderDetailItem } from './create-order.store';
import { OrdersApi } from '../../infrastructure/api/orders.api';
import { of, throwError } from 'rxjs';
import { CustomerLookupDto, ProductLookupDto } from '../../domain/dtos';
import { AppHttpError } from '../../infrastructure/interceptors';

describe('CreateOrderStore', () => {
  let store: CreateOrderStore;
  let mockOrdersApi: { createOrder: ReturnType<typeof vi.fn> };

  const sampleCustomer: CustomerLookupDto = {
    id: 'ALFKI',
    name: 'Alfreds Futterkiste',
    identityCard: '1710034065',
    email: 'alfki@test.com',
    address: 'Obere Str. 57',
    city: 'Berlin',
    country: 'Germany',
    postalCode: '12209',
    currentBalance: 0
  };

  const sampleProduct1: ProductLookupDto = {
    id: 1,
    code: 'CHAI',
    name: 'Chai Tea',
    unitPrice: 18.0,
    unitsInStock: 10,
    taxRate: 0.15
  };

  const sampleProduct2: ProductLookupDto = {
    id: 2,
    code: 'CHANG',
    name: 'Chang Beer',
    unitPrice: 19.0,
    unitsInStock: 5,
    taxRate: 0.15
  };

  beforeEach(() => {
    mockOrdersApi = {
      createOrder: vi.fn().mockReturnValue(of(10248))
    };

    TestBed.configureTestingModule({
      providers: [
        CreateOrderStore,
        { provide: OrdersApi, useValue: mockOrdersApi }
      ]
    });

    store = TestBed.inject(CreateOrderStore);
  });

  it('selectCustomer should populate all customer and shipping fields', () => {
    store.selectCustomer(sampleCustomer);

    expect(store.customerId()).toBe('ALFKI');
    expect(store.customerName()).toBe('Alfreds Futterkiste');
    expect(store.customerIdentityCard()).toBe('1710034065');
    expect(store.shipAddress()).toBe('Obere Str. 57');
    expect(store.shipCity()).toBe('Berlin');
    expect(store.shipCountry()).toBe('Germany');
    expect(store.shipPostalCode()).toBe('12209');
  });

  it('addProduct should add a new line with quantity 1 and prevent duplicates (Criterio 2)', () => {
    const addedFirst = store.addProduct(sampleProduct1);
    expect(addedFirst).toBe(true);
    expect(store.orderDetails().length).toBe(1);
    expect(store.orderDetails()[0].quantity).toBe(1);
    expect(store.errorMessage()).toBe('');

    // Attempt to add duplicate
    const addedSecond = store.addProduct(sampleProduct1);
    expect(addedSecond).toBe(false);
    expect(store.orderDetails().length).toBe(1);
    expect(store.errorMessage()).not.toBe('');
  });

  it('replaceProduct should reject if product exists on another line and clamp quantity to new stock', () => {
    store.addProduct(sampleProduct1);
    store.addProduct(sampleProduct2);

    const firstItem = store.orderDetails()[0];
    const secondItem = store.orderDetails()[1];

    // Attempt to replace secondItem with sampleProduct1 (already on first line)
    const replacedDuplicate = store.replaceProduct(secondItem, sampleProduct1);
    expect(replacedDuplicate).toBe(false);
    expect(store.errorMessage()).not.toBe('');

    // Replace with a product with lower stock than current quantity
    store.updateQuantity(firstItem, 8);
    const lowStockProduct: ProductLookupDto = {
      id: 3,
      code: 'ANISEED',
      name: 'Aniseed Syrup',
      unitPrice: 10.0,
      unitsInStock: 4,
      taxRate: 0.15
    };

    const replaced = store.replaceProduct(firstItem, lowStockProduct);
    expect(replaced).toBe(true);
    expect(store.orderDetails()[0].productId).toBe(3);
    expect(store.orderDetails()[0].quantity).toBe(4); // clamped to unitsInStock
  });

  it('removeDetail should remove the exact item by reference (Criterio 4)', () => {
    store.addProduct(sampleProduct1);
    store.addProduct(sampleProduct2);

    const itemToRemove = store.orderDetails()[0];
    store.removeDetail(itemToRemove);

    expect(store.orderDetails().length).toBe(1);
    expect(store.orderDetails()[0].productId).toBe(sampleProduct2.id);
  });

  it('totals calculation should match backend formulas with away-from-zero rounding (Criterio 5)', () => {
    // Line 1: UnitPrice 18.0 * 2 = 36.00, TaxRate 0.15 -> Tax = 5.40
    // Line 2: UnitPrice 19.0 * 1 = 19.00, TaxRate 0.15 -> Tax = 2.85
    // Subtotal = 55.00
    // DiscountAmount = 0
    // TaxAmount = 8.25
    // Total = 63.25
    store.addProduct(sampleProduct1);
    store.updateQuantity(store.orderDetails()[0], 2);
    store.addProduct(sampleProduct2);

    expect(store.subtotal()).toBe(55.0);
    expect(store.discountAmount()).toBe(0);
    expect(store.taxAmount()).toBe(8.25);
    expect(store.total()).toBe(63.25);
  });

  it('totals calculation should correctly handle line with 0% IVA', () => {
    // Zero-tax product: UnitPrice 50.0 * 2 = 100.00, TaxRate 0.0 -> Tax = 0.00
    // Taxable product: UnitPrice 20.0 * 1 = 20.00, TaxRate 0.15 -> Tax = 3.00
    // Subtotal = 120.00
    // TaxAmount = 3.00
    // Total = 123.00
    const zeroTaxProduct: ProductLookupDto = {
      id: 99,
      code: 'BOOK-01',
      name: 'Educational Book',
      unitPrice: 50.0,
      unitsInStock: 20,
      taxRate: 0.0
    };

    store.addProduct(zeroTaxProduct);
    store.updateQuantity(store.orderDetails()[0], 2);

    const taxableProduct: ProductLookupDto = {
      id: 98,
      code: 'PEN-01',
      name: 'Luxury Pen',
      unitPrice: 20.0,
      unitsInStock: 10,
      taxRate: 0.15
    };
    store.addProduct(taxableProduct);

    expect(store.subtotal()).toBe(120.0);
    expect(store.discountAmount()).toBe(0);
    expect(store.taxAmount()).toBe(3.0);
    expect(store.total()).toBe(123.0);
  });

  it('totals calculation should apply away-from-zero midpoint rounding on tax and line subtotals', () => {
    // UnitPrice 1.05 * 1 = 1.05, TaxRate 0.15 -> 1.05 * 0.15 = 0.1575 -> rounds to 0.16 away-from-zero
    const oddPriceProduct: ProductLookupDto = {
      id: 97,
      code: 'ITEM-01',
      name: 'Odd Priced Item',
      unitPrice: 1.05,
      unitsInStock: 10,
      taxRate: 0.15
    };

    store.addProduct(oddPriceProduct);

    expect(store.subtotal()).toBe(1.05);
    expect(store.taxAmount()).toBe(0.16);
    expect(store.total()).toBe(1.21);
  });

  it('validation should require customer and at least one order line', () => {
    expect(store.validate()).toBe(false);
    expect(store.summaryErrors().length).toBeGreaterThan(0);

    store.selectCustomer(sampleCustomer);
    expect(store.validate()).toBe(false);

    store.addProduct(sampleProduct1);
    expect(store.validate()).toBe(true);
  });

  it('validation should flag quantity greater than stock or less than 1 (Criterio 2)', () => {
    store.selectCustomer(sampleCustomer);
    store.addProduct(sampleProduct1); // stock is 10
    const item = store.orderDetails()[0];

    store.updateQuantity(item, 15);
    expect(store.validate()).toBe(false);
    expect(store.getDetailQuantityError(0)).not.toBeNull();

    store.updateQuantity(item, 0);
    expect(store.validate()).toBe(false);
    expect(store.getDetailQuantityError(0)).not.toBeNull();
  });

  it('send should call API, reset state, and set informationMessage on success (Criterio 1)', () => {
    store.selectCustomer(sampleCustomer);
    store.addProduct(sampleProduct1);

    store.send().subscribe();

    expect(mockOrdersApi.createOrder).toHaveBeenCalledWith({
      customerId: 'ALFKI',
      shipAddress: 'Obere Str. 57',
      shipCity: 'Berlin',
      shipCountry: 'Germany',
      shipPostalCode: '12209',
      orderDetails: [{ productId: 1, unitPrice: 18.0, quantity: 1 }]
    });

    expect(store.createdOrderId()).toBe(10248);
    expect(store.informationMessage()).toContain('10248');
    expect(store.customerId()).toBe('');
    expect(store.orderDetails().length).toBe(0);
  });

  it('send should map 400 server errors to line fields (Criterio 2)', () => {
    store.selectCustomer(sampleCustomer);
    store.addProduct(sampleProduct1);

    const error400 = new AppHttpError({
      message: 'Validation failed',
      status: 400,
      fieldErrors: {
        'OrderDetails[0].Quantity': 'La cantidad solicitada supera el stock disponible.'
      }
    });

    mockOrdersApi.createOrder.mockReturnValue(throwError(() => error400));

    store.send().subscribe({
      error: () => {
        expect(store.getDetailQuantityError(0)).toBe(
          'La cantidad solicitada supera el stock disponible.'
        );
      }
    });
  });
});
