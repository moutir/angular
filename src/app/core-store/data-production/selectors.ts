import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { DataProductionStateInterface, FEATURE_NAME } from './state';
import { ProductionFrequencyInterface } from '../../shared/interface/production-frequency.interface';

export const selectDataState: MemoizedSelector<object, DataProductionStateInterface>
  = createFeatureSelector<DataProductionStateInterface>(FEATURE_NAME);

/**
 * Select production by frequency
 */
export const selectDataByFrequency: MemoizedSelector<object, ProductionFrequencyInterface> = createSelector(
  selectDataState,
  (state: DataProductionStateInterface) => state.byFrequency,
);
