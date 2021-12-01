import { ListFiltersInterface } from '../interface/list-filters.interface';
import { ModelAbstract } from '../class/model.abstract';

export class WebsiteArticleSearchModel extends ModelAbstract implements ListFiltersInterface {
  id: string = '';
}
