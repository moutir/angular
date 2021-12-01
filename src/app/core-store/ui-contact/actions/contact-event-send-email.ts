import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class ContactEventSendEmail implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event send email';
  readonly type: string = ContactEventSendEmail.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    contactIds: string[];
  }) {

  }
}
