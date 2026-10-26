import {
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  computed,
  effect,
  inject,
  input,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { es } from '../../../i18n/es';

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pdf-viewer.component.html'
})
export class PdfViewerComponent implements OnDestroy {
  private readonly sanitizer = inject(DomSanitizer);

  public readonly content = input<Blob | ArrayBuffer | Uint8Array | null | undefined>(null);
  public readonly fileName = input<string>('invoice.pdf');

  public readonly rawBlobUrl = signal<string | null>(null);
  public readonly safeBlobUrl = signal<SafeResourceUrl | null>(null);

  @ViewChild('pdfIframe') public iframeRef?: ElementRef<HTMLIFrameElement>;

  public readonly es = es;

  private currentBlobUrl: string | null = null;

  constructor() {
    effect(() => {
      const data = this.content();
      this.updateBlobUrl(data);
    });
  }

  private updateBlobUrl(data: Blob | ArrayBuffer | Uint8Array | null | undefined): void {
    if (this.currentBlobUrl) {
      URL.revokeObjectURL(this.currentBlobUrl);
      this.currentBlobUrl = null;
    }

    if (!data) {
      this.rawBlobUrl.set(null);
      this.safeBlobUrl.set(null);
      return;
    }

    let blob: Blob;
    if (data instanceof Blob) {
      blob = data.type === 'application/pdf' ? data : new Blob([data], { type: 'application/pdf' });
    } else {
      blob = new Blob([data as unknown as BlobPart], { type: 'application/pdf' });
    }

    if (blob.size === 0) {
      this.rawBlobUrl.set(null);
      this.safeBlobUrl.set(null);
      return;
    }

    const url = URL.createObjectURL(blob);
    this.currentBlobUrl = url;
    this.rawBlobUrl.set(url);
    this.safeBlobUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(url));
  }

  public print(): void {
    const frame = this.iframeRef?.nativeElement;
    if (frame?.contentWindow) {
      frame.contentWindow.print();
    }
  }

  public ngOnDestroy(): void {
    if (this.currentBlobUrl) {
      URL.revokeObjectURL(this.currentBlobUrl);
      this.currentBlobUrl = null;
      this.rawBlobUrl.set(null);
      this.safeBlobUrl.set(null);
    }
  }
}
