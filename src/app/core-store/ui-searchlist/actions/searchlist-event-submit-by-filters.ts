import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';
import { ListFiltersInterface } from '../../../shared/interface/list-filters.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';

export class SearchlistEventSubmitByFilters implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event submit by filters';
  readonly type: string = SearchlistEventSubmitByFilters.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    uid: string;
    filters: Partial<ListFiltersInterface>;
    sort: SortInterface;
    pagination: PaginationInterface;
  }) {

  }
}
