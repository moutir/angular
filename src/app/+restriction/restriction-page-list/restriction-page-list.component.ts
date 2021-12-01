import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RestrictionModel } from '../../shared/model/restriction.model';
import { RestrictionSearchOptionsInterface } from '../../shared/interface/restriction-search-options.interface';
import { RestrictionSearchModel } from '../../shared/model/restriction-search.model';
import { PageListComponentAbstract } from '../../shared/component/page-list/page-list-component.abstract';
import { BrowserService } from '../../core/shared/browser/browser.service';
import { RestrictionSearchlistService } from '../../core/shared/restriction/restriction-searchlist.service';
import { RestrictionPageService } from '../../core/shared/restriction/restriction-page.service';
import { RouterService } from '../../core/shared/router/router.service';

@Component({
  selector: 'app-restriction-page-list',
  templateUrl: './restriction-page-list.component.html',
  styleUrls: ['./restriction-page-list.component.scss'],
})
export class RestrictionPageListComponent extends PageListComponentAbstract<
  RestrictionModel,
  RestrictionSearchModel,
  RestrictionSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected pageService: RestrictionPageService,
    protected searchlistService: RestrictionSearchlistService,
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
