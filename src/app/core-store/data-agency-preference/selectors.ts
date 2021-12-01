import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { Dictionary } from 'app/shared/class/dictionary';

import { DataAgencyPreferenceStateInterface, FEATURE_NAME } from './state';
import { AgencyPreferenceModel } from '../../shared/model/agency-preference.model';

export const selectDataState: MemoizedSelector<object, DataAgencyPreferenceStateInterface>
  = createFeatureSelector<DataAgencyPreferenceStateInterface>(FEATURE_NAME);

export const selectDataAgencyPreferences: MemoizedSelector<object, Dictionary<AgencyPreferenceModel>> = createSelector(
  selectDataState,
  (state: DataAgencyPreferenceStateInterface) => state.models,
);

export const selectDataAgencyPreference = (id: string): MemoizedSelector<object, AgencyPreferenceModel|null> => createSelector(
  selectDataAgencyPreferences,
  (models: Dictionary<AgencyPreferenceModel>) => models[id] || null,
);
