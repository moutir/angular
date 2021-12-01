import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ContractModel } from '../../shared/model/contract.model';
import { ContractSearchOptionsInterface } from '../../shared/interface/contract-search-options.interface';
import { ContractSearchModel } from '../../shared/model/contract-search.model';
import { PageListComponentAbstract } from '../../shared/component/page-list/page-list-component.abstract';
import { BrowserService } from '../../core/shared/browser/browser.service';
import { ContractSearchlistService } from '../../core/shared/contract/contract-searchlist.service';
import { ContractPageService } from '../../core/shared/contract/contract-page.service';
import { RouterService } from '../../core/shared/router/router.service';

@Component({
  selector: 'app-contract-page-list',
  templateUrl: './contract-page-list.component.html',
  styleUrls: ['./contract-page-list.component.scss'],
})
export class ContractPageListComponent extends PageListComponentAbstract<
  ContractModel,
  ContractSearchModel,
  ContractSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected pageService: ContractPageService,
    protected searchlistService: ContractSearchlistService,
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
