import { SearchOptionsInterface } from './search-options.interface';
import { OptionInterface } from './option.interface';

export interface LeadSearchOptionsInterface extends SearchOptionsInterface {
  typeId: OptionInterface[];
  dateFrom: OptionInterface[];
  dateTo: OptionInterface[];
  clientId: OptionInterface[];
  brokerId: OptionInterface[];
  propertyId: OptionInterface[];
  statusIds: OptionInterface[];
  mainSourceId: OptionInterface[];
  subSourceId: OptionInterface[];
}
