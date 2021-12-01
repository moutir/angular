import { FEATURE_NAME } from '../../data-contact/state';
import { ActionEventInterface } from '../../action-event.interface';
import { ContactModel } from '../../../shared/model/contact.model';

export class ContactEventChangeRanking implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event change ranking';
  readonly type: string = ContactEventChangeRanking.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    contact: ContactModel;
    ranking: number;
  }) {

  }
}
