import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { take } from 'rxjs/operators';

import { EntityEnum } from '../../shared/enum/entity.enum';
import { AutocompleteSelectionInterface } from '../../shared/interface/autocomplete-selection.interface';
import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';
import { EmailingModel } from '../../shared/model/emailing.model';
import { EmailingOptionsInterface } from '../../shared/interface/emailing-options.interface';
import { EmailingModelGeneralAdapterStrategy } from '../../core/shared/emailing/emailing-model-general-adapter.strategy';
import { ContactModel } from '../../shared/model/contact.model';
import { PermissionEnum } from '../../shared/enum/permission.enum';
import { RuntimeFeatureInterface } from '../../shared/interface/runtime-feature.interface';
import { ContactEmailModel } from '../../shared/model/contact-email.model';
import { LanguageEnum } from '../../shared/enum/language.enum';
import { KeyValueType } from '../../shared/type/key-value.type';
import { ChangeFormEventInterface } from '../../shared/interface/change-form-event.interface';
import { ErrorFormEventInterface } from '../../shared/interface/error-form-event.interface';
import { Dictionary } from '../../shared/class/dictionary';
import { EmailingModelContentAdapterStrategy } from '../../core/shared/emailing/emailing-model-content-adapter.strategy';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { AgencyPreferenceEnum } from '../../shared/enum/agency-preference.enum';
import { RuntimeAgencyPreferenceInterface } from '../../shared/interface/runtime-agency-preference.interface';
import { PromotionModel } from '../../shared/model/promotion.model';
import { PropertyModel } from '../../shared/model/property.model';

@Component({
  selector: 'app-emailing-form-general',
  templateUrl: './emailing-form-general.component.html',
  styleUrls: ['./emailing-form-general.component.scss'],
})
export class EmailingFormGeneralComponent extends FormComponentAbstract<
  EmailingModel,
  EmailingOptionsInterface
> implements OnInit, OnChanges {

  /**
   * Constants
   */
  readonly AUTOCOMPLETE_ENTITIES_CONTACT: EntityEnum[] = [EntityEnum.recipient];
  readonly AUTOCOMPLETE_ENTITIES_PROPERTY_PROMOTION: EntityEnum[] = [EntityEnum.property, EntityEnum.promotion];
  readonly AGENCY_PREFERENCE_BROCHURE_EMAIL_BROKER: AgencyPreferenceEnum = AgencyPreferenceEnum.brochureEmailBroker;
  readonly ENTITY_AGENCY: EntityEnum = EntityEnum.agency;
  readonly ENTITY_CONTACT: EntityEnum = EntityEnum.contact;
  readonly ENTITY_PROPERTY: EntityEnum = EntityEnum.property;
  readonly ENTITY_PROMOTION: EntityEnum = EntityEnum.promotion;
  readonly PERMISSION_TASK_READ: PermissionEnum = PermissionEnum.taskRead;
  readonly PERMISSION_TASK_WRITE: PermissionEnum = PermissionEnum.taskWrite;
  readonly PERMISSION_TASK_MANAGER: PermissionEnum = PermissionEnum.taskManager;
  readonly PERMISSION_LEAD_WRITE: PermissionEnum = PermissionEnum.leadWrite;

  /**
   * Available language IDs
   */
  @Input() availableLanguageIds: LanguageEnum[];

  /**
   * Available languages
   */
  @Input() availableLanguages: KeyValueType<LanguageEnum, string>;

  /**
   * Feature
   */
  @Input() feature: RuntimeFeatureInterface;

  /**
   * Permissions
   */
  @Input() permissions: PermissionEnum[];

  /**
   * Agency preference
   */
  @Input() agencyPreference: RuntimeAgencyPreferenceInterface;

  /**
   * Error count per tab
   */
  tabErrorCount: KeyValueType<string, number> = {};

  /**
   * Attachments available?
   */
  hasAttachments: boolean = false;

  /**
   * Map a field name to a tab UID
   */
  private fieldTabMapping: Dictionary<string> = {};

  /**
   * @inheritDoc
   */
  constructor(
    protected formBuilder: FormBuilder,
    protected modelAdapterStrategy: EmailingModelGeneralAdapterStrategy,
    private contentModelAdapterStrategy: EmailingModelContentAdapterStrategy,
    private runtimeService: RuntimeService,
  ) {

    super(formBuilder, modelAdapterStrategy);
  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    super.ngOnInit();

    // Set field tab mapping
    this.fieldTabMapping = this.getFieldTabMapping();
  }

  /**
   * Changed component input(s)
   */
  ngOnChanges(changes: SimpleChanges): void {

    super.ngOnChanges(changes);

    this.hasAttachments = false;

    // Add new controls for documents per entity
    Object.keys(this.model.documents).forEach(key => {

      this.hasAttachments = true;

      const segments = key.split('_');
      key = this.getDocumentFormControlName(<EntityEnum>segments[0], segments[1]);

      if (!this.formGroup.get(key)) {

        const control = new FormControl();

        this.formGroup.addControl(key, control);

        this.subscriptions.push(
          control.valueChanges.subscribe(value => this.onNextFieldValue(key, value)),
        );

        this.subscriptions.push(
          control.statusChanges.subscribe(status => this.onNextFieldStatus(key, status)),
        );
      }
    });
  }

  /**
   * Return the tab UID for a content tab in the given language
   */
  getContentTabUid(language: LanguageEnum): string {

    return ['content', language].join('#');
  }

  /**
   * Return the form control name based on given entity and ID
   */
  getDocumentFormControlName(entity: EntityEnum, id: string): string {

    return this.modelAdapterStrategy.getDocumentFieldUid(entity, id);
  }

  /**
   * Language content fields has errors?
   */
  hasContentErrors(): boolean {

    return this.availableLanguageIds.some(languageId => this.tabErrorCount[this.getContentTabUid(languageId)] > 0);
  }

  /**
   * Changed language content form
   */
  onChangeContentForm(event: ChangeFormEventInterface<EmailingModel>): void {

    this.changeForm.emit(event);
  }

  /**
   * Error in language content form
   */
  onErrorContentForm(event: ErrorFormEventInterface): void {

    this.errorForm.emit(event);
  }

  /**
   * Pristine status changed for language content form
   */
  onPristineContentForm(event: boolean): void {

    this.pristineForm.emit(event);
  }

  /**
   * Clicked the button to remove recipient
   */
  onClickRemoveRecipient(index: number): void {

    const recipients = this.formGroup.get('recipients').value.filter((rec, i) => i !== index);

    // Update input by removing a recipient
    this.setValue('recipients', recipients);
  }

  /**
   * Clicked the button to remove recipient(CC)
   */
  onClickRemoveRecipientCC(index: number): void {

    const recipients = this.formGroup.get('recipientsCC').value.filter((rec, i) => i !== index);

    // Update input by removing a recipient
    this.setValue('recipientsCC', recipients);
  }

  /**
   * Changed selection autocomplete contact
   */
  onChangeSelectionContact(selection: AutocompleteSelectionInterface, fieldName: string): void {

    this.setValueAutocompleteContact(selection, fieldName);
  }

  /**
   * Changed selection autocomplete - reminder contact
   */
  onChangeSelectionReminderContact(selection: AutocompleteSelectionInterface): void {

    // Generate contact
    const contact = new ContactModel();
    contact.id = selection.id;
    contact.fullName = selection.text;

    // Update input
    this.setValue('reminderContact', contact);
  }

  /**
   * Changed query in autocomplete - reminder contact
   */
  onChangeQueryReminderContact(query: string): void {

    // Autocomplete cleared
    if (query === '') {

      // Reset autocomplete value
      this.setValue('reminderContact', null);
    }
  }

  /**
   * Changed autocomplete selection
   */
  onChangeSelectionObject(selection: AutocompleteSelectionInterface): void {

    if (selection.entity === EntityEnum.property) {

      return this.setValueAutocompleteProperty(selection);
    }

    if (selection.entity === EntityEnum.promotion) {

      return this.setValueAutocompletePromotion(selection);
    }
  }

  /**
   * Clicked the button to remove property
   */
  onClickRemoveProperty(index: number): void {

    const properties = this.formGroup.get('properties').value.filter((prop, i) => i !== index);

    // Update input by removing a property
    this.setValue('properties', properties);
  }

  /**
   * Clicked the button to remove promotion
   */
  onClickRemovePromotion(index: number): void {

    const promotions = this.formGroup.get('promotions').value.filter((promo, i) => i !== index);

    // Update input by removing a promotion
    this.setValue('promotions', promotions);
  }

  /**
   * @inheritDoc
   */
  protected updateErrors(): void {

    super.updateErrors();

    this.updateTabErrorCount();
  }

  /**
   * @inheritDoc
   */
  protected updateControls(): void {

    const options = {
      emitEvent: false,
    };

    if (this.model.promotions.length > 0 && this.model.properties.length === 0) {

      this.formGroup.get('emailBrochureTypeId').disable(options);
      this.formGroup.get('emailBrochurePrivacyId').disable(options);
      this.formGroup.get('brochureBrokerId').disable(options);
      this.formGroup.get('emailTemplateId').disable(options);
    } else if (this.model.properties.length > 0) {

      this.formGroup.get('emailBrochureTypeId').enable(options);
      this.formGroup.get('emailBrochurePrivacyId').enable(options);
      this.formGroup.get('brochureBrokerId').enable(options);
      this.formGroup.get('emailTemplateId').enable(options);
    }

    if (this.feature.sendEmailOnBehalf === false) {

      return;
    }

    // Enable/disable sender field based on options
    this.options.sender[0].options.length === 0 ?
      this.formGroup.get('senderId').disable(options) :
      this.formGroup.get('senderId').enable(options);
  }

  /**
   * Get mapping of "field name" to "tab UID"
   */
  private getFieldTabMapping(): Dictionary<string> {

    const fieldTabMapping: Dictionary<string> = {};
    const model = new EmailingModel();

    // Set field tab mapping
    this.subscriptions.push(
      this
        .runtimeService
        .selectAvailableLanguageIds()
        .pipe(take(2))
        .subscribe(availableLanguageIds => {

          availableLanguageIds.forEach(languageId => {

            this.contentModelAdapterStrategy.setLanguage(languageId);

            Object
              .keys(this.contentModelAdapterStrategy.getFormControlConfig(model))
              .forEach((controlName) => fieldTabMapping[controlName] = this.getContentTabUid(languageId));
          });
        }),
    );

    return fieldTabMapping;
  }

  /**
   * Update error count per tab
   */
  private updateTabErrorCount(): void {

    const tabErrorCount = {};

    this.availableLanguageIds.forEach(languageId => tabErrorCount[this.getContentTabUid(languageId)] = 0);

    Object
      .keys(this.error)
      .filter(field => !!this.error[field] === true)
      .forEach(field => tabErrorCount[this.fieldTabMapping[field]]++);

    // Update tab error count
    this.tabErrorCount = tabErrorCount;
  }

  /**
   * Set value for autocomplete contact
   */
  private setValueAutocompleteContact(selection: AutocompleteSelectionInterface, fieldName: string): void {

    const recipients = this.formGroup.get(fieldName).value.slice(0);

    const isExisting = recipients.find(r => selection.id && r.id === selection.id);

    // Recipient already selected
    if (isExisting) {

      return;
    }

    // Generate contact
    const contact = new ContactModel();
    contact.id = selection.id;
    contact.fullName = selection.text;

    // Selected an email address from the list, which does not belong to any contact
    if (!contact.id) {

      const email = new ContactEmailModel();
      email.emailId = selection.text;
      email.isMainEmail = true;
      contact.emails.push(email);
      contact.languageId = null;
    }

    recipients.push(contact);

    // Update input by adding a recipient
    return this.setValue(fieldName, recipients);
  }

  /**
   * Set value for autocomplete property
   */
  private setValueAutocompleteProperty(selection: AutocompleteSelectionInterface): void {

    const properties = this.formGroup.get('properties').value.slice(0);
    const isExisting = properties.find(p => selection.id && p.id === selection.id);

    // Property already selected
    if (isExisting) {

      return;
    }

    // Generate property
    const property = new PropertyModel();
    property.id = selection.id;
    property.isLoading = true;

    properties.push(property);

    // Update input by adding a property
    return this.setValue('properties', properties);
  }

  /**
   * Set value for autocomplete promotion
   */
  private setValueAutocompletePromotion(selection: AutocompleteSelectionInterface): void {

    const promotions = this.formGroup.get('promotions').value.slice(0);
    const isExisting = promotions.find(p => selection.id && p.id === selection.id);

    // Promotion already selected
    if (isExisting) {

      return;
    }

    // Generate promotion
    const promotion = new PromotionModel();
    promotion.id = selection.id;
    promotion.isLoading = true;

    promotions.push(promotion);

    // Update input by adding a promotion
    return this.setValue('promotions', promotions);
  }
}
