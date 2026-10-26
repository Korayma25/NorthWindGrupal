import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { PdfViewerComponent } from './pdf-viewer.component';

describe('PdfViewerComponent', () => {
  let component: PdfViewerComponent;
  let fixture: ComponentFixture<PdfViewerComponent>;
  let createObjectURLSpy: any;
  let revokeObjectURLSpy: any;

  beforeEach(async () => {
    createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockImplementation(() => 'blob:http://localhost/test-uuid');
    revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

    await TestBed.configureTestingModule({
      imports: [PdfViewerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PdfViewerComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render loading placeholder when content is null', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#pdf-frame')).toBeNull();
    expect(compiled.querySelector('.spinner-border')).not.toBeNull();
  });

  it('should create object URL and render iframe and download/print buttons when content is provided', async () => {
    const fakeBlob = new Blob(['%PDF-1.4'], { type: 'application/pdf' });
    fixture.componentRef.setInput('content', fakeBlob);
    fixture.componentRef.setInput('fileName', 'invoice-100.pdf');
    fixture.detectChanges();

    expect(createObjectURLSpy).toHaveBeenCalledWith(fakeBlob);
    expect(component.rawBlobUrl()).toBe('blob:http://localhost/test-uuid');

    const compiled = fixture.nativeElement as HTMLElement;
    const downloadBtn = compiled.querySelector('#pdf-download-btn') as HTMLAnchorElement;
    expect(downloadBtn).not.toBeNull();
    expect(downloadBtn.getAttribute('href')).toBe('blob:http://localhost/test-uuid');
    expect(downloadBtn.getAttribute('download')).toBe('invoice-100.pdf');

    const printBtn = compiled.querySelector('#pdf-print-btn');
    expect(printBtn).not.toBeNull();

    const iframe = compiled.querySelector('#pdf-frame');
    expect(iframe).not.toBeNull();
  });

  it('should trigger print on iframe contentWindow', () => {
    const fakeBlob = new Blob(['%PDF-1.4'], { type: 'application/pdf' });
    fixture.componentRef.setInput('content', fakeBlob);
    fixture.detectChanges();

    const printMock = vi.fn();
    if (component.iframeRef?.nativeElement) {
      Object.defineProperty(component.iframeRef.nativeElement, 'contentWindow', {
        value: { print: printMock },
        configurable: true
      });
    }

    component.print();
    expect(printMock).toHaveBeenCalled();
  });

  it('should revoke previous object URL when content changes', () => {
    const blob1 = new Blob(['1'], { type: 'application/pdf' });
    const blob2 = new Blob(['2'], { type: 'application/pdf' });

    fixture.componentRef.setInput('content', blob1);
    fixture.detectChanges();
    expect(createObjectURLSpy).toHaveBeenCalledTimes(1);

    fixture.componentRef.setInput('content', blob2);
    fixture.detectChanges();

    expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:http://localhost/test-uuid');
    expect(createObjectURLSpy).toHaveBeenCalledTimes(2);
  });

  it('should revoke object URL on destroy', () => {
    const fakeBlob = new Blob(['%PDF-1.4'], { type: 'application/pdf' });
    fixture.componentRef.setInput('content', fakeBlob);
    fixture.detectChanges();

    fixture.destroy();
    expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:http://localhost/test-uuid');
  });
});
