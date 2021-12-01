import { ListTypeEnum } from '../enum/list-type.enum';
import { EntityEnum } from '../enum/entity.enum';

export interface AutocompleteSearchInterface {
  entities: EntityEnum[];
  query: string;
  archived: boolean;
  limit: number;
  type?: ListTypeEnum|string;
}
