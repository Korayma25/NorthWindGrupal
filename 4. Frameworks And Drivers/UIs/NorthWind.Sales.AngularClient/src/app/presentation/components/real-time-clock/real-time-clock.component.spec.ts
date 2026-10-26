import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RealTimeClockComponent } from './real-time-clock.component';

describe('RealTimeClockComponent', () => {
  let component: RealTimeClockComponent;
  let fixture: ComponentFixture<RealTimeClockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RealTimeClockComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RealTimeClockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should format date in lowercase Spanish exactly matching Blazor RealTimeClock', () => {
    // Test known date: Thursday, 22 October 2026 14:35:07
    const fixedDate = new Date(2026, 9, 22, 14, 35, 7);
    component.currentTime.set(fixedDate);

    expect(component.formattedDate()).toBe('jueves, 22 de octubre de 2026');
    expect(component.formattedTime()).toBe('14:35:07');
  });

  it('should render datetime element without aria-live and with tabular-nums', () => {
    const element = fixture.nativeElement as HTMLElement;
    const timeElem = element.querySelector('time');
    expect(timeElem).toBeTruthy();
    expect(timeElem?.getAttribute('aria-live')).toBeNull();

    const timeSpan = element.querySelector('.nw-clock-time');
    expect(timeSpan).toBeTruthy();
  });
});
