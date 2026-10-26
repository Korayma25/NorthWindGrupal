import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Optional,
  inject
} from '@angular/core';
import { NgControl } from '@angular/forms';
import {
  keepDigits,
  keepDigitsAndHyphen,
  keepLetters,
  keepLoginCharacters
} from '../../domain/validators/textRules';

export type CharFilterType = 'letters' | 'digits' | 'digitsHyphen' | 'login';

@Directive({
  selector: '[appCharFilter]',
  standalone: true
})
export class CharFilterDirective {
  @Input('appCharFilter') public filterType: CharFilterType | '' = 'letters';

  private readonly el = inject(ElementRef<HTMLInputElement>);
  private readonly ngControl = inject(NgControl, { optional: true });

  @HostListener('input')
  public onInput(): void {
    const input = this.el.nativeElement;
    const originalValue = input.value;
    if (!originalValue) {
      return;
    }

    const cursorStart = input.selectionStart ?? originalValue.length;
    const rawBefore = originalValue.slice(0, cursorStart);
    const filteredBefore = this.filterText(rawBefore);
    const newCursor = filteredBefore.length;

    const filteredValue = this.filterText(originalValue);

    if (originalValue !== filteredValue) {
      input.value = filteredValue;

      if (this.ngControl?.control) {
        this.ngControl.control.setValue(filteredValue, {
          emitModelToViewChange: false
        });
      }

      input.setSelectionRange(newCursor, newCursor);
    }
  }

  public filterText(text: string): string {
    const type = this.filterType || 'letters';
    switch (type) {
      case 'letters':
        return keepLetters(text);
      case 'digits':
        return keepDigits(text);
      case 'digitsHyphen':
        return keepDigitsAndHyphen(text);
      case 'login':
        return keepLoginCharacters(text);
      default:
        return text;
    }
  }
}
