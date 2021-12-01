import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { EffectsAbstract } from '../../ui-page/effects.abstract';
import { AgencyPreferenceModel } from '../../../shared/model/agency-preference.model';
import { AgencyPreferenceOptionsInterface } from '../../../shared/interface/agency-preference-options.interface';
import { AgencyPreferencePageService } from '../../../core/shared/agency-preference/agency-preference-page.service';
import { AgencyPreferenceService } from '../../../core/shared/agency-preference/agency-preference.service';
import { AgencyPreferenceUpsert } from '../../data-agency-preference/actions/agency-preference-upsert';
import { FormService } from '../../../core/shared/form.service';

@Injectable()
export class PageEffects extends EffectsAbstract<AgencyPreferenceModel, AgencyPreferenceOptionsInterface> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected formService: FormService,
    protected pageService: AgencyPreferencePageService,
    protected modelService: AgencyPreferenceService,
  ) {

    super(actions$, formService, pageService, modelService);
  }

  /**
   * @inheritDoc
   */
  protected getUpsertAction(model: AgencyPreferenceModel): Action {

    return new AgencyPreferenceUpsert({
      models: [model],
    });
  }
}
