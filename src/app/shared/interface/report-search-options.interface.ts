import { SearchOptionsInterface } from './search-options.interface';
import { OptionInterface } from './option.interface';

export interface ReportSearchOptionsInterface extends SearchOptionsInterface {
  reportType: OptionInterface[];
  propertyIds: OptionInterface[];
  clientIds: OptionInterface[];
  brokerIds: OptionInterface[];
  dateFrom: OptionInterface[];
  dateTo: OptionInterface[];
  propertyTypeId: OptionInterface[];
  scheduleId: OptionInterface[];
}
