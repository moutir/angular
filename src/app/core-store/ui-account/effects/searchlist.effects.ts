import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

import { EffectsAbstract } from '../../ui-searchlist/effects.abstract';
import { AccountUpsert } from '../../data-account/actions/account-upsert';
import { AccountModel } from '../../../shared/model/account.model';
import { AccountSearchlistService } from '../../../core/shared/account/account-searchlist.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { AccountSearchModel } from '../../../shared/model/account-search.model';
import { AccountSearchOptionsInterface } from '../../../shared/interface/account-search-options.interface';
import { AccountService } from '../../../core/shared/account/account.service';

@Injectable()
export class SearchlistEffects extends EffectsAbstract<
  AccountModel,
  AccountSearchModel,
  AccountSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected runtimeService: RuntimeService,
    protected modelService: AccountService,
    protected searchlistService: AccountSearchlistService,
  ) {

    super(actions$, runtimeService, modelService, searchlistService);
  }

  /**
   * @inheritDoc
   */
  getUpsertAction(models: AccountModel[]): AccountUpsert {

    return new AccountUpsert({
      models: models,
    });
  }
}
