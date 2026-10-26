import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateOrderComponent } from './create-order.component';
import { CreateOrderStore } from '../../../application/create-order/create-order.store';
import { OrdersApi } from '../../../infrastructure/api/orders.api';
import { CustomersApi } from '../../../infrastructure/api/customers.api';
import { ProductsApi } from '../../../infrastructure/api/products.api';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ProductLookupDto } from '../../../domain/dtos';

describe('CreateOrderComponent', () => {
  let fixture: ComponentFixture<CreateOrderComponent>;
  let component: CreateOrderComponent;
  let store: CreateOrderStore;

  const sampleProduct: ProductLookupDto = {
    id: 10,
    code: 'IKURA',
    name: 'Ikura Fish Roe',
    unitPrice: 31.0,
    unitsInStock: 8,
    taxRate: 0.15
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateOrderComponent],
      providers: [
        provideRouter([]),
        CreateOrderStore,
        { provide: OrdersApi, useValue: { createOrder: vi.fn().mockReturnValue(of(1001)) } },
        { provide: CustomersApi, useValue: { search: vi.fn().mockReturnValue(of({ items: [], page: 1, pageSize: 5, totalCount: 0, totalPages: 0 })) } },
        { provide: ProductsApi, useValue: { search: vi.fn().mockReturnValue(of({ items: [], page: 1, pageSize: 5, totalCount: 0, totalPages: 0 })) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateOrderComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(CreateOrderStore);
    fixture.detectChanges();
  });

  it('should render customer inputs as readonly and disabled (Criterio 3)', () => {
    const inputs: HTMLInputElement[] = fixture.nativeElement.querySelectorAll('.pos-card input');
    expect(inputs.length).toBe(7);
    for (const input of inputs) {
      expect(input.readOnly).toBe(true);
      expect(input.disabled).toBe(true);
    }
  });

  it('should render editable quantity input while other columns are read-only (Criterio 3)', () => {
    store.addProduct(sampleProduct);
    fixture.detectChanges();

    const row = fixture.nativeElement.querySelector('tbody tr');
    expect(row).not.toBeNull();

    const qtyInput: HTMLInputElement = row.querySelector('input[type="number"]');
    expect(qtyInput).not.toBeNull();
    expect(qtyInput.readOnly).toBe(false);
    expect(qtyInput.disabled).toBe(false);
  });

  it('should open delete confirmation dialog with product name and remove only on confirm (Criterio 4)', () => {
    store.addProduct(sampleProduct);
    const prod2: ProductLookupDto = { id: 20, code: 'TOFU', name: 'Tofu', unitPrice: 20, unitsInStock: 5, taxRate: 0.15 };
    const prod3: ProductLookupDto = { id: 30, code: 'KONBU', name: 'Konbu', unitPrice: 15, unitsInStock: 5, taxRate: 0.15 };
    store.addProduct(prod2);
    store.addProduct(prod3);
    fixture.detectChanges();

    expect(store.orderDetails().length).toBe(3);

    // Click delete on second item (Tofu)
    const secondItem = store.orderDetails()[1];
    component.openDeleteConfirmationModal(secondItem);
    fixture.detectChanges();

    expect(component.isConfirmDeleteDialogOpen()).toBe(true);
    expect(component.deleteConfirmationMessage()).toContain('Tofu');

    // Cancelling does NOT delete
    component.onCancelDelete();
    fixture.detectChanges();
    expect(store.orderDetails().length).toBe(3);

    // Confirming deletes exactly Tofu
    component.openDeleteConfirmationModal(secondItem);
    component.onConfirmDelete();
    fixture.detectChanges();

    expect(store.orderDetails().length).toBe(2);
    expect(store.orderDetails().some(d => d.productName === 'Tofu')).toBe(false);
    expect(store.orderDetails()[0].productName).toBe('Ikura Fish Roe');
    expect(store.orderDetails()[1].productName).toBe('Konbu');
  });

  it('should open customer and product search modals', () => {
    component.openCustomerSearch();
    expect(component.isCustomerSearchPopupVisible()).toBe(true);

    component.openAddProductModal();
    expect(component.isProductSearchPopupVisible()).toBe(true);
  });
});
