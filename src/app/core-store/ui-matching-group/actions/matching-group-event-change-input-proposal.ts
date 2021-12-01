import { FEATURE_NAME } from '../state';
import { InputFormInterface } from '../../../shared/interface/input-form.interface';
import { ActionEventInterface } from '../../action-event.interface';

export class MatchingGroupEventChangeInputProposal implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event change input proposal';
  readonly type: string = MatchingGroupEventChangeInputProposal.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    input: InputFormInterface;
  }) {

  }
}
