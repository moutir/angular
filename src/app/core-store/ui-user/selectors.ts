import { createFeatureSelector, MemoizedSelector } from '@ngrx/store';

import { FEATURE_NAME, UiUserStateInterface } from './state';

/**
 * Select the module's state
 */
export const selectUiState: MemoizedSelector<object, UiUserStateInterface>
  = createFeatureSelector<UiUserStateInterface>(FEATURE_NAME);
