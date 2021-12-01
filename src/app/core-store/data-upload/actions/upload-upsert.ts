import { FEATURE_NAME } from '../state';
import { UploadModel } from '../../../shared/model/upload.model';
import { UpsertAbstract } from '../../upsert.abstract';
import { DataStateInterface } from '../../data-state.interface';

export class UploadUpsert extends UpsertAbstract<UploadModel, DataStateInterface<UploadModel>> {
  static readonly TYPE: string = FEATURE_NAME + ': upsert';
  readonly type: string = UploadUpsert.TYPE;
}
