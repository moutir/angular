import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

import { EffectsAbstract } from '../../ui-searchlist/effects.abstract';
import { PromotionSearchlistService } from '../../../core/shared/promotion/promotion-searchlist.service';
import { PromotionUpsert } from '../../data-promotion/actions/promotion-upsert';
import { PromotionModel } from '../../../shared/model/promotion.model';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { PromotionSearchModel } from '../../../shared/model/promotion-search.model';
import { PromotionSearchOptionsInterface } from '../../../shared/interface/promotion-search-options.interface';
import { PromotionService } from '../../../core/shared/promotion/promotion.service';

@Injectable()
export class SearchlistEffects extends EffectsAbstract<
  PromotionModel,
  PromotionSearchModel,
  PromotionSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected runtimeService: RuntimeService,
    protected modelService: PromotionService,
    protected searchlistService: PromotionSearchlistService,
  ) {

    super(actions$, runtimeService, modelService, searchlistService);
  }

  /**
   * @inheritDoc
   */
  protected getUpsertAction(models: PromotionModel[]): PromotionUpsert {

    return new PromotionUpsert({
      models: models,
    });
  }
}
