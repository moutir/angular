import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';
import { ContactModel } from '../../../shared/model/contact.model';
import { UploadModel } from '../../../shared/model/upload.model';

export class ContactEventSetAvatar implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event set avatar';
  readonly type: string = ContactEventSetAvatar.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    contact: ContactModel;
    upload: UploadModel;
  }) {

  }
}
