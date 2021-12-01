import { Component } from '@angular/core';

import { SuggestionSearchModel } from '../../shared/model/suggestion-search.model';
import { SuggestionSearchOptionsInterface } from '../../shared/interface/suggestion-search-options.interface';
import { SuggestionSearchlistService } from '../../core/shared/suggestion/suggestion-searchlist.service';
import { PageSearchComponentAbstract } from '../../shared/component/page-search/page-search-component.abstract';
import { SuggestionModel } from '../../shared/model/suggestion.model';
import { SuggestionPageService } from '../../core/shared/suggestion/suggestion-page.service';

@Component({
  selector: 'app-suggestion-page-search',
  templateUrl: './suggestion-page-search.component.html',
  styleUrls: ['./suggestion-page-search.component.scss'],
})
export class SuggestionPageSearchComponent extends PageSearchComponentAbstract<
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
  ) {

    super(
      pageService,
      searchlistService,
    );
  }
}
