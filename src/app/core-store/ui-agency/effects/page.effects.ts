import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { EffectsAbstract } from '../../ui-page/effects.abstract';
import { AgencyService } from '../../../core/shared/agency/agency.service';
import { AgencyPageService } from '../../../core/shared/agency/agency-page.service';
import { AgencyModel } from '../../../shared/model/agency.model';
import { AgencyOptionsInterface } from '../../../shared/interface/agency-options.interface';
import { AgencyUpsert } from '../../data-agency/actions/agency-upsert';
import { FormService } from '../../../core/shared/form.service';

@Injectable()
export class PageEffects extends EffectsAbstract<AgencyModel, AgencyOptionsInterface> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected formService: FormService,
    protected pageService: AgencyPageService,
    protected modelService: AgencyService,
  ) {

    super(actions$, formService, pageService, modelService);
  }

  /**
   * @inheritDoc
   */
  protected getUpsertAction(model: AgencyModel): Action {

    return new AgencyUpsert({
      models: [model],
    });
  }
}
