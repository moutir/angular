import { createFeatureSelector, MemoizedSelector } from '@ngrx/store';

import { FEATURE_NAME, UiSuggestionStateInterface } from './state';

/**
 * Select the module's state
 */
export const selectUiState: MemoizedSelector<object, UiSuggestionStateInterface>
  = createFeatureSelector<UiSuggestionStateInterface>(FEATURE_NAME);
