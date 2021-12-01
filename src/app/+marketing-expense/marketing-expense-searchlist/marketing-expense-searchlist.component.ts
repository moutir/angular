import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { RuntimeService } from '../../runtime/shared/runtime.service';
import { MarketingExpenseModel } from '../../shared/model/marketing-expense.model';
import { MarketingExpenseSearchModel } from '../../shared/model/marketing-expense-search.model';
import { MarketingExpenseSearchlistService } from '../../core/shared/marketing-expense/marketing-expense-searchlist.service';
import { SearchlistComponentAbstract } from '../../shared/component/searchlist/searchlist-component.abstract';
import { MarketingExpenseConfig } from '../../core/shared/marketing-expense/marketing-expense.config';
import { MarketingExpenseSearchOptionsInterface } from '../../shared/interface/marketing-expense-search-options.interface';
import { MarketingExpenseService } from '../../core/shared/marketing-expense/marketing-expense.service';

@Component({
  selector: 'app-marketing-expense-searchlist',
  templateUrl: './marketing-expense-searchlist.component.html',
})
export class MarketingExpenseSearchlistComponent extends SearchlistComponentAbstract<
  MarketingExpenseModel,
  MarketingExpenseSearchModel,
  MarketingExpenseSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: MarketingExpenseConfig,
    protected searchlistService: MarketingExpenseSearchlistService,
    protected runtimeService: RuntimeService,
    protected router: Router,
    protected marketingExpenseService: MarketingExpenseService,
  ) {

    super(
      moduleConfig,
      searchlistService,
      runtimeService,
      router,
    );
  }
}
