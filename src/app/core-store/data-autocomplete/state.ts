import { AutocompleteOptionsInterface } from '../../shared/interface/autocomplete-options.interface';
import { AutocompleteDataInterface } from '../../shared/interface/autocomplete-data.interface';

export const FEATURE_NAME = 'data-autocomplete';

export interface DataAutocompleteStateInterface {
  suggestions: {
    [hash: string]: AutocompleteDataInterface[];
  };
  options: AutocompleteOptionsInterface;
}

export const initialState: DataAutocompleteStateInterface = {
  suggestions: {},
  options: {
    property: {},
    promotion: {},
    contact: {},
    location: {},
    locationPath: {},
    reportContact: {},
    broker: {},
    mls: {},
    agency: {},
  },
};
