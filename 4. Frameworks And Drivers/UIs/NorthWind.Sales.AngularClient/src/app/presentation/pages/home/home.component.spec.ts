import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { HomeComponent } from './home.component';
import { AuthService } from '../../../infrastructure/auth/auth.service';
import { es } from '../../../i18n/es';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
  });

  it('when unauthenticated, should ONLY render welcome message and NO cards', () => {
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const title = element.querySelector('.home-title');
    expect(title?.textContent?.trim()).toBe(es.home.welcomeMessage);

    const cards = element.querySelectorAll('.home-card');
    expect(cards.length).toBe(0);
    expect(element.querySelector('#card-create-order')).toBeNull();
    expect(element.querySelector('#card-invoices')).toBeNull();
  });

  it('when authenticated, should render app title, subtitle and both cards', () => {
    const header = btoa(JSON.stringify({ alg: 'HS256' }));
    const exp = Math.floor(Date.now() / 1000) + 3600;
    const payload = btoa(JSON.stringify({ exp, FullName: 'Admin User' }));
    const mockToken = `${header}.${payload}.sig`;

    authService['setSession']({ accessToken: mockToken });
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const title = element.querySelector('.home-title');
    expect(title?.textContent?.trim()).toBe(es.home.appTitle);

    const subtitle = element.querySelector('.home-subtitle');
    expect(subtitle?.textContent?.trim()).toBe(es.home.appSubtitle);

    const createOrderCard = element.querySelector('#card-create-order');
    expect(createOrderCard).toBeTruthy();
    expect(createOrderCard?.getAttribute('href')).toBe('/createorder');

    const invoicesCard = element.querySelector('#card-invoices');
    expect(invoicesCard).toBeTruthy();
    expect(invoicesCard?.getAttribute('href')).toBe('/invoices');
  });
});
