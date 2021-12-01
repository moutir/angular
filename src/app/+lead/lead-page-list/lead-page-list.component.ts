import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { BrowserService } from '../../core/shared/browser/browser.service';
import { LeadModel } from '../../shared/model/lead.model';
import { LeadSearchOptionsInterface } from '../../shared/interface/lead-search-options.interface';
import { LeadSearchModel } from '../../shared/model/lead-search.model';
import { LeadSearchlistService } from '../../core/shared/lead/lead-searchlist.service';
import { PageListComponentAbstract } from '../../shared/component/page-list/page-list-component.abstract';
import { LeadPageService } from '../../core/shared/lead/lead-page.service';
import { RuntimeFeatureInterface } from '../../shared/interface/runtime-feature.interface';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { RouterService } from '../../core/shared/router/router.service';

@Component({
  selector: 'app-lead-page-list',
  templateUrl: './lead-page-list.component.html',
  styleUrls: ['./lead-page-list.component.scss'],
})
export class LeadPageListComponent extends PageListComponentAbstract<
  LeadModel,
  LeadSearchModel,
  LeadSearchOptionsInterface
> {

  /**
   * State observables
   */
  runtimeFeature$: Observable<RuntimeFeatureInterface>;

  /**
   * Constructor
   */
  constructor(
    protected pageService: LeadPageService,
    protected searchlistService: LeadSearchlistService,
    protected browserService: BrowserService,
    protected activatedRoute: ActivatedRoute,
    protected routerService: RouterService,
    private runtimeService: RuntimeService,
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
  protected setStateObservable(): void {

    super.setStateObservable();

    this.runtimeFeature$ = this.runtimeService.selectFeature();
  }
}
