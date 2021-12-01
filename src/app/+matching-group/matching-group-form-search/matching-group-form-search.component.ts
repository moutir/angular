import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { MatchingGroupSearchModel } from '../../shared/model/matching-group-search.model';
import { EntityEnum } from '../../shared/enum/entity.enum';
import { AutocompleteSelectionInterface } from '../../shared/interface/autocomplete-selection.interface';
import { MatchingGroupSearchOptionsInterface } from '../../shared/interface/matching-group-search-options.interface';
import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';
import { FormModelAdapterStrategy } from '../../core/shared/form/form-model-adapter.strategy';

@Component({
  selector: 'app-matching-group-form-search',
  templateUrl: './matching-group-form-search.component.html',
  styleUrls: ['./matching-group-form-search.component.scss'],
})
export class MatchingGroupFormSearchComponent extends FormComponentAbstract<
  MatchingGroupSearchModel,
  MatchingGroupSearchOptionsInterface
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
    protected modelAdapterStrategy: FormModelAdapterStrategy<MatchingGroupSearchModel>,
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
