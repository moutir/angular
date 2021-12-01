import { Component, Input } from '@angular/core';

import { RestrictionModel } from '../../shared/model/restriction.model';
import { TableRowComponentAbstract } from '../../shared/component/table-row/table-row-component.abstract';
import { ModelAbstract } from '../../shared/class/model.abstract';

@Component({
  selector: 'app-restriction-table-row',
  templateUrl: './restriction-table-row.component.html',
  styleUrls: ['./restriction-table-row.component.scss'],
})
export class RestrictionTableRowComponent extends TableRowComponentAbstract {

  /**
   * Restriction to display
   */
  @Input() restriction: RestrictionModel = new RestrictionModel();

  /**
   * @inheritDoc
   */
  protected getModel(): ModelAbstract {

    return this.restriction;
  }
}
