import { Component, Input } from '@angular/core';

import { ProcessModel } from '../../shared/model/process.model';
import { TableRowComponentAbstract } from '../../shared/component/table-row/table-row-component.abstract';
import { ModelAbstract } from '../../shared/class/model.abstract';

@Component({
  selector: 'app-process-table-row',
  templateUrl: './process-table-row.component.html',
  styleUrls: ['./process-table-row.component.scss'],
})
export class ProcessTableRowComponent extends TableRowComponentAbstract {

  /**
   * Process to display
   */
  @Input() process: ProcessModel = new ProcessModel();

  /**
   * @inheritDoc
   */
  protected getModel(): ModelAbstract {

    return this.process;
  }
}
