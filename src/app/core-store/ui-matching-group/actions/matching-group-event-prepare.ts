import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class MatchingGroupEventPrepare implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event prepare';
  readonly type: string = MatchingGroupEventPrepare.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    uid: string;
  }) {

  }
}
