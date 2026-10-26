import {
  Component,
  ElementRef,
  HostListener,
  TemplateRef,
  contentChild,
  inject,
  input,
  model,
  output,
  signal,
  effect,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { PagedResultDto } from '../../../domain/dtos';
import { PagerComponent } from '../pager/pager.component';
import { es } from '../../../i18n/es';

@Component({
  selector: 'app-search-modal',
  standalone: true,
  imports: [CommonModule, PagerComponent],
  templateUrl: './search-modal.component.html'
})
export class SearchModalComponent<T> implements OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);

  public readonly title = input<string>('');
  public readonly visible = model<boolean>(false);
  public readonly pageSize = input<number>(5);
  public readonly debounceMilliseconds = input<number>(400);
  public readonly minSearchLength = input<number>(2);
  public readonly canSearch = input<(() => boolean) | null>(null);

  public readonly loader = input.required<
    (page: number, pageSize: number) => Observable<PagedResultDto<T>>
  >();

  public readonly headerTemplate = input<TemplateRef<unknown> | null>(null);
  public readonly rowTemplate = input<TemplateRef<{ $implicit: T }> | null>(null);

  public readonly selected = output<T>();

  public readonly items = signal<readonly T[] | null>(null);
  public readonly currentPage = signal<number>(1);
  public readonly totalPages = signal<number>(1);
  public readonly isLoading = signal<boolean>(false);
  public readonly hasSearched = signal<boolean>(false);

  public readonly es = es;

  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private searchVersion = 0;
  private currentSubscription: Subscription | null = null;
  private previousVisible = false;

  constructor() {
    effect(() => {
      const isVisible = this.visible();
      this.handleVisibleChange(isVisible);
    });
  }

  public openModal(): void {
    this.visible.set(true);
    this.handleVisibleChange(true);
  }

  public closeModal(): void {
    this.cancelAll();
    this.isLoading.set(false);
    this.visible.set(false);
  }

  public handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeModal();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      this.executeImmediate();
    }
  }

  public handleFilterInput(): void {
    this.notifyFilterChanged();
  }

  public notifyFilterChanged(): void {
    this.cancelDebounce();

    const canSearchFn = this.canSearch();
    if (canSearchFn && !canSearchFn()) {
      return;
    }

    this.debounceTimer = setTimeout(() => {
      const recheck = this.canSearch();
      if (recheck && !recheck()) {
        return;
      }
      this.currentPage.set(1);
      this.executeSearch();
    }, this.debounceMilliseconds());
  }

  public handleSearchButtonClick(): void {
    this.currentPage.set(1);
    this.executeImmediate();
  }

  public onPageChanged(newPage: number): void {
    this.currentPage.set(newPage);
    this.executeImmediate();
  }

  public selectItem(item: T): void {
    this.selected.emit(item);
    this.closeModal();
  }

  public cancelDebounce(): void {
    if (this.debounceTimer !== null) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
  }

  public cancelAll(): void {
    this.cancelDebounce();
    this.searchVersion++;
    if (this.currentSubscription) {
      this.currentSubscription.unsubscribe();
      this.currentSubscription = null;
    }
  }

  public executeImmediate(): void {
    this.cancelDebounce();
    this.executeSearch();
  }

  private executeSearch(): void {
    const loaderFn = this.loader();
    if (!loaderFn) {
      return;
    }

    this.cancelDebounce();
    const version = ++this.searchVersion;

    if (this.currentSubscription) {
      this.currentSubscription.unsubscribe();
      this.currentSubscription = null;
    }

    this.isLoading.set(true);

    this.currentSubscription = loaderFn(this.currentPage(), this.pageSize()).subscribe({
      next: result => {
        if (version === this.searchVersion) {
          this.items.set(result?.items ?? []);
          this.totalPages.set(result?.totalPages ?? 0);
          this.hasSearched.set(true);
          this.isLoading.set(false);
        }
      },
      error: () => {
        if (version === this.searchVersion) {
          this.items.set([]);
          this.totalPages.set(0);
          this.hasSearched.set(true);
          this.isLoading.set(false);
        }
      }
    });
  }

  public handleVisibleChange(isVisible: boolean): void {
    if (isVisible && !this.previousVisible) {
      this.currentPage.set(1);
      this.totalPages.set(1);
      this.items.set(null);
      this.hasSearched.set(false);
      this.executeImmediate();
    } else if (!isVisible && this.previousVisible) {
      this.cancelAll();
      this.isLoading.set(false);
    }
    this.previousVisible = isVisible;
  }

  public ngOnDestroy(): void {
    this.cancelAll();
  }
}
