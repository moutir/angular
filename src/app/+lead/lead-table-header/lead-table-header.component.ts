import { Component } from '@angular/core';

import { TableHeaderComponentAbstract } from '../../shared/component/table-header/table-header-component.abstract';

@Component({
  selector: 'app-lead-table-header',
  templateUrl: './lead-table-header.component.html',
  styleUrls: ['./lead-table-header.component.scss'],
})
export class LeadTableHeaderComponent extends TableHeaderComponentAbstract {

  /**
   * Constructor
   */
  constructor() {

    super();
  }
}
