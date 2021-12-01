import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { EffectsAbstract } from '../../ui-page/effects.abstract';
import { AccountService } from '../../../core/shared/account/account.service';
import { AccountPageService } from '../../../core/shared/account/account-page.service';
import { AccountModel } from '../../../shared/model/account.model';
import { AccountOptionsInterface } from '../../../shared/interface/account-options.interface';
import { AccountUpsert } from '../../data-account/actions/account-upsert';
import { FormService } from '../../../core/shared/form.service';

@Injectable()
export class PageEffects extends EffectsAbstract<AccountModel, AccountOptionsInterface> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected formService: FormService,
    protected pageService: AccountPageService,
    protected modelService: AccountService,
  ) {

    super(actions$, formService, pageService, modelService);
  }

  /**
   * @inheritDoc
   */
  protected getUpsertAction(model: AccountModel): Action {

    return new AccountUpsert({
      models: [model],
    });
  }
}
