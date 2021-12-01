import { ListFiltersInterface } from '../interface/list-filters.interface';
import { ModelAbstract } from '../class/model.abstract';

export class TaskSearchModel extends ModelAbstract implements ListFiltersInterface {
  id: string = '';
  type: string|null = null;
  dateFrom: Date|null = null;
  dateTo: Date|null = null;
  clientIds: string[] = [];
  brokerIds: string[] = [];
  propertyIds: string[] = [];
  promotionIds: string[] = [];
  statusId: string|null = null;
}
