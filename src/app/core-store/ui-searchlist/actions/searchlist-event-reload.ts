import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class SearchlistEventReload implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event reload';
  readonly type: string = SearchlistEventReload.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    uid: string;
  }) {

  }
}
