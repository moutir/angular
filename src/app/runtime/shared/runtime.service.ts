import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MemoizedSelector, Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { filter } from 'rxjs/internal/operators/filter';

import { RuntimeSettingsInterface } from '../../shared/interface/runtime-settings.interface';
import {
  selectDataAgenciesIncludingMls,
  selectDataAgencyPreference,
  selectDataAuthentication,
  selectDataContactTypeByGroup,
  selectDataFeature,
  selectDataFeatureAccount,
  selectDataFeatureBrochure,
  selectDataFeatureFisher,
  selectDataFeatureLead,
  selectDataFeatureMatching,
  selectDataFeaturePortal,
  selectDataFeaturePrice,
  selectDataFeaturePromotion,
  selectDataFeatureProperty,
  selectDataFeatureTask,
  selectDataLanguageAvailable,
  selectDataLanguageAvailableIds,
  selectDataLanguageAvailableLabels,
  selectDataLanguageCurrent,
  selectDataLanguageCurrentLabel,
  selectDataLoadedTimestamp,
  selectDataOptions,
  selectDataPermissions,
  selectDataSettings,
  selectDataState,
  selectDataUserPreference,
} from '../../core-store/data-runtime/selectors';
import { StateInterface } from '../../core-store/state.interface';
import { RuntimeEventRequireData } from '../../core-store/ui-runtime/actions/runtime-event-require-data';
import {
  selectUiContextual,
  selectUiIsLoadedData,
  selectUiNotification,
  selectUiPreviewImage,
} from '../../core-store/ui-runtime/selectors';
import { ContextualInterface } from '../../shared/interface/contextual.interface';
import { RuntimeUpdateContextual } from '../../core-store/ui-runtime/actions/runtime-update-contextual';
import { RuntimeFeatureInterface } from '../../shared/interface/runtime-feature.interface';
import { RuntimeEventToggleFeature } from '../../core-store/ui-runtime/actions/runtime-event-toggle-feature';
import { PositionInterface } from '../../shared/interface/position.interface';
import { RuntimeUpdatePreviewImage } from '../../core-store/ui-runtime/actions/runtime-update-preview-image';
import { PreviewImageInterface } from '../../shared/interface/preview-image.interface';
import { RuntimeDataEnum } from '../../shared/enum/runtime-data.enum';
import { DataRuntimeStateInterface } from '../../core-store/data-runtime/state';
import { RuntimeEventLoadedData } from '../../core-store/ui-runtime/actions/runtime-event-loaded-data';
import { RuntimeAuthenticationInterface } from '../../shared/interface/runtime-authentication.interface';
import { PermissionEnum } from '../../shared/enum/permission.enum';
import { RuntimeOptionsInterface } from '../../shared/interface/runtime-options.interface';
import { RuntimeFeaturePropertyInterface } from '../../shared/interface/runtime-feature-property.interface';
import { RuntimeFeatureLeadInterface } from '../../shared/interface/runtime-feature-lead.interface';
import { RuntimeFeatureMatchingInterface } from '../../shared/interface/runtime-feature-matching.interface';
import { SessionStorageService } from '../../core/shared/storage/session-storage.service';
import { SessionStorageEnum } from '../../shared/enum/session-storage.enum';
import { DurationSecondsEnum } from '../../shared/enum/duration-seconds.enum';
import { RuntimeFeaturePromotionInterface } from '../../shared/interface/runtime-feature-promotion.interface';
import { RuntimeFeatureFisherInterface } from '../../shared/interface/runtime-feature-fisher.interface';
import { RuntimeUserPreferenceInterface } from '../../shared/interface/runtime-user-preference.interface';
import { RuntimeAgencyPreferenceInterface } from '../../shared/interface/runtime-agency-preference.interface';
import { RuntimeFeaturePriceInterface } from '../../shared/interface/runtime-feature-price.interface';
import { NotificationInterface } from '../../shared/interface/notification.interface';
import { NotificationTypeEnum } from '../../shared/enum/notification-type.enum';
import { RuntimeEventNotification } from '../../core-store/ui-runtime/actions/runtime-event-notification';
import { LanguageEnum } from '../../shared/enum/language.enum';
import { KeyValueType } from '../../shared/type/key-value.type';
import { OptionInterface } from '../../shared/interface/option.interface';
import { RuntimeContactTypeByGroupInterface } from '../../shared/interface/runtime-contact-type-by-group.interface';
import { RuntimeFeatureTaskInterface } from '../../shared/interface/runtime-feature-task.interface';
import { RuntimeFeatureBrochureInterface } from '../../shared/interface/runtime-feature-brochure.interface';
import { RuntimeEventResetData } from '../../core-store/ui-runtime/actions/runtime-event-reset-data';
import { RuntimeFeatureAccountInterface } from '../../shared/interface/runtime-feature-account.interface';
import { RuntimeFeaturePortalInterface } from '../../shared/interface/runtime-feature-portal.interface';
import { RuntimeEventToggleBeta } from '../../core-store/ui-runtime/actions/runtime-event-toggle-beta';

@Injectable()
export class RuntimeService {

  /**
   * Require data debounce requests
   */
  private requireDataDebounce: number = 500;
  private requireDataTimer: number = 0;
  private requireDataKeys: RuntimeDataEnum[] = [];

  /**
   * Delay in seconds per key before requesting for updates from API
   */
  private requireDataDelay: {[key in RuntimeDataEnum]?: number} = {};

  /**
   * Constructor
   */
  constructor(
    private store$: Store<StateInterface>,
    private sessionStorageService: SessionStorageService,
  ) {

    this.requireDataDelay[RuntimeDataEnum.permissions] = DurationSecondsEnum.minute5;
    this.requireDataDelay[RuntimeDataEnum.optionBrokerSell] = DurationSecondsEnum.minute10;
    this.requireDataDelay[RuntimeDataEnum.optionBrokerRent] = DurationSecondsEnum.minute10;
    this.requireDataDelay[RuntimeDataEnum.optionBrokerColleague] = DurationSecondsEnum.minute10;
    this.requireDataDelay[RuntimeDataEnum.optionBrokerByAgency] = DurationSecondsEnum.minute10;
    this.requireDataDelay[RuntimeDataEnum.optionAgencyUser] = DurationSecondsEnum.minute10;
    this.requireDataDelay[RuntimeDataEnum.optionAgencyMls] = DurationSecondsEnum.minute10;
    this.requireDataDelay[RuntimeDataEnum.optionAgencyGroup] = DurationSecondsEnum.minute10;
    this.requireDataDelay[RuntimeDataEnum.optionEmailContent] = DurationSecondsEnum.minute10;
    this.requireDataDelay[RuntimeDataEnum.optionPublicationWebsite] = DurationSecondsEnum.hour1;
    this.requireDataDelay[RuntimeDataEnum.optionPublicationGateway] = DurationSecondsEnum.hour1;
    this.requireDataDelay[RuntimeDataEnum.feature] = DurationSecondsEnum.hour1;
    this.requireDataDelay[RuntimeDataEnum.agencyPreference] = DurationSecondsEnum.minute5;
  }

  /**
   * Return the key delay in seconds before requesting for updates
   */
  getRequireDataDelay(key: RuntimeDataEnum): number {

    // Custom delay or falls back to 24 hours delay
    return this.requireDataDelay[key] || DurationSecondsEnum.hour24;
  }

  /**
   * Dispatch a runtime notification
   */
  notification(type: NotificationTypeEnum, message: string): void {

    this.store$.dispatch(new RuntimeEventNotification({ type, message }));
  }

  /**
   * Select notification
   */
  selectNotification(): Observable<NotificationInterface|null> {

    return this.store$.select(selectUiNotification);
  }

  /**
   * Select true if all the keys are loaded, else select false
   */
  selectIsLoadedData(keys: RuntimeDataEnum[]): Observable<boolean> {

    return this.store$.select(selectUiIsLoadedData(keys));
  }

  /**
   * Select settings
   */
  selectSettings(): Observable<RuntimeSettingsInterface> {

    return this.store$.select(selectDataSettings);
  }

  /**
   * Select current language ID
   */
  selectCurrentLanguageId(): Observable<LanguageEnum> {

    return this.store$.select(selectDataLanguageCurrent);
  }

  /**
   * Select current language label
   */
  selectCurrentLanguageLabel(): Observable<string> {

    return this.store$.select(selectDataLanguageCurrentLabel);
  }

  /**
   * Select available languages
   */
  selectAvailableLanguages(): Observable<KeyValueType<LanguageEnum, string>> {

    return this.store$.select(selectDataLanguageAvailable);
  }

  /**
   * Select available language IDs
   */
  selectAvailableLanguageIds(): Observable<LanguageEnum[]> {

    return this.store$.select(selectDataLanguageAvailableIds);
  }

  /**
   * Select available language labels
   */
  selectAvailableLanguageLabels(): Observable<string[]> {

    return this.store$.select(selectDataLanguageAvailableLabels);
  }

  /**
   * Select agencies including MLS
   */
  selectAgenciesIncludingMls(): Observable<OptionInterface[]> {

    return this.store$.select(selectDataAgenciesIncludingMls);
  }

  /**
   * Select user preference
   */
  selectUserPreference(): Observable<RuntimeUserPreferenceInterface> {

    return this.store$.select(selectDataUserPreference);
  }

  /**
   * Select agency preference
   */
  selectAgencyPreference(): Observable<RuntimeAgencyPreferenceInterface> {

    return this.store$.select(selectDataAgencyPreference);
  }

  /**
   * Select authentication
   */
  selectAuthentication(): Observable<RuntimeAuthenticationInterface> {

    return this.store$.select(selectDataAuthentication);
  }

  /**
   * Select contact type by group
   */
  selectContactTypeByGroup(): Observable<RuntimeContactTypeByGroupInterface> {

    return this.store$.select(selectDataContactTypeByGroup);
  }

  /**
   * Select permissions
   */
  selectPermissions(): Observable<PermissionEnum[]> {

    return this.store$.select(selectDataPermissions);
  }

  /**
   * Select options
   */
  selectOptions(): Observable<RuntimeOptionsInterface> {

    return this.store$.select(this.getSelectorOptions());
  }

  /**
   * Select feature
   */
  selectFeature(): Observable<RuntimeFeatureInterface> {

    return this.store$.select(selectDataFeature);
  }

  /**
   * Select feature account
   */
  selectFeatureAccount(): Observable<RuntimeFeatureAccountInterface> {

    return this.store$.select(selectDataFeatureAccount);
  }

  /**
   * Select feature price
   */
  selectFeaturePrice(): Observable<RuntimeFeaturePriceInterface> {

    return this.store$.select(selectDataFeaturePrice);
  }

  /**
   * Select feature property
   */
  selectFeatureProperty(): Observable<RuntimeFeaturePropertyInterface> {

    return this.store$.select(selectDataFeatureProperty);
  }

  /**
   * Select feature lead
   */
  selectFeatureLead(): Observable<RuntimeFeatureLeadInterface> {

    return this.store$.select(selectDataFeatureLead);
  }

  /**
   * Select feature matching
   */
  selectFeatureMatching(): Observable<RuntimeFeatureMatchingInterface> {

    return this.store$.select(selectDataFeatureMatching);
  }

  /**
   * Select feature task
   */
  selectFeatureTask(): Observable<RuntimeFeatureTaskInterface> {

    return this.store$.select(selectDataFeatureTask);
  }

  /**
   * Select feature promotion
   */
  selectFeaturePromotion(): Observable<RuntimeFeaturePromotionInterface> {

    return this.store$.select(selectDataFeaturePromotion);
  }

  /**
   * Select feature fisher
   */
  selectFeatureFisher(): Observable<RuntimeFeatureFisherInterface> {

    return this.store$.select(selectDataFeatureFisher);
  }

  /**
   * Select feature brochure
   */
  selectFeatureBrochure(): Observable<RuntimeFeatureBrochureInterface> {

    return this.store$.select(selectDataFeatureBrochure);
  }

  /**
   * Select feature portal
   */
  selectFeaturePortal(): Observable<RuntimeFeaturePortalInterface> {

    return this.store$.select(selectDataFeaturePortal);
  }

  /**
   * Select contextual
   */
  selectContextual(): Observable<ContextualInterface> {

    return this.store$.select(selectUiContextual);
  }

  /**
   * Select preview image
   */
  selectPreviewImage(): Observable<PreviewImageInterface> {

    return this.store$.select(selectUiPreviewImage);
  }

  /**
   * Select data state
   */
  selectDataState(): Observable<DataRuntimeStateInterface> {

    return this.store$.select(selectDataState);
  }

  /**
   * Select data options
   */
  selectDataOptions(): Observable<RuntimeOptionsInterface> {

    return this.store$.select(selectDataOptions);
  }

  /**
   * Select data loaded timestamp
   */
  selectDataLoadedTimestamp(): Observable<{ [key in RuntimeDataEnum]?: number; }> {

    return this.store$.select(selectDataLoadedTimestamp);
  }

  /**
   * Return selector on options
   */
  getSelectorOptions(): MemoizedSelector<StateInterface, RuntimeOptionsInterface> {

    return selectDataOptions;
  }

  /**
   * Require runtime data and return an observable of the keys being loaded
   */
  requireData(keys: RuntimeDataEnum[]): Observable<boolean> {

    // Add keys that are not yet in queue
    this.requireDataKeys = this.requireDataKeys.concat(
      keys.filter(key => this.requireDataKeys.indexOf(key) === -1),
    );

    // No active timer
    if (this.requireDataTimer === 0) {

      this.requireDataTimer = setTimeout(() => {

        // Require the data
        this.store$.dispatch(
          new RuntimeEventRequireData({
            keys: this.requireDataKeys.slice(0),
          }),
        );

        // Reset queue keys
        this.requireDataKeys = [];
        this.requireDataTimer = 0;

      }, this.requireDataDebounce);
    }

    return this.selectIsLoadedData(keys);
  }

  /**
   * Load data from storage
   */
  fromStorage(): void {

    // Get runtime data from session storage
    const data = this.sessionStorageService.getItem(SessionStorageEnum.runtimeData);

    if (data) {

      try {

        const json = <DataRuntimeStateInterface>JSON.parse(data);

        this.store$.dispatch(
          new RuntimeEventLoadedData({ data: json, keys: [] }),
        );
      } catch (e) {}
    }
  }

  /**
   * Save data to storage
   */
  toStorage(data: DataRuntimeStateInterface): void {

    // Store settings in session storage
    this.sessionStorageService.setItem(SessionStorageEnum.runtimeData, JSON.stringify(data));
  }

  /**
   * Reset runtime data for keys
   */
  resetData(keys: RuntimeDataEnum[]): void {

    this.store$.dispatch(
      new RuntimeEventResetData({
        keys: keys,
      }),
    );
  }

  /**
   * Show contextual content identified by @uid, at position @x and @y
   */
  showContextual(uid: string, x: number, y: number): void {

    this.store$.dispatch(
      new RuntimeUpdateContextual({
        contextual: {
          uid: uid,
          position: {
            x,
            y,
          },
        },
      }),
    );
  }

  /**
   * Hide contextual content
   */
  hideContextual(): void {

    this
      .selectContextual()
      .pipe(
        take(1),
        filter(contextual => !!contextual.uid),
      )
      .subscribe(contextual => {

        this.store$.dispatch(
          new RuntimeUpdateContextual({
            contextual: {
              uid: '',
              position: {
                x: 0,
                y: 0,
              },
            },
          }),
        );
      });
  }

  /**
   * Toggle feature active state
   */
  toggleFeature(name: keyof RuntimeFeatureInterface): void {

    this.store$.dispatch(
      new RuntimeEventToggleFeature({ name }),
    );
  }

  /**
   * Toggle user preference 'beta' identified by @uid
   */
  toggleBeta(uid: string): void {

    this.store$.dispatch(
      new RuntimeEventToggleBeta({ uid }),
    );
  }

  /**
   * Display image preview at the given position
   */
  previewImage(url: string, position: PositionInterface): void {

    this.store$.dispatch(
      new RuntimeUpdatePreviewImage({
        previewImage: {
          url,
          position,
        },
      }),
    );
  }
}
