import { ActionEventInterface } from '../../action-event.interface';
import { FEATURE_NAME } from '../state';

export class EmailingEventSummaryClose implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event summary close';
  readonly type: string = EmailingEventSummaryClose.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {}) {

  }
}
