import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { DataAgencyStateInterface, FEATURE_NAME } from './state';
import { AgencyModel } from '../../shared/model/agency.model';
import { Dictionary } from '../../shared/class/dictionary';

export const selectDataState: MemoizedSelector<object, DataAgencyStateInterface>
  = createFeatureSelector<DataAgencyStateInterface>(FEATURE_NAME);

export const selectDataAgencies: MemoizedSelector<object, Dictionary<AgencyModel>> = createSelector(
  selectDataState,
  (state: DataAgencyStateInterface) => state.models,
);

export const selectDataAgency = (id: string): MemoizedSelector<object, AgencyModel|null> => createSelector(
  selectDataAgencies,
  (models: Dictionary<AgencyModel>) => models[id] || null,
);
