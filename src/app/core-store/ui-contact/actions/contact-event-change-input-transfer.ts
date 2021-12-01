import { FEATURE_NAME } from '../state';
import { InputFormInterface } from '../../../shared/interface/input-form.interface';
import { ActionEventInterface } from '../../action-event.interface';

export class ContactEventChangeInputTransfer implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event input transfer';
  readonly type: string = ContactEventChangeInputTransfer.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    input: InputFormInterface;
  }) {

  }
}
