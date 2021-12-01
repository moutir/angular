import { ListFiltersInterface } from '../interface/list-filters.interface';
import { ModelAbstract } from '../class/model.abstract';

export class SuggestionSearchModel extends ModelAbstract implements ListFiltersInterface {
  id: string = '';
  statusIds: string[] = [];
  tagIds: string[] = [];
}
