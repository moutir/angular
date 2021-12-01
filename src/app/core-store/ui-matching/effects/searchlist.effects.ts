import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

import { EffectsAbstract } from '../../ui-searchlist/effects.abstract';
import { MatchingModel } from '../../../shared/model/matching.model';
import { MatchingUpsert } from '../../data-matching/actions/matching-upsert';
import { MatchingSearchlistService } from '../../../core/shared/matching/matching-searchlist.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { MatchingSearchModel } from '../../../shared/model/matching-search.model';
import { MatchingSearchOptionsInterface } from '../../../shared/interface/matching-search-options.interface';
import { MatchingService } from '../../../core/shared/matching/matching.service';

@Injectable()
export class SearchlistEffects extends EffectsAbstract<
  MatchingModel,
  MatchingSearchModel,
  MatchingSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected runtimeService: RuntimeService,
    protected modelService: MatchingService,
    protected searchlistService: MatchingSearchlistService,
  ) {

    super(actions$, runtimeService, modelService, searchlistService);
  }

  /**
   * @inheritDoc
   */
  protected getUpsertAction(models: MatchingModel[]): MatchingUpsert {

    return new MatchingUpsert({
      models: models,
    });
  }
}
