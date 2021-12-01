import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Observable } from 'rxjs';

import { ProductionModel } from '../../shared/model/production.model';
import { PageReadComponentAbstract } from '../../shared/component/page-read/page-read-component.abstract';
import { ProductionPageService } from '../../core/shared/production/production-page.service';
import { ProductionOptionsInterface } from '../../shared/interface/production-options.interface';
import { PageTabEnum } from '../../shared/enum/page-tab.enum';
import { Dictionary } from '../../shared/class/dictionary';
import { ProductionValueInterface } from '../../shared/interface/production-value.interface';
import { BrowserService } from '../../core/shared/browser/browser.service';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { RuntimeSettingsInterface } from '../../shared/interface/runtime-settings.interface';
import { ProductionFrequencyInterface } from '../../shared/interface/production-frequency.interface';
import { ProductionService } from '../../core/shared/production/production.service';

@Component({
  selector: 'app-production-page-read',
  templateUrl: './production-page-read.component.html',
  styleUrls: ['./production-page-read.component.scss'],
})
export class ProductionPageReadComponent extends PageReadComponentAbstract<
  ProductionModel,
  ProductionOptionsInterface
> implements OnInit {

  /**
   * Constants
   */
  readonly PAGE_TAB_SALE_YEARLY: PageTabEnum = PageTabEnum.productionReadSaleYearly;
  readonly PAGE_TAB_SALE_MONTHLY: PageTabEnum = PageTabEnum.productionReadSaleMonthly;
  readonly PAGE_TAB_RENTAL_YEARLY: PageTabEnum = PageTabEnum.productionReadRentalYearly;
  readonly PAGE_TAB_RENTAL_MONTHLY: PageTabEnum = PageTabEnum.productionReadRentalMonthly;

  /**
   * State observables
   */
  settings$: Observable<RuntimeSettingsInterface>;
  byFrequency$: Observable<ProductionFrequencyInterface>;

  /**
   * Production values
   */
  values: {
    saleYearly: Dictionary<ProductionValueInterface>,
    rentalYearly: Dictionary<ProductionValueInterface>,
    saleMonthly: Dictionary<ProductionValueInterface>,
    rentalMonthly: Dictionary<ProductionValueInterface>,
  } = {
    saleYearly: {},
    rentalYearly: {},
    saleMonthly: {},
    rentalMonthly: {},
  };

  /**
   * Production by frequency
   */
  byFrequency: ProductionFrequencyInterface;

  /**
   * Options
   */
  options: ProductionOptionsInterface;

  /**
   * Constructor
   */
  constructor(
    protected pageService: ProductionPageService,
    protected activatedRoute: ActivatedRoute,
    private runtimeService: RuntimeService,
    private browserService: BrowserService,
    private productionService: ProductionService,
  ) {

    super(
      pageService,
      activatedRoute,
    );
  }

  /**
   * Stepper's step changed
   */
  onSelectionChangeStep(event: StepperSelectionEvent, sectionName: string): void {

    this.values[sectionName] = this.byFrequency[sectionName][this.options[sectionName][event.selectedIndex].value];

    // Scroll to top
    this.browserService.scrollTo(0, 0, 300);
  }

  /**
   * @inheritDoc
   */
  protected setStateObservable(): void {

    super.setStateObservable();

    this.settings$ = this.runtimeService.selectSettings();
    this.byFrequency$ = this.productionService.selectByFrequency();

    // Production by frequency
    this.subscriptions.push(
      this.productionService.selectByFrequency().subscribe(byFrequency => this.byFrequency = byFrequency),
    );

    // Options
    this.subscriptions.push(
      this.pageService.selectOptions().subscribe(options => this.onNextOptions(options)),
    );
  }

  /**
   * @inheritDoc
   */
  private onNextOptions(options: ProductionOptionsInterface): void {

    this.options = options;

    this.values.saleMonthly = this.options.saleMonthly.length > 0 ?
      this.byFrequency.saleMonthly[this.options.saleMonthly[0].value] : {};

    this.values.rentalMonthly = this.options.rentalMonthly.length > 0 ?
      this.byFrequency.rentalMonthly[this.options.rentalMonthly[0].value] : {};

    this.values.saleYearly = this.options.saleYearly.length > 0 ?
      this.byFrequency.saleYearly[this.options.saleYearly[0].value] : {};

    this.values.rentalYearly = this.options.rentalYearly.length > 0 ?
      this.byFrequency.rentalYearly[this.options.rentalYearly[0].value] : {};
  }
}
