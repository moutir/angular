import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { RuntimeService } from '../../runtime/shared/runtime.service';
import { SuggestionModel } from '../../shared/model/suggestion.model';
import { SuggestionSearchOptionsInterface } from '../../shared/interface/suggestion-search-options.interface';
import { SuggestionSearchModel } from '../../shared/model/suggestion-search.model';
import { SearchlistComponentAbstract } from '../../shared/component/searchlist/searchlist-component.abstract';
import { SuggestionSearchlistService } from '../../core/shared/suggestion/suggestion-searchlist.service';
import { SuggestionConfig } from '../../core/shared/suggestion/suggestion.config';

@Component({
  selector: 'app-suggestion-searchlist',
  templateUrl: './suggestion-searchlist.component.html',
  styleUrls: ['./suggestion-searchlist.component.scss'],
})
export class SuggestionSearchlistComponent extends SearchlistComponentAbstract<
  SuggestionModel,
  SuggestionSearchModel,
  SuggestionSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: SuggestionConfig,
    protected searchlistService: SuggestionSearchlistService,
    protected runtimeService: RuntimeService,
    protected router: Router,
  ) {

    super(moduleConfig, searchlistService, runtimeService, router);
  }
}
