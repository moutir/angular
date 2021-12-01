import { SearchOptionsInterface } from './search-options.interface';
import { OptionInterface } from './option.interface';

export interface TaskSearchOptionsInterface extends SearchOptionsInterface {
  typeId: OptionInterface[];
  dateFrom: OptionInterface[];
  dateTo: OptionInterface[];
  clientIds: OptionInterface[];
  brokerIds: OptionInterface[];
  propertyIds: OptionInterface[];
  promotionIds: OptionInterface[];
  statusId: OptionInterface[];
}
