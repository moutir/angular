import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MarketingExpenseModel } from '../../shared/model/marketing-expense.model';
import { PageReadComponentAbstract } from '../../shared/component/page-read/page-read-component.abstract';
import { MarketingExpensePageService } from '../../core/shared/marketing-expense/marketing-expense-page.service';
import { MarketingExpenseOptionsInterface } from '../../shared/interface/marketing-expense-options.interface';
import { PageTabEnum } from '../../shared/enum/page-tab.enum';
import { TrackerService } from '../../core/shared/tracker/tracker.service';
import { TrackingActionEnum } from '../../shared/enum/tracking-action.enum';

@Component({
  selector: 'app-marketing-expense-page-read',
  templateUrl: './marketing-expense-page-read.component.html',
})
export class MarketingExpensePageReadComponent extends PageReadComponentAbstract<
  MarketingExpenseModel,
  MarketingExpenseOptionsInterface
> implements OnInit {

  /**
   * Constants
   */
  readonly PAGE_TAB_GENERAL: PageTabEnum = PageTabEnum.marketingExpenseReadGeneral;

  /**
   * Category labels
   */
  mainCategoryLabel: string = '';
  subCategoryLabel: string = '';

  /**
   * Tooltip category
   */
  categoryTooltip: string = '';

  /**
   * Constructor
   */
  constructor(
    protected pageService: MarketingExpensePageService,
    protected activatedRoute: ActivatedRoute,
    private trackerService: TrackerService,
  ) {

    super(
      pageService,
      activatedRoute,
    );
  }

  /**
   * @inheritDoc
   */
  ngOnInit(): void {

    super.ngOnInit();

    if (this.model.id) {

      // Stats
      this.trackerService.trackString(TrackingActionEnum.marketingExpenseView, this.model.id);
    }
  }

  /**
   * @inheritDoc
   */
  protected setStateObservable(): void {

    super.setStateObservable();

    // Options
    this.subscriptions.push(
      this.pageService.selectOptions().subscribe(options => {

        const mainCategoryOption = options.category.find(option => String(option.value) === this.model.mainCategoryId);
        this.mainCategoryLabel = mainCategoryOption ? mainCategoryOption.text : '';

        const subCategoryOption = options.subCategory.find(option => String(option.value) === this.model.subCategoryId);
        this.subCategoryLabel = subCategoryOption ? subCategoryOption.text : '';

        this.categoryTooltip = [this.mainCategoryLabel, this.subCategoryLabel].filter(value => !!value).join(' > ');
      }),
    );
  }
}
