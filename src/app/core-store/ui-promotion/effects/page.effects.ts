import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { EffectsAbstract } from '../../ui-page/effects.abstract';
import { PromotionModel } from '../../../shared/model/promotion.model';
import { PromotionPageService } from '../../../core/shared/promotion/promotion-page.service';
import { PromotionService } from '../../../core/shared/promotion/promotion.service';
import { PromotionUpsert } from '../../data-promotion/actions/promotion-upsert';
import { FormService } from '../../../core/shared/form.service';

@Injectable()
export class PageEffects extends EffectsAbstract<PromotionModel, {}> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected formService: FormService,
    protected pageService: PromotionPageService,
    protected modelService: PromotionService,
  ) {

    super(actions$, formService, pageService, modelService);
  }

  /**
   * @inheritDoc
   */
  protected getUpsertAction(model: PromotionModel): Action {

    return new PromotionUpsert({
      models: [model],
    });
  }
}
