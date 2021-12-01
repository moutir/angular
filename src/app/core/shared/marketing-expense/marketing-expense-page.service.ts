import { Injectable } from '@angular/core';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';
import { Router } from '@angular/router';

import { StateInterface } from '../../../core-store/state.interface';
import { PageServiceAbstract } from '../../../shared/service/page.service.abstract';
import { MarketingExpenseConfig } from './marketing-expense.config';
import { MarketingExpenseModel } from '../../../shared/model/marketing-expense.model';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { MarketingExpenseService } from './marketing-expense.service';
import { PageTypeEnum } from '../../../shared/enum/page-type.enum';
import { MarketingExpenseOptionsInterface } from '../../../shared/interface/marketing-expense-options.interface';
import { LanguageEnum } from '../../../shared/enum/language.enum';
import { selectDataSubSourceBySource } from '../../../core-store/data-lead/selectors';
import { Dictionary } from '../../../shared/class/dictionary';
import { OptionInterface } from '../../../shared/interface/option.interface';
import { RuntimeOptionsInterface } from '../../../shared/interface/runtime-options.interface';

@Injectable()
export class MarketingExpensePageService extends PageServiceAbstract<
  MarketingExpenseModel,
  MarketingExpenseOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected router: Router,
    protected moduleConfig: MarketingExpenseConfig,
    protected modelService: MarketingExpenseService,
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
  redirect(type: PageTypeEnum|null, id: string|null): void {

    // Home
    if (type === null) {

      this.router.navigate(['/agency']);
      return;
    }

    return super.redirect(type, id);
  }

  /**
   * @inheritDoc
   */
  protected getSelectorOptions(): MemoizedSelector<StateInterface, MarketingExpenseOptionsInterface> {

    return createSelector(
      this.getSelectorModel(),
      this.runtimeService.getSelectorOptions(),
      selectDataSubSourceBySource,
      (
        model: MarketingExpenseModel,
        options: RuntimeOptionsInterface,
        subSourceById: Dictionary<OptionInterface[]>,
      ): MarketingExpenseOptionsInterface => {

        return <MarketingExpenseOptionsInterface>{
          category: options.leadSource,
          subCategory: subSourceById[model.mainCategoryId] || [],
        };
      },
    );
  }

  /**
   * @inheritDoc
   */
  protected getModelPageTitle(model: MarketingExpenseModel, language: LanguageEnum): string {

    return model.title || super.getModelPageTitle(model, language);
  }
}
