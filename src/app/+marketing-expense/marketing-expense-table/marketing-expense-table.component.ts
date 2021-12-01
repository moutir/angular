import { Component } from '@angular/core';

import { TableComponentAbstract } from '../../shared/component/table/table-component.abstract';
import { MarketingExpenseModel } from '../../shared/model/marketing-expense.model';

@Component({
  selector: 'app-marketing-expense-table',
  templateUrl: './marketing-expense-table.component.html',
})
export class MarketingExpenseTableComponent extends TableComponentAbstract<MarketingExpenseModel> {

}
