import { SearchOptionsInterface } from './search-options.interface';
import { OptionInterface } from './option.interface';

export interface ContractSearchOptionsInterface extends SearchOptionsInterface {
  step: OptionInterface[];
}
