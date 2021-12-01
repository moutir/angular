import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class MatchingGroupEventProcess implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event process';
  readonly type: string = MatchingGroupEventProcess.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    uid: string;
  }) {

  }
}
