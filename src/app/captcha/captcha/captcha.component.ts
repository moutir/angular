import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';

import { CaptchaSettingsInterface } from '../../shared/interface/captcha-settings.interface';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-captcha',
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CaptchaComponent),
    multi: true,
 }],
})
export class CaptchaComponent implements ControlValueAccessor {

  /**
   * Parent form group
   */
  @Input() formGroup: FormGroup;

  /**
   * Form control name
   */
  @Input() formControlName: string;

  /**
   * Settings
   */
  @Input() settings: CaptchaSettingsInterface;

  /**
   * Success triggered
   */
  @Output() success: EventEmitter<string> = new EventEmitter<string>();

  /**
   *  Reset triggered
   */
  @Output() reset: EventEmitter<null> = new EventEmitter<null>();

  /**
   * Triggered reset
   */
  @Output() load: EventEmitter<null> = new EventEmitter<null>();

  /**
   * Triggered load
   */
  @Output() expire: EventEmitter<null> = new EventEmitter<null>();

  /**
   * Recaptcha site key
   */
  siteKey: string = environment.recaptcha.siteKey;

  /**
   * @inheritDoc
   */
  writeValue(value: string): void {}

  /**
   * @inheritDoc
   */
  registerOnChange(fn: (v: Event) => void): void {}

  /**
   * @inheritDoc
   */
  registerOnTouched(fn: () => void): void {}

  /**
   * Success triggered
   */
  onSuccess(token: string): void {

    this.success.emit(token);
  }

  /**
   * Reset triggered
   */
  onReset(): void {

    this.reset.emit();
  }

  /**
   * Load triggered
   */
  onLoad(): void {

    this.load.emit();
  }

  /**
   * Expire triggered
   */
  onExpire(): void {

    this.expire.emit();
  }
}
