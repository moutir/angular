import { OptionInterface } from './option.interface';
import { SearchOptionsInterface } from './search-options.interface';
import { OptionGroupInterface } from './option-group.interface';

export interface PromotionSearchOptionsInterface extends SearchOptionsInterface {
  promotionIds: OptionInterface[];
  contactId: OptionInterface[];
  statusIds: OptionInterface[];
  agencyId: OptionInterface[];
  topLevelAgencyId: string[];
  customAttributeIds: OptionGroupInterface[];
}
