import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class LayoutEventSearch implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event search';
  readonly type: string = LayoutEventSearch.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    query: string;
  }) {

  }
}
