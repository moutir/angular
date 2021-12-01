import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

import { EffectsAbstract } from '../../ui-searchlist/effects.abstract';
import { MarketingExpenseModel } from '../../../shared/model/marketing-expense.model';
import { MarketingExpenseUpsert } from '../../data-marketing-expense/actions/marketing-expense.upsert';
import { MarketingExpenseSearchlistService } from '../../../core/shared/marketing-expense/marketing-expense-searchlist.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { MarketingExpenseSearchModel } from '../../../shared/model/marketing-expense-search.model';
import { MarketingExpenseSearchOptionsInterface } from '../../../shared/interface/marketing-expense-search-options.interface';
import { MarketingExpenseService } from '../../../core/shared/marketing-expense/marketing-expense.service';

@Injectable()
export class SearchlistEffects extends EffectsAbstract<
  MarketingExpenseModel,
  MarketingExpenseSearchModel,
  MarketingExpenseSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected runtimeService: RuntimeService,
    protected modelService: MarketingExpenseService,
    protected searchlistService: MarketingExpenseSearchlistService,
  ) {

    super(actions$, runtimeService, modelService, searchlistService);
  }
  /**
   * @inheritDoc
   */
  protected getUpsertAction(models: MarketingExpenseModel[]): MarketingExpenseUpsert {

    return new MarketingExpenseUpsert({
      models: models,
    });
  }
}
