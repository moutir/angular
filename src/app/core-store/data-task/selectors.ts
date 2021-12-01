import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { Dictionary } from 'app/shared/class/dictionary';

import { DataTaskStateInterface, FEATURE_NAME } from './state';
import { TaskModel } from '../../shared/model/task.model';

export const selectDataState: MemoizedSelector<object, DataTaskStateInterface>
  = createFeatureSelector<DataTaskStateInterface>(FEATURE_NAME);

export const selectDataTasks: MemoizedSelector<object, Dictionary<TaskModel>> = createSelector(
  selectDataState,
  (state: DataTaskStateInterface) => state.models,
);

export const selectDataTask = (id: string): MemoizedSelector<object, TaskModel|null> => createSelector(
  selectDataTasks,
  (models: Dictionary<TaskModel>) => models[id] || null,
);
