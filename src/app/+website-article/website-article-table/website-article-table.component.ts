import { Component } from '@angular/core';

import { TableComponentAbstract } from '../../shared/component/table/table-component.abstract';
import { WebsiteArticleModel } from '../../shared/model/website-article.model';

@Component({
  selector: 'app-website-article-table',
  templateUrl: './website-article-table.component.html',
  styleUrls: ['./website-article-table.component.scss'],
})
export class WebsiteArticleTableComponent extends TableComponentAbstract<WebsiteArticleModel> {

}
