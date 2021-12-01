import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { PhoneTypeEnum } from '../enum/phone-type.enum';

/**
 * Phone number validator
 */
export function phoneNumberValidator(type: PhoneTypeEnum = PhoneTypeEnum.landline): ValidatorFn {

  return (control: AbstractControl): ValidationErrors | null => {

    const regex = /^[0-9+\(\)#\.\s\/ext-]+$/;
    const errorName = ['phone_number', type === PhoneTypeEnum.mobile ? 'mobile' : 'landline'].join('_');

    return control.value && !regex.test(control.value) ? { [errorName] : { value: control.value } } : null;
  };
}
