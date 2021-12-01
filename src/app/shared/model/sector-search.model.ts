import { ListFiltersInterface } from '../interface/list-filters.interface';
import { ModelAbstract } from '../class/model.abstract';

export class SectorSearchModel extends ModelAbstract implements ListFiltersInterface {
  id: string = '';
  name: string|null = null;
}
