import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

import { EffectsAbstract } from '../../ui-searchlist/effects.abstract';
import { ModelAbstract } from '../../../shared/class/model.abstract';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { MlsService } from '../../../core/shared/mls/mls.service';
import { MlsModel } from '../../../shared/model/mls.model';
import { MlsSearchModel } from '../../../shared/model/mls-search.model';
import { MlsSearchlistService } from '../../../core/shared/mls/mls-searchlist.service';
import { MlsUpsert } from '../../data-mls/actions/mls.upsert';
import { MlsOptionsInterface } from '../../../shared/interface/mls-options.interface';

@Injectable()
export class SearchlistEffects extends EffectsAbstract<
  MlsModel,
  MlsSearchModel,
  MlsOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected runtimeService: RuntimeService,
    protected modelService: MlsService,
    protected searchlistService: MlsSearchlistService,
  ) {

    super(actions$, runtimeService, modelService, searchlistService);
  }

  /**
   * @inheritDoc
   */
  protected getUpsertAction(models: ModelAbstract[]): MlsUpsert {

    return new MlsUpsert({
      models: <MlsModel[]>models,
    });
  }
}
