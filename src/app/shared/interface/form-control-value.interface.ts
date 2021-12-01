import { ModelAbstract } from '../class/model.abstract';

export interface FormControlValueInterface {
  [key: string]: string|number|boolean|Date|ModelAbstract|FormControlValueInterface
                 |string[]|number[]|boolean[]|Date[]|ModelAbstract[]|FormControlValueInterface[];
}
