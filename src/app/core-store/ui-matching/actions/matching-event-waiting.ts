import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class MatchingEventWaiting implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event waiting';
  readonly type: string = MatchingEventWaiting.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    matchingIds: string[];
  }) {

  }
}
