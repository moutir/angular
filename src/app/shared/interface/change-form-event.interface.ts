import { InputFormInterface } from './input-form.interface';
import { ModelAbstract } from '../class/model.abstract';

export interface ChangeFormEventInterface<Model extends ModelAbstract> {
  input: InputFormInterface;
  model: Model;
}
