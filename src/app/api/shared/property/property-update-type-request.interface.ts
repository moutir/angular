import { TypeEnum } from '../../../shared/enum/type.enum';

export interface PropertyUpdateTypeRequestInterface {
  items: string[]; // property IDs
  type: TypeEnum;
}
