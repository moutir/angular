import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';

import { MarketingExpenseModel } from '../../shared/model/marketing-expense.model';
import { PageWriteComponentAbstract } from '../../shared/component/page-write/page-write-component.abstract';
import { MarketingExpensePageService } from '../../core/shared/marketing-expense/marketing-expense-page.service';
import { MarketingExpenseOptionsInterface } from '../../shared/interface/marketing-expense-options.interface';
import { FormService } from '../../core/shared/form.service';
import { PageTabEnum } from '../../shared/enum/page-tab.enum';
import { Dictionary } from '../../shared/class/dictionary';
import { TrackerService } from '../../core/shared/tracker/tracker.service';
import { TrackingActionEnum } from '../../shared/enum/tracking-action.enum';

@Component({
  selector: 'app-marketing-expense-page-write',
  templateUrl: './marketing-expense-page-write.component.html',
})
export class MarketingExpensePageWriteComponent extends PageWriteComponentAbstract<
  MarketingExpenseModel,
  MarketingExpenseOptionsInterface
> implements OnInit {

  /**
   * Constants
   */
  readonly PAGE_TAB_GENERAL: PageTabEnum = PageTabEnum.marketingExpenseWriteGeneral;

  /**
   * Constructor
   */
  constructor(
    protected pageService: MarketingExpensePageService,
    protected formService: FormService,
    protected activatedRoute: ActivatedRoute,
    private trackerService: TrackerService,
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
  ngOnInit(): void {

    super.ngOnInit();

    this.pageService
      .selectModel()
      .pipe(take(1))
      .subscribe(model => {

        if (model.id) {

          // Stats
          this.trackerService.trackString(TrackingActionEnum.marketingExpenseView, model.id);
        }
      });
  }

  /**
   * @inheritDoc
   */
  protected getFieldTabMapping(): Dictionary<PageTabEnum> {

    const fieldTabMapping: Dictionary<PageTabEnum> = {};
    const model = new MarketingExpenseModel();

    // Set all model's attribute into general tab
    Object
      .keys(model)
      .forEach(field => fieldTabMapping[field] = PageTabEnum.marketingExpenseWriteGeneral);

    return fieldTabMapping;
  }
}
