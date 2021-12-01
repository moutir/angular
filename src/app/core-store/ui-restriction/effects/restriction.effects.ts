import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { concat, Observable, of, zip } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { RestrictionEventRemove } from '../actions/restriction-event-remove';
import { ConfirmService } from '../../../core/shared/confirm.service';
import { EntityEventOperation } from '../../ui-entity/actions/entity-event-operation';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { RestrictionPageService } from '../../../core/shared/restriction/restriction-page.service';
import { PageTypeEnum } from '../../../shared/enum/page-type.enum';
import { RestrictionApiService } from '../../../api/shared/restriction/restriction-api.service';
import { RuntimeUpdateContextual } from '../../ui-runtime/actions/runtime-update-contextual';
import { RestrictionUpsert } from '../../data-restriction/actions/restriction-upsert';
import { RuntimeEventNotification } from '../../ui-runtime/actions/runtime-event-notification';
import { NotificationTypeEnum } from '../../../shared/enum/notification-type.enum';
import { RuntimeEventError } from '../../ui-runtime/actions/runtime-event-error';
import { RestrictionEventPreview } from '../actions/restriction-event-preview';
import { RestrictionUpdatePreviewRestrictionId } from '../actions/restriction-update-preview-restriction-id';

@Injectable()
export class RestrictionEffects {

  /**
   * Constructor
   */
  constructor(
    private actions$: Actions,
    private confirmService: ConfirmService,
    private restrictionApiService: RestrictionApiService,
    private pageService: RestrictionPageService,
  ) {

  }

  /**
   * Perform API call to remove restriction
   *
   * @action RestrictionEventRemove
   */
  RestrictionEventRemove$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<RestrictionEventRemove>(RestrictionEventRemove.TYPE),
    switchMap(action => zip(
      of(action),
      this.confirmService.message(
        'confirm_restriction_remove_singular',
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
          entity: EntityEnum.restriction,
          ids: [action.payload.id],
          message: 'notification_restriction_remove',
          operation: 'remove',
          apiCall: () => this.restrictionApiService.remove(action.payload.id).pipe(
            map(response => {

              if (response === true) {

                // Redirect to list
                this.pageService.redirect(PageTypeEnum.list, null);
              }

              return response;
            }),
          ),
        }),
      );

      return actions;
    }),
  ));

  /**
   * Load restriction and display contextual content on restriction preview
   *
   * @action RestrictionEventPreview
   */
  RestrictionEventPreview$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<RestrictionEventPreview>(RestrictionEventPreview.TYPE),
    switchMap((action) => concat(

      // Update preview restriction ID
      of(new RestrictionUpdatePreviewRestrictionId({
        previewRestrictionId: action.payload.restrictionId,
      })),

      // Update runtime contextual
      of(new RuntimeUpdateContextual({
        contextual: {
          uid: 'preview-restriction',
          position: action.payload.position,
        },
      })),

      // API call
      this
        .restrictionApiService
        .load(action.payload.restrictionId)
        .pipe(

          // Success
          switchMap(restriction => [

            // Upsert data model
            new RestrictionUpsert({
              models: [restriction],
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
            new RuntimeEventError({ id: '49', error: error }),
          ]),
        ),
    )),
  ));
}
