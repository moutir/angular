import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { PropertyModel } from '../../shared/model/property.model';
import { PropertySearchlistService } from '../../core/shared/property/property-searchlist.service';
import { PropertyService } from '../../core/shared/property/property.service';
import { PropertyConfig } from '../../core/shared/property/property.config';
import { PropertySearchOptionsInterface } from '../../shared/interface/property-search-options.interface';
import { PropertySearchModel } from '../../shared/model/property-search.model';
import { BrowserService } from '../../core/shared/browser/browser.service';
import { PageListComponentAbstract } from '../../shared/component/page-list/page-list-component.abstract';
import { PropertyPageService } from '../../core/shared/property/property-page.service';
import { RuntimeFeatureInterface } from '../../shared/interface/runtime-feature.interface';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { RouterService } from '../../core/shared/router/router.service';

@Component({
  selector: 'app-property-page-list',
  templateUrl: './property-page-list.component.html',
  styleUrls: ['./property-page-list.component.scss'],
})
export class PropertyPageListComponent extends PageListComponentAbstract<
  PropertyModel,
  PropertySearchModel,
  PropertySearchOptionsInterface
  > {

  /**
   * State observables
   */
  feature$: Observable<RuntimeFeatureInterface>;

  /**
   * Constructor
   */
  constructor(
    protected pageService: PropertyPageService,
    protected searchlistService: PropertySearchlistService,
    protected browserService: BrowserService,
    protected activatedRoute: ActivatedRoute,
    protected moduleConfig: PropertyConfig,
    protected propertyService: PropertyService,
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

    // TODO[later] remove once fully on Angular and stop using BE session for a stupid basket, this is FE only!
    this.propertyService.setBasket(moduleConfig.basketPropertyIds);
  }

  /**
   * @inheritDoc
   */
  protected setStateObservable(): void {

    super.setStateObservable();

    this.feature$ = this.runtimeService.selectFeature();
  }
}
