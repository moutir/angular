import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

import { EffectsAbstract } from '../../ui-searchlist/effects.abstract';
import { ProcessUpsert } from '../../data-process/actions/process-upsert';
import { ProcessModel } from '../../../shared/model/process.model';
import { ProcessSearchlistService } from '../../../core/shared/process/process-searchlist.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { ProcessSearchModel } from '../../../shared/model/process-search.model';
import { ProcessSearchOptionsInterface } from '../../../shared/interface/process-search-options.interface';
import { ProcessService } from '../../../core/shared/process/process.service';

@Injectable()
export class SearchlistEffects extends EffectsAbstract<
  ProcessModel,
  ProcessSearchModel,
  ProcessSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected runtimeService: RuntimeService,
    protected modelService: ProcessService,
    protected searchlistService: ProcessSearchlistService,
  ) {

    super(actions$, runtimeService, modelService, searchlistService);
  }

  /**
   * @inheritDoc
   */
  getUpsertAction(models: ProcessModel[]): ProcessUpsert {

    return new ProcessUpsert({
      models: models,
    });
  }
}
