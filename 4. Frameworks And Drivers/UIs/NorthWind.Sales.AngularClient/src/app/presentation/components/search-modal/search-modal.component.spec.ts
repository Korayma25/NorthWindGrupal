import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchModalComponent } from './search-modal.component';
import { Subject, of } from 'rxjs';
import { PagedResultDto } from '../../../domain/dtos';

interface TestItem {
  id: string;
  name: string;
}

describe('SearchModalComponent', () => {
  let fixture: ComponentFixture<SearchModalComponent<TestItem>>;
  let component: SearchModalComponent<TestItem>;

  beforeEach(async () => {
    vi.useFakeTimers();

    await TestBed.configureTestingModule({
      imports: [SearchModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchModalComponent<TestItem>);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should trigger search immediately on open', async () => {
    let calledWith = { page: 0, pageSize: 0 };
    fixture.componentRef.setInput('loader', (page: number, pageSize: number) => {
      calledWith = { page, pageSize };
      return of({
        items: [{ id: '1', name: 'Item 1' }],
        page: 1,
        pageSize: 5,
        totalCount: 1,
        totalPages: 1
      });
    });

    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(calledWith).toEqual({ page: 1, pageSize: 5 });
    expect(component.items()?.length).toBe(1);
    expect(component.hasSearched()).toBe(true);
  });

  it('should debounce search by 400ms on notifyFilterChanged', async () => {
    let callCount = 0;
    fixture.componentRef.setInput('loader', () => {
      callCount++;
      return of({
        items: [],
        page: 1,
        pageSize: 5,
        totalCount: 0,
        totalPages: 0
      });
    });

    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(callCount).toBe(1); // initial open search

    component.notifyFilterChanged();
    vi.advanceTimersByTime(200);
    expect(callCount).toBe(1); // not called yet at 200ms

    vi.advanceTimersByTime(200); // 400ms reached
    expect(callCount).toBe(2);
  });

  it('should discard stale out-of-order responses (Criterio 4)', () => {
    const subject1 = new Subject<PagedResultDto<TestItem>>();
    const subject2 = new Subject<PagedResultDto<TestItem>>();

    let requestNumber = 0;
    fixture.componentRef.setInput('loader', () => {
      requestNumber++;
      return requestNumber === 1 ? subject1.asObservable() : subject2.asObservable();
    });

    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();
    // Request 1 initiated
    expect(requestNumber).toBe(1);

    // Immediate search initiated before Request 1 resolves (Request 2)
    component.executeImmediate();
    expect(requestNumber).toBe(2);

    // Request 2 completes first with Item 2
    subject2.next({
      items: [{ id: '2', name: 'Item 2' }],
      page: 1,
      pageSize: 5,
      totalCount: 1,
      totalPages: 1
    });
    subject2.complete();
    fixture.detectChanges();

    expect(component.items()?.[0].name).toBe('Item 2');

    // Request 1 arrives late with Item 1
    subject1.next({
      items: [{ id: '1', name: 'Item 1' }],
      page: 1,
      pageSize: 5,
      totalCount: 1,
      totalPages: 1
    });
    subject1.complete();
    fixture.detectChanges();

    // Table must still show Item 2 (not overwritten by stale response 1)
    expect(component.items()?.[0].name).toBe('Item 2');
  });

  it('should show "Sin resultados" when items is empty after search', async () => {
    fixture.componentRef.setInput('loader', () =>
      of({
        items: [],
        page: 1,
        pageSize: 5,
        totalCount: 0,
        totalPages: 0
      })
    );

    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const alert = fixture.nativeElement.querySelector('.alert-info');
    expect(alert).not.toBeNull();
    expect(alert.textContent).toContain('Sin resultados');
  });

  it('should emit selected and close on selectItem', async () => {
    let emittedItem: TestItem | null = null;
    component.selected.subscribe(item => {
      emittedItem = item;
    });

    fixture.componentRef.setInput('visible', true);
    fixture.componentRef.setInput('loader', () =>
      of({
        items: [{ id: 'A', name: 'Customer A' }],
        page: 1,
        pageSize: 5,
        totalCount: 1,
        totalPages: 1
      })
    );
    fixture.detectChanges();
    await fixture.whenStable();

    component.selectItem({ id: 'A', name: 'Customer A' });
    expect(emittedItem).toEqual({ id: 'A', name: 'Customer A' });
    expect(component.visible()).toBe(false);
  });

  it('should close on Escape key', async () => {
    fixture.componentRef.setInput('visible', true);
    fixture.componentRef.setInput('loader', () =>
      of({ items: [], page: 1, pageSize: 5, totalCount: 0, totalPages: 0 })
    );
    fixture.detectChanges();
    await fixture.whenStable();

    component.handleKeyDown(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(component.visible()).toBe(false);
  });
});
