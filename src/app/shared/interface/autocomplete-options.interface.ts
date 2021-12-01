import { Dictionary } from '../../shared/class/dictionary';

import { OptionInterface } from './option.interface';

export interface AutocompleteOptionsInterface {
  property: Dictionary<OptionInterface>;
  promotion: Dictionary<OptionInterface>;
  contact: Dictionary<OptionInterface>;
  location: Dictionary<OptionInterface>;
  locationPath: Dictionary<OptionInterface>;
  reportContact: Dictionary<OptionInterface>;
  broker: Dictionary<OptionInterface>;
  mls: Dictionary<OptionInterface>;
  agency: Dictionary<OptionInterface>;
}
