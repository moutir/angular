import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { EffectsAbstract } from '../../ui-page/effects.abstract';
import { ReportModel } from '../../../shared/model/report.model';
import { ReportPageService } from '../../../core/shared/report/report-page.service';
import { ReportService } from '../../../core/shared/report/report.service';
import { ReportUpsert } from '../../data-report/actions/report-upsert';
import { FormService } from '../../../core/shared/form.service';

@Injectable()
export class PageEffects extends EffectsAbstract<ReportModel, {}> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected formService: FormService,
    protected pageService: ReportPageService,
    protected modelService: ReportService,
  ) {

    super(actions$, formService, pageService, modelService);
  }

  /**
   * @inheritDoc
   */
  protected getUpsertAction(model: ReportModel): Action {

    return new ReportUpsert({
      models: [model],
    });
  }
}
