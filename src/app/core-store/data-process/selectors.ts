import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { Dictionary } from 'app/shared/class/dictionary';

import { DataProcessStateInterface, FEATURE_NAME } from './state';
import { ProcessModel } from '../../shared/model/process.model';

export const selectDataState: MemoizedSelector<object, DataProcessStateInterface>
  = createFeatureSelector<DataProcessStateInterface>(FEATURE_NAME);

export const selectDataProcesss: MemoizedSelector<object, Dictionary<ProcessModel>> = createSelector(
  selectDataState,
  (state: DataProcessStateInterface) => state.models,
);

export const selectDataProcess = (id: string): MemoizedSelector<object, ProcessModel|null> => createSelector(
  selectDataProcesss,
  (models: Dictionary<ProcessModel>) => models[id] || null,
);
