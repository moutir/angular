import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { Dictionary } from 'app/shared/class/dictionary';

import { DataMarketingExpenseStateInterface, FEATURE_NAME } from './state';
import { MarketingExpenseModel } from '../../shared/model/marketing-expense.model';

export const selectDataState: MemoizedSelector<object, DataMarketingExpenseStateInterface>
  = createFeatureSelector<DataMarketingExpenseStateInterface>(FEATURE_NAME);

export const selectDataMarketingExpenses: MemoizedSelector<object, Dictionary<MarketingExpenseModel>> = createSelector(
  selectDataState,
  (state: DataMarketingExpenseStateInterface) => state.models,
);

export const selectDataMarketingExpense = (id: string): MemoizedSelector<object, MarketingExpenseModel|null> => createSelector(
  selectDataMarketingExpenses,
  (models: Dictionary<MarketingExpenseModel>) => models[id] || null,
);
