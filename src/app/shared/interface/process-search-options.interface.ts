import { SearchOptionsInterface } from './search-options.interface';
import { OptionInterface } from './option.interface';

export interface ProcessSearchOptionsInterface extends SearchOptionsInterface {
  processStatusIds: OptionInterface[];
  processTypeIds: OptionInterface[];
}
