import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class ReportingEventReject implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event reject';
  readonly type: string = ReportingEventReject.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    reportIds: string[];
  }) {

  }
}
