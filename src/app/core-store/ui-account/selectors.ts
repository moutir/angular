import { createFeatureSelector, MemoizedSelector } from '@ngrx/store';

import { FEATURE_NAME, UiAccountStateInterface } from './state';

/**
 * Select the module's state
 */
export const selectUiState: MemoizedSelector<object, UiAccountStateInterface>
  = createFeatureSelector<UiAccountStateInterface>(FEATURE_NAME);
