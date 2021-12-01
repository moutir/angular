import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';

export class ReportingEventDownload implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event download';
  readonly type: string = ReportingEventDownload.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    url: string;
  }) {

  }
}
