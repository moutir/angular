import { createFeatureSelector, MemoizedSelector } from '@ngrx/store';

import { FEATURE_NAME, UiGalleryStateInterface } from './state';

/**
 * Select the module's state
 */
export const selectUiState: MemoizedSelector<object, UiGalleryStateInterface>
  = createFeatureSelector<UiGalleryStateInterface>(FEATURE_NAME);
