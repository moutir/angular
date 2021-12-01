import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { EffectsAbstract } from '../../ui-page/effects.abstract';
import { ReportingModel } from '../../../shared/model/reporting.model';
import { ReportingPageService } from '../../../core/shared/reporting/reporting-page.service';
import { ReportingService } from '../../../core/shared/reporting/reporting.service';
import { ReportingUpsert } from '../../data-reporting/actions/reporting-upsert';
import { FormService } from '../../../core/shared/form.service';

@Injectable()
export class PageEffects extends EffectsAbstract<ReportingModel, {}> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected formService: FormService,
    protected pageService: ReportingPageService,
    protected modelService: ReportingService,
  ) {

    super(actions$, formService, pageService, modelService);
  }

  /**
   * @inheritDoc
   */
  protected getUpsertAction(model: ReportingModel): Action {

    return new ReportingUpsert({
      models: [model],
    });
  }
}
