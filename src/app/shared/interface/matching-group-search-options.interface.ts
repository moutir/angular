import { SearchOptionsInterface } from './search-options.interface';
import { OptionInterface } from './option.interface';
import { OptionGroupInterface } from './option-group.interface';

export interface MatchingGroupSearchOptionsInterface extends SearchOptionsInterface {
  matchingGroupEntity: OptionInterface[];
  matchingGroupType: OptionInterface[];
  brokerId: OptionGroupInterface[];
}
