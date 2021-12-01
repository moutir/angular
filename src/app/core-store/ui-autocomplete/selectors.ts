import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { FEATURE_NAME, UiAutocompleteStateInterface } from './state';
import { StateInterface } from '../state.interface';
import { selectDataAutocompleteOptions, selectDataAutocompleteSuggestions } from '../data-autocomplete/selectors';
import { UiAutocompleteInterface } from './ui-autocomplete.interface';
import { AutocompleteSuggestionInterface } from '../../shared/interface/autocomplete-suggestion.interface';
import { AutocompleteDataInterface } from '../../shared/interface/autocomplete-data.interface';
import { AutocompleteOptionsInterface } from '../../shared/interface/autocomplete-options.interface';

/**
 * Select the module's state
 */
export const selectUiState: MemoizedSelector<StateInterface, UiAutocompleteStateInterface>
  = createFeatureSelector<UiAutocompleteStateInterface>(FEATURE_NAME);

/**
 * Select the loading state
 */
export const selectUiIsLoading = (uid: string): MemoizedSelector<StateInterface, boolean> => createSelector(
  selectUiAutocomplete(uid),
  (autocomplete: UiAutocompleteInterface): boolean => autocomplete.isLoading,
);

/**
 * Select the hash
 */
export const selectUiHash = (uid: string): MemoizedSelector<StateInterface, string> => createSelector(
  selectUiAutocomplete(uid),
  (autocomplete: UiAutocompleteInterface): string => autocomplete.hash,
);

/**
 * Select autocomplete linked to UID
 */
export const selectUiAutocomplete = (uid: string): MemoizedSelector<StateInterface, UiAutocompleteInterface> => createSelector(
  selectUiState,
  (state: UiAutocompleteStateInterface): UiAutocompleteInterface => state[uid],
);

/**
 * Select suggestions linked to UID
 */
export const selectUiSuggestions = (uid: string): MemoizedSelector<StateInterface, AutocompleteSuggestionInterface[]> => createSelector(
  selectDataAutocompleteOptions,
  selectDataAutocompleteSuggestions,
  selectUiHash(uid),
  (
    options: AutocompleteOptionsInterface,
    suggestions: { [hash: string]: AutocompleteDataInterface[]; },
    hash: string,
  ): AutocompleteSuggestionInterface[]|[] => {

    if (!suggestions[hash]) {

      return [];
    }

    // For each suggestion
    return suggestions[hash].map(suggestion => {

      // Generate options list based on suggestion's values
      return {
        entity: suggestion.entity,
        options: suggestion.values.map(value => options[suggestion.entity][value]),
      };
    });
  },
);
