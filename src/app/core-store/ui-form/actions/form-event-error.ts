import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class FormEventError implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event error';
  readonly type: string = FormEventError.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    uid: string;
    name: string;
    error: string;
  }) {

  }
}
