import { createFeatureSelector, MemoizedSelector } from '@ngrx/store';

import { FEATURE_NAME, UiReportingStateInterface } from './state';

/**
 * Select the module's state
 */
export const selectUiState: MemoizedSelector<object, UiReportingStateInterface>
  = createFeatureSelector<UiReportingStateInterface>(FEATURE_NAME);
