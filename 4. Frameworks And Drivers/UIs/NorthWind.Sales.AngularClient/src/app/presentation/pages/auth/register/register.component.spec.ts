import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../../../infrastructure/auth/auth.service';
import { of, throwError } from 'rxjs';
import { AppHttpError } from '../../../../infrastructure/interceptors';
import { es } from '../../../../i18n/es';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockAuthService: { register: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    mockAuthService = {
      register: vi.fn().mockReturnValue(of(void 0))
    };

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and have initial invalid form', () => {
    expect(component).toBeTruthy();
    expect(component.registerForm.valid).toBe(false);
  });

  it('should validate password complexity and password matching', () => {
    const passwordControl = component.registerForm.get('password');
    const confirmControl = component.registerForm.get('passwordConfirmation');

    // Too short
    passwordControl?.setValue('Aa1!');
    expect(passwordControl?.hasError('passwordTooShort')).toBe(true);
    expect(component.getPasswordErrorMessage()).toBe(es.membership.passwordTooShortErrorMessage);

    // Requires uppercase
    passwordControl?.setValue('password123!');
    expect(passwordControl?.hasError('passwordRequiresUpper')).toBe(true);
    expect(component.getPasswordErrorMessage()).toBe(es.membership.passwordRequiresUpperErrorMessage);

    // Requires lowercase
    passwordControl?.setValue('PASSWORD123!');
    expect(passwordControl?.hasError('passwordRequiresLower')).toBe(true);
    expect(component.getPasswordErrorMessage()).toBe(es.membership.passwordRequiresLowerErrorMessage);

    // Requires digit
    passwordControl?.setValue('Password!');
    expect(passwordControl?.hasError('passwordRequiresDigit')).toBe(true);
    expect(component.getPasswordErrorMessage()).toBe(es.membership.passwordRequiresDigitErrorMessage);

    // Requires non-alphanumeric
    passwordControl?.setValue('Password123');
    expect(passwordControl?.hasError('passwordRequiresNonAlphanumeric')).toBe(true);
    expect(component.getPasswordErrorMessage()).toBe(es.membership.passwordRequiresNonAlphanumericErrorMessage);

    // Valid password
    passwordControl?.setValue('P@ssword123');
    expect(passwordControl?.valid).toBe(true);

    // Mismatched confirmation
    confirmControl?.setValue('DifferentPassword123');
    expect(confirmControl?.hasError('passwordMismatch')).toBe(true);
    expect(component.getPasswordConfirmationErrorMessage()).toBe(es.membership.confirmPasswordErrorMessage);

    // Matching confirmation
    confirmControl?.setValue('P@ssword123');
    expect(confirmControl?.valid).toBe(true);
  });

  it('should call authService.register and display success message on valid submission', () => {
    component.registerForm.setValue({
      firstName: 'Juan',
      lastName: 'Perez',
      email: 'juan.perez@northwind.com',
      password: 'P@ssword123',
      passwordConfirmation: 'P@ssword123'
    });

    component.onSubmit();

    expect(mockAuthService.register).toHaveBeenCalledWith({
      firstName: 'Juan',
      lastName: 'Perez',
      email: 'juan.perez@northwind.com',
      password: 'P@ssword123'
    });
    expect(component.loading()).toBe(false);
    expect(component.successMessage()).toBe(es.membership.registeredUserMessage);
  });

  it('should map 400 server errors to appropriate controls', () => {
    const error400 = new AppHttpError({
      message: 'Validation error',
      status: 400,
      fieldErrors: {
        FirstName: 'El nombre es requerido.',
        LastName: 'El apellido es requerido.',
        Email: 'El correo ya está registrado.'
      }
    });

    mockAuthService.register.mockReturnValue(throwError(() => error400));

    component.registerForm.setValue({
      firstName: 'Juan',
      lastName: 'Perez',
      email: 'juan.perez@northwind.com',
      password: 'P@ssword123',
      passwordConfirmation: 'P@ssword123'
    });

    component.onSubmit();

    expect(component.loading()).toBe(false);
    expect(component.getFirstNameErrorMessage()).toBe('El nombre es requerido.');
    expect(component.getLastNameErrorMessage()).toBe('El apellido es requerido.');
    expect(component.getEmailErrorMessage()).toBe('El correo ya está registrado.');
    expect(component.generalError()).toBeNull();
  });

  it('should display general error when server returns 500 error', () => {
    const error500 = new AppHttpError({
      message: 'Internal Server Error',
      status: 500
    });

    mockAuthService.register.mockReturnValue(throwError(() => error500));

    component.registerForm.setValue({
      firstName: 'Juan',
      lastName: 'Perez',
      email: 'juan.perez@northwind.com',
      password: 'P@ssword123',
      passwordConfirmation: 'P@ssword123'
    });

    component.onSubmit();

    expect(component.loading()).toBe(false);
    expect(component.generalError()).toBe('Internal Server Error');
  });
});
