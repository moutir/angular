import { createFeatureSelector, MemoizedSelector } from '@ngrx/store';

import { FEATURE_NAME, UiMatchingStateInterface } from './state';

/**
 * Select the module's state
 */
export const selectUiState: MemoizedSelector<object, UiMatchingStateInterface>
  = createFeatureSelector<UiMatchingStateInterface>(FEATURE_NAME);
