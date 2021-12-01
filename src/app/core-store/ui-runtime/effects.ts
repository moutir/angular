import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { concat, Observable, of, zip } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';

import { RuntimeEventRequireData } from './actions/runtime-event-require-data';
import { RuntimeEventError } from './actions/runtime-event-error';
import { RuntimeUpdateSettings } from '../data-runtime/actions/runtime-update-settings';
import { RuntimeEventNotification } from './actions/runtime-event-notification';
import { RuntimeUpdateNotification } from './actions/runtime-update-notification';
import { NotificationTypeEnum } from '../../shared/enum/notification-type.enum';
import { RuntimeEventToggleFeature } from './actions/runtime-event-toggle-feature';
import { RuntimeUpdatePreviewImage } from './actions/runtime-update-preview-image';
import { RuntimeUpdateContextual } from './actions/runtime-update-contextual';
import { RuntimeEventLoadedData } from './actions/runtime-event-loaded-data';
import { DataRuntimeStateInterface } from '../data-runtime/state';
import { RuntimeUpdateAuthentication } from '../data-runtime/actions/runtime-update-authentication';
import { RuntimeUpdatePermissions } from '../data-runtime/actions/runtime-update-permissions';
import { RuntimeUpdateOptions } from '../data-runtime/actions/runtime-update-options';
import { RuntimeUpdateFeature } from '../data-runtime/actions/runtime-update-feature';
import { RuntimeUpdateFeatureProperty } from '../data-runtime/actions/runtime-update-feature-property';
import { RuntimeUpdateFeatureLead } from '../data-runtime/actions/runtime-update-feature-lead';
import { RuntimeUpdateFeatureMatching } from '../data-runtime/actions/runtime-update-feature-matching';
import { RuntimeOptionsInterface } from '../../shared/interface/runtime-options.interface';
import { RuntimeEventUpdatedData } from './actions/runtime-event-updated-data';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { RuntimeUpdateLoadedTimestamp } from '../data-runtime/actions/runtime-update-loaded-timestamp';
import { RuntimeDataEnum } from '../../shared/enum/runtime-data.enum';
import { RuntimeDataProvider } from '../../runtime/shared/runtime-data-provider';
import { RuntimeUpdateFeaturePromotion } from '../data-runtime/actions/runtime-update-feature-promotion';
import { RuntimeUpdateFeatureFisher } from '../data-runtime/actions/runtime-update-feature-fisher';
import { RuntimeUpdateUserPreference } from '../data-runtime/actions/runtime-update-user-preference';
import { RuntimeUpdateAgencyPreference } from '../data-runtime/actions/runtime-update-agency-preference';
import { RuntimeUpdateFeatureTask } from '../data-runtime/actions/runtime-update-feature-task';
import { RuntimeUpdateFeaturePrice } from '../data-runtime/actions/runtime-update-feature-price';
import { RuntimeUpdateFeatureContact } from '../data-runtime/actions/runtime-update-feature-contact';
import { RuntimeUpdateFeatureReporting } from '../data-runtime/actions/runtime-update-feature-reporting';
import { RuntimeUpdateFeatureReport } from '../data-runtime/actions/runtime-update-feature-report';
import { RuntimeUpdateContactTypeByGroup } from '../data-runtime/actions/runtime-update-contact-type-by-group';
import { RuntimeUpdateFeatureBrochure } from '../data-runtime/actions/runtime-update-feature-brochure';
import { RuntimeUpdateFeatureRestriction } from '../data-runtime/actions/runtime-update-feature-restriction';
import { RuntimeEventResetData } from './actions/runtime-event-reset-data';
import { RuntimeUpdateFeatureAccount } from '../data-runtime/actions/runtime-update-feature-account';
import { RuntimeUpdateFeaturePortal } from '../data-runtime/actions/runtime-update-feature-portal';
import { UserEventSavePreference } from '../ui-user/actions/user-event-save-preference';
import { RuntimeEventToggleBeta } from './actions/runtime-event-toggle-beta';

@Injectable()
export class Effects {

  /**
   * Constructor
   */
  constructor(
    private actions$: Actions,
    private runtimeDataProviderStrategy: RuntimeDataProvider,
    private runtimeService: RuntimeService,
  ) {

  }

  /**
   * Store runtime settings in session storage upon update
   *
   * @action RuntimeEventUpdatedData
   */
  RuntimeEventUpdatedData$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<RuntimeEventUpdatedData>(RuntimeEventUpdatedData.TYPE),
    switchMap(action => zip(
      of(action),
      this.runtimeService.selectDataState(),
    )),
    switchMap(([action, state]) => {

      this.runtimeService.toStorage(state);

      return [];
    }),
  ));

  /**
   * Loaded data then updates store records
   *
   * @action RuntimeEventLoadedData
   */
  RuntimeEventLoadedData$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<RuntimeEventLoadedData>(RuntimeEventLoadedData.TYPE),
    mergeMap(action => zip(
      of(action),
      this.runtimeService.selectDataOptions(),
      this.runtimeService.selectDataLoadedTimestamp(),
    )),
    mergeMap(([action, options, loadedTimestamp]) => {

      const actions = [];

      // Keys (keys)
      if (action.payload.keys.length > 0) {

        const timestamp = Math.floor(Date.now() / 1000);
        const newLoadedTimestamp = {
          ...loadedTimestamp,
        };

        action.payload.keys.forEach(key => newLoadedTimestamp[key] = timestamp);

        actions.push(
          new RuntimeUpdateLoadedTimestamp({
            loadedTimestamp: newLoadedTimestamp,
          }),
        );
      }

      // Loaded timestamp
      if (action.payload.data.loadedTimestamp) {

        actions.push(
          new RuntimeUpdateLoadedTimestamp({
            loadedTimestamp: action.payload.data.loadedTimestamp,
          }),
        );
      }

      // Settings
      if (action.payload.data.settings) {

        actions.push(
          new RuntimeUpdateSettings({
            settings: action.payload.data.settings,
          }),
        );
      }

      // Preference user
      if (action.payload.data.userPreference) {

        actions.push(
          new RuntimeUpdateUserPreference({
            userPreference: action.payload.data.userPreference,
          }),
        );
      }

      // Preference agency
      if (action.payload.data.agencyPreference) {

        actions.push(
          new RuntimeUpdateAgencyPreference({
            agencyPreference: action.payload.data.agencyPreference,
          }),
        );
      }

      // Authentication
      if (action.payload.data.authentication) {

        actions.push(
          new RuntimeUpdateAuthentication({
            authentication: action.payload.data.authentication,
          }),
        );
      }

      // Permissions
      if (action.payload.data.permissions) {

        actions.push(
          new RuntimeUpdatePermissions({
            permissions: action.payload.data.permissions,
          }),
        );
      }

      // Contact type by group
      if (action.payload.data.contactTypeByGroup) {

        actions.push(
          new RuntimeUpdateContactTypeByGroup({
            contactTypeByGroup: action.payload.data.contactTypeByGroup,
          }),
        );
      }

      // Options
      if (action.payload.data.options) {

        // IMPORTANT: Some options could be null (we are using a Partial<DataRuntimeStateInterface> remember ?)
        const newOptions = <RuntimeOptionsInterface>{};

        Object
          .keys(action.payload.data.options)
          .forEach(key => newOptions[key] = action.payload.data.options[key] || options[key]);

        actions.push(
          new RuntimeUpdateOptions({
            options: newOptions,
          }),
        );
      }

      // Feature
      if (action.payload.data.feature) {

        actions.push(
          new RuntimeUpdateFeature({
            feature: action.payload.data.feature,
          }),
        );
      }

      // Account feature
      if (action.payload.data.featureAccount) {

        actions.push(
          new RuntimeUpdateFeatureAccount({
            featureAccount: action.payload.data.featureAccount,
          }),
        );
      }

      // Price feature
      if (action.payload.data.featurePrice) {

        actions.push(
          new RuntimeUpdateFeaturePrice({
            featurePrice: action.payload.data.featurePrice,
          }),
        );
      }

      // Property feature
      if (action.payload.data.featureProperty) {

        actions.push(
          new RuntimeUpdateFeatureProperty({
            featureProperty: action.payload.data.featureProperty,
          }),
        );
      }

      // Lead feature
      if (action.payload.data.featureLead) {

        actions.push(
          new RuntimeUpdateFeatureLead({
            featureLead: action.payload.data.featureLead,
          }),
        );
      }

      // Matching feature
      if (action.payload.data.featureMatching) {

        actions.push(
          new RuntimeUpdateFeatureMatching({
            featureMatching: action.payload.data.featureMatching,
          }),
        );
      }

      // Reporting feature
      if (action.payload.data.featureReporting) {

        actions.push(
          new RuntimeUpdateFeatureReporting({
            featureReporting: action.payload.data.featureReporting,
          }),
        );
      }

      // Promotion feature
      if (action.payload.data.featurePromotion) {

        actions.push(
          new RuntimeUpdateFeaturePromotion({
            featurePromotion: action.payload.data.featurePromotion,
          }),
        );
      }

      // Fisher feature
      if (action.payload.data.featureFisher) {

        actions.push(
          new RuntimeUpdateFeatureFisher({
            featureFisher: action.payload.data.featureFisher,
          }),
        );
      }

      // Task feature
      if (action.payload.data.featureTask) {

        actions.push(
          new RuntimeUpdateFeatureTask({
            featureTask: action.payload.data.featureTask,
          }),
        );
      }

      // Contact feature
      if (action.payload.data.featureContact) {

        actions.push(
          new RuntimeUpdateFeatureContact({
            featureContact: action.payload.data.featureContact,
          }),
        );
      }

      // Report feature
      if (action.payload.data.featureReport) {

        actions.push(
          new RuntimeUpdateFeatureReport({
            featureReport: action.payload.data.featureReport,
          }),
        );
      }

      // Brochure feature
      if (action.payload.data.featureBrochure) {

        actions.push(
          new RuntimeUpdateFeatureBrochure({
            featureBrochure: action.payload.data.featureBrochure,
          }),
        );
      }

      // Restriction feature
      if (action.payload.data.featureRestriction) {

        actions.push(
          new RuntimeUpdateFeatureRestriction({
            featureRestriction: action.payload.data.featureRestriction,
          }),
        );
      }

      // Portal feature
      if (action.payload.data.featurePortal) {

        actions.push(
          new RuntimeUpdateFeaturePortal({
            featurePortal: action.payload.data.featurePortal,
          }),
        );
      }

      // Has at least one action and updated keys
      if (actions.length > 0 && action.payload.keys.length > 0) {

        actions.push(

          // Updated data
          new RuntimeEventUpdatedData({
            data: <Partial<DataRuntimeStateInterface>>action.payload.data,
          }),
        );
      }

      return actions;
    }),
  ));

  /**
   * Perform API call to fetch required keys then update local records
   *
   * @action RuntimeEventRequireData
   */
  RuntimeEventRequireData$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<RuntimeEventRequireData>(RuntimeEventRequireData.TYPE),
    mergeMap(action => zip(
      of(action),
      this.runtimeService.selectDataLoadedTimestamp(),
    )),
    mergeMap(([action, loadedTimestamp]) => {

      const timestamp = Math.floor(Date.now() / 1000);
      const keys = action.payload.keys
        .filter(key =>
          loadedTimestamp.hasOwnProperty(key) === false ||
          timestamp - loadedTimestamp[key] >= this.runtimeService.getRequireDataDelay(key),
        );

      return keys.length === 0 ? [] : concat(

        this
          .runtimeDataProviderStrategy
          .provide(keys)
          .pipe(

            // Success
            mergeMap(data => [

              // Loaded data
              new RuntimeEventLoadedData({
                data: <Partial<DataRuntimeStateInterface>>{
                  ...data,
                },
                keys: keys,
              }),
            ]),

            // Error
            catchError(error => [

              // Notification
              new RuntimeEventNotification({
                type: NotificationTypeEnum.failure,
                message: 'notification_runtime_settings_failure',
              }),

              // Broadcast error
              new RuntimeEventError({ id: '13', error: error }),
            ]),
          ),
      );
    }),
  ));

  /**
   * Remove keys from the loaded timestamp
   *
   * @action RuntimeEventResetData
   */
  RuntimeEventResetData$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<RuntimeEventResetData>(RuntimeEventResetData.TYPE),
    switchMap(action => zip(
      of(action),
      this.runtimeService.selectDataState(),
      this.runtimeService.selectDataLoadedTimestamp(),
    )),
    switchMap(([action, state, loadedTimestamp]) => {

      const newLoadedTimestamp = {
        ...loadedTimestamp,
      };

      // Remove keys
      action.payload.keys.forEach(key => {

        // Options
        if (key === RuntimeDataEnum.options) {

          // Remove all option keys
          Object.keys(newLoadedTimestamp).forEach(k => k.match(/^option_/) && delete newLoadedTimestamp[k]);

          return;
        }

        delete newLoadedTimestamp[key];
      });

      return [

        // Update loaded timestamp
        new RuntimeUpdateLoadedTimestamp({
          loadedTimestamp: newLoadedTimestamp,
        }),

        // Updated data
        new RuntimeEventUpdatedData({
          data: <Partial<DataRuntimeStateInterface>>{ loadedTimestamp: newLoadedTimestamp },
        }),
      ];
    }),
  ));

  /**
   * Update notification on runtime notification
   *
   * @action RuntimeEventNotification
   */
  RuntimeEventNotification$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<RuntimeEventNotification>(RuntimeEventNotification.TYPE),
    map(action => new RuntimeUpdateNotification({
      notification: {
        timestamp: Date.now(),
        type: action.payload.type,
        message: action.payload.message,
      },
    })),
  ));

  /**
   * Update settings on runtime toggle feature
   *
   * @action RuntimeEventToggleFeature
   */
  RuntimeEventToggleFeature$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<RuntimeEventToggleFeature>(RuntimeEventToggleFeature.TYPE),
    switchMap(action => zip(
      of(action),
      this.runtimeService.selectFeature(),
    )),
    switchMap(([action, feature]) => {

      const newFeature = {
        ...feature,
      };
      newFeature[action.payload.name] = !feature[action.payload.name];

      return [

        // Loaded runtime data
        new RuntimeEventLoadedData({
          data: {
            feature: newFeature,
          },
          keys: [RuntimeDataEnum.feature],
        }),

        // Notification
        new RuntimeUpdateNotification({
          notification: {
            timestamp: Date.now(),
            type: newFeature[action.payload.name] ? NotificationTypeEnum.success : NotificationTypeEnum.failure,
            message: newFeature[action.payload.name] ? 'notification_feature_enabled' : 'notification_feature_disabled',
          },
        }),
      ];
    }),
  ));

  /**
   * Display preview image contextual
   *
   * @action RuntimeUpdatePreviewImage
   */
  RuntimeUpdatePreviewImage$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<RuntimeUpdatePreviewImage>(RuntimeUpdatePreviewImage.TYPE),
    map((action) => new RuntimeUpdateContextual({
      contextual: {
        uid: 'preview-image',
        position: action.payload.previewImage.position,
      },
    })),
  ));

  /**
   * Toggle user preference 'beta' for a specific UID
   *
   * @action RuntimeEventToggleBeta
   */
  RuntimeEventToggleBeta$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<RuntimeEventToggleBeta>(RuntimeEventToggleBeta.TYPE),
    switchMap(action => zip(
      of(action),
      this.runtimeService.selectUserPreference(),
    )),
    switchMap(([action, userPreference]) => {

      const newUserPreference = {
        ...userPreference,
        beta: {
          ...userPreference.beta,
        },
      };

      newUserPreference.beta[action.payload.uid] = !userPreference.beta[action.payload.uid];

      return [

        // Save user preference
        new UserEventSavePreference({
          preference: newUserPreference,
        }),
      ];
    }),
  ));
}
