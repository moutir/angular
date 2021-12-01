import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { concat, Observable, of, zip } from 'rxjs';
import { catchError, filter, switchMap } from 'rxjs/operators';

import { RuntimeEventError } from '../../ui-runtime/actions/runtime-event-error';
import { RuntimeEventNotification } from '../../ui-runtime/actions/runtime-event-notification';
import { NotificationTypeEnum } from '../../../shared/enum/notification-type.enum';
import { AgencyProfileEventSetImage } from '../actions/agency-profile-event-set-image';
import { AgencyProfileApiService } from '../../../api/shared/agency-profile/agency-profile-api.service';
import { AgencyProfileEventChangedImage } from '../actions/agency-profile-event-changed-image';
import { DocumentModel } from '../../../shared/model/document.model';
import { ConfirmService } from '../../../core/shared/confirm.service';
import { AgencyProfilePageService } from '../../../core/shared/agency-profile/agency-profile-page.service';
import { AgencyProfileService } from '../../../core/shared/agency-profile/agency-profile.service';
import { AgencyProfileUpdateEmailPreview } from '../actions/agency-profile-update-email-preview';
import { AgencyProfileEventEmailPreview } from '../actions/agency-profile-event-email-preview';

@Injectable()
export class AgencyProfileEffects {

  /**
   * Constructor
   */
  constructor(
    private actions$: Actions,
    private agencyProfileApiService: AgencyProfileApiService,
    private confirmService: ConfirmService,
    private pageService: AgencyProfilePageService,
    private agencyProfileService: AgencyProfileService,
  ) {

  }

  /**
   * Perform API call to set/reset the agency logo
   *
   * @action AgencyProfileEventSetImage
   */
  AgencyProfileEventSetLogo$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<AgencyProfileEventSetImage>(AgencyProfileEventSetImage.TYPE),
    filter(action => (action.payload.uid === 'logo-set' || action.payload.uid === 'logo-remove')),
    switchMap(action => zip(
      of(action),
      action.payload.uid === 'logo-remove' ?
        this.confirmService.message('confirm_logo_remove') : of(true),
    )),
    switchMap(([action, isValid]) => {

      if (isValid === false) {

        return [];
      }

      return this.agencyProfileApiService
        .setLogo(action.payload.imageDocument)
        .pipe(

          // Success
          switchMap(response => {

            if (!response || response.success === false) {

              return [

                // Notification
                new RuntimeEventNotification({
                  type: NotificationTypeEnum.failure,
                  message: action.payload.uid === 'logo-remove' ?
                    'notification_rollback' : 'notification_logo_set_fail',
                }),
              ];
            }

            return [

              // Logo image changed
              new AgencyProfileEventChangedImage({
                uid: 'logo',
                imageDocument: response.status === 1 ? action.payload.imageDocument : new DocumentModel(),
              }),

              // Notification
              new RuntimeEventNotification({
                type: NotificationTypeEnum.success,
                message: action.payload.uid === 'logo-remove' ?
                  'notification_logo_remove_success' : 'notification_logo_set_success',
              }),
            ];
          }),

          // Error
          catchError(error => [

            // Notification
            new RuntimeEventNotification({
              type: NotificationTypeEnum.failure,
              message: action.payload.uid === 'logo-remove' ?
                'notification_rollback' : 'notification_logo_set_fail',
            }),

            // Broadcast error
            new RuntimeEventError({ id: '64', error: error }),
          ]),
      );
    }),
  ));

  /**
   * Perform API call to set/reset the agency watermark
   *
   * @action AgencyProfileEventSetImage
   */
  AgencyProfileEventSetWatermark$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<AgencyProfileEventSetImage>(AgencyProfileEventSetImage.TYPE),
    filter(action => (action.payload.uid === 'watermark-set' || action.payload.uid === 'watermark-remove')),
    switchMap(action => zip(
      of(action),
      action.payload.uid === 'watermark-remove' ?
        this.confirmService.message('confirm_watermark_remove') : of(true),
    )),
    switchMap(([action, isValid]) => {

      if (isValid === false) {

        return [];
      }

      return this.agencyProfileApiService
        .setWatermark(action.payload.imageDocument)
        .pipe(

          // Success
          switchMap(response => {

            if (!response || response.success === false) {

              return [

                // Notification
                new RuntimeEventNotification({
                  type: NotificationTypeEnum.failure,
                  message: action.payload.uid === 'watermark-remove' ?
                    'notification_rollback' : 'notification_watermark_set_fail',
                }),
              ];
            }

            return [

              // Watermark image changed
              new AgencyProfileEventChangedImage({
                uid: 'watermark',
                imageDocument: response.status === 1 ? action.payload.imageDocument : new DocumentModel(),
              }),

              // Notification
              new RuntimeEventNotification({
                type: NotificationTypeEnum.success,
                message: action.payload.uid === 'watermark-remove' ?
                  'notification_watermark_remove_success' : 'notification_watermark_set_success',
              }),
            ];
          }),

          // Error
          catchError(error => [

            // Notification
            new RuntimeEventNotification({
              type: NotificationTypeEnum.failure,
              message: action.payload.uid === 'watermark-remove' ?
                'notification_rollback' : 'notification_watermark_set_fail',
            }),

            // Broadcast error
            new RuntimeEventError({ id: '65', error: error }),
          ]),
      );
    }),
  ));

  /**
   * Perform API call to set/reset the default property image
   *
   * @action AgencyProfileEventSetImage
   */
  AgencyProfileEventSetDefaultPropertyImage$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<AgencyProfileEventSetImage>(AgencyProfileEventSetImage.TYPE),
    filter(action => (action.payload.uid === 'default-property-image-set' ||
      action.payload.uid === 'default-property-image-remove')),
    switchMap(action => zip(
      of(action),
      action.payload.uid === 'default-property-image-remove' ?
        this.confirmService.message('confirm_default_property_image_remove') : of(true),
    )),
    switchMap(([action, isValid]) => {

      if (isValid === false) {

        return [];
      }

      return this.agencyProfileApiService
        .setDefaultPropertyImage(action.payload.imageDocument)
        .pipe(

          // Success
          switchMap(response => {

            if (!response || response.success === false) {

              return [

                // Notification
                new RuntimeEventNotification({
                  type: NotificationTypeEnum.failure,
                  message: action.payload.uid === 'default-property-image-remove' ?
                    'notification_rollback' : 'notification_default_property_image_set_fail',
                }),
              ];
            }

            return [

              // Default property image changed
              new AgencyProfileEventChangedImage({
                uid: 'default-property-image',
                imageDocument: response.status === 1 ? action.payload.imageDocument : new DocumentModel(),
              }),

              // Notification
              new RuntimeEventNotification({
                type: NotificationTypeEnum.success,
                message: action.payload.uid === 'default-property-image-remove' ?
                  'notification_default_property_image_remove_success' : 'notification_default_property_image_set_success',
              }),
            ];
          }),

          // Error
          catchError(error => [

            // Notification
            new RuntimeEventNotification({
              type: NotificationTypeEnum.failure,
              message: action.payload.uid === 'default-property-image-remove' ?
                'notification_rollback' : 'notification_default_property_image_set_fail',
            }),

            // Broadcast error
            new RuntimeEventError({ id: '66', error: error }),
          ]),
      );
    }),
  ));

  /**
   * Perform API call to set/reset the prestige brochure cover
   *
   * @action AgencyProfileEventSetImage
   */
  AgencyProfileEventSetPrestigeBrochureCover$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<AgencyProfileEventSetImage>(AgencyProfileEventSetImage.TYPE),
    filter(action => (action.payload.uid === 'prestige-brochure-cover-set' ||
      action.payload.uid === 'prestige-brochure-cover-remove')),
    switchMap(action => zip(
      of(action),
      action.payload.uid === 'prestige-brochure-cover-remove' ?
        this.confirmService.message('confirm_prestige_brochure_cover_remove') : of(true),
    )),
    switchMap(([action, isValid]) => {

      if (isValid === false) {

        return [];
      }

      return this.agencyProfileApiService
        .setPrestigeBrochureCover(action.payload.imageDocument)
        .pipe(

          // Success
          switchMap(response => {

            if (!response || response.success === false) {

              return [

                // Notification
                new RuntimeEventNotification({
                  type: NotificationTypeEnum.failure,
                  message: action.payload.uid === 'prestige-brochure-cover-remove' ?
                    'notification_rollback' : 'notification_prestige_brochure_cover_set_fail',
                }),
              ];
            }

            return [

              // Prestige brochure cover changed
              new AgencyProfileEventChangedImage({
                uid: 'prestige-brochure-cover',
                imageDocument: response.status === 1 ? action.payload.imageDocument : new DocumentModel(),
              }),

              // Notification
              new RuntimeEventNotification({
                type: NotificationTypeEnum.success,
                message: action.payload.uid === 'prestige-brochure-cover-remove' ?
                  'notification_prestige_brochure_cover_remove_success' : 'notification_prestige_brochure_cover_set_success',
              }),
            ];
          }),

          // Error
          catchError(error => [

            // Notification
            new RuntimeEventNotification({
              type: NotificationTypeEnum.failure,
              message: action.payload.uid === 'prestige-brochure-cover-remove' ?
                'notification_rollback' : 'notification_prestige_brochure_cover_set_fail',
            }),

            // Broadcast error
            new RuntimeEventError({ id: '67', error: error }),
          ]),
      );
    }),
  ));

  /**
   * Perform API call to set/reset the email banner
   *
   * @action AgencyProfileEventSetImage
   */
  AgencyProfileEventSetEmailBanner$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<AgencyProfileEventSetImage>(AgencyProfileEventSetImage.TYPE),
    filter(action => (action.payload.uid === 'email-banner-set' ||
      action.payload.uid === 'email-banner-remove')),
    switchMap(action => zip(
      of(action),
      action.payload.uid === 'email-banner-remove' ?
        this.confirmService.message('confirm_email_banner_remove') : of(true),
    )),
    switchMap(([action, isValid]) => {

      if (isValid === false) {

        return [];
      }

      return this.agencyProfileApiService
        .setEmailBanner(action.payload.imageDocument)
        .pipe(

          // Success
          switchMap(response => {

            if (!response || response.success === false) {

              return [

                // Notification
                new RuntimeEventNotification({
                  type: NotificationTypeEnum.failure,
                  message: action.payload.uid === 'email-banner-remove' ?
                    'notification_rollback' : 'notification_email_banner_set_fail',
                }),
              ];
            }

            return [

              // Email banner changed
              new AgencyProfileEventChangedImage({
                uid: 'email-banner',
                imageDocument: response.status === 1 ? action.payload.imageDocument : new DocumentModel(),
              }),

              // Notification
              new RuntimeEventNotification({
                type: NotificationTypeEnum.success,
                message: action.payload.uid === 'email-banner-remove' ?
                  'notification_email_banner_remove_success' : 'notification_email_banner_set_success',
              }),
            ];
          }),

          // Error
          catchError(error => [

            // Notification
            new RuntimeEventNotification({
              type: NotificationTypeEnum.failure,
              message: action.payload.uid === 'email-banner-remove' ?
                'notification_rollback' : 'notification_email_banner_set_fail',
            }),

            // Broadcast error
            new RuntimeEventError({ id: '68', error: error }),
          ]),
      );
    }),
  ));

  /**
   * Perform API call to load email preview
   *
   * @action AgencyProfileEventEmailPreview
   */
  AgencyProfileEventEmailPreview$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<AgencyProfileEventEmailPreview>(AgencyProfileEventEmailPreview.TYPE),
    switchMap(action => zip(
      of(action),
      this.pageService.selectModel(),
    )),
    switchMap(([action, model]) => {

      return concat(

        // Update email preview
        of(
          new AgencyProfileUpdateEmailPreview({
            emailPreview: {
              isOpen: true,
              data: {
                template: '',
                data: null,
              },
            },
          }),
        ),

        this
          .agencyProfileService
          .loadEmailPreview(model)
          .pipe(

            // Success
            switchMap(previewData => {

              return [

                // Update email preview
                new AgencyProfileUpdateEmailPreview({
                  emailPreview: {
                    isOpen: true,
                    data: previewData,
                  },
                }),
              ];
            }),

            // Error
            catchError(apiError => [

              // // Notification
              new RuntimeEventNotification({
                type: NotificationTypeEnum.failure,
                message: 'notification_rollback',
              }),

              // Broadcast error
              new RuntimeEventError({ id: '69', error: apiError }),
            ]),
          ),
        );
    }),
  ));
}
