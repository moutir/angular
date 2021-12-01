import { createFeatureSelector, MemoizedSelector } from '@ngrx/store';

import { FEATURE_NAME, UiContractStateInterface } from './state';

/**
 * Select the module's state
 */
export const selectUiState: MemoizedSelector<object, UiContractStateInterface>
  = createFeatureSelector<UiContractStateInterface>(FEATURE_NAME);
