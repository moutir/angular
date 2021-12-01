import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { DataHistoryStateInterface, FEATURE_NAME } from './state';
import { HistoryModel } from '../../shared/model/history.model';
import { Dictionary } from '../../shared/class/dictionary';

export const selectDataState: MemoizedSelector<object, DataHistoryStateInterface>
  = createFeatureSelector<DataHistoryStateInterface>(FEATURE_NAME);

export const selectDataHistories: MemoizedSelector<object, Dictionary<HistoryModel>> = createSelector(
  selectDataState,
  (state: DataHistoryStateInterface) => state.models,
);

export const selectDataHistory = (id: string): MemoizedSelector<object, HistoryModel|null> => createSelector(
  selectDataHistories,
  (models: Dictionary<HistoryModel>) => models[id] || null,
);

/**
 * Select byEntityHash
 */
export const selectDataByEntityHash: MemoizedSelector<object, Dictionary<string[]>> = createSelector(
  selectDataState,
  (state: DataHistoryStateInterface) => state.byEntityHash,
);
