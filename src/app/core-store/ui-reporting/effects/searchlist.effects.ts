import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

import { EffectsAbstract } from '../../ui-searchlist/effects.abstract';
import { ReportingUpsert } from '../../data-reporting/actions/reporting-upsert';
import { ReportingModel } from '../../../shared/model/reporting.model';
import { ReportingSearchlistService } from '../../../core/shared/reporting/reporting-searchlist.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { ReportingSearchModel } from '../../../shared/model/reporting-search.model';
import { ReportingSearchOptionsInterface } from '../../../shared/interface/reporting-search-options.interface';
import { ReportingService } from '../../../core/shared/reporting/reporting.service';

@Injectable()
export class SearchlistEffects extends EffectsAbstract<
  ReportingModel,
  ReportingSearchModel,
  ReportingSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected runtimeService: RuntimeService,
    protected modelService: ReportingService,
    protected searchlistService: ReportingSearchlistService,
  ) {

    super(actions$, runtimeService, modelService, searchlistService);
  }

  /**
   * @inheritDoc
   */
  getUpsertAction(models: ReportingModel[]): ReportingUpsert {

    return new ReportingUpsert({
      models: models,
    });
  }
}
