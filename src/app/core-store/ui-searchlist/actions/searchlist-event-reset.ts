import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class SearchlistEventReset implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event reset';
  readonly type: string = SearchlistEventReset.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    uid: string;
  }) {

  }
}
