import { ListFiltersInterface } from '../interface/list-filters.interface';
import { ListTypeEnum } from '../enum/list-type.enum';
import { ModelAbstract } from '../class/model.abstract';
import { GeolocPolygonInterface } from '../interface/geoloc-polygon.interface';

export class PropertySearchModel extends ModelAbstract implements ListFiltersInterface {
  id: string = '';
  type: ListTypeEnum|null = null;
  categoryIds: string[] = [];
  prices: string[] = [];
  bedrooms: string[] = [];
  rooms: string[] = [];
  livingArea: string[] = [];
  landArea: string[] = [];
  positionIds: string[] = [];
  viewIds: string[] = [];
  brokerIds: string[] = [];
  statusIds: string[] = [];
  promotionIds: string[] = [];
  publicationIds: string[] = [];
  propertyIds: string[] = []; // TODO[nico] Split propertyIds and locationIds, regroup it only in API since it's a BE weirdlogic
  rankingIds: string[] = [];
  contactId: string|null = null;
  agencyId: string|null = null;
  publicationStatusId: string|null = null;
  visibilityId: string|null = null;
  customAttributeIds: string[] = [];
  spaces: string[] = [];
  sectors: string[] = [];
  ids: string[] = [];
  polygons: GeolocPolygonInterface[] = [];

  // This are false-friend boolean values! The values are '0' / '1' instead of true / false
  isDirectTransaction01: string|null = null;
  isPromotion01: string|null = null;
  isSellToForeigner01: string|null = null;
  isArchive01: string|null = null;
}
