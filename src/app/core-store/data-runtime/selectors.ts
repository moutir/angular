import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { DataRuntimeStateInterface, FEATURE_NAME } from './state';
import { RuntimeOptionsInterface } from '../../shared/interface/runtime-options.interface';
import { PermissionEnum } from '../../shared/enum/permission.enum';
import { RuntimeAuthenticationInterface } from '../../shared/interface/runtime-authentication.interface';
import { RuntimeFeatureMatchingInterface } from '../../shared/interface/runtime-feature-matching.interface';
import { RuntimeFeaturePropertyInterface } from '../../shared/interface/runtime-feature-property.interface';
import { RuntimeFeatureLeadInterface } from '../../shared/interface/runtime-feature-lead.interface';
import { RuntimeFeatureInterface } from '../../shared/interface/runtime-feature.interface';
import { RuntimeSettingsInterface } from '../../shared/interface/runtime-settings.interface';
import { RuntimeDataEnum } from '../../shared/enum/runtime-data.enum';
import { RuntimeFeaturePromotionInterface } from '../../shared/interface/runtime-feature-promotion.interface';
import { RuntimeFeatureFisherInterface } from '../../shared/interface/runtime-feature-fisher.interface';
import { RuntimeUserPreferenceInterface } from '../../shared/interface/runtime-user-preference.interface';
import { RuntimeAgencyPreferenceInterface } from '../../shared/interface/runtime-agency-preference.interface';
import { RuntimeFeatureTaskInterface } from '../../shared/interface/runtime-feature-task.interface';
import { RuntimeFeatureContactInterface } from '../../shared/interface/runtime-feature-contact.interface';
import { RuntimeFeaturePriceInterface } from '../../shared/interface/runtime-feature-price.interface';
import { RuntimeFeatureReportingInterface } from '../../shared/interface/runtime-feature-reporting.interface';
import { RuntimeFeatureReportInterface } from '../../shared/interface/runtime-feature-report.interface';
import { LanguageEnum } from '../../shared/enum/language.enum';
import { OptionInterface } from '../../shared/interface/option.interface';
import { KeyValueType } from '../../shared/type/key-value.type';
import { RuntimeContactTypeByGroupInterface } from '../../shared/interface/runtime-contact-type-by-group.interface';
import { MapSettingsInterface } from '../../shared/interface/map-settings.interface';
import { PolygonSettingsInterface } from '../../shared/interface/polygon-settings.interface';
import { RuntimeFeatureBrochureInterface } from '../../shared/interface/runtime-feature-brochure.interface';
import { RuntimeFeatureRestrictionInterface } from '../../shared/interface/runtime-feature-restriction.interface';
import { RuntimeFeatureAccountInterface } from '../../shared/interface/runtime-feature-account.interface';
import { RuntimeFeaturePortalInterface } from '../../shared/interface/runtime-feature-portal.interface';

/**
 * Select the module's state
 */
export const selectDataState: MemoizedSelector<object, DataRuntimeStateInterface>
  = createFeatureSelector<DataRuntimeStateInterface>(FEATURE_NAME);

/**
 * Select loaded timestamp
 */
export const selectDataLoadedTimestamp = createSelector(
  selectDataState,
  (state: DataRuntimeStateInterface): { [key in RuntimeDataEnum]?: number; } => state.loadedTimestamp,
);

/**
 * Select settings
 */
export const selectDataSettings = createSelector(
  selectDataState,
  (state: DataRuntimeStateInterface): RuntimeSettingsInterface => state.settings,
);

/**
 * Select current language ID
 */
export const selectDataLanguageCurrent = createSelector(
  selectDataSettings,
  (settings: RuntimeSettingsInterface): LanguageEnum => settings.language.current,
);

/**
 * Select current language label
 */
export const selectDataLanguageCurrentLabel = createSelector(
  selectDataSettings,
  (settings: RuntimeSettingsInterface): string => settings.language.available[settings.language.current],
);

/**
 * Select available languages
 */
export const selectDataLanguageAvailable = createSelector(
  selectDataSettings,
  (settings: RuntimeSettingsInterface): KeyValueType<LanguageEnum, string> => settings.language.available,
);

/**
 * Select available language IDs
 */
export const selectDataLanguageAvailableIds = createSelector(
  selectDataLanguageAvailable,
  (languages: KeyValueType<LanguageEnum, string>): LanguageEnum[] => <LanguageEnum[]>Object.keys(languages),
);

/**
 * Select available language labels
 */
export const selectDataLanguageAvailableLabels = createSelector(
  selectDataLanguageAvailable,
  (languages: KeyValueType<LanguageEnum, string>): string[] => Object.values(languages),
);

/**
 * Select user preference
 */
export const selectDataUserPreference = createSelector(
  selectDataState,
  (state: DataRuntimeStateInterface): RuntimeUserPreferenceInterface => state.userPreference,
);

/**
 * Select agency preference
 */
export const selectDataAgencyPreference = createSelector(
  selectDataState,
  (state: DataRuntimeStateInterface): RuntimeAgencyPreferenceInterface => state.agencyPreference,
);

/**
 * Select contact type by group
 */
export const selectDataContactTypeByGroup = createSelector(
  selectDataState,
  (state: DataRuntimeStateInterface): RuntimeContactTypeByGroupInterface => state.contactTypeByGroup,
);

/**
 * Select default map settings
 */
export const selectDataMap = createSelector(
  selectDataSettings,
  (settings: RuntimeSettingsInterface): MapSettingsInterface => settings.map,
);

/**
 * Select default polygon settings
 */
export const selectDataPolygon = createSelector(
  selectDataSettings,
  (settings: RuntimeSettingsInterface): PolygonSettingsInterface => settings.polygon,
);

/**
 * Select authentication
 */
export const selectDataAuthentication = createSelector(
  selectDataState,
  (state: DataRuntimeStateInterface): RuntimeAuthenticationInterface => state.authentication,
);

/**
 * Select options
 */
export const selectDataOptions = createSelector(
  selectDataState,
  (state: DataRuntimeStateInterface): RuntimeOptionsInterface => state.options,
);

/**
 * Select permissions
 */
export const selectDataPermissions = createSelector(
  selectDataState,
  (state: DataRuntimeStateInterface): PermissionEnum[] => state.permissions,
);

/**
 * Select feature
 */
export const selectDataFeature = createSelector(
  selectDataState,
  (state: DataRuntimeStateInterface): RuntimeFeatureInterface => state.feature,
);

/**
 * Select feature account
 */
export const selectDataFeatureAccount = createSelector(
  selectDataState,
  (state: DataRuntimeStateInterface): RuntimeFeatureAccountInterface => state.featureAccount,
);

/**
 * Select feature price
 */
export const selectDataFeaturePrice = createSelector(
  selectDataState,
  (state: DataRuntimeStateInterface): RuntimeFeaturePriceInterface => state.featurePrice,
);

/**
 * Select feature property
 */
export const selectDataFeatureProperty = createSelector(
  selectDataState,
  (state: DataRuntimeStateInterface): RuntimeFeaturePropertyInterface => state.featureProperty,
);

/**
 * Select feature lead
 */
export const selectDataFeatureLead = createSelector(
  selectDataState,
  (state: DataRuntimeStateInterface): RuntimeFeatureLeadInterface => state.featureLead,
);

/**
 * Select feature reporting
 */
export const selectDataFeatureReporting = createSelector(
  selectDataState,
  (state: DataRuntimeStateInterface): RuntimeFeatureReportingInterface => state.featureReporting,
);

/**
 * Select feature matching
 */
export const selectDataFeatureMatching = createSelector(
  selectDataState,
  (state: DataRuntimeStateInterface): RuntimeFeatureMatchingInterface => state.featureMatching,
);

/**
 * Select feature promotion
 */
export const selectDataFeaturePromotion = createSelector(
  selectDataState,
  (state: DataRuntimeStateInterface): RuntimeFeaturePromotionInterface => state.featurePromotion,
);

/**
 * Select feature fisher
 */
export const selectDataFeatureFisher = createSelector(
  selectDataState,
  (state: DataRuntimeStateInterface): RuntimeFeatureFisherInterface => state.featureFisher,
);

/**
 * Select feature task
 */
export const selectDataFeatureTask = createSelector(
  selectDataState,
  (state: DataRuntimeStateInterface): RuntimeFeatureTaskInterface => state.featureTask,
);

/**
 * Select feature contact
 */
export const selectDataFeatureContact = createSelector(
  selectDataState,
  (state: DataRuntimeStateInterface): RuntimeFeatureContactInterface => state.featureContact,
);

/**
 * Select feature report
 */
export const selectDataFeatureReport = createSelector(
  selectDataState,
  (state: DataRuntimeStateInterface): RuntimeFeatureReportInterface => state.featureReport,
);

/**
 * Select feature brochure
 */
export const selectDataFeatureBrochure = createSelector(
  selectDataState,
  (state: DataRuntimeStateInterface): RuntimeFeatureBrochureInterface => state.featureBrochure,
);

/**
 * Select feature restriction
 */
export const selectDataFeatureRestriction = createSelector(
  selectDataState,
  (state: DataRuntimeStateInterface): RuntimeFeatureRestrictionInterface => state.featureRestriction,
);

/**
 * Select feature portal
 */
export const selectDataFeaturePortal = createSelector(
  selectDataState,
  (state: DataRuntimeStateInterface): RuntimeFeaturePortalInterface => state.featurePortal,
);

/**
 * Select agencies including MLS
 */
export const selectDataAgenciesIncludingMls = createSelector(
  selectDataOptions,
  (options: RuntimeOptionsInterface): OptionInterface[] => {

    let agencies: OptionInterface[] = [];

    // Agencies
    if (options.agencyGroup.length > 0 || options.agencyMls.length > 0) {

      // My agency
      agencies.push({
        value: options.agencyUser.value,
        text: options.agencyUser.text,
      });

      // Agencies from the group
      if (options.agencyGroup.length > 0) {

        agencies.push({
          value: options.agencyGroupAll.value,
          text: options.agencyGroupAll.text,
        });
        agencies = agencies.concat(options.agencyGroup);
      }

      // MLS agencies
      if (options.agencyMls.length > 0) {

        agencies.push({
          value: options.agencyMlsAll.value,
          text: options.agencyMlsAll.text,
        });
        agencies = agencies.concat(options.agencyMls);
      }
    }

    return agencies;
  },
);
