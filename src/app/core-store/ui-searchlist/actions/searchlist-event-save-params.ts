import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class SearchlistEventSaveParams implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event save params';
  readonly type: string = SearchlistEventSaveParams.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    uid: string;
  }) {

  }
}
