import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CharFilterDirective } from './char-filter.directive';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CharFilterDirective],
  template: `
    <input id="nameInput" type="text" [formControl]="nameControl" appCharFilter="letters" />
    <input id="emailInput" type="text" [formControl]="emailControl" appCharFilter="login" />
    <input id="digitsInput" type="text" [formControl]="digitsControl" appCharFilter="digits" />
    <input id="digitsHyphenInput" type="text" [formControl]="digitsHyphenControl" appCharFilter="digitsHyphen" />
    <input id="defaultFilterInput" type="text" [formControl]="defaultControl" appCharFilter />
    <input id="passwordInput" type="password" [formControl]="passwordControl" />
  `
})
class TestHostComponent {
  public nameControl = new FormControl('');
  public emailControl = new FormControl('');
  public digitsControl = new FormControl('');
  public digitsHyphenControl = new FormControl('');
  public defaultControl = new FormControl('');
  public passwordControl = new FormControl('');
}

describe('CharFilterDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should filter pasted "Juan 123 Perez!" to "Juan  Perez" in letters mode (Criterio 1)', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('#nameInput');
    input.value = 'Juan 123 Perez!';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(input.value).toBe('Juan  Perez');
    expect(component.nameControl.value).toBe('Juan  Perez');
  });

  it('should filter pasted "jose_manzano+1@gmail.com" to "josemanzano1@gmail.com" in login mode (Criterio 1)', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('#emailInput');
    input.value = 'jose_manzano+1@gmail.com';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(input.value).toBe('josemanzano1@gmail.com');
    expect(component.emailControl.value).toBe('josemanzano1@gmail.com');
  });

  it('should leave password unrestricted without char filter (Criterio 1)', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('#passwordInput');
    input.value = 'P@ssw0rd_123!+';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(input.value).toBe('P@ssw0rd_123!+');
    expect(component.passwordControl.value).toBe('P@ssw0rd_123!+');
  });

  it('should preserve cursor position when typing an invalid character in the middle of text (Criterio 2)', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('#nameInput');
    input.value = 'Carlos';
    input.dispatchEvent(new Event('input'));

    // User places cursor between 'Car' and 'los' (pos 3), types invalid character '9'
    input.value = 'Car9los';
    input.setSelectionRange(4, 4);
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(input.value).toBe('Carlos');
    expect(input.selectionStart).toBe(3);
    expect(input.selectionEnd).toBe(3);
  });

  it('should preserve cursor position when typing a valid character in the middle of text', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('#nameInput');
    input.value = 'Carlos';
    input.dispatchEvent(new Event('input'));

    // User inserts valid character 'o' after 'Car'
    input.value = 'Carolos';
    input.setSelectionRange(4, 4);
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(input.value).toBe('Carolos');
    expect(input.selectionStart).toBe(4);
  });

  it('should filter digits only in digits mode', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('#digitsInput');
    input.value = 'abc12-34xyz';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(input.value).toBe('1234');
    expect(component.digitsControl.value).toBe('1234');
  });

  it('should filter digits and hyphen in digitsHyphen mode', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('#digitsHyphenInput');
    input.value = '171-003a!4065';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(input.value).toBe('171-0034065');
    expect(component.digitsHyphenControl.value).toBe('171-0034065');
  });

  it('should default to letters when appCharFilter has no value', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('#defaultFilterInput');
    input.value = 'Ana 123 Maria!';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(input.value).toBe('Ana  Maria');
    expect(component.defaultControl.value).toBe('Ana  Maria');
  });
});
