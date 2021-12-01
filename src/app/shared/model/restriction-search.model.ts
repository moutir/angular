import { ListFiltersInterface } from '../interface/list-filters.interface';
import { ModelAbstract } from '../class/model.abstract';
import { EntityEnum } from '../enum/entity.enum';

export class RestrictionSearchModel extends ModelAbstract implements ListFiltersInterface {
  id: string = '';
  name: string|null = null;
  module: EntityEnum|null = null;
}
