import {
  Component,
  ElementRef,
  ViewChild,
  effect,
  input,
  model,
  output
} from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    @if (visible()) {
      <div
        class="modal d-block fade show"
        tabindex="-1"
        role="dialog"
        aria-modal="true"
        [attr.aria-labelledby]="titleId"
        style="background-color: rgba(11, 15, 26, 0.75);"
        (keydown)="handleKeyDown($event)"
        (click)="cancel()"
      >
        <div class="modal-dialog modal-dialog-centered" (click)="$event.stopPropagation()">
          <div class="modal-content shadow border-0" #dialogContainer>
            <div class="modal-header">
              <h5 class="modal-title fw-bold" [id]="titleId">{{ title() }}</h5>
              <button
                type="button"
                class="btn-close btn-close-white"
                aria-label="Close"
                (click)="cancel()"
              ></button>
            </div>
            <div class="modal-body">
              <p class="mb-0">{{ message() }}</p>
            </div>
            <div class="modal-footer">
              <button
                #cancelButton
                type="button"
                class="btn btn-outline-secondary"
                (click)="cancel()"
              >
                {{ cancelText() }}
              </button>
              <button
                type="button"
                class="btn nw-confirm-btn nw-confirm-btn-danger"
                (click)="confirm()"
              >
                {{ confirmText() }}
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    .nw-confirm-btn-danger {
      color: #ffffff !important;
      background-color: #991b1b !important;
      border-color: #991b1b !important;
      font-weight: 500;
      transition: all 150ms ease-in-out;
    }
    .nw-confirm-btn-danger:hover:not(:disabled) {
      color: #ffffff !important;
      background-color: #7f1d1d !important;
      border-color: #7f1d1d !important;
    }
    .nw-confirm-btn-danger:focus,
    .nw-confirm-btn-danger:active:focus {
      box-shadow: 0 0 0 0.25rem rgba(185, 28, 28, 0.4) !important;
      outline: none;
    }
  `
})
export class ConfirmDialogComponent {
  public readonly visible = model<boolean>(false);
  public readonly title = input<string>('Confirmación');
  public readonly message = input<string>('');
  public readonly confirmText = input<string>('Aceptar');
  public readonly cancelText = input<string>('Cancelar');

  public readonly confirmed = output<void>();
  public readonly cancelled = output<void>();

  @ViewChild('cancelButton') public cancelButtonRef?: ElementRef<HTMLButtonElement>;
  @ViewChild('dialogContainer') public dialogContainerRef?: ElementRef<HTMLDivElement>;

  public readonly titleId = `confirm-dialog-title-${Math.random().toString(36).substring(2, 9)}`;

  constructor() {
    effect(() => {
      if (this.visible()) {
        setTimeout(() => {
          this.cancelButtonRef?.nativeElement?.focus();
        }, 0);
      }
    });
  }

  public confirm(): void {
    this.visible.set(false);
    this.confirmed.emit();
  }

  public cancel(): void {
    this.visible.set(false);
    this.cancelled.emit();
  }

  public handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.cancel();
      return;
    }

    if (event.key === 'Tab') {
      const container = this.dialogContainerRef?.nativeElement;
      if (!container) return;

      const focusable = container.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        last.focus();
        event.preventDefault();
      } else if (!event.shiftKey && document.activeElement === last) {
        first.focus();
        event.preventDefault();
      }
    }
  }
}
