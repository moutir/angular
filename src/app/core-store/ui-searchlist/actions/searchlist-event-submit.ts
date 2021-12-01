import { FEATURE_NAME } from '../state';
import { ListFiltersInterface } from '../../../shared/interface/list-filters.interface';
import { ActionEventInterface } from '../../action-event.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';

export class SearchlistEventSubmit implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event submit';
  readonly type: string = SearchlistEventSubmit.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    uid: string;
    filters: ListFiltersInterface;
    sort: SortInterface;
    pagination: PaginationInterface;
  }) {

  }
}
