import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class SearchlistEventOperation implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event operation';
  readonly type: string = SearchlistEventOperation.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    uid: string;
    operation: string;
    ids: string[];
  }) {

  }
}
