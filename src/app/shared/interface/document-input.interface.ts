import { InputType } from '../type/input.type';

export interface DocumentInputInterface {
  name: string;
  type: InputType;
  label: string;
  default: string|boolean;
  icon?: string;
  options?: string;
}
