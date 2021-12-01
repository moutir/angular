import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class SearchlistEventSubmitBySearch implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event submit by search';
  readonly type: string = SearchlistEventSubmitBySearch.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    uid: string;
  }) {

  }
}
