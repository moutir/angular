import { ModelAbstract } from '../class/model.abstract';
import { LanguageEnum } from '../enum/language.enum';

export class ReportGenerationModel extends ModelAbstract {
  id: string = '';
  attribute: string = '';
  broker: string = '1';
  clones: string = '';
  communications: string = '0';
  dateRange: string = 'last_week';
  startDate: Date|null = null;
  endDate: Date|null = null;
  frequency: string = 'weekly';
  informations: string = '1';
  language: LanguageEnum = LanguageEnum.en;
  leads: string = '0';
  marketingExpenses: string = '0';
  nextVisits: string = '0';
  offers: string = '0';
  pastVisits: string = '0';
  price: string = '1';
  reportSenderContactId: string = '';
  sending: string = '0';
  summary: string = '1';
  time: string = '0';
  isSchedulerEnabled: boolean = false;
  isHideIntermediaryTask: boolean = false;
  isAppliedToOthers: boolean = false;
}
