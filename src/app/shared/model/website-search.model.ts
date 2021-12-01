import { ListFiltersInterface } from '../interface/list-filters.interface';
import { ModelAbstract } from '../class/model.abstract';

export class WebsiteSearchModel extends ModelAbstract implements ListFiltersInterface {
  id: string = '';
  url: string|null = null;
  privateAPIKey: string|null = null;
  publicAPIKey: string|null = null;
}
