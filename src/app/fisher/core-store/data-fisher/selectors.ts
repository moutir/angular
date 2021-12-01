import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { DataFisherStateInterface, FEATURE_NAME } from './state';
import { FisherModel } from '../../shared/model/fisher.model';

export const selectDataState: MemoizedSelector<object, DataFisherStateInterface>
  = createFeatureSelector<DataFisherStateInterface>(FEATURE_NAME);

export const selectDataFisher: MemoizedSelector<object, FisherModel|null> = createSelector(
  selectDataState,
  (
    state: DataFisherStateInterface,
  ) => state.fisher || null,
);
