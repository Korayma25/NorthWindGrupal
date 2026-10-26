import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  CreateOrderDetailItem,
  CreateOrderStore
} from '../../../application/create-order/create-order.store';
import { CustomerLookupDto, ProductLookupDto } from '../../../domain/dtos';
import {
  ConfirmDialogComponent,
  CustomerSearchPopupComponent,
  MessageAlertComponent,
  ProductSearchPopupComponent
} from '../../components';
import { es } from '../../../i18n/es';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [
    CommonModule,
    DecimalPipe,
    RouterLink,
    CustomerSearchPopupComponent,
    ProductSearchPopupComponent,
    ConfirmDialogComponent,
    MessageAlertComponent
  ],
  templateUrl: './create-order.component.html'
})
export class CreateOrderComponent {
  public readonly order = inject(CreateOrderStore);
  public readonly es = es;

  public readonly isCustomerSearchPopupVisible = signal<boolean>(false);
  public readonly isProductSearchPopupVisible = signal<boolean>(false);
  public readonly isConfirmDeleteDialogOpen = signal<boolean>(false);

  private replacingItem: CreateOrderDetailItem | null = null;
  public readonly pendingRemovalItem = signal<CreateOrderDetailItem | null>(null);

  public readonly deleteConfirmationMessage = computed(() => {
    const item = this.pendingRemovalItem();
    if (!item) {
      return '';
    }
    return es.createOrder.removeProductConfirmation.replace('{0}', item.productName);
  });

  public openCustomerSearch(): void {
    this.isCustomerSearchPopupVisible.set(true);
  }

  public onCustomerSelected(customer: CustomerLookupDto): void {
    this.order.selectCustomer(customer);
  }

  public openAddProductModal(): void {
    this.replacingItem = null;
    this.isProductSearchPopupVisible.set(true);
  }

  public openReplaceProductModal(item: CreateOrderDetailItem): void {
    this.replacingItem = item;
    this.isProductSearchPopupVisible.set(true);
  }

  public onProductSelected(product: ProductLookupDto): void {
    if (this.replacingItem !== null) {
      this.order.replaceProduct(this.replacingItem, product);
      this.replacingItem = null;
    } else {
      this.order.addProduct(product);
    }
  }

  public openDeleteConfirmationModal(item: CreateOrderDetailItem): void {
    this.pendingRemovalItem.set(item);
    this.isConfirmDeleteDialogOpen.set(true);
  }

  public onConfirmDelete(): void {
    const item = this.pendingRemovalItem();
    if (item) {
      this.order.removeDetail(item);
      this.pendingRemovalItem.set(null);
    }
  }

  public onCancelDelete(): void {
    this.pendingRemovalItem.set(null);
  }

  public onQuantityInput(item: CreateOrderDetailItem, event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value, 10);
    this.order.updateQuantity(item, isNaN(value) ? 0 : value);
  }

  public onSubmit(): void {
    this.order.send().subscribe();
  }
}
