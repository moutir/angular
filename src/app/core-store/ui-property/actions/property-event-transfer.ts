import { FEATURE_NAME } from '../state';
import { PropertyTransferInterface } from '../../../shared/interface/property-transfer.interface';
import { ActionEventInterface } from '../../action-event.interface';

export class PropertyEventTransfer implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event transfer';
  readonly type: string = PropertyEventTransfer.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    transfer: PropertyTransferInterface;
  }) {

  }
}
