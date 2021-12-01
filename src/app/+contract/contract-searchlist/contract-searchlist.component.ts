import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { RuntimeService } from '../../runtime/shared/runtime.service';
import { ContractModel } from '../../shared/model/contract.model';
import { ContractSearchOptionsInterface } from '../../shared/interface/contract-search-options.interface';
import { ContractSearchModel } from '../../shared/model/contract-search.model';
import { SearchlistComponentAbstract } from '../../shared/component/searchlist/searchlist-component.abstract';
import { ContractSearchlistService } from '../../core/shared/contract/contract-searchlist.service';
import { ContractConfig } from '../../core/shared/contract/contract.config';

@Component({
  selector: 'app-contract-searchlist',
  templateUrl: './contract-searchlist.component.html',
  styleUrls: ['./contract-searchlist.component.scss'],
})
export class ContractSearchlistComponent extends SearchlistComponentAbstract<
  ContractModel,
  ContractSearchModel,
  ContractSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: ContractConfig,
    protected searchlistService: ContractSearchlistService,
    protected runtimeService: RuntimeService,
    protected router: Router,
  ) {

    super(moduleConfig, searchlistService, runtimeService, router);
  }
}
