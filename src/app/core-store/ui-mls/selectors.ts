import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { StateInterface } from '../state.interface';
import { FEATURE_NAME, UiMlsStateInterface } from './state';
import { AgencyModel } from '../../shared/model/agency.model';

/**
 * Select the module's state
 */
export const selectUiState: MemoizedSelector<object, UiMlsStateInterface>
  = createFeatureSelector<UiMlsStateInterface>(FEATURE_NAME);

/**
 * Select search query
 */
export const selectUiSearchQuery: MemoizedSelector<StateInterface, string> = createSelector(
  selectUiState,
  (state: UiMlsStateInterface): string => state.searchQuery,
);

/**
 * Select the selected agency
 */
export const selectUiSelectedAgency: MemoizedSelector<StateInterface, AgencyModel> = createSelector(
  selectUiState,
  (state: UiMlsStateInterface): AgencyModel => state.selectedAgency,
);

/**
 * Select agency loading state
 */
 export const selectUiIsLoadingAgency: MemoizedSelector<StateInterface, boolean> = createSelector(
  selectUiState,
  (state: UiMlsStateInterface): boolean => state.isLoadingAgency,
);
