import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Color validator (Supports hex color codes and color names)
 */
export function colorValidator(): ValidatorFn {

  return (control: AbstractControl): ValidationErrors | null => {

    if (!control.value) {

      return null;
    }

    const tempElem = document.createElement('div');
    tempElem.style.color = control.value;

    return !tempElem.style.color ? { 'color' : { value: control.value } } : null;
  };
}
