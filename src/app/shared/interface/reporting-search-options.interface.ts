import { SearchOptionsInterface } from './search-options.interface';
import { OptionGroupInterface } from './option-group.interface';
import { OptionInterface } from './option.interface';

export interface ReportingSearchOptionsInterface extends SearchOptionsInterface {
  reportType: OptionInterface[];
  categoryIds: OptionInterface[];
  prices: OptionInterface[];
  bedrooms: OptionInterface[];
  rooms: OptionInterface[];
  livingArea: OptionInterface[];
  landArea: OptionInterface[];
  positionIds: OptionInterface[];
  viewIds: OptionInterface[];
  brokerIds: OptionInterface[];
  propertyStatusIds: OptionInterface[];
  publicationIds: OptionGroupInterface[];
  rankingIds: OptionInterface[];
  publicationStatusId: OptionInterface[];
  visibilityId: OptionInterface[];
  isDirectTransaction01: OptionInterface[];
  isPromotion01: OptionInterface[];
  isSellToForeigner01: OptionInterface[];
  processStatusIds: OptionInterface[];
  processDateFrom: OptionInterface[];
  processDateTo: OptionInterface[];
}
