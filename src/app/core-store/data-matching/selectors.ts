import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { Dictionary } from 'app/shared/class/dictionary';

import { DataMatchingStateInterface, FEATURE_NAME } from './state';
import { MatchingModel } from '../../shared/model/matching.model';

export const selectDataState: MemoizedSelector<object, DataMatchingStateInterface>
  = createFeatureSelector<DataMatchingStateInterface>(FEATURE_NAME);

export const selectDataMatchings: MemoizedSelector<object, Dictionary<MatchingModel>> = createSelector(
  selectDataState,
  (state: DataMatchingStateInterface) => state.models,
);

export const selectDataMatching = (id: string): MemoizedSelector<object, MatchingModel|null> => createSelector(
  selectDataMatchings,
  (models: Dictionary<MatchingModel>) => models[id] || null,
);
