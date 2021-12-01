import { ListFiltersInterface } from '../interface/list-filters.interface';
import { ModelAbstract } from '../class/model.abstract';

export class MlsSearchModel extends ModelAbstract implements ListFiltersInterface {
  id: string = '';
  partnerAgencyId: string = '';
}
