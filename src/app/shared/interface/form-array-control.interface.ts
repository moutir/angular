import { FormArray, FormControl, FormGroup } from '@angular/forms';

/**
 * @deprecated
 */
export interface FormArrayControlInterface {
  index: number;
  formArray: FormArray;
  formArrayPath: string;
  control: FormControl|FormGroup;
  isPristine: boolean;
}
