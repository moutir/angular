import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class SearchlistEventSubmitByTab implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event submit by tab';
  readonly type: string = SearchlistEventSubmitByTab.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    uid: string;
    inputName: string;
    optionIndex: number;
  }) {

  }
}
