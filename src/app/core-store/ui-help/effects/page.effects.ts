import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { EffectsAbstract } from '../../ui-page/effects.abstract';
import { HelpService } from '../../../core/shared/help/help.service';
import { HelpPageService } from '../../../core/shared/help/help-page.service';
import { FormService } from '../../../core/shared/form.service';
import { HelpModel } from '../../../shared/model/help.model';

@Injectable()
export class PageEffects extends EffectsAbstract<HelpModel, {}> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected formService: FormService,
    protected pageService: HelpPageService,
    protected modelService: HelpService,
  ) {

    super(actions$, formService, pageService, modelService);
  }

  /**
   * @inheritDoc
   */
  protected getUpsertAction(model: HelpModel): Action {

    return null;
  }
}
