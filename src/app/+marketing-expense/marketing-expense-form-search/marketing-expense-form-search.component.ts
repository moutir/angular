import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { EntityEnum } from '../../shared/enum/entity.enum';
import { AutocompleteSelectionInterface } from '../../shared/interface/autocomplete-selection.interface';
import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';
import { MarketingExpenseSearchModel } from '../../shared/model/marketing-expense-search.model';
import { MarketingExpenseSearchOptionsInterface } from '../../shared/interface/marketing-expense-search-options.interface';
import { FormModelAdapterStrategy } from '../../core/shared/form/form-model-adapter.strategy';

@Component({
  selector: 'app-marketing-expense-form-search',
  templateUrl: './marketing-expense-form-search.component.html',
  styleUrls: ['./marketing-expense-form-search.component.scss'],
})
export class MarketingExpenseFormSearchComponent extends FormComponentAbstract<
  MarketingExpenseSearchModel,
  MarketingExpenseSearchOptionsInterface
> {

  /**
   * Constants
   */
  readonly AUTOCOMPLETE_ENTITIES_PROPERTY: EntityEnum[] = [EntityEnum.property];
  readonly AUTOCOMPLETE_ENTITIES_PROMOTION: EntityEnum[] = [EntityEnum.promotion];

  /**
   * Constructor
   */
  constructor(
    protected formBuilder: FormBuilder,
    protected modelAdapterStrategy: FormModelAdapterStrategy<MarketingExpenseSearchModel>,
  ) {

    super(formBuilder, modelAdapterStrategy);
  }

  /**
   * Changed autocomplete promotion selection
   */
  onChangeSelectionPromotion(selection: AutocompleteSelectionInterface): void {

    return this.setValue('promotionId', selection.id);
  }

  /**
   * Changed autocomplete property selection
   */
  onChangeSelectionProperty(selection: AutocompleteSelectionInterface): void {

    return this.setValue('propertyId', selection.id);
  }
}
