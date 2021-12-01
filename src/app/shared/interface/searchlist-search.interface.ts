import { ListFiltersInterface } from './list-filters.interface';
import { SortInterface } from './sort.interface';
import { PaginationInterface } from './pagination.interface';

export interface SearchlistSearchInterface {
  filters: ListFiltersInterface;
  sort: SortInterface;
  pagination: PaginationInterface;
}
