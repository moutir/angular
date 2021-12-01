import { EntityEnum } from '../enum/entity.enum';
import { OptionInterface } from './option.interface';

export interface AutocompleteSuggestionInterface {
  entity: EntityEnum;
  options: OptionInterface[];
}
