import { Component } from '@angular/core';
import { TableHeaderComponentAbstract } from '../../shared/component/table-header/table-header-component.abstract';

@Component({
  selector: 'app-website-table-header',
  templateUrl: './website-table-header.component.html',
  styleUrls: ['./website-table-header.component.scss'],
})
export class WebsiteTableHeaderComponent extends TableHeaderComponentAbstract {

  /**
   * Constructor
   */
  constructor() {

    super();
  }
}
