import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from './auth.service';
import { Endpoints } from '../api/endpoints';
import { TokensDto } from '../../domain/dtos';

function createMockJwt(claims: Record<string, unknown>, expireInSeconds = 3600): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const exp = Math.floor(Date.now() / 1000) + expireInSeconds;
  const payload = btoa(JSON.stringify({ exp, ...claims }));
  return `${header}.${payload}.mockSignature`;
}

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created and initial state unauthenticated when storage is empty', () => {
    expect(service).toBeTruthy();
    expect(service.isAuthenticated()).toBe(false);
    expect(service.currentUser()).toBeNull();
  });

  it('should login, store tokens in localStorage, set isAuthenticated to true and parse currentUser', () => {
    const mockToken = createMockJwt({
      FullName: 'John Doe',
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': 'john@northwind.com'
    });
    const mockResponse: TokensDto = { accessToken: mockToken };

    service.login({ email: 'john@northwind.com', password: 'Password1!' }).subscribe(tokens => {
      expect(tokens.accessToken).toBe(mockToken);
    });

    const req = httpMock.expectOne(Endpoints.Login);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    expect(service.isAuthenticated()).toBe(true);
    expect(service.currentUser()).toBe('John Doe');
    expect(service.getToken()).toBe(mockToken);

    // Verify localStorage format matches Blazor TokenLocalStorage
    const stored = localStorage.getItem('tokens');
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed.accessToken).toBe(mockToken);
  });

  it('should logout and clear localStorage and signals', () => {
    const mockToken = createMockJwt({ FullName: 'Jane Doe' });
    service['setSession']({ accessToken: mockToken });
    expect(service.isAuthenticated()).toBe(true);

    service.logout();

    expect(service.isAuthenticated()).toBe(false);
    expect(service.currentUser()).toBeNull();
    expect(service.getToken()).toBeNull();
    expect(localStorage.getItem('tokens')).toBeNull();
  });

  it('should consider expired token as not authenticated', () => {
    const expiredToken = createMockJwt({ FullName: 'Old User' }, -10);
    service['setSession']({ accessToken: expiredToken });

    expect(service.isAuthenticated()).toBe(false);
    expect(service.getToken()).toBeNull();
  });
});
