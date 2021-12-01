import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';
import { ReportActionEnum } from '../../../shared/enum/report-action.enum';
import { ReportTypeEnum } from '../../../shared/enum/report-type.enum';
import { LanguageEnum } from '../../../shared/enum/language.enum';

export class ReportEventGenerationOpen implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event generation open';
  readonly type: string = ReportEventGenerationOpen.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    action: ReportActionEnum;
    reportId: string;
    reportType: ReportTypeEnum;
    reportDateFrom: Date;
    reportDateTo: Date;
    brochureType: string;
    language: LanguageEnum;
  }) {

  }
}
