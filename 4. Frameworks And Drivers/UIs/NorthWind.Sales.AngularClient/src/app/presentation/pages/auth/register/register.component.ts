import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../infrastructure/auth/auth.service';
import { CharFilterDirective } from '../../../directives/char-filter.directive';
import {
  passwordComplexityValidator,
  passwordMatchValidator
} from '../../../../domain/validators';
import { AppHttpError } from '../../../../infrastructure/interceptors';
import { es } from '../../../../i18n/es';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CharFilterDirective],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  public readonly es = es;
  public readonly loading = signal<boolean>(false);
  public readonly generalError = signal<string | null>(null);
  public readonly successMessage = signal<string | null>(null);

  public readonly registerForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, passwordComplexityValidator()]],
    passwordConfirmation: [
      '',
      [Validators.required, passwordMatchValidator('password')]
    ]
  });

  public isFieldInvalid(fieldName: string): boolean {
    const control = this.registerForm.get(fieldName);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  public getFirstNameErrorMessage(): string {
    const control = this.registerForm.get('firstName');
    if (!control || !control.errors) {
      return '';
    }
    if (control.errors['serverError']) {
      return control.errors['serverError'] as string;
    }
    if (control.errors['required']) {
      return es.membership.requiredFirstNameErrorMessage;
    }
    return '';
  }

  public getLastNameErrorMessage(): string {
    const control = this.registerForm.get('lastName');
    if (!control || !control.errors) {
      return '';
    }
    if (control.errors['serverError']) {
      return control.errors['serverError'] as string;
    }
    if (control.errors['required']) {
      return es.membership.requiredLastNameErrorMessage;
    }
    return '';
  }

  public getEmailErrorMessage(): string {
    const control = this.registerForm.get('email');
    if (!control || !control.errors) {
      return '';
    }
    if (control.errors['serverError']) {
      return control.errors['serverError'] as string;
    }
    if (control.errors['required']) {
      return es.membership.requiredEmailErrorMessage;
    }
    if (control.errors['email']) {
      return es.membership.invalidEmailErrorMessage;
    }
    return '';
  }

  public getPasswordErrorMessage(): string {
    const control = this.registerForm.get('password');
    if (!control || !control.errors) {
      return '';
    }
    if (control.errors['serverError']) {
      return control.errors['serverError'] as string;
    }
    if (control.errors['required']) {
      return es.membership.requiredPasswordErrorMessage;
    }
    if (control.errors['passwordTooShort']) {
      return control.errors['passwordTooShort'] as string;
    }
    if (control.errors['passwordRequiresLower']) {
      return control.errors['passwordRequiresLower'] as string;
    }
    if (control.errors['passwordRequiresUpper']) {
      return control.errors['passwordRequiresUpper'] as string;
    }
    if (control.errors['passwordRequiresDigit']) {
      return control.errors['passwordRequiresDigit'] as string;
    }
    if (control.errors['passwordRequiresNonAlphanumeric']) {
      return control.errors['passwordRequiresNonAlphanumeric'] as string;
    }
    return '';
  }

  public getPasswordConfirmationErrorMessage(): string {
    const control = this.registerForm.get('passwordConfirmation');
    if (!control || !control.errors) {
      return '';
    }
    if (control.errors['serverError']) {
      return control.errors['serverError'] as string;
    }
    if (control.errors['required']) {
      return es.membership.requiredPasswordErrorMessage;
    }
    if (control.errors['passwordMismatch']) {
      return control.errors['passwordMismatch'] as string;
    }
    return '';
  }

  public onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.generalError.set(null);
    this.successMessage.set(null);

    const val = this.registerForm.value;
    this.authService
      .register({
        firstName: val.firstName ?? '',
        lastName: val.lastName ?? '',
        email: val.email ?? '',
        password: val.password ?? ''
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.successMessage.set(es.membership.registeredUserMessage);
          this.registerForm.reset();
        },
        error: (err: unknown) => {
          this.loading.set(false);
          if (err instanceof AppHttpError) {
            if (err.status === 400 && Object.keys(err.fieldErrors).length > 0) {
              let matchedAnyField = false;
              for (const [key, msg] of Object.entries(err.fieldErrors)) {
                const lower = key.toLowerCase();
                if (lower.includes('firstname')) {
                  this.registerForm.get('firstName')?.setErrors({ serverError: msg });
                  matchedAnyField = true;
                } else if (lower.includes('lastname')) {
                  this.registerForm.get('lastName')?.setErrors({ serverError: msg });
                  matchedAnyField = true;
                } else if (lower.includes('email')) {
                  this.registerForm.get('email')?.setErrors({ serverError: msg });
                  matchedAnyField = true;
                } else if (lower.includes('passwordconfirmation')) {
                  this.registerForm.get('passwordConfirmation')?.setErrors({ serverError: msg });
                  matchedAnyField = true;
                } else if (lower.includes('password')) {
                  this.registerForm.get('password')?.setErrors({ serverError: msg });
                  matchedAnyField = true;
                }
              }
              if (!matchedAnyField) {
                this.generalError.set(err.message || es.errors.validationExceptionDetail);
              }
            } else {
              this.generalError.set(err.message || es.errors.genericErrorMessage);
            }
          } else {
            this.generalError.set(es.errors.genericErrorMessage);
          }
        }
      });
  }
}
