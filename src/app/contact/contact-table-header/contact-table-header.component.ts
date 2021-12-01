import { Component, Input } from '@angular/core';

import { TableHeaderComponentAbstract } from '../../shared/component/table-header/table-header-component.abstract';

@Component({
  selector: 'app-contact-table-header',
  templateUrl: './contact-table-header.component.html',
  styleUrls: ['./contact-table-header.component.scss'],
})
export class ContactTableHeaderComponent extends TableHeaderComponentAbstract {

  /**
   * Is user subscribed to beta performance
   */
  @Input() isBetaPerformance: boolean|null = null;

  /**
   * Constructor
   */
  constructor() {

    super();
  }
}
