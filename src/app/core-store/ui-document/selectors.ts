import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { FEATURE_NAME, UiDocumentStateInterface } from './state';
import { StateInterface } from '../state.interface';
import { DocumentInterface } from '../../shared/interface/document.interface';

/**
 * Select the module's state
 */
export const selectUiState: MemoizedSelector<StateInterface, UiDocumentStateInterface>
  = createFeatureSelector<UiDocumentStateInterface>(FEATURE_NAME);

/**
 * Select document linked to UID
 */
export const selectUiDocument = (uid: string): MemoizedSelector<StateInterface, DocumentInterface> => createSelector(
  selectUiState,
  (state: UiDocumentStateInterface): DocumentInterface => state[uid],
);

/**
 * Select the loading state
 */
export const selectUiIsLoading = (uid: string): MemoizedSelector<StateInterface, boolean> => createSelector(
  selectUiDocument(uid),
  (document: DocumentInterface): boolean => document.isLoading,
);
