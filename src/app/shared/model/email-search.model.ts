import { ListFiltersInterface } from '../interface/list-filters.interface';
import { ModelAbstract } from '../class/model.abstract';

export class EmailSearchModel extends ModelAbstract implements ListFiltersInterface {
  id: string = '';
  subject: string|null = null;
  dateFrom: Date|null = null;
  dateTo: Date|null = null;
  attachmentTypeId: string|null = null;
  statusIds: string[] = [];
  contactIds: string[] = [];
  brokerIds: string[] = [];
  propertyIds: string[] = [];
  promotionIds: string[] = [];
  ids: string[] = [];
}
