import { ListFiltersInterface } from '../interface/list-filters.interface';
import { ModelAbstract } from '../class/model.abstract';

export class ReportingSearchModel extends ModelAbstract implements ListFiltersInterface {
  id: string = '';
  reportType: string|null = null;
  categoryIds: string[] = [];
  prices: string[] = [];
  bedrooms: string[] = [];
  rooms: string[] = [];
  livingArea: string[] = [];
  landArea: string[] = [];
  positionIds: string[] = [];
  viewIds: string[] = [];
  brokerIds: string[] = [];
  propertyStatusIds: string[] = [];
  promotionIds: string[] = [];
  publicationIds: string[] = [];
  propertyIds: string[] = [];
  rankingIds: string[] = [];
  contactId: string|null = null;
  publicationStatusId: string|null = null;
  visibilityId: string|null = null;
  processStatusIds: string[] = [];
  processDateFrom: Date|null = null;
  processDateTo: Date|null = null;

  // This are false-friend boolean values! The values are '0' / '1' instead of true / false
  isDirectTransaction01: string|null = null;
  isPromotion01: string|null = null;
  isSellToForeigner01: string|null = null;
}
