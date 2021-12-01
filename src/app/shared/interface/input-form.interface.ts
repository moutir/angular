import { ModelAbstract } from '../class/model.abstract';

export interface InputFormInterface {
  name: string;
  value: string|string[]|Date|ModelAbstract|ModelAbstract[]|Object;
  group?: string;
}
