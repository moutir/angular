import { ListFiltersInterface } from '../interface/list-filters.interface';
import { ModelAbstract } from '../class/model.abstract';

export class ProcessSearchModel extends ModelAbstract implements ListFiltersInterface {
  id: string = '';
  statusId: string = '';
  typeId: string = '';
  agencyId: string = '';
}
