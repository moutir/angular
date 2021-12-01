import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { concat, Observable, of } from 'rxjs';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';

import { RuntimeEventNotification } from '../ui-runtime/actions/runtime-event-notification';
import { NotificationTypeEnum } from '../../shared/enum/notification-type.enum';
import { EntityIoOperationIds } from './actions/entity-io-operation-ids';
import { EntityEventChanged } from './actions/entity-event-changed';
import { RuntimeEventError } from '../ui-runtime/actions/runtime-event-error';
import { EntityEventOperation } from './actions/entity-event-operation';
import { EntityEventOperationDone } from './actions/entity-event-operation-done';

@Injectable()
export class Effects {

  /**
   * Constructor
   */
  constructor(
    private actions$: Actions,
  ) {

  }

  /**
   * Perform ASYNC operation with user notifications
   *
   * @action EntityEventOperation
   */
  EntityEventOperation$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<EntityEventOperation>(EntityEventOperation.TYPE),
    mergeMap(action => concat(

      // Notification
      of(new RuntimeEventNotification({
        type: NotificationTypeEnum.info,
        message: [action.payload.message, 'wait', action.payload.ids.length > 1 ? 'plural' : 'singular'].join('_'),
      })),

      // Add operation IDs
      of(new EntityIoOperationIds({
        entity: action.payload.entity,
        in: action.payload.ids,
      })),

      // API call
      action.payload.apiCall()
        .pipe(

          // Success
          switchMap(response => {

            let error = '';

            if (response === false) {

              error = 'notification_rollback';

            } else if (response && response['success'] === false) {

              if (response['data'] && response['data']['message']) {

                error = response['data']['message'];

              } else if (response['msg']) {

                error = response['msg'];
              }
            }

            // Error
            if (error) {

              return [

                // Notification
                new RuntimeEventNotification({
                  type: NotificationTypeEnum.failure,
                  message: error,
                }),
              ];
            }

            return [

              // Broadcast event
              new EntityEventChanged({
                entity: action.payload.entity,
                ids: action.payload.ids,
              }),

              // Notification
              new RuntimeEventNotification({
                type: NotificationTypeEnum.success,
                message: [action.payload.message, action.payload.ids.length > 1 ? 'plural' : 'singular'].join('_'),
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
            new RuntimeEventError({ id: '3', error: error }),
          ]),
        ),

      // Remove operation IDs
      of(new EntityIoOperationIds({
        entity: action.payload.entity,
        out: action.payload.ids,
      })),

      // Done operation on IDs
      of(new EntityEventOperationDone({
        entity: action.payload.entity,
        operation: action.payload.operation,
        ids: action.payload.ids,
      })),
    )),
  ));
}
