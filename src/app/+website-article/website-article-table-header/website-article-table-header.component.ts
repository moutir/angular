import { Component } from '@angular/core';

import { TableHeaderComponentAbstract } from '../../shared/component/table-header/table-header-component.abstract';

@Component({
  selector: 'app-website-article-table-header',
  templateUrl: './website-article-table-header.component.html',
  styleUrls: ['./website-article-table-header.component.scss'],
})
export class WebsiteArticleTableHeaderComponent extends TableHeaderComponentAbstract {

  /**
   * Constructor
   */
  constructor() {

    super();
  }
}
