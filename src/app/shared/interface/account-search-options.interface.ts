import { SearchOptionsInterface } from './search-options.interface';
import { OptionInterface } from './option.interface';

export interface AccountSearchOptionsInterface extends SearchOptionsInterface {
  accountTypeId: OptionInterface[];
  agencyId: OptionInterface[];
  isActive01: OptionInterface[];
}
