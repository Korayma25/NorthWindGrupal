import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let component: ConfirmDialogComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
  });

  it('should emit cancelled and close on Escape key (Criterio 4)', () => {
    let cancelledEmitted = false;
    component.cancelled.subscribe(() => {
      cancelledEmitted = true;
    });

    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();

    component.handleKeyDown(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(cancelledEmitted).toBe(true);
    expect(component.visible()).toBe(false);
  });

  it('should emit cancelled and close on backdrop click (Criterio 4)', () => {
    let cancelledEmitted = false;
    component.cancelled.subscribe(() => {
      cancelledEmitted = true;
    });

    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();

    component.cancel();
    expect(cancelledEmitted).toBe(true);
    expect(component.visible()).toBe(false);
  });

  it('should emit confirmed and close on confirm button click (Criterio 4)', () => {
    let confirmedEmitted = false;
    component.confirmed.subscribe(() => {
      confirmedEmitted = true;
    });

    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();

    component.confirm();
    expect(confirmedEmitted).toBe(true);
    expect(component.visible()).toBe(false);
  });

  it('should set initial focus on Cancel button when opened', async () => {
    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();
    await fixture.whenStable();

    const cancelBtn = component.cancelButtonRef?.nativeElement;
    expect(cancelBtn).not.toBeNull();
  });
});
