import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { concat, Observable, of, zip } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';

import { FisherEventStep } from './actions/fisher-event-step';
import { FisherUpdateForm } from './actions/fisher-update-form';
import { initialState } from './state';
import { FisherUpdateFisher } from '../data-fisher/actions/fisher-update-fisher';
import { RuntimeEventError } from '../../../core-store/ui-runtime/actions/runtime-event-error';
import { FisherEventStartOver } from './actions/fisher-event-start-over';
import { RuntimeEventNotification } from '../../../core-store/ui-runtime/actions/runtime-event-notification';
import { NotificationTypeEnum } from '../../../shared/enum/notification-type.enum';
import { FisherEventChangeInput } from './actions/fisher-event-change-input';
import { FisherApiService } from '../../shared/fisher-api.service';
import { BrowserService } from '../../../core/shared/browser/browser.service';
import { FisherService } from '../../shared/fisher.service';

@Injectable()
export class Effects {

  /**
   * Constructor
   */
  constructor(
    private actions$: Actions,
    private priceHubbleFisherApiService: FisherApiService,
    private browserService: BrowserService,
    private fisherService: FisherService,
  ) {

  }

  /**
   * Updates form state when form input has been updated
   *
   * @action FisherEventChangeInput
   */
  FisherEventChangeInput$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<FisherEventChangeInput>(FisherEventChangeInput.TYPE),
    switchMap(action => zip(
      of(action),
      this.fisherService.selectForm(),
    )),
    map(([action, form]) => {

      const newForm = {
        ...form,
      };

      newForm[action.payload.input.group] = { ...form[action.payload.input.group] };

      // Replace empty string by null (no selection)
      newForm[action.payload.input.group][action.payload.input.name] = action.payload.input.value === '' ?
        null : action.payload.input.value;

      return new FisherUpdateForm({
        form: newForm,
      });
    }),
  ));

  /**
   * Reset form state
   *
   * @action FisherEventStep
   */
  FisherEventStep0$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<FisherEventStep>(FisherEventStep.TYPE),
    filter(action => action.payload.form.step === 0),
    switchMap(action => zip(of(action), of(initialState))),
    switchMap(([action, state]) => [

      // Reset form
      new FisherUpdateForm({
        form: state.form,
      }),

      // Reset fisher model
      new FisherUpdateFisher({
        fisher: null,
      }),
    ]),
  ));

  /**
   * Update form state
   *
   * @action FisherEventStep
   */
  FisherEventStep1to5$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<FisherEventStep>(FisherEventStep.TYPE),
    filter(action => action.payload.form.step >= 1 && action.payload.form.step <= 5),
    switchMap(action => [

      // Update form state
      new FisherUpdateForm({
        form: action.payload.form,
      }),
    ]),
  ));

  /**
   * Perform API call to get the valuation
   *
   * @action FisherEventStep
   */
  FisherEventStep6$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<FisherEventStep>(FisherEventStep.TYPE),
    filter(action => action.payload.form.step === 6),
    switchMap(action => concat(

      // Update form state
      of(
        new FisherUpdateForm({
          form: action.payload.form,
        }),
      ),

      //  API call
      this
        .priceHubbleFisherApiService
        .valuation(action.payload.form)
        .pipe(

          // Success
          switchMap(model => {

            if (!model) {

              // Broadcast event
              this.browserService.triggerEvent('realforce.fisher.failure');

              return [

                // Revert form state
                new FisherUpdateForm({
                  form: {
                    ...action.payload.form,
                    step: 5,
                  },
                }),

                // Notification
                new RuntimeEventNotification({
                  type: NotificationTypeEnum.failure,
                  message: 'notification_rollback',
                }),
              ];
            }

            // Broadcast event
            this.browserService.triggerEvent('realforce.fisher.success');

            return [

              // Update fisher model
              new FisherUpdateFisher({
                fisher: model,
              }),
            ];
          }),

          // Error
          catchError(error => {

            // Broadcast event
            this.browserService.triggerEvent('realforce.fisher.failure');

            return [

              // Revert form state
              new FisherUpdateForm({
                form: {
                  ...action.payload.form,
                  step: 5,
                },
              }),

              // Notification
              new RuntimeEventNotification({
                type: NotificationTypeEnum.failure,
                message: (error && error.message) || 'notification_rollback',
              }),

              // Broadcast error
              new RuntimeEventError({ id: '19', error: error }),
            ];
          }),
        ),
      ),
    ),
  ));

  /**
   * Start over fisher form
   *
   * @action FisherEventStep
   */
  FisherEventStep7$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<FisherEventStep>(FisherEventStep.TYPE),
    filter(action => action.payload.form.step === 7),
    map(action => new FisherEventStartOver({})),
  ));

  /**
   * Start over fisher form with contact prefilled
   *
   * @action FisherEventStartOver
   */
  FisherEventStartOver$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<FisherEventStartOver>(FisherEventStartOver.TYPE),
    switchMap(action => zip(of(action), of(initialState), this.fisherService.selectForm())),
    switchMap(([action, initState, form]) => {

      const newForm = {
        ...initState.form,
        step: 1,
        contactInfo: {
          firstName: form.contactInfo.firstName,
          lastName: form.contactInfo.lastName,
          email: form.contactInfo.email,
          mobile: form.contactInfo.mobile,
          address1: form.contactInfo.address1,
          address2: form.contactInfo.address2,
          zip: form.contactInfo.zip,
          city: form.contactInfo.city,
          country: form.contactInfo.country,
          motivation: form.contactInfo.motivation,
          recaptcha: form.contactInfo.recaptcha,
          language: form.contactInfo.language,
        },
      };

      return [

        // Update form
        new FisherUpdateForm({
          form: newForm,
        }),

        // Reset fisher model
        new FisherUpdateFisher({
          fisher: null,
        }),
      ];
  })));
}
