import { Component } from '@angular/core';
import { TableHeaderComponentAbstract } from '../../shared/component/table-header/table-header-component.abstract';

@Component({
  selector: 'app-suggestion-table-header',
  templateUrl: './suggestion-table-header.component.html',
  styleUrls: ['./suggestion-table-header.component.scss'],
})
export class SuggestionTableHeaderComponent extends TableHeaderComponentAbstract {

  /**
   * Constructor
   */
  constructor() {

    super();
  }
}
