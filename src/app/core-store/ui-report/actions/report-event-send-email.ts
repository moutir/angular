import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';
import { ReportSendEmailInterface } from '../../../shared/interface/report-send-email.interface';

export class ReportEventSendEmail implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event send email';
  readonly type: string = ReportEventSendEmail.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    sendEmail: ReportSendEmailInterface;
  }) {

  }
}
