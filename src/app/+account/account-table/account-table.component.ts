import { Component } from '@angular/core';

import { TableComponentAbstract } from '../../shared/component/table/table-component.abstract';
import { AccountModel } from '../../shared/model/account.model';

@Component({
  selector: 'app-account-table',
  templateUrl: './account-table.component.html',
  styleUrls: ['./account-table.component.scss'],
})
export class AccountTableComponent extends TableComponentAbstract<AccountModel> {

}
