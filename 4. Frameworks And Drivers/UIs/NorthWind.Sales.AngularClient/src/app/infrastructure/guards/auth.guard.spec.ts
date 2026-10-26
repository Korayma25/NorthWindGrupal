import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { authGuard } from './auth.guard';
import { AuthService } from '../auth/auth.service';

describe('authGuard', () => {
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    });

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should redirect unauthenticated users to /user/login with returnUrl', () => {
    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/createorder' } as RouterStateSnapshot;

    const result = TestBed.runInInjectionContext(() => authGuard(route, state));

    expect(result instanceof UrlTree).toBe(true);
    const urlTree = result as UrlTree;
    expect(urlTree.toString()).toContain('/user/login?returnUrl=%2Fcreateorder');
  });

  it('should allow access to authenticated users', () => {
    const header = btoa(JSON.stringify({ alg: 'HS256' }));
    const exp = Math.floor(Date.now() / 1000) + 3600;
    const payload = btoa(JSON.stringify({ exp, FullName: 'Authenticated User' }));
    const mockToken = `${header}.${payload}.sig`;

    authService['setSession']({ accessToken: mockToken });

    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/invoices' } as RouterStateSnapshot;

    const result = TestBed.runInInjectionContext(() => authGuard(route, state));

    expect(result).toBe(true);
  });
});
