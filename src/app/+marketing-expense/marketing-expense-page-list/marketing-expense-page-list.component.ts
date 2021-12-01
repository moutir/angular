import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BrowserService } from '../../core/shared/browser/browser.service';
import { PageListComponentAbstract } from '../../shared/component/page-list/page-list-component.abstract';
import { MarketingExpensePageService } from '../../core/shared/marketing-expense/marketing-expense-page.service';
import { MarketingExpenseModel } from '../../shared/model/marketing-expense.model';
import { MarketingExpenseSearchModel } from '../../shared/model/marketing-expense-search.model';
import { MarketingExpenseSearchlistService } from '../../core/shared/marketing-expense/marketing-expense-searchlist.service';
import { MarketingExpenseSearchOptionsInterface } from '../../shared/interface/marketing-expense-search-options.interface';
import { RouterService } from '../../core/shared/router/router.service';

@Component({
  selector: 'app-marketing-expense-page-list',
  templateUrl: './marketing-expense-page-list.component.html',
  styleUrls: ['./marketing-expense-page-list.component.scss'],
})
export class MarketingExpensePageListComponent extends PageListComponentAbstract<
MarketingExpenseModel,
MarketingExpenseSearchModel,
MarketingExpenseSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected pageService: MarketingExpensePageService,
    protected searchlistService: MarketingExpenseSearchlistService,
    protected browserService: BrowserService,
    protected activatedRoute: ActivatedRoute,
    protected routerService: RouterService,
  ) {

    super(
      pageService,
      searchlistService,
      browserService,
      activatedRoute,
      routerService,
    );
  }
}
