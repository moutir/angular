import { Directive, ElementRef, forwardRef, HostListener, Input, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[appInputTime]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTimeDirective),
      multi: true,
    },
  ],
})
export class InputTimeDirective implements ControlValueAccessor {

  /**
   * Seconds to be displayed ?
   */
  @Input() isShownSeconds: boolean = false;

  /**
   * Input value
   */
  value: string = '';

  /**
   * Control callbacks
   */
  onTouchedCallback = () => {};
  onChangeCallback = (value: string) => {};

  /**
   * Constructor
   */
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {

  }

  /**
   * @inheritDoc
   */
  writeValue(value: string): void {

    this.renderer.setProperty(this.el.nativeElement, 'value', this.getNormalizedTime(value));
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
   * Input event
   */
  @HostListener('input', ['$event'])
  onInput(event: KeyboardEvent): void {

    const initalValue = this.el.nativeElement.value;
    const newValue = this.el.nativeElement.value.replace(/[^\:0-9]*/g, '');

    this.el.nativeElement.value = newValue;

    // Backspace OR other invalid characters
    if (newValue.length < this.value.length || initalValue !== newValue) {

      event.stopPropagation();

      this.value = newValue;

      return;
    }

    this.el.nativeElement.value = this.parse(newValue);
    this.value = this.el.nativeElement.value;
  }

  /**
   * Paste event
   */
  @HostListener('paste', ['$event'])
  onPaste(event: KeyboardEvent): void {

    event.preventDefault();
  }

  /**
   * Blur event
   */
  @HostListener('blur')
  onBlur(): void {

    const value = this.getNormalizedTime(this.el.nativeElement.value);

    this.el.nativeElement.value = value;
    this.value = value;

    // Update form control value
    this.onChangeCallback(this.value);
    this.onTouchedCallback();
  }

  /**
   * Returns normalized time in hh:mm:ss format
   */
  getNormalizedTime(str: string): string {

    const segments = str.split(':');
    let hour = segments[0] ? segments[0].substr(0, 2) : '';
    let minute = segments[1] ? segments[1].substr(0, 2) : '';
    let second = segments[2] ? segments[2].substr(0, 2) : '';

    if (hour === '' && minute === '' && second === '') {

      return '';
    }

    hour = Number(hour) <= 9 ? '0' + Number(hour) : hour;
    minute = Number(minute) <= 9 ? '0' + Number(minute) : minute;
    second = Number(second) <= 9 ? '0' + Number(second) : second;

    if (this.isShownSeconds) {

      return [hour, minute, second].join(':');
    }

    return [hour, minute].join(':');
  }

  /**
   * Parse time string to valid hh:mm:ss format
   */
  parse(str: string): string {

    const segments = str.split(':');
    let hour = segments[0] ? segments[0].substr(0, 2) : '';
    let minute = segments[1] ? segments[1].substr(0, 2) : '';
    let second = segments[2] ? segments[2].substr(0, 2) : '';

    if (hour !== '' && hour.length === 1 && Number(hour) > 2) {

      hour = (0 + hour);
    }

    if (Number(hour) > 23) {

      hour = '23';
    }

    if (minute !== '' && minute.length === 1 && Number(minute) > 5) {

      minute = (0 + minute);
    }

    if (Number(minute) > 59) {

      minute = '59';
    }

    if (second !== '' && second.length === 1 && Number(second) > 5) {

      second = (0 + second);
    }

    if (Number(second) > 59) {

      second = '59';
    }

    if (this.isShownSeconds) {

      if (hour.length > 1 && minute.length > 1) {

        return [hour, minute, second].join(':');
      }

      return hour.length > 1 ? [hour, minute].join(':') : hour;
    }

    return hour.length > 1 ? [hour, minute].join(':') : hour;
  }
}
