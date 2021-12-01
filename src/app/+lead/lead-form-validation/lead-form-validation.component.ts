import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';
import { LeadModel } from '../../shared/model/lead.model';
import { LeadOptionsInterface } from '../../shared/interface/lead-options.interface';
import { EntityEnum } from '../../shared/enum/entity.enum';
import { LeadModelValidationAdapterStrategy } from '../../core/shared/lead/lead-model-validation-adapter.strategy';
import { ContactModel } from '../../shared/model/contact.model';
import { AutocompleteSelectionInterface } from '../../shared/interface/autocomplete-selection.interface';
import { ContactEmailModel } from '../../shared/model/contact-email.model';
import { LeadService } from '../../core/shared/lead/lead.service';

@Component({
  selector: 'app-lead-form-validation',
  templateUrl: './lead-form-validation.component.html',
  styleUrls: ['./lead-form-validation.component.scss'],
})
export class LeadFormValidationComponent extends FormComponentAbstract<
  LeadModel,
  LeadOptionsInterface
> {

  /**
   * Constants
   */
  readonly AUTOCOMPLETE_ENTITIES_CONTACT: EntityEnum[] = [EntityEnum.contact];

  /**
   * Is the form submitted ?
   */
  isSubmitted: boolean = false;

  /**
   * @inheritDoc
   */
  constructor(
    protected formBuilder: FormBuilder,
    protected modelAdapterStrategy: LeadModelValidationAdapterStrategy,
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

    return this.setValue('validationContact', new ContactModel());
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
    return this.setValue('validationContact', contact);
  }

  /**
   * Clicked on a matching contact row
   */
  onClickMatchingContactRow(contact: ContactModel): void {

    this.setValue('validationContact', contact);
  }

  /**
   * Clicked on cancel button
   */
  onClickCancel(): void {

    // Reset
    this.setValue('validationContact', new ContactModel());
    this.leadService.toggleValidation(false);
  }

  /**
   * Clicked on save button
   */
  onClickSave(): void {

    if (this.isSubmitted === true) {

      return;
    }

    this.isSubmitted = true;

    this.leadService.validate();
  }
}
