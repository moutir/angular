import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MatchingModel } from '../../shared/model/matching.model';
import { BrowserService } from '../../core/shared/browser/browser.service';
import { MatchingSearchModel } from '../../shared/model/matching-search.model';
import { MatchingSearchOptionsInterface } from '../../shared/interface/matching-search-options.interface';
import { MatchingSearchlistService } from '../../core/shared/matching/matching-searchlist.service';
import { PageListComponentAbstract } from '../../shared/component/page-list/page-list-component.abstract';
import { MatchingPageService } from '../../core/shared/matching/matching-page.service';
import { RouterService } from '../../core/shared/router/router.service';

@Component({
  selector: 'app-matching-page-list',
  templateUrl: './matching-page-list.component.html',
  styleUrls: ['./matching-page-list.component.scss'],
})
export class MatchingPageListComponent extends PageListComponentAbstract<
  MatchingModel,
  MatchingSearchModel,
  MatchingSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected pageService: MatchingPageService,
    protected searchlistService: MatchingSearchlistService,
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
