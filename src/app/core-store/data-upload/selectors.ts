import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { DataUploadStateInterface, FEATURE_NAME } from './state';
import { UploadModel } from '../../shared/model/upload.model';
import { UploadStatusEnum } from '../../shared/enum/upload-status.enum';
import { Dictionary } from '../../shared/class/dictionary';

export const selectDataState: MemoizedSelector<object, DataUploadStateInterface>
  = createFeatureSelector<DataUploadStateInterface>(FEATURE_NAME);

export const selectDataUploads: MemoizedSelector<object, Dictionary<UploadModel>> = createSelector(
  selectDataState,
  (state: DataUploadStateInterface) => state.models,
);

export const selectDataUpload = (id: string): MemoizedSelector<object, UploadModel|null> => createSelector(
  selectDataUploads,
  (models: Dictionary<UploadModel>) => models[id] || null,
);

/**
 * Select all uploads
 */
export const selectDataUploadList: MemoizedSelector<object, UploadModel[]> = createSelector(
  selectDataState,
  (state: DataUploadStateInterface) => Object.keys(state.models).map(id => state.models[id]),
);

/**
 * Select ongoing uploads
 */
export const selectDataUploadsProgressing = createSelector(
  selectDataUploadList,
  (uploads: UploadModel[]) => uploads.filter(u => u.status === UploadStatusEnum.progressing),
);

/**
 * Select by uploader ID state
 */
export const selectDataByUploaderId: MemoizedSelector<object, Dictionary<string[]>> = createSelector(
  selectDataState,
  (state: DataUploadStateInterface) => state.byUploaderId,
);
