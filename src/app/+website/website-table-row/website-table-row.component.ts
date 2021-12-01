import { Component, Input } from '@angular/core';

import { WebsiteModel } from '../../shared/model/website.model';
import { TableRowComponentAbstract } from '../../shared/component/table-row/table-row-component.abstract';
import { ModelAbstract } from '../../shared/class/model.abstract';
import { BrowserService } from '../../core/shared/browser/browser.service';

@Component({
  selector: 'app-website-table-row',
  templateUrl: './website-table-row.component.html',
  styleUrls: ['./website-table-row.component.scss'],
})
export class WebsiteTableRowComponent extends TableRowComponentAbstract {

  /**
   * Website to display
   */
  @Input() website: WebsiteModel = new WebsiteModel();

  /**
   * Constructor
   */
  constructor(
    private browserService: BrowserService,
  ) {

    super();
  }

  /**
   * Click URL button
   */
  onClickUrlButton(event: MouseEvent): void {

    event.stopPropagation();

    let url = this.website.url;

    // URL does not start by 'http' or '//'
    if (url.indexOf('http') !== 0 && url.indexOf('//')) {

      url = '//' + url;
    }

    this.browserService.blank(url);
  }

  /**
   * @inheritDoc
   */
  protected getModel(): ModelAbstract {

    return this.website;
  }
}
