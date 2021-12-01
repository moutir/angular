import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BrowserService } from '../../core/shared/browser/browser.service';
import { PageListComponentAbstract } from '../../shared/component/page-list/page-list-component.abstract';
import { PortalPageService } from '../../core/shared/portal/portal-page-service';
import { PortalSearchlistService } from '../../core/shared/portal/portal-searchlist.service';
import { PortalModel } from '../../shared/model/portal.model';
import { PortalSearchModel } from '../../shared/model/portal-search.model';
import { PortalSearchOptionsInterface } from '../../shared/interface/portal-search-options.interface';
import { RouterService } from '../../core/shared/router/router.service';

@Component({
  selector: 'app-portal-page-list',
  templateUrl: './portal-page-list.component.html',
})
export class PortalPageListComponent extends PageListComponentAbstract<PortalModel,
  PortalSearchModel,
  PortalSearchOptionsInterface> {

  /**
   * Constructor
   */
  constructor(
    protected pageService: PortalPageService,
    protected searchlistService: PortalSearchlistService,
    protected browserService: BrowserService,
    protected activatedRoute: ActivatedRoute,
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
}
