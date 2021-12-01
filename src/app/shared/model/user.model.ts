import { ModelAbstract } from '../class/model.abstract';
import { EntityEnum } from '../enum/entity.enum';
import { AccountModel } from './account.model';

/**
 * Authenticated user
 */
export class UserModel extends ModelAbstract {

  /**
   * @inheritDoc
   */
  readonly MODEL_ATTRIBUTES: string[] = [
    'account',
  ];

  /**
   * Account representing the user
   */
  account: AccountModel = new AccountModel();

  /**
   * Constructor
   */
  constructor() {

    super();

    this.account.contact.entity = EntityEnum.user;
  }
}
