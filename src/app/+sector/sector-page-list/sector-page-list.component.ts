import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SectorModel } from '../../shared/model/sector.model';
import { SectorSearchOptionsInterface } from '../../shared/interface/sector-search-options.interface';
import { SectorSearchModel } from '../../shared/model/sector-search.model';
import { PageListComponentAbstract } from '../../shared/component/page-list/page-list-component.abstract';
import { BrowserService } from '../../core/shared/browser/browser.service';
import { SectorSearchlistService } from '../../core/shared/sector/sector-searchlist.service';
import { SectorPageService } from '../../core/shared/sector/sector-page.service';
import { RouterService } from '../../core/shared/router/router.service';

@Component({
  selector: 'app-sector-page-list',
  templateUrl: './sector-page-list.component.html',
  styleUrls: ['./sector-page-list.component.scss'],
})
export class SectorPageListComponent extends PageListComponentAbstract<
  SectorModel,
  SectorSearchModel,
  SectorSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected pageService: SectorPageService,
    protected searchlistService: SectorSearchlistService,
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
