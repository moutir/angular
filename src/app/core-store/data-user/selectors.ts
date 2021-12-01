import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { Dictionary } from 'app/shared/class/dictionary';

import { DataUserStateInterface, FEATURE_NAME } from './state';
import { UserModel } from '../../shared/model/user.model';

export const selectDataState: MemoizedSelector<object, DataUserStateInterface>
  = createFeatureSelector<DataUserStateInterface>(FEATURE_NAME);

export const selectDataUsers: MemoizedSelector<object, Dictionary<UserModel>> = createSelector(
  selectDataState,
  (state: DataUserStateInterface) => state.models,
);

export const selectDataUser = (id: string): MemoizedSelector<object, UserModel|null> => createSelector(
  selectDataUsers,
  (models: Dictionary<UserModel>) => models[id] || null,
);
