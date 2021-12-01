import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

import { EffectsAbstract } from '../../ui-searchlist/effects.abstract';
import { SuggestionUpsert } from '../../data-suggestion/actions/suggestion-upsert';
import { SuggestionModel } from '../../../shared/model/suggestion.model';
import { SuggestionSearchlistService } from '../../../core/shared/suggestion/suggestion-searchlist.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { SuggestionSearchModel } from '../../../shared/model/suggestion-search.model';
import { SuggestionSearchOptionsInterface } from '../../../shared/interface/suggestion-search-options.interface';
import { SuggestionService } from '../../../core/shared/suggestion/suggestion.service';

@Injectable()
export class SearchlistEffects extends EffectsAbstract<
  SuggestionModel,
  SuggestionSearchModel,
  SuggestionSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected runtimeService: RuntimeService,
    protected modelService: SuggestionService,
    protected searchlistService: SuggestionSearchlistService,
  ) {

    super(actions$, runtimeService, modelService, searchlistService);
  }

  /**
   * @inheritDoc
   */
  getUpsertAction(models: SuggestionModel[]): SuggestionUpsert {

    return new SuggestionUpsert({
      models: models,
    });
  }
}
