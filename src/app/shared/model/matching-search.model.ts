import { ListFiltersInterface } from '../interface/list-filters.interface';
import { ModelAbstract } from '../class/model.abstract';

export class MatchingSearchModel extends ModelAbstract implements ListFiltersInterface {
  id: string = '';
  propertyId: string|null = null;
  contactId: string = null;
  searchManagerIds: string[] = [];
  statusId: string = null;
  dateFrom: Date = null;
  dateTo: Date = null;
  propertyBrokerId: string = null;
  contactBrokerId: string = null;
}
