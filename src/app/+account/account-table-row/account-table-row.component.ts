import { Component, Input } from '@angular/core';

import { AccountModel } from '../../shared/model/account.model';
import { TableRowComponentAbstract } from '../../shared/component/table-row/table-row-component.abstract';
import { ModelAbstract } from '../../shared/class/model.abstract';

@Component({
  selector: 'app-account-table-row',
  templateUrl: './account-table-row.component.html',
  styleUrls: ['./account-table-row.component.scss'],
})
export class AccountTableRowComponent extends TableRowComponentAbstract {

  /**
   * Account to display
   */
  @Input() account: AccountModel = new AccountModel();

  /**
   * @inheritDoc
   */
  protected getModel(): ModelAbstract {

    return this.account;
  }
}
