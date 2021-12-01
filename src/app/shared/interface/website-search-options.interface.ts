import { SearchOptionsInterface } from './search-options.interface';
import { OptionInterface } from './option.interface';

export interface WebsiteSearchOptionsInterface extends SearchOptionsInterface {
  urls: OptionInterface[];
  privateAPIKeys: OptionInterface[];
  publicAPIKeys: OptionInterface[];
}
