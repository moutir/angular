import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { EffectsAbstract } from '../../ui-page/effects.abstract';
import { MatchingModel } from '../../../shared/model/matching.model';
import { MatchingUpsert } from '../../data-matching/actions/matching-upsert';
import { MatchingPageService } from '../../../core/shared/matching/matching-page.service';
import { MatchingService } from '../../../core/shared/matching/matching.service';
import { FormService } from '../../../core/shared/form.service';

@Injectable()
export class PageEffects extends EffectsAbstract<MatchingModel, {}> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected formService: FormService,
    protected pageService: MatchingPageService,
    protected modelService: MatchingService,
  ) {

    super(actions$, formService, pageService, modelService);
  }

  /**
   * @inheritDoc
   */
  protected getUpsertAction(model: MatchingModel): Action {

    return new MatchingUpsert({
      models: [model],
    });
  }
}
