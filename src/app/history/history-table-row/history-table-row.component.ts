import { Component, Input } from '@angular/core';

import { HistoryModel } from '../../shared/model/history.model';
import { TableRowComponentAbstract } from '../../shared/component/table-row/table-row-component.abstract';
import { ModelAbstract } from '../../shared/class/model.abstract';
import { ContactTypeEnum } from '../../shared/enum/contact-type.enum';

@Component({
  selector: 'app-history-table-row',
  templateUrl: './history-table-row.component.html',
  styleUrls: ['./history-table-row.component.scss'],
})
export class HistoryTableRowComponent extends TableRowComponentAbstract {

  /**
   * History to display
   */
  @Input() history: HistoryModel = new HistoryModel();

  /**
   * Contact types
   */
  contactTypeColleague: ContactTypeEnum = ContactTypeEnum.colleague;

  /**
   * @inheritDoc
   */
  protected getModel(): ModelAbstract {

    return this.history;
  }
}
