import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of, zip } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError, filter, map, mergeMap, switchMap, takeWhile, withLatestFrom } from 'rxjs/operators';

import { UploadApiService } from '../../api/shared/upload/upload-api.service';
import { UploadEventUpload } from './actions/upload-event-upload';
import { UploadUpsert } from '../data-upload/actions/upload-upsert';
import { UploadEventCancel } from './actions/upload-event-cancel';
import { UploadModel } from '../../shared/model/upload.model';
import { UploadStatusEnum } from '../../shared/enum/upload-status.enum';
import { UploadEventCancelAll } from './actions/upload-event-cancel-all';
import { ConfirmService } from '../../core/shared/confirm.service';
import { UploadRemoveAll } from '../data-upload/actions/upload-remove-all';
import { RuntimeEventNotification } from '../ui-runtime/actions/runtime-event-notification';
import { NotificationTypeEnum } from '../../shared/enum/notification-type.enum';
import { RuntimeEventError } from '../ui-runtime/actions/runtime-event-error';
import { UploadEventToggleStatusBar } from './actions/upload-event-toggle-status-bar';
import { UploadUpdateIsFoldedStatusBar } from './actions/upload-update-is-folded-status-bar';
import { UploadService } from '../../core/shared/upload.service';
import { UploadUpdateByUploaderId } from '../data-upload/actions/upload-update-by-uploader-id';

@Injectable()
export class Effects {

  /**
   * Constructor
   */
  constructor(
    private actions$: Actions,
    private uploadApiService: UploadApiService,
    private confirmService: ConfirmService,
    private uploadService: UploadService,
  ) {

  }

  /**
   * Perform API call to upload file and update local records
   *
   * @action UploadEventUpload
   */
  UploadEventUpload$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<UploadEventUpload>(UploadEventUpload.TYPE),
    mergeMap(action => {

      // API call
      return this
        .uploadApiService
        .upload(action.payload.upload)
        .pipe(
          withLatestFrom(
            this.uploadService.selectDataUpload(action.payload.upload.uid),
            this.uploadService.selectDataByUploaderId(),
          ),

          // Upload not cancelled
          takeWhile(([model, upload, byUploaderId]) => !upload || (upload && upload.status !== UploadStatusEnum.cancelled)),

          // Success
          switchMap(([model, upload, byUploaderId]) => {

            const actions = [];

            actions.push(

              // Update uploads
              new UploadUpsert({
                models: [model],
              }),
            );

            // Uploader not yet registered or upload UID not available in state
            if (!byUploaderId[action.payload.uid] ||
              byUploaderId[action.payload.uid].indexOf(action.payload.upload.uid) === -1) {

              actions.push(
                new UploadUpdateByUploaderId({
                  uploaderId: action.payload.uid,
                  uploadIds: [...(byUploaderId[action.payload.uid] || []), action.payload.upload.uid ],
                }),
              );
            }

            return actions;
          }),

          // Error
          catchError(apiError => {

            const model = new UploadModel();
            model.id = action.payload.upload.uid;
            model.status = UploadStatusEnum.failed;

            const actions = [];

            if (apiError && apiError.error && apiError.error.error) {

              // Notification
              actions.push(
                new RuntimeEventNotification({
                  type: NotificationTypeEnum.failure,
                  message: apiError.error.error,
                }),
              );

              // Broadcast error
              actions.push(
                new RuntimeEventError({ id: '36', error: apiError }),
              );
            }

            // Update uploads
            actions.push(
              new UploadUpsert({
                models: [model],
              }),
            );

            return actions;
          }),
        );
    }),
  ));

  /**
   * Update local record to cancel ongoing upload
   *
   * @action UploadEventCancel
   */
  UploadEventCancel$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<UploadEventCancel>(UploadEventCancel.TYPE),
    switchMap(action => zip(of(action), this.uploadService.selectDataUpload(action.payload.uid))),
    map(([action, upload]) => {

      // Do nothing when upload already completed
      if (upload.status === UploadStatusEnum.completed) {

        return;
      }

      const model = new UploadModel();
      model.id = action.payload.uid;
      model.status = UploadStatusEnum.cancelled;

      return new UploadUpsert({
        models: [model],
      });
    }),
  ));

  /**
   * Remove all local upload records
   *
   * @action UploadEventCancelAll
   */
  UploadEventCancelAllComplete$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<UploadEventCancelAll>(UploadEventCancelAll.TYPE),
    switchMap(action => zip(
      of(action),
      this.uploadService.selectDataUploadsProgressing(),
    )),
    filter(([action, uploads]) => uploads.length === 0),
    map(([action, uploads]) => new UploadRemoveAll({}))),
  );

  /**
   * Cancel all ongoing uploads
   *
   * @action UploadEventCancelAll
   */
  UploadEventCancelAllProgress$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<UploadEventCancelAll>(UploadEventCancelAll.TYPE),
    switchMap(action => zip(
      of(action),
      this.uploadService.selectDataUploadsProgressing(),
    )),
    filter(([action, uploads]) => uploads.length > 0),
    switchMap(([action, uploads]) => zip(
      of(action),
      this.uploadService.selectDataUploadsProgressing(),
      this.confirmService.message(
        uploads.length === 1 ?
        'confirm_upload_cancel_all_singular' : 'confirm_upload_cancel_all_plural',
      ),
    )),
    mergeMap(([action, uploads, isValid]) => {

      const actions = [];

      if (isValid) {

        uploads.forEach(upload => {

          actions.push(new UploadEventCancel({
            uid: upload.id,
          }));
        });
      }

      return actions;
    }),
  ));

  /**
   * Toggle status bar fold/unfold state
   *
   * @action UploadEventToggleStatusBar
   */
  UploadEventToggleStatusBar$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<UploadEventToggleStatusBar>(UploadEventToggleStatusBar.TYPE),
    switchMap(action => zip(
      of(action),
      this.uploadService.selectIsFoldedStatusBar(),
    )),
    map(([action, isFoldedStatusBar]) => new UploadUpdateIsFoldedStatusBar({
      isFoldedStatusBar: !isFoldedStatusBar,
    }))),
  );
}
