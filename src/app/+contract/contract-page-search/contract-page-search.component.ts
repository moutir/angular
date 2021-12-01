import { Component } from '@angular/core';

import { ContractSearchModel } from '../../shared/model/contract-search.model';
import { ContractSearchOptionsInterface } from '../../shared/interface/contract-search-options.interface';
import { ContractSearchlistService } from '../../core/shared/contract/contract-searchlist.service';
import { PageSearchComponentAbstract } from '../../shared/component/page-search/page-search-component.abstract';
import { ContractModel } from '../../shared/model/contract.model';
import { ContractPageService } from '../../core/shared/contract/contract-page.service';

@Component({
  selector: 'app-contract-page-search',
  templateUrl: './contract-page-search.component.html',
  styleUrls: ['./contract-page-search.component.scss'],
})
export class ContractPageSearchComponent extends PageSearchComponentAbstract<
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
  ) {

    super(
      pageService,
      searchlistService,
    );
  }
}
