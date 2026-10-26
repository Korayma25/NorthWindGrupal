import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { MainLayoutComponent } from './main-layout.component';
import { AuthService } from '../../../infrastructure/auth/auth.service';
import { es } from '../../../i18n/es';

describe('MainLayoutComponent', () => {
  let component: MainLayoutComponent;
  let fixture: ComponentFixture<MainLayoutComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [MainLayoutComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MainLayoutComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
  });

  it('when unauthenticated, sidebar only shows Inicio, and topbar shows Register/Login links', () => {
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;

    // Check navbar brand
    const brand = element.querySelector('.navbar-brand');
    expect(brand?.textContent?.trim()).toBe(es.common.navBarBrandTitle);

    // Check sidebar nav items
    const navLinks = element.querySelectorAll('.sidebar .nav-link');
    expect(navLinks.length).toBe(1);
    expect(navLinks[0].textContent).toContain(es.common.homeMenuItemTitle);

    // Check topbar auth links
    const authLinks = element.querySelectorAll('.top-row a.auth-link');
    expect(authLinks.length).toBe(2);
    expect(authLinks[0].textContent?.trim()).toBe(es.common.createAccountText);
    expect(authLinks[1].textContent?.trim()).toBe(es.common.loginText);

    // Check clock component exists
    expect(element.querySelector('app-real-time-clock')).toBeTruthy();
  });

  it('when authenticated, sidebar shows Inicio, Crear orden and Facturas, and topbar shows user and Logout', () => {
    const header = btoa(JSON.stringify({ alg: 'HS256' }));
    const exp = Math.floor(Date.now() / 1000) + 3600;
    const payload = btoa(JSON.stringify({ exp, FullName: 'Carlos Gomez' }));
    const mockToken = `${header}.${payload}.sig`;

    authService['setSession']({ accessToken: mockToken });
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;

    // Check sidebar nav items
    const navLinks = element.querySelectorAll('.sidebar .nav-link');
    expect(navLinks.length).toBe(3);
    expect(navLinks[0].textContent).toContain(es.common.homeMenuItemTitle);
    expect(navLinks[1].textContent).toContain(es.createOrder.createOrderMenuItemTitle);
    expect(navLinks[2].textContent).toContain(es.invoices.invoicesMenuItemTitle);

    // Check topbar
    const userName = element.querySelector('.top-row .user-name');
    expect(userName?.textContent?.trim()).toBe('Carlos Gomez');

    const authLinks = element.querySelectorAll('.top-row a.auth-link');
    expect(authLinks.length).toBe(1);
    expect(authLinks[0].textContent?.trim()).toBe(es.common.closeSessionText);
  });
});
