import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { ContractSearchOptionsInterface } from '../../shared/interface/contract-search-options.interface';
import { ContractSearchModel } from '../../shared/model/contract-search.model';
import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';
import { FormModelAdapterStrategy } from '../../core/shared/form/form-model-adapter.strategy';
import { AutocompleteSelectionInterface } from '../../shared/interface/autocomplete-selection.interface';
import { EntityEnum } from '../../shared/enum/entity.enum';

@Component({
  selector: 'app-contract-form-search',
  templateUrl: './contract-form-search.component.html',
  styleUrls: ['./contract-form-search.component.scss'],
})
export class ContractFormSearchComponent extends FormComponentAbstract<
  ContractSearchModel,
  ContractSearchOptionsInterface
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
    protected modelAdapterStrategy: FormModelAdapterStrategy<ContractSearchModel>,
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
