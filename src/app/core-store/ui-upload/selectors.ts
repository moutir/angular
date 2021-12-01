import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { FEATURE_NAME, UiUploadStateInterface } from './state';
import { StateInterface } from '../state.interface';
import { UploadModel } from '../../shared/model/upload.model';
import { selectDataByUploaderId, selectDataUploads } from '../data-upload/selectors';
import { Dictionary } from '../../shared/class/dictionary';

/**
 * Select the module's state
 */
export const selectUiState: MemoizedSelector<StateInterface, UiUploadStateInterface>
  = createFeatureSelector<UiUploadStateInterface>(FEATURE_NAME);

/**
 * Select the upload bar fold status
 */
export const selectUiIsFoldedStatusBar = createSelector(
  selectUiState,
  (state: UiUploadStateInterface) => state.isFoldedStatusBar,
);

/**
 * Select the uploads for uploader UID
 */
export const selectUiUploads = (uid: string): MemoizedSelector<StateInterface, UploadModel[]> => createSelector(
  selectDataUploads,
  selectDataByUploaderId,
  (
    uploads: Dictionary<UploadModel>,
    byUploaderId: Dictionary<string[]>,
  ): UploadModel[] => {

    return (byUploaderId[uid] || []).map(id => uploads[id] || new UploadModel());
  },
);
