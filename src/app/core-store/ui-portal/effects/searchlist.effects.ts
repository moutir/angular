import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

import { EffectsAbstract } from '../../ui-searchlist/effects.abstract';
import { ModelAbstract } from '../../../shared/class/model.abstract';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { PortalModel } from '../../../shared/model/portal.model';
import { PortalSearchModel } from '../../../shared/model/portal-search.model';
import { PortalSearchOptionsInterface } from '../../../shared/interface/portal-search-options.interface';
import { PortalService } from '../../../core/shared/portal/portal.service';
import { PortalSearchlistService } from '../../../core/shared/portal/portal-searchlist.service';
import { PortalUpsert } from '../../data-portal/actions/portal.upsert';

@Injectable()
export class SearchlistEffects extends EffectsAbstract<
  PortalModel,
  PortalSearchModel,
  PortalSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected runtimeService: RuntimeService,
    protected modelService: PortalService,
    protected searchlistService: PortalSearchlistService,
  ) {

    super(actions$, runtimeService, modelService, searchlistService);
  }

  /**
   * @inheritDoc
   */
  protected getUpsertAction(models: ModelAbstract[]): PortalUpsert {

    return new PortalUpsert({
      models: <PortalModel[]>models,
    });
  }
}
