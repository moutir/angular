import { FEATURE_NAME } from '../state';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { ActionEventInterface } from '../../action-event.interface';

export class SearchlistEventPagination implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event pagination';
  readonly type: string = SearchlistEventPagination.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    uid: string;
    pagination: PaginationInterface;
  }) {

  }
}
