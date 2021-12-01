import { Component, ElementRef, forwardRef, Input, Renderer2 } from '@angular/core';
import { ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MAT_DATE_FORMATS, MatDatepicker } from '@angular/material';

const YEAR_MONTH_FORMATS = {
  parse: {
    dateInput: 'YYYY',
 },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-year-picker',
  templateUrl: './year-picker.component.html',
  providers: [
    {
      provide: MAT_DATE_FORMATS,
      useValue: YEAR_MONTH_FORMATS,
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => YearPickerComponent),
      multi: true,
    },
  ],
})
export class YearPickerComponent implements ControlValueAccessor {

  /**
   * Parent form group
   */
  @Input() formGroup: FormGroup;

  /**
   * Form control name
   */
  @Input() formControlName: string;

  /**
   * Input laceholder
   */
  @Input() placeholder: string = '';

  /**
   * Field error
   */
   @Input() error: string = '';

  /**
   * Control callbacks
   */
  private onTouchedCallback = () => {};
  private onChangeCallback = (value: Date) => {};

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
  writeValue(value: string): void {}

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
   * Year selected on the date picker
   */
   onPickYear(date: Date, datepicker: MatDatepicker<Date>): void {

    this.onChangeCallback(date);
    this.onTouchedCallback();

    datepicker.close();
  }
}
