import { OptionInterface } from './option.interface';

export interface ReportGenerationOptionsInterface {
  hasBroker: OptionInterface[];
  hasInformation: OptionInterface[];
  hasPrice: OptionInterface[];
  hasLead: OptionInterface[];
  hasSummary: OptionInterface[];
  hasMarketingExpense: OptionInterface[];
  hasTimeEvolution: OptionInterface[];
  hasOffer: OptionInterface[];
  hasProposition: OptionInterface[];
  hasPastVisit: OptionInterface[];
  hasPlannedVisit: OptionInterface[];
  hasCommunication: OptionInterface[];
  frequency: OptionInterface[];
  dateRange: OptionInterface[];
}
