import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Value is required if parent ID belongs to @parentIds
 */
export function requiredIfParentInArrayValidator(parentControl: AbstractControl, parentIds: string[]): ValidatorFn {

  return (control: AbstractControl): ValidationErrors | null => {

    const isRequired = parentIds.indexOf(parentControl.value) > -1;
    const isSet = typeof control.value === 'number' || (typeof control.value === 'string' && !!control.value);

    return isRequired && !isSet ? { 'requiredIfParentInArrayValidator': { value: control.value } } : null;
  };
}
