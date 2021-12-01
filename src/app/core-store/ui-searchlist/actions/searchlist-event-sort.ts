import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';

export class SearchlistEventSort implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event sort';
  readonly type: string = SearchlistEventSort.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    uid: string;
    sort: SortInterface;
  }) {

  }
}
