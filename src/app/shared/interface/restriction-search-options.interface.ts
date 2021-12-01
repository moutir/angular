import { SearchOptionsInterface } from './search-options.interface';
import { OptionInterface } from './option.interface';

export interface RestrictionSearchOptionsInterface extends SearchOptionsInterface {
  module: OptionInterface[];
}
