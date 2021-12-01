import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class CustomAttributeEventRemove implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event remove';
  readonly type: string = CustomAttributeEventRemove.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    id: string;
  }) {

  }
}
