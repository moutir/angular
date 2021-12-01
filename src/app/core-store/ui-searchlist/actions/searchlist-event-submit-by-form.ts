import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class SearchlistEventSubmitByForm implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event submit by form';
  readonly type: string = SearchlistEventSubmitByForm.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    uid: string;
  }) {

  }
}
