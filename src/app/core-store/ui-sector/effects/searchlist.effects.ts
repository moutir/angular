import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

import { EffectsAbstract } from '../../ui-searchlist/effects.abstract';
import { SectorUpsert } from '../../data-sector/actions/sector-upsert';
import { SectorModel } from '../../../shared/model/sector.model';
import { SectorSearchlistService } from '../../../core/shared/sector/sector-searchlist.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { SectorSearchModel } from '../../../shared/model/sector-search.model';
import { SectorSearchOptionsInterface } from '../../../shared/interface/sector-search-options.interface';
import { SectorService } from '../../../core/shared/sector/sector.service';

@Injectable()
export class SearchlistEffects extends EffectsAbstract<
  SectorModel,
  SectorSearchModel,
  SectorSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected runtimeService: RuntimeService,
    protected modelService: SectorService,
    protected searchlistService: SectorSearchlistService,
  ) {

    super(actions$, runtimeService, modelService, searchlistService);
  }

  /**
   * @inheritDoc
   */
  getUpsertAction(models: SectorModel[]): SectorUpsert {

    return new SectorUpsert({
      models: models,
    });
  }
}
