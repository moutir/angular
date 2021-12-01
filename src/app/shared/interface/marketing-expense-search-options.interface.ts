import { SearchOptionsInterface } from './search-options.interface';
import { OptionInterface } from './option.interface';

export interface MarketingExpenseSearchOptionsInterface extends SearchOptionsInterface {
  dateFrom: OptionInterface[];
  dateTo: OptionInterface[];
  category: OptionInterface[];
  propertyId: OptionInterface[];
  promotionId: OptionInterface[];
}
