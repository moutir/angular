import { Component } from '@angular/core';
import { TableHeaderComponentAbstract } from '../../shared/component/table-header/table-header-component.abstract';

@Component({
  selector: 'app-custom-attribute-table-header',
  templateUrl: './custom-attribute-table-header.component.html',
  styleUrls: ['./custom-attribute-table-header.component.scss'],
})
export class CustomAttributeTableHeaderComponent extends TableHeaderComponentAbstract {

  /**
   * Constructor
   */
  constructor() {

    super();
  }
}
