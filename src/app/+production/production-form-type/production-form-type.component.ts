import { Component, Input, OnChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';
import { ProductionModelTypeAdapterStrategy } from '../../core/shared/production/production-model-type-adapter.strategy';
import { ProductionOptionsInterface } from '../../shared/interface/production-options.interface';
import { ProductionModel } from '../../shared/model/production.model';
import { ProductionTypeEnum } from '../../shared/enum/production-type.enum';
import { ProductionValueInterface } from '../../shared/interface/production-value.interface';
import { Dictionary } from '../../shared/class/dictionary';
import { RuntimeSettingsInterface } from '../../shared/interface/runtime-settings.interface';

@Component({
  selector: 'app-production-form-type',
  templateUrl: './production-form-type.component.html',
  styleUrls: ['./production-form-type.component.scss'],
})
export class ProductionFormTypeComponent extends FormComponentAbstract<
  ProductionModel,
  ProductionOptionsInterface
> implements OnChanges {

  /**
   * Production type
   */
  @Input() type: ProductionTypeEnum;

  /**
   * Runtime settings
   */
  @Input() runtimeSettings: RuntimeSettingsInterface;

  /**
  * Constants
  */
  readonly TYPE_SALE_PER_YEAR: ProductionTypeEnum = ProductionTypeEnum.saleYearly;
  readonly TYPE_SALE_PER_MONTH: ProductionTypeEnum = ProductionTypeEnum.saleMonthly;
  readonly TYPE_RENTAL_PER_YEAR: ProductionTypeEnum = ProductionTypeEnum.rentalYearly;
  readonly TYPE_RENTAL_PER_MONTH: ProductionTypeEnum = ProductionTypeEnum.rentalMonthly;

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
   * @inheritDoc
   */
  constructor(
    protected formBuilder: FormBuilder,
    protected modelAdapterStrategy: ProductionModelTypeAdapterStrategy,
  ) {

    super(formBuilder, modelAdapterStrategy);
  }

  /**
   * Return the type specific form control name
   */
  getFormControlName(field: string): string {

    return this.modelAdapterStrategy.getFieldUid(field);
  }

  /**
   * @inheritDoc
   */
  protected build(): void {

    // Override model adapter strategy using current type
    this.modelAdapterStrategy = this.modelAdapterStrategy.clone(this.type);

    // Build form
    super.build();
  }
}
