import { Component } from '@angular/core';

import { TableHeaderComponentAbstract } from '../../shared/component/table-header/table-header-component.abstract';

@Component({
  selector: 'app-task-table-header',
  templateUrl: './task-table-header.component.html',
  styleUrls: ['./task-table-header.component.scss'],
})
export class TaskTableHeaderComponent extends TableHeaderComponentAbstract {

  /**
   * Constructor
   */
  constructor() {

    super();
  }
}
