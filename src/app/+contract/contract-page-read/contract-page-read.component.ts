import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ContractModel } from '../../shared/model/contract.model';
import { PageReadComponentAbstract } from '../../shared/component/page-read/page-read-component.abstract';
import { ContractPageService } from '../../core/shared/contract/contract-page.service';
import { ContractOptionsInterface } from '../../shared/interface/contract-options.interface';
import { PageTabEnum } from '../../shared/enum/page-tab.enum';

@Component({
  selector: 'app-contract-page-read',
  templateUrl: './contract-page-read.component.html',
  styleUrls: ['./contract-page-read.component.scss'],
})
export class ContractPageReadComponent extends PageReadComponentAbstract<ContractModel, ContractOptionsInterface> {

  /**
   * Constants
   */
  readonly PAGE_TAB_GENERAL: PageTabEnum = PageTabEnum.contractReadGeneral;
  readonly PAGE_TAB_DEAL: PageTabEnum = PageTabEnum.contractReadDeal;

  /**
   * Constructor
   */
  constructor(
    protected pageService: ContractPageService,
    protected activatedRoute: ActivatedRoute,
  ) {

    super(
      pageService,
      activatedRoute,
    );
  }
}
