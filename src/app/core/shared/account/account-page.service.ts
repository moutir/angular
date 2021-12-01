import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';

import { StateInterface } from '../../../core-store/state.interface';
import { PageServiceAbstract } from '../../../shared/service/page.service.abstract';
import { AccountConfig } from './account.config';
import { AccountModel } from '../../../shared/model/account.model';
import { AccountOptionsInterface } from '../../../shared/interface/account-options.interface';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { AccountService } from './account.service';
import { RuntimeOptionsInterface } from '../../../shared/interface/runtime-options.interface';
import { LanguageEnum } from '../../../shared/enum/language.enum';
import { selectUiModel } from '../../../core-store/ui-page/selectors';
import { selectDataAuthentication, selectDataSettings } from '../../../core-store/data-runtime/selectors';
import { RuntimeAuthenticationInterface } from '../../../shared/interface/runtime-authentication.interface';
import { AccountTypeEnum } from '../../../shared/enum/account-type.enum';
import { RuntimeSettingsInterface } from '../../../shared/interface/runtime-settings.interface';

@Injectable()
export class AccountPageService extends PageServiceAbstract<AccountModel, AccountOptionsInterface> {

  /**
   * Constructor
   */
  constructor(
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected router: Router,
    protected moduleConfig: AccountConfig,
    protected modelService: AccountService,
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
  protected getModelPageTitle(model: AccountModel, language: LanguageEnum): string {

    return model.login || super.getModelPageTitle(model, language);
  }

  /**
   * @inheritDoc
   */
  protected getSelectorOptions(): MemoizedSelector<StateInterface, AccountOptionsInterface> {

    return createSelector(
      this.runtimeService.getSelectorOptions(),
      (
        runtimeOptions: RuntimeOptionsInterface,
      ) => {

        return {
          language: runtimeOptions.languageCommunication,
          accountType: runtimeOptions.accountType,
          agency: runtimeOptions.agencyRelated,
        };
      },
    );
  }

  /**
   * @inheritDoc
   */
  protected getSelectorModel(): MemoizedSelector<StateInterface, AccountModel> {

    return createSelector(
      selectUiModel,
      selectDataAuthentication,
      selectDataSettings,
      (
        model: AccountModel,
        authentication: RuntimeAuthenticationInterface,
        settings: RuntimeSettingsInterface,
      ): AccountModel => {

        if (model) {

          return model;
        }

        const newModel = this.modelService.factory();

        newModel.contact.agency.id = authentication.agencyId;
        newModel.accountType.value = AccountTypeEnum.broker;
        newModel.language.value = settings.language.current;

        return newModel;
      },
    );
  }
}
