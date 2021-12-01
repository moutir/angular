import { FEATURE_NAME, UiPropertyStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { PropertyTransferInterface } from '../../../shared/interface/property-transfer.interface';

export class PropertyUpdateTransfer implements ActionUpdateInterface<UiPropertyStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update transfer';
  readonly type: string = PropertyUpdateTransfer.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    transfer: PropertyTransferInterface;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiPropertyStateInterface): UiPropertyStateInterface {

    return {
      ...state,
      transfer: {
        ...this.payload.transfer,
      },
    };
  }
}
