import { ListFiltersInterface } from '../interface/list-filters.interface';
import { ModelAbstract } from '../class/model.abstract';

export class LeadSearchModel extends ModelAbstract implements ListFiltersInterface {
  id: string = '';
  type: string|null = null;
  clientId: string|null = null;
  brokerId: string|null = null;
  dateFrom: Date|null = null;
  dateTo: Date|null = null;
  propertyId: string|null = null;
  statusIds: string[] = [];
  mainSourceId: string|null = null;
  subSourceId: string|null = null;
}
