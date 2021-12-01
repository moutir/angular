import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';
import { LeadModifyStatusInterface } from '../../../shared/interface/lead-modify-status.interface';

export class LeadEventModifyStatus implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event modify status';
  readonly type: string = LeadEventModifyStatus.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    modifyStatus: LeadModifyStatusInterface;
  }) {

  }
}
