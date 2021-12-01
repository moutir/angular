import { ActionEventInterface } from '../../action-event.interface';
import { FEATURE_NAME } from '../state';
import { ContactModel } from '../../../shared/model/contact.model';

export class ContactEventChangeAvatar implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event change avatar';
  readonly type: string = ContactEventChangeAvatar.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    contact: ContactModel;
  }) {

  }
}
