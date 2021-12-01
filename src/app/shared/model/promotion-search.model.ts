import { ListFiltersInterface } from '../interface/list-filters.interface';
import { ModelAbstract } from '../class/model.abstract';

export class PromotionSearchModel extends ModelAbstract implements ListFiltersInterface {
  id: string = '';
  promotionIds: string[] = [];
  contactId: string|null = null;
  statusIds: string[] = [];
  agencyId: string|null = null;
  isArchive01: string|null = null;
  customAttributeIds: string[] = [];
}
