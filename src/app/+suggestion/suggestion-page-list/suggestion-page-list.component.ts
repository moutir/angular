import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SuggestionModel } from '../../shared/model/suggestion.model';
import { SuggestionSearchOptionsInterface } from '../../shared/interface/suggestion-search-options.interface';
import { SuggestionSearchModel } from '../../shared/model/suggestion-search.model';
import { PageListComponentAbstract } from '../../shared/component/page-list/page-list-component.abstract';
import { BrowserService } from '../../core/shared/browser/browser.service';
import { SuggestionSearchlistService } from '../../core/shared/suggestion/suggestion-searchlist.service';
import { SuggestionPageService } from '../../core/shared/suggestion/suggestion-page.service';
import { RouterService } from '../../core/shared/router/router.service';

@Component({
  selector: 'app-suggestion-page-list',
  templateUrl: './suggestion-page-list.component.html',
  styleUrls: ['./suggestion-page-list.component.scss'],
})
export class SuggestionPageListComponent extends PageListComponentAbstract<
  SuggestionModel,
  SuggestionSearchModel,
  SuggestionSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected pageService: SuggestionPageService,
    protected searchlistService: SuggestionSearchlistService,
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
