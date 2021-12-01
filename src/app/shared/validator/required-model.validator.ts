import { AbstractControl, ValidationErrors } from '@angular/forms';

import { ModelAbstract } from '../class/model.abstract';

/**
 * Required Model validator
 */
export function requiredModelValidator(control: AbstractControl): ValidationErrors|null {

  if (!control.value || !(control.value instanceof ModelAbstract) || !control.value.id) {

    return { 'requiredModelValidator': { value: control.value } };
  }

  return null;
}
