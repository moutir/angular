import { ActionEventInterface } from '../../action-event.interface';
import { FEATURE_NAME } from '../state';

export class EmailingEventSend implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event send';
  readonly type: string = EmailingEventSend.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {}) {

  }
}
