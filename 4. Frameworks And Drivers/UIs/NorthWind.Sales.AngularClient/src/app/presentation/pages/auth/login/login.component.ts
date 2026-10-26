import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../infrastructure/auth/auth.service';
import { CharFilterDirective } from '../../../directives/char-filter.directive';
import { AppHttpError } from '../../../../infrastructure/interceptors';
import { es } from '../../../../i18n/es';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CharFilterDirective],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  public readonly es = es;
  public readonly loading = signal<boolean>(false);
  public readonly generalError = signal<string | null>(null);

  public readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  public isFieldInvalid(fieldName: string): boolean {
    const control = this.loginForm.get(fieldName);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  public getEmailErrorMessage(): string {
    const control = this.loginForm.get('email');
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
    const control = this.loginForm.get('password');
    if (!control || !control.errors) {
      return '';
    }
    if (control.errors['serverError']) {
      return control.errors['serverError'] as string;
    }
    if (control.errors['required']) {
      return es.membership.requiredPasswordErrorMessage;
    }
    return '';
  }

  public onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.generalError.set(null);

    const { email, password } = this.loginForm.value;
    this.authService
      .login({
        email: email ?? '',
        password: password ?? ''
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
          void this.router.navigateByUrl(returnUrl);
        },
        error: (err: unknown) => {
          this.loading.set(false);
          if (err instanceof AppHttpError) {
            if (err.status === 400 && Object.keys(err.fieldErrors).length > 0) {
              let matchedAnyField = false;
              for (const [key, msg] of Object.entries(err.fieldErrors)) {
                const lower = key.toLowerCase();
                if (lower.includes('email')) {
                  this.loginForm.get('email')?.setErrors({ serverError: msg });
                  matchedAnyField = true;
                } else if (lower.includes('password')) {
                  this.loginForm.get('password')?.setErrors({ serverError: msg });
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
