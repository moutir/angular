import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class ContactEventExport implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event export';
  readonly type: string = ContactEventExport.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    contactIds: string[];
    mode: string;
  }) {

  }
}
