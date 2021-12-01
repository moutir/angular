import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { FEATURE_NAME, UiRuntimeStateInterface } from './state';
import { NotificationInterface } from '../../shared/interface/notification.interface';
import { ContextualInterface } from '../../shared/interface/contextual.interface';
import { PreviewImageInterface } from '../../shared/interface/preview-image.interface';
import { RuntimeDataEnum } from '../../shared/enum/runtime-data.enum';
import { selectDataLoadedTimestamp } from '../data-runtime/selectors';

/**
 * Select the module's state
 */
export const selectUiState: MemoizedSelector<object, UiRuntimeStateInterface>
  = createFeatureSelector<UiRuntimeStateInterface>(FEATURE_NAME);

/**
 * Select the notification
 */
export const selectUiNotification = createSelector(
  selectUiState,
  (state: UiRuntimeStateInterface): NotificationInterface|null => state.notification,
);

/**
 * Select the contextual state
 */
export const selectUiContextual = createSelector(
  selectUiState,
  (state: UiRuntimeStateInterface): ContextualInterface => state.contextual,
);

/**
 * Select the preview image state
 */
export const selectUiPreviewImage = createSelector(
  selectUiState,
  (state: UiRuntimeStateInterface): PreviewImageInterface => state.previewImage,
);

/**
 * Select true if all keys are loaded
 */
export const selectUiIsLoadedData = (keys: RuntimeDataEnum[]) => createSelector(
  selectDataLoadedTimestamp,
  (loadedTimestamp: { [key in RuntimeDataEnum]?: number; }): boolean => keys.every(key => loadedTimestamp.hasOwnProperty(key)));
