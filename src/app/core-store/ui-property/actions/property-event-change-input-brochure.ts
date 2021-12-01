import { FEATURE_NAME } from '../state';
import { InputFormInterface } from '../../../shared/interface/input-form.interface';
import { ActionEventInterface } from '../../action-event.interface';

export class PropertyEventChangeInputBrochure implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event input brochure';
  readonly type: string = PropertyEventChangeInputBrochure.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    input: InputFormInterface;
  }) {

  }
}
