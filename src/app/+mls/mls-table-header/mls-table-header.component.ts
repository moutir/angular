import { Component } from '@angular/core';

import { TableHeaderComponentAbstract } from '../../shared/component/table-header/table-header-component.abstract';

@Component({
  selector: 'app-mls-table-header',
  templateUrl: './mls-table-header.component.html',
  styleUrls: ['./mls-table-header.component.scss'],
})
export class MlsTableHeaderComponent extends TableHeaderComponentAbstract {

  /**
   * Constructor
   */
  constructor() {

    super();
  }
}
