import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';
import { ContactModel } from '../../../shared/model/contact.model';

export class ContactEventRemoveAvatar implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event remove avatar';
  readonly type: string = ContactEventRemoveAvatar.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    contact: ContactModel;
  }) {

  }
}
