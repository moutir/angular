import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { BrowserService } from '../../core/shared/browser/browser.service';
import { PromotionModel } from '../../shared/model/promotion.model';
import { PromotionSearchOptionsInterface } from '../../shared/interface/promotion-search-options.interface';
import { PromotionSearchModel } from '../../shared/model/promotion-search.model';
import { PromotionSearchlistService } from '../../core/shared/promotion/promotion-searchlist.service';
import { PageListComponentAbstract } from '../../shared/component/page-list/page-list-component.abstract';
import { PromotionPageService } from '../../core/shared/promotion/promotion-page.service';
import { RuntimeFeatureInterface } from '../../shared/interface/runtime-feature.interface';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { RouterService } from '../../core/shared/router/router.service';

@Component({
  selector: 'app-promotion-page-list',
  templateUrl: './promotion-page-list.component.html',
  styleUrls: ['./promotion-page-list.component.scss'],
})
export class PromotionPageListComponent extends PageListComponentAbstract<
  PromotionModel,
  PromotionSearchModel,
  PromotionSearchOptionsInterface
> {

  /**
   * State observables
   */
  feature$: Observable<RuntimeFeatureInterface>;

  /**
   * Constructor
   */
  constructor(
    protected pageService: PromotionPageService,
    protected searchlistService: PromotionSearchlistService,
    protected browserService: BrowserService,
    protected activatedRoute: ActivatedRoute,
    protected runtimeService: RuntimeService,
    protected routerService: RouterService,
  ) {

    super(
      pageService,
      searchlistService,
      browserService,
      activatedRoute,
      routerService,
    );
  }

  /**
   * @inheritDoc
   */
  setStateObservable(): void {

    super.setStateObservable();

    this.feature$ = this.runtimeService.selectFeature();
  }
}
