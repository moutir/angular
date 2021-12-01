import { Component } from '@angular/core';
import { TableHeaderComponentAbstract } from '../../shared/component/table-header/table-header-component.abstract';

@Component({
  selector: 'app-reporting-table-header',
  templateUrl: './reporting-table-header.component.html',
  styleUrls: ['./reporting-table-header.component.scss'],
})
export class ReportingTableHeaderComponent extends TableHeaderComponentAbstract {

  /**
   * Constructor
   */
  constructor() {

    super();
  }
}
