import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { EntityEnum } from '../../shared/enum/entity.enum';
import { AutocompleteSelectionInterface } from '../../shared/interface/autocomplete-selection.interface';
import { LeadSearchModel } from '../../shared/model/lead-search.model';
import { LeadSearchOptionsInterface } from '../../shared/interface/lead-search-options.interface';
import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';
import { FormModelAdapterStrategy } from '../../core/shared/form/form-model-adapter.strategy';

@Component({
  selector: 'app-lead-form-search',
  templateUrl: './lead-form-search.component.html',
  styleUrls: ['./lead-form-search.component.scss'],
})
export class LeadFormSearchComponent extends FormComponentAbstract<
  LeadSearchModel,
  LeadSearchOptionsInterface
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
    protected modelAdapterStrategy: FormModelAdapterStrategy<LeadSearchModel>,
  ) {

    super(formBuilder, modelAdapterStrategy);
  }

  /**
   * Changed autocomplete contact selection
   */
  onChangeSelectionContact(selection: AutocompleteSelectionInterface): void {

    return this.setValue('clientId', selection.id);
  }

  /**
   * Changed autocomplete property selection
   */
  onChangeSelectionProperty(selection: AutocompleteSelectionInterface): void {

    return this.setValue('propertyId', selection.id);
  }
}
