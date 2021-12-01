import { Component } from '@angular/core';
import { TableHeaderComponentAbstract } from '../../shared/component/table-header/table-header-component.abstract';

@Component({
  selector: 'app-promotion-table-header',
  templateUrl: './promotion-table-header.component.html',
  styleUrls: ['./promotion-table-header.component.scss'],
})
export class PromotionTableHeaderComponent extends TableHeaderComponentAbstract {

  /**
   * Constructor
   */
  constructor() {

    super();
  }
}
