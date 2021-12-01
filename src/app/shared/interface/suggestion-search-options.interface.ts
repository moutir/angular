import { SearchOptionsInterface } from './search-options.interface';
import { OptionInterface } from './option.interface';

export interface SuggestionSearchOptionsInterface extends SearchOptionsInterface {
  suggestionStatusIds: OptionInterface[];
  suggestionTagIds: OptionInterface[];
}
