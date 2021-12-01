import { SearchOptionsInterface } from './search-options.interface';
import { OptionInterface } from './option.interface';

export interface EmailSearchOptionsInterface extends SearchOptionsInterface {
  subject: OptionInterface[];
  dateFrom: OptionInterface[];
  dateTo: OptionInterface[];
  attachmentTypeId: OptionInterface[];
  statusIds: OptionInterface[];
  contactIds: OptionInterface[];
  brokerIds: OptionInterface[];
  propertyIds: OptionInterface[];
  promotionIds: OptionInterface[];
}
