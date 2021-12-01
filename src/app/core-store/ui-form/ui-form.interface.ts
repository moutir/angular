import { KeyValueType } from '../../shared/type/key-value.type';
import { GeneralErrorInterface } from '../../shared/interface/general-error.interface';

export interface UiFormInterface {

  /**
   * Dictionary of error message per model attribute name
   */
  modelError: KeyValueType<string, string|null>;

  /**
   * Array of general/unmapped errors
   */
  generalError: GeneralErrorInterface[];
}
