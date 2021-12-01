import { FEATURE_NAME, UiReportStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { ReportSendEmailInterface } from '../../../shared/interface/report-send-email.interface';

export class ReportUpdateSendEmail implements ActionUpdateInterface<UiReportStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update send email';
  readonly type: string = ReportUpdateSendEmail.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    sendEmail: ReportSendEmailInterface;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiReportStateInterface): UiReportStateInterface {

    return {
      ...state,
      sendEmail: {
        ...state.sendEmail,
        ...this.payload.sendEmail,
      },
    };
  }
}
