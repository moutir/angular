import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class LeadEventLoadValidation implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event load validation';
  readonly type: string = LeadEventLoadValidation.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    id: string;
  }) {

  }
}
