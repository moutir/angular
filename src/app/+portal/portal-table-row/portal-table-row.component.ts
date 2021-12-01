import { Component, Input } from '@angular/core';

import { PortalModel } from '../../shared/model/portal.model';
import { TableRowComponentAbstract } from '../../shared/component/table-row/table-row-component.abstract';

@Component({
  selector: 'app-portal-table-row',
  templateUrl: './portal-table-row.component.html',
  styleUrls: ['./portal-table-row.component.scss'],
})
export class PortalTableRowComponent extends TableRowComponentAbstract {

  /**
   * MarketingExpense to display
   */
  @Input() portal: PortalModel = new PortalModel();

  /**
   * Row index number
   */
  @Input() rowIndex: number;

  /**
   * Constructor
   */
  constructor() {

    super();
  }

  /**
   * @inheritDoc
   */
  protected getModel(): PortalModel {

    return this.portal;
  }

}
