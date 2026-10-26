import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { TokensDto, UserCredentialsDto, UserRegistrationDto } from '../../domain/dtos';
import { Endpoints } from '../api/endpoints';

const STORAGE_KEY = 'tokens';

interface JwtPayload {
  readonly exp?: number;
  readonly FullName?: string;
  readonly fullName?: string;
  readonly name?: string;
  readonly 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'?: string;
  readonly [key: string]: unknown;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly tokensSignal = signal<TokensDto | null>(null);
  private readonly currentUserSignal = signal<string | null>(null);

  private expirationTimer: ReturnType<typeof setTimeout> | null = null;

  public readonly tokens = this.tokensSignal.asReadonly();
  public readonly currentUser = this.currentUserSignal.asReadonly();
  public readonly isAuthenticated = computed(() => {
    const current = this.tokensSignal();
    return !!current?.accessToken && !this.isTokenExpired(current.accessToken);
  });

  constructor() {
    this.initializeFromStorage();
  }

  public login(credentials: UserCredentialsDto): Observable<TokensDto> {
    return this.http.post<TokensDto>(Endpoints.Login, credentials).pipe(
      tap(tokens => {
        this.setSession(tokens);
      })
    );
  }

  public register(userData: UserRegistrationDto): Observable<void> {
    return this.http.post<void>(Endpoints.Register, userData);
  }

  public logout(redirectToLogin = false): void {
    this.clearSession();
    if (redirectToLogin) {
      void this.router.navigate(['/user/login']);
    }
  }

  public getToken(): string | null {
    const current = this.tokensSignal();
    if (!current?.accessToken || this.isTokenExpired(current.accessToken)) {
      return null;
    }
    return current.accessToken;
  }

  private setSession(tokens: TokensDto): void {
    if (!tokens?.accessToken || this.isTokenExpired(tokens.accessToken)) {
      this.clearSession();
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ accessToken: tokens.accessToken }));
    } catch {
      // LocalStorage might be disabled or unavailable
    }

    this.tokensSignal.set(tokens);
    const userName = this.extractUserName(tokens.accessToken);
    this.currentUserSignal.set(userName);
    this.scheduleExpiration(tokens.accessToken);
  }

  private clearSession(): void {
    if (this.expirationTimer) {
      clearTimeout(this.expirationTimer);
      this.expirationTimer = null;
    }

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }

    this.tokensSignal.set(null);
    this.currentUserSignal.set(null);
  }

  private initializeFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return;
      }

      const parsed = JSON.parse(stored) as { accessToken?: string; AccessToken?: string };
      const accessToken = parsed.accessToken || parsed.AccessToken;

      if (!accessToken || this.isTokenExpired(accessToken)) {
        this.clearSession();
        return;
      }

      const tokens: TokensDto = { accessToken };
      this.tokensSignal.set(tokens);
      this.currentUserSignal.set(this.extractUserName(accessToken));
      this.scheduleExpiration(accessToken);
    } catch {
      this.clearSession();
    }
  }

  private isTokenExpired(token: string): boolean {
    const payload = this.decodeJwt(token);
    if (!payload?.exp) {
      return false;
    }
    const expirationDateMs = payload.exp * 1000;
    return Date.now() >= expirationDateMs;
  }

  private extractUserName(token: string): string {
    const payload = this.decodeJwt(token);
    if (!payload) {
      return '';
    }

    return (
      payload.FullName ??
      payload.fullName ??
      payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ??
      payload.name ??
      ''
    );
  }

  private scheduleExpiration(token: string): void {
    if (this.expirationTimer) {
      clearTimeout(this.expirationTimer);
      this.expirationTimer = null;
    }

    const payload = this.decodeJwt(token);
    if (!payload?.exp) {
      return;
    }

    const expiresInMs = payload.exp * 1000 - Date.now();
    if (expiresInMs <= 0) {
      this.logout(true);
      return;
    }

    this.expirationTimer = setTimeout(() => {
      this.logout(true);
    }, expiresInMs);
  }

  private decodeJwt(token: string): JwtPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length < 2) {
        return null;
      }
      let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4 !== 0) {
        base64 += '=';
      }
      const json = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(json) as JwtPayload;
    } catch {
      return null;
    }
  }
}
