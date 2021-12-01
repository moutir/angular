import { AfterViewInit, Directive, ElementRef, forwardRef, HostListener, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[appInputPassword]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputPasswordDirective),
      multi: true,
    },
  ],
})
export class InputPasswordDirective implements ControlValueAccessor, AfterViewInit {

  /**
   * Is the input value obscured?
   */
  private isObscure: boolean = true;

  /**
   * Cut operation active?
   */
  private isActiveCut: boolean = false;

  /**
   * Input value
   */
  private inputValue: string = '';

  /**
   * Pasted value
   */
  private pastedValue: string = '';

  /**
   * Input selection start position
   */
  private selectionStart: number = 0;

  /**
   * Input selection end position
   */
  private selectionEnd: number = 0;

  /**
   * Pressed key
   */
  private pressedKey: string = '';

  /**
   * CSS selector for input's parent field
   */
  private cssSelectorParentField: string = '.mat-form-field';

  /**
   * Control callbacks
   */
  private onTouchedCallback = () => {};
  private onChangeCallback = (value: string) => {};

  /**
   * Constructor
   */
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {

  }

  /**
   * After initialized view
   */
  ngAfterViewInit(): void {

    const toggleButtonEl = this.el.nativeElement.closest(this.cssSelectorParentField).querySelector('button');

    this.el.nativeElement.autocomplete = 'off';
    this.el.nativeElement.type = 'text';

    // Hack to stop autocomplete in some browsers (Just autocomplete="off" didn't work)
    this.el.nativeElement.readOnly = true;

    // Listen to input focus
    this.el.nativeElement.addEventListener('focus', this.onFocusInput.bind(this));

    // Add listener for toggle button click
    toggleButtonEl.addEventListener('click', this.onClickToggleButton.bind(this));
  }

  /**
   * @inheritDoc
   */
  writeValue(value: string): void {

    this.inputValue = value;

    if (this.isObscure === true) {

      // Replace all chars to star
      value = this.inputValue.replace(/./gi, '*');
    }

    this.renderer.setProperty(this.el.nativeElement, 'value', value);
  }

  /**
   * @inheritDoc
   */
  registerOnChange(fn: () => void): void {

    this.onChangeCallback = fn;
  }

  /**
   * @inheritDoc
   */
  registerOnTouched(fn: () => void): void {

    this.onTouchedCallback = fn;
  }

  /**
   * Keydown event
   */
  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {

    this.selectionStart = this.el.nativeElement.selectionStart;
    this.selectionEnd = this.el.nativeElement.selectionEnd;
    this.pressedKey = event.key;
  }

  /**
   * Input event
   */
  @HostListener('input', ['$event'])
  onInput(event: KeyboardEvent): void {

    // Cut, backspace or delete
    if (this.isActiveCut || this.pressedKey === 'Backspace' || this.pressedKey === 'Delete') {

      // Reset
      this.isActiveCut = false;

      const selectionStart = this.selectionStart === this.selectionEnd ?
        (this.selectionStart - 1) : this.selectionStart;

      this.inputValue = [
        this.inputValue.substring(0, selectionStart),
        this.inputValue.substring(this.selectionEnd),
      ].join('');

      return;
    }

    this.inputValue = [
      this.inputValue.substring(0, this.selectionStart),
      (this.pastedValue || this.pressedKey),
      this.inputValue.substring(this.selectionEnd),
    ].join('');

    this.el.nativeElement.value = this.isObscure === false ?
      this.inputValue : this.inputValue.replace(/./gi, '*');

    const newCaretPosition = this.pastedValue ?
      (this.selectionStart + this.pastedValue.length) : (this.selectionStart + 1);

    this.setCaretPosition(newCaretPosition, newCaretPosition);

    // Reset
    this.pastedValue = '';
  }

  /**
   * Paste event
   */
  @HostListener('cut', ['$event'])
  onCut(event: ClipboardEvent): void {

    // No browser support
    if (!event.clipboardData) {

      event.preventDefault();
    }

    this.isActiveCut = true;
  }

  /**
   * Paste event
   */
  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {

    // No browser support
    if (!event.clipboardData) {

      event.preventDefault();
    }

    // Get pasted value (Spaces removed)
    this.pastedValue = (event.clipboardData.getData('text') || '').replace(/\s+/g, '');
  }

  /**
   * Blur event
   */
  @HostListener('blur')
  onBlur(): void {

    // Update form control value
    this.onChangeCallback(this.inputValue);
    this.onTouchedCallback();

    if (this.isObscure === true) {

      this.el.nativeElement.value = this.inputValue.replace(/./gi, '*');
    }
  }

  /**
   * Set caret position
   */
  private setCaretPosition(startPos: number, endPos: number): void {

    if (!this.el.nativeElement.setSelectionRange) {

      return;
    }

    this.el.nativeElement.focus();
    this.el.nativeElement.setSelectionRange(startPos, endPos);
  }

  /**
   * Focus event on input
   */
  private onFocusInput(event: MouseEvent): void {

    // Reset input's readonly state
    (<HTMLInputElement>event.currentTarget).readOnly = false;
  }

  /**
   * Clicked on toggle button
   */
  private onClickToggleButton(event: MouseEvent): void {

    const targetEl: HTMLElement = <HTMLElement>event.target;
    const toggleButtonEl = targetEl.closest('button');

    if (!toggleButtonEl) {

      return;
    }

    const iconEl = toggleButtonEl.querySelector('mat-icon');

    // Toggle password obscurity
    this.isObscure = !this.isObscure;

    // Update toggle  utton icon
    iconEl.innerHTML = this.isObscure === false ? 'visibility' : 'visibility_off';

    // Set input value
    this.el.nativeElement.value = this.isObscure === false ? this.inputValue : this.inputValue.replace(/./gi, '*');
  }
}
