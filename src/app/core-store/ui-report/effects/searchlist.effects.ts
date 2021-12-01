import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

import { EffectsAbstract } from '../../ui-searchlist/effects.abstract';
import { ReportUpsert } from '../../data-report/actions/report-upsert';
import { ReportModel } from '../../../shared/model/report.model';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { ReportSearchlistService } from '../../../core/shared/report/report-searchlist.service';
import { ReportSearchModel } from '../../../shared/model/report-search.model';
import { ReportSearchOptionsInterface } from '../../../shared/interface/report-search-options.interface';
import { ReportService } from '../../../core/shared/report/report.service';

@Injectable()
export class SearchlistEffects extends EffectsAbstract<
  ReportModel,
  ReportSearchModel,
  ReportSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected runtimeService: RuntimeService,
    protected modelService: ReportService,
    protected searchlistService: ReportSearchlistService,
  ) {

    super(actions$, runtimeService, modelService, searchlistService);
  }

  /**
   * @inheritDoc
   */
  getUpsertAction(models: ReportModel[]): ReportUpsert {

    return new ReportUpsert({
      models: models,
    });
  }
}
