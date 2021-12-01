import { LanguageEnum } from '../enum/language.enum';
import { ReportModel } from '../model/report.model';
import { ReportTypeEnum } from '../enum/report-type.enum';

export interface ReportSendEmailInterface {
  reports: ReportModel[];
  language: LanguageEnum;
  type: ReportTypeEnum;
  dateFrom: Date;
  dateTo: Date;
  isMassAction: boolean;
}
