import { Component } from '@angular/core';
import { TableHeaderComponentAbstract } from '../../shared/component/table-header/table-header-component.abstract';

@Component({
  selector: 'app-restriction-table-header',
  templateUrl: './restriction-table-header.component.html',
  styleUrls: ['./restriction-table-header.component.scss'],
})
export class RestrictionTableHeaderComponent extends TableHeaderComponentAbstract {

  /**
   * Constructor
   */
  constructor() {

    super();
  }
}
