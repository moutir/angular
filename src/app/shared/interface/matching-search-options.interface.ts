import { SearchOptionsInterface } from './search-options.interface';
import { OptionInterface } from './option.interface';
import { OptionGroupInterface } from './option-group.interface';

export interface MatchingSearchOptionsInterface extends SearchOptionsInterface {
  statusId: OptionInterface[];
  brokerId: OptionGroupInterface[];
  dateFrom: OptionInterface[];
  dateTo: OptionInterface[];
  propertyId: OptionInterface[];
  searchManagerIds: OptionInterface[];
}
