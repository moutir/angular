import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { ContactSearchModel } from '../../shared/model/contact-search.model';
import { ContactSearchOptionsInterface } from '../../shared/interface/contact-search-options.interface';
import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';
import { AutocompleteSelectionInterface } from '../../shared/interface/autocomplete-selection.interface';
import { EntityEnum } from '../../shared/enum/entity.enum';
import { FormModelAdapterStrategy } from '../../core/shared/form/form-model-adapter.strategy';
import { PermissionEnum } from '../../shared/enum/permission.enum';

@Component({
  selector: 'app-contact-form-search',
  templateUrl: './contact-form-search.component.html',
  styleUrls: ['./contact-form-search.component.scss'],
})
export class ContactFormSearchComponent extends FormComponentAbstract<
  ContactSearchModel,
  ContactSearchOptionsInterface
> {

  /**
   *  List of permissions granted
   */
  @Input() permissions: PermissionEnum[];

  /**
   * Constants
   */
  readonly AUTOCOMPLETE_ENTITIES_PROPERTY_LOCATION: EntityEnum[] = [EntityEnum.property, EntityEnum.location];
  readonly AUTOCOMPLETE_ENTITIES_CONTACT: EntityEnum[] = [EntityEnum.contact];
  readonly PERMISSION_AGENCY_GROUP_ADMIN: PermissionEnum = PermissionEnum.agencyGroupAdmin;

  /**
   * Constructor
   */
  constructor(
    protected formBuilder: FormBuilder,
    protected modelAdapterStrategy: FormModelAdapterStrategy<ContactSearchModel>,
  ) {

    super(formBuilder, modelAdapterStrategy);
  }

  /**
   * Changed autocomplete contact selection
   */
  onChangeSelectionContact(selection: AutocompleteSelectionInterface): void {

    this.setValue('contactTextSearch', '');
    this.setValue('contactId', selection.id);
  }

  /**
   * Changed autocomplete property/location selection
   */
  onChangeSelectionPropertyLocation(selection: AutocompleteSelectionInterface): void {

    // Property
    if (selection.entity === EntityEnum.property) {

      const value = this.model.propertyIds.slice(0);
      value.push(selection.id);

      this.setValue('propertyTextSearch', '');
      this.setValue('propertyIds', value);

      return;
    }

    // Location
    if (selection.entity === EntityEnum.location) {

      const value = this.model.locationIds.slice(0);
      value.push(selection.id);

      this.setValue('propertyTextSearch', '');
      this.setValue('locationIds', value);

      return;
    }
  }

  /**
   * Changed autocomplete contact query
   */
  onChangeQueryContact(query: string): void {

    this.setValue('contactTextSearch', query);
  }

  /**
   * Changed autocomplete property/location query
   */
  onChangeQueryPropertyLocation(query: string): void {

    this.setValue('propertyTextSearch', query);
  }
}
