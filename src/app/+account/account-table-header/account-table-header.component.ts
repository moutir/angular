import { Component } from '@angular/core';
import { TableHeaderComponentAbstract } from '../../shared/component/table-header/table-header-component.abstract';

@Component({
  selector: 'app-account-table-header',
  templateUrl: './account-table-header.component.html',
  styleUrls: ['./account-table-header.component.scss'],
})
export class AccountTableHeaderComponent extends TableHeaderComponentAbstract {

  /**
   * Constructor
   */
  constructor() {

    super();
  }
}
