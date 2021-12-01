import { ValidatorFn } from '@angular/forms';
import { KeyValueType } from '../type/key-value.type';

export interface FormControlConfigInterface {
  value: Object|Object[];
  validators: ValidatorFn[];
  updateOn?: 'change'|'blur'|'submit';
  formArrayConfig?: KeyValueType<string, FormControlConfigInterface>;
}
