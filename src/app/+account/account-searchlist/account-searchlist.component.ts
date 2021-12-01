import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { RuntimeService } from '../../runtime/shared/runtime.service';
import { AccountModel } from '../../shared/model/account.model';
import { AccountSearchOptionsInterface } from '../../shared/interface/account-search-options.interface';
import { AccountSearchModel } from '../../shared/model/account-search.model';
import { SearchlistComponentAbstract } from '../../shared/component/searchlist/searchlist-component.abstract';
import { AccountSearchlistService } from '../../core/shared/account/account-searchlist.service';
import { AccountConfig } from '../../core/shared/account/account.config';

@Component({
  selector: 'app-account-searchlist',
  templateUrl: './account-searchlist.component.html',
  styleUrls: ['./account-searchlist.component.scss'],
})
export class AccountSearchlistComponent extends SearchlistComponentAbstract<
  AccountModel,
  AccountSearchModel,
  AccountSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: AccountConfig,
    protected searchlistService: AccountSearchlistService,
    protected runtimeService: RuntimeService,
    protected router: Router,
  ) {

    super(moduleConfig, searchlistService, runtimeService, router);
  }
}
