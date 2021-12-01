import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Minimum array length
 */
export function arrayMinLengthValidator(minLength: number): ValidatorFn {

  return (control: AbstractControl): ValidationErrors | null => {

    let length = 0;

    // FormArray
    if (control instanceof FormArray) {

      length = control.controls
        .filter(formGroup => (<FormGroup>formGroup).controls.isRemoved ? (<FormGroup>formGroup).controls.isRemoved.value !== true : true)
        .length;
    }

    // FormControl
    if (control instanceof FormControl) {

      length = control.value.length;
    }

    if (length >= minLength) {

      return null;
    }

    const error = {};
    error['arrayMinLength_' + minLength] = true;

    return error;
  };
}
