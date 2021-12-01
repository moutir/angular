import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { DataMlsStateInterface, FEATURE_NAME } from './state';
import { MlsModel } from '../../shared/model/mls.model';
import { Dictionary } from '../../shared/class/dictionary';
import { AgencyModel } from '../../shared/model/agency.model';

export const selectDataState: MemoizedSelector<object, DataMlsStateInterface>
  = createFeatureSelector<DataMlsStateInterface>(FEATURE_NAME);

export const selectDataMlsPartnerships: MemoizedSelector<object, Dictionary<MlsModel>> = createSelector(
  selectDataState,
  (state: DataMlsStateInterface) => state.models,
);

export const selectDataMlsPartnership = (id: string): MemoizedSelector<object, MlsModel|null> => createSelector(
  selectDataMlsPartnerships,
  (models: Dictionary<MlsModel>) => models[id] || null,
);

export const selectDataMlsAgencies: MemoizedSelector<object, AgencyModel[]> = createSelector(
  selectDataState,
  (state: DataMlsStateInterface) => state.agencies,
);
