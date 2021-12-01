import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';
import { ListFiltersInterface } from '../../../shared/interface/list-filters.interface';

export class SearchlistEventCount implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event count';
  readonly type: string = SearchlistEventCount.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    uid: string;
    filters: ListFiltersInterface;
  }) {

  }
}
