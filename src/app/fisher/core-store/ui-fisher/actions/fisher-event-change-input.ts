import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../../../core-store/action-event.interface';
import { InputFormInterface } from '../../../../shared/interface/input-form.interface';

export class FisherEventChangeInput implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event change input';
  readonly type: string = FisherEventChangeInput.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    input: InputFormInterface;
  }) {

  }
}
