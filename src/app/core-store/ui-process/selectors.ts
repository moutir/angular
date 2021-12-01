import { createFeatureSelector, MemoizedSelector } from '@ngrx/store';

import { FEATURE_NAME, UiProcessStateInterface } from './state';

/**
 * Select the module's state
 */
export const selectUiState: MemoizedSelector<object, UiProcessStateInterface>
  = createFeatureSelector<UiProcessStateInterface>(FEATURE_NAME);
