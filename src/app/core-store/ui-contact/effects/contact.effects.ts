import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { concat, Observable, of, zip } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap } from 'rxjs/operators';

import { RuntimeEventError } from '../../ui-runtime/actions/runtime-event-error';
import { ContactEventPreview } from '../actions/contact-event-preview';
import { ContactUpdatePreviewContactId } from '../actions/contact-update-preview-contact-id';
import { RuntimeUpdateContextual } from '../../ui-runtime/actions/runtime-update-contextual';
import { ContactUpsert } from '../../data-contact/actions/contact-upsert';
import { RuntimeEventNotification } from '../../ui-runtime/actions/runtime-event-notification';
import { NotificationTypeEnum } from '../../../shared/enum/notification-type.enum';
import { ContactEventChangeRanking } from '../actions/contact-event-change-ranking';
import { ContactModel } from '../../../shared/model/contact.model';
import { EntityEventChanged } from '../../ui-entity/actions/entity-event-changed';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { LayoutService } from '../../../layout/shared/layout.service';
import { ContactIoBasketContactIds } from '../actions/contact-io-basket-contact-ids';
import { ContactEventAddBasket } from '../actions/contact-event-add-basket';
import { ContactEventRemoveBasket } from '../actions/contact-event-remove-basket';
import { ContactEventSendEmail } from '../actions/contact-event-send-email';
import { BrowserService } from '../../../core/shared/browser/browser.service';
import { ContactEventArchive } from '../actions/contact-event-archive';
import { EntityEventOperation } from '../../ui-entity/actions/entity-event-operation';
import { ConfirmService } from '../../../core/shared/confirm.service';
import { ContactEventUnarchive } from '../actions/contact-event-unarchive';
import { ContactEventTransfer } from '../actions/contact-event-transfer';
import { ContactUpdateTransfer } from '../actions/contact-update-transfer';
import { ContactEventChangeInputTransfer } from '../actions/contact-event-change-input-transfer';
import { ContactUpdateByAgencyId } from '../../data-contact/actions/contact-update-by-agency-id';
import { ContactEventModifyBroker } from '../actions/contact-event-modify-broker';
import { ContactEventExport } from '../actions/contact-event-export';
import { ContactEventTransferActivity } from '../actions/contact-event-transfer-activity';
import { ContactService } from '../../../core/shared/contact/contact.service';
import { ContactEventSetAvatar } from '../actions/contact-event-set-avatar';
import { ContactEventRemoveAvatar } from '../actions/contact-event-remove-avatar';
import { ContactEventChangeAvatar } from '../actions/contact-event-change-avatar';
import { ContactApiPhalconService } from '../../../api/shared/contact/contact-api-phalcon.service';
import { EntityEventList } from '../../ui-entity/actions/entity-event-list';
import { ContactSearchModel } from '../../../shared/model/contact-search.model';
import { RuntimeService } from '../../../runtime/shared/runtime.service';

@Injectable()
export class ContactEffects {

  /**
   * Constructor
   */
  constructor(
    private actions$: Actions,
    private contactApiService: ContactApiPhalconService,
    private layoutService: LayoutService,
    private browserService: BrowserService,
    private confirmService: ConfirmService,
    private contactService: ContactService,
    private runtimeService: RuntimeService,
  ) {

  }

  /**
   * Load contact summary and display contextual content on contact preview
   *
   * @action ContactEventPreview
   */
  ContactEventPreview$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<ContactEventPreview>(ContactEventPreview.TYPE),
    switchMap((action) => concat(

      // Update preview contact ID
      of(new ContactUpdatePreviewContactId({
        previewContactId: action.payload.contactId,
      })),

      // Update runtime contextual
      of(new RuntimeUpdateContextual({
        contextual: {
          uid: 'preview-contact',
          position: action.payload.position,
        },
      })),

      // API call
      this
        .contactService
        .summary(action.payload.contactId, action.payload.hash)
        .pipe(

          // Success
          switchMap(contact => [

            // Upsert data model
            new ContactUpsert({
              models: [contact],
            }),
          ]),

          // Error
          catchError(error => [

            // Notification
            new RuntimeEventNotification({
              type: NotificationTypeEnum.failure,
              message: 'notification_search_failure',
            }),

            // Broadcast error
            new RuntimeEventError({ id: '2', error: error }),
          ]),
        ),
    )),
  ));

  /**
   * Perform API call to change contact ranking
   *
   * @action ContactEventChangeRanking
   */
  ContactEventChangeRanking$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<ContactEventChangeRanking>(ContactEventChangeRanking.TYPE),
    switchMap(action => {

      // No contact found or ranking did not change
      if (!action.payload.contact || action.payload.ranking === action.payload.contact.ranking) {

        return [];
      }

      const contactUpdated = action.payload.contact.clone<ContactModel>();
      contactUpdated.ranking = action.payload.ranking;

      return concat(

        // Optimistic update
        of(new ContactUpsert({
          models: [contactUpdated],
        })),

        // Notification
        of(new RuntimeEventNotification({
          type: NotificationTypeEnum.success,
          message: 'notification_contact_update_ranking',
        })),

        // API call
        this
          .contactApiService
          .updateRanking(contactUpdated.id, action.payload.ranking)
          .pipe(

            // Success
            map(response => new EntityEventChanged({
              entity: EntityEnum.contact,
              ids: [contactUpdated.id],
            })),

            // Error
            catchError(error => [

              // Notification
              new RuntimeEventNotification({
                type: NotificationTypeEnum.failure,
                message: 'notification_rollback',
              }),

              // Broadcast error
              new RuntimeEventError({ id: '25', error: error }),

              // Rollback
              action.payload.contact === null ? null : new ContactUpsert({
                models: [action.payload.contact],
              }),
            ]),
          ),
      );
    }),
  ));

  /**
   * Update legacy DOM when updating basket
   *
   * @action ContactIoBasketContactIds
   */
  ContactIoBasketContactIds$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<ContactIoBasketContactIds>(ContactIoBasketContactIds.TYPE),
    switchMap(action => zip(of(action), this.contactService.selectBasketContactIds())),
    switchMap(([action, basketContactIds]) => {

      // TODO[later] Remove once fully on Angular
      this.layoutService.updateLegacyContactBasketCount(basketContactIds.length);

      return [];
    }),
  ));

  /**
   * Perform API call to add contact IDs to basket
   *
   * @action ContactEventAddBasket
   */
  ContactEventAddBasket$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<ContactEventAddBasket>(ContactEventAddBasket.TYPE),
    switchMap(action => concat(

      // Optimistic update
      of(new ContactIoBasketContactIds({
        in: action.payload.contactIds,
      })),

      // Notification
      of(new RuntimeEventNotification({
        type: NotificationTypeEnum.success,
        message: action.payload.contactIds.length > 1 ?
          'notification_contact_add_basket_plural' : 'notification_contact_add_basket_singular',
      })),

      // API call
      this
        .contactApiService
        .addBasket(action.payload.contactIds)
        .pipe(

          // Success
          switchMap(response => [

            // Broadcast event
            new EntityEventChanged({
              entity: EntityEnum.contact,
              ids: action.payload.contactIds,
            }),
          ]),

          // Error
          catchError(error => [

            // Notification
            new RuntimeEventNotification({
              type: NotificationTypeEnum.failure,
              message: 'notification_rollback',
            }),

            // Broadcast error
            new RuntimeEventError({ id: '26', error: error }),

            // Rollback
            new ContactIoBasketContactIds({
              out: action.payload.contactIds,
            }),
          ]),
        ),
    )),
  ));

  /**
   * Perform API call to remove contact IDs from basket
   *
   * @action ContactEventRemoveBasket
   */
  ContactEventRemoveBasket$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<ContactEventRemoveBasket>(ContactEventRemoveBasket.TYPE),
    switchMap(action => concat(

      // Optimistic update
      of(new ContactIoBasketContactIds({
        out: action.payload.contactIds,
      })),

      // Notification
      of(new RuntimeEventNotification({
        type: NotificationTypeEnum.success,
        message: action.payload.contactIds.length > 1 ?
          'notification_contact_remove_basket_plural' : 'notification_contact_remove_basket_singular',
      })),

      // API call
      this
        .contactApiService
        .removeBasket(action.payload.contactIds)
        .pipe(

          // Success
          switchMap(response => [

            // Broadcast event
            new EntityEventChanged({
              entity: EntityEnum.contact,
              ids: action.payload.contactIds,
            }),
          ]),

          // Error
          catchError(error => [

            // Notification
            new RuntimeEventNotification({
              type: NotificationTypeEnum.failure,
              message: 'notification_rollback',
            }),

            // Broadcast error
            new RuntimeEventError({ id: '27', error: error }),

            // Rollback
            new ContactIoBasketContactIds({
              in: action.payload.contactIds,
            }),
          ]),
        ),
    )),
  ));

  /**
   * Redirect to email creation URL
   *
   * @action ContactEventSendEmail
   */
  ContactEventSendEmail$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<ContactEventSendEmail>(ContactEventSendEmail.TYPE),
    switchMap(action => zip(
      of(action),
      this.runtimeService.selectFeature(),
    )),
    switchMap(([action, feature]) => {

      const baseUrl = feature.emailing === true ? '/emailing' : '/emailing/emailCreation';
      const params = action.payload.contactIds.map(contactId => 'recipient_id[]=' + contactId).join('&');

      this.browserService.blank(baseUrl + (params ? '?' + params : ''));

      return [];
    }),
  ));

  /**
   * Perform API call to archive contacts
   *
   * @action ContactEventArchive
   */
  ContactEventArchive$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<ContactEventArchive>(ContactEventArchive.TYPE),
    switchMap(action => zip(
      of(action),
      this.contactApiService.archiveWarning(action.payload.contactIds),
    )),
    switchMap(([action, response]) => {

      const message = {
        singular: {
          default: 'confirm_contact_archive_singular',
          warning: 'confirm_contact_archive_singular_warning',
        },
        plural: {
          default: 'confirm_contact_archive_plural',
          warning: 'confirm_contact_archive_plural_warning',
        },
      };

      const level1 = action.payload.contactIds.length > 1 ? 'plural' : 'singular';
      const level2 = response.warning === true ? 'warning' : 'default';

      return zip(
        of(action),
        this.confirmService.message(message[level1][level2]),
        this.contactService.selectBasketContactIds(),
      );
    }),
    switchMap(([action, isValid, basketContactIds]) => {

      const actions = [];

      if (isValid === false) {

        return actions;
      }

      // Default action
      actions.push(
        new EntityEventOperation({
          entity: EntityEnum.contact,
          ids: action.payload.contactIds,
          message: 'notification_contact_archive',
          operation: 'archive',
          apiCall: () => this.contactApiService.archive(action.payload.contactIds),
        }),
      );

      // Remove contact IDs from basket
      const removeBasketContactIds = action.payload.contactIds.filter(contactId => basketContactIds.indexOf(contactId) > -1);

      if (removeBasketContactIds.length > 0) {

        actions.push(
          new ContactEventRemoveBasket({
            contactIds: removeBasketContactIds,
          }),
        );
      }

      return actions;
    }),
  ));

  /**
   * Perform API call to unarchive contacts
   *
   * @action ContactEventUnarchive
   */
  ContactEventUnarchive$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<ContactEventUnarchive>(ContactEventUnarchive.TYPE),
    switchMap(action => zip(
      of(action),
      this.confirmService.message(
        action.payload.contactIds.length > 1 ? 'confirm_contact_unarchive_plural' : 'confirm_contact_unarchive_singular',
      ),
      this.contactService.selectBasketContactIds(),
    )),
    switchMap(([action, isValid, basketContactIds]) => {

      const actions = [];

      if (isValid === false) {

        return actions;
      }

      // Default action
      actions.push(
        new EntityEventOperation({
          entity: EntityEnum.contact,
          ids: action.payload.contactIds,
          message: 'notification_contact_unarchive',
          operation: 'unarchive',
          apiCall: () => this.contactApiService.unarchive(action.payload.contactIds),
        }),
      );

      // Remove contact IDs from basket
      const removeBasketContactIds = action.payload.contactIds.filter(contactId => basketContactIds.indexOf(contactId) > -1);

      if (removeBasketContactIds.length > 0) {

        actions.push(
          new ContactEventRemoveBasket({
            contactIds: removeBasketContactIds,
          }),
        );
      }

      return actions;
    }),
  ));

  /**
   * Open export in new tab
   *
   * @action ContactEventExport
   */
  ContactEventExport$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<ContactEventExport>(ContactEventExport.TYPE),
    switchMap(action => {

      this.browserService.blankPost('/contact/ajax/export', {
        export_mode: action.payload.mode,
        ids: action.payload.contactIds,
      });

      return [];
    }),
  ));

  /**
   * Updates transfer state when form input has been updated
   *
   * @action ContactEventChangeInputTransfer
   */
  ContactEventChangeInputTransfer$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<ContactEventChangeInputTransfer>(ContactEventChangeInputTransfer.TYPE),
    mergeMap(action => zip(
      of(action),
      this.contactService.selectTransfer(),
    )),
    mergeMap(([action, transfer]) => {

      const actions: Array<Observable<Action>> = [];
      const newTransfer = {
        ...transfer,
      };

      // Update with payload's input
      newTransfer[action.payload.input.name] = action.payload.input.value;

      actions.push(

        // Update transfer
        of(new ContactUpdateTransfer({
          transfer: newTransfer,
        })),
      );

      // Agency ID updated
      if (action.payload.input.name === 'agencyId' && action.payload.input.value) {

        actions.push(

          // API call
          this
            .contactApiService
            .agencyBrokers(<string>action.payload.input.value)
            .pipe(

              // Success
              switchMap(contacts => [

                // Upsert contacts (only update the fullname)
                new ContactUpsert({
                  models: contacts,
                }),

                // Update contacts by agency ID
                new ContactUpdateByAgencyId({
                  agencyId: <string>action.payload.input.value,
                  contactIds: contacts.map(contact => contact.id),
                }),
              ]),

              // Error
              catchError(error => [

                // Broadcast error
                new RuntimeEventError({ id: '28', error: error }),
              ]),
            ),
        );
      }

      return concat(...actions);
    }),
  ));

  /**
   * Perform API call to transfer contacts
   *
   * @action ContactEventTransfer
   */
  ContactEventTransfer$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<ContactEventTransfer>(ContactEventTransfer.TYPE),
    map(action => new EntityEventOperation({
      entity: EntityEnum.contact,
      ids: action.payload.transfer.contactIds,
      message: 'notification_contact_transfer_broker',
      operation: 'transfer',
      apiCall: () => this.contactApiService.transfer(action.payload.transfer),
    })),
  ));

  /**
   * Perform API call to modify broker of contacts
   *
   * @action ContactEventModifyBroker
   */
  ContactEventModifyBroker$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<ContactEventModifyBroker>(ContactEventModifyBroker.TYPE),
    map(action => new EntityEventOperation({
      entity: EntityEnum.contact,
      ids: action.payload.modifyBroker.contactIds,
      message: 'notification_contact_modify_broker',
      operation: 'modify-broker',
      apiCall: () => this.contactApiService.modifyBroker(action.payload.modifyBroker),
    })),
  ));

  /**
   * Perform API call to transfer contact activity
   *
   * @action ContactEventTransferActivity
   */
  ContactEventTransferActivity$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<ContactEventTransferActivity>(ContactEventTransferActivity.TYPE),
    map(action => new EntityEventOperation({
      entity: EntityEnum.contact,
      ids: [action.payload.transferActivity.contactId],
      message: 'notification_contact_transfer_activity',
      operation: 'transfer-activity',
      apiCall: () => this.contactApiService.transferActivity(action.payload.transferActivity),
    })),
  ));

  /**
   * Perform API call to set avatar
   *
   * @action ContactEventSetAvatar
   */
  ContactEventSetAvatar$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<ContactEventSetAvatar>(ContactEventSetAvatar.TYPE),
    switchMap(action => {

      return this.contactApiService
        .setAvatar(action.payload.contact, action.payload.upload)
        .pipe(

          // Success
          switchMap(response => {

            if (!response || response.success === false) {

              return [

                // Notification
                new RuntimeEventNotification({
                  type: NotificationTypeEnum.failure,
                  message: 'notification_contact_avatar_set_fail',
                }),
              ];
            }

            const newContact = action.payload.contact.clone<ContactModel>();
            newContact.photoId = action.payload.upload.fileId;
            newContact.photoURL = action.payload.upload.thumbnailUrl;

            return [

              // Event change avatar
              new ContactEventChangeAvatar({
                contact: newContact,
              }),

              // Notification
              new RuntimeEventNotification({
                type: NotificationTypeEnum.success,
                message: 'notification_contact_avatar_remove_success',
              }),
            ];
          }),

          // Error
          catchError(error => [

            // Notification
            new RuntimeEventNotification({
              type: NotificationTypeEnum.failure,
              message: 'notification_contact_avatar_set_fail',
            }),

            // Broadcast error
            new RuntimeEventError({ id: '39', error: error }),
          ]),
      );
    }),
  ));

  /**
   * Perform API call to remove avatar
   *
   * @action ContactEventRemoveAvatar
   */
  ContactEventRemoveAvatar$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<ContactEventRemoveAvatar>(ContactEventRemoveAvatar.TYPE),
    switchMap(action => zip(
      of(action),
      this.confirmService.message('confirm_avatar_remove'),
    )),
    switchMap(([action, isValid]) => {

      if (isValid === false) {

        return [];
      }

      return this.contactApiService
        .removeAvatar(action.payload.contact)
        .pipe(

          // Success
          switchMap(response => {

            if (!response || response.success === false) {

              return [

                // Notification
                new RuntimeEventNotification({
                  type: NotificationTypeEnum.failure,
                  message: 'notification_rollback',
                }),
              ];
            }

            const newContact = action.payload.contact.clone<ContactModel>();
            newContact.photoId = '';
            newContact.photoURL = '';

            return [

              // Event change avatar
              new ContactEventChangeAvatar({
                contact: newContact,
              }),
            ];
          }),

          // Error
          catchError(error => [

            // Notification
            new RuntimeEventNotification({
              type: NotificationTypeEnum.failure,
              message: 'notification_rollback',
            }),

            // Broadcast error
            new RuntimeEventError({ id: '40', error: error }),
          ]),
      );
    })),
  );

  /**
   * Changed contact avatar
   *
   * @action ContactEventChangeAvatar
   */
  ContactEventChangeAvatar$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<ContactEventChangeAvatar>(ContactEventChangeAvatar.TYPE),
    switchMap(action => {

      return [

        // Upsert data model
        new ContactUpsert({
          models: [action.payload.contact],
        }),
      ];
    }),
  ));

  /**
   * Perform API call to list contacts
   *
   * @action EntityEventList
   */
  EntityEventList$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<EntityEventList>(EntityEventList.TYPE),
    filter(action => action.payload.entity === EntityEnum.contact),
    switchMap(action => {

      return this
        .contactApiService
        .list(
          action.payload.pagination,
          action.payload.sort,
          <ContactSearchModel>action.payload.filters,
        ).pipe(

          // Success
          switchMap(list => {

            return [

              // Upsert contacts
              new ContactUpsert({
                models: list.models,
              }),

              // Broadcast event
              new EntityEventChanged({
                entity: action.payload.entity,
                ids: list.models.map(model => model.id),
              }),
            ];
          }),

          // Error
          catchError(error => [

            // Broadcast error
            new RuntimeEventError({ id: '61', error: error }),
          ]),
        );
    }),
  ));
}
