import { ListFiltersInterface } from '../interface/list-filters.interface';
import { ModelAbstract } from '../class/model.abstract';

export class AccountSearchModel extends ModelAbstract implements ListFiltersInterface {
  accountTypeId: string|null = null;
  agencyId: string|null = null;
  login: string|null = null;
  contactId: string|null = null;
  isActive01: string|null = null;

  // Only supported by JsonAPI
  isAllowSendEmailOnBehalf: boolean|null = null;
}
