import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

import { StateInterface } from '../../../core-store/state.interface';
import { PageServiceAbstract } from '../../../shared/service/page.service.abstract';
import { PromotionConfig } from './promotion.config';
import { PromotionModel } from '../../../shared/model/promotion.model';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { PromotionService } from './promotion.service';

@Injectable()
export class PromotionPageService extends PageServiceAbstract<PromotionModel, {}> {

  /**
   * Constructor
   */
  constructor(
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected router: Router,
    protected moduleConfig: PromotionConfig,
    protected modelService: PromotionService,
  ) {

    super(
      store$,
      runtimeService,
      router,
      moduleConfig,
      modelService,
    );
  }
}
