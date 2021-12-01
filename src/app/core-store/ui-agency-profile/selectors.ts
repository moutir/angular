import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { FEATURE_NAME, UiAgencyProfileStateInterface } from './state';
import { StateInterface } from '../state.interface';
import { AgencyEmailPreviewInterface } from '../../shared/interface/agency-email-preview.interface';

/**
 * Select the module's state
 */
export const selectUiState: MemoizedSelector<object, UiAgencyProfileStateInterface>
  = createFeatureSelector<UiAgencyProfileStateInterface>(FEATURE_NAME);

/**
 * Select preview
 */
export const selectUiEmailPreview: MemoizedSelector<StateInterface, AgencyEmailPreviewInterface> = createSelector(
  selectUiState,
  (state: UiAgencyProfileStateInterface): AgencyEmailPreviewInterface => state.emailPreview,
);
