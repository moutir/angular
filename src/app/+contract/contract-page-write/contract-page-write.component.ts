import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Dictionary } from '../../shared/class/dictionary';

import { ContractModel } from '../../shared/model/contract.model';
import { PageWriteComponentAbstract } from '../../shared/component/page-write/page-write-component.abstract';
import { ContractPageService } from '../../core/shared/contract/contract-page.service';
import { ContractOptionsInterface } from '../../shared/interface/contract-options.interface';
import { FormService } from '../../core/shared/form.service';
import { PageTabEnum } from '../../shared/enum/page-tab.enum';
import { ContractModelGeneralAdapterStrategy } from '../../core/shared/contract/contract-model-general-adapter.strategy';
import { ContractModelDealAdapterStrategy } from '../../core/shared/contract/contract-model-deal-adapter.strategy';

@Component({
  selector: 'app-contract-page-write',
  templateUrl: './contract-page-write.component.html',
  styleUrls: ['./contract-page-write.component.scss'],
})
export class ContractPageWriteComponent extends PageWriteComponentAbstract<ContractModel, ContractOptionsInterface> {

  /**
   * Constants
   */
  readonly PAGE_TAB_GENERAL: PageTabEnum = PageTabEnum.contractWriteGeneral;
  readonly PAGE_TAB_DEAL: PageTabEnum = PageTabEnum.contractWriteDeal;

  /**
   * Constructor
   */
  constructor(
    protected pageService: ContractPageService,
    protected formService: FormService,
    protected activatedRoute: ActivatedRoute,
    private contractModelGeneralAdapterStrategy: ContractModelGeneralAdapterStrategy,
    private contractModelDealAdapterStrategy: ContractModelDealAdapterStrategy,
  ) {

    super(
      pageService,
      formService,
      activatedRoute,
    );
  }

  /**
   * @inheritDoc
   */
  protected getFieldTabMapping(): Dictionary<PageTabEnum> {

    const fieldTabMapping: Dictionary<PageTabEnum> = {};
    const model = new ContractModel();

    // General tab
    Object
      .keys(this.contractModelGeneralAdapterStrategy.getFormControlConfig(model))
      .forEach((controlName) => fieldTabMapping[controlName] = PageTabEnum.contractWriteGeneral)
    ;

    // Deal tab
    Object
      .keys(this.contractModelDealAdapterStrategy.getFormControlConfig(model))
      .forEach((controlName) => fieldTabMapping[controlName] = PageTabEnum.contractWriteDeal)
    ;

    return fieldTabMapping;
  }
}
