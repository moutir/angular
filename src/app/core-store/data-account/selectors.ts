import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { Dictionary } from 'app/shared/class/dictionary';

import { DataAccountStateInterface, FEATURE_NAME } from './state';
import { AccountModel } from '../../shared/model/account.model';

export const selectDataState: MemoizedSelector<object, DataAccountStateInterface>
  = createFeatureSelector<DataAccountStateInterface>(FEATURE_NAME);

export const selectDataAccounts: MemoizedSelector<object, Dictionary<AccountModel>> = createSelector(
  selectDataState,
  (state: DataAccountStateInterface) => state.models,
);

export const selectDataAccount = (id: string): MemoizedSelector<object, AccountModel|null> => createSelector(
  selectDataAccounts,
  (models: Dictionary<AccountModel>) => models[id] || null,
);
