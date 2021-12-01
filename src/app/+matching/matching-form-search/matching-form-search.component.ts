import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { MatchingSearchModel } from '../../shared/model/matching-search.model';
import { EntityEnum } from '../../shared/enum/entity.enum';
import { AutocompleteSelectionInterface } from '../../shared/interface/autocomplete-selection.interface';
import { MatchingSearchOptionsInterface } from '../../shared/interface/matching-search-options.interface';
import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';
import { FormModelAdapterStrategy } from '../../core/shared/form/form-model-adapter.strategy';

@Component({
  selector: 'app-matching-form-search',
  templateUrl: './matching-form-search.component.html',
  styleUrls: ['./matching-form-search.component.scss'],
})
export class MatchingFormSearchComponent extends FormComponentAbstract<
  MatchingSearchModel,
  MatchingSearchOptionsInterface
> {

  /**
   * Constants
   */
  readonly AUTOCOMPLETE_ENTITIES_PROPERTY: EntityEnum[] = [EntityEnum.property];
  readonly AUTOCOMPLETE_ENTITIES_CONTACT: EntityEnum[] = [EntityEnum.contact];

  /**
   * Constructor
   */
  constructor(
    protected formBuilder: FormBuilder,
    protected modelAdapterStrategy: FormModelAdapterStrategy<MatchingSearchModel>,
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
   * Changed autocomplete property selection
   */
  onChangeSelectionProperty(selection: AutocompleteSelectionInterface): void {

    return this.setValue('propertyId', selection.id);
  }
}
