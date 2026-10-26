import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { es } from '../../i18n/es';

export function passwordComplexityValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;
    if (!value) {
      return null;
    }

    if (value.length < 6) {
      return {
        passwordTooShort: es.membership.passwordTooShortErrorMessage
      };
    }

    if (!/[a-z]/.test(value)) {
      return {
        passwordRequiresLower: es.membership.passwordRequiresLowerErrorMessage
      };
    }

    if (!/[A-Z]/.test(value)) {
      return {
        passwordRequiresUpper: es.membership.passwordRequiresUpperErrorMessage
      };
    }

    if (!/\d/.test(value)) {
      return {
        passwordRequiresDigit: es.membership.passwordRequiresDigitErrorMessage
      };
    }

    if (!/[^a-zA-Z0-9]/.test(value)) {
      return {
        passwordRequiresNonAlphanumeric: es.membership.passwordRequiresNonAlphanumericErrorMessage
      };
    }

    return null;
  };
}

export function passwordMatchValidator(passwordControlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.parent) {
      return null;
    }
    const password = control.parent.get(passwordControlName)?.value;
    const confirmPassword = control.value;

    if (confirmPassword && password !== confirmPassword) {
      return {
        passwordMismatch: es.membership.confirmPasswordErrorMessage
      };
    }

    return null;
  };
}
