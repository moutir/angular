import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

import { EffectsAbstract } from '../../ui-searchlist/effects.abstract';
import { RestrictionUpsert } from '../../data-restriction/actions/restriction-upsert';
import { RestrictionModel } from '../../../shared/model/restriction.model';
import { RestrictionSearchlistService } from '../../../core/shared/restriction/restriction-searchlist.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { RestrictionSearchModel } from '../../../shared/model/restriction-search.model';
import { RestrictionSearchOptionsInterface } from '../../../shared/interface/restriction-search-options.interface';
import { RestrictionService } from '../../../core/shared/restriction/restriction.service';

@Injectable()
export class SearchlistEffects extends EffectsAbstract<
  RestrictionModel,
  RestrictionSearchModel,
  RestrictionSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected runtimeService: RuntimeService,
    protected modelService: RestrictionService,
    protected searchlistService: RestrictionSearchlistService,
  ) {

    super(actions$, runtimeService, modelService, searchlistService);
  }

  /**
   * @inheritDoc
   */
  getUpsertAction(models: RestrictionModel[]): RestrictionUpsert {

    return new RestrictionUpsert({
      models: models,
    });
  }
}
