import { Component } from '@angular/core';
import { TableHeaderComponentAbstract } from '../../shared/component/table-header/table-header-component.abstract';

@Component({
  selector: 'app-email-table-header',
  templateUrl: './email-table-header.component.html',
  styleUrls: ['./email-table-header.component.scss'],
})
export class EmailTableHeaderComponent extends TableHeaderComponentAbstract {

  /**
   * Constructor
   */
  constructor() {

    super();
  }
}
