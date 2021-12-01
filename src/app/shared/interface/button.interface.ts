import { ButtonTypeEnum } from '../enum/button-type.enum';

export interface ButtonInterface {
  type: ButtonTypeEnum;
  icon: string;
  label: string;
  color: string;
}
