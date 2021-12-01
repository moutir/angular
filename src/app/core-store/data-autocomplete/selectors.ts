import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { DataAutocompleteStateInterface, FEATURE_NAME } from './state';
import { StateInterface } from '../state.interface';
import { AutocompleteOptionsInterface } from '../../shared/interface/autocomplete-options.interface';
import { AutocompleteDataInterface } from '../../shared/interface/autocomplete-data.interface';

export const selectDataState: MemoizedSelector<StateInterface, DataAutocompleteStateInterface>
  = createFeatureSelector<DataAutocompleteStateInterface>(FEATURE_NAME);

/**
 * Select suggestions
 */
export const selectDataAutocompleteSuggestions = createSelector(
  selectDataState,
  (state: DataAutocompleteStateInterface): { [hash: string]: AutocompleteDataInterface[]; } => state.suggestions,
);

/**
 * Select options
 */
export const selectDataAutocompleteOptions = createSelector(
  selectDataState,
  (state: DataAutocompleteStateInterface): AutocompleteOptionsInterface => state.options,
);
