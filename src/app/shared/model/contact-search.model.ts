import { ListFiltersInterface } from '../interface/list-filters.interface';
import { ModelAbstract } from '../class/model.abstract';
import { ListTypeEnum } from '../enum/list-type.enum';

export class ContactSearchModel extends ModelAbstract implements ListFiltersInterface {
  id: string = '';
  mode: ListTypeEnum|null = null;
  circle: string|null = null;
  contactIds: string[] = [];
  typeIds: string[] = [];
  contactId: string|null = null;
  propertyIds: string[] = [];
  locationIds: string[] = [];
  languageId: string|null = null;
  brokerIds: string[] = [];
  searchManagerIds: string[] = [];
  rankingIds: string[] = [];
  visibilityId: string|null = null;
  transactionId: string|null = null;
  bedrooms: string|null = null;
  rooms: string|null = null;
  area: string[] = [];
  positionIds: string[] = [];
  viewIds: string[] = [];
  searchConditionId: string|null = null;
  contactConditionIds: string[] = [];
  searchTypeId: string|null = null;
  lastContactId: string|null = null;
  originIds: string[] = [];
  categoryIds: string[] = [];
  prices: string[] = [];
  contactTextSearch: string|null = null;
  propertyTextSearch: string|null = null;
  customAttributeIds: string[] = [];
  locationPath: string|null = null;
  bedroomMin: string|null = null;
  bedroomMax: string|null = null;
  roomMin: string|null = null;
  roomMax: string|null = null;
  priceMin: string|null = null;
  priceMax: string|null = null;
  areaMin: string|null = null;
  areaMax: string|null = null;

  // This are false-friend boolean values! The values are '0' / '1' instead of true / false
  isArchive01: string|null = null;
  isDirectClient01: string|null = null;
  isVip01: string|null = null;
  isInvalidEmail01: string|null = null;
}
