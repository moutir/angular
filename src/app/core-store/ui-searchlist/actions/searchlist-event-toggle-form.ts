import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class SearchlistEventToggleForm implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event toggle form';
  readonly type: string = SearchlistEventToggleForm.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    uid: string;
  }) {

  }
}
