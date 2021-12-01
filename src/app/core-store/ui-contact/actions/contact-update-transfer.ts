import { FEATURE_NAME, UiContactStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { ContactTransferInterface } from '../../../shared/interface/contact-transfer.interface';

export class ContactUpdateTransfer implements ActionUpdateInterface<UiContactStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update transfer';
  readonly type: string = ContactUpdateTransfer.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    transfer: ContactTransferInterface;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiContactStateInterface): UiContactStateInterface {

    return {
      ...state,
      transfer: {
        ...this.payload.transfer,
      },
    };
  }
}
