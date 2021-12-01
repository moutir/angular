import { SearchOptionsInterface } from './search-options.interface';
import { OptionInterface } from './option.interface';
import { OptionGroupInterface } from './option-group.interface';
import { OptionOfOptionsInterface } from './option-of-options.interface';

export interface ContactSearchOptionsInterface extends SearchOptionsInterface {
  mode: OptionInterface[];
  circle: OptionInterface[];
  typeIds: OptionOfOptionsInterface[];
  languageId: OptionInterface[];
  brokerIds: OptionInterface[];
  searchManagerIds: OptionInterface[];
  rankingIds: OptionInterface[];
  visibilityId: OptionInterface[];
  transactionId: OptionInterface[];
  bedrooms: OptionInterface[];
  rooms: OptionInterface[];
  area: OptionInterface[];
  positionIds: OptionInterface[];
  viewIds: OptionInterface[];
  searchConditionId: OptionInterface[];
  contactConditionIds: OptionInterface[];
  searchTypeId: OptionInterface[];
  lastContactId: OptionInterface[];
  originIds: OptionOfOptionsInterface[];
  categoryIds: OptionInterface[];
  prices: OptionGroupInterface[];
  isDirectClient01: OptionInterface[];
  isVip01: OptionInterface[];
  isInvalidEmail01: OptionInterface[];
  customAttributeIds: OptionGroupInterface[];
  brokerByAgency: OptionGroupInterface[];
  searchManagerByAgency: OptionGroupInterface[];
}
