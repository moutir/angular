import { KeyValueType } from '../type/key-value.type';
import { GeneralErrorInterface } from './general-error.interface';

export interface ModelSaveInterface {
  modelError: KeyValueType<string, string|null>;
  generalError: GeneralErrorInterface[];
}
