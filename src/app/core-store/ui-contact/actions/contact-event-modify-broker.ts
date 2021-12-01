import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';
import { ContactModifyBrokerInterface } from '../../../shared/interface/contact-modify-broker.interface';

export class ContactEventModifyBroker implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event modify broker';
  readonly type: string = ContactEventModifyBroker.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    modifyBroker: ContactModifyBrokerInterface;
  }) {

  }
}
