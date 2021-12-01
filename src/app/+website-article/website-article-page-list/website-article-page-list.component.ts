import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { WebsiteArticleModel } from '../../shared/model/website-article.model';
import { WebsiteArticleSearchOptionsInterface } from '../../shared/interface/website-article-search-options.interface';
import { WebsiteArticleSearchModel } from '../../shared/model/website-article-search.model';
import { PageListComponentAbstract } from '../../shared/component/page-list/page-list-component.abstract';
import { BrowserService } from '../../core/shared/browser/browser.service';
import { WebsiteArticleSearchlistService } from '../../core/shared/website-article/website-article-searchlist.service';
import { WebsiteArticlePageService } from '../../core/shared/website-article/website-article-page.service';
import { RouterService } from '../../core/shared/router/router.service';

@Component({
  selector: 'app-website-article-page-list',
  templateUrl: './website-article-page-list.component.html',
  styleUrls: ['./website-article-page-list.component.scss'],
})
export class WebsiteArticlePageListComponent extends PageListComponentAbstract<
  WebsiteArticleModel,
  WebsiteArticleSearchModel,
  WebsiteArticleSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected pageService: WebsiteArticlePageService,
    protected searchlistService: WebsiteArticleSearchlistService,
    protected browserService: BrowserService,
    protected activatedRoute: ActivatedRoute,
    protected routerService: RouterService,
  ) {

    super(
      pageService,
      searchlistService,
      browserService,
      activatedRoute,
      routerService,
    );
  }
}
