import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AccountModel } from '../../shared/model/account.model';
import { AccountSearchOptionsInterface } from '../../shared/interface/account-search-options.interface';
import { AccountSearchModel } from '../../shared/model/account-search.model';
import { PageListComponentAbstract } from '../../shared/component/page-list/page-list-component.abstract';
import { BrowserService } from '../../core/shared/browser/browser.service';
import { AccountSearchlistService } from '../../core/shared/account/account-searchlist.service';
import { AccountPageService } from '../../core/shared/account/account-page.service';
import { RouterService } from '../../core/shared/router/router.service';

@Component({
  selector: 'app-account-page-list',
  templateUrl: './account-page-list.component.html',
  styleUrls: ['./account-page-list.component.scss'],
})
export class AccountPageListComponent extends PageListComponentAbstract<
  AccountModel,
  AccountSearchModel,
  AccountSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected pageService: AccountPageService,
    protected searchlistService: AccountSearchlistService,
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
