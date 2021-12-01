import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class ReportingEventAccept implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event accept';
  readonly type: string = ReportingEventAccept.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    reportIds: string[];
  }) {

  }
}
