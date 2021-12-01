import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';
import { ContactTransferActivityInterface } from '../../../shared/interface/contact-transfer-activity.interface';

export class ContactEventTransferActivity implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event transfer activity';
  readonly type: string = ContactEventTransferActivity.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    transferActivity: ContactTransferActivityInterface;
  }) {

  }
}
