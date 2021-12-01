import { ListFiltersInterface } from '../interface/list-filters.interface';
import { ModelAbstract } from '../class/model.abstract';

export class CustomAttributeSearchModel extends ModelAbstract implements ListFiltersInterface {
  id: string = '';
  name: string|null = null;
}
