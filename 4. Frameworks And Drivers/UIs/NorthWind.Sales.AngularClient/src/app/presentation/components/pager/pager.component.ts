import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-pager',
  standalone: true,
  template: `
    @if (totalPages() > 0) {
      <div class="d-flex align-items-center justify-content-between my-2">
        <button
          type="button"
          class="btn btn-outline-secondary btn-sm"
          [disabled]="page() <= 1"
          (click)="onPageChange(page() - 1)"
        >
          &laquo; Anterior
        </button>
        <span class="mx-2 text-muted small">Página {{ page() }} de {{ totalPages() }}</span>
        <button
          type="button"
          class="btn btn-outline-secondary btn-sm"
          [disabled]="page() >= totalPages()"
          (click)="onPageChange(page() + 1)"
        >
          Siguiente &raquo;
        </button>
      </div>
    }
  `
})
export class PagerComponent {
  public readonly page = input<number>(1);
  public readonly totalPages = input<number>(1);
  public readonly pageChange = output<number>();

  public onPageChange(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages() && newPage !== this.page()) {
      this.pageChange.emit(newPage);
    }
  }
}
