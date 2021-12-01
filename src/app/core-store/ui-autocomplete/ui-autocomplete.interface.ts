import { AutocompleteSearchInterface } from '../../shared/interface/autocomplete-search.interface';

export interface UiAutocompleteInterface {

  // Autocomplete hash (entities + query)
  hash: string;

  // Search params
  search: AutocompleteSearchInterface;

  // Is the autocomplete loading ?
  isLoading: boolean;
}
