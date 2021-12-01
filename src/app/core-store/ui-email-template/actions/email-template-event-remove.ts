import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class EmailTemplateEventRemove implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event remove';
  readonly type: string = EmailTemplateEventRemove.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    emailTemplateId: string;
  }) {

  }
}
