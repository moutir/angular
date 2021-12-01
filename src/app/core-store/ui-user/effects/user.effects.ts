import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';
import { concat, Observable, of } from 'rxjs';

import { UserService } from '../../../core/shared/user/user.service';
import { UserEventSavePreference } from '../actions/user-event-save-preference';
import { RuntimeEventNotification } from '../../ui-runtime/actions/runtime-event-notification';
import { NotificationTypeEnum } from '../../../shared/enum/notification-type.enum';
import { RuntimeEventLoadedData } from '../../ui-runtime/actions/runtime-event-loaded-data';
import { RuntimeDataEnum } from '../../../shared/enum/runtime-data.enum';
import { RuntimeEventError } from '../../ui-runtime/actions/runtime-event-error';

@Injectable()
export class UserEffects {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected userService: UserService,
  ) {

  }

  /**
   * Store user preference on server when updated user preference
   *
   * @action UserEventSavePreference
   */
  UserEventSavePreference$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<UserEventSavePreference>(UserEventSavePreference.TYPE),
    mergeMap(action => concat(

      // Notification
      of(new RuntimeEventNotification({
        type: NotificationTypeEnum.info,
        message: 'notification_preference_user_update_wait',
      })),

      // Optimistic update
      of(new RuntimeEventLoadedData({
        data: {
          userPreference: action.payload.preference,
        },
        keys: [RuntimeDataEnum.userPreference],
      })),

      // API call
      this
        .userService
        .savePreference(action.payload.preference)
        .pipe(

          // Success
          switchMap(response => [

            // Notification
            new RuntimeEventNotification({
              type: NotificationTypeEnum.success,
              message: 'notification_preference_user_update',
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
            new RuntimeEventError({ id: '20', error: error }),
          ]),
        ),
    )),
  ));
}
