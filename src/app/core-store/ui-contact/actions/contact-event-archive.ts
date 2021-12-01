import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class ContactEventArchive implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event archive';
  readonly type: string = ContactEventArchive.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    contactIds: string[];
  }) {

  }
}
