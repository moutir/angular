import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class MatchingGroupEventToggle implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event toggle';
  readonly type: string = MatchingGroupEventToggle.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    matchingGroupId: string;
    isUnfold: boolean;
  }) {

  }
}
