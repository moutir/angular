import { FEATURE_NAME } from '../state';
import { ContactTransferInterface } from '../../../shared/interface/contact-transfer.interface';
import { ActionEventInterface } from '../../action-event.interface';

export class ContactEventTransfer implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event transfer';
  readonly type: string = ContactEventTransfer.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    transfer: ContactTransferInterface;
  }) {

  }
}
