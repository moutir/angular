import { EntityEnum } from '../enum/entity.enum';

export interface AutocompleteDataInterface {
  entity: EntityEnum;
  values: string[];
}
