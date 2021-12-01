import { createFeatureSelector, MemoizedSelector } from '@ngrx/store';

import { FEATURE_NAME, UiSectorStateInterface } from './state';

/**
 * Select the module's state
 */
export const selectUiState: MemoizedSelector<object, UiSectorStateInterface>
  = createFeatureSelector<UiSectorStateInterface>(FEATURE_NAME);
