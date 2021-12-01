import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { ProductionModel } from '../../shared/model/production.model';
import { PageWriteComponentAbstract } from '../../shared/component/page-write/page-write-component.abstract';
import { ProductionPageService } from '../../core/shared/production/production-page.service';
import { ProductionOptionsInterface } from '../../shared/interface/production-options.interface';
import { FormService } from '../../core/shared/form.service';
import { PageTabEnum } from '../../shared/enum/page-tab.enum';
import { Dictionary } from '../../shared/class/dictionary';
import { ProductionTypeEnum } from '../../shared/enum/production-type.enum';
import { RuntimeSettingsInterface } from '../../shared/interface/runtime-settings.interface';
import { RuntimeService } from '../../runtime/shared/runtime.service';

@Component({
  selector: 'app-production-page-write',
  templateUrl: './production-page-write.component.html',
  styleUrls: ['./production-page-write.component.scss'],
})
export class ProductionPageWriteComponent extends PageWriteComponentAbstract<ProductionModel, ProductionOptionsInterface> {

  /**
   * State observables
   */
  runtimeSettings$: Observable<RuntimeSettingsInterface>;

  /**
   * Constants
   */
  readonly PAGE_TAB_SALE_YEARLY: PageTabEnum = PageTabEnum.productionWriteSaleYearly;
  readonly PAGE_TAB_SALE_MONTHLY: PageTabEnum = PageTabEnum.productionWriteSaleMonthly;
  readonly PAGE_TAB_RENTAL_YEARLY: PageTabEnum = PageTabEnum.productionWriteRentalYearly;
  readonly PAGE_TAB_RENTAL_MONTHLY: PageTabEnum = PageTabEnum.productionWriteRentalMonthly;
  readonly TYPE_SALE_PER_YEAR: ProductionTypeEnum = ProductionTypeEnum.saleYearly;
  readonly TYPE_SALE_PER_MONTH: ProductionTypeEnum = ProductionTypeEnum.saleMonthly;
  readonly TYPE_RENTAL_PER_YEAR: ProductionTypeEnum = ProductionTypeEnum.rentalYearly;
  readonly TYPE_RENTAL_PER_MONTH: ProductionTypeEnum = ProductionTypeEnum.rentalMonthly;

  /**
   * Constructor
   */
  constructor(
    protected pageService: ProductionPageService,
    protected formService: FormService,
    protected activatedRoute: ActivatedRoute,
    private runtimeService: RuntimeService,
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
  protected getFieldTabMapping(): Dictionary<PageTabEnum> {

    const fieldTabMapping: Dictionary<PageTabEnum> = {};

    fieldTabMapping.saleYearly = PageTabEnum.productionWriteSaleYearly;
    fieldTabMapping.saleMonthly = PageTabEnum.productionWriteSaleMonthly;
    fieldTabMapping.rentalYearly = PageTabEnum.productionWriteSaleYearly;
    fieldTabMapping.rentalMonthly = PageTabEnum.productionWriteRentalMonthly;

    return fieldTabMapping;
  }

  /**
   * @inheritDoc
   */
  protected setStateObservable(): void {

    super.setStateObservable();

    this.runtimeSettings$ = this.runtimeService.selectSettings();
  }
}
