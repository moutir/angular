import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { Dictionary } from 'app/shared/class/dictionary';

import { DataMatchingGroupStateInterface, FEATURE_NAME } from './state';
import { MatchingGroupModel } from '../../shared/model/matching-group.model';

export const selectDataState: MemoizedSelector<object, DataMatchingGroupStateInterface>
  = createFeatureSelector<DataMatchingGroupStateInterface>(FEATURE_NAME);

export const selectDataMatchingGroups: MemoizedSelector<object, Dictionary<MatchingGroupModel>> = createSelector(
  selectDataState,
  (state: DataMatchingGroupStateInterface) => state.models,
);

export const selectDataMatchingGroup = (id: string): MemoizedSelector<object, MatchingGroupModel|null> => createSelector(
  selectDataMatchingGroups,
  (models: Dictionary<MatchingGroupModel>) => models[id] || null,
);
