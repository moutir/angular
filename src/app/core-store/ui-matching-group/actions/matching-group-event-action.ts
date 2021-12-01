import { FEATURE_NAME } from '../state';
import { MatchingGroupActionSelectionInterface } from '../../../shared/interface/matching-group-action-selection.interface';
import { ActionEventInterface } from '../../action-event.interface';

export class MatchingGroupEventAction implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event action';
  readonly type: string = MatchingGroupEventAction.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    uid: string;
    action: MatchingGroupActionSelectionInterface;
  }) {

  }
}
