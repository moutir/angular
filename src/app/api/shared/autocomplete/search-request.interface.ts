import { ListTypeEnum } from '../../../shared/enum/list-type.enum';

export interface SearchRequestInterface {
  entities: string; // comma separated list of EntityEnum
  query: string;
  archived: number; // 0 no, 1 yes
  limit: number;
  type?: ListTypeEnum|string;
}
