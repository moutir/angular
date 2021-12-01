import { ReportGenerationModel } from '../model/report-generation.model';
import { LanguageEnum } from '../enum/language.enum';
import { ReportActionEnum } from '../enum/report-action.enum';
import { ReportTypeEnum } from '../enum/report-type.enum';

export interface ReportGenerationInterface {
  step: number;
  isLoading: boolean;
  action: ReportActionEnum;
  reportId: string;
  reportType: ReportTypeEnum;
  reportDateFrom: Date;
  reportDateTo: Date;
  brochureType: string;
  language: LanguageEnum;
  propertyId: string;
  contactId: string;
  model: ReportGenerationModel;
  isActionActivate: boolean;
}
