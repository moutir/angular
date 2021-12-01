import { ListSelectionInterface } from './list-selection.interface';
import { ListFiltersInterface } from './list-filters.interface';
import { SearchlistSearchInterface } from './searchlist-search.interface';

export interface SearchlistInterface {

  // Selection of properties
  selection: ListSelectionInterface;

  // Search params
  search: SearchlistSearchInterface;

  // Form params
  form: ListFiltersInterface;

  // Total number of records (last displayed total)
  total: number;

  // Is the list loading ?
  isLoading: boolean;

  // Current operation
  operation: string;

  // Is the form in advanced mode ?
  isFormAdvanced: boolean;
}
