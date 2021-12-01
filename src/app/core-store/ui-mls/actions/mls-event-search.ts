import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class MlsEventSearch implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event search';
  readonly type: string = MlsEventSearch.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    query: string;
  }) {

  }
}
