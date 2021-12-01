import { FEATURE_NAME } from '../state';
import { InputFormInterface } from '../../../shared/interface/input-form.interface';
import { ActionEventInterface } from '../../action-event.interface';

export class PropertyEventChangeInputTransfer implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event input transfer';
  readonly type: string = PropertyEventChangeInputTransfer.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    input: InputFormInterface;
  }) {

  }
}
