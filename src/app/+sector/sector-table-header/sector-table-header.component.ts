import { Component } from '@angular/core';
import { TableHeaderComponentAbstract } from '../../shared/component/table-header/table-header-component.abstract';

@Component({
  selector: 'app-sector-table-header',
  templateUrl: './sector-table-header.component.html',
  styleUrls: ['./sector-table-header.component.scss'],
})
export class SectorTableHeaderComponent extends TableHeaderComponentAbstract {

  /**
   * Constructor
   */
  constructor() {

    super();
  }
}
