import { FEATURE_NAME, UiContactStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { ContactModifyBrokerInterface } from '../../../shared/interface/contact-modify-broker.interface';

export class ContactUpdateModifyBroker implements ActionUpdateInterface<UiContactStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update modify broker';
  readonly type: string = ContactUpdateModifyBroker.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    modifyBroker: ContactModifyBrokerInterface;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiContactStateInterface): UiContactStateInterface {

    return {
      ...state,
      modifyBroker: {
        ...this.payload.modifyBroker,
      },
    };
  }
}
