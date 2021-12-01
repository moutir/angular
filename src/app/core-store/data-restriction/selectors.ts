import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { Dictionary } from 'app/shared/class/dictionary';

import { DataRestrictionStateInterface, FEATURE_NAME } from './state';
import { RestrictionModel } from '../../shared/model/restriction.model';

export const selectDataState: MemoizedSelector<object, DataRestrictionStateInterface>
  = createFeatureSelector<DataRestrictionStateInterface>(FEATURE_NAME);

export const selectDataRestrictions: MemoizedSelector<object, Dictionary<RestrictionModel>> = createSelector(
  selectDataState,
  (state: DataRestrictionStateInterface) => state.models,
);

export const selectDataRestriction = (id: string): MemoizedSelector<object, RestrictionModel|null> => createSelector(
  selectDataRestrictions,
  (models: Dictionary<RestrictionModel>) => models[id] || null,
);
