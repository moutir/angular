import { Component } from '@angular/core';
import { TableHeaderComponentAbstract } from '../../shared/component/table-header/table-header-component.abstract';

@Component({
  selector: 'app-history-table-header',
  templateUrl: './history-table-header.component.html',
  styleUrls: ['./history-table-header.component.scss'],
})
export class HistoryTableHeaderComponent extends TableHeaderComponentAbstract {

  /**
   * Constructor
   */
  constructor() {

    super();
  }
}
