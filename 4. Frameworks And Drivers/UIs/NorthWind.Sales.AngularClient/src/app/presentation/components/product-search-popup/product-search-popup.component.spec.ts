import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductSearchPopupComponent } from './product-search-popup.component';
import { ProductsApi } from '../../../infrastructure/api/products.api';
import { of } from 'rxjs';
import { ProductLookupDto } from '../../../domain/dtos';

describe('ProductSearchPopupComponent', () => {
  let fixture: ComponentFixture<ProductSearchPopupComponent>;
  let component: ProductSearchPopupComponent;
  let mockProductsApi: { search: ReturnType<typeof vi.fn> };

  const testProduct: ProductLookupDto = {
    id: 1,
    code: 'CHAI-01',
    name: 'Chai Tea',
    unitPrice: 18.0,
    unitsInStock: 2,
    taxRate: 0.15
  };

  beforeEach(async () => {
    mockProductsApi = {
      search: vi.fn().mockReturnValue(
        of({
          items: [testProduct],
          page: 1,
          pageSize: 5,
          totalCount: 1,
          totalPages: 1
        })
      )
    };

    await TestBed.configureTestingModule({
      imports: [ProductSearchPopupComponent],
      providers: [{ provide: ProductsApi, useValue: mockProductsApi }]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductSearchPopupComponent);
    component = fixture.componentInstance;
  });

  it('should search with 0 characters on initial open', async () => {
    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(mockProductsApi.search).toHaveBeenCalledWith({
      name: '',
      code: '',
      page: 1,
      pageSize: 5
    });
  });

  it('should not allow search when name has only 1 character and code is empty', async () => {
    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();
    await fixture.whenStable();

    component.filterName.set('c');
    component.filterCode.set('');
    expect(component.canSearchProduct()).toBe(false);
  });

  it('should allow search when code has 1 character (Cédula y Código buscan desde 1 carácter)', async () => {
    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();
    await fixture.whenStable();

    component.filterName.set('');
    component.filterCode.set('C');
    expect(component.canSearchProduct()).toBe(true);
  });

  it('should filter non-letter characters in product name input', () => {
    const inputEvent = {
      target: { value: 'Chai 123 Tea!' }
    } as unknown as Event;

    component.onNameInput(inputEvent);
    expect(component.filterName()).toBe('Chai  Tea');
  });

  it('should allow alphanumeric and symbols in code input up to 20 chars', () => {
    const inputEvent = {
      target: { value: 'PROD-123_#45-VERY-LONG-CODE' }
    } as unknown as Event;

    component.onCodeInput(inputEvent);
    expect(component.filterCode().length).toBe(20);
    expect(component.filterCode()).toBe('PROD-123_#45-VERY-LO');
  });

  it('should format tax rate properly', () => {
    expect(component.formatTaxRate(0.15)).toBe('15%');
    expect(component.formatTaxRate(0.125)).toBe('12.5%');
  });

  it('should emit selected and close on product selection', () => {
    let emittedProduct: ProductLookupDto | null = null;
    component.selected.subscribe(p => {
      emittedProduct = p;
    });

    component.onProductSelected(testProduct);
    expect(emittedProduct).toEqual(testProduct);
    expect(component.visible()).toBe(false);
  });
});
