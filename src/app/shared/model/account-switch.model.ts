import { ModelAbstract } from '../class/model.abstract';
import { FormArrayModelInterface } from '../interface/form-array-model.interface';
import { AccountModel } from './account.model';

export class AccountSwitchModel extends ModelAbstract implements FormArrayModelInterface {

  /**
   * @inheritDoc
   */
  readonly MODEL_ATTRIBUTES: string[] = [
    'account',
  ];

  id: string = '';
  account: AccountModel = new AccountModel();

  // UI usage
  isNew: boolean = false;
  isRemoved: boolean = false;

  /**
   * @inheritDoc
   */
  getOrder(): string {

    return [
      (this.isNew ? '1' : '0'),
      (this.id || '0').padStart(10, '0'),
    ].join(',');
  }
}
