import { EntityEnum } from '../enum/entity.enum';

export interface AutocompleteSelectionInterface {
  entity?: EntityEnum;
  id: string;
  text?: string;
}
