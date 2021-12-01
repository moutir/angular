import { Component, Input } from '@angular/core';

import { MlsModel } from '../../shared/model/mls.model';
import { TableRowComponentAbstract } from '../../shared/component/table-row/table-row-component.abstract';

@Component({
  selector: 'app-mls-table-row',
  templateUrl: './mls-table-row.component.html',
  styleUrls: ['./mls-table-row.component.scss'],
})
export class MlsTableRowComponent extends TableRowComponentAbstract {

  /**
   * MLS to display
   */
  @Input() mls: MlsModel = new MlsModel();

  /**
   * @inheritDoc
   */
  protected getModel(): MlsModel {

    return this.mls;
  }
}
