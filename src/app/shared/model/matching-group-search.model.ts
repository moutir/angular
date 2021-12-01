import { ListFiltersInterface } from '../interface/list-filters.interface';
import { ModelAbstract } from '../class/model.abstract';

export class MatchingGroupSearchModel extends ModelAbstract implements ListFiltersInterface {
  id: string = '';
  matchingGroupEntity: string|null = null;
  matchingGroupType: string|null = null;
  propertyId: string|null = null;
  promotionId: string|null = null;
  contactId: string|null = null;
  propertyBrokerId: string|null = null;
  contactBrokerId: string|null = null;
  contactSearchBrokerId: string|null = null;
}
