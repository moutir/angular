import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class ContactEventUnarchive implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event unarchive';
  readonly type: string = ContactEventUnarchive.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    contactIds: string[];
  }) {

  }
}
