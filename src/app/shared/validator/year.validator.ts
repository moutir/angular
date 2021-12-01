import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Year validator
 */
export function yearValidator(): ValidatorFn {

  return (control: AbstractControl): ValidationErrors | null => {

    const regex = /^[0-9]{4}$/;

    return control.value && (!regex.test(control.value) || control.value < 1900) ?
      { 'year' : { value: control.value } } : null;
  };
}
