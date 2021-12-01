import { Component } from '@angular/core';

import { AccountSearchModel } from '../../shared/model/account-search.model';
import { AccountSearchOptionsInterface } from '../../shared/interface/account-search-options.interface';
import { AccountSearchlistService } from '../../core/shared/account/account-searchlist.service';
import { PageSearchComponentAbstract } from '../../shared/component/page-search/page-search-component.abstract';
import { AccountModel } from '../../shared/model/account.model';
import { AccountPageService } from '../../core/shared/account/account-page.service';

@Component({
  selector: 'app-account-page-search',
  templateUrl: './account-page-search.component.html',
  styleUrls: ['./account-page-search.component.scss'],
})
export class AccountPageSearchComponent extends PageSearchComponentAbstract<
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
  ) {

    super(
      pageService,
      searchlistService,
    );
  }
}
