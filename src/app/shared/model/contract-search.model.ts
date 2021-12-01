import { ListFiltersInterface } from '../interface/list-filters.interface';
import { ModelAbstract } from '../class/model.abstract';

export class ContractSearchModel extends ModelAbstract implements ListFiltersInterface {
  id: string = '';
  contractReference: string|null = null;
  contractStepId: string|null = null;
  contactId: string|null = null;
  propertyId: string|null = null;
}
