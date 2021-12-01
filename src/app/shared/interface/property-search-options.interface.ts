import { OptionInterface } from './option.interface';
import { SearchOptionsInterface } from './search-options.interface';
import { OptionGroupInterface } from './option-group.interface';

export interface PropertySearchOptionsInterface extends SearchOptionsInterface {
  type: OptionInterface[];
  categoryIds: OptionInterface[];
  prices: OptionInterface[];
  spaces: OptionInterface[];
  bedrooms: OptionInterface[];
  rooms: OptionInterface[];
  sectors: OptionInterface[];
  livingArea: OptionInterface[];
  landArea: OptionInterface[];
  positionIds: OptionInterface[];
  viewIds: OptionInterface[];
  brokerIds: OptionInterface[];
  statusIds: OptionInterface[];
  publicationIds: OptionGroupInterface[];
  rankingIds: OptionInterface[];
  agencyId: OptionInterface[];
  publicationStatusId: OptionInterface[];
  visibilityId: OptionInterface[];
  isDirectTransaction01: OptionInterface[];
  isPromotion01: OptionInterface[];
  isSellToForeigner01: OptionInterface[];
  topLevelAgencyId: string[];
  customAttributeIds: OptionGroupInterface[];
}
