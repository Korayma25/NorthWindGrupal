import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../../infrastructure/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AppHttpError } from '../../../../infrastructure/interceptors';
import { es } from '../../../../i18n/es';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: { login: ReturnType<typeof vi.fn> };
  let mockRouter: { navigateByUrl: ReturnType<typeof vi.fn> };
  let mockActivatedRoute: { snapshot: { queryParamMap: { get: ReturnType<typeof vi.fn> } } };

  beforeEach(async () => {
    mockAuthService = {
      login: vi.fn().mockReturnValue(of({ accessToken: 'valid.token' }))
    };

    mockRouter = {
      navigateByUrl: vi.fn()
    };

    mockActivatedRoute = {
      snapshot: {
        queryParamMap: {
          get: vi.fn().mockReturnValue(null)
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and have initial invalid form', () => {
    expect(component).toBeTruthy();
    expect(component.loginForm.valid).toBe(false);
  });

  it('should mark fields as touched and not submit when form is invalid', () => {
    component.onSubmit();
    expect(mockAuthService.login).not.toHaveBeenCalled();
    expect(component.loginForm.get('email')?.touched).toBe(true);
    expect(component.loginForm.get('password')?.touched).toBe(true);
  });

  it('should call authService.login and redirect to / by default on success', () => {
    component.loginForm.setValue({
      email: 'user@northwind.com',
      password: 'Password1!'
    });

    component.onSubmit();

    expect(mockAuthService.login).toHaveBeenCalledWith({
      email: 'user@northwind.com',
      password: 'Password1!'
    });
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/');
    expect(component.loading()).toBe(false);
  });

  it('should redirect to returnUrl when present in route', () => {
    mockActivatedRoute.snapshot.queryParamMap.get = vi.fn().mockReturnValue('/orders/create');

    component.loginForm.setValue({
      email: 'user@northwind.com',
      password: 'Password1!'
    });

    component.onSubmit();

    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/orders/create');
  });

  it('should map 400 server validation errors to respective controls', () => {
    const error400 = new AppHttpError({
      message: 'Validation error',
      status: 400,
      fieldErrors: {
        Email: 'El usuario no existe.',
        Password: 'Password incorrecto.'
      }
    });

    mockAuthService.login.mockReturnValue(throwError(() => error400));

    component.loginForm.setValue({
      email: 'unknown@northwind.com',
      password: 'Password1!'
    });

    component.onSubmit();

    expect(component.loading()).toBe(false);
    expect(component.getEmailErrorMessage()).toBe('El usuario no existe.');
    expect(component.getPasswordErrorMessage()).toBe('Password incorrecto.');
    expect(component.generalError()).toBeNull();
  });

  it('should display general error message for non-field server errors', () => {
    const error500 = new AppHttpError({
      message: 'Server error',
      status: 500
    });

    mockAuthService.login.mockReturnValue(throwError(() => error500));

    component.loginForm.setValue({
      email: 'user@northwind.com',
      password: 'Password1!'
    });

    component.onSubmit();

    expect(component.loading()).toBe(false);
    expect(component.generalError()).toBe('Server error');
  });

  it('should validate email format and required password', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('invalid-email');
    emailControl?.markAsTouched();
    expect(component.getEmailErrorMessage()).toBe(es.membership.invalidEmailErrorMessage);

    emailControl?.setValue('');
    expect(component.getEmailErrorMessage()).toBe(es.membership.requiredEmailErrorMessage);

    const passwordControl = component.loginForm.get('password');
    passwordControl?.setValue('');
    passwordControl?.markAsTouched();
    expect(component.getPasswordErrorMessage()).toBe(es.membership.requiredPasswordErrorMessage);
  });
});
