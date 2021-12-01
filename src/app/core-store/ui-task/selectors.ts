import { createFeatureSelector, MemoizedSelector } from '@ngrx/store';

import { FEATURE_NAME, UiTaskStateInterface } from './state';

/**
 * Select the module's state
 */
export const selectUiState: MemoizedSelector<object, UiTaskStateInterface>
  = createFeatureSelector<UiTaskStateInterface>(FEATURE_NAME);
