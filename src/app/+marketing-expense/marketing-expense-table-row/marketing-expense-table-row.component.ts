import { Component, Input } from '@angular/core';

import { MarketingExpenseModel } from '../../shared/model/marketing-expense.model';
import { TableRowComponentAbstract } from '../../shared/component/table-row/table-row-component.abstract';
import { ModelAbstract } from '../../shared/class/model.abstract';

@Component({
  selector: 'app-marketing-expense-table-row',
  templateUrl: './marketing-expense-table-row.component.html',
  styleUrls: ['./marketing-expense-table-row.component.scss'],
})
export class MarketingExpenseTableRowComponent extends TableRowComponentAbstract {

  /**
   * MarketingExpense to display
   */
  @Input() expense: MarketingExpenseModel = new MarketingExpenseModel();

  /**
   * Constructor
   */
  constructor() {

    super();
  }

  /**
   * @inheritDoc
   */
  protected getModel(): ModelAbstract {

    return this.expense;
  }
}
