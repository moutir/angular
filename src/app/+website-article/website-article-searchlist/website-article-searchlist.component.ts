import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { RuntimeService } from '../../runtime/shared/runtime.service';
import { WebsiteArticleModel } from '../../shared/model/website-article.model';
import { WebsiteArticleSearchOptionsInterface } from '../../shared/interface/website-article-search-options.interface';
import { WebsiteArticleSearchModel } from '../../shared/model/website-article-search.model';
import { SearchlistComponentAbstract } from '../../shared/component/searchlist/searchlist-component.abstract';
import { WebsiteArticleSearchlistService } from '../../core/shared/website-article/website-article-searchlist.service';
import { WebsiteArticleConfig } from '../../core/shared/website-article/website-article.config';

@Component({
  selector: 'app-website-article-searchlist',
  templateUrl: './website-article-searchlist.component.html',
  styleUrls: ['./website-article-searchlist.component.scss'],
})
export class WebsiteArticleSearchlistComponent extends SearchlistComponentAbstract<
  WebsiteArticleModel,
  WebsiteArticleSearchModel,
  WebsiteArticleSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: WebsiteArticleConfig,
    protected searchlistService: WebsiteArticleSearchlistService,
    protected runtimeService: RuntimeService,
    protected router: Router,
  ) {

    super(moduleConfig, searchlistService, runtimeService, router);
  }
}
