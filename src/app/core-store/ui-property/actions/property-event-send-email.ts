import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class PropertyEventSendEmail implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event send email';
  readonly type: string = PropertyEventSendEmail.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    propertyIds: string[];
  }) {

  }
}
