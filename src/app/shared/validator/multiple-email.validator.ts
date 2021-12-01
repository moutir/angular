import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

/**
 * Multiple emails validator splitted by separator
 */
export function multipleEmailValidator(separator: string = ','): ValidatorFn {

  return (control: AbstractControl): ValidationErrors | null => {

    const emails = control.value.split(separator);
    const forbidden = emails.some(email => Validators.email(new FormControl(email.trim())));

    return forbidden ? { 'multipleEmailValidator': { value: control.value } } : null;
  };
}
