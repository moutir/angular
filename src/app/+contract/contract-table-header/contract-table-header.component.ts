import { Component } from '@angular/core';

import { TableHeaderComponentAbstract } from '../../shared/component/table-header/table-header-component.abstract';

@Component({
  selector: 'app-contract-table-header',
  templateUrl: './contract-table-header.component.html',
  styleUrls: ['./contract-table-header.component.scss'],
})
export class ContractTableHeaderComponent extends TableHeaderComponentAbstract {

  /**
   * Constructor
   */
  constructor() {

    super();
  }
}
