import { Component, OnChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { MarketingExpenseModelGeneralAdapterStrategy } from '../../core/shared/marketing-expense/marketing-expense-model-general-adapter.strategy';
import { PageTabEnum } from '../../shared/enum/page-tab.enum';
import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';
import { MarketingExpenseModel } from '../../shared/model/marketing-expense.model';
import { MarketingExpenseOptionsInterface } from '../../shared/interface/marketing-expense-options.interface';
import { EntityEnum } from '../../shared/enum/entity.enum';
import { AutocompleteSelectionInterface } from '../../shared/interface/autocomplete-selection.interface';
import { PropertyModel } from '../../shared/model/property.model';
import { PromotionModel } from '../../shared/model/promotion.model';

@Component({
  selector: 'app-marketing-expense-form-general',
  templateUrl: './marketing-expense-form-general.component.html',
  styleUrls: ['./marketing-expense-form-general.component.scss'],
})
export class MarketingExpenseFormGeneralComponent extends FormComponentAbstract<
  MarketingExpenseModel,
  MarketingExpenseOptionsInterface
> implements OnChanges {

  /**
   * Constants
   */
  readonly PAGE_TAB_GENERAL: PageTabEnum = PageTabEnum.marketingExpenseWriteGeneral;
  readonly AUTOCOMPLETE_ENTITIES_PROPERTY: EntityEnum[] = [EntityEnum.property];
  readonly AUTOCOMPLETE_ENTITIES_PROMOTION: EntityEnum[] = [EntityEnum.promotion];

  /**
   * @inheritDoc
   */
  constructor(
    protected formBuilder: FormBuilder,
    protected modelAdapterStrategy: MarketingExpenseModelGeneralAdapterStrategy,
  ) {

    super(formBuilder, modelAdapterStrategy);
  }

  /**
   * Changed selection autocomplete property
   */
  onChangeSelectionProperty(selection: AutocompleteSelectionInterface, index: number): void {

    const property = new PropertyModel();
    property.id = selection.id;
    property.reference = selection.text;

    this.setValue(['properties', index, 'property'].join('.'), property);
  }

  /**
   * Changed selection autocomplete promotion
   */
  onChangeSelectionPromotion(selection: AutocompleteSelectionInterface, index: number): void {

    const promotion = new PromotionModel();
    promotion.id = selection.id;
    promotion.name = selection.text;

    this.setValue(['promotions', index, 'promotion'].join('.'), promotion);
  }
}
