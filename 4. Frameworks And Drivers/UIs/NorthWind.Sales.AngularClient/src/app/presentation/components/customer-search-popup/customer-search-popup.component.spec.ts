import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerSearchPopupComponent } from './customer-search-popup.component';
import { CustomersApi } from '../../../infrastructure/api/customers.api';
import { of, throwError } from 'rxjs';
import { AppHttpError } from '../../../infrastructure/interceptors';

describe('CustomerSearchPopupComponent', () => {
  let fixture: ComponentFixture<CustomerSearchPopupComponent>;
  let component: CustomerSearchPopupComponent;
  let mockCustomersApi: { search: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    mockCustomersApi = {
      search: vi.fn().mockReturnValue(
        of({
          items: [],
          page: 1,
          pageSize: 5,
          totalCount: 0,
          totalPages: 0
        })
      )
    };

    await TestBed.configureTestingModule({
      imports: [CustomerSearchPopupComponent],
      providers: [{ provide: CustomersApi, useValue: mockCustomersApi }]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerSearchPopupComponent);
    component = fixture.componentInstance;
  });

  it('should search with 0 characters on initial open (Criterio 2)', async () => {
    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(mockCustomersApi.search).toHaveBeenCalledWith({
      name: '',
      identityCard: '',
      page: 1,
      pageSize: 5
    });
  });

  it('should not allow search when name has only 1 character (Criterio 2)', async () => {
    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();
    await fixture.whenStable();

    component.filterName.set('m');
    const canSearch = component.canSearchCustomer();
    expect(canSearch).toBe(false);
  });

  it('should allow search when name has 2 or more characters (Criterio 1 & 2)', async () => {
    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();
    await fixture.whenStable();

    component.filterName.set('mar');
    const canSearch = component.canSearchCustomer();
    expect(canSearch).toBe(true);
  });

  it('should filter non-letter characters in name input (Criterio 3)', () => {
    const inputEvent = {
      target: { value: 'Juan 123 Perez!' }
    } as unknown as Event;

    component.onNameInput(inputEvent);
    expect(component.filterName()).toBe('Juan  Perez');
    expect(component.nameValidationError()).toBeNull();
  });

  it('should filter non-digit characters in cédula input (Criterio 3)', () => {
    const inputEvent = {
      target: { value: '171-003a!4065' }
    } as unknown as Event;

    component.onIdentityCardInput(inputEvent);
    expect(component.filterIdentityCard()).toBe('1710034065');
  });

  it('should show error and block search when 10-digit cédula is invalid (Criterio 3)', async () => {
    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();
    await fixture.whenStable();

    // 1710034069 has invalid checksum
    const inputEvent = {
      target: { value: '1710034069' }
    } as unknown as Event;

    component.onIdentityCardInput(inputEvent);
    expect(component.identityCardValidationError()).not.toBeNull();
    expect(component.canSearchCustomer()).toBe(false);

    // Call loadCustomers directly to verify it does not call API
    mockCustomersApi.search.mockClear();
    component.loadCustomers(1, 5).subscribe();
    expect(mockCustomersApi.search).not.toHaveBeenCalled();
  });

  it('should allow search when 10-digit cédula is valid (Criterio 3)', async () => {
    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();
    await fixture.whenStable();

    // 1710034065 is a verified valid Ecuadorian ID
    const inputEvent = {
      target: { value: '1710034065' }
    } as unknown as Event;

    component.onIdentityCardInput(inputEvent);
    expect(component.identityCardValidationError()).toBeNull();
    expect(component.canSearchCustomer()).toBe(true);
  });

  it('should map 400 server validation errors without closing modal', async () => {
    const error400 = new AppHttpError({
      message: 'Validation error',
      status: 400,
      fieldErrors: {
        Name: 'El nombre del cliente solo debe contener letras.'
      }
    });

    mockCustomersApi.search.mockReturnValue(throwError(() => error400));

    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();
    await fixture.whenStable();

    component.filterName.set('Test');
    component.loadCustomers(1, 5).subscribe();
    await fixture.whenStable();

    expect(component.nameValidationError()).toBe('El nombre del cliente solo debe contener letras.');
    expect(component.visible()).toBe(true);
  });
});
