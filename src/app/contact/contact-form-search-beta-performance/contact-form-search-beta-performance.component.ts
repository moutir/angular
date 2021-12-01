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
  selector: 'app-contact-form-search-beta-performance',
  templateUrl: './contact-form-search-beta-performance.component.html',
  styleUrls: ['./contact-form-search-beta-performance.component.scss'],
})
export class ContactFormSearchBetaPerformanceComponent extends FormComponentAbstract<
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
  readonly AUTOCOMPLETE_ENTITIES_PROPERTY: EntityEnum[] = [EntityEnum.property];
  readonly AUTOCOMPLETE_ENTITIES_LOCATION_PATH: EntityEnum[] = [EntityEnum.locationPath];
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
   * Changed autocomplete property selection
   */
  onChangeSelectionProperty(selection: AutocompleteSelectionInterface): void {

    const value = this.model.propertyIds.slice(0);
    value.push(selection.id);

    this.setValue('propertyIds', value);
  }

  /**
   * Changed autocomplete location path selection
   */
  onChangeSelectionLocationPath(selection: AutocompleteSelectionInterface): void {

    this.setValue('locationPath', selection.id);
  }
}
