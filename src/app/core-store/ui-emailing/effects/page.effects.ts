import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { concat, Observable, of, zip } from 'rxjs';
import { catchError, filter, switchMap, withLatestFrom } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { EffectsAbstract } from '../../ui-page/effects.abstract';
import { EmailingPageService } from '../../../core/shared/emailing/emailing-page.service';
import { EmailingService } from '../../../core/shared/emailing/emailing.service';
import { EmailingModel } from '../../../shared/model/emailing.model';
import { FormService } from '../../../core/shared/form.service';
import { PageEventOpen } from '../../ui-page/actions/page-event-open';
import { EmailingEventSearchEntity } from '../actions/emailing-event-search-entity';
import { PageEventChangeModel } from '../../ui-page/actions/page-event-change-model';
import { PageUpdateModel } from '../../ui-page/actions/page-update-model';
import { RuntimeEventError } from '../../ui-runtime/actions/runtime-event-error';
import { OrderEnum } from '../../../shared/enum/order.enum';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { PropertyModel } from '../../../shared/model/property.model';
import { PromotionSearchModel } from '../../../shared/model/promotion-search.model';
import { PromotionModel } from '../../../shared/model/promotion.model';
import { ContactModel } from '../../../shared/model/contact.model';
import { PageEventClickButton } from '../../ui-page/actions/page-event-click-button';
import { ButtonTypeEnum } from '../../../shared/enum/button-type.enum';
import { RuntimeEventNotification } from '../../ui-runtime/actions/runtime-event-notification';
import { NotificationTypeEnum } from '../../../shared/enum/notification-type.enum';
import { PageTypeEnum } from '../../../shared/enum/page-type.enum';
import { EmailingEventSend } from '../actions/emailing-event-send';
import { EmailUpsertEmailContent } from '../../data-email/actions/email-upsert-email-content';
import { EmailService } from '../../../core/shared/email/email.service';
import { AuthenticationStore } from '../../../authentication/shared/authentication.store';
import { EmailingEventSummaryClose } from '../actions/emailing-event-summary-close';
import { ContactSearchModel } from '../../../shared/model/contact-search.model';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { EmailingEventLoadDocuments } from '../actions/emailing-event-load-documents';
import { PropertySearchModel } from '../../../shared/model/property-search.model';
import { EmailingEventLoadDefaultAssignee } from '../actions/emailing-event-load-default-assignee';
import { EmailingOptionsInterface } from '../../../shared/interface/emailing-options.interface';
import { EmailingEventChangeConfiguration } from '../actions/emailing-event-change-configuration';
import { LanguageEnum } from '../../../shared/enum/language.enum';
import { EmailingContentModel } from '../../../shared/model/emailing-content.model';
import { EmailingUpdateDocuments } from '../actions/emailing-update-documents';
import { EmailingDocumentService } from '../../../core/shared/emailing/emailing-document.service';
import { PropertyUpsert } from '../../data-property/actions/property-upsert';
import { PromotionUpsert } from '../../data-promotion/actions/promotion-upsert';
import { ContactUpsert } from '../../data-contact/actions/contact-upsert';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { ContactService } from '../../../core/shared/contact/contact.service';
import { PropertyService } from '../../../core/shared/property/property.service';
import { PromotionService } from '../../../core/shared/promotion/promotion.service';
import { TaskService } from '../../../core/shared/task/task.service';
import { EmailingUpdateSummaries } from '../actions/emailing-update-summaries';
import { EmailEventListSender } from '../../ui-email/actions/email-event-list-sender';
import { ContactEmailModel } from '../../../shared/model/contact-email.model';
import { EmailingEventLoadPreview } from '../actions/emailing-event-load-preview';

@Injectable()
export class PageEffects extends EffectsAbstract<EmailingModel, EmailingOptionsInterface> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected formService: FormService,
    protected pageService: EmailingPageService,
    protected modelService: EmailingService,
    private runtimeService: RuntimeService,
    private translateService: TranslateService,
    private emailService: EmailService,
    private authenticationStore: AuthenticationStore,
    private documentService: EmailingDocumentService,
    private contactService: ContactService,
    private propertyService: PropertyService,
    private promotionService: PromotionService,
    private taskService: TaskService,
  ) {

    super(actions$, formService, pageService, modelService);
  }

  /**
   * Perform API call to fetch email documents
   *
   * @action PageEventOpen
   */
  PageEventOpen2$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PageEventOpen>(PageEventOpen.TYPE),
    filter(action => this.filterEntity(action.payload.entity)),
    switchMap(action => zip(
      of(action),
      this.runtimeService.selectFeature(),
      this.authenticationStore.user$,
    )),
    switchMap(([action, feature, authUser]) => {

      const newModel = new EmailingModel();

      newModel.sender = authUser.account.contact.clone<ContactModel>();
      newModel.reminderDate = this.modelService.getDefaultReminderDate();
      newModel.contactLanguages = this.pageService.getContactLanguages(newModel);

      const actions: Action[] = [

        // Update model
        new PageUpdateModel({
          model: newModel,
        }),

        // Load default assignee
        new EmailingEventLoadDefaultAssignee({}),
      ];

      // Send email on behalf feature active
      if (feature.sendEmailOnBehalf === true) {

        // Load senders list
        actions.push(new EmailEventListSender({}));
      }

      return actions;
    }),
  ));

  /**
   * @inheritDoc
   */
  PageEventClickButton2$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PageEventClickButton>(PageEventClickButton.TYPE),
    filter(action => this.filterEntity(action.payload.entity)),
    switchMap(action => zip(
      of(action),
      this.formService.selectModelError(this.pageService.getUid(PageTypeEnum.write)),
    )),
    switchMap(([action, error]) => {

      // Preview
      if (action.payload.buttonType === ButtonTypeEnum.preview) {

        return [
          new EmailingEventLoadPreview({}),
        ];
      }

      // Send
      if (action.payload.buttonType === ButtonTypeEnum.send) {

        // Has form errors
        if (Object.keys(error).filter(field => !!error[field] === true).length > 0) {

          return [
            new RuntimeEventNotification({
            type: NotificationTypeEnum.failure,
            message: 'notification_fix_form_errors',
          })];
        }

        return [
          new EmailingEventSend({}),
        ];
      }

      return [];
    }),
  ));

  /**
   * Perform API call to fetch contacts and it's documents
   *
   * @action PageEventChangeModel input.name === 'recipients' || input.name === 'recipientsCC'
   */
  PageEventChangeModelContact$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PageEventChangeModel>(PageEventChangeModel.TYPE),
    filter(action => this.filterEntity(action.payload.entity) &&
      (action.payload.input.value && (action.payload.input.name === 'recipients') || action.payload.input.name === 'recipientsCC')),
    switchMap(action => zip(
      of(action),
      this.runtimeService.selectAuthentication(),
      this.pageService.selectModel(),
    )),
    switchMap(([action, authentication, model]) => {

      const actions: Array<Observable<Action>> = [];
      const values = (action.payload.input.value as ContactModel[]).map(val => val.id);
      const emailModel = action.payload.model as EmailingModel;
      const contactIds = [ ...emailModel.recipients, ...emailModel.recipientsCC ].filter(c => c.id).map(c => c.id);

      // Change on page load
      if (values.length === 0 && model[action.payload.input.name].length === 0) {

        return [];
      }

      // Just added a recipient without contact ID
      if (values.length > model[action.payload.input.name].length &&
        !values[values.length - 1]) {

        return [];
      }

      // Load contact documents
      actions.push(of(
        new EmailingEventLoadDocuments({
          agencyId: authentication.agencyId,
          contactIds: contactIds,
          propertyIds: model.properties.map(p => p.id),
          promotionIds: model.promotions.map(p => p.id),
        })),
      );

      // Just added a contact
      if (values.length > model[action.payload.input.name].length) {

        const contactFilters = new ContactSearchModel();
        contactFilters.contactIds = [values[values.length - 1]];

        actions.push(of(
          new EmailingEventSearchEntity({
            entity: EntityEnum.contact,
            uid: action.payload.input.name,
            pagination: { page: 1, perPage: 1 },
            sort: { id: 'id', order: OrderEnum.asc },
            filters: contactFilters,
          }),
        ));

        return concat(...actions);
      }

      // Update contact languages as a contact got removed
      const newModel = action.payload.model.clone<EmailingModel>();
      newModel.contactLanguages = this.pageService.getContactLanguages(newModel);

      // Update model
      actions.push(of(
        new PageUpdateModel({ model: newModel })),
      );

      return concat(...actions);
    })),
  );

  /**
   * Perform API call to fetch properties and it's documents
   *
   * @action PageEventChangeModel input.name === 'properties'
   */
  PageEventChangeModelProperty$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PageEventChangeModel>(PageEventChangeModel.TYPE),
    filter(action => this.filterEntity(action.payload.entity) &&
      (action.payload.input.value && action.payload.input.name === 'properties')),
    switchMap(action => zip(
      of(action),
      this.runtimeService.selectAuthentication(),
      this.pageService.selectModel(),
    )),
    switchMap(([action, authentication, model]) => {

      const actions: Array<Observable<Action>> = [];
      const values = (action.payload.input.value as PropertyModel[]).map(val => val.id);
      const contactIds = [ ...model.recipients, ...model.recipientsCC ].filter(c => c.id).map(c => c.id);

      // Change on page load
      if (values.length === 0 && model[action.payload.input.name].length === 0) {

        return [];
      }

      // Just added a property
      if (values.length > model.properties.length) {

        const propertyFilters = new PropertySearchModel();
        propertyFilters.ids = [values[values.length - 1]];

        actions.push(of(
          new EmailingEventSearchEntity({
            entity: EntityEnum.property,
            uid: action.payload.input.name,
            pagination: { page: 1, perPage: 1 },
            sort: { id: 'id', order: OrderEnum.asc },
            filters: propertyFilters,
          })),
        );
      }

      // Load property documents
      actions.push(of(
        new EmailingEventLoadDocuments({
          agencyId: authentication.agencyId,
          contactIds: contactIds,
          propertyIds: values,
          promotionIds: model.promotions.map(p => p.id),
        })),
      );

      return concat(...actions);
    })),
  );

  /**
   * Perform API call to fetch promotions and it's documents
   *
   * @action PageEventChangeModel input.name === 'promotions'
   */
  PageEventChangeModelPromotion$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PageEventChangeModel>(PageEventChangeModel.TYPE),
    filter(action => this.filterEntity(action.payload.entity) &&
      (action.payload.input.value && action.payload.input.name === 'promotions')),
    switchMap(action => zip(
      of(action),
      this.runtimeService.selectAuthentication(),
      this.pageService.selectModel(),
    )),
    switchMap(([action, authentication, model]) => {

      const actions: Array<Observable<Action>> = [];

      const values = (action.payload.input.value as PromotionModel[]).map(val => val.id);
      const contactIds = [ ...model.recipients, ...model.recipientsCC ].filter(c => c.id).map(c => c.id);

      // Change on page load
      if (values.length === 0 && model[action.payload.input.name].length === 0) {

        return [];
      }

      // Just added a promotion
      if (values.length > model.promotions.length) {

        const promotionFilters = new PromotionSearchModel();
        promotionFilters.promotionIds = [values[values.length - 1]];

        actions.push(of(
          new EmailingEventSearchEntity({
            entity: EntityEnum.promotion,
            uid: action.payload.input.name,
            pagination: { page: 1, perPage: 1 },
            sort: { id: 'id', order: OrderEnum.asc },
            filters: promotionFilters,
          })),
        );
      }

      // Load promotion documents
      actions.push(of(
        new EmailingEventLoadDocuments({
          agencyId: authentication.agencyId,
          contactIds: contactIds,
          propertyIds: model.properties.map(p => p.id),
          promotionIds: values,
        }),
      ));

      return concat(...actions);
    })),
  );

  /**
   * Perform API call to fetch email content
   *
   * @action PageEventChangeModel input.name === 'emailContentId'
   */
  PageEventChangeModelEmailContentId$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PageEventChangeModel>(PageEventChangeModel.TYPE),
    filter(action => this.filterEntity(action.payload.entity) &&
      (action.payload.input.value !== '' && action.payload.input.name === 'emailContentId')),
    switchMap(action => zip(
      of(action),
      this.pageService.selectModel(),
    )),
    switchMap(([action, pageModel]) => {

      // Value not changed
      if (action.payload.input.value === pageModel.emailContentId) {

        return [];
      }

      // API call
      return this.emailService
        .emailContent(<string>action.payload.input.value)
        .pipe(

          withLatestFrom(
            this.pageService.selectModel(),
          ),

          // Success
          switchMap(([emailContent, model]) => {

            const newModel = model.clone<EmailingModel>();

            // Subject
            Object.keys(emailContent.subject).forEach(lang => {

              newModel.content = {
                ...newModel.content,
                [lang]: {
                  ...newModel.content[lang],
                  subject: emailContent.subject[lang],
                },
              };
            });

            // Message
            Object.keys(emailContent.html).forEach(lang => {

              newModel.content = {
                ...newModel.content,
                [lang]: {
                  ...newModel.content[lang],
                  message: emailContent.html[lang],
                },
              };
            });

            return [

              // Upsert email content
              new EmailUpsertEmailContent({ models: [emailContent] }),

              // Update model
              new PageUpdateModel({ model: newModel }),
            ];
          }),

          // Error
          catchError(([error, model]) => [

            // Broadcast error
            new RuntimeEventError({ id: '55', error: error }),
          ]),
        );
    }),
  ));

  /**
   * Reset page if no emails failed, otherwise keep the recipients with error
   *
   * @action EmailingEventSummaryClose
   */
  EmailingEventSummaryClose$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<EmailingEventSummaryClose>(EmailingEventSummaryClose.TYPE),
    switchMap(action => zip(
      of(action),
      this.runtimeService.selectAuthentication(),
      this.pageService.selectModel(),
      this.modelService.selectSummaries(),
    )),
    switchMap(([action, authentication, model, summaries]) => {

      let newModel: EmailingModel;
      const actions: Action[] = [

        // Reset summaries
        new EmailingUpdateSummaries({ summaries: [] }),
      ];

      // Emails having error
      const errorEmailIds = summaries
        .filter(summary => !!summary.error)
        .map(summary => summary.model.getMainEmailAddress())
      ;

      // Has emails with errors
      if (errorEmailIds.length > 0) {

        newModel = model.clone<EmailingModel>();
        newModel.recipients = model.recipients.filter(recipient => errorEmailIds.indexOf(recipient.getMainEmailAddress()) > -1);
        newModel.recipientsCC = model.recipientsCC.filter(recipient => errorEmailIds.indexOf(recipient.getMainEmailAddress()) > -1);
        newModel.contactLanguages = this.pageService.getContactLanguages(newModel);

        // Update page model
        actions.push(new PageUpdateModel({ model: newModel }));

        return actions;
      }

      // Reset document list
      actions.push(
        new EmailingEventLoadDocuments({
          agencyId: authentication.agencyId,
          contactIds: [],
          propertyIds: [],
          promotionIds: [],
        }),
      );

      // Can deactivate page
      this.pageService.setCanDeactivate(true);

      // Refresh
      this.pageService.reload();

      return actions;
    })),
  );

  /**
   * Change emailing configuration
   *
   * @action EmailingEventChangeConfiguraion
   */
  EmailingEventChangeConfiguration$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<EmailingEventChangeConfiguration>(EmailingEventChangeConfiguration.TYPE),
    switchMap(action => zip(
      of(action),
      this.pageService.selectModel(),
    )),
    switchMap(([action, model]) => {

      const newModel = model.clone<EmailingModel>();
      const configuration = action.payload.configuration;

      newModel.leadIds = configuration.leadIds;
      newModel.isManageLeadByEmail = configuration.isManageLeadByEmail;
      newModel.replyTo = configuration.replyTo;

      // Recipients
      (configuration.recipients || []).forEach(recipient => {

        const contact = new ContactModel();
        contact.id = recipient.id;
        contact.firstName = recipient.firstName;
        contact.lastName = recipient.lastName;
        contact.fullName = contact.getFullName();
        contact.agency.id = recipient.agencyId;
        contact.languageId = <LanguageEnum>recipient.languageId;

        const email = new ContactEmailModel();
        email.emailId = recipient.email;
        email.isMainEmail = true;
        contact.emails.push(email);

        if (recipient.type === 'cc') {

          newModel.recipientsCC = [ ...newModel.recipientsCC, contact ];

          return;
        }

        newModel.recipients = [ ...newModel.recipients, contact ];
      });

      newModel.contactLanguages = this.pageService.getContactLanguages(newModel);

      // Set content
      newModel.contactLanguages.forEach(languageId => {

        const content = new EmailingContentModel();
        content.subject = configuration.subject || '';
        newModel.content = { ...newModel.content, [languageId]: content };
      });

      return [

        // Update model
        new PageUpdateModel({ model: newModel }),
      ];
    }),
  ));

  /**
   * Perform API call to search contacts and update contact list
   *
   * @action EmailingEventSearchEntity
   */
  EmailingEventSearchEntityContact$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<EmailingEventSearchEntity>(EmailingEventSearchEntity.TYPE),
    filter(action => action.payload.entity === EntityEnum.contact),
    switchMap(action => {

      // Search for contacts using legacy endpoint TODO[refactoring] Remove once new API supports precalculated contact email
      return this
        .contactService
        .listLegacy(action.payload.pagination, action.payload.sort, <ContactSearchModel>action.payload.filters)
        .pipe(

          withLatestFrom(
            this.pageService.selectModel(),
          ),

          // Success
          switchMap(([list, model]) => {

            const newModel = model.clone<EmailingModel>();

            // Reminder contact
            if (action.payload.uid === 'reminderContact') {

              newModel.reminderContact = list.models[0];

              return [

                // Update model
                new PageUpdateModel({ model: newModel }),
              ];
            }

            // Not recipients and recipients(CC)
            if (action.payload.uid !== 'recipients' && action.payload.uid !== 'recipientsCC') {

              return [];
            }

            const actions = [];
            const contactsWithEmail = list.models.filter(contact => contact.emails.length > 0);
            const invalidContactCount = list.models.length - contactsWithEmail.length;
            const existingRecipients = [...newModel[action.payload.uid]];

            if (invalidContactCount > 0) {

              // Notification
              actions.push(
                new RuntimeEventNotification({
                  type: NotificationTypeEnum.failure,
                  message: list.models.length === 1 && invalidContactCount === 1 ? 'label_recipient_singular_no_email' :
                    this.translateService.instant('label_recipient_count_no_email', {
                      count: invalidContactCount, total: list.models.length,
                    }),
                }),
              );
            }

            // Remove placeholder contact
            existingRecipients.pop();

            newModel[action.payload.uid] = [ ...existingRecipients, ...this.pageService.generateRecipients(contactsWithEmail)];
            newModel.contactLanguages = this.pageService.getContactLanguages(newModel);

            actions.push(

              // Update model
              new PageUpdateModel({ model: newModel }),

              // Upsert contacts
              new ContactUpsert({
                models: list.models,
              }),
            );

            return actions;
          }),

          // Error
          catchError(([error, model]) => [

            // Broadcast error
            new RuntimeEventError({ id: '52', error: error }),
          ]),
        );
    }),
  ));

  /**
   * Perform API call to search properties and update property list
   *
   * @action EmailingEventSearchEntity
   */
  EmailingEventSearchEntityProperty$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<EmailingEventSearchEntity>(EmailingEventSearchEntity.TYPE),
    filter(action => action.payload.entity === EntityEnum.property),
    switchMap(action => {

      return this
        .propertyService
        .list(action.payload.pagination, action.payload.sort, <PropertySearchModel>action.payload.filters)
        .pipe(

          withLatestFrom(
            this.pageService.selectModel(),
          ),

          // Success
          switchMap(([list, model]) => {

            const newModel = model.clone<EmailingModel>();
            const existingProperties = [...newModel.properties];

            // Remove placeholder property
            existingProperties.pop();

            newModel.properties = [ ...existingProperties, ...list.models ];

            return [

              // Update model
              new PageUpdateModel({ model: newModel }),

              // Upsert properties
              new PropertyUpsert({
                models: list.models,
              }),
            ];
          }),

          // Error
          catchError(([error, model]) => [

            // Broadcast error
            new RuntimeEventError({ id: '53', error: error }),
          ]),
        );
    }),
  ));

  /**
   * Perform API call to search promotions and update promotion list
   *
   * @action EmailingEventSearchEntity
   */
  EmailingEventSearchEntityPromotion$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<EmailingEventSearchEntity>(EmailingEventSearchEntity.TYPE),
    filter(action => action.payload.entity === EntityEnum.promotion),
    switchMap(action => {

      return this
        .promotionService
        .list(action.payload.pagination, action.payload.sort, <PromotionSearchModel>action.payload.filters)
        .pipe(
          withLatestFrom(
            this.pageService.selectModel(),
          ),

          // Success
          switchMap(([list, model]) => {

            const newModel = model.clone<EmailingModel>();
            const existingPromotions = [...newModel.promotions];

            // Remove placeholder promotion
            existingPromotions.pop();

            newModel.promotions = [ ...existingPromotions, ...list.models ];

            // Set email template to 'Including developments' if promotions added
            newModel.emailTemplateId = newModel.promotions.length > 0 ? '6' : '2';

            return [

              // Update model
              new PageUpdateModel({ model: newModel }),

              // Upsert promotions
              new PromotionUpsert({
                models: list.models,
              }),
            ];
          }),

          // Error
          catchError(([error, model]) => [

            // Broadcast error
            new RuntimeEventError({ id: '54', error: error }),
          ]),
        );
    }),
  ));

  /**
   * Perform API call to load default task assignee
   *
   * @action EmailingEventLoadDefaultAssignee
   */
  EmailingEventLoadDefaultAssignee$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<EmailingEventLoadDefaultAssignee>(EmailingEventLoadDefaultAssignee.TYPE),
    switchMap(action => zip(
      of(action),
      this.runtimeService.selectPermissions(),
    )),
    switchMap(([action, permissions]) => {

      if (
        permissions.indexOf(PermissionEnum.crmLogin) === -1 ||
        permissions.indexOf(PermissionEnum.contactRead) === -1 ||
        permissions.indexOf(PermissionEnum.taskRead) === -1
      ) {

        return [];
      }

      return this
        .taskService
        .defaultAssignee()
        .pipe(

          withLatestFrom(
            this.pageService.selectModel(),
          ),

          // Success
          switchMap(([contact, model]) => {

            const newModel = model.clone<EmailingModel>();

            newModel.reminderContact = contact;

            return [

              // Update model
              new PageUpdateModel({ model: newModel }),
            ];
          }),

          // Error
          catchError(([error, model]) => [

            // Broadcast error
            new RuntimeEventError({ id: '58', error: error }),
          ]),
        );
    }),
  ));

  /**
   * Perform API call to fetch documents per entity
   *
   * @action EmailingEventLoadDocuments
   */
  EmailingEventLoadDocuments$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<EmailingEventLoadDocuments>(EmailingEventLoadDocuments.TYPE),
    switchMap(action => {

      // API call
      return this
        .documentService
        .listPerEntity(
          [action.payload.agencyId],
          action.payload.contactIds,
          action.payload.propertyIds,
          action.payload.promotionIds,
        ).pipe(

          withLatestFrom(
            this.pageService.selectModel(),
          ),

          // Success
          switchMap(([documents, model]) => {

            const newModel = this.documentService.setModelDocumentsPerEntity(model, documents);

            return [

              // Update documents
              new EmailingUpdateDocuments({ documents: documents }),

              // Update model
              new PageUpdateModel({ model: newModel }),
            ];
          }),

          // Error
          catchError(error => [

            // Broadcast error
            new RuntimeEventError({ id: '50', error: error }),
          ]),
        );
    })),
  );

  /**
   * Update model with additional data
   *
   * @action PageUpdateModel
   */
  PageUpdateModel$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PageUpdateModel>(PageUpdateModel.TYPE),
    filter(action => action.payload.model instanceof EmailingModel),
    switchMap(action => zip(
      of(action),
      this.pageService.selectOptions(),
    )),
    switchMap(([action, options]) => {

      // Selected privacy value is not part of privacy options anymore
      if (
        options.emailBrochurePrivacyId.length > 0 &&
        !options.emailBrochurePrivacyId.find(option => option.value === (<EmailingModel>action.payload.model).emailBrochurePrivacyId)
      ) {

        const newModel = action.payload.model.clone<EmailingModel>();
        newModel.emailBrochurePrivacyId = options.emailBrochurePrivacyId[0].value;

        return [
          new PageUpdateModel({
            model: newModel,
          }),
        ];
      }

      return [];
    }),
  ));

  /**
   * @inheritDoc
   */
  protected getUpsertAction(model: EmailingModel): Action {

    return null;
  }
}
