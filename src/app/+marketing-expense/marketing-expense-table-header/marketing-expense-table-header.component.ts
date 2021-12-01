import { Component } from '@angular/core';

import { TableHeaderComponentAbstract } from '../../shared/component/table-header/table-header-component.abstract';

@Component({
  selector: 'app-marketing-expense-table-header',
  templateUrl: './marketing-expense-table-header.component.html',
  styleUrls: ['./marketing-expense-table-header.component.scss'],
})
export class MarketingExpenseTableHeaderComponent extends TableHeaderComponentAbstract {

  /**
   * Constructor
   */
  constructor() {

    super();
  }
}
