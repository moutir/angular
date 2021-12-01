import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Minimum array length
 */
export function ifIsNotRemoved(validatorFn: ValidatorFn): ValidatorFn {

  return (control: AbstractControl): ValidationErrors | null => {

    // Parent is FormGroup with isRemoved TRUE
    if (
      control.parent &&
      control.parent instanceof FormGroup &&
      control.parent.controls.isRemoved &&
      control.parent.controls.isRemoved.value === true
    ) {

      return null;
    }

    return validatorFn(control);
  };
}
