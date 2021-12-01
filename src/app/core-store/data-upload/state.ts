import { UploadModel } from '../../shared/model/upload.model';
import { DataStateInterface } from '../data-state.interface';
import { Dictionary } from '../../shared/class/dictionary';

export const FEATURE_NAME = 'data-upload';

export interface DataUploadStateInterface extends DataStateInterface<UploadModel> {

  // Upload IDs per uploader ID
  byUploaderId: Dictionary<string[]>;
}

export const initialState: DataUploadStateInterface = {
  models: {},
  byUploaderId: {},
};
