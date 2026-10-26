import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { AppHttpError } from './app-http-error';
import { ProblemDetails, ValidationError } from '../../domain/dtos';
import { es } from '../../i18n/es';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse)) {
        return throwError(
          () =>
            new AppHttpError({
              message: es.errors.genericErrorMessage,
              status: 0
            })
        );
      }

      // If error payload is a Blob (e.g. responseType: 'blob' with 404 ProblemDetails)
      if (error.error instanceof Blob) {
        return from(
          error.error
            .text()
            .then(text => {
              let parsedBody: unknown = text;
              try {
                parsedBody = JSON.parse(text);
              } catch {
                // Not JSON
              }
              const clonedError = new HttpErrorResponse({
                error: parsedBody,
                headers: error.headers,
                status: error.status,
                statusText: error.statusText,
                url: error.url ?? undefined
              });
              return mapToAppHttpError(clonedError, authService);
            })
            .catch(() => mapToAppHttpError(error, authService))
        ).pipe(switchMap(appError => throwError(() => appError)));
      }

      return throwError(() => mapToAppHttpError(error, authService));
    })
  );
};

function mapToAppHttpError(error: HttpErrorResponse, authService: AuthService): AppHttpError {
  // 401 Unauthorized: Logout and redirect to login
  if (error.status === 401) {
    authService.logout(true);
    return new AppHttpError({
      message: es.errors.unauthorizedAccessExceptionTitle,
      status: 401,
      detail: es.errors.unauthorizedAccessExceptionDetail
    });
  }

  const problem = extractProblemDetails(error.error);

  // 400 Bad Request: Parse typed validation errors
  if (error.status === 400) {
    const { fieldErrors, errorsList } = parseValidationErrors(problem ?? error.error);
    const detailMessage =
      problem?.detail ||
      problem?.title ||
      (errorsList.length > 0 ? errorsList[0].message : es.errors.validationExceptionDetail);

    return new AppHttpError({
      message: detailMessage,
      status: 400,
      title: problem?.title ?? es.errors.validationExceptionTitle,
      detail: problem?.detail,
      fieldErrors,
      errorsList,
      problemDetails: problem ?? undefined
    });
  }

  // 404 Not Found: Return error with Detail
  if (error.status === 404) {
    const detailMessage = problem?.detail || problem?.title || es.errors.notFoundExceptionTitle;
    return new AppHttpError({
      message: detailMessage,
      status: 404,
      title: problem?.title ?? es.errors.notFoundExceptionTitle,
      detail: problem?.detail,
      problemDetails: problem ?? undefined
    });
  }

  // Other HTTP errors (500, 403, 502, etc.): Generic or ProblemDetails message
  const generalMessage = problem?.detail || problem?.title || es.errors.genericErrorMessage;

  return new AppHttpError({
    message: generalMessage,
    status: error.status,
    title: problem?.title,
    detail: problem?.detail,
    problemDetails: problem ?? undefined
  });
}

function extractProblemDetails(body: unknown): ProblemDetails | null {
  if (!body || typeof body !== 'object') {
    return null;
  }
  const obj = body as Record<string, unknown>;
  const hasProblemField =
    'title' in obj || 'detail' in obj || 'status' in obj || 'errors' in obj || 'instance' in obj;

  return hasProblemField ? (obj as unknown as ProblemDetails) : null;
}

function parseValidationErrors(body: unknown): {
  fieldErrors: Record<string, string>;
  errorsList: ValidationError[];
} {
  const fieldErrors: Record<string, string> = {};
  const errorsList: ValidationError[] = [];

  if (!body || typeof body !== 'object') {
    return { fieldErrors, errorsList };
  }

  const obj = body as Record<string, unknown>;
  const rawErrors = obj['errors'] ?? obj['Errors'];

  // Case 1: errors is an array of { propertyName, message }
  if (Array.isArray(rawErrors)) {
    for (const item of rawErrors) {
      if (item && typeof item === 'object') {
        const propName = (item.propertyName ?? item.PropertyName ?? item.field ?? '') as string;
        const msg = (item.message ?? item.Message ?? item.errorMessage ?? '') as string;
        if (propName && msg) {
          fieldErrors[propName] = msg;
          errorsList.push({ propertyName: propName, message: msg });
        }
      }
    }
    return { fieldErrors, errorsList };
  }

  // Case 2: errors is a dictionary/map of propertyName -> array of messages or string
  if (rawErrors && typeof rawErrors === 'object') {
    for (const [key, value] of Object.entries(rawErrors as Record<string, unknown>)) {
      if (Array.isArray(value) && value.length > 0) {
        const msg = String(value[0]);
        fieldErrors[key] = msg;
        errorsList.push({ propertyName: key, message: msg });
      } else if (typeof value === 'string') {
        fieldErrors[key] = value;
        errorsList.push({ propertyName: key, message: value });
      }
    }
  }

  return { fieldErrors, errorsList };
}
