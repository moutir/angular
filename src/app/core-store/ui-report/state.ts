import { ReportBrochureMenuInterface } from '../../shared/interface/report-brochure-menu.interface';
import { ReportGenerationInterface } from '../../shared/interface/report-generation.interface';
import { LanguageEnum } from '../../shared/enum/language.enum';
import { ReportSendEmailInterface } from '../../shared/interface/report-send-email.interface';
import { ReportGenerationModel } from '../../shared/model/report-generation.model';

export const FEATURE_NAME = 'ui-report';

export interface UiReportStateInterface {

  // Brochure menu state
  brochureMenu: ReportBrochureMenuInterface;

  // Report generation state
  generation: ReportGenerationInterface;

  // Report send email state
  sendEmail: ReportSendEmailInterface;
}

export const initialState: UiReportStateInterface = {
  brochureMenu: {
    reportId: '',
    position: {
      x: 0,
      y: 0,
    },
  },
  generation: {
    step: 0,
    isLoading: false,
    action: null,
    reportId: '',
    reportType: null,
    reportDateFrom: null,
    reportDateTo: null,
    brochureType: '',
    language: LanguageEnum.en,
    propertyId: '',
    contactId: '',
    isActionActivate: false,
    model: new ReportGenerationModel(),
  },
  sendEmail: {
    reports: [],
    language: LanguageEnum.en,
    type: null,
    dateFrom: null,
    dateTo: null,
    isMassAction: false,
  },
};
