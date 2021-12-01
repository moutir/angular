import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';
import { LeadModel } from '../../shared/model/lead.model';
import { LeadModelGeneralAdapterStrategy } from '../../core/shared/lead/lead-model-general-adapter.strategy';
import { LeadOptionsInterface } from '../../shared/interface/lead-options.interface';
import { EntityEnum } from '../../shared/enum/entity.enum';
import { AutocompleteSelectionInterface } from '../../shared/interface/autocomplete-selection.interface';
import { ContactModel } from '../../shared/model/contact.model';
import { PromotionModel } from '../../shared/model/promotion.model';
import { PropertyModel } from '../../shared/model/property.model';
import { LeadService } from '../../core/shared/lead/lead.service';
import { ContactEmailModel } from '../../shared/model/contact-email.model';

@Component({
  selector: 'app-lead-form-general',
  templateUrl: './lead-form-general.component.html',
  styleUrls: ['./lead-form-general.component.scss'],
})
export class LeadFormGeneralComponent extends FormComponentAbstract<
  LeadModel,
  LeadOptionsInterface
> {

  /**
   * Constants
   */
  readonly AUTOCOMPLETE_ENTITIES_CONTACT: EntityEnum[] = [EntityEnum.contact];
  readonly AUTOCOMPLETE_ENTITIES_PROPERTY: EntityEnum[] = [EntityEnum.property];
  readonly AUTOCOMPLETE_ENTITIES_PROMOTION: EntityEnum[] = [EntityEnum.promotion];

  /**
   * @inheritDoc
   */
  constructor(
    protected formBuilder: FormBuilder,
    protected modelAdapterStrategy: LeadModelGeneralAdapterStrategy,
    private leadService: LeadService,
  ) {

    super(formBuilder, modelAdapterStrategy);
  }

  /**
   * Changed query on autocomplete contact
   */
  onChangeQueryContact(query: string): void {

    if (query !== '') {

      return;
    }

    return this.setValue('contact', new ContactModel());
  }

  /**
   * Changed query on autocomplete property
   */
  onChangeQueryProperty(query: string): void {

    if (query !== '' || this.model.properties.length > 1) {

      return;
    }

    return this.setValue('properties', []);
  }

  /**
   * Changed query on autocomplete promotion
   */
  onChangeQueryPromotion(query: string): void {

    if (query !== '' || this.model.promotions.length > 1) {

      return;
    }

    return this.setValue('promotions', []);
  }

  /**
   * Changed selection autocomplete contact
   */
  onChangeSelectionContact(selection: AutocompleteSelectionInterface): void {

    const segments = selection.text.split(' - ');

    // Generate contact
    const contact = new ContactModel();
    contact.id = selection.id;
    contact.fullName = (segments[0] || '').trim();

    // Email
    if (segments[1]) {

      const email = new ContactEmailModel();
      email.emailId = segments[1];
      contact.emails.push(email);
    }

    // Update input value
    return this.setValue('contact', contact);
  }

  /**
   * Changed selection autocomplete property
   */
  onChangeSelectionProperty(selection: AutocompleteSelectionInterface): void {

    this.setValueAutocompleteProperty(selection);
  }

  /**
   * Changed selection autocomplete promotion
   */
  onChangeSelectionPromotion(selection: AutocompleteSelectionInterface): void {

    this.setValueAutocompletePromotion(selection);
  }

  /**
   * Clicked the button to remove entity
   */
  onClickRemoveEntity(index: number, fieldName: keyof LeadModel): void {

    const entities = this.formGroup.get(fieldName).value.filter((entity, i) => i !== index);

    // Update input by removing an entity
    this.setValue(fieldName, entities);
  }

  /**
   * Clicked on contact validation button
   */
  onClickValidate(): void {

    this.leadService.toggleValidation(true);
  }

  /**
   * Set value for autocomplete property
   */
  private setValueAutocompleteProperty(selection: AutocompleteSelectionInterface): void {

    let properties = this.formGroup.get('properties').value.slice(0);
    const isExisting = properties.find(p => p.id === selection.id);

    // Property already selected
    if (isExisting) {

      return;
    }

    // Generate property
    const property = new PropertyModel();
    property.id = selection.id;
    property.reference = selection.text;
    property.isLoading = true;

    properties = !this.model.id ? [ ...properties, property] : [property];

    // Update input by adding a property
    return this.setValue('properties', properties);
  }

  /**
   * Set value for autocomplete promotion
   */
  private setValueAutocompletePromotion(selection: AutocompleteSelectionInterface): void {

    let promotions = this.formGroup.get('promotions').value.slice(0);
    const isExisting = promotions.find(p => p.id === selection.id);

    // Promotion already selected
    if (isExisting) {

      return;
    }

    // Generate promotion
    const promotion = new PromotionModel();
    promotion.id = selection.id;
    promotion.reference = selection.text;
    promotion.isLoading = true;

    promotions = !this.model.id ? [ ...promotions, promotion] : [promotion];

    // Update input by adding a promotion
    return this.setValue('promotions', promotions);
  }
}
