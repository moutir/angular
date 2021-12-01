import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { concat, Observable, of, zip } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { RuntimeEventNotification } from '../../ui-runtime/actions/runtime-event-notification';
import { NotificationTypeEnum } from '../../../shared/enum/notification-type.enum';
import { RuntimeEventError } from '../../ui-runtime/actions/runtime-event-error';
import { ReportingApiService } from '../../../api/shared/reporting/reporting-api.service';
import { ReportingEventDownload } from '../actions/reporting-event-download';
import { ReportingEventAccept } from '../actions/reporting-event-accept';
import { ReportingUpsert } from '../../data-reporting/actions/reporting-upsert';
import { ReportingEventReject } from '../actions/reporting-event-reject';
import { BrowserService } from '../../../core/shared/browser/browser.service';
import { ConfirmService } from '../../../core/shared/confirm.service';

@Injectable()
export class ReportingEffects {

  /**
   * Constructor
   */
  constructor(
    private actions$: Actions,
    private reportingApiService: ReportingApiService,
    private browserService: BrowserService,
    private confirmService: ConfirmService,
  ) {

  }

  /**
   * Redirect to download report URL
   *
   * @action ReportEventDownload
   */
  ReportEventDownload$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<ReportingEventDownload>(ReportingEventDownload.TYPE),
    switchMap(action => {

      this.browserService.blank(action.payload.url);

      return [];
    }),
  ));

  /**
   * Perform API call to accept reports
   *
   * @action ReportEventAccept
   */
  ReportEventAccept$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<ReportingEventAccept>(ReportingEventAccept.TYPE),
    switchMap(action => zip(
      of(action),
      this.confirmService.message(
        action.payload.reportIds.length > 1 ? 'confirm_report_accept_plural' : 'confirm_report_accept_singular',
      ),
    )),
    switchMap(([action, isValid]) => {

      if (isValid === false) {

        return [];
      }

      return concat(

        // API call
        this
          .reportingApiService
          .accept(action.payload.reportIds)
          .pipe(

            // Success
            switchMap(reports => {

              // Has error
              if (reports.length === 0) {

                return [

                  // Notification
                  new RuntimeEventNotification({
                    type: NotificationTypeEnum.failure,
                    message: 'notification_rollback',
                  }),
                ];
              }

              return [

                // Notification
                new RuntimeEventNotification({
                  type: NotificationTypeEnum.success,
                  message: reports.length > 1 ?
                    'notification_report_update_status_accept_plural' : 'notification_report_update_status_accept_singular',
                }),

                // Upsert data model
                new ReportingUpsert({
                  models: reports,
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
              new RuntimeEventError({ id: '16', error: error }),
            ]),
          ),
      );
    }),
  ));

  /**
   * Perform API call to reject reports
   *
   * @action ReportEventReject
   */
  ReportEventReject$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<ReportingEventReject>(ReportingEventReject.TYPE),
    switchMap(action => zip(
      of(action),
      this.confirmService.message(
        action.payload.reportIds.length > 1 ? 'confirm_report_reject_plural' : 'confirm_report_reject_singular',
      ),
    )),
    switchMap(([action, isValid]) => {

      if (isValid === false) {

        return [];
      }

      return concat(

        // API call
        this
          .reportingApiService
          .reject(action.payload.reportIds)
          .pipe(

            // Success
            switchMap(reports => {

              // Has error
              if (reports.length === 0) {

                return [

                  // Notification
                  new RuntimeEventNotification({
                    type: NotificationTypeEnum.failure,
                    message: 'notification_rollback',
                  }),
                ];
              }

              return [

                // Notification
                new RuntimeEventNotification({
                  type: NotificationTypeEnum.success,
                  message: reports.length > 1 ?
                    'notification_report_update_status_reject_plural' : 'notification_report_update_status_reject_singular',
                }),

                // Upsert data model
                new ReportingUpsert({
                  models: reports,
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
              new RuntimeEventError({ id: '17', error: error }),
            ]),
          ),
      );
    }),
  ));
}
