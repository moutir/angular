import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { concat, Observable, of, zip } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap } from 'rxjs/operators';

import { PropertyEventChangeRanking } from '../actions/property-event-change-ranking';
import { PropertyApiService } from '../../../api/shared/property/property-api.service';
import { RuntimeEventError } from '../../ui-runtime/actions/runtime-event-error';
import { PropertyEventAddBasket } from '../actions/property-event-add-basket';
import { ConfirmService } from '../../../core/shared/confirm.service';
import { PropertyEventDuplicate } from '../actions/property-event-duplicate';
import { LayoutService } from '../../../layout/shared/layout.service';
import { PropertyIoBasketPropertyIds } from '../actions/property-io-basket-property-ids';
import { RuntimeEventNotification } from '../../ui-runtime/actions/runtime-event-notification';
import { NotificationTypeEnum } from '../../../shared/enum/notification-type.enum';
import { PropertyEventSendEmail } from '../actions/property-event-send-email';
import { BrowserService } from '../../../core/shared/browser/browser.service';
import { PropertyEventGenerateReport } from '../actions/property-event-generate-report';
import { PropertyEventArchive } from '../actions/property-event-archive';
import { PropertyEventConvertType } from '../actions/property-event-convert-type';
import { PropertyEventTransfer } from '../actions/property-event-transfer';
import { EntityEventChanged } from '../../ui-entity/actions/entity-event-changed';
import { PropertyEventManagePublication } from '../actions/property-event-manage-publication';
import { PropertyEventRemoveMls } from '../actions/property-event-remove-mls';
import { EntityEventOperation } from '../../ui-entity/actions/entity-event-operation';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { PropertyEventUnarchive } from '../actions/property-event-unarchive';
import { PropertyEventChangeInputTransfer } from '../actions/property-event-change-input-transfer';
import { ContactApiPhalconService } from '../../../api/shared/contact/contact-api-phalcon.service';
import { PropertyUpdateTransfer } from '../actions/property-update-transfer';
import { ContactUpdateByAgencyId } from '../../data-contact/actions/contact-update-by-agency-id';
import { RuntimeUpdateContextual } from '../../ui-runtime/actions/runtime-update-contextual';
import { PropertyUpdateBrochureMenu } from '../actions/property-update-brochure-menu';
import { PropertyEventRemoveBasket } from '../actions/property-event-remove-basket';
import { ContactUpsert } from '../../data-contact/actions/contact-upsert';
import { PropertyUpsert } from '../../data-property/actions/property-upsert';
import { PropertyModel } from '../../../shared/model/property.model';
import { PropertyUpdateMortgage } from '../actions/property-update-mortgage';
import { PropertyEventPreview } from '../actions/property-event-preview';
import { PropertyUpdatePreviewPropertyId } from '../actions/property-update-preview-property-id';
import { PropertyUpdateValuation } from '../actions/property-update-valuation';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { PropertyService } from '../../../core/shared/property/property.service';
import { AgencyPreferenceEnum } from '../../../shared/enum/agency-preference.enum';
import { PropertyUpdateBrochure } from '../actions/property-update-brochure';
import { EntityEventList } from '../../ui-entity/actions/entity-event-list';
import { PropertySearchModel } from '../../../shared/model/property-search.model';
import { PropertyEventChangeInputBrochure } from '../actions/property-event-change-input-brochure';

@Injectable()
export class PropertyEffects {

  /**
   * Constructor
   */
  constructor(
    private actions$: Actions,
    private propertyApiService: PropertyApiService,
    private contactApiService: ContactApiPhalconService,
    private confirmService: ConfirmService,
    private layoutService: LayoutService,
    private browserService: BrowserService,
    private runtimeService: RuntimeService,
    private propertyService: PropertyService,
  ) {

  }

  /**
   * Perform API call to change property ranking
   *
   * @action PropertyEventChangeRanking
   */
  PropertyEventChangeRanking$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PropertyEventChangeRanking>(PropertyEventChangeRanking.TYPE),
    switchMap(action => zip(of(action), this.propertyService.select(action.payload.id))),
    switchMap(([action, property]) => {

      // No property found or ranking did not change
      if (!property || action.payload.ranking === property.ranking) {

        return [];
      }

      const propertyUpdated = new PropertyModel();
      propertyUpdated.id = action.payload.id;
      propertyUpdated.ranking = action.payload.ranking;

      return concat(

        // Optimistic update
        of(new PropertyUpsert({
          models: [propertyUpdated],
        })),

        // Notification
        of(new RuntimeEventNotification({
          type: NotificationTypeEnum.success,
          message: 'notification_property_update_ranking',
        })),

        // API call
        this
          .propertyApiService
          .updateRanking(action.payload.id, action.payload.ranking)
          .pipe(

            // Success
            map(response => new EntityEventChanged({
              entity: EntityEnum.property,
              ids: [action.payload.id],
            })),

            // Error
            catchError(error => [

              // Notification
              new RuntimeEventNotification({
                type: NotificationTypeEnum.failure,
                message: 'notification_rollback',
              }),

              // Broadcast error
              new RuntimeEventError({ id: '6', error: error }),

              // Rollback
              property === null ? null : new PropertyUpsert({
                models: [property],
              }),
            ]),
          ),
      );
    }),
  ));

  /**
   * Perform API call to add property IDs to basket
   *
   * @action PropertyEventAddBasket
   */
  PropertyEventAddBasket$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PropertyEventAddBasket>(PropertyEventAddBasket.TYPE),
    switchMap(action => concat(

      // Optimistic update
      of(new PropertyIoBasketPropertyIds({
        in: action.payload.propertyIds,
      })),

      // Notification
      of(new RuntimeEventNotification({
        type: NotificationTypeEnum.success,
        message: action.payload.propertyIds.length > 1 ?
          'notification_property_add_basket_plural' : 'notification_property_add_basket_singular',
      })),

      // API call
      this
        .propertyApiService
        .addBasket(action.payload.propertyIds)
        .pipe(

          // Success
          switchMap(response => [

            // Broadcast event
            new EntityEventChanged({
              entity: EntityEnum.property,
              ids: action.payload.propertyIds,
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
            new RuntimeEventError({ id: '7', error: error }),

            // Rollback
            new PropertyIoBasketPropertyIds({
              out: action.payload.propertyIds,
            }),
          ]),
        ),
    )),
  ));

  /**
   * Perform API call to remove property IDs from basket
   *
   * @action PropertyEventRemoveBasket
   */
  PropertyEventRemoveBasket$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PropertyEventRemoveBasket>(PropertyEventRemoveBasket.TYPE),
    switchMap(action => concat(

      // Optimistic update
      of(new PropertyIoBasketPropertyIds({
        out: action.payload.propertyIds,
      })),

      // Notification
      of(new RuntimeEventNotification({
        type: NotificationTypeEnum.success,
        message: action.payload.propertyIds.length > 1 ?
          'notification_property_remove_basket_plural' : 'notification_property_remove_basket_singular',
      })),

      // API call
      this
        .propertyApiService
        .removeBasket(action.payload.propertyIds)
        .pipe(

          // Success
          switchMap(response => [

            // Broadcast event
            new EntityEventChanged({
              entity: EntityEnum.property,
              ids: action.payload.propertyIds,
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
            new RuntimeEventError({ id: '8', error: error }),

            // Rollback
            new PropertyIoBasketPropertyIds({
              in: action.payload.propertyIds,
            }),
          ]),
        ),
    )),
  ));

  /**
   * Update legacy DOM when updating basket
   *
   * @action PropertyIoBasketPropertyIds
   */
  PropertyIoBasketPropertyIds$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PropertyIoBasketPropertyIds>(PropertyIoBasketPropertyIds.TYPE),
    switchMap(action => zip(of(action), this.propertyService.selectBasketPropertyIds())),
    switchMap(([action, basketPropertyIds]) => {

      // TODO[later] Remove once fully on Angular
      this.layoutService.updateLegacyPropertyBasketCount(basketPropertyIds.length);

      return [];
    }),
  ));

  /**
   * Redirect to email creation URL
   *
   * @action PropertyEventSendEmail
   */
  PropertyEventSendEmail$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PropertyEventSendEmail>(PropertyEventSendEmail.TYPE),
    switchMap(action => zip(
      of(action),
      this.runtimeService.selectFeature(),
    )),
    switchMap(([action, feature]) => {

      const baseUrl = feature.emailing === true ? '/emailing' : '/emailing/emailCreation';
      const params = action.payload.propertyIds.map(propertyId => 'property_id[]=' + propertyId).join('&');

      this.browserService.blank(baseUrl + (params ? '?' + params : ''));

      return [];
    }),
  ));

  /**
   * Redirect to report generation URL
   *
   * @action PropertyEventGenerateReport
   */
  PropertyEventGenerateReport$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PropertyEventGenerateReport>(PropertyEventGenerateReport.TYPE),
    switchMap(action => {

      const baseUrl = '/api/property/property-report/0';
      const params = action.payload.propertyIds.map(propertyId => 'property_id[]=' + propertyId).join('&');

      this.browserService.blank(baseUrl + (params ? '?' + params : ''));

      return [];
    }),
  ));

  /**
   * Perform API call to duplicate properties
   *
   * @action PropertyEventDuplicate
   */
  PropertyEventDuplicate$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PropertyEventDuplicate>(PropertyEventDuplicate.TYPE),
    switchMap(action => zip(
      of(action),
      this.confirmService.message(
        action.payload.propertyIds.length > 1 ? 'confirm_property_duplicate_plural' : 'confirm_property_duplicate_singular',
      ),
    )),
    switchMap(([action, isValid]) => isValid === false ? [] : [new EntityEventOperation({
      entity: EntityEnum.property,
      ids: action.payload.propertyIds,
      message: 'notification_property_duplicate',
      operation: 'duplicate',
      apiCall: () => this.propertyApiService.duplicate(action.payload.propertyIds),
    })]),
  ));

  /**
   * Perform API call to archive properties
   *
   * @action PropertyEventArchive
   */
  PropertyEventArchive$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PropertyEventArchive>(PropertyEventArchive.TYPE),
    switchMap(action => zip(
      of(action),
      this.confirmService.message(
        action.payload.propertyIds.length > 1 ? 'confirm_property_archive_plural' : 'confirm_property_archive_singular',
      ),
      this.propertyService.selectBasketPropertyIds(),
    )),
    switchMap(([action, isValid, basketPropertyIds]) => {

      const actions = [];

      if (isValid === false) {

        return actions;
      }

      // Default action
      actions.push(
        new EntityEventOperation({
          entity: EntityEnum.property,
          ids: action.payload.propertyIds,
          message: 'notification_property_archive',
          operation: 'archive',
          apiCall: () => this.propertyApiService.archive(action.payload.propertyIds),
        }),
      );

      // Remove property IDs from basket
      const removeBasketPropertyIds = action.payload.propertyIds.filter(propertyId => basketPropertyIds.indexOf(propertyId) > -1);

      if (removeBasketPropertyIds.length > 0) {

        actions.push(
          new PropertyEventRemoveBasket({
            propertyIds: removeBasketPropertyIds,
          }),
        );
      }

      return actions;
    }),
  ));

  /**
   * Perform API call to unarchive properties
   *
   * @action PropertyEventUnarchive
   */
  PropertyEventUnarchive$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PropertyEventUnarchive>(PropertyEventUnarchive.TYPE),
    switchMap(action => zip(
      of(action),
      this.confirmService.message(
        action.payload.propertyIds.length > 1 ? 'confirm_property_unarchive_plural' : 'confirm_property_unarchive_singular',
      ),
      this.propertyService.selectBasketPropertyIds(),
    )),
    switchMap(([action, isValid, basketPropertyIds]) => {

      const actions = [];

      if (isValid === false) {

        return actions;
      }

      // Default action
      actions.push(
        new EntityEventOperation({
          entity: EntityEnum.property,
          ids: action.payload.propertyIds,
          message: 'notification_property_unarchive',
          operation: 'unarchive',
          apiCall: () => this.propertyApiService.unarchive(action.payload.propertyIds),
        }),
      );

      // Remove property IDs from basket
      const removeBasketPropertyIds = action.payload.propertyIds.filter(propertyId => basketPropertyIds.indexOf(propertyId) > -1);

      if (removeBasketPropertyIds.length > 0) {

        actions.push(
          new PropertyEventRemoveBasket({
            propertyIds: removeBasketPropertyIds,
          }),
        );
      }

      return actions;
    }),
  ));

  /**
   * Perform API call to convert properties types
   *
   * @action PropertyEventConvertType
   */
  PropertyEventConvertType$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PropertyEventConvertType>(PropertyEventConvertType.TYPE),
    switchMap(action => zip(
      of(action),
      this.confirmService.message(
        action.payload.propertyIds.length > 1 ?
          'confirm_property_convert_' + action.payload.type + '_plural' : 'confirm_property_convert_' + action.payload.type + '_singular',
      ),
    )),
    switchMap(([action, isValid]) => isValid === false ? [] : [new EntityEventOperation({
      entity: EntityEnum.property,
      ids: action.payload.propertyIds,
      message: 'notification_property_convert_type',
      operation: 'convert-type',
      apiCall: () => this.propertyApiService.updateType(action.payload.propertyIds, action.payload.type),
    })]),
  ));

  /**
   * Updates transfer state when form input has been updated
   *
   * @action PropertyEventChangeInputTransfer
   */
  PropertyEventChangeInputTransfer$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PropertyEventChangeInputTransfer>(PropertyEventChangeInputTransfer.TYPE),
    mergeMap(action => zip(
      of(action),
      this.propertyService.selectTransfer(),
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
        of(new PropertyUpdateTransfer({
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
                new RuntimeEventError({ id: '9', error: error }),
              ]),
            ),
        );
      }

      return concat(...actions);
    }),
  ));

  /**
   * Perform API call to transfer properties
   *
   * @action PropertyEventTransfer
   */
  PropertyEventTransfer$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PropertyEventTransfer>(PropertyEventTransfer.TYPE),
    map(action => new EntityEventOperation({
      entity: EntityEnum.property,
      ids: action.payload.transfer.propertyIds,
      message: 'notification_property_transfer_broker',
      operation: 'transfer-broker',
      apiCall: () => this.propertyApiService.transfer(action.payload.transfer),
    })),
  ));

  /**
   * Perform API call to manage properties publication
   *
   * @action PropertyEventManagePublication
   */
  PropertyEventManagePublication$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PropertyEventManagePublication>(PropertyEventManagePublication.TYPE),
    map(action => {

      // No changes selected
      if (
        Object.keys(action.payload.publication.websites.changes).length === 0 &&
        Object.keys(action.payload.publication.portals.changes).length === 0
      ) {

        return new RuntimeEventNotification({
          type: NotificationTypeEnum.warning,
          message: 'notification_property_publication_no_changes',
        });
      }

      // Default action
      return new EntityEventOperation({
        entity: EntityEnum.property,
        ids: action.payload.publication.propertyIds,
        message: 'notification_property_publication',
        operation: 'publication',
        apiCall: () => this.propertyApiService.publication(action.payload.publication),
      });
    }),
  ));

  /**
   * Perform API call to remove properties from MLS
   *
   * @action PropertyEventRemoveMls
   */
  PropertyEventRemoveMls$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PropertyEventRemoveMls>(PropertyEventRemoveMls.TYPE),
    map(action => new EntityEventOperation({
      entity: EntityEnum.property,
      ids: action.payload.propertyIds,
      message: 'notification_property_remove_mls',
      operation: 'remove-mls',
      apiCall: () => this.propertyApiService.removeMls(action.payload.propertyIds),
    })),
  ));

  /**
   * Display brochure menu when requesting it
   *
   * @action PropertyUpdateBrochureMenu
   */
  PropertyUpdateBrochureMenu$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PropertyUpdateBrochureMenu>(PropertyUpdateBrochureMenu.TYPE),
    map(action => new RuntimeUpdateContextual({
      contextual: {
        uid: 'property-brochure-menu',
        position: action.payload.brochureMenu.position,
      },
    })),
  ));

  /**
   * Open mortgage at step 1
   *
   * @action PropertyUpdateMortgage step === 1
   */
  PropertyUpdateMortgage1$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PropertyUpdateMortgage>(PropertyUpdateMortgage.TYPE),
    filter(action => action.payload.mortgage.step === 1),
    switchMap(action => zip(
      of(action),
      this.propertyService.select(action.payload.mortgage.propertyId),
    )),
    switchMap(([action, property]) => concat(

      // API call
      this
        .propertyApiService
        .mortgageCalculate(action.payload.mortgage.propertyId)
        .pipe(

          // Success
          switchMap(calculation => {

            const newProperty = property.clone<PropertyModel>();
            newProperty.mortgageCalculation = calculation;

            return [

              // Update property
              new PropertyUpsert({
                models: [newProperty],
              }),
            ];
          }),

          // Error
          catchError(error => [

            // Back to step 0
            new PropertyUpdateMortgage({
              mortgage: {
                step: 0,
                propertyId: '',
                contactId: '',
                query: '',
              },
            }),

            // Notification
            new RuntimeEventNotification({
              type: NotificationTypeEnum.failure,
              message: error.status !== 500 &&
                error && error.error && error.error.errors && error.error.errors[0] && error.error.errors[0].message ||
                'notification_search_failure',
            }),

            // Broadcast error
            new RuntimeEventError({ id: '10', error: error }),
          ]),
        ),
    )),
  ));

  /**
   * Open mortgage at step 3
   *
   * @action PropertyUpdateMortgage step === 3
   */
  PropertyUpdateMortgage3$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PropertyUpdateMortgage>(PropertyUpdateMortgage.TYPE),
    filter(action => action.payload.mortgage.step === 3),
    switchMap(action => zip(
      of(action),
      this.propertyService.selectMortgage(),
    )),
    switchMap(([action, mortgage]) => concat(

      // API call
      this
        .propertyApiService
        .mortgageSubmit(action.payload.mortgage.propertyId, action.payload.mortgage.contactId)
        .pipe(

          // Success
          switchMap(isSuccess => {

            return [

              // Update mortgage
              new PropertyUpdateMortgage({
                mortgage: {
                  ...mortgage,
                  step: 4,
                },
              }),
            ];
          }),

          // Error
          catchError(error => [

            // Back to step 2
            new PropertyUpdateMortgage({
              mortgage: {
                ...mortgage,
                step: 2,
              },
            }),

            // Notification
            new RuntimeEventNotification({
              type: NotificationTypeEnum.failure,
              message: error.status !== 500 &&
                error && error.error && error.error.errors && error.error.errors[0] && error.error.errors[0].message ||
                'notification_search_failure',
            }),

            // Broadcast error
            new RuntimeEventError({ id: '11', error: error }),
          ]),
        ),
    )),
  ));

  /**
   * Load property summary and display contextual content on property preview
   *
   * @action PropertyEventPreview
   */
  PropertyEventPreview$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PropertyEventPreview>(PropertyEventPreview.TYPE),
    switchMap((action) => concat(

      // Update preview property ID
      of(new PropertyUpdatePreviewPropertyId({
        previewPropertyId: action.payload.propertyId,
      })),

      // Update runtime contextual
      of(new RuntimeUpdateContextual({
        contextual: {
          uid: 'preview-property',
          position: action.payload.position,
        },
      })),

      // API call
      this
        .propertyApiService
        .summary(action.payload.propertyId)
        .pipe(

          // Success
          switchMap(property => [

            // Upsert data model
            new PropertyUpsert({
              models: [property],
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
            new RuntimeEventError({ id: '12', error: error }),
          ]),
        ),
    )),
  ));

  /**
   * Open valuation modal and call API to fetch property valuation
   *
   * @action PropertyUpdateValuation step === 1
   */
  PropertyUpdateValuation1$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PropertyUpdateValuation>(PropertyUpdateValuation.TYPE),
    filter(action => action.payload.valuation.step === 1),
    switchMap(action => concat(

      // API call
      this
        .propertyApiService
        .valuation(action.payload.valuation.propertyId)
        .pipe(

          // Success
          switchMap(valuation => {

            if (!valuation) {

              return [

                // Notification
                new RuntimeEventNotification({
                  type: NotificationTypeEnum.failure,
                  message: 'notification_rollback',
                }),
              ];
            }

            // Stop valuation button loader // TODO[later] Remove once fully on Angular
            this.browserService.getWindow().rfDebounce(false);

            return [

              // Update valuation with download link
              new PropertyUpdateValuation({
                valuation: {
                  ...action.payload.valuation,
                  step: 2,
                  link: valuation.link,
                },
              }),
            ];
          }),

          // Error
          catchError(error => {

            // Stop valuation button loader
            this.browserService.getWindow().rfDebounce(false);

            return [

              // Back to step 0
              new PropertyUpdateValuation({
                valuation: {
                  step: 0,
                  propertyId: '',
                  link: '',
                },
              }),

              // Notification
              new RuntimeEventNotification({
                type: NotificationTypeEnum.failure,
                message: error.status !== 500 &&
                  error && error.error && error.error.errors && error.error.errors[0] && error.error.errors[0].message ||
                  'notification_rollback',
              }),

              // Broadcast error
              new RuntimeEventError({ id: '22', error: error }),
            ];
          }),
        ),
    )),
  ));

  /**
   * Download valuation
   *
   * @action PropertyUpdateValuation step === 3
   */
  PropertyUpdateValuation3$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PropertyUpdateValuation>(PropertyUpdateValuation.TYPE),
    filter(action => action.payload.valuation.step === 3),
    map(action => {

      // Download valuation
      this.propertyService.valuationDownload(action.payload.valuation.link);

      // Reset to step 0
      return new PropertyUpdateValuation({
        valuation: {
          ...action.payload.valuation,
          step: 0,
        },
      });
    })),
  );

  /**
   * Updates brochure state when form input has been updated
   *
   * @action PropertyEventChangeInputBrochure
   */
  PropertyEventChangeInputBrochure$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PropertyEventChangeInputBrochure>(PropertyEventChangeInputBrochure.TYPE),
    mergeMap(action => zip(
      of(action),
      this.propertyService.selectBrochure(),
    )),
    map(([action, brochure]) => {

      const newBrochure = {
        ...brochure,
      };

      // Update with payload's input
      newBrochure[action.payload.input.name] = action.payload.input.value;

      // Update brochure
      return new PropertyUpdateBrochure({
        brochure: newBrochure,
      });
    }),
  ));

  /**
   * Download brochure or open settings modal if agency preference allows it
   *
   * @action PropertyUpdateBrochure step === 1
   */
  PropertyUpdateBrochure1$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PropertyUpdateBrochure>(PropertyUpdateBrochure.TYPE),
    filter(action => action.payload.brochure.step === 1),
    switchMap(action => zip(
      of(action),
      this.runtimeService.selectAgencyPreference(),
      this.propertyService.selectBrochureOptions(),
    )),
    switchMap(([action, agencyPreference, brochureOptions]) => {

      // User not allowed to pick broker
      if (agencyPreference[AgencyPreferenceEnum.brochureDownloadBroker] !== 'allow') {

        // Move to step 2
        return [
          new PropertyUpdateBrochure({
            brochure: {
              ...action.payload.brochure,
              step: 2,
            },
          }),
        ];
      }

      // Selected privacy value is not part of privacy options anymore
      if (
        brochureOptions.privacyId.length > 0 &&
        !brochureOptions.privacyId.find(option => option.value === action.payload.brochure.privacyId)
      ) {

        // Update brochure
        return [
          new PropertyUpdateBrochure({
            brochure: {
              ...action.payload.brochure,
              privacyId: brochureOptions.privacyId[0].value,
            },
          }),
        ];
      }

      return [];
    })),
  );

  /**
   * Download brochure on step 2
   *
   * @action PropertyUpdateBrochure step === 2
   */
  PropertyUpdateBrochure2$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PropertyUpdateBrochure>(PropertyUpdateBrochure.TYPE),
    filter(action => action.payload.brochure.step === 2),
    switchMap(action => zip(
      of(action),
      this.runtimeService.selectFeatureBrochure(),
    )),
    switchMap(([action, featureBrochure]) => {

      const brochure = {
        ...action.payload.brochure,
      };

      // Set type
      if (!action.payload.brochure.type) {

        brochure.type = featureBrochure.mapping.brochureIdToBrochureType[action.payload.brochure.typeId];
      }

      // Set privacy
      if (!action.payload.brochure.privacy) {

        brochure.privacy = featureBrochure.mapping.privacyIdToPrivacyType[action.payload.brochure.privacyId];
      }

      // Download brochure
      this.propertyService.brochureDownload(brochure);

      // Reset to step 0
      return [
        new PropertyUpdateBrochure({
          brochure: {
            ...action.payload.brochure,
            step: 0,
          },
        }),
      ];
    })),
  );

  /**
   * Perform API call to list properties
   *
   * @action EntityEventList
   */
  EntityEventList$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<EntityEventList>(EntityEventList.TYPE),
    filter(action => action.payload.entity === EntityEnum.property),
    switchMap(action => {

      return this
        .propertyApiService
        .list(
          action.payload.pagination,
          action.payload.sort,
          <PropertySearchModel>action.payload.filters,
        ).pipe(

          // Success
          switchMap(list => {

            return [

              // Upsert properties
              new PropertyUpsert({
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
            new RuntimeEventError({ id: '59', error: error }),
          ]),
        );
    }),
  ));
}
