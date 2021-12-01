import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';

import { StateInterface } from '../../../core-store/state.interface';
import { PageServiceAbstract } from '../../../shared/service/page.service.abstract';
import { ContractConfig } from './contract.config';
import { ContractModel } from '../../../shared/model/contract.model';
import { ContractOptionsInterface } from '../../../shared/interface/contract-options.interface';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { ContractService } from './contract.service';
import { RuntimeOptionsInterface } from '../../../shared/interface/runtime-options.interface';
import { selectDataOptions, selectDataPermissions } from '../../../core-store/data-runtime/selectors';
import { OptionInterface } from '../../../shared/interface/option.interface';
import { selectUiBrokerOptions } from '../../../core-store/ui-contact/selectors';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { LanguageEnum } from '../../../shared/enum/language.enum';

@Injectable()
export class ContractPageService extends PageServiceAbstract<ContractModel, ContractOptionsInterface> {

  /**
   * Constructor
   */
  constructor(
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected router: Router,
    protected moduleConfig: ContractConfig,
    protected modelService: ContractService,
  ) {

    super(
      store$,
      runtimeService,
      router,
      moduleConfig,
      modelService,
    );
  }

  /**
   * @inheritDoc
   */
  protected getModelPageTitle(model: ContractModel, language: LanguageEnum): string {

    return model.reference || super.getModelPageTitle(model, language);
  }

  /**
   * @inheritDoc
   */
  protected getSelectorOptions(): MemoizedSelector<StateInterface, ContractOptionsInterface> {

    return createSelector(
      selectDataOptions,
      selectDataPermissions,
      selectUiBrokerOptions,
      (
        options: RuntimeOptionsInterface,
        permissions: PermissionEnum[],
        brokerOptions: OptionInterface[],
      ) => {

        return {
          step: options.propertyContractStep,
          sellType: options.propertyContractSellType,
          contactType: options.propertyContractContactType,
          commissionType: options.propertyContractCommissionType,
          broker: permissions.indexOf(PermissionEnum.contactRead) > -1 ? brokerOptions : [],
        };
      },
    );
  }
}
