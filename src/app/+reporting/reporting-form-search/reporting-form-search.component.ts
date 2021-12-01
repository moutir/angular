import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { EntityEnum } from '../../shared/enum/entity.enum';
import { AutocompleteSelectionInterface } from '../../shared/interface/autocomplete-selection.interface';
import { ReportingSearchOptionsInterface } from '../../shared/interface/reporting-search-options.interface';
import { ReportingSearchModel } from '../../shared/model/reporting-search.model';
import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';
import { FormModelAdapterStrategy } from '../../core/shared/form/form-model-adapter.strategy';

@Component({
  selector: 'app-reporting-form-search',
  templateUrl: './reporting-form-search.component.html',
  styleUrls: ['./reporting-form-search.component.scss'],
})
export class ReportingFormSearchComponent extends FormComponentAbstract<
  ReportingSearchModel,
  ReportingSearchOptionsInterface
> {

  /**
   * Constants
   */
  readonly AUTOCOMPLETE_ENTITIES_PROPERTY_PROMOTION_LOCATION: EntityEnum[] = [EntityEnum.property, EntityEnum.promotion, EntityEnum.location];
  readonly AUTOCOMPLETE_ENTITIES_CONTACT: EntityEnum[] = [EntityEnum.contact];

  /**
   * @inheritDoc
   */
  constructor(
    protected formBuilder: FormBuilder,
    protected modelAdapterStrategy: FormModelAdapterStrategy<ReportingSearchModel>,
  ) {

    super(formBuilder, modelAdapterStrategy);
  }

  /**
   * Changed autocomplete contact selection
   */
  onChangeSelectionContact(selection: AutocompleteSelectionInterface): void {

    return this.setValue('contactId', selection.id);
  }

  /**
   * Changed autocomplete property/promotion/location selection
   */
  onChangeSelectionPropertyPromotionLocation(selection: AutocompleteSelectionInterface): void {

    // Property
    if (selection.entity === EntityEnum.property) {

      const value = this.model.propertyIds.slice(0);
      value.push(selection.id);

      return this.setValue('propertyIds', value);
    }

    // Promotion
    if (selection.entity === EntityEnum.promotion) {

      const value = this.model.promotionIds.slice(0);
      value.push(selection.id);

      return this.setValue('promotionIds', value);
    }

    // Location
    if (selection.entity === EntityEnum.location) {

      const value = this.model.propertyIds.slice(0);
      value.push(selection.id);

      // Yes, it is updating the `propertyIds` input, you are not dreaming // TODO[nico] split this into locationIds
      return this.setValue('propertyIds', value);
    }
  }
}
