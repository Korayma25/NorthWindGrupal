import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { authInterceptor } from './auth.interceptor';
import { errorInterceptor } from './error.interceptor';
import { AppHttpError } from './app-http-error';
import { AuthService } from '../auth/auth.service';

@Component({ standalone: true, template: '' })
class DummyLoginComponent {}

describe('Interceptors', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let authService: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
        provideHttpClientTesting(),
        provideRouter([{ path: 'user/login', component: DummyLoginComponent }])
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('authInterceptor should attach Bearer token when token is present', () => {
    const header = btoa(JSON.stringify({ alg: 'HS256' }));
    const exp = Math.floor(Date.now() / 1000) + 3600;
    const payload = btoa(JSON.stringify({ exp }));
    const mockToken = `${header}.${payload}.sig`;

    authService['setSession']({ accessToken: mockToken });

    http.get('/SearchCustomers').subscribe();

    const req = httpMock.expectOne('/SearchCustomers');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush({});
  });

  it('errorInterceptor should convert 400 with Errors list into AppHttpError with fieldErrors', () => {
    const errorResponse = {
      type: 'https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.1',
      title: 'Error en los datos de entrada.',
      status: 400,
      detail: 'Se encontraron uno o más errores de validación de datos.',
      instance: 'ProblemDetails/ValidationException',
      errors: [
        { propertyName: 'OrderDetails[0].Quantity', message: 'La cantidad debe ser mayor a 0' }
      ]
    };

    let caughtError: AppHttpError | null = null;
    http.post('/CreateOrder', {}).subscribe({
      next: () => {
        throw new Error('Should have failed');
      },
      error: err => {
        caughtError = err as AppHttpError;
      }
    });

    const req = httpMock.expectOne('/CreateOrder');
    req.flush(errorResponse, { status: 400, statusText: 'Bad Request' });

    expect(caughtError).toBeTruthy();
    expect(caughtError!.status).toBe(400);
    expect(caughtError!.fieldErrors['OrderDetails[0].Quantity']).toBe('La cantidad debe ser mayor a 0');
    expect(caughtError!.errorsList.length).toBe(1);
  });

  it('errorInterceptor should convert 404 ProblemDetails into AppHttpError with detail', () => {
    const errorResponse = {
      type: 'https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.4',
      title: 'Recurso no encontrado.',
      status: 404,
      detail: 'Factura con id 999 no encontrada.',
      instance: 'ProblemDetails/NotFoundException'
    };

    let caughtError: AppHttpError | null = null;
    http.get('/GetInvoice?id=999').subscribe({
      next: () => {
        throw new Error('Should have failed');
      },
      error: err => {
        caughtError = err as AppHttpError;
      }
    });

    const req = httpMock.expectOne('/GetInvoice?id=999');
    req.flush(errorResponse, { status: 404, statusText: 'Not Found' });

    expect(caughtError).toBeTruthy();
    expect(caughtError!.status).toBe(404);
    expect(caughtError!.message).toBe('Factura con id 999 no encontrada.');
  });

  it('errorInterceptor should logout on 401 Unauthorized', () => {
    const logoutSpy = vi.spyOn(authService, 'logout');

    let caughtError: AppHttpError | null = null;
    http.get('/SearchInvoices').subscribe({
      next: () => {
        throw new Error('Should have failed');
      },
      error: err => {
        caughtError = err as AppHttpError;
      }
    });

    const req = httpMock.expectOne('/SearchInvoices');
    req.flush({ title: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

    expect(caughtError).toBeTruthy();
    expect(caughtError!.status).toBe(401);
    expect(logoutSpy).toHaveBeenCalledWith(true);
  });
});
