import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { concat, Observable, of, zip } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';

import { PromotionEventPreview } from '../actions/promotion-event-preview';
import { PromotionUpdatePreviewPromotionId } from '../actions/promotion-update-preview-promotion-id';
import { RuntimeUpdateContextual } from '../../ui-runtime/actions/runtime-update-contextual';
import { PromotionUpsert } from '../../data-promotion/actions/promotion-upsert';
import { RuntimeEventNotification } from '../../ui-runtime/actions/runtime-event-notification';
import { RuntimeEventError } from '../../ui-runtime/actions/runtime-event-error';
import { PromotionApiService } from '../../../api/shared/promotion/promotion-api.service';
import { NotificationTypeEnum } from '../../../shared/enum/notification-type.enum';
import { PromotionUpdateBrochureMenu } from '../actions/promotion-update-brochure-menu';
import { PromotionEventSendEmail } from '../actions/promotion-event-send-email';
import { ConfirmService } from '../../../core/shared/confirm.service';
import { BrowserService } from '../../../core/shared/browser/browser.service';
import { PromotionEventArchive } from '../actions/promotion-event-archive';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { EntityEventOperation } from '../../ui-entity/actions/entity-event-operation';
import { PromotionEventUnarchive } from '../actions/promotion-event-unarchive';
import { PromotionEventRemoveMls } from '../actions/promotion-event-remove-mls';
import { PromotionSearchModel } from '../../../shared/model/promotion-search.model';
import { EntityEventList } from '../../ui-entity/actions/entity-event-list';
import { EntityEventChanged } from '../../ui-entity/actions/entity-event-changed';
import { RuntimeService } from '../../../runtime/shared/runtime.service';

@Injectable()
export class PromotionEffects {

  /**
   * Constructor
   */
  constructor(
    private actions$: Actions,
    private promotionApiService: PromotionApiService,
    private confirmService: ConfirmService,
    private browserService: BrowserService,
    private runtimeService: RuntimeService,
  ) {

  }

  /**
   * Load promotion summary and display contextual content on promotion preview
   *
   * @action PromotionEventPreview
   */
  PromotionEventPreview$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PromotionEventPreview>(PromotionEventPreview.TYPE),
    switchMap((action) => concat(

      // Update preview promotion ID
      of(new PromotionUpdatePreviewPromotionId({
        previewPromotionId: action.payload.promotionId,
      })),

      // Update runtime contextual
      of(new RuntimeUpdateContextual({
        contextual: {
          uid: 'preview-promotion',
          position: action.payload.position,
        },
      })),

      // API call
      this
        .promotionApiService
        .summary(action.payload.promotionId)
        .pipe(

          // Success
          switchMap(promotion => [

            // Upsert data model
            new PromotionUpsert({
              models: [promotion],
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
            new RuntimeEventError({ id: '5', error: error }),
          ]),
        ),
    )),
  ));

  /**
   * Display brochure menu when requesting it
   *
   * @action PromotionUpdateBrochureMenu
   */
  PromotionUpdateBrochureMenu$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PromotionUpdateBrochureMenu>(PromotionUpdateBrochureMenu.TYPE),
    map(action => new RuntimeUpdateContextual({
      contextual: {
        uid: 'promotion-brochure-menu',
        position: action.payload.brochureMenu.position,
      },
    })),
  ));

  /**
   * Redirect to email creation URL
   *
   * @action PromotionEventSendEmail
   */
  PromotionEventSendEmail$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PromotionEventSendEmail>(PromotionEventSendEmail.TYPE),
    switchMap(action => zip(
      of(action),
      this.runtimeService.selectFeature(),
    )),
    switchMap(([action, feature]) => {

      const baseUrl = feature.emailing === true ? '/emailing' : '/emailing/emailCreation';
      const params = action.payload.promotionIds.map(promotionId => 'promo_id[]=' + promotionId).join('&');

      this.browserService.blank(baseUrl + (params ? '?' + params : ''));

      return [];
    }),
  ));

  /**
   * Perform API call to archive promotions
   *
   * @action PromotionEventArchive
   */
  PromotionEventArchive$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PromotionEventArchive>(PromotionEventArchive.TYPE),
    switchMap(action => zip(
      of(action),
      this.confirmService.message(
        action.payload.promotionIds.length > 1 ? 'confirm_promotion_archive_plural' : 'confirm_promotion_archive_singular',
      ),
    )),
    switchMap(([action, isValid]) => {

      const actions = [];

      if (isValid === false) {

        return actions;
      }

      // Default action
      actions.push(
        new EntityEventOperation({
          entity: EntityEnum.promotion,
          ids: action.payload.promotionIds,
          message: 'notification_promotion_archive',
          operation: 'archive',
          apiCall: () => this.promotionApiService.archive(action.payload.promotionIds),
        }),
      );

      return actions;
    }),
  ));

  /**
   * Perform API call to unarchive promotions
   *
   * @action PromotionEventUnarchive
   */
  PromotionEventUnarchive$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PromotionEventUnarchive>(PromotionEventUnarchive.TYPE),
    switchMap(action => zip(
      of(action),
      this.confirmService.message(
        action.payload.promotionIds.length > 1 ? 'confirm_promotion_unarchive_plural' : 'confirm_promotion_unarchive_singular',
      ),
    )),
    switchMap(([action, isValid]) => {

      const actions = [];

      if (isValid === false) {

        return actions;
      }

      // Default action
      actions.push(
        new EntityEventOperation({
          entity: EntityEnum.promotion,
          ids: action.payload.promotionIds,
          message: 'notification_promotion_unarchive',
          operation: 'unarchive',
          apiCall: () => this.promotionApiService.unarchive(action.payload.promotionIds),
        }),
      );

      return actions;
    }),
  ));

  /**
   * Perform API call to remove promotions from MLS
   *
   * @action PromotionEventRemoveMls
   */
  PromotionEventRemoveMls$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PromotionEventRemoveMls>(PromotionEventRemoveMls.TYPE),
    map(action => new EntityEventOperation({
      entity: EntityEnum.promotion,
      ids: action.payload.promotionIds,
      message: 'notification_promotion_remove_mls',
      operation: 'remove-mls',
      apiCall: () => this.promotionApiService.removeMls(action.payload.promotionIds),
    })),
  ));

  /**
   * Perform API call to list promotions
   *
   * @action EntityEventList
   */
  EntityEventList$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<EntityEventList>(EntityEventList.TYPE),
    filter(action => action.payload.entity === EntityEnum.promotion),
    switchMap(action => {

      return this
        .promotionApiService
        .list(
          action.payload.pagination,
          action.payload.sort,
          <PromotionSearchModel>action.payload.filters,
        ).pipe(

          // Success
          switchMap(list => {

            return [

              // Upsert promotions
              new PromotionUpsert({
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
            new RuntimeEventError({ id: '60', error: error }),
          ]),
        );
    }),
  ));
}
