import { Component, Input } from '@angular/core';

import { WebsiteArticleModel } from '../../shared/model/website-article.model';
import { TableRowComponentAbstract } from '../../shared/component/table-row/table-row-component.abstract';
import { ModelAbstract } from '../../shared/class/model.abstract';

@Component({
  selector: 'app-website-article-table-row',
  templateUrl: './website-article-table-row.component.html',
  styleUrls: ['./website-article-table-row.component.scss'],
})
export class WebsiteArticleTableRowComponent extends TableRowComponentAbstract {

  /**
   * Website article to display
   */
  @Input() websiteArticle: WebsiteArticleModel = new WebsiteArticleModel();

  /**
   * @inheritDoc
   */
  protected getModel(): ModelAbstract {

    return this.websiteArticle;
  }
}
