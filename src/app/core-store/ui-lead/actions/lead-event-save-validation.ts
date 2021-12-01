import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class LeadEventSaveValidation implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event save validation';
  readonly type: string = LeadEventSaveValidation.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {}) {

  }
}
