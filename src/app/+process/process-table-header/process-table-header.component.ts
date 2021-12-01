import { Component } from '@angular/core';
import { TableHeaderComponentAbstract } from '../../shared/component/table-header/table-header-component.abstract';

@Component({
  selector: 'app-process-table-header',
  templateUrl: './process-table-header.component.html',
  styleUrls: ['./process-table-header.component.scss'],
})
export class ProcessTableHeaderComponent extends TableHeaderComponentAbstract {

  /**
   * Constructor
   */
  constructor() {

    super();
  }
}
