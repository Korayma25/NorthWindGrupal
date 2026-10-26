import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PagerComponent } from './pager.component';

describe('PagerComponent', () => {
  let fixture: ComponentFixture<PagerComponent>;
  let component: PagerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PagerComponent);
    component = fixture.componentInstance;
  });

  it('should disable previous button on page 1', () => {
    fixture.componentRef.setInput('page', 1);
    fixture.componentRef.setInput('totalPages', 3);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons[0].disabled).toBe(true);
    expect(buttons[1].disabled).toBe(false);
  });

  it('should disable next button on last page', () => {
    fixture.componentRef.setInput('page', 3);
    fixture.componentRef.setInput('totalPages', 3);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons[0].disabled).toBe(false);
    expect(buttons[1].disabled).toBe(true);
  });

  it('should emit pageChange when clicking next or previous', () => {
    fixture.componentRef.setInput('page', 2);
    fixture.componentRef.setInput('totalPages', 3);
    fixture.detectChanges();

    const emitted: number[] = [];
    component.pageChange.subscribe(p => emitted.push(p));

    const buttons: HTMLButtonElement[] = fixture.nativeElement.querySelectorAll('button');
    buttons[0].click(); // Previous -> page 1
    buttons[1].click(); // Next -> page 3

    expect(emitted).toEqual([1, 3]);
  });

  it('should not render anything when totalPages <= 0', () => {
    fixture.componentRef.setInput('page', 1);
    fixture.componentRef.setInput('totalPages', 0);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('div')).toBeNull();
  });
});
