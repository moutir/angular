import { Component, OnChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { PromotionSearchModel } from '../../shared/model/promotion-search.model';
import { EntityEnum } from '../../shared/enum/entity.enum';
import { AutocompleteSelectionInterface } from '../../shared/interface/autocomplete-selection.interface';
import { PromotionSearchOptionsInterface } from '../../shared/interface/promotion-search-options.interface';
import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';
import { FormModelAdapterStrategy } from '../../core/shared/form/form-model-adapter.strategy';

@Component({
  selector: 'app-promotion-form-search',
  templateUrl: './promotion-form-search.component.html',
  styleUrls: ['./promotion-form-search.component.scss'],
})
export class PromotionFormSearchComponent extends FormComponentAbstract<
  PromotionSearchModel,
  PromotionSearchOptionsInterface
> implements OnChanges {

  /**
   * Constants
   */
  readonly AUTOCOMPLETE_ENTITIES_CONTACT: EntityEnum[] = [EntityEnum.contact];
  readonly AUTOCOMPLETE_ENTITIES_PROMOTION_LOCATION: EntityEnum[] = [EntityEnum.promotion, EntityEnum.location];

  /**
   * Constructor
   */
  constructor(
    protected formBuilder: FormBuilder,
    protected modelAdapterStrategy: FormModelAdapterStrategy<PromotionSearchModel>,
  ) {

    super(formBuilder, modelAdapterStrategy);
  }

  /**
   * Changed autocomplete promotion/location selection
   */
  onChangeSelectionPromotionLocation(selection: AutocompleteSelectionInterface): void {

    // Promotion
    if (selection.entity === EntityEnum.promotion) {

      const value = this.model.promotionIds.slice(0);
      value.push(selection.id);

      return this.setValue('promotionIds', value);
    }

    // Location
    if (selection.entity === EntityEnum.location) {

      const value = this.model.promotionIds.slice(0);
      value.push(selection.id);

      return this.setValue('promotionIds', value);
    }
  }

  /**
   * Changed autocomplete contact selection
   */
  onChangeSelectionContact(selection: AutocompleteSelectionInterface): void {

    return this.setValue('contactId', selection.id);
  }
}
