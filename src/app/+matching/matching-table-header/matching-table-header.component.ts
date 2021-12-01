import { Component } from '@angular/core';
import { TableHeaderComponentAbstract } from '../../shared/component/table-header/table-header-component.abstract';

@Component({
  selector: 'app-matching-table-header',
  templateUrl: './matching-table-header.component.html',
  styleUrls: ['./matching-table-header.component.scss'],
})
export class MatchingTableHeaderComponent extends TableHeaderComponentAbstract {

  /**
   * Constructor
   */
  constructor() {

    super();
  }
}
