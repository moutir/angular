import { Injectable } from '@angular/core';
import { Params, Router } from '@angular/router';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { StateInterface } from '../../../core-store/state.interface';
import { PageServiceAbstract } from '../../../shared/service/page.service.abstract';
import { EmailingConfig } from './emailing.config';
import { EmailingModel } from '../../../shared/model/emailing.model';
import { EmailingOptionsInterface } from '../../../shared/interface/emailing-options.interface';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { EmailingService } from './emailing.service';
import { PageTypeEnum } from '../../../shared/enum/page-type.enum';
import { selectDataFeatureBrochure, selectDataPermissions } from '../../../core-store/data-runtime/selectors';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { RuntimeOptionsInterface } from '../../../shared/interface/runtime-options.interface';
import { LanguageEnum } from '../../../shared/enum/language.enum';
import { ButtonTypeEnum } from '../../../shared/enum/button-type.enum';
import { selectUiType } from '../../../core-store/ui-page/selectors';
import { KeyValueType } from '../../../shared/type/key-value.type';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { DocumentModel } from '../../../shared/model/document.model';
import { selectUiDocuments } from '../../../core-store/ui-emailing/selectors';
import { selectDataContacts } from '../../../core-store/data-contact/selectors';
import { ContactModel } from '../../../shared/model/contact.model';
import { PropertyModel } from '../../../shared/model/property.model';
import { PromotionModel } from '../../../shared/model/promotion.model';
import { selectDataProperties } from '../../../core-store/data-property/selectors';
import { selectDataPromotions } from '../../../core-store/data-promotion/selectors';
import { selectUiBrokerOptions } from '../../../core-store/ui-contact/selectors';
import { OptionInterface } from '../../../shared/interface/option.interface';
import { EmailingEventLoadConfiguration } from '../../../core-store/ui-emailing/actions/emailing-event-load-configuration';
import { OptionGroupInterface } from '../../../shared/interface/option-group.interface';
import { ContactEmailModel } from '../../../shared/model/contact-email.model';
import { selectUiSenderOptions } from '../../../core-store/ui-email/selectors';
import { Dictionary } from '../../../shared/class/dictionary';
import { RuntimeFeatureBrochureInterface } from '../../../shared/interface/runtime-feature-brochure.interface';
import { EntityDocumentsOptionsInterface } from '../../../shared/interface/entity-documents-options.interface';

@Injectable()
export class EmailingPageService extends PageServiceAbstract<EmailingModel, EmailingOptionsInterface> {

  /**
   * Constructor
   */
  constructor(
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected router: Router,
    protected moduleConfig: EmailingConfig,
    protected modelService: EmailingService,
  ) {

    super(
      store$,
      runtimeService,
      router,
      moduleConfig,
      modelService,
    );
  }

  /**
   * Load configuration using route query params
   */
  configuration(queryParams: Params): void {

    this.store$.dispatch(
      new EmailingEventLoadConfiguration({ queryParams }),
    );
  }

  /**
   * Returns the languages which the selected contacts speak
   */
  getContactLanguages(model: EmailingModel): LanguageEnum[] {

    const languages: LanguageEnum[] = [];
    const contacts = [ ...model.recipients, ...model.recipientsCC ];

    // No recipients available
    if (contacts.length === 0 && model.defaultLanguageId) {

      return [model.defaultLanguageId];
    }

    contacts.forEach(contact => {

      const languageId = contact.languageId || model.defaultLanguageId;

      if (languageId && languages.indexOf(languageId) === -1) {

        languages.push(languageId);
      }
    });

    return languages;
  }

  /**
   * Returns recipient models generated from contacts
   */
  generateRecipients(contacts: ContactModel[]): ContactModel[] {

    const recipients = [];

    contacts.forEach(contact => {

      // Create contact for each email ids
      contact.emails.forEach(email => {

        const newContact = contact.clone<ContactModel>();
        const newEmail = new ContactEmailModel();

        newEmail.emailId = email.emailId;
        newEmail.isMainEmail = true;
        newContact.emails.push(newEmail);

        recipients.push(newContact);
      });
    });

    return recipients;
  }

  /**
   * @inheritDoc
   */
  redirect(type: PageTypeEnum|null, id: string|null): void {

    // Read OR write
    if (type === PageTypeEnum.read || type === PageTypeEnum.write) {

      this.router.navigate(['/' + this.moduleConfig.ENTITY_ROUTE_BASE]);

      return;
    }

    // Home
    this.router.navigate(['/dashboard']);
  }

  /**
   * Reload route
   */
  reload(): void {

    // Navigate to a dummy URL silently and then to the page URL (Angular route reload doesn't work otherwise)
    this
      .router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(['/' + this.moduleConfig.ENTITY_ROUTE_BASE]))
    ;
  }

  /**
   * @inheritDoc
   */
  selectModel(): Observable<EmailingModel> {

    return combineLatest([
      this.store$.select(this.getSelectorModel()),
      this.runtimeService.selectSettings(),
      this.runtimeService.selectFeatureBrochure(),
    ])
      .pipe(
        map(([model, runtimeSettings, featureBrochure]) => {

          const newModel = model.clone<EmailingModel>();

          if (model.defaultLanguageId !== runtimeSettings.language.current) {

            newModel.defaultLanguageId = runtimeSettings.language.current;
          }

          if (model.emailBrochureTypeId === '') {

            newModel.emailBrochureTypeId = featureBrochure.defaultBrochureTypeId;
          }

          return newModel;
        }),
      );
  }

  /**
   * @inheritDoc
   */
  protected getSelectorSubtitles(): MemoizedSelector<StateInterface, string[]> {

    return createSelector(
      selectDataPermissions,
      (
        permissions: PermissionEnum[],
      ): string[] => {

        // No read permission
        if (permissions.indexOf(this.moduleConfig.PERMISSION_READ) === -1) {

          return ['breadcrumb_access_denied'];
        }

        return ['label_form'];
      },
    );
  }

  /**
   * Return a selector of entity documents options
   */
  protected getSelectorEntityDocumentsOptions(): MemoizedSelector<StateInterface, EntityDocumentsOptionsInterface> {

    return createSelector(
      selectUiDocuments,
      selectDataContacts,
      selectDataProperties,
      selectDataPromotions,
      (
        documents: KeyValueType<EntityEnum, Dictionary<DocumentModel[]>>,
        contacts: Dictionary<ContactModel>,
        properties: Dictionary<PropertyModel>,
        promotions: Dictionary<PromotionModel>,
      ): EntityDocumentsOptionsInterface => {

        const options = {
          agency: [],
          contact: {},
          property: {},
          promotion: {},
        };

        // Agency
        if (documents.agency && Object.keys(documents.agency).length > 0) {

          const key = Object.keys(documents.agency)[0];

          options.agency = [{
            label: key,
            options: (documents.agency[key] || []).map(doc => ({ value: doc.id, text: doc.name })),
          }];
        }

        // Contact
        if (documents.contact) {

          Object.keys(documents.contact).forEach(key => {

            options.contact[key] = {
              label: contacts[key] ? contacts[key].getFullName() : ('#' + key),
              options: (documents.contact[key] || []).map(doc => ({ value: doc.id, text: doc.name })),
            };
          });
        }

        // Property
        if (documents.property) {

          Object.keys(documents.property).forEach(key => {

            options.property[key] = {
              label: properties[key] && properties[key].reference || ('#' + key),
              options: (documents.property[key] || []).map(doc => ({ value: doc.id, text: doc.name })),
            };
          });
        }

        // Promotion
        if (documents.promotion) {

          Object.keys(documents.promotion).forEach(key => {

            const docs = documents.promotion[key] || [];
            let label = promotions[key] && promotions[key].name.trim();

            if (!label) {

              // Extract promotion name
              label = docs[0] && docs[0].name.split('|')[1];
            }

            options.promotion[key] = {
              label: label,
              options: docs.map(doc => ({ value: doc.id, text: doc.name.split('|')[0] })),
            };
          });
        }

        return options;
      },
    );
  }

  /**
   * @inheritDoc
   */
  protected getSelectorOptions(): MemoizedSelector<StateInterface, EmailingOptionsInterface> {

    return createSelector(
      this.getSelectorModel(),
      this.runtimeService.getSelectorOptions(),
      selectDataPermissions,
      selectUiBrokerOptions,
      this.getSelectorEntityDocumentsOptions(),
      selectUiSenderOptions,
      selectDataFeatureBrochure,
      (
        model: EmailingModel,
        options: RuntimeOptionsInterface,
        permissions: PermissionEnum[],
        brokerOptions: OptionInterface[],
        entityDocumentsOptions: EntityDocumentsOptionsInterface,
        senderOptions: OptionGroupInterface[],
        featureBrochure: RuntimeFeatureBrochureInterface,
      ): EmailingOptionsInterface => {

        const privacyIds = featureBrochure.mapping.brochureIdToPrivacyIds[model.emailBrochureTypeId] || [];

        return {
          sender: senderOptions,
          brokerId: permissions.indexOf(PermissionEnum.contactRead) > -1 ? brokerOptions : [],
          emailTemplate: options.emailTemplate,
          emailContent: options.emailContent,
          emailBrochureTypeId: options.propertyBrochureType, // Yes, always propose the property brochure types, never promotions
          emailBrochurePrivacyId: options.brochurePrivacy.filter(option => privacyIds.indexOf(option.value) > -1),
          language: options.languageCommunication,
          documents: entityDocumentsOptions,
        };
      },
    );
  }

  /**
   * @inheritDoc
   */
  protected getSelectorPrimaryButton(): MemoizedSelector<StateInterface, ButtonTypeEnum|null> {

    return createSelector(
      selectUiType,
      selectDataPermissions,
      (
        type: PageTypeEnum,
        permissions: PermissionEnum[],
      ): ButtonTypeEnum|null => {

        // Page write
        if (type === PageTypeEnum.write && permissions.indexOf(this.moduleConfig.PERMISSION_WRITE) > -1) {

          return ButtonTypeEnum.send;
        }

        return null;
      },
    );
  }

  /**
   * @inheritDoc
   */
  protected getSelectorSecondaryButton(): MemoizedSelector<StateInterface, ButtonTypeEnum|null> {

    return createSelector(
      selectUiType,
      (type: PageTypeEnum): ButtonTypeEnum|null => {

        return ButtonTypeEnum.preview;
      },
    );
  }

}
