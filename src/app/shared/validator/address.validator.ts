import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Address validator
 */
export function addressValidator(): ValidatorFn {

  return (control: AbstractControl): ValidationErrors | null => {

    if (!control.value) {

      return null;
    }

    const isValid = (
      typeof control.value === 'object'
      && control.value.hasOwnProperty('string')
      && control.value.hasOwnProperty('houseNumber')
      && control.value.hasOwnProperty('street')
      && control.value.hasOwnProperty('string')
      && control.value.hasOwnProperty('string')
      && control.value.hasOwnProperty('coordinates')
      && control.value.coordinates.hasOwnProperty('lat')
      && control.value.coordinates.hasOwnProperty('lng')
    );

    return isValid === false ? { 'addressValidator' : { value: control.value } } : null;
  };
}
