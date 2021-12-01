import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class EmailEventListSender implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event list sender';
  readonly type: string = EmailEventListSender.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {}) {

  }
}
