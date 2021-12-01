import { FEATURE_NAME, UiContactStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { ContactTransferActivityInterface } from '../../../shared/interface/contact-transfer-activity.interface';

export class ContactUpdateTransferActivity implements ActionUpdateInterface<UiContactStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update transfer activity';
  readonly type: string = ContactUpdateTransferActivity.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    transferActivity: ContactTransferActivityInterface;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiContactStateInterface): UiContactStateInterface {

    return {
      ...state,
      transferActivity: {
        ...this.payload.transferActivity,
      },
    };
  }
}
