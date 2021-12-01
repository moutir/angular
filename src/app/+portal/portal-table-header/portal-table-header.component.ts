import { Component } from '@angular/core';

import { TableHeaderComponentAbstract } from '../../shared/component/table-header/table-header-component.abstract';

@Component({
  selector: 'app-portal-table-header',
  templateUrl: './portal-table-header.component.html',
  styleUrls: ['./portal-table-header.component.scss'],
})
export class PortalTableHeaderComponent extends TableHeaderComponentAbstract {

  /**
   * Constructor
   */
  constructor() {

    super();
  }
}
