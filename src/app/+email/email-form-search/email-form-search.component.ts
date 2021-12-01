import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { EntityEnum } from '../../shared/enum/entity.enum';
import { AutocompleteSelectionInterface } from '../../shared/interface/autocomplete-selection.interface';
import { EmailSearchOptionsInterface } from '../../shared/interface/email-search-options.interface';
import { EmailSearchModel } from '../../shared/model/email-search.model';
import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';
import { FormModelAdapterStrategy } from '../../core/shared/form/form-model-adapter.strategy';

@Component({
  selector: 'app-email-form-search',
  templateUrl: './email-form-search.component.html',
  styleUrls: ['./email-form-search.component.scss'],
})
export class EmailFormSearchComponent extends FormComponentAbstract<
  EmailSearchModel,
  EmailSearchOptionsInterface
> {

  /**
   * Constants
   */
  readonly AUTOCOMPLETE_ENTITIES_PROPERTY_PROMOTION: EntityEnum[] = [EntityEnum.property, EntityEnum.promotion];
  readonly AUTOCOMPLETE_ENTITIES_CONTACT: EntityEnum[] = [EntityEnum.contact];

  /**
   * Constructor
   */
  constructor(
    protected formBuilder: FormBuilder,
    protected modelAdapterStrategy: FormModelAdapterStrategy<EmailSearchModel>,
  ) {

    super(formBuilder, modelAdapterStrategy);
  }

  /**
   * Changed autocomplete contact selection
   */
  onChangeSelectionContact(selection: AutocompleteSelectionInterface): void {

    const value = this.model.contactIds.slice(0);
    value.push(selection.id);

    return this.setValue('contactIds', value);
  }

  /**
   * Changed autocomplete property or promotion selection
   */
  onChangeSelectionPropertyPromotion(selection: AutocompleteSelectionInterface): void {

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
  }
}
