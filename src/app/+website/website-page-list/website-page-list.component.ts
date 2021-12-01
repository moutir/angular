import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { WebsiteModel } from '../../shared/model/website.model';
import { WebsiteSearchOptionsInterface } from '../../shared/interface/website-search-options.interface';
import { WebsiteSearchModel } from '../../shared/model/website-search.model';
import { PageListComponentAbstract } from '../../shared/component/page-list/page-list-component.abstract';
import { BrowserService } from '../../core/shared/browser/browser.service';
import { WebsiteSearchlistService } from '../../core/shared/website/website-searchlist.service';
import { WebsitePageService } from '../../core/shared/website/website-page.service';
import { RouterService } from '../../core/shared/router/router.service';

@Component({
  selector: 'app-website-page-list',
  templateUrl: './website-page-list.component.html',
  styleUrls: ['./website-page-list.component.scss'],
})
export class WebsitePageListComponent extends PageListComponentAbstract<
  WebsiteModel,
  WebsiteSearchModel,
  WebsiteSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected pageService: WebsitePageService,
    protected searchlistService: WebsiteSearchlistService,
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
